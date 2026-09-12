/**
 * Scrapes a Punjab Laws department and downloads PDFs locally.
 * Usage: node scripts/scrape-department.js <deptId> <departmentName> <slug>
 * Example: node scripts/scrape-department.js 3 "Board of Revenue" board-of-revenue
 */
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const BASE = 'https://punjablaws.punjab.gov.pk'

const deptId = process.argv[2]
const departmentName = process.argv[3]
const slug = process.argv[4]

if (!deptId || !departmentName || !slug) {
  console.error('Usage: node scrape-department.js <deptId> <departmentName> <slug>')
  process.exit(1)
}

const DEPT_URL = `${BASE}/en/articles_by_department/${deptId}`
const OUT_DIR = path.join(__dirname, `../react-frontend/public/legal-documents/${slug}`)
const JSON_OUT = path.join(__dirname, `../react-frontend/src/data/${slug}-laws.json`)

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, { headers: { 'User-Agent': 'LawPal/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject)
        return
      }
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
    req.setTimeout(60000, () => req.destroy(new Error('timeout')))
  })
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function parseDepartmentList(html, defaultDept) {
  const articles = []
  const artlistRe = /<div class="artlist">\s*<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g
  const artdetsRe = /<div class="artdets"[^>]*>\s*([^<]+)\s*\|\s*([^|]+)\|\s*Promulgation Date:\s*([^|]+?)(?:\s*\|\s*Views:\s*\d+)?(?:\s*\|\s*Last Updated On:\s*([^<]+?))?\s*</g

  const links = [...html.matchAll(artlistRe)]
  const details = [...html.matchAll(artdetsRe)]

  for (let i = 0; i < links.length; i++) {
    const [, articleUrl, title] = links[i]
    const det = details[i]
    const department = det ? decodeHtml(det[1].trim()) : defaultDept
    const reference = det ? decodeHtml(det[2].trim()) : ''
    const promulgationDate = det ? decodeHtml(det[3].trim()) : ''
    const lastUpdated = det && det[4] ? decodeHtml(det[4].trim()) : promulgationDate

    articles.push({
      id: i + 1,
      title: decodeHtml(title.trim()),
      department,
      reference,
      promulgationDate,
      lastUpdated,
      articleUrl: articleUrl.startsWith('http') ? articleUrl : `${BASE}${articleUrl}`,
    })
  }
  return articles
}

function parseArticlePdf(html) {
  const pdfMatch = html.match(/uploads\/articles\/([^"'\s]+\.pdf)/i)
  if (pdfMatch) return `${BASE}/uploads/articles/${pdfMatch[1]}`
  const hrefMatch = html.match(/href="(https:\/\/punjablaws\.punjab\.gov\.pk\/uploads\/articles\/[^"]+\.pdf)"/i)
  return hrefMatch ? decodeHtml(hrefMatch[1]) : null
}

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0]
  }
  return raw
}

function safeFilename(title, index) {
  const base = title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80)
  return `${String(index).padStart(2, '0')}_${base}.pdf`
}

function inferCategory(reference) {
  const match = reference.match(/^(Act|Ordinance|Order|Rules|Regulation)/i)
  return match ? match[1] : 'Act'
}

async function downloadFile(url, dest) {
  const data = await fetchUrl(url)
  fs.writeFileSync(dest, data)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  console.log(`Fetching ${departmentName} (id ${deptId})...`)
  const listHtml = (await fetchUrl(DEPT_URL)).toString('utf8')
  const articles = parseDepartmentList(listHtml, departmentName)
  console.log(`Found ${articles.length} articles`)

  const results = []

  for (const article of articles) {
    console.log(`[${article.id}/${articles.length}] ${article.title}`)
    try {
      const articleHtml = (await fetchUrl(article.articleUrl)).toString('utf8')
      const pdfUrl = parseArticlePdf(articleHtml)
      if (!pdfUrl) {
        console.warn(`  No PDF for: ${article.title}`)
        continue
      }

      const localName = safeFilename(article.title, article.id)
      const localPath = path.join(OUT_DIR, localName)
      const publicPath = `/legal-documents/${slug}/${localName}`

      await downloadFile(pdfUrl, localPath)

      results.push({
        id: `${slug}-${article.id}`,
        title: article.title,
        department: article.department,
        category: inferCategory(article.reference),
        reference: article.reference,
        datePublished: formatDate(article.promulgationDate),
        lastUpdated: formatDate(article.lastUpdated),
        file: publicPath,
      })
    } catch (err) {
      console.error(`  Error: ${article.title}: ${err.message}`)
    }
  }

  fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true })
  fs.writeFileSync(JSON_OUT, JSON.stringify(results, null, 2))
  console.log(`Done. ${results.length} laws saved to ${JSON_OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
