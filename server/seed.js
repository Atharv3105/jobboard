/**
 * Seed Script — Demo Job Postings
 * Run: node seed.js
 * Creates 1 demo employer + 13 jobs (one per category) with INR salaries
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const DEMO_EMPLOYER = {
  name: 'JobBoard Demo',
  email: 'demo@jobboard.in',
  password: 'Demo@1234',
  role: 'employer',
  company: 'Various Companies (Demo)',
  companyWebsite: 'https://jobboard.in',
  companyDescription: 'Demo accounts showcasing JobBoard platform capabilities.',
};

const DEMO_JOBS = [
  // Technology
  {
    title: 'Senior Full Stack Developer',
    company: 'TechNova Solutions',
    location: 'Bengaluru, Karnataka',
    type: 'full-time',
    category: 'Technology',
    experience: 'senior',
    description: `We are looking for a Senior Full Stack Developer to join our rapidly growing product team in Bengaluru.

You will be working on our core SaaS platform used by 500+ enterprise clients. The role involves building scalable microservices, designing APIs, and crafting pixel-perfect UIs.

We are a team of passionate engineers who love clean code, good architecture, and ship fast.`,
    requirements: `• 4+ years of experience with React.js and Node.js
• Strong understanding of RESTful API design and GraphQL
• Experience with cloud platforms — AWS or GCP preferred
• Proficiency in MongoDB, PostgreSQL
• Experience with Docker and Kubernetes is a plus
• Bachelor's degree in Computer Science or equivalent`,
    responsibilities: `• Design and develop full-stack features end-to-end
• Collaborate with product and design teams
• Conduct thorough code reviews
• Mentor junior developers
• Write and maintain unit and integration tests
• Participate in architecture discussions`,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'Docker'],
    salary: { min: 1800000, max: 3000000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },

  // Design
  {
    title: 'UI/UX Designer',
    company: 'PixelCraft Studios',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    category: 'Design',
    experience: 'mid',
    description: `PixelCraft Studios is seeking a talented UI/UX Designer to join our creative team building world-class digital products for India's top startups and enterprises.

You'll own the design process from user research to final pixel-perfect handoffs, working closely with product managers and engineers.`,
    requirements: `• 3+ years of UI/UX design experience
• Proficiency in Figma and Adobe XD
• Strong portfolio demonstrating mobile and web design
• Understanding of design systems and component libraries
• Knowledge of accessibility (WCAG) standards
• Experience with user research and usability testing`,
    responsibilities: `• Create wireframes, prototypes, and high-fidelity designs
• Conduct user research and usability studies
• Develop and maintain the product design system
• Work closely with engineering for implementation
• Present designs to stakeholders and gather feedback`,
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems', 'Illustrator'],
    salary: { min: 900000, max: 1800000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },

  // Marketing
  {
    title: 'Digital Marketing Manager',
    company: 'GrowthHive Marketing',
    location: 'Delhi, NCR',
    type: 'full-time',
    category: 'Marketing',
    experience: 'mid',
    description: `GrowthHive is a performance-first digital marketing agency working with D2C brands, SaaS companies, and e-commerce businesses across India.

We are hiring a Digital Marketing Manager to lead campaigns across Google Ads, Meta, SEO, and email — and help our clients grow revenue.`,
    requirements: `• 3+ years in digital marketing (preferably agency experience)
• Hands-on expertise with Google Ads and Meta Ads Manager
• Strong understanding of SEO and content strategy
• Proficiency in Google Analytics 4, Looker Studio
• Experience managing budgets of ₹10L+ / month
• MBA in Marketing preferred but not mandatory`,
    responsibilities: `• Plan and execute multi-channel digital campaigns
• Manage paid media budget allocation and optimization
• Report on KPIs: ROAS, CAC, LTV, conversion rates
• Lead a team of 3 marketing executives
• A/B test creatives, landing pages, and audience segments`,
    skills: ['Google Ads', 'Meta Ads', 'SEO', 'Google Analytics', 'Email Marketing', 'Content Strategy'],
    salary: { min: 1000000, max: 1600000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },

  // Finance
  {
    title: 'Chartered Accountant — Financial Analyst',
    company: 'Meridian Capital Partners',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    category: 'Finance',
    experience: 'mid',
    description: `Meridian Capital Partners is a leading investment firm managing ₹2,000 Cr+ AUM across equity, debt, and alternative assets.

We are looking for a CA with sharp financial modeling and analytical skills to join our investment research team.`,
    requirements: `• CA (ICAI) qualified — mandatory
• 2–4 years post-qualification experience in finance
• Advanced Excel and financial modeling skills
• Understanding of equity valuation, DCF, and LBO models
• Knowledge of Indian regulatory framework (SEBI, RBI)
• CFA Level I/II is a plus`,
    responsibilities: `• Build and maintain financial models for portfolio companies
• Conduct industry and company research for investment decisions
• Prepare investment memos and board presentations
• Monitor portfolio performance and flag risks
• Coordinate with auditors during fund reporting cycles`,
    skills: ['Financial Modeling', 'DCF Valuation', 'Excel', 'SEBI Compliance', 'Tally', 'Power BI'],
    salary: { min: 1500000, max: 2500000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },

  // Healthcare
  {
    title: 'Clinical Data Analyst',
    company: 'MediSense Health Tech',
    location: 'Hyderabad, Telangana',
    type: 'full-time',
    category: 'Healthcare',
    experience: 'entry',
    description: `MediSense is a health-tech startup building AI-powered clinical decision support tools used by 200+ hospitals across India.

We are hiring a Clinical Data Analyst to process, clean, and analyze real-world patient data to improve our AI models and generate clinical insights.`,
    requirements: `• Bachelor's or Master's in Bioinformatics, Statistics, or Health Sciences
• Proficiency in Python or R for data analysis
• Understanding of clinical trial data standards (CDISC, HL7, FHIR)
• Experience with SQL and data visualization tools
• Knowledge of HIPAA / patient data privacy standards`,
    responsibilities: `• Clean and preprocess large clinical datasets
• Perform statistical analysis and generate reports
• Work with ML engineers to prepare training data
• Create dashboards for clinical outcomes tracking
• Maintain data quality and validation pipelines`,
    skills: ['Python', 'R', 'SQL', 'FHIR', 'Tableau', 'Statistical Analysis'],
    salary: { min: 600000, max: 1200000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },

  // Education
  {
    title: 'EdTech Content Developer — Mathematics',
    company: 'BrightMinds EdTech',
    location: 'Remote',
    type: 'remote',
    category: 'Education',
    experience: 'entry',
    description: `BrightMinds is one of India's fastest-growing K–12 EdTech platforms with 5 million+ learners. We are creating India's best adaptive learning content for Mathematics.

We are looking for a Mathematics Content Developer to design curriculum-aligned, engaging content for Classes 6–12.`,
    requirements: `• Bachelor's/Master's in Mathematics or Education
• 1–2 years of teaching or content development experience
• Strong command of NCERT and CBSE/ICSE syllabus
• Ability to explain complex concepts simply
• Basic familiarity with LMS platforms and content tools`,
    responsibilities: `• Develop concept videos, practice problems, and assessments
• Align content with NCERT, CBSE, and competitive exam syllabi
• Review and quality-check peer content
• Collaborate with product teams for digital delivery
• Continuously improve content based on learner analytics`,
    skills: ['Mathematics', 'Curriculum Design', 'NCERT', 'LMS', 'Content Writing', 'Articulate 360'],
    salary: { min: 500000, max: 900000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },

  // Sales
  {
    title: 'Enterprise Sales Manager — SaaS',
    company: 'CloudForge Technologies',
    location: 'Pune, Maharashtra',
    type: 'full-time',
    category: 'Sales',
    experience: 'senior',
    description: `CloudForge is a B2B SaaS company providing cloud infrastructure management tools to enterprise clients. We serve 80+ Fortune 500 companies across APAC.

We are seeking an Enterprise Sales Manager to own the full sales cycle for deals worth ₹50L–₹5Cr.`,
    requirements: `• 5+ years of enterprise B2B SaaS sales experience
• Proven track record of closing large, complex deals
• Strong network in IT decision-maker circles
• Experience with CRMs like Salesforce or HubSpot
• Excellent presentation and negotiation skills
• MBA preferred`,
    responsibilities: `• Identify, qualify, and close enterprise accounts
• Build relationships with CXOs and IT Directors
• Manage the full sales cycle from prospecting to contract
• Achieve quarterly revenue targets of ₹5Cr+
• Collaborate with pre-sales, product, and customer success`,
    skills: ['Enterprise Sales', 'SaaS', 'Salesforce', 'CRM', 'Negotiation', 'Solution Selling'],
    salary: { min: 2000000, max: 3500000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
  },

  // Engineering
  {
    title: 'DevOps Engineer',
    company: 'Infra Labs India',
    location: 'Bengaluru, Karnataka',
    type: 'full-time',
    category: 'Engineering',
    experience: 'mid',
    description: `Infra Labs India provides managed cloud infrastructure services to high-growth startups. Our platform handles 10 billion+ API calls per month.

We need a DevOps Engineer to build and maintain robust CI/CD pipelines, monitoring systems, and infrastructure-as-code for our platform.`,
    requirements: `• 3+ years of DevOps/SRE experience
• Strong expertise in Kubernetes, Docker, and Helm
• Proficiency with Terraform or Pulumi for IaC
• Experience with AWS or GCP (certifications preferred)
• Knowledge of monitoring stacks: Prometheus, Grafana, ELK
• Understanding of security best practices (SOC 2, ISO 27001)`,
    responsibilities: `• Build and maintain CI/CD pipelines (Jenkins, GitHub Actions)
• Manage Kubernetes clusters across multiple cloud regions
• Define and enforce infrastructure-as-code standards
• Implement observability and alerting for SLA monitoring
• Conduct incident response and post-mortem analysis`,
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Prometheus', 'Linux'],
    salary: { min: 1600000, max: 2800000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
  },

  // HR
  {
    title: 'HR Business Partner — Tech',
    company: 'Zeta Fintech',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    category: 'HR',
    experience: 'mid',
    description: `Zeta is a next-gen fintech infrastructure company powering modern banking for 15+ banks globally. We are a 1,200-person team across India, US, and APAC.

We are looking for an HR Business Partner to support our 300-person Technology division with talent management, culture, and people operations.`,
    requirements: `• 4+ years of HRBP experience, preferably in tech companies
• Strong understanding of talent acquisition and retention
• Experience with performance management frameworks
• Familiarity with HR tools like Darwinbox, Workday, or BambooHR
• Excellent communication and stakeholder management skills`,
    responsibilities: `• Partner with engineering and product leadership on people strategy
• Drive performance review cycles and career development programs
• Handle employee relations, grievances, and policy compliance
• Collaborate with TA team on technical hiring strategy
• Analyze HR metrics and present insights to leadership`,
    skills: ['HRBP', 'Performance Management', 'Talent Acquisition', 'Darwinbox', 'Employee Relations', 'OKRs'],
    salary: { min: 1200000, max: 2000000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
  },

  // Customer Service
  {
    title: 'Customer Success Manager',
    company: 'Razorpay',
    location: 'Bengaluru, Karnataka',
    type: 'full-time',
    category: 'Customer Service',
    experience: 'mid',
    description: `Razorpay is India's leading payment solutions company, processing ₹8 lakh crore in payments annually. We are powering the payments for 8 million+ businesses.

We are hiring a Customer Success Manager to onboard, retain, and grow a portfolio of enterprise merchant accounts.`,
    requirements: `• 3+ years of customer success or account management experience
• Experience in SaaS or fintech products preferred
• Strong analytical skills and proficiency in Excel / BI tools
• Excellent verbal and written communication
• Ability to manage multiple accounts simultaneously`,
    responsibilities: `• Own a portfolio of 50–80 enterprise merchants
• Drive onboarding, adoption, and product utilization
• Monitor health scores and proactively manage churn risk
• Identify upsell and cross-sell opportunities
• Act as the voice of the customer in product discussions`,
    skills: ['Customer Success', 'Account Management', 'Salesforce', 'Data Analysis', 'Payments', 'Stakeholder Management'],
    salary: { min: 1100000, max: 1800000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  },

  // Legal
  {
    title: 'In-House Counsel — Technology & IP',
    company: 'NexGen Software Labs',
    location: 'Delhi, NCR',
    type: 'full-time',
    category: 'Legal',
    experience: 'senior',
    description: `NexGen Software Labs is a 1,500-person product company with offices in India, Singapore, and the US. We build enterprise software for the BFSI sector.

We are looking for an experienced In-House Counsel to handle technology contracts, IP strategy, regulatory compliance, and M&A support.`,
    requirements: `• LLB/LLM from a reputed institution
• 5+ years of legal experience in tech or IP law
• Expertise in technology contracts, SaaS agreements, and data privacy (PDPB, GDPR)
• Experience with cross-border transactions and M&A due diligence
• Strong drafting, negotiation, and communication skills`,
    responsibilities: `• Draft and negotiate enterprise software contracts, NDAs, and SLAs
• Manage trademark and patent portfolio across jurisdictions
• Ensure compliance with PDPB, GDPR, and IT Act regulations
• Provide legal support for fundraising and M&A activities
• Liaise with external law firms and regulatory bodies`,
    skills: ['Technology Law', 'IP Law', 'GDPR', 'Contract Drafting', 'Data Privacy', 'M&A', 'PDPB'],
    salary: { min: 2200000, max: 3800000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },

  // Operations
  {
    title: 'Supply Chain & Operations Manager',
    company: 'Delhivery Logistics',
    location: 'Gurgaon, Haryana',
    type: 'full-time',
    category: 'Operations',
    experience: 'senior',
    description: `Delhivery is India's largest fully-integrated logistics platform delivering to 18,000+ pin codes. We process 2 million+ shipments daily.

We are looking for a Supply Chain & Operations Manager to optimize our last-mile network in North India.`,
    requirements: `• 6+ years of supply chain or logistics operations experience
• Strong data analytics skills — SQL, Excel, Power BI
• Experience with WMS, TMS, or ERP systems (SAP preferred)
• Understanding of 3PL, last-mile, and cold chain operations
• MBA from a Tier 1 institution preferred`,
    responsibilities: `• Oversee daily operations of 10+ fulfillment centers
• Identify and implement process improvement initiatives
• Manage vendor relationships and SLA compliance
• Analyze operational metrics and present to leadership
• Drive automation and technology adoption in operations`,
    skills: ['Supply Chain', 'SAP', 'Power BI', 'Last Mile Logistics', 'Operations Management', 'Lean Six Sigma'],
    salary: { min: 1800000, max: 2800000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },

  // Other
  {
    title: 'Research Analyst — Market Intelligence',
    company: 'Blume Ventures',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    category: 'Other',
    experience: 'entry',
    description: `Blume Ventures is one of India's leading early-stage VC funds, having invested in Dunzo, Slice, Unacademy, and 100+ startups.

We are hiring a Research Analyst to support our investment team with market research, competitive analysis, and portfolio monitoring.`,
    requirements: `• Bachelor's or Master's in Business, Economics, or related field
• Strong research and analytical skills
• Proficiency in Excel, PowerPoint, and financial databases
• Excellent writing ability — you'll produce reports for partners
• Deep curiosity about startups and the Indian tech ecosystem`,
    responsibilities: `• Research emerging sectors and build investment theses
• Analyze startup pitches and conduct due diligence
• Monitor portfolio company performance
• Prepare weekly ecosystem intelligence reports
• Represent Blume at startup events and ecosystem meetups`,
    skills: ['Market Research', 'Financial Analysis', 'Excel', 'PowerPoint', 'Due Diligence', 'Report Writing'],
    salary: { min: 700000, max: 1200000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },

  // Extra Technology — Remote
  {
    title: 'Android Developer (Kotlin)',
    company: 'PhonePe',
    location: 'Bengaluru, Karnataka',
    type: 'full-time',
    category: 'Technology',
    experience: 'mid',
    description: `PhonePe is India's leading digital payments app with 500 million+ registered users and 37% UPI market share.

We are looking for a passionate Android Developer to build features used by hundreds of millions of Indians every day.`,
    requirements: `• 3+ years of Android development experience
• Strong proficiency in Kotlin; Java knowledge is a plus
• Experience with Jetpack Compose, ViewModel, LiveData, Room
• Understanding of Android architecture patterns (MVVM, MVI)
• Experience with REST APIs, Retrofit, OkHttp
• Knowledge of unit testing (JUnit, Mockito, Espresso)`,
    responsibilities: `• Build new features for the PhonePe Android app
• Optimize app performance and reduce ANRs/crashes
• Write comprehensive unit and UI tests
• Participate in code reviews and technical design discussions
• Collaborate with backend and product teams`,
    skills: ['Kotlin', 'Android', 'Jetpack Compose', 'MVVM', 'Retrofit', 'Room DB', 'Git'],
    salary: { min: 2000000, max: 3500000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
  },

  // Internship
  {
    title: 'Marketing Intern — Growth & Social Media',
    company: 'Meesho',
    location: 'Bengaluru, Karnataka',
    type: 'internship',
    category: 'Marketing',
    experience: 'entry',
    description: `Meesho is India's fastest-growing social commerce platform with 150 million+ users. We are on a mission to democratize internet commerce for every Indian.

We are hiring a Marketing Intern to support our growth and social media team for a 6-month internship.`,
    requirements: `• Currently pursuing or recently completed a degree in Marketing, Mass Communication, or Business
• Strong understanding of Instagram, YouTube, and emerging platforms
• Basic knowledge of Canva, Adobe, or similar design tools
• Good written communication in English and Hindi
• Enthusiastic, creative, and eager to learn`,
    responsibilities: `• Assist in executing social media campaigns across platforms
• Create content calendars and coordinate with content creators
• Monitor campaign analytics and prepare weekly reports
• Research influencer partnerships and community trends
• Support paid campaign execution on Meta and Google`,
    skills: ['Social Media', 'Canva', 'Content Writing', 'Instagram', 'Meta Ads', 'Analytics'],
    salary: { min: 240000, max: 360000, currency: 'INR', period: 'year' },
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing jobs...');
    await Job.deleteMany({});

    // Create or update demo employer
    let employer = await User.findOne({ email: DEMO_EMPLOYER.email });
    if (!employer) {
      employer = await User.create(DEMO_EMPLOYER);
      console.log('👤 Demo employer created');
    } else {
      console.log('👤 Demo employer already exists');
    }

    // Create all jobs
    console.log(`\n📋 Creating ${DEMO_JOBS.length} demo jobs...\n`);
    for (const jobData of DEMO_JOBS) {
      const job = await Job.create({
        ...jobData,
        postedBy: employer._id,
        isActive: true,
        views: Math.floor(Math.random() * 300) + 20,
      });
      console.log(`  ✅ [${job.category.padEnd(16)}] ${job.title} @ ${job.company}`);
    }

    console.log(`\n🎉 Seed complete! ${DEMO_JOBS.length} jobs created.`);
    console.log(`\n📧 Demo Employer Login:`);
    console.log(`   Email:    ${DEMO_EMPLOYER.email}`);
    console.log(`   Password: ${DEMO_EMPLOYER.password}\n`);

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
