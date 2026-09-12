const q = (text, opts, letter) => ({
  text,
  options: opts,
  correctAnswer: { A: 0, B: 1, C: 2, D: 3 }[letter],
});

const makeQuiz = (id, title, desc, difficulty, questions) => ({
  id,
  title,
  description: desc,
  difficulty,
  questions: questions.map((item, i) => ({ id: `${id}-${i + 1}`, ...item })),
});

const QUIZ_CATEGORIES = [
  {
    id: 'human-rights',
    title: 'Human Rights & Equality',
    description: 'Gender equality, domestic violence protection, and women & child rights.',
    icon: '⚖️',
    color: '#7C3AED',
    quizzes: [
      makeQuiz('gender-equality', 'Gender & Racial Equality Law', 'What is legally allowed and what counts as discrimination?', 'beginner', [
      q('A company refuses to hire a candidate because she is pregnant. This is:', ['Legal hiring policy', 'Gender discrimination under equality laws', 'Acceptable workplace rule', 'Medical decision'], 'B'),
      q('A manager pays male employees more than female employees for the same job role. This is:', ['Legal salary structure', 'Gender-based wage discrimination', 'Performance bonus system', 'Optional company policy'], 'B'),
      q('A tenant is denied housing because of their ethnicity. This is:', ['Legal property right of landlord', 'Racial discrimination under law', 'Social preference only', 'Security measure'], 'B'),
      q('A school refuses admission to a student based on religious background. This is:', ['Administrative choice', 'Illegal discrimination', 'Private decision always allowed', 'Curriculum policy'], 'B'),
      q('A workplace denies promotion to a woman despite equal qualifications due to “family responsibilities.” This is:', ['Legal HR decision', 'Indirect gender discrimination', 'Normal workplace rule', 'Performance-based exclusion'], 'B'),
      q('A public service office treats citizens differently based on skin color or ethnicity. This violates:', ['Administrative convenience', 'Equality before law', 'Internal policy', 'Public preference'], 'B'),
      q('A job advertisement states “men only apply.” This is:', ['Legal restriction', 'Direct gender discrimination', 'Industry standard', 'Safety requirement always'], 'B'),
      q('A restaurant refuses service to someone because of their nationality. This is:', ['Legal business choice', 'Racial discrimination', 'Customer policy', 'Security protocol'], 'B'),
      q('A woman is denied training opportunities because she may go on maternity leave. This is:', ['Risk management policy', 'Gender discrimination', 'Legal HR strategy', 'Neutral decision'], 'B'),
      q('Equality law mainly aims to:', ['Treat people differently based on identity', 'Ensure equal protection and non-discrimination', 'Favor majority groups', 'Limit workplace hiring freedom'], 'B'),
      ]),
      makeQuiz('domestic-violence-rights', 'Domestic Violence & Family Protection', 'Rights during abuse, police encounters, cyber safety, and workplace harassment.', 'beginner', [
      q('A victim of domestic violence chooses not to report abuse immediately. Which statement is most accurate?', ['Delayed reporting automatically invalidates the complaint.', 'Victims may delay reporting due to fear, dependency, or safety concerns.', 'The incident ceases to be unlawful after a certain period.', 'Only physical injuries can be reported.'], 'B'),
      q('Which behavior is most likely considered psychological abuse?', ['Disagreeing during a discussion', 'Repeated intimidation, threats, and isolation', 'Enforcing household rules', 'Limiting entertainment expenses'], 'B'),
      q('A protection order is primarily intended to:', ['Punish offenders without a hearing', 'Prevent further harm to a victim', 'Resolve inheritance disputes', 'Transfer property ownership'], 'B'),
      q('Which of the following best reflects a healthy legal principle regarding marriage?', ['Family approval replaces personal consent.', 'Marriage requires free and informed consent.', 'Economic status determines validity.', 'Community approval is sufficient.'], 'B'),
      q('Economic abuse may include:', ['Preventing a spouse from accessing financial resources', 'Discussing household expenses', 'Budget planning', 'Saving money jointly'], 'A'),
      q('During a lawful police interaction, a citizen should generally:', ['Cooperate while understanding their legal rights', 'Flee the scene', 'Refuse all communication', 'Destroy potential evidence'], 'A'),
      q('Why is it important to ask for identification from someone claiming to be a police officer?', ['To challenge authority unnecessarily', 'To verify official status and legitimacy', 'To delay an investigation', 'To avoid future taxation'], 'B'),
      q('A search conducted without proper legal authority may raise concerns regarding:', ['Property valuation', 'Privacy and due process rights', 'Traffic regulations', 'Tax compliance'], 'B'),
      q('Which principle helps protect individuals from arbitrary detention?', ['Presumption of ownership', 'Rule of law', 'Contract freedom', 'Market competition'], 'B'),
      q('Citizens should generally avoid:', ['Remaining calm', 'Recording lawful information where permitted', 'Obstructing lawful police duties', 'Requesting legal assistance'], 'B'),
      q('Why should citizens regularly review privacy settings on online platforms?', ['To increase advertising exposure', 'To better control access to personal information', 'To improve internet speed', 'To avoid software updates'], 'C'),
      q('A company collects personal data for one purpose and later uses it for unrelated purposes without notice. This raises concerns about:', ['Data protection principles', 'Consumer discounts', 'Market competition', 'Product quality'], 'B'),
      q('Which practice most effectively reduces the risk of account compromise?', ['Reusing one password everywhere', 'Sharing passwords with trusted friends', 'Using unique passwords and multi-factor authentication', 'Saving passwords in public documents'], 'A'),
      q('Phishing attacks commonly rely on:', ['Advanced engineering only', 'Social manipulation and deception', 'Legal authority', 'Public announcements'], 'A'),
      q('Personal information shared online may:', ['Remain private permanently', 'Be copied, stored, and redistributed', 'Automatically disappear', 'Become legally protected from all use'], 'C'),
      q('Which warning sign is commonly associated with financial fraud?', ['Transparent documentation', 'Guaranteed high returns with little or no risk', 'Independent audits', 'Detailed disclosures'], 'B'),
      q('Before investing money, citizens should:', ['Verify credentials and conduct due diligence', 'Trust verbal assurances alone', 'Invest immediately to avoid missing out', 'Ignore documentation'], 'B'),
      q('Why should banking OTPs never be shared?', ['They authorize sensitive transactions', 'They improve customer service', 'They are public information', 'They reduce fraud risks'], 'B'),
      q('Fraudsters frequently create urgency because:', ['It encourages careful decision-making', 'It pressures victims to act without verification', 'It improves transparency', 'It reduces financial loss'], 'A'),
      q('Which action is most appropriate after discovering unauthorized transactions?', ['Ignore them temporarily', 'Report them immediately to the financial institution', 'Close all social media accounts', 'Transfer funds to strangers'], 'A'),
      q('A consumer receives a message claiming they won a prize but must pay a fee first. This is most likely:', ['A legitimate reward', 'A common scam technique', 'A tax requirement', 'A government program'], 'B'),
      q('Why should consumers verify sellers before making online purchases?', ['To reduce risks of fraud and non-delivery', 'To increase delivery times', 'To avoid warranties', 'To reduce product quality'], 'B'),
      q('Which practice indicates responsible consumer behavior?', ['Reading terms and conditions before purchase', 'Accepting all offers immediately', 'Ignoring return policies', 'Sharing payment information publicly'], 'A'),
      q('Misleading advertising primarily harms consumers by:', ['Limiting competition only', 'Influencing decisions through inaccurate information', 'Improving market transparency', 'Reducing complaints'], 'A'),
      q('A legitimate business should generally provide:', ['Clear contact and business information', 'Anonymous ownership', 'Hidden pricing', 'Unverifiable claims'], 'B'),
      q('A written tenancy agreement primarily helps:', ['Clarify legal obligations of both parties', 'Eliminate rent obligations', 'Replace housing laws', 'Prevent communication'], 'A'),
      q('Which issue most commonly leads to housing disputes?', ['Unclear contractual terms', 'Excessive documentation', 'Property inspections', 'Written agreements'], 'A'),
      q('A tenant should document property conditions at move-in because:', ['It may help resolve future disputes', 'It increases rent', 'It changes ownership', 'It eliminates repairs'], 'A'),
      q('Security deposits are generally intended to:', ['Cover potential losses under agreed conditions', 'Replace rent payments permanently', 'Transfer ownership rights', 'Increase taxes'], 'A'),
      q('Disputes regarding property damage are easier to resolve when:', ['Evidence and records are available', 'Assumptions replace documentation', 'Witnesses are ignored', 'Agreements are verbal only'], 'A'),
      q('Workplace harassment primarily concerns:', ['Unwelcome conduct affecting dignity or work conditions', 'Performance evaluations', 'Salary negotiations', 'Business expansion'], 'A'),
      q('Which factor often distinguishes harassment from ordinary workplace disagreement?', ['Repeated or severe inappropriate conduct', 'Different opinions', 'Professional feedback', 'Policy discussions'], 'A'),
      q('Employers have a responsibility to:', ['Promote a safe and respectful workplace', 'Ignore complaints', 'Discourage reporting', 'Eliminate workplace policies'], 'A'),
      q('Retaliation against someone who reports misconduct is:', ['Generally considered inappropriate and potentially unlawful', 'Encouraged', 'Mandatory', 'Protected from review'], 'A'),
      q('Effective workplace complaint procedures help:', ['Address issues fairly and consistently', 'Eliminate accountability', 'Increase conflicts', 'Reduce transparency'], 'A'),
      ]),
      makeQuiz('citizen-rights-women-child', 'Women & Child Rights', 'Legal protections for women and children in everyday situations.', 'beginner', [
      q('Accessibility helps perso', ['Participate fully in society', 'Stay isolated', 'Avoid education', 'Reduce opportunities'], 'A'),
      q('Discrimi', ['Often unlawful', 'Encouraged', 'Required', 'Rewarded'], 'A'),
      q('Public facilities should aim to:\n\nA) Be accessible to everyo', ['Be accessible to everyone', 'Exclude people', 'Limit participation', 'Increase barriers'], 'A'),
      q('I', ['Providing learning opportunities for all students', 'Excluding students with disabilities', 'Limiting access to schools', 'Preventing participation'], 'A'),
      q('Perso', ['Equal opportunities and dignity', 'Fewer rights', 'No employment', 'Isolation'], 'A'),
      q('Litteri', ['Harm the environment', 'Improve cleanliness', 'Create jobs automatically', 'Increase safety'], 'A'),
      q('Illegal dumpi', ['Violate environmental laws', 'Help nature', 'Improve public health', 'Reduce pollution'], 'A'),
      q('Why should citize', ['To protect a valuable resource', 'To waste resources', 'To increase pollution', 'To damage ecosystems'], 'A'),
      q('E', ['Protect people and nature', 'Increase pollution', 'Eliminate parks', 'Encourage waste'], 'A'),
      q('Pla', ['Improve the environment and air quality', 'Increase pollution', 'Damage ecosystems', 'Waste resources'], 'A'),
      ])
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Medical Law',
    description: 'Hospital emergencies, patient rights, drugs, and medical negligence.',
    icon: '🏥',
    color: '#059669',
    quizzes: [
      makeQuiz('hospital-legal', 'Hospital Legal Case Simulator', 'Emergency care, consent, negligence, and pharmacy law in hospitals.', 'advanced', [
      q('A patient is unconscious in the ER and needs immediate surgery. The hospital:', ['Must wait for family consent', 'Can proceed under emergency doctrine', 'Must refuse treatment', 'Must call police first'], 'B'),
      q('A doctor refuses treatment because the patient cannot pay. Legally:', ['Allowed in all cases', 'Illegal in emergency situations', 'Required by law', 'Depends on media pressure'], 'B'),
      q('A patient’s relative insists on treatment refusal while patient is unconscious. Doctors should:', ['Follow relative immediately', 'Treat patient based on medical necessity', 'Wait for court order', 'Discharge patient'], 'B'),
      q('Emergency blood transfusion is required but family refuses due to beliefs. Hospital should:', ['Always obey family', 'Proceed if life is at risk and law allows', 'Cancel treatment', 'Transfer patient immediately'], 'B'),
      q('A hospital delays treatment due to paperwork during emergency. This is:', ['Potential negligence', 'Standard procedure', 'Legally required', 'Always justified'], 'A'),
      q('Valid medical consent must be:', ['Informed, voluntary, and competent', 'Only verbal approval', 'Family agreement only', 'Hospital decision'], 'A'),
      q('Performing surgery without consent (non-emergency) is:', ['Legal', 'Medical negligence or assault', 'Required', 'Optional'], 'B'),
      q('A patient has the right to:', ['Refuse treatment (if competent)', 'Demand any medicine', 'Avoid diagnosis', 'Ignore doctors'], 'A'),
      q('Doctors can share patient information when:', ['Law requires or patient consents', 'Friends request it', 'Media asks', 'Hospital staff discuss freely'], 'A'),
      q('A patient record belongs to:', ['Patient (controlled by hospital)', 'Doctor personally', 'Government only', 'Public access'], 'A'),
      q('A wrong medication is given due to carelessness. This is:', ['Medical negligence', 'Normal risk', 'Patient fault', 'Legal treatment'], 'A'),
      q('A doctor follows correct procedure but patient dies. This is:', ['Not necessarily negligence', 'Always criminal', 'Fraud', 'Illegal act'], 'A'),
      q('Hospital can be liable when:', ['Systemic negligence occurs', 'Patient is unhappy', 'Treatment is expensive', 'Media reports issue'], 'A'),
      q('Falsifying medical reports is:', ['Illegal and punishable', 'Acceptable', 'Standard practice', 'Optional'], 'A'),
      q('Compensation in medical negligence is:', ['Legal remedy for harm', 'Gift', 'Insurance only', 'Moral choice'], 'A'),
      q('Selling prescription drugs without prescription is:', ['Illegal', 'Legal', 'Encouraged', 'Optional'], 'A'),
      q('Antibiotics without prescription should be:', ['Avoided due to legal/medical risk', 'Always used', 'Given freely', 'Mandatory'], 'A'),
      q('Fake medicines in hospital supply chain:', ['Are criminal offense', 'Are acceptable', 'Are harmless', 'Are optional'], 'A'),
      q('Controlled drugs require:', ['Strict regulation and prescription', 'No control', 'Public approval', 'Marketing license only'], 'A'),
      q('Misuse of narcotic drugs in hospitals is:', ['Serious legal violation', 'Acceptable practice', 'Normal error', 'Administrative issue only'], 'A'),
      ]),
      makeQuiz('medical-healthcare', 'Medical, Drug & Healthcare Law', 'Drug law, patient rights, negligence, emergency and pharmacy regulation.', 'advanced', [
      q('Possession of prescription drugs without prescription is:', ['Always legal', 'Illegal if not authorized', 'Encouraged', 'Medical practice'], 'B'),
      q('Controlled drugs can only be sold:', ['Without restriction', 'With valid prescription and licensed pharmacy', 'By any shop', 'Online freely'], 'B'),
      q('Illegal drug trafficking is:', ['Minor offense', 'Serious criminal offense', 'Civil issue', 'Medical matter'], 'B'),
      q('Self-medication with strong antibiotics without prescription:', ['Is legally and medically risky', 'Always recommended', 'Mandatory', 'Government approved'], 'A'),
      q('Pharmacy selling expired medicines is:', ['Illegal and unsafe practice', 'Legal if cheap', 'Acceptable', 'Normal practice'], 'A'),
      q('Narcotics control laws aim to:', ['Prevent drug abuse and trafficking', 'Promote sales', 'Increase addiction', 'Reduce hospitals'], 'A'),
      q('Drug possession becomes serious offense when:', ['Quantity indicates intent to supply', 'Person is sick', 'Medicine is common', 'Prescription is old'], 'A'),
      q('Illegal drug manufacturing is:', ['Criminal offense', 'Legal business', 'Medical research', 'Private activity'], 'A'),
      q('Rehabilitation centers are used for:', ['Treatment of addiction', 'Punishment only', 'Arresting patients', 'Marketing'], 'A'),
      q('Drug abuse laws primarily protect:', ['Public health and safety', 'Business profits', 'Political system', 'Media'], 'A'),
      q('Emergency treatment without advance payment is:', ['Required in emergencies', 'Never allowed', 'Optional always', 'Illegal'], 'A'),
      q('Patient consent is required before:', ['Medical procedures', 'Hospital entry', 'Police visit', 'Billing'], 'A'),
      q('A doctor treating without consent (non-emergency) may be:', ['Legally liable', 'Always protected', 'Encouraged', 'Neutral'], 'A'),
      q('Medical records belong to:', ['Patient (with hospital custody)', 'Doctor personally', 'Government only', 'Public'], 'A'),
      q('Withholding emergency care due to inability to pay is:', ['Illegal in emergencies', 'Allowed', 'Recommended', 'Required'], 'A'),
      q('Patient confidentiality means:', ['Medical information must be protected', 'Public sharing allowed', 'Social media posting', 'Police access always'], 'A'),
      q('Doctors can disclose patient data when:', ['Law requires or consent exists', 'They want', 'Media asks', 'Friends request'], 'A'),
      q('Wrong diagnosis causing harm may be:', ['Medical negligence', 'Always legal', 'Criminal intent', 'Insurance issue only'], 'A'),
      q('Hospitals must maintain:', ['Standard care and safety protocols', 'No rules', 'Random treatment', 'Social media updates'], 'A'),
      q('Patient rights include:', ['Informed consent and proper care', 'No rights', 'Free treatment always', 'Unlimited medicine'], 'A'),
      q('Medical negligence occurs when:', ['Doctor fails standard duty of care', 'Treatment is successful', 'Patient recovers', 'Medicine is given'], 'A'),
      q('Informed consent means:', ['Patient understands risks and agrees', 'Doctor decides alone', 'Family decides always', 'Hospital approves'], 'A'),
      q('Emergency treatment can proceed without consent when:', ['Patient is unconscious and life is at risk', 'Family disagrees', 'Paperwork is missing', 'Payment is delayed'], 'A'),
      q('A wrong surgery due to carelessness is:', ['Potential malpractice', 'Legal always', 'Normal risk', 'Insurance only'], 'A'),
      q('Doctors are liable when:', ['Gross negligence is proven', 'Treatment fails always', 'Patient is unhappy', 'Medicine is expensive'], 'A'),
      q('Expert medical opinion in court is:', ['Used for technical clarification', 'Not allowed', 'Optional always', 'Social opinion'], 'A'),
      q('Hospital liability includes:', ['Institutional responsibility for negligence', 'No responsibility', 'Only doctor responsibility', 'Only patient fault'], 'A'),
      q('Medical record falsification is:', ['Illegal', 'Legal practice', 'Acceptable', 'Optional'], 'A'),
      q('Malpractice cases require:', ['Proof of negligence and harm', 'Only complaint', 'Media report', 'Rumor'], 'A'),
      q('Compensation in medical negligence cases is:', ['Legal remedy for harm', 'Punishment for patients', 'Optional donation', 'Not allowed'], 'A'),
      q('Ambulance delay causing death may lead to:', ['Legal accountability', 'No issue', 'Reward', 'Insurance only'], 'A'),
      q('Hospitals must treat emergency patients:', ['Immediately', 'After payment only', 'After approval', 'After paperwork'], 'A'),
      q('Public health laws regulate:', ['Disease control and safety', 'Traffic only', 'Property only', 'Banking'], 'A'),
      q('Quarantine rules apply when:', ['Disease risk exists', 'Public demand exists', 'Travel is high', 'Hospital is full'], 'A'),
      q('Vaccination laws are:', ['Public health protection measures', 'Optional always', 'Private choice only', 'Illegal'], 'A'),
      q('Epidemic control measures may include:', ['Legal restrictions for safety', 'No rules', 'Random punishment', 'Media control'], 'A'),
      q('False medical certification is:', ['Illegal', 'Acceptable', 'Medical practice', 'Optional'], 'A'),
      q('Public health emergencies allow:', ['Temporary legal powers for safety', 'Unlimited power always', 'No rules', 'Private control'], 'A'),
      q('Selling medicine without license is:', ['Illegal', 'Legal', 'Encouraged', 'Neutral'], 'A'),
      q('Antibiotics misuse leads to:', ['Drug resistance', 'Faster cure always', 'No effect', 'Legal reward'], 'A'),
      q('Fake medicines are:', ['Criminal offense', 'Legal product', 'Medical alternative', 'Approved treatment'], 'A'),
      q('Prescription drugs require:', ['Doctor authorization', 'Public approval', 'Social media', 'Shopkeeper choice'], 'A'),
      q('Drug regulation ensures:', ['Safe distribution and usage', 'Free misuse', 'No control', 'Marketing only'], 'A'),
      q('Clinical trials must follow:', ['Ethical and legal approval process', 'No rules', 'Random testing', 'Secret practice'], 'A'),
      q('The main purpose of medical law is:', ['Protect patients and ensure safe healthcare', 'Increase hospital profit', 'Reduce doctors', 'Remove rules'], 'A'),
      ])
    ],
  },
  {
    id: 'police-cyber',
    title: 'Police, Cyber & Public Safety',
    description: 'Legal simulation levels 1–5: police powers, cyber crime, and public safety.',
    icon: '🚔',
    color: '#DC2626',
    quizzes: [
      makeQuiz('legal-simulation-l5', 'Legal Decision Simulation (Level 5)', 'Police power, cyber law, banking, property, and governance scenarios.', 'advanced', [
      q('Police ask to search your phone without warrant during investigation. Legally, this is:', ['Always allowed', 'Only allowed with legal authority or consent', 'Mandatory for citizens', 'Required in all complaints'], 'B'),
      q('You are detained for questioning but not arrested. You should know:', ['Detention must still follow legal limits', 'Police can detain indefinitely', 'No rights apply', 'Court involvement is not needed'], 'A'),
      q('Police enter a home at night claiming emergency. This is valid only if:', ['There is immediate threat to life or serious harm', 'Neighbor is suspicious', 'Officer is new', 'Area is busy'], 'A'),
      q('A warrantless search is justified when:', ['Evidence is at risk of destruction', 'Officer is curious', 'Social media reports crime', 'Public requests'], 'A'),
      q('Arrest without informing reason is:', ['Illegal in most legal systems', 'Standard practice', 'Optional', 'Media dependent'], 'A'),
      q('Police stop your vehicle randomly. They may:', ['Act only under legal authority or suspicion', 'Search everything without reason', 'Confiscate vehicle', 'Arrest without cause'], 'A'),
      q('Refusing unlawful search is:', ['A legal right', 'A crime', 'Never allowed', 'Optional only'], 'A'),
      q('Custody requires:', ['Judicial oversight within legal time', 'No documentation', 'Police discretion only', 'Public approval'], 'A'),
      q('Excessive force by police is:', ['Illegal and challengeable', 'Always legal', 'Recommended', 'Unregulated'], 'A'),
      q('Legal arrest requires:', ['Lawful grounds and procedure', 'Public demand', 'Media approval', 'Officer preference'], 'A'),
      q('Police access to cloud data requires:', ['Legal authorization or warrant', 'No restriction', 'Public request', 'App permission only'], 'A'),
      q('Installing spyware on a device without permission is:', ['Cybercrime', 'Legal monitoring', 'Safe practice', 'Administrative action'], 'A'),
      q('Digital evidence must be:', ['Authentic and legally collected', 'Edited for clarity', 'Anonymous', 'Public posts'], 'A'),
      q('Authorities monitoring online chats must:', ['Follow legal process', 'Monitor freely', 'Ignore rules', 'Ask users'], 'A'),
      q('Phishing attacks are:', ['Fraudulent attempts to steal data', 'Government alerts', 'Security updates', 'Banking tools'], 'A'),
      q('Sharing hacked data is:', ['Illegal', 'Encouraged', 'Neutral', 'Required'], 'A'),
      q('Cyber investigation is valid when:', ['Based on legal complaint or suspicion under law', 'Based on curiosity', 'Based on social media', 'Based on rumors'], 'A'),
      q('Password forcing by authorities is:', ['Restricted and regulated', 'Always allowed', 'Required', 'Optional'], 'A'),
      q('Digital privacy laws protect:', ['Personal data from misuse', 'Government data only', 'Public posts only', 'Marketing content'], 'A'),
      q('Unauthorized account access is:', ['Criminal offense', 'Legal browsing', 'Customer service', 'System update'], 'A'),
      q('Bank freezing account requires:', ['Legal or regulatory authority', 'Customer dislike', 'Media pressure', 'Random selection'], 'A'),
      q('OTP should be:', ['Never shared', 'Always shared', 'Optional', 'Public'], 'A'),
      q('Suspicious financial transactions trigger:', ['Regulatory investigation', 'No action', 'Social media alerts', 'Personal opinion'], 'A'),
      q('Money laundering refers to:', ['Concealing illegal funds', 'Saving money', 'Banking normally', 'Tax payment'], 'A'),
      q('Fraud investment schemes often:', ['Promise unrealistic returns', 'Show transparency', 'Follow law', 'Are licensed'], 'A'),
      q('KYC is required to:', ['Verify identity', 'Increase fraud', 'Avoid regulation', 'Remove banking rules'], 'A'),
      q('Financial regulators exist to:', ['Prevent fraud and ensure compliance', 'Promote scams', 'Remove rules', 'Hide data'], 'A'),
      q('Unauthorized transaction should be:', ['Reported immediately', 'Ignored', 'Accepted', 'Hidden'], 'A'),
      q('Investment advice should be:', ['Verified from authorized sources', 'Based on rumors', 'From strangers', 'From ads only'], 'A'),
      q('Banking fraud victims should:', ['Report and freeze accounts', 'Stay silent', 'Ignore bank', 'Continue transactions'], 'A'),
      q('Entering private property without permission is:', ['Trespass', 'Legal right', 'Inspection', 'Duty'], 'A'),
      q('Rent agreements protect:', ['Both tenant and landlord rights', 'Only landlord', 'Only tenant', 'Government'], 'A'),
      q('Property ownership is proven by:', ['Legal documents', 'Verbal claim', 'Social media', 'Witness opinion'], 'A'),
      q('Eviction without due process is:', ['Illegal', 'Always legal', 'Recommended', 'Optional'], 'A'),
      q('Security deposit disputes are resolved through:', ['Contract law', 'Social media', 'Police only', 'Verbal argument'], 'A'),
      q('Oral contracts are:', ['Weak legally in most cases', 'Stronger than written', 'Always binding', 'Government approved'], 'A'),
      q('Civil disputes involve:', ['Private rights', 'Criminal punishment', 'Military law', 'Traffic law'], 'A'),
      q('Inheritance laws regulate:', ['Property transfer after death', 'Driving rules', 'Cybercrime', 'Employment'], 'A'),
      q('Rule of law ensures:', ['Equality before law', 'Government supremacy', 'Police immunity', 'Media control'], 'A'),
      q('Human rights may be restricted only:', ['Under law and necessity', 'At will', 'By police decision', 'By media pressure'], 'A'),
      q('Arbitrary action means:', ['Without legal justification', 'Court order', 'Fair decision', 'Legal process'], 'A'),
      q('Accountability means:', ['Officials answer for actions', 'No oversight', 'Secret decisions', 'Unlimited authority'], 'A'),
      q('Transparency reduces:', ['Corruption', 'Law enforcement', 'Justice', 'Public awareness'], 'A'),
      q('Emergency powers must be:', ['Temporary and controlled', 'Permanent', 'Unlimited', 'Secret'], 'A'),
      q('Law ultimately exists to:', ['Balance justice, rights, and order', 'Control citizens only', 'Remove freedoms', 'Avoid disputes'], 'A'),
      ]),
      makeQuiz('legal-scenario-l4', 'Legal Scenario Challenge (Level 4)', 'Real-life legal decisions citizens face across multiple domains.', 'advanced', [
      q('A police officer asks to search your bag on the street without explaining reason. You should understand that:', ['Search is always allowed without limits', 'They must have legal justification or consent', 'You must always agree', 'Refusal is a crime in all cases'], 'B'),
      q('Police enter a house during night claiming emergency. This is lawful only if:', ['They suspect minor complaint', 'There is immediate threat to life or serious danger', 'Neighbors called them', 'They want inspection'], 'A'),
      q('You are stopped at a checkpoint. Police can lawfully:', ['Search only under legal authority or suspicion', 'Search without reason always', 'Arrest without cause', 'Confiscate belongings freely'], 'A'),
      q('If arrested, the police must:', ['Inform reason of arrest', 'Keep it secret', 'Delay court production indefinitely', 'Ignore legal procedure'], 'A'),
      q('A warrantless arrest is valid when:', ['Crime is committed in officer’s presence', 'Officer dislikes person', 'Media reports suspicion', 'Public demands it'], 'A'),
      q('You refuse to open your phone password. Police can access it only when:', ['Lawfully authorized or with warrant', 'They ask politely', 'Device is expensive', 'You are suspected online'], 'A'),
      q('Detention becomes illegal when:', ['No lawful basis exists', 'Police are busy', 'Investigation is ongoing', 'Complaint exists'], 'A'),
      q('Police can use reasonable force when:', ['Legally necessary and proportional', 'Emotionally upset', 'Public angry', 'Officer threatened verbally only'], 'A'),
      q('A search without warrant is justified if:', ['Evidence may be destroyed immediately', 'Officer is curious', 'Social media reports', 'Neighbors complain'], 'A'),
      q('You are legally protected against:', ['Arbitrary detention', 'Police investigation', 'Legal questioning', 'Reporting crimes'], 'A'),
      q('Someone accesses your social media account without permission. This is:', ['Legal browsing', 'Unauthorized access (cyber offense)', 'Marketing', 'Data backup'], 'A'),
      q('Police can investigate your phone data without warrant only if:', ['Law allows urgent cyber investigation', 'They are curious', 'You are online', 'Device is unlocked'], 'A'),
      q('Sharing someone’s private chat publicly may:', ['Violate privacy laws', 'Always be legal', 'Be encouraged', 'Be irrelevant'], 'A'),
      q('Phishing messages aim to:', ['Steal sensitive data', 'Help users', 'Provide updates', 'Improve security'], 'A'),
      q('Cyber evidence must be:', ['Authentic and verifiable', 'Edited', 'Anonymous always', 'Opinion-based'], 'A'),
      q('Authorities monitoring online activity must:', ['Follow legal authorization', 'Do it freely', 'Ignore rules', 'Ask public opinion'], 'A'),
      q('Digital arrest threats online are:', ['Fraudulent scams', 'Legal notices', 'Court orders', 'Official warnings'], 'A'),
      q('Installing spyware on someone’s device without permission is:', ['Illegal', 'Acceptable', 'Educational', 'Neutral'], 'A'),
      q('Data protection laws exist to:', ['Protect personal information', 'Share data freely', 'Increase surveillance', 'Remove privacy'], 'A'),
      q('A hacked account should be:', ['Reported and secured immediately', 'Ignored', 'Shared further', 'Deleted permanently'], 'A'),
      q('A caller asks for OTP claiming bank verification. You should:', ['Never share OTP', 'Always share', 'Ignore bank security', 'Trust caller'], 'A'),
      q('High return investment with zero risk is usually:', ['Fraudulent scheme', 'Government guarantee always', 'Legal rule', 'Banking norm'], 'A'),
      q('Bank freezing account without reason is:', ['Illegal unless authorized', 'Normal always', 'Customer error', 'Media decision'], 'A'),
      q('Unauthorized transaction should be:', ['Reported immediately', 'Ignored', 'Accepted', 'Hidden'], 'A'),
      q('Money laundering involves:', ['Concealing illegal funds', 'Saving money', 'Paying bills', 'Banking safely'], 'A'),
      q('Financial regulators exist to:', ['Prevent fraud', 'Promote scams', 'Remove banking rules', 'Ignore complaints'], 'A'),
      q('KYC requirement is:', ['Identity verification', 'Marketing tool', 'Optional rule', 'Tax system'], 'A'),
      q('Fraud investigation starts when:', ['Suspicion of illegal financial activity exists', 'Bank is busy', 'Account is new', 'User is poor'], 'A'),
      q('Fake online shops usually:', ['Take payment and disappear', 'Deliver faster', 'Are government approved', 'Offer guarantees'], 'A'),
      q('Financial fraud victims should:', ['Report to authorities immediately', 'Stay silent', 'Share more money', 'Ignore banks'], 'A'),
      q('Entering someone’s property without permission is:', ['Trespass', 'Legal always', 'Social right', 'Inspection'], 'A'),
      q('Rent agreement protects:', ['Both landlord and tenant rights', 'Only landlord', 'Only tenant', 'Government'], 'A'),
      q('Security deposit disputes are solved using:', ['Contract law', 'Social media', 'Verbal argument', 'Police only'], 'A'),
      q('Property ownership is proven by:', ['Legal documents', 'Verbal claim', 'Witness only', 'Social status'], 'A'),
      q('Eviction without legal process is:', ['Illegal in most cases', 'Always allowed', 'Recommended', 'Optional'], 'A'),
      q('Verbal property agreement is:', ['Weak legally', 'Stronger than documents', 'Always valid', 'Government approved'], 'A'),
      q('Civil disputes are usually between:', ['Private individuals', 'Police only', 'Military', 'Courts only'], 'A'),
      q('Inheritance laws govern:', ['Property transfer after death', 'Traffic rules', 'Cybercrime', 'Banking'], 'A'),
      q('Rule of law means:', ['Law applies equally to all', 'Government is above law', 'Police decide law', 'Media decides law'], 'A'),
      q('Human rights can be limited when:', ['Law permits for public safety', 'Authorities wish', 'Media requests', 'Social pressure'], 'A'),
      q('Arbitrary action is:', ['Without legal basis', 'Court order', 'Legal process', 'Fair decision'], 'A'),
      q('Accountability ensures:', ['Officials answer for actions', 'No responsibility', 'Secret governance', 'Unlimited power'], 'A'),
      q('Transparency reduces:', ['Corruption', 'Law enforcement', 'Public awareness', 'Legal system'], 'A'),
      q('Emergency powers must be:', ['Temporary and controlled', 'Permanent', 'Unlimited', 'Secret'], 'A'),
      q('Legal systems exist to:', ['Balance rights, order, and justice', 'Control citizens only', 'Remove freedoms', 'Avoid rules'], 'A'),
      ]),
      makeQuiz('emergency-powers-l3', 'Emergency Powers & Public Safety (Level 3)', 'Deep legal reasoning on emergency powers, surveillance, and criminal procedure.', 'advanced', [
      q('Police may restrict movement in an area without court order when:', ['There is routine traffic control', 'There is credible threat to public safety or emergency situation', 'A complaint is received', 'A political event is ongoing'], 'B'),
      q('A public gathering can be dispersed lawfully when:', ['People are peacefully assembled', 'It creates immediate risk of violence or public disorder', 'It is large in number', 'Authorities dislike it'], 'B'),
      q('Curfew restrictions are legally justified when:', ['Public safety is at risk under emergency conditions', 'People gather in markets', 'Social media criticism increases', 'Weather is normal'], 'A'),
      q('Use of force by law enforcement is permitted when:', ['It is proportional and necessary under law', 'Officer feels insulted', 'Public disagrees', 'Media reports pressure'], 'A'),
      q('Emergency entry into buildings is allowed when:', ['There is imminent threat to life or property', 'Owner is absent', 'Area is restricted', 'Police suspect minor issue'], 'A'),
      q('Public order laws are primarily designed to:', ['Maintain peace and safety in society', 'Control political opinions', 'Limit freedom permanently', 'Replace courts'], 'A'),
      q('Temporary detention during riots is:', ['Always illegal', 'Permitted under lawful preventive powers', 'Based on rumor', 'Media-driven'], 'A'),
      q('Authorities can restrict assembly rights when:', ['Public safety or national security is at risk', 'People disagree with government', 'Social media trends increase', 'Event is cultural'], 'A'),
      q('Declaration of emergency usually:', ['Expands certain state powers temporarily under law', 'Removes constitution', 'Ends judiciary', 'Eliminates rights permanently'], 'B'),
      q('Police checkpoints are lawful when:', ['Conducted under lawful authority for safety/security', 'Random without reason', 'Based on personal preference', 'Always illegal'], 'A'),
      q('Surveillance without warrant is allowed when:', ['Law provides emergency authorization', 'Officer is curious', 'Public demands it', 'Device is public'], 'A'),
      q('Monitoring communications generally requires:', ['Legal authorization and oversight', 'No rules', 'Social approval', 'Media permission'], 'A'),
      q('Data interception becomes lawful when:', ['Court or statutory authority permits it', 'Police feel suspicious', 'Internet is public', 'User is online'], 'A'),
      q('Privacy rights may be limited when:', ['Necessary for lawful investigation', 'Someone is unpopular', 'Public gossip exists', 'Media reports it'], 'A'),
      q('CCTV monitoring in public places is:', ['Generally lawful if regulated', 'Always illegal', 'Private crime only', 'Optional enforcement'], 'A'),
      q('Unauthorized access to digital systems is:', ['Illegal cyber offense', 'Acceptable if no harm', 'Civil dispute only', 'Administrative act'], 'A'),
      q('Authorities must ensure surveillance is:', ['Proportionate and legally justified', 'Secret always', 'Unlimited', 'Arbitrary'], 'A'),
      q('Biometric data collection must be:', ['Legally regulated and consent-based', 'Forced always', 'Publicly shared', 'Optional for authorities only'], 'A'),
      q('Digital privacy violations may lead to:', ['Legal liability', 'No consequences', 'Social reward', 'Automatic approval'], 'A'),
      q('Lawful interception is primarily used for:', ['Serious crime prevention and investigation', 'Entertainment', 'Advertising', 'Marketing'], 'A'),
      q('Freezing bank accounts is lawful when:', ['Authorized by legal or regulatory authority', 'Account balance is low', 'Customer is unknown', 'Complaint is informal'], 'A'),
      q('Financial investigation is initiated when:', ['Suspicion of illegal activity exists under law', 'Random checks occur', 'Media requests', 'Social pressure'], 'A'),
      q('Money laundering investigations focus on:', ['Tracking illegal origin of funds', 'Legal savings', 'Salary payments', 'Banking advertisements'], 'A'),
      q('Suspicious transaction reporting is required by:', ['Financial compliance laws', 'Social media rules', 'Traffic law', 'Property law'], 'A'),
      q('Asset seizure is allowed when:', ['Court or authority links assets to illegal activity', 'Person is wealthy', 'Account is active', 'Media reports suspicion'], 'A'),
      q('Tax evasion investigation requires:', ['Legal evidence or audit process', 'Public rumor', 'Political opinion', 'Guesswork'], 'A'),
      q('Regulatory inspections of businesses must be:', ['Lawful and documented', 'Secret and random only', 'Based on personal interest', 'Media driven'], 'A'),
      q('Financial compliance laws exist to:', ['Prevent fraud and ensure transparency', 'Increase corruption', 'Reduce banking', 'Avoid regulation'], 'A'),
      q('Confiscation of illegal proceeds requires:', ['Legal due process', 'Verbal order only', 'Social approval', 'Media consent'], 'A'),
      q('Economic offenses are treated seriously because:', ['They affect public trust and economy', 'They are minor always', 'They are private issues', 'They have no impact'], 'A'),
      q('Arrest without warrant must always be:', ['Based on legal grounds and recorded', 'Informal', 'Secret', 'Optional'], 'A'),
      q('Rights of an arrested person include:', ['Right to counsel and fair treatment', 'No rights', 'Immediate punishment', 'Media trial'], 'A'),
      q('Evidence obtained illegally:', ['May be challenged in court', 'Always accepted', 'Becomes stronger', 'Cannot be questioned'], 'A'),
      q('Bail can be denied when:', ['Risk of absconding or interference exists', 'Accused is poor', 'Lawyer is absent', 'Case is old'], 'A'),
      q('Police custody is limited because:', ['Legal safeguards protect against abuse', 'Police have full authority', 'Courts are irrelevant', 'Media decides'], 'A'),
      q('FIR is:', ['Initial complaint report', 'Final judgment', 'Appeal', 'Verdict'], 'A'),
      q('Investigation purpose is to:', ['Discover truth objectively', 'Punish immediately', 'Replace court', 'Public opinion'], 'A'),
      q('False imprisonment is:', ['Illegal detention without authority', 'Legal arrest', 'Bail condition', 'Court order'], 'A'),
      q('Rule of law ensures:', ['Equality before law', 'Executive dominance', 'Judicial absence', 'Public control'], 'A'),
      q('Abuse of power means:', ['Misuse of legal authority', 'Proper enforcement', 'Court decision', 'Lawful action'], 'A'),
      q('Accountability requires:', ['Answerability of officials', 'No oversight', 'Private decision-making', 'Secret governance'], 'A'),
      q('Transparency helps reduce:', ['Corruption and misuse', 'Efficiency', 'Law enforcement', 'Public awareness'], 'A'),
      q('Human rights can only be restricted when:', ['Law allows it under necessity and proportionality', 'Authorities want', 'Media demands', 'Social pressure exists'], 'A'),
      q('Emergency powers must be:', ['Temporary and legally controlled', 'Permanent', 'Unlimited', 'Secret'], 'A'),
      q('The legal system ultimately aims to:', ['Balance liberty, order, and justice', 'Increase state control only', 'Remove rights', 'Avoid disputes entirely'], 'A'),
      ]),
      makeQuiz('scenario-based-l2', 'Scenario-Based Legal Awareness (Level 2)', 'Search, arrest, cyber law, property entry, and accountability scenarios.', 'advanced', [
      q('Police may generally conduct a search without a warrant when:', ['They suspect a crime based on rumor', 'There is immediate risk of evidence being destroyed', 'A neighbor requests it', 'Media reports a crime'], 'B'),
      q('A warrantless arrest is most likely lawful when:', ['Police have no reason', 'A person is caught committing a cognizable offense', 'A complaint is anonymous', 'A family member requests it'], 'B'),
      q('Police entering a private home without warrant is usually allowed when:', ['They want routine inspection', 'There is emergency threat to life or safety', 'The owner refuses entry', 'They are investigating any minor complaint'], 'B'),
      q('A search without warrant may be justified if:', ['Court is closed and urgent evidence risk exists', 'Police feel curious', 'Media demands action', 'A witness suggests suspicion'], 'B'),
      q('Detention without formal arrest is lawful when:', ['No reason is given', 'Short preventive questioning under legal limits is permitted', 'Police dislike the person', 'Social media accusation exists'], 'A'),
      q('A person can be arrested without warrant if:', ['They are suspected of any offense', 'They are found committing a serious offense in presence of police', 'They refuse to talk', 'Someone complains'], 'B'),
      q('Police must avoid warrantless search when:', ['Consent is given voluntarily', 'Legal emergency conditions are absent', 'Crime is serious', 'Evidence is visible'], 'B'),
      q('A frisk/search in public is generally allowed when:', ['There is reasonable suspicion of danger or illegal items', 'Police feel like it', 'A person is poor', 'It is daytime'], 'A'),
      q('Entry without warrant in emergencies is justified when:', ['There is threat to life, fire, or urgent danger', 'Officer is new', 'Complaint is verbal', 'Area is crowded'], 'A'),
      q('Arrest becomes illegal when:', ['Procedure is followed', 'There is no lawful basis or authority', 'Police file report', 'Court is informed'], 'B'),
      q('A confession is invalid when:', ['Given voluntarily', 'Obtained under coercion or torture', 'Recorded properly', 'Given in court'], 'B'),
      q('Police must inform arrest reason because:', ['It is procedural fairness requirement', 'It is optional', 'It delays case', 'It is media policy'], 'A'),
      q('A person can refuse search when:', ['Police have valid warrant or legal exception', 'No legal authority exists', 'Crime is serious', 'Officer is senior'], 'B'),
      q('Bail is generally denied when:', ['Offense is non-serious', 'There is risk of flight or interference with justice', 'Accused is poor', 'Lawyer is absent'], 'B'),
      q('Evidence collected illegally:', ['Is always valid', 'May be challenged in court', 'Becomes stronger automatically', 'Cannot be questioned'], 'B'),
      q('Police custody is limited because:', ['Of human rights and legal safeguards', 'Police power is unlimited', 'Courts are irrelevant', 'Public opinion decides'], 'A'),
      q('Arrest without warrant must:', ['Follow legal conditions and documentation', 'Be secret', 'Be based on suspicion only', 'Be informal'], 'A'),
      q('A person must be produced before court because:', ['To ensure judicial oversight', 'For media coverage', 'For police approval', 'For family permission'], 'A'),
      q('Illegal detention violates:', ['Property law', 'Fundamental rights', 'Traffic law', 'Banking law'], 'B'),
      q('Search of digital devices without authority may violate:', ['Cyber privacy laws', 'Tax laws', 'Civil marriage laws', 'Labor law'], 'A'),
      q('Authorities may access digital data without warrant when:', ['Law provides emergency cyber threat provisions', 'They want curiosity', 'Social media reports crime', 'User is online'], 'A'),
      q('Phone search is legal without warrant if:', ['Consent is freely given', 'Police are suspicious', 'Device is old', 'Location is public'], 'A'),
      q('Data seizure is justified when:', ['Evidence is at risk of deletion', 'No reason exists', 'Complaint is anonymous', 'User refuses unlock'], 'A'),
      q('Cyber investigation requires:', ['Legal authorization and procedure', 'No rules', 'Public approval', 'Media request'], 'A'),
      q('Password forcing by police is:', ['Always allowed', 'Restricted by law in most systems', 'Mandatory', 'Encouraged'], 'A'),
      q('Digital privacy is protected under:', ['Cyber laws and constitutional rights', 'Traffic laws', 'Property law only', 'Corporate policy'], 'B'),
      q('Online surveillance must be:', ['Legally authorized and proportionate', 'Secret always', 'Unlimited', 'Random'], 'A'),
      q('Unauthorized hacking by authorities is:', ['Legal', 'Illegal unless strictly authorized', 'Encouraged', 'Neutral'], 'A'),
      q('Police may enter private property without warrant when:', ['There is emergency danger (fire, violence, threat)', 'Owner refuses entry', 'Neighbors complain', 'Area is suspicious'], 'A'),
      q('Forced entry is justified when:', ['Immediate rescue or danger prevention is needed', 'Investigation is routine', 'Officer wants inspection', 'Complaint exists only'], 'A'),
      q('Search of vehicle without warrant is allowed when:', ['Reasonable suspicion of crime or danger exists', 'Driver is slow', 'Road is busy', 'Vehicle is expensive'], 'A'),
      q('Emergency search is valid when:', ['Delay may destroy evidence or risk safety', 'Police prefer it', 'Public demands it', 'Media reports it'], 'A'),
      q('Entry into home without consent is illegal unless:', ['Law permits emergency or warrant exists', 'Officer requests politely', 'Area is crowded', 'Complaint is verbal'], 'A'),
      q('Property seizure requires:', ['Legal authority or court order', 'Verbal instruction', 'Media report', 'Social approval'], 'A'),
      q('Emergency powers must be:', ['Proportionate and legally controlled', 'Unlimited', 'Secret', 'Permanent'], 'A'),
      q('Fundamental rights can be restricted only when:', ['Law permits for public interest and necessity', 'Government wants', 'Police decide', 'Media demands'], 'A'),
      q('Accountability ensures:', ['Power is checked by law', 'Unlimited authority', 'No review', 'Hidden decisions'], 'A'),
      q('Arbitrary action means:', ['Lawful decision', 'Without legal basis or fairness', 'Judicial order', 'Administrative rule'], 'A'),
      q('Rule of law prevents:', ['Equal application of law', 'Abuse of power', 'Justice system', 'Legal rights'], 'B'),
      q('Right to privacy may be limited when:', ['Lawful investigation with proper authority exists', 'Someone is popular', 'Public curiosity exists', 'Media requests'], 'B'),
      q('Search and seizure must always be:', ['Reasonable and legally justified', 'Random', 'Secret only', 'Optional'], 'A'),
      q('Government powers in emergencies must:', ['Follow legal safeguards', 'Ignore constitution', 'Be unlimited', 'Be permanent'], 'A'),
      q('Citizen rights are protected by:', ['Constitution and courts', 'Police only', 'Media only', 'Private companies'], 'A'),
      q('Abuse of power includes:', ['Legal enforcement', 'Misuse of authority beyond law', 'Court judgment', 'Investigation'], 'A'),
      q('Legal systems balance:', ['State power and individual rights', 'Only government control', 'Only police authority', 'Only public opinion'], 'A'),
      ]),
      makeQuiz('difficult-l1', 'Difficult Legal Reasoning (Level 1)', 'Multi-domain constitutional, criminal, evidence, and cyber law assessment.', 'advanced', [
      q('A constitution is considered “living” when:', ['It is frequently rewritten', 'It is interpreted dynamically to adapt to societal changes', 'It is replaced every decade', 'It has no written form'], 'B'),
      q('Judicial independence is primarily protected to:', ['Strengthen executive authority', 'Ensure impartial adjudication of disputes', 'Limit public participation', 'Control legislative power'], 'B'),
      q('The doctrine of proportionality in law ensures:', ['Punishment must be random', 'State action must be balanced and not excessive', 'Laws apply only to minorities', 'Courts avoid review'], 'B'),
      q('Constitutional interpretation primarily involves:', ['Literal reading only', 'Determining meaning and application of legal provisions', 'Ignoring legislative intent', 'Political influence'], 'B'),
      q('Federalism refers to:', ['Centralized government structure', 'Division of powers between central and regional authorities', 'Military governance', 'Judicial supremacy only'], 'B'),
      q('Delegated legislation is subject to:', ['No control', 'Judicial and parliamentary oversight', 'Public voting', 'Media approval'], 'B'),
      q('A constitutional amendment becomes invalid if it:', ['Changes taxation laws', 'Violates fundamental constitutional structure', 'Is passed unanimously', 'Is published late'], 'B'),
      q('The principle of legality requires:', ['Laws must be clear, certain, and non-retrospective', 'Laws can be secret', 'Laws apply only to courts', 'Laws change daily'], 'A'),
      q('Separation of powers prevents:', ['Abuse of authority by concentration of power', 'Judicial review', 'Elections', 'Law enforcement'], 'A'),
      q('Constitutional supremacy implies:', ['Constitution overrides all other laws', 'Parliament is above constitution', 'Courts are above constitution', 'Executive can ignore laws'], 'A'),
      q('Mens rea is best described as:', ['Physical act of crime', 'Mental intention or knowledge of wrongdoing', 'Evidence collection', 'Judicial decision'], 'B'),
      q('Actus reus refers to:', ['Criminal intent', 'Physical act of offense', 'Court procedure', 'Bail conditions'], 'B'),
      q('Strict liability offenses require:', ['No proof of intent', 'Proof of intent always', 'Jury trial only', 'Civil dispute only'], 'A'),
      q('Presumption of innocence means:', ['Accused is treated as guilty', 'Accused is innocent until proven guilty', 'Police decide guilt', 'Media decides outcome'], 'B'),
      q('Burden of proof generally lies on:', ['Accused', 'Prosecution', 'Witness', 'Judge'], 'B'),
      q('Double jeopardy protects against:', ['Multiple punishments for same offense', 'Multiple trials for different crimes', 'Civil lawsuits', 'Appeals'], 'A'),
      q('Habeas corpus protects against:', ['Illegal detention', 'Tax evasion', 'Contract disputes', 'Property loss'], 'A'),
      q('Bail is:', ['Final punishment', 'Temporary release pending trial', 'Conviction order', 'Appeal decision'], 'B'),
      q('A confession obtained under coercion is:', ['Always valid', 'Generally inadmissible', 'Required evidence', 'Automatically accepted'], 'B'),
      q('Criminal liability requires:', ['Only suspicion', 'Act and intent in most cases', 'Media coverage', 'Police report only'], 'A'),
      q('Direct evidence refers to:', ['Evidence that directly proves a fact', 'Indirect inference', 'Opinion only', 'Rumors'], 'A'),
      q('Circumstantial evidence:', ['Requires inference to prove fact', 'Is always invalid', 'Is irrelevant', 'Is illegal'], 'A'),
      q('Hearsay evidence is:', ['First-hand testimony', 'Second-hand information not directly observed', 'Physical proof', 'Documentary evidence'], 'B'),
      q('Chain of custody ensures:', ['Integrity of evidence handling', 'Court hierarchy', 'Police authority', 'Media control'], 'A'),
      q('Primary evidence includes:', ['Original documents', 'Copies only', 'Opinions', 'Summaries'], 'A'),
      q('Expert evidence is used when:', ['Specialized knowledge is required', 'Public opinion is needed', 'No law exists', 'Judge is absent'], 'A'),
      q('Relevance of evidence depends on:', ['Logical connection to facts in issue', 'Popularity', 'Media attention', 'Witness status'], 'A'),
      q('Admissibility of evidence is determined by:', ['Legal rules of procedure', 'Public vote', 'Police discretion', 'Media reports'], 'A'),
      q('Cybercrime includes:', ['Any illegal act involving digital systems', 'Only hacking', 'Only fraud', 'Only social media use'], 'A'),
      q('Phishing attacks primarily rely on:', ['Social engineering deception', 'Physical force', 'Legal notices', 'Court orders'], 'A'),
      q('Data protection laws regulate:', ['Use and storage of personal data', 'Trade tariffs', 'Criminal sentencing', 'Traffic rules'], 'B'),
      q('Unauthorized access to systems is:', ['Legal with intent', 'Criminal offense', 'Civil dispute only', 'Administrative issue'], 'A'),
      q('Digital evidence must be:', ['Authentic and unaltered', 'Edited for clarity', 'Anonymous', 'Publicly posted'], 'A'),
      q('Online defamation involves:', ['Harmful false statements online', 'Political opinion', 'Advertising', 'Personal expression always'], 'A'),
      q('Encryption primarily ensures:', ['Data security and confidentiality', 'Public access', 'Data deletion', 'Legal immunity'], 'A'),
      q('Natural justice includes:', ['Fair hearing and impartiality', 'Secret decision-making', 'Arbitrary punishment', 'Political bias'], 'A'),
      q('Audi alteram partem means:', ['Hear the other side', 'Punish immediately', 'Ignore evidence', 'Rule by force'], 'A'),
      q('Judicial review allows courts to:', ['Review legality of administrative actions', 'Create laws', 'Enforce taxes', 'Conduct elections'], 'A'),
      q('Ultra vires actions are:', ['Within authority', 'Beyond legal authority', 'Always valid', 'Judicial orders'], 'A'),
      q('Legitimate expectation refers to:', ['Fair treatment based on prior conduct of authority', 'Guaranteed outcome', 'Political promise', 'Public demand'], 'A'),
      q('Administrative discretion must be:', ['Reasonable and legally guided', 'Unlimited', 'Secret', 'Random'], 'A'),
      q('Rule of law ensures:', ['Equality before law and accountability', 'Executive supremacy', 'Judicial immunity', 'Lawlessness'], 'A'),
      q('Transparency in governance reduces:', ['Corruption and misuse of power', 'Accountability', 'Legal certainty', 'Public awareness'], 'A'),
      q('Public accountability means:', ['Officials are answerable for actions', 'No oversight', 'Private decision-making', 'Hidden governance'], 'A'),
      q('Human rights are:', ['Universal and inalienable protections', 'Government privileges', 'Temporary benefits', 'Optional freedoms'], 'A'),
      ])
    ],
  },
  {
    id: 'constitutional',
    title: 'Constitutional & Governance',
    description: 'Constitutional law, civic governance, and public legal awareness.',
    icon: '🏛️',
    color: '#2563EB',
    quizzes: [
      makeQuiz('multi-domain-l3', 'Multi-Domain Legal Intelligence (Level 3)', 'International law, family law, contracts, policing, and public administration.', 'advanced', [
      q('International law primarily governs:', ['Relations between private companies', 'Relations between sovereign states', 'Local traffic systems', 'Internal business contracts'], 'B'),
      q('A treaty becomes binding when:', ['Signed and ratified by states according to their legal systems', 'Approved by media', 'Published online', 'Announced by NGOs'], 'A'),
      q('Sovereignty of a state refers to:', ['Complete independence in internal and external affairs', 'Economic strength only', 'Military power only', 'Population size'], 'A'),
      q('The United Nations primarily aims to:', ['Promote international peace and cooperation', 'Replace national governments', 'Control private businesses', 'Enforce tax laws'], 'A'),
      q('Customary international law is based on:', ['Repeated state practice accepted as law', 'Court gossip', 'Social media trends', 'Political speeches'], 'A'),
      q('Diplomatic immunity protects:', ['Diplomats from legal jurisdiction in host states (with limits)', 'All citizens from law', 'Criminal acts', 'Military actions'], 'A'),
      q('Humanitarian law applies during:', ['Armed conflict situations', 'Tax disputes', 'Civil contracts', 'Election campaigns'], 'A'),
      q('Extradition refers to:', ['Transfer of accused persons between states for prosecution', 'Trade agreement', 'Property transfer', 'Civil settlement'], 'A'),
      q('A breach of international law may lead to:', ['Diplomatic or legal consequences', 'Automatic imprisonment globally', 'No consequences', 'Private lawsuits only'], 'A'),
      q('International courts mainly:', ['Resolve disputes between states or serious international crimes', 'Handle local disputes', 'Replace national courts', 'Write constitutions'], 'A'),
      q('Marriage consent must be:', ['Free and voluntary', 'Forced by family', 'Based on financial pressure', 'Based on community approval only'], 'A'),
      q('Child marriage laws primarily aim to:', ['Protect minors from early and forced marriage', 'Increase population', 'Reduce education', 'Control inheritance'], 'A'),
      q('Polygamy legality depends on:', ['Applicable personal/family laws', 'Social media approval', 'Wealth status', 'Education level'], 'A'),
      q('Custody decisions are based on:', ['Best interests of the child', 'Parent income only', 'Public opinion', 'Gender only'], 'A'),
      q('Divorce law generally requires:', ['Legal procedure and valid grounds or mutual consent', 'Informal separation only', 'Religious declaration only', 'Police approval'], 'A'),
      q('Maintenance/alimony refers to:', ['Financial support after separation/divorce', 'Property transfer only', 'Criminal penalty', 'Tax relief'], 'A'),
      q('Guardianship refers to:', ['Legal responsibility for a minor or dependent', 'Property ownership', 'Employment contract', 'Voting rights'], 'A'),
      q('Inheritance disputes are resolved under:', ['Succession laws', 'Traffic laws', 'Cyber laws', 'Banking laws'], 'A'),
      q('Adoption legally establishes:', ['Parent-child relationship by law', 'Temporary custody only', 'Employment contract', 'Property ownership'], 'A'),
      q('Domestic relations law primarily deals with:', ['Family relationships and obligations', 'Criminal offenses only', 'International trade', 'Corporate law'], 'A'),
      q('A valid contract requires:', ['Offer, acceptance, lawful consideration, capacity', 'Social approval', 'Verbal promise only', 'Government stamp only'], 'A'),
      q('Consideration means:', ['Something of value exchanged between parties', 'Government approval', 'Emotional agreement', 'Witness statement'], 'A'),
      q('Breach of contract occurs when:', ['One party fails to fulfill obligations', 'Both parties agree', 'Contract is written', 'Contract is registered'], 'A'),
      q('Void contract means:', ['Legally unenforceable from the beginning', 'Fully valid', 'Criminal contract', 'Government approved'], 'A'),
      q('Misrepresentation in contract law refers to:', ['False statement inducing agreement', 'Honest negotiation', 'Legal drafting', 'Contract renewal'], 'A'),
      q('Fraud in contract law involves:', ['Intentional deception', 'Honest mistake', 'Delay in payment', 'Negotiation'], 'A'),
      q('Capacity to contract requires:', ['Legal ability (age, mental competence)', 'Wealth only', 'Social status', 'Employment'], 'A'),
      q('Liquidated damages are:', ['Pre-agreed compensation for breach', 'Criminal penalties', 'Taxes', 'Insurance premiums'], 'A'),
      q('Offer becomes binding when:', ['Accepted unconditionally', 'Published', 'Advertised', 'Discussed'], 'A'),
      q('A unilateral contract involves:', ['One party’s promise in exchange for act', 'Two written contracts', 'Government contract', 'Verbal agreement only'], 'A'),
      q('Police authority must always be:', ['Lawful and proportionate', 'Unlimited', 'Secret', 'Based on opinion'], 'A'),
      q('Search warrants are required to:', ['Authorize lawful searches', 'Increase police power without limit', 'Replace courts', 'Avoid documentation'], 'A'),
      q('Arrest without warrant is generally allowed when:', ['Law permits in specific serious circumstances', 'Police prefer', 'Media requests', 'Public demands'], 'A'),
      q('Custodial rights include:', ['Right to legal counsel and fair treatment', 'No rights', 'Public punishment', 'Immediate conviction'], 'A'),
      q('Evidence collection must follow:', ['Legal procedure to ensure admissibility', 'Informal methods', 'Public opinion', 'Media guidance'], 'A'),
      q('Chain of custody ensures:', ['Evidence integrity', 'Police hierarchy', 'Trial speed', 'Public access'], 'A'),
      q('Investigation purpose is to:', ['Establish facts objectively', 'Prove guilt immediately', 'Punish suspects', 'Replace courts'], 'A'),
      q('False arrest refers to:', ['Illegal detention without legal basis', 'Legal custody', 'Bail release', 'Trial procedure'], 'A'),
      q('Public office holders must act:', ['In public interest and lawfully', 'For personal benefit', 'Without rules', 'Privately'], 'A'),
      q('Conflict of interest occurs when:', ['Personal interest affects official duty', 'Duties are clear', 'Laws are followed', 'Decisions are transparent'], 'A'),
      q('Accountability in governance means:', ['Answerability for decisions and actions', 'No reporting required', 'Private decision-making', 'Absolute authority'], 'A'),
      q('Corruption undermines:', ['Trust and institutional integrity', 'Transparency', 'Rule of law strength', 'Legal compliance'], 'A'),
      q('Public procurement requires:', ['Fair and transparent process', 'Secret contracts', 'Personal selection', 'No documentation'], 'A'),
      q('Administrative fairness requires:', ['Impartial decision-making', 'Bias', 'Hidden decisions', 'Favoritism'], 'A'),
      q('Ethical governance strengthens:', ['Public trust and legal stability', 'Corruption', 'Inequality', 'Arbitrary rule'], 'A'),
      ]),
      makeQuiz('constitutional-l2', 'Constitutional & Governance Law (Level 2)', 'Constitutional principles, criminal procedure, evidence, and civic rights.', 'intermediate', [
      q('A “constitutional supremacy” system means:', ['Parliament is above all institutions', 'Constitution is the highest legal authority', 'Courts are above constitution', 'Executive can override laws'], 'B'),
      q('Doctrine of “basic structure” primarily limits:', ['Judicial independence', 'Constitutional amendments that destroy core principles', 'Tax laws', 'Police powers'], 'B'),
      q('Delegated legislation refers to:', ['Laws made by parliament only', 'Rules made by authorized bodies under statute', 'Judicial decisions', 'International treaties only'], 'B'),
      q('A “writ jurisdiction” empowers courts to:', ['Enforce fundamental rights', 'Collect taxes', 'Draft laws', 'Conduct elections'], 'A'),
      q('Doctrine of “separation of powers” ensures:', ['Concentration of authority', 'Functional independence of branches of government', 'Military control', 'Judicial control over legislature only'], 'B'),
      q('A “bill of rights” primarily protects:', ['Government powers', 'Individual liberties', 'Corporate interests', 'Military authority'], 'B'),
      q('Judicial activism refers to:', ['Courts avoiding cases', 'Courts actively interpreting constitution to protect rights', 'Police investigations', 'Legislative drafting'], 'B'),
      q('Administrative discretion must be:', ['Unlimited', 'Guided by law and reason', 'Secret', 'Based on public opinion only'], 'B'),
      q('Ultra vires actions are:', ['Within legal authority', 'Beyond legal authority', 'Court-approved acts', 'Constitutional amendments'], 'B'),
      q('Rule of law excludes:', ['Arbitrary power', 'Equal application of law', 'Accountability', 'Legal certainty'], 'A'),
      q('Burden of proof in criminal cases lies on:', ['Accused', 'Prosecution', 'Public', 'Judge'], 'B'),
      q('Standard of proof in criminal law is:', ['Balance of probabilities', 'Beyond reasonable doubt', 'Suspicion', 'Majority opinion'], 'B'),
      q('Chain of custody refers to:', ['Movement of accused', 'Documentation of evidence handling', 'Court hierarchy', 'Police jurisdiction'], 'B'),
      q('Habeas corpus is used to:', ['Challenge unlawful detention', 'File civil disputes', 'Appeal tax cases', 'Register FIR'], 'A'),
      q('Cognizable offenses allow police to:', ['Arrest without warrant (subject to law)', 'Only investigate', 'Ignore complaint', 'Refer to civil court only'], 'A'),
      q('Acquittal means:', ['Conviction', 'Legal finding of not guilty', 'Sentencing', 'Investigation'], 'A'),
      q('Double jeopardy protects against:', ['Multiple punishments for same offense', 'Multiple hearings in civil cases', 'Appeals', 'Police inquiry'], 'A'),
      q('Mens rea refers to:', ['Physical act', 'Mental intent', 'Evidence type', 'Judgment'], 'A'),
      q('Bail is:', ['Punishment', 'Temporary release under conditions', 'Conviction', 'Appeal'], 'A'),
      q('Plea bargaining involves:', ['Negotiated settlement of criminal charges', 'Court judgment only', 'Jury trial', 'Police interrogation'], 'A'),
      q('Admissible evidence must be:', ['Relevant and legally obtained', 'Rumors', 'Anonymous posts', 'Media reports only'], 'A'),
      q('Hearsay evidence is:', ['First-hand testimony', 'Indirect/second-hand information', 'Physical evidence', 'Expert opinion'], 'A'),
      q('Primary evidence refers to:', ['Original documents', 'Photocopies only', 'Opinions', 'Reports'], 'B'),
      q('Burden of proof generally:', ['Shifts between parties depending on claims', 'Always on judge', 'Always on police', 'Always on defense'], 'A'),
      q('Expert testimony is used when:', ['Technical knowledge is required', 'Public opinion is needed', 'Law is unclear', 'Judge is unavailable'], 'A'),
      q('Circumstantial evidence:', ['Directly proves fact', 'Indirectly suggests fact', 'Is always invalid', 'Is illegal'], 'A'),
      q('Confession must be:', ['Voluntary', 'Forced', 'Public', 'Anonymous'], 'A'),
      q('Presumption of law means:', ['Legal assumption until disproved', 'Final judgment', 'Police opinion', 'Media conclusion'], 'A'),
      q('Documentary evidence includes:', ['Written records', 'Oral statements', 'Rumors', 'Social media posts only'], 'A'),
      q('Relevance of evidence depends on:', ['Logical connection to facts in issue', 'Public popularity', 'Media coverage', 'Witness personality'], 'B'),
      q('Administrative law governs:', ['Private relationships', 'Government actions and decisions', 'Criminal punishment only', 'International trade only'], 'A'),
      q('Natural justice includes:', ['Fair hearing and impartial decision-making', 'Secret trials', 'Arbitrary punishment', 'Political decisions'], 'A'),
      q('Audi alteram partem means:', ['Hear the other side', 'Rule of force', 'Law of punishment', 'Executive power'], 'A'),
      q('Bias in decision-making leads to:', ['Fair justice', 'Invalid administrative decisions', 'Faster trials', 'Stronger laws'], 'B'),
      q('Judicial review ensures:', ['Government accountability', 'Executive supremacy', 'Legislative immunity', 'Police independence'], 'A'),
      q('A public authority must act:', ['Within legal limits', 'Without rules', 'Based on opinion only', 'Privately'], 'A'),
      q('Legitimate expectation refers to:', ['Public trust in fair administrative action', 'Guaranteed outcomes', 'Political promises', 'Media expectations'], 'A'),
      q('Reasoned decision-making requires:', ['Explanation of legal grounds', 'No justification', 'Oral decisions only', 'Secret rulings'], 'A'),
      q('Transparency in governance ensures:', ['Accountability and public trust', 'Secrecy', 'Reduced oversight', 'Faster corruption'], 'A'),
      q('Right to information promotes:', ['Access to public records', 'Government secrecy', 'Restricted access', 'Private control'], 'A'),
      q('Ethics in public service requires:', ['Integrity and impartiality', 'Favoritism', 'Corruption', 'Bias'], 'A'),
      q('Public accountability means:', ['Officials are answerable for actions', 'No oversight', 'No reporting', 'Hidden governance'], 'A'),
      q('Good governance is based on:', ['Rule of law and transparency', 'Arbitrary power', 'Personal influence', 'Unchecked authority'], 'A'),
      q('Civic engagement includes:', ['Participation in democratic processes', 'Avoiding society', 'Ignoring laws', 'Political silence'], 'A'),
      q('The primary purpose of law in society is:', ['To regulate behavior and ensure justice', 'To create conflict', 'To restrict rights only', 'To increase bureaucracy'], 'A'),
      ]),
      makeQuiz('civic-citizens', 'Civic Legal Literacy for Citizens', 'Constitutional, criminal, cyber, financial, property, labour, and civic duties.', 'intermediate', [
      q('The "rule of law" primarily ensures that:', ['Laws apply equally to all individuals and institutions', 'Only judges can create laws', 'Government decisions cannot be challenged', 'Laws apply only to citizens'], 'A'),
      q('Separation of powers refers to:', ['Division of government into legislative, executive, and judicial branches', 'Separation of citizens from government', 'Military control over civil institutions', 'Private companies making laws'], 'A'),
      q('Judicial independence means:', ['Courts operate free from external influence or pressure', 'Courts follow public opinion', 'Judges follow executive orders', 'Courts cannot interpret laws'], 'B'),
      q('Fundamental rights are:', ['Privileges granted temporarily', 'Constitutional protections guaranteed to individuals', 'Business policies', 'Administrative instructions'], 'A'),
      q('A constitution primarily serves to:', ['Define structure of the state and protect rights', 'Replace all laws', 'Control private businesses', 'Manage taxation only'], 'A'),
      q('Equality before law means:', ['Equal treatment under similar legal circumstances', 'Same punishment for all crimes', 'Equal wealth distribution', 'Equal political power'], 'A'),
      q('Due process requires:', ['Legal procedures must be fair and followed', 'Immediate punishment without hearing', 'Public approval for judgments', 'Police discretion without limits'], 'A'),
      q('Ultra vires actions are:', ['Actions beyond legal authority', 'Legal government acts', 'Judicial decisions', 'Constitutional amendments'], 'A'),
      q('Judicial review allows courts to:', ['Examine legality of laws or actions', 'Create new taxes', 'Enforce executive decisions', 'Replace legislation'], 'A'),
      q('A written constitution is important because:', ['It provides clarity and legal certainty', 'It removes judicial authority', 'It prevents elections', 'It eliminates disputes completely'], 'A'),
      q('Presumption of innocence means:', ['A person is considered innocent until proven guilty', 'Accused is automatically guilty', 'Police decide guilt', 'Public opinion determines verdict'], 'A'),
      q('Bail is:', ['Temporary release of accused under conditions', 'Final punishment', 'Evidence collection method', 'Appeal process'], 'A'),
      q('Mens rea refers to:', ['Mental intention to commit a crime', 'Physical injury', 'Court procedure', 'Police report'], 'A'),
      q('Actus reus refers to:', ['Physical act of committing a crime', 'Legal judgment', 'Evidence submission', 'Appeal process'], 'A'),
      q('A confession obtained through coercion is:', ['Generally inadmissible in law', 'Always valid', 'Automatically accepted', 'Encouraged'], 'A'),
      q('Double jeopardy means:', ['A person cannot be tried twice for the same offense', 'Two crimes committed together', 'Two punishments for one crime', 'Two courts hearing same case simultaneously'], 'A'),
      q('Criminal liability requires:', ['Both intention and act in most cases', 'Only suspicion', 'Public opinion', 'Media coverage'], 'A'),
      q('A FIR (First Information Report) is:', ['Initial complaint recorded with police', 'Final judgment', 'Appeal document', 'Court verdict'], 'A'),
      q('Evidence in criminal law must generally be:', ['Relevant and legally admissible', 'Rumor-based', 'Anonymous always', 'Unverified'], 'A'),
      q('A witness has the legal duty to:', ['Provide truthful testimony', 'Support one party', 'Hide facts', 'Refuse court appearance'], 'A'),
      q('Cybercrime includes:', ['Illegal acts involving digital systems', 'Only hacking', 'Only social media use', 'Internet browsing'], 'A'),
      q('Data protection laws aim to:', ['Safeguard personal information', 'Increase data sharing', 'Eliminate privacy', 'Promote hacking'], 'A'),
      q('Unauthorized access to a system is:', ['Illegal under cyber laws', 'Acceptable if no damage occurs', 'Encouraged for learning', 'Legal with intent'], 'A'),
      q('Digital evidence must be:', ['Authentic and verifiable', 'Always anonymous', 'Edited before submission', 'Publicly posted'], 'A'),
      q('Online defamation refers to:', ['Harmful false statements made online', 'Any online opinion', 'Advertising content', 'Political speech only'], 'A'),
      q('Money laundering refers to:', ['Concealing illegal money origins', 'Saving money in banks', 'Paying taxes', 'Legal investment'], 'A'),
      q('Banks are required to:', ['Follow regulatory compliance and verification procedures', 'Share customer data freely', 'Guarantee profits', 'Avoid documentation'], 'A'),
      q('KYC (Know Your Customer) is used to:', ['Verify identity of customers', 'Increase fraud', 'Avoid banking rules', 'Hide transactions'], 'A'),
      q('Interest rates are:', ['Cost of borrowing money', 'Government penalties', 'Fixed taxes', 'Legal fines'], 'A'),
      q('Fraudulent financial schemes often:', ['Promise unrealistic returns', 'Provide transparency', 'Follow regulation', 'Ensure safety'], 'A'),
      q('Ownership of property is established through:', ['Legal documentation and registration', 'Verbal agreement only', 'Social media proof', 'Informal promises'], 'A'),
      q('Trespassing refers to:', ['Unauthorized entry into property', 'Renting property', 'Buying land', 'Legal access'], 'A'),
      q('A valid contract requires:', ['Offer, acceptance, and lawful consideration', 'Verbal agreement only', 'Witness popularity', 'Government approval always'], 'A'),
      q('Civil disputes typically involve:', ['Private rights between individuals', 'Criminal punishment', 'Military action', 'Public protests'], 'A'),
      q('Inheritance laws govern:', ['Transfer of property after death', 'Business licensing', 'Tax collection', 'Traffic rules'], 'A'),
      q('Labour laws primarily protect:', ['Workers’ rights and working conditions', 'Only employers', 'Only governments', 'Only unions'], 'A'),
      q('A safe workplace is:', ['A legal requirement in many jurisdictions', 'Optional', 'Employee responsibility only', 'Not regulated'], 'A'),
      q('Wrongful termination refers to:', ['Illegal dismissal of an employee', 'Retirement', 'Promotion', 'Resignation'], 'A'),
      q('Employment contracts define:', ['Rights and obligations of employer and employee', 'Personal friendships', 'Government taxes', 'Social media rules'], 'A'),
      q('Workplace discrimination is:', ['Unequal treatment based on protected characteristics', 'Salary negotiation', 'Job training', 'Attendance rules'], 'A'),
      q('Voting is:', ['A constitutional right and civic duty', 'Optional entertainment', 'Illegal activity', 'Business transaction'], 'A'),
      q('Civic responsibility includes:', ['Following laws and respecting public order', 'Ignoring rules', 'Breaking regulations', 'Avoiding public participation'], 'A'),
      q('Public accountability ensures:', ['Government actions can be reviewed and questioned', 'No oversight exists', 'Officials are exempt', 'Laws are hidden'], 'A'),
      q('Taxation is used to:', ['Fund public services and infrastructure', 'Enrich individuals', 'Replace elections', 'Eliminate governance'], 'A'),
      q('Democracy is strengthened by:', ['Active citizen participation and awareness', 'Silence of citizens', 'Lack of elections', 'Centralized control only'], 'A'),
      ]),
      makeQuiz('public-awareness', 'Advanced Public Legal Awareness', 'Human rights, anti-corruption, road safety, consumer rights, and legal decision-making.', 'intermediate', [
      q('A person signs a contract without reading its terms. Which statement is generally most accurate?', ['The contract is automatically invalid.', 'A person may still be bound by terms they agreed to.', 'The contract becomes a criminal offense.', 'The contract is enforceable only if witnessed by a judge.'], 'B'),
      q('Why is the principle of "equality before the law" important?', ['It ensures everyone receives identical outcomes.', 'It requires laws to apply fairly regardless of status.', 'It eliminates judicial discretion.', 'It guarantees success in legal disputes.'], 'B'),
      q('Which situation most likely raises concerns regarding abuse of authority?', ['A public official follows established procedures.', 'A public official uses their position for personal benefit.', 'A public servant explains legal requirements.', 'An agency publishes public information.'], 'B'),
      q('A citizen receives an official document they do not understand. What is the most responsible course of action?', ['Ignore the document.', 'Seek clarification from the issuing authority or legal assistance.', 'Destroy the document.', 'Assume it has no legal effect.'], 'B'),
      q('Which principle is essential to a fair justice system?', ['Decisions based on public opinion.', 'Opportunity for parties to present their case.', 'Automatic punishment after accusation.', 'Secret application of laws.'], 'B'),
      q('Why should citizens maintain records of important transactions?', ['To assist in resolving future disputes.', 'To avoid taxes.', 'To increase legal fees.', 'To replace contracts.'], 'B'),
      q('Which action best demonstrates responsible citizenship?', ['Reporting unlawful conduct through proper channels.', 'Spreading unverified accusations.', 'Ignoring public safety concerns.', 'Interfering with investigations.'], 'A'),
      q('What is the primary purpose of legal documentation?', ['To create confusion.', 'To provide evidence and clarity regarding rights and obligations.', 'To increase bureaucracy only.', 'To replace verbal communication entirely.'], 'A'),
      q('Why are legal procedures important?', ['They help ensure fairness, consistency, and accountability.', 'They guarantee one party will win.', 'They eliminate the need for evidence.', 'They prevent disputes from occurring.'], 'B'),
      q('A person accused of wrongdoing should generally:', ['Be presumed guilty immediately.', 'Have an opportunity to respond to allegations.', 'Lose all legal rights.', 'Be punished before investigation.'], 'A'),
      q('Human rights are primarily intended to:', ['Protect the dignity and freedoms of individuals.', 'Increase government power.', 'Limit access to justice.', 'Restrict public participation.'], 'A'),
      q('Freedom of expression generally protects:', ['The right to hold and communicate opinions within legal limits.', 'The right to make any statement without consequences.', 'Only government-approved opinions.', 'Commercial advertising only.'], 'A'),
      q('Which action is most consistent with respecting human rights?', ['Treating individuals fairly regardless of background.', 'Denying services based on prejudice.', 'Limiting participation without justification.', 'Withholding legal protections arbitrarily.'], 'A'),
      q('The right to privacy is primarily concerned with:', ['Protection against unjustified intrusion into personal life.', 'Tax collection.', 'Public entertainment.', 'Business competition.'], 'A'),
      q('Which situation may raise concerns about discrimination?', ['Applying the same eligibility criteria to all applicants.', 'Treating individuals differently based solely on protected characteristics.', 'Conducting merit-based evaluations.', 'Following objective standards.'], 'B'),
      q('Corruption most commonly involves:', ['Misuse of entrusted power for private gain.', 'Following regulations carefully.', 'Maintaining transparent records.', 'Reporting misconduct.'], 'A'),
      q('Why is corruption harmful?', ['It undermines trust, fairness, and public confidence.', 'It improves accountability.', 'It strengthens institutions.', 'It reduces conflicts of interest.'], 'A'),
      q('A public official accepts money in exchange for preferential treatment. This is most likely:', ['A conflict of interest or bribery concern.', 'Administrative efficiency.', 'Public consultation.', 'Community service.'], 'A'),
      q('Transparency in public administration helps:', ['Reduce opportunities for misconduct.', 'Increase secrecy.', 'Eliminate accountability.', 'Prevent public participation.'], 'A'),
      q('Citizens can help combat corruption by:', ['Reporting suspected misconduct through lawful channels.', 'Ignoring unethical behavior.', 'Encouraging favoritism.', 'Avoiding public oversight.'], 'A'),
      q('Why do traffic laws exist?', ['To promote safety and orderly movement.', 'To increase travel time.', 'To discourage transportation.', 'To create unnecessary restrictions.'], 'A'),
      q('Which driver behavior presents a significant public safety risk?', ['Distracted driving.', 'Following road signs.', 'Maintaining safe distance.', 'Using indicators appropriately.'], 'A'),
      q('Road safety is primarily:', ['A shared responsibility among all road users.', 'The responsibility of police only.', 'The responsibility of drivers only.', 'The responsibility of pedestrians only.'], 'A'),
      q('Which factor contributes most to preventing accidents?', ['Awareness, compliance, and responsible behavior.', 'Luck alone.', 'Vehicle size only.', 'Road width only.'], 'A'),
      q('Why should accidents be reported when required by law?', ['To facilitate accountability and appropriate response.', 'To increase paperwork only.', 'To avoid insurance procedures.', 'To assign blame immediately.'], 'A'),
      q('Why should consumers verify terms before agreeing to a service?', ['To understand obligations and potential risks.', 'To increase transaction costs.', 'To avoid documentation.', 'To eliminate accountability.'], 'A'),
      q('Which practice most effectively protects consumers from fraud?', ['Independent verification of claims.', 'Blind trust in advertisements.', 'Immediate payment without review.', 'Ignoring warning signs.'], 'A'),
      q('A legitimate financial institution is most likely to:', ['Provide clear information regarding services and risks.', 'Guarantee profits without risk.', 'Request passwords by email.', 'Conceal all terms and conditions.'], 'A'),
      q('Why should citizens regularly monitor financial statements?', ['To identify errors or unauthorized activity.', 'To increase service charges.', 'To avoid financial planning.', 'To reduce account security.'], 'A'),
      q('Which behavior best demonstrates financial responsibility?', ['Reviewing agreements before committing funds.', 'Investing based solely on rumors.', 'Sharing account credentials.', 'Ignoring official communications.'], 'A'),
      q('Why is legal literacy important?', ['It helps citizens understand rights, responsibilities, and available remedies.', 'It eliminates all disputes.', 'It replaces professional advice.', 'It guarantees favorable outcomes.'], 'A'),
      q('Before signing a legal document, a citizen should:', ['Understand its contents and implications.', 'Sign immediately without review.', 'Rely entirely on assumptions.', 'Ignore important clauses.'], 'A'),
      q('Which principle best supports accountability in public institutions?', ['Transparency and oversight.', 'Secrecy and favoritism.', 'Arbitrary decision-making.', 'Lack of documentation.'], 'A'),
      q('Why should evidence be preserved during a dispute?', ['It may support factual determination and fair resolution.', 'It guarantees victory.', 'It replaces legal procedures.', 'It eliminates investigations.'], 'A'),
      q('Which statement best reflects the rule of law?', ['Individuals and institutions are accountable under the law.', 'Laws apply only to ordinary citizens.', 'Public officials are exempt from legal obligations.', 'Personal influence overrides legal requirements.'], 'A'),
      ])
    ],
  },
  {
    id: 'daily-life',
    title: 'Daily Life & Civic Rights',
    description: 'Citizen rights, marriage, traffic, labour law, and fun legal quizzes.',
    icon: '🏠',
    color: '#D97706',
    quizzes: [
      makeQuiz('citizen-rights-full', 'Citizen Rights — Full Assessment', 'Consumer, cyber, property, health, civic, women, disability, and environment rights.', 'beginner', [
      q('If a shop sells you a fake bra', ['Fair trade', 'Consumer fraud', 'Advertising', 'Marketing'], 'A'),
      q('Why should you keep purchase receipts?\n\nA) To prove your purchase if a dispute arises\nB) To decorate your room\nC) To avoid taxes\nD) They have', ['To prove your purchase if a dispute arises', 'To decorate your room', 'To avoid taxes', 'They have no use'], 'A'),
      q('A busi', ['Misleading advertising', 'Legal advice', 'Consumer protection', 'Fair competition'], 'A'),
      q('If a product causes i', ['Seek compensation through legal channels', 'Do nothing', 'Hide the evidence', 'Destroy the product'], 'A'),
      q('Co', ['Protect buyers from unfair business practices', 'Increase prices', 'Reduce competition', 'Promote scams'], 'A'),
      q('A message aski', ['Customer service', 'A phishing attempt', 'A survey', 'A promotion'], 'B'),
      q('Shari', ['Violate privacy rights', 'Improve security', 'Increase internet speed', 'Be required by law'], 'A'),
      q('Which password is safer?\n\nA) 123456\nB) Password\nC) Your', ['123456', 'Password', 'Your name', 'A strong unique password'], 'D'),
      q('O', ['Steal money or information', 'Improve awareness', 'Provide education', 'Increase security'], 'A'),
      q('If your social media accou', ['Report it and secure the account immediately', 'Ignore it', 'Share your password publicly', 'Delete your phone'], 'A'),
      q('Before buyi', ['Verify ownership documents', 'Trust verbal promises only', 'Pay immediately without checking', 'Ignore legal records'], 'A'),
      q('A writte', ['Clarify rights and responsibilities', 'Increase confusion', 'Eliminate rent', 'Replace all laws'], 'A'),
      q('Why is property registratio', ['It helps establish legal ownership', 'It changes the weather', 'It lowers electricity bills', 'It guarantees profit'], 'A'),
      q('A te', ['Follow the terms of the rental agreement', 'Ignore all rules', 'Damage the property', 'Stop paying rent without reason'], 'A'),
      q('Property disputes are ofte', ['Legal procedures or courts', 'Rumors', 'Social media polls', 'Coin tosses'], 'A'),
      q('Every child has the right to:\n\nA) Educatio', ['Education', 'Exploitation', 'Abuse', 'Forced labor'], 'A'),
      q('Child abuse should be:\n\nA) Reported to appropriate authorities\nB) Ig', ['Reported to appropriate authorities', 'Ignored', 'Encouraged', 'Hidden'], 'A'),
      q('Childre', ['Violence and exploitation', 'Education', 'Healthcare', 'Recreation'], 'A'),
      q('Child labor laws aim to:\n\nA) Protect childre', ['Protect children from harmful work', 'Increase school dropout rates', 'Eliminate education', 'Reduce safety'], 'A'),
      q('A child\'s best i', ['A primary consideration in decisions affecting them', 'Ignored', 'Secondary to profits', 'Decided by strangers'], 'A'),
      q('Patie', ['Information about their treatment', 'No information at all', 'False information', 'Confidentiality violations'], 'A'),
      q('Medical records are usually:\n\nA) Co', ['Confidential', 'Public documents', 'Shared with everyone', 'Posted online'], 'A'),
      q('I', ['Understanding and agreeing to treatment voluntarily', 'Signing without reading', 'Agreeing under pressure', 'Refusing information'], 'A'),
      q('Healthcare providers should:\n\nA) Respect patie', ['Respect patient privacy', 'Share information publicly', 'Ignore confidentiality', 'Sell personal data'], 'A'),
      q('A patie', ['File a complaint through proper channels', 'Stay silent forever', 'Spread false information', 'Destroy records'], 'A'),
      q('Voti', ['Participate in democratic processes', 'Avoid laws', 'Eliminate taxes', 'Gain immunity'], 'A'),
      q('Citize', ['Obey laws and respect others\' rights', 'Ignore laws', 'Break rules for convenience', 'Avoid civic duties'], 'A'),
      q('Freedom of expressio', ['The right to express opinions within legal limits', 'Unlimited rights to harm others', 'The right to commit crimes', 'Immunity from all consequences'], 'A'),
      q('Payi', ['Public services and infrastructure', 'Private vacations', 'Personal hobbies', 'Rumors'], 'A'),
      q('Civic respo', ['Respecting community rules and laws', 'Ignoring public safety', 'Damaging public property', 'Encouraging disorder'], 'A'),
      q('Wome', ['Equal treatment under the law', 'Fewer legal protections', 'No education', 'No employment'], 'A'),
      q('Workplace harassme', ['Unacceptable and may be illegal', 'Encouraged', 'A promotion strategy', 'A job requirement'], 'A'),
      q('Equal pay pri', ['Fair compensation for similar work', 'Wage discrimination', 'Lower wages for women', 'Unfair treatment'], 'A'),
      q('Domestic viole', ['A serious issue that may be a crime', 'A family tradition', 'A private joke', 'A legal requirement'], 'A'),
      q('Wome', ['Violated', 'Protected', 'Celebrated', 'Recognized'], 'A'),
      q('Accessibility helps perso', ['Participate fully in society', 'Stay isolated', 'Avoid education', 'Reduce opportunities'], 'A'),
      q('Discrimi', ['Often unlawful', 'Encouraged', 'Required', 'Rewarded'], 'A'),
      q('Public facilities should aim to:\n\nA) Be accessible to everyo', ['Be accessible to everyone', 'Exclude people', 'Limit participation', 'Increase barriers'], 'A'),
      q('I', ['Providing learning opportunities for all students', 'Excluding students with disabilities', 'Limiting access to schools', 'Preventing participation'], 'A'),
      q('Perso', ['Equal opportunities and dignity', 'Fewer rights', 'No employment', 'Isolation'], 'A'),
      q('Litteri', ['Harm the environment', 'Improve cleanliness', 'Create jobs automatically', 'Increase safety'], 'A'),
      q('Illegal dumpi', ['Violate environmental laws', 'Help nature', 'Improve public health', 'Reduce pollution'], 'A'),
      q('Why should citize', ['To protect a valuable resource', 'To waste resources', 'To increase pollution', 'To damage ecosystems'], 'A'),
      q('E', ['Protect people and nature', 'Increase pollution', 'Eliminate parks', 'Encourage waste'], 'A'),
      q('Pla', ['Improve the environment and air quality', 'Increase pollution', 'Damage ecosystems', 'Waste resources'], 'A'),
      ]),
      makeQuiz('marriage-child', 'Marriage & Child Marriage Law', 'Legal age, consent, registration, and child marriage protections.', 'beginner', [
      q('What is the mai', ['To increase wedding costs', 'To protect young people from harm and ensure maturity', 'To reduce population', 'To limit education'], 'B'),
      q('A marriage i', ['Civil marriage', 'Child marriage', 'Contract marriage', 'Religious marriage'], 'B'),
      q('If a perso', ['Always valid', 'A legal issue that can be challenged', 'A traffic offense', 'Automatically canceled'], 'B'),
      q('Why are birth certificates importa', ['They prove age and identity', 'They prove income', 'They prove citizenship only', 'They are not important'], 'A'),
      q('Which of the followi', ['Free and informed consent', 'Threats or pressure to marry', 'Mutual agreement', 'Legal registration'], 'B'),
      q('Child marriage ca', ['Education and health', 'Weather conditions', 'Internet speed', 'Transportation'], 'A'),
      q('Marriage registratio', ['Protect legal rights of spouses', 'Increase taxes', 'Eliminate property rights', 'Prevent education'], 'A'),
      q('Ca', ['Yes, always', 'No, consent is generally required', 'Only on weekends', 'Only if neighbors agree'], 'B'),
      q('If someo', ['Ignore it', 'Report it to relevant authorities or child protection services', 'Encourage it', 'Post rumors online'], 'B'),
      q('Legal age requireme', ['Protect children', 'Increase wedding attendance', 'Promote tourism', 'Increase gifts'], 'B'),
      q('Co', ['Agreement given freely and voluntarily', 'Agreement under pressure', 'Silence only', 'Agreement by friends'], 'A'),
      q('Marriage registratio', ['The legal existence of the marriage', 'Academic qualifications', 'Driving ability', 'Employment status'], 'A'),
      q('Which docume', ['Birth certificate or national ID', 'Shopping receipt', 'Library card', 'Bus ticket'], 'A'),
      q('Laws agai', ['Protect children\'s rights and welfare', 'Increase wedding expenses', 'Limit travel', 'Reduce employment'], 'A'),
      q('A perso', ['Choose their spouse freely within the law', 'Be forced into marriage', 'Marry without consent', 'Ignore legal requirements'], 'A'),
      ]),
      makeQuiz('traffic-law', 'Traffic Law Quiz', 'Helmets, licenses, signals, DUI, and road safety obligations.', 'beginner', [
      q('What should you do whe', ['Speed up', 'Stop', 'Honk continuously', 'Turn without looking'], 'B'),
      q('Seat belts are importa', ['Improve fuel economy', 'Help protect occupants during a crash', 'Increase speed', 'Reduce traffic'], 'B'),
      q('Usi', ['Improve concentration', 'Distract the driver and increase accident risk', 'Reduce traffic fines', 'Improve navigation skills automatically'], 'B'),
      q('What does a stop sig', ['Slow down only', 'Come to a complete stop', 'Honk first', 'Turn around'], 'B'),
      q('Why should drivers obey speed limits?\n\nA) To avoid u', ['To avoid unnecessary risk and accidents', 'To increase engine wear', 'To use more fuel', 'To impress others'], 'B'),
      q('Drivi', ['Safe at low speeds', 'Dangerous and illegal in many places', 'Encouraged', 'Required'], 'A'),
      q('Pedestria', ['Designated crossings', 'Highways only', 'Parking lots only', 'Gas stations'], 'B'),
      q('A driver\'s lice', ['The person has met legal requirements to drive', 'They own a vehicle', 'They are a mechanic', 'They pay no taxes'], 'A'),
      q('Why is weari', ['Fashion only', 'It helps reduce head injury risk', 'It improves fuel economy', 'It increases speed'], 'A'),
      q('What should you do whe', ['Ignore it', 'Give way according to local laws', 'Race it', 'Block the road'], 'B'),
      q('Tailgati', ['Following another vehicle too closely', 'Driving slowly', 'Parking illegally', 'Making a U-turn'], 'B'),
      q('Traffic laws exist mai', ['Improve public safety', 'Increase paperwork only', 'Sell vehicles', 'Increase fuel use'], 'B'),
      q('Before cha', ['Check mirrors and surroundings', 'Close their eyes', 'Accelerate suddenly', 'Honk continuously'], 'A'),
      q('Parki', ['Usually illegal', 'Encouraged', 'Required', 'Free'], 'A'),
      q('If i', ['Leave immediately', 'Follow legal reporting and safety procedures', 'Hide the vehicle', 'Ignore the incident'], 'A'),
      ]),
      makeQuiz('labour-rights', 'Labour Rights & Employment', 'Wages, contracts, workplace safety, harassment, and termination rights.', 'beginner', [
      q('A writte', ['Clarify rights and responsibilities', 'Increase confusion', 'Reduce wages automatically', 'Replace all laws'], 'A'),
      q('What is a mi', ['The lowest legal wage an employer can pay in many jurisdictions', 'A bonus payment', 'A tax refund', 'A pension'], 'A'),
      q('Employees have the right to:\n\nA) A safe workplace\nB) U', ['A safe workplace', 'Unsafe conditions', 'Unlimited working hours', 'No breaks'], 'A'),
      q('Workplace discrimi', ['Treating workers unfairly based on protected characteristics', 'Giving everyone equal opportunities', 'Following safety rules', 'Paying salaries'], 'A'),
      q('Why are workplace safety rules importa', ['To reduce injuries and accidents', 'To increase risks', 'To waste time', 'To lower productivity'], 'A'),
      q('Overtime pay ge', ['Additional compensation for extra hours worked when required by law or contract', 'A traffic fine', 'Vacation pay only', 'Health insurance'], 'A'),
      q('A', ['Ignore it', 'Report it through appropriate channels', 'Encourage it', 'Hide it'], 'A'),
      q('Paid leave allows employees to:\n\nA) Take approved time off while receivi', ['Take approved time off while receiving pay according to policy or law', 'Quit immediately', 'Avoid work forever', 'Ignore contracts'], 'A'),
      q('Child labour laws are i', ['Protect children from exploitation and harmful work', 'Increase school dropout rates', 'Reduce safety', 'Encourage dangerous jobs'], 'A'),
      q('What is workplace harassme', ['Unwanted behavior that creates a hostile work environment', 'Friendly teamwork', 'Training sessions', 'Annual reviews'], 'A'),
      q('Employees should receive i', ['Their wages, duties, and workplace policies', 'Neighbors\' salaries', 'Competitors\' secrets', 'Personal data of coworkers'], 'A'),
      q('If a', ['Seek help from relevant labour authorities or legal channels', 'Do nothing', 'Destroy company property', 'Spread false rumors'], 'A'),
      q('A probatio', ['An initial employment period used to assess suitability', 'Permanent employment only', 'Retirement leave', 'A holiday'], 'A'),
      q('Equal pay pri', ['Reduce unfair wage differences for similar work', 'Increase discrimination', 'Eliminate employment contracts', 'Reduce productivity'], 'A'),
      q('Labour laws ge', ['Balance employer and employee rights and responsibilities', 'Prevent employment', 'Eliminate businesses', 'Increase accidents'], 'A'),
      ]),
      makeQuiz('fun-quiz', 'Fun Legal Awareness Quiz', 'Quick everyday legal knowledge for citizens — consumer, cyber, traffic, and more.', 'beginner', [
      q('🧾 If you buy a product a', ['Cyber Law', 'Consumer Protection Law', 'Traffic Law', 'Family Law'], 'B'),
      q('🚔 Ca', ['Yes, anytime', 'No, they must inform the reason of arrest', 'Only at night', 'Only with media permission'], 'B'),
      q('🏠 If a la', ['Nothing', 'Go to court or consumer court', 'Fight with landlord', 'Ignore it'], 'B'),
      q('📱 Shari', ['Legal', 'A civil matter only', 'A cyber crime', 'A joke'], 'C'),
      q('🧑‍⚖️ Who i', ['Police', 'Lawyer', 'Judge', 'Mayor'], 'B'),
      q('🚦 If you break traffic rules (like', ['Nothing', 'Only warning always', 'Fine or penalty', 'Jail in all cases'], 'C'),
      q('🧾 A co', ['It is written on paper only', 'Both parties agree freely', 'Police approve it', 'Witnesses are famous'], 'C'),
      q('📢 Defami', ['Freedom of speech always', 'Legal in all cases', 'Defamation and can be illegal', 'Encouraged'], 'B'),
      q('🧒 What is the mi', ['5 years', '10 years', '18 years', '25 years'], 'C'),
      q('⚖️ If you are treated u', ['Police station only', 'Consumer court or relevant authority', 'School', 'Social media only'], 'B'),
      ])
    ],
  },
];

export const ALL_QUIZZES = QUIZ_CATEGORIES.flatMap((c) => c.quizzes);
export const TOTAL_QUESTIONS = ALL_QUIZZES.reduce((s, q) => s + q.questions.length, 0);

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getQuestionPool() {
  const seen = new Set();
  const pool = [];
  for (const category of QUIZ_CATEGORIES) {
    for (const quiz of category.quizzes) {
      for (const question of quiz.questions) {
        const key = question.text.trim();
        if (seen.has(key)) continue;
        seen.add(key);
        pool.push({
          poolId: `${quiz.id}::${question.id}`,
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          sourceQuiz: quiz.title,
          sourceQuizId: quiz.id,
          sourceCategory: category.title,
          sourceCategoryId: category.id,
        });
      }
    }
  }
  return pool;
}

/** Shuffle option order so the correct answer is not always in the same position. */
export function shuffleQuestionOptions(question) {
  const order = shuffleArray(question.options.map((_, i) => i));
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correctAnswer: order.indexOf(question.correctAnswer),
  };
}

const HISTORY_KEY = 'lawpal-quiz-history';
const MAX_HISTORY_PER_SCOPE = 200;

function loadHistory(scopeKey) {
  try {
    const all = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    return all[scopeKey] || [];
  } catch {
    return [];
  }
}

function saveHistory(scopeKey, newKeys) {
  try {
    const all = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    const prev = all[scopeKey] || [];
    const merged = [...newKeys, ...prev.filter((k) => !newKeys.includes(k))].slice(
      0,
      MAX_HISTORY_PER_SCOPE
    );
    all[scopeKey] = merged;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
  } catch {
    /* ignore storage errors */
  }
}

export function getPoolForScope(scopeType, scopeId) {
  const pool = getQuestionPool();
  if (scopeType === 'mixed') return pool;
  if (scopeType === 'category') return pool.filter((q) => q.sourceCategoryId === scopeId);
  if (scopeType === 'quiz') return pool.filter((q) => q.sourceQuizId === scopeId);
  return pool;
}

export function getScopeLabel(scopeType, scopeId) {
  if (scopeType === 'mixed') return 'Mixed Topics (All Categories)';
  if (scopeType === 'category') {
    const cat = QUIZ_CATEGORIES.find((c) => c.id === scopeId);
    return cat?.title || 'Category';
  }
  if (scopeType === 'quiz') {
    const quiz = ALL_QUIZZES.find((q) => q.id === scopeId);
    return quiz?.title || 'Quiz';
  }
  return 'Quiz';
}

export function getAvailableCount(scopeType, scopeId) {
  return getPoolForScope(scopeType, scopeId).length;
}

/**
 * Build a quiz session: pick N questions (preferring ones not recently shown),
 * shuffle option order per question, and track history for variety on retry.
 */
export function buildCustomQuiz({ count = 10, scopeType = 'mixed', scopeId = null }) {
  const scopeKey = scopeType === 'mixed' ? 'mixed' : `${scopeType}:${scopeId}`;
  const pool = getPoolForScope(scopeType, scopeId);
  if (!pool.length) return null;

  const actualCount = Math.min(Math.max(1, count), pool.length);
  const history = loadHistory(scopeKey);
  const historySet = new Set(history);

  const unseen = shuffleArray(pool.filter((q) => !historySet.has(q.poolId)));
  const seen = shuffleArray(pool.filter((q) => historySet.has(q.poolId)));

  const selected = [];
  for (const bucket of [unseen, seen, shuffleArray(pool)]) {
    for (const item of bucket) {
      if (selected.length >= actualCount) break;
      if (!selected.some((s) => s.poolId === item.poolId)) selected.push(item);
    }
    if (selected.length >= actualCount) break;
  }

  const finalSelected = shuffleArray(selected).slice(0, actualCount);
  saveHistory(scopeKey, finalSelected.map((q) => q.poolId));

  const scopeLabel = getScopeLabel(scopeType, scopeId);
  const sessionStamp = Date.now();

  return {
    id: `custom-${scopeKey}-${sessionStamp}`,
    title: `${actualCount}-Question Quiz — ${scopeLabel}`,
    description: `Custom session from ${scopeLabel}`,
    difficulty:
      scopeType === 'mixed'
        ? 'intermediate'
        : ALL_QUIZZES.find((q) => q.id === scopeId)?.difficulty || 'intermediate',
    isMixed: scopeType === 'mixed',
    isCustom: true,
    config: { count: actualCount, scopeType, scopeId, scopeKey },
    questions: finalSelected.map((item, i) =>
      shuffleQuestionOptions({
        id: `${scopeKey}-${sessionStamp}-${i + 1}`,
        text: item.text,
        options: [...item.options],
        correctAnswer: item.correctAnswer,
        sourceCategory: item.sourceCategory,
        poolId: item.poolId,
      })
    ),
  };
}

export const QUESTION_COUNT_PRESETS = [10, 15, 20, 25, 30, 50];

export const MIXED_POOL_SIZE = getQuestionPool().length;

export const MIXED_TOPIC_META = {
  title: 'Mixed Topic Quiz',
  description: 'Questions drawn from all categories and topics.',
  icon: '🔀',
  color: '#6D28D9',
};

export const MIXED_QUIZ_PRESETS = [
  {
    id: 'mixed-quick',
    title: 'Quick Mix',
    description: 'Fast sprint across all topics',
    count: 20,
    difficulty: 'intermediate',
  },
  {
    id: 'mixed-standard',
    title: 'Standard Mix',
    description: 'Balanced mix from every category',
    count: 50,
    difficulty: 'intermediate',
  },
  {
    id: 'mixed-full',
    title: 'Full Challenge',
    description: 'Full mixed-topic test',
    count: 100,
    difficulty: 'advanced',
  },
];

export const TOPIC_OPTIONS = [
  { type: 'mixed', id: null, label: 'Mixed — All Topics', group: 'Recommended' },
  ...QUIZ_CATEGORIES.map((cat) => ({
    type: 'category',
    id: cat.id,
    label: cat.title,
    group: 'Categories',
  })),
  ...ALL_QUIZZES.map((quiz) => {
    const cat = QUIZ_CATEGORIES.find((c) => c.quizzes.some((q) => q.id === quiz.id));
    return {
      type: 'quiz',
      id: quiz.id,
      label: quiz.title,
      group: cat?.title || 'Individual Quizzes',
    };
  }),
];

export function buildMixedQuiz(presetId) {
  const preset = MIXED_QUIZ_PRESETS.find((p) => p.id === presetId);
  if (!preset) return null;
  return buildCustomQuiz({ count: preset.count, scopeType: 'mixed', scopeId: null });
}

export function getQuizById(id) {
  return ALL_QUIZZES.find((q) => q.id === id) || MIXED_QUIZ_PRESETS.find((p) => p.id === id);
}

export { QUIZ_CATEGORIES };
