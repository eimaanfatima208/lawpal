/**
 * Seed High Court lawyer dummy data into users table.
 * Usage: node lawpal-backend/seed_lawyers.js
 */
const path = require('path');
const mysql = require(path.join(__dirname, '..', 'lawpal-chat-backend', 'node_modules', 'mysql2/promise'));
const bcryptjs = require(path.join(__dirname, '..', 'lawpal-chat-backend', 'node_modules', 'bcryptjs'));

function toISO(dmy) {
  const m = String(dmy).trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

const SPECIALTIES = [
  'Family Law',
  'Criminal Law',
  'Civil Litigation',
  'Corporate Law',
  'Property & Land',
  'Constitutional Law',
  'Tax Law',
  'Labour & Employment',
  'Banking & Finance',
  "Women's Rights",
];

const EDUCATIONS = [
  'LL.B (University of the Punjab)',
  'LL.M (UMT Lahore)',
  'LL.B (University of Lahore)',
  'BA-LL.B (LUMS)',
  'LL.B (GCU Lahore)',
  'LL.B (Pakistan College of Law)',
  'LL.M (University of the Punjab)',
  'LL.B (Superior University)',
];

// [serial, name, father, lcDate, hcDate, city]
const RAW = [
  ['94899', 'MR. ABDUR REHMAN', 'MUHAMMAD YOUSAF', '28-01-2014', '22-06-2017', 'LAHORE'],
  ['94900', 'MR. MUHAMMAD USMAN RAFIQUE', 'MUHAMMAD RAFIQ', '18-05-2015', '22-06-2017', 'LAHORE'],
  ['94901', 'MR. AWAIS AHMED', 'ARSHAD ALI', '18-06-2015', '22-06-2017', 'LAHORE'],
  ['94895', 'MR. MUHAMMAD SHEHERYAR SHAMI', 'MUHAMMAD ASLAM SHAMI', '13-08-2011', '22-06-2017', 'LAHORE'],
  ['94897', 'MR. MEHBOOB QADIR SHAH', 'GHULAM BILAL SHAH', '23-09-1980', '22-06-2017', 'LAHORE'],
  ['94903', 'MR. MUDASSAR ZAKA', 'ZAKA ULLAH', '20-05-2015', '22-06-2017', 'LAHORE'],
  ['94906', 'MR. TAHIR MAHBOOB', 'MUHAMMAD YAQOOB', '15-06-2015', '22-06-2017', 'LAHORE'],
  ['94923', 'MR. MUHAMMAD ASHRAF NAVEED', 'ASGHAR ALI', '28-05-2015', '22-06-2017', 'LAHORE'],
  ['94947', 'MR. HASNAIN ALI QURESHI', 'TAHIR MEHMOOD QURESHI', '13-06-2015', '23-06-2017', 'LAHORE'],
  ['94952', 'MR. MUHAMMAD AAMAR', 'MUHAMMAD AKRAM', '28-01-2014', '23-06-2017', 'LAHORE'],
  ['94953', 'MR. MUHAMMAD NAVEED HANIF', 'MUHAMMAD HANIF', '08-06-2015', '23-06-2017', 'LAHORE'],
  ['106026', 'DR. REHAN AHMAD', 'MUHAMMAD AYUB', '20-06-2015', '23-06-2017', 'LAHORE'],
  ['109320', 'MR. NABEEL FAIZ', 'FAIZ MUHAMMAD', '20-05-2015', '23-06-2017', 'LAHORE'],
  ['94557', 'MR. MUHAMMAD TAYYAB IQBAL', 'MUHAMMAD YAQOOB', '20-06-2015', '30-06-2017', 'LAHORE'],
  ['94548', 'MS. NADIA PERVEEN', 'ABDUL MAJEED', '26-06-2015', '30-06-2017', 'LAHORE'],
  ['95554', 'SYED JAVED AHMAD QAZI', 'SYED AHMAD', '13-03-2015', '30-06-2017', 'LAHORE'],
  ['109246', 'MR. MUHAMMAD ABUBAKAR EJAZ', 'MUHAMMAD EJAZ KHAN', '12-05-2015', '30-06-2017', 'LAHORE'],
  ['106029', 'MR. M. SHOAIB RAUF', 'ABDUL RAUF', '13-05-2015', '04-07-2017', 'LAHORE'],
  ['94709', 'MR. ABOU BAKER SADDIQUE', 'MUHAMMAD BOOTA', '18-05-2015', '04-07-2017', 'LAHORE'],
  ['96690', 'RAI FAISAL TUFAIL', 'RAI MUHAMMAD TUFAIL', '15-01-2016', '18-01-2018', 'LAHORE'],
  ['96692', 'MR. MUDASSAR SULTAN', 'MUHAMMAD ALI', '15-01-2016', '18-01-2018', 'LAHORE'],
  ['96693', 'MS. RAMEEL ANJUM', 'BASHARAT ANJUM', '13-01-2016', '18-01-2018', 'LAHORE'],
  ['96694', 'MR. MUHAMMAD ABID', 'MUHAMMAD ASLAM', '13-01-2016', '18-01-2018', 'LAHORE'],
  ['96695', 'MR. MAHRAN SHAHID', 'SHAHID HAYAT', '16-01-2016', '18-01-2018', 'LAHORE'],
  ['96696', 'MR. MUDASIR ALI', 'MURAD ALI', '13-01-2016', '18-01-2018', 'LAHORE'],
  ['96697', 'MR. TEMOOR ILYAS', 'MUHAMMAD WALAYAT', '15-01-2016', '18-01-2018', 'LAHORE'],
  ['96709', 'SYED IMTIAZ JAFREY', 'SYED KHURSHID JAFREY', '14-01-2016', '18-01-2018', 'LAHORE'],
  ['96710', 'MR. MUHAMMAD AMMAR WALI', 'DR. SHAHID JAVED', '12-01-2016', '18-01-2018', 'LAHORE'],
  ['96711', 'MR. SIKANDAR ATTA', 'ATTA ULLAH', '17-01-2014', '18-01-2018', 'LAHORE'],
  ['96712', 'MR. WAQAR ALI', 'MUHAMMAD ASLAM', '12-01-2016', '18-01-2018', 'LAHORE'],
  ['96713', 'MS. SONIA UMER', 'MUHAMMAD UMER', '15-01-2016', '18-01-2018', 'LAHORE'],
  ['96698', 'MR. SHAKOOR AHMED', 'ZAHOOR HUSSAIN', '11-01-2016', '18-01-2018', 'LAHORE'],
  ['96700', 'MR. ARSHAD ALI', 'AKBAR ALI', '13-01-2016', '18-01-2018', 'LAHORE'],
  ['96701', 'MR. MUHAMMAD QAMAR', 'ABDUL GHAFOOR', '12-01-2016', '18-01-2018', 'LAHORE'],
  ['96702', 'MR. ABRAR MAHMOOD', 'RIAZ MAHMOOD', '15-01-2016', '18-01-2018', 'LAHORE'],
  ['96704', 'MR. QASIM ALI', 'MUHAMMAD ALI', '19-04-2014', '18-01-2018', 'LAHORE'],
  ['96705', 'MR. MUHAMMAD FAISAL ARSHAD', 'MUHAMMAD ARSHAD', '12-01-2016', '18-01-2018', 'LAHORE'],
  ['97324', 'MR. NADEEM SOHAIL', 'HAMID AKHTAR', '05-11-2015', '19-01-2018', 'LAHORE'],
  ['97327', 'MR. SAMRAN MUSHTAQ', 'MUHAMMAD MUSHTAQ', '13-01-2016', '19-01-2018', 'LAHORE'],
  ['97330', 'MR. MUHAMMAD ADEEL GOHAR', 'MUHAMMAD RAFIQ GOHAR', '13-01-2016', '19-01-2018', 'LAHORE'],
  ['97332', 'MR. ZOHAIB SARWAR', 'CH. GHULAM SARWAR', '12-01-2016', '19-01-2018', 'LAHORE'],
  ['97337', 'RANA QAISER ARSHAD', 'ARSHAD ALI', '14-01-2016', '19-01-2018', 'LAHORE'],
  ['97340', 'MR. ZESHAN TUFAIL', 'MUHAMMAD TUFAIL BUTT', '11-01-2016', '19-01-2018', 'LAHORE'],
  ['97342', 'MR. ARSHAD ALI', 'MUHAMMAD SHAFI', '18-08-2015', '19-01-2018', 'LAHORE'],
  ['97343', 'MR. MUHAMMAD ABDULLAH SARWAR', 'GHULAM SARWAR', '12-01-2016', '19-01-2018', 'LAHORE'],
  ['97345', 'MR. MUHAMMAD ASGHAR ALI', 'MOULVI BARKAT ALI', '15-12-2015', '19-01-2018', 'LAHORE'],
  ['97348', 'MR. KHURAM AFZAL', 'MUHAMMAD AFZAL', '13-01-2016', '19-01-2018', 'LAHORE'],
  ['97349', 'MR. HAIDER YOUSAF', 'MUHAMMAD YOUSAF SIAL', '11-01-2016', '19-01-2018', 'LAHORE'],
  ['97350', 'MR. IRFAN ALI BHATTI', 'KHADIM HUSSAIN BHATTI', '24-06-2015', '19-01-2018', 'LAHORE'],
  ['97357', 'MR. FAISAL AZIZ MALIK', 'ABDUL AZIZ', '13-01-2016', '19-01-2018', 'LAHORE'],
  ['97359', 'SYED ZAHEER HUSSAIN GILLANI', 'SYED LIAQAT HUSSAIN', '21-05-2015', '19-01-2018', 'LAHORE'],
  ['97361', 'SYED SAMAR ABBAS', 'NAZIM ALI SHAH', '13-01-2016', '19-01-2018', 'LAHORE'],
  ['96741', 'MS. MEHWISH TALIB', 'TALIB HUSSAIN', '16-01-2016', '20-01-2018', 'LAHORE'],
  ['96646', 'MS. ASMA RIAZ BHULAR', 'CH. RIAZ HUSSAIN', '14-01-2016', '20-01-2018', 'LAHORE'],
  ['96645', 'MR. MUHAMMAD USMAN', 'MUHAMMAD YOUNAS', '28-11-2015', '20-01-2018', 'LAHORE'],
  ['96639', 'MR. MUHAMMAD GHAWAS AYUB', 'MUHAMMAD AYUB SABIR', '12-01-2016', '20-01-2018', 'LAHORE'],
  ['96640', 'MR. MUZAMAL RASOOL', 'MUHAMMAD AKRAM ANJUM', '18-01-2016', '20-01-2018', 'LAHORE'],
  ['96654', 'MALIK MUHAMMAD HASEEB', 'MUHAMMAD BUTTA', '15-01-2016', '20-01-2018', 'LAHORE'],
  ['96655', 'MS. HINA ASLAM', 'MUHAMMAD ASLAM', '19-01-2016', '20-01-2018', 'LAHORE'],
  ['96651', 'MR. WASEEM KHALID CHATTAHA', 'KHALID PERVEZ CHATTAHA', '18-01-2016', '20-01-2018', 'LAHORE'],
  ['96629', 'MS. NOOR UL ANN', 'ABDUL MASOOD', '15-01-2016', '20-01-2018', 'LAHORE'],
  ['96849', 'MR. MUHAMMAD ARSLAN JUTT', 'MUHAMMAD MANSHA', '18-01-2016', '22-01-2018', 'LAHORE'],
];

function detectGender(name) {
  const n = name.toUpperCase();
  if (n.startsWith('MS.') || n.startsWith('MISS ') || n.startsWith('MRS.')) return 'female';
  return 'male';
}

async function main() {
  // Ensure columns exist
  require('child_process').execSync('node "' + path.join(__dirname, 'migrate_lawyer_fields.js') + '"', {
    stdio: 'inherit',
  });

  const passwordHash = bcryptjs.hashSync('Lawyer@123', 10);

  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lawpal',
  });

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < RAW.length; i++) {
    const [serial, name, father, lc, hc, city] = RAW[i];
    const email = `lawyer.${serial}@lawpal.demo`;
    const specialty = SPECIALTIES[i % SPECIALTIES.length];
    // Prefer Women's Rights for female lawyers
    const gender = detectGender(name);
    const finalSpecialty = gender === 'female' ? "Women's Rights" : specialty;
    const education = EDUCATIONS[i % EDUCATIONS.length];
    const lcDate = toISO(lc);
    const hcDate = toISO(hc);

    const [existing] = await conn.query(
      'SELECT id FROM users WHERE serial_no_hc = ? OR email = ? LIMIT 1',
      [serial, email]
    );
    if (existing.length) {
      skipped++;
      continue;
    }

    await conn.query(
      `INSERT INTO users
        (full_name, email, password, role, serial_no_hc, father_name, lc_enr_date, hc_enr_date, specialty, education, city, gender)
       VALUES (?, ?, ?, 'lawyer', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHash, serial, father, lcDate, hcDate, finalSpecialty, education, city, gender]
    );
    inserted++;
  }

  await conn.end();
  console.log(`Seed complete. Inserted: ${inserted}, Skipped: ${skipped}. Default password: Lawyer@123`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
