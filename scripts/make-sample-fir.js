const fs = require('fs')
const path = require('path')

function escapePdf(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

const lines = [
  'FIRST INFORMATION REPORT (FIR) - SAMPLE / DEMO ONLY',
  'Police Station: Model Town, Lahore',
  'FIR No: 142/2024',
  'Date & Time of Report: 12-07-2024, 09:30 AM',
  'Date & Time of Occurrence: 11-07-2024, 08:15 PM',
  '',
  'Complainant: Ahmed Raza, S/O Muhammad Raza',
  'CNIC: 35202-1234567-1',
  'Address: House No. 45, Street 8, Model Town, Lahore',
  'Contact: 0300-1234567',
  '',
  'Accused: Unknown persons (to be identified)',
  '',
  'Place of Occurrence: Outside Al-Falah Market, Model Town',
  '',
  'Offence: Theft under Section 379 Pakistan Penal Code',
  '',
  'Brief Facts:',
  'The complainant states that on 11-07-2024 at about 08:15 PM,',
  'while returning home after shopping, two unknown persons on a',
  'motorcycle snatched his mobile phone (Samsung Galaxy A54) and',
  'cash amounting to Rs. 15,000. The accused fled towards Ferozepur Road.',
  '',
  'Property Stolen:',
  '1. Mobile phone Samsung Galaxy A54 - approx value Rs. 80,000',
  '2. Cash Rs. 15,000',
  '',
  'Action Taken: Case registered. Investigation assigned to ASI Bilal.',
  '',
  'Signature of Complainant: _______________',
  'Signature of Duty Officer: _______________',
  '',
  'NOTE: This is a FAKE sample document for LawPal testing only.',
  'It is not a real FIR and has no legal validity.',
]

const contentLines = ['BT', '/F1 11 Tf', '50 780 Td']
lines.forEach((line, i) => {
  if (i === 0) {
    contentLines.push('/F1 13 Tf')
    contentLines.push(`(${escapePdf(line)}) Tj`)
    contentLines.push('/F1 11 Tf')
  } else {
    contentLines.push('0 -16 Td')
    contentLines.push(`(${escapePdf(line || ' ')}) Tj`)
  }
})
contentLines.push('ET')
const stream = contentLines.join('\n')

const objects = []
objects.push('1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj')
objects.push('2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj')
objects.push(
  '3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj'
)
objects.push(`4 0 obj<< /Length ${Buffer.byteLength(stream, 'utf8')} >>stream\n${stream}\nendstream endobj`)
objects.push('5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj')

let pdf = '%PDF-1.4\n'
const offsets = [0]
objects.forEach((obj) => {
  offsets.push(Buffer.byteLength(pdf, 'utf8'))
  pdf += `${obj}\n`
})
const xrefPos = Buffer.byteLength(pdf, 'utf8')
pdf += `xref\n0 ${objects.length + 1}\n`
pdf += '0000000000 65535 f \n'
for (let i = 1; i < offsets.length; i++) {
  pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
}
pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
pdf += `startxref\n${xrefPos}\n%%EOF`

const targets = [
  path.join(__dirname, '../react-frontend/public/sample-fir.pdf'),
  path.join(__dirname, '../react-frontend/dist/sample-fir.pdf'),
]

targets.forEach((out) => {
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, pdf)
  console.log('Wrote', out)
})
