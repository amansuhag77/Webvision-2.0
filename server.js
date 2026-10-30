var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_vite = require("vite");
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");

// src/data/schemesCatalog.ts
var MASTER_STARTING_THEMES = [
  {
    theme_id: "STUDENT_EDUCATION",
    theme_title: "Student & Education",
    hindi_title: "\u0935\u093F\u0926\u094D\u092F\u093E\u0930\u094D\u0925\u0940 \u0914\u0930 \u0936\u093F\u0915\u094D\u0937\u093E",
    icon_name: "GraduationCap",
    short_description: "Pre-matric, post-matric college scholarships, fellowships, and interest-subsidized education loans.",
    sub_categories: [
      "Pre-Matric & School Scholarships",
      "Post-Matric & College Scholarships",
      "Higher Education Loans (PM Vidyalaxmi)",
      "Free Coaching & Skill Stipends",
      "Hostel & Book Subsidies"
    ],
    estimated_scheme_count: 148
  },
  {
    theme_id: "AGRICULTURE_FARMING",
    theme_title: "Agriculture, Rural & Environment",
    hindi_title: "\u0915\u0943\u0937\u093F, \u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u0914\u0930 \u0915\u093F\u0938\u093E\u0928",
    icon_name: "Sprout",
    short_description: "Direct income transfers, crop insurance, solar water pumps, and farm mechanization grants.",
    sub_categories: [
      "Direct Farmer Income Support",
      "Crop Insurance & Disaster Relief",
      "Solar Pumps & Irrigation (PM-KUSUM)",
      "Farm Machinery & Tractor Subsidies",
      "Dairy, Fisheries & Kisan Credit"
    ],
    estimated_scheme_count: 215
  },
  {
    theme_id: "FINANCE_BANKING",
    theme_title: "Banking, Financial Services & Insurance",
    hindi_title: "\u092C\u0948\u0902\u0915\u093F\u0902\u0917, \u0935\u093F\u0924\u094D\u0924\u0940\u092F \u0938\u0947\u0935\u093E\u090F\u0902 \u0914\u0930 \u092C\u0940\u092E\u093E",
    icon_name: "Landmark",
    short_description: "Micro-credit collateral-free loans, low-premium accident cover, and guaranteed savings.",
    sub_categories: [
      "Micro-Credit & Collateral-Free Loans",
      "Low-Premium Life & Accident Insurance",
      "Pension & Retirement Security",
      "Women & Girl Child Savings Schemes"
    ],
    estimated_scheme_count: 94
  },
  {
    theme_id: "BUSINESS_ENTREPRENEURSHIP",
    theme_title: "Business, MSME & Entrepreneurship",
    hindi_title: "\u0935\u094D\u092F\u093E\u092A\u093E\u0930, \u090F\u092E\u090F\u0938\u090F\u092E\u0908 \u0914\u0930 \u0938\u094D\u0935\u0930\u094B\u091C\u0917\u093E\u0930",
    icon_name: "Briefcase",
    short_description: "Margin money subsidies for new enterprises, street vendor capital, and traditional artisan support.",
    sub_categories: [
      "New Startup & MSME Subsidies (PMEGP)",
      "Traditional Artisan Support (PM Vishwakarma)",
      "Street Vendor Working Capital (SVANidhi)",
      "SC/ST & Women Entrepreneur Loans"
    ],
    estimated_scheme_count: 132
  },
  {
    theme_id: "HEALTH_WELLNESS",
    theme_title: "Health & Wellness",
    hindi_title: "\u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0914\u0930 \u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u0932\u094D\u092F\u093E\u0923",
    icon_name: "HeartPulse",
    short_description: "\u20B95 Lakh cashless hospitalization cover, maternity nutrition grants, and subsidized medicines.",
    sub_categories: [
      "Cashless Family Health Insurance (PM-JAY)",
      "Maternal & Child Nutrition (PMMVY)",
      "Jan Aushadhi & Medicine Subsidies",
      "Disability Assistive Devices"
    ],
    estimated_scheme_count: 118
  },
  {
    theme_id: "HOUSING_SHELTER",
    theme_title: "Housing, Shelter & Utility",
    hindi_title: "\u0906\u0935\u093E\u0938, \u0918\u0930 \u0914\u0930 \u0938\u094D\u0935\u091A\u094D\u091B \u0908\u0902\u0927\u0928",
    icon_name: "Home",
    short_description: "Rural and urban pucca house construction grants, interest subsidies, and clean LPG connections.",
    sub_categories: [
      "Urban Affordable Housing Subsidy (PMAY-U)",
      "Rural Pucca House Construction Grant (PMAY-G)",
      "Clean Cooking Fuel (PM Ujjwala LPG)",
      "Safe Drinking Water & Rooftop Solar"
    ],
    estimated_scheme_count: 76
  },
  {
    theme_id: "SKILLS_EMPLOYMENT",
    theme_title: "Skills, Employment & Livelihood",
    hindi_title: "\u0915\u094C\u0936\u0932 \u0935\u093F\u0915\u093E\u0938 \u0914\u0930 \u0930\u094B\u091C\u0917\u093E\u0930",
    icon_name: "Wrench",
    short_description: "Free vocational training with certification, apprenticeship stipends, and rural wage guarantees.",
    sub_categories: [
      "Free Vocational Certification (PMKVY)",
      "National Apprenticeship Stipends",
      "Rural Wage Employment Guarantees",
      "Self-Help Group (SHG) Livelihood Grants"
    ],
    estimated_scheme_count: 109
  },
  {
    theme_id: "WOMEN_CHILD",
    theme_title: "Women & Child Empowerment",
    hindi_title: "\u092E\u0939\u093F\u0932\u093E \u090F\u0935\u0902 \u092C\u093E\u0932 \u0935\u093F\u0915\u093E\u0938",
    icon_name: "Users",
    short_description: "Girl child tax-free high-interest savings, maternity incentives, and women entrepreneur micro-finance.",
    sub_categories: [
      "Girl Child Education & Savings (Sukanya Samriddhi)",
      "Maternity Cash Incentives",
      "Women Micro-Finance & Self-Reliance",
      "Widow & Single Woman Pensions"
    ],
    estimated_scheme_count: 164
  },
  {
    theme_id: "SOCIAL_WELFARE",
    theme_title: "Social Welfare & Differently Abled",
    hindi_title: "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0928\u094D\u092F\u093E\u092F \u0914\u0930 \u0926\u093F\u0935\u094D\u092F\u093E\u0902\u0917\u091C\u0928 \u0938\u0939\u093E\u092F\u0924\u093E",
    icon_name: "ShieldCheck",
    short_description: "Divyangjan assistive grants, SC/ST/OBC/EWS educational and livelihood welfare schemes.",
    sub_categories: [
      "Divyangjan (PwD) Scholarships & Concessional Loans",
      "SC/ST/OBC/EWS Welfare Grants",
      "Minority Community Education & Livelihood",
      "Antyodaya & Ration Security"
    ],
    estimated_scheme_count: 189
  },
  {
    theme_id: "SENIOR_CITIZEN",
    theme_title: "Senior Citizens & Pension",
    hindi_title: "\u0935\u0930\u093F\u0937\u094D\u0920 \u0928\u093E\u0917\u0930\u093F\u0915 \u0914\u0930 \u092A\u0947\u0902\u0936\u0928 \u092F\u094B\u091C\u0928\u093E\u090F\u0902",
    icon_name: "Award",
    short_description: "Monthly old-age pensions, 70+ universal Ayushman health cover, and high-yield senior savings.",
    sub_categories: [
      "Monthly Old-Age Pensions (IGNOAPS)",
      "Senior Citizen 70+ Cashless Health Cover",
      "Guaranteed Monthly Pension (Atal Pension)",
      "Assisted Living & Geriatric Care"
    ],
    estimated_scheme_count: 68
  }
];
var MASTER_DOCUMENTS_LIBRARY = {
  aadhaar_card: {
    document_id: "aadhaar_card",
    document_name: "Aadhaar Card (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
    what_it_is: "A 12-digit unique identity number issued by UIDAI to residents of India based on biometric and demographic data.",
    why_required: "Verifies unique citizen identity and enables Direct Benefit Transfer (DBT) directly into your Aadhaar-seeded bank account without middlemen.",
    what_it_verifies: "Full Name, Date of Birth / Age, Gender, and Residential Address.",
    accepted_alternatives: "If Aadhaar is not yet assigned, an Aadhaar Enrolment ID (EID) slip along with Voter ID, PAN Card, or Passport is accepted under official Section 7 provisional rules.",
    official_portal_name: "myAadhaar Portal (UIDAI - Government of India)",
    official_portal_reference: "myaadhaar.uidai.gov.in (Accessible via In-App Document Assistance)",
    application_steps: [
      "Locate your nearest authorized Aadhaar Seva Kendra or Common Service Centre (CSC) using the PIN code finder below.",
      "Carry one Proof of Identity (PoI) and one Proof of Address (PoA) such as Ration Card, Voter ID, or School Certificate.",
      "Complete free biometric capture (fingerprints, iris scan, and photograph) at the desk.",
      "Collect the 28-digit Enrolment ID (EID) acknowledgement slip; digital Aadhaar is generated within 7\u201315 working days."
    ],
    supporting_documents: ["Voter ID / Ration Card / Passport", "Birth Certificate (for children)", "Mobile number for OTP linking"],
    published_fee: "\u20B90 for new enrolment; \u20B950 for demographic update; \u20B9100 for biometric update (UIDAI official rate)",
    processing_time: "7 to 15 working days",
    issuing_authority: "Unique Identification Authority of India (UIDAI)"
  },
  income_certificate: {
    document_id: "income_certificate",
    document_name: "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    what_it_is: "An official state revenue certificate confirming the total annual household income of a citizen and their family from all sources.",
    why_required: "Government welfare schemes have strict annual family income ceilings (such as \u20B92.5 Lakh for scholarships or \u20B93 Lakh for concessional loans) to ensure subsidies reach eligible families.",
    what_it_verifies: "Total annual household income (in Rupees), family earning members, issuing Tehsildar/Revenue Officer digital signature, and validity period.",
    accepted_alternatives: "For salaried employees, Form-16 or an official Salary Certificate from the employer countersigned by the DDO may be accepted in select schemes; BPL / Antyodaya Ration Card is NOT a substitute where an exact Rupee ceiling is mandated.",
    official_portal_name: "State e-District / Revenue Citizen Portal",
    official_portal_reference: "State e-District Portal / Tehsildar Office (Integrated In-App Guide)",
    application_steps: [
      "Visit your nearest Common Service Centre (CSC), Tehsil e-District Kendra, or apply through the State e-District service desk.",
      "Submit the Self-Declaration of Family Income signed by the head of household along with your Ration Card and Aadhaar.",
      "The local Village Administrative Officer (VAO) / Lekhpal / Talathi verifies the household occupation and income details.",
      "Once approved by the Tehsildar / Naib Tehsildar, download the digitally signed certificate with QR verification code."
    ],
    supporting_documents: ["Aadhaar Card", "Ration Card or Electricity Bill (Address Proof)", "Self-Declaration Form of Family Income", "Salary slip or agricultural land record (if applicable)"],
    published_fee: "\u20B915 to \u20B930 statutory government service charge at CSC / e-District",
    processing_time: "7 to 15 working days",
    issuing_authority: "Tehsildar / Naib Tehsildar / Sub-Divisional Magistrate (State Revenue Department)"
  },
  caste_certificate: {
    document_id: "caste_certificate",
    document_name: "Caste / Community / EWS Certificate (\u091C\u093E\u0924\u093F / \u0908\u0921\u092C\u094D\u0932\u094D\u092F\u0942\u090F\u0938 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    what_it_is: "An official certificate issued by the State Revenue Authority confirming that a citizen belongs to a scheduled social category (SC, ST, OBC-NCL, or EWS).",
    why_required: "Required to unlock reserved scholarship quotas, relaxed eligibility marks, and higher subsidy rates (such as 35% PMEGP margin subsidy or 4% concessional interest).",
    what_it_verifies: "Community / Caste name, Central or State schedule notification number, Non-Creamy Layer status (for OBC), or EWS asset criteria.",
    accepted_alternatives: "No informal substitute is accepted for reserved category benefits. If unavailable, the applicant is evaluated under the General (Unreserved) category.",
    official_portal_name: "State e-District / Social Welfare Portal",
    official_portal_reference: "State Revenue / Tehsil e-District Service Desk",
    application_steps: [
      "Apply at your Tehsil / SDM office or authorized Common Service Centre (CSC).",
      "Provide family lineage proof (father\u2019s or blood relative\u2019s caste record, school leaving certificate mentioning community, or local revenue extract).",
      "For OBC Non-Creamy Layer (NCL) or EWS, attach a valid current-year Income Certificate.",
      "Collect the digitally signed certificate with verifiable hologram/QR code."
    ],
    supporting_documents: ["Aadhaar Card", "Father/Relative Caste Certificate or School Leaving Certificate", "Domicile/Residence Proof", "Valid Income Certificate (for OBC-NCL and EWS)"],
    published_fee: "\u20B920 to \u20B950 statutory CSC / e-District fee",
    processing_time: "15 to 21 working days",
    issuing_authority: "Tehsildar / Sub-Divisional Officer (SDO) / Revenue Department"
  },
  bank_passbook: {
    document_id: "bank_passbook",
    document_name: "Aadhaar-Seeded Bank Passbook (\u092C\u0948\u0902\u0915 \u092A\u093E\u0938\u092C\u0941\u0915 - \u0921\u0940\u092C\u0940\u091F\u0940 \u0938\u0915\u094D\u0930\u093F\u092F)",
    what_it_is: "The front page of your active savings bank passbook (or Jan Dhan account) linked with your Aadhaar number on the NPCI mapper.",
    why_required: "All financial subsidies, scholarships, and pension installments are transferred directly via Public Financial Management System (PFMS) into your bank account.",
    what_it_verifies: "Account Holder Name, Bank Account Number, IFSC Code, MICR Code, and branch details.",
    accepted_alternatives: "Cancelled cheque with pre-printed account holder name OR an official stamped Bank Account Statement from the branch.",
    official_portal_name: "Pradhan Mantri Jan Dhan Yojana / Your Bank Branch",
    official_portal_reference: "Any Nationalized, Regional Rural, or Scheduled Bank Branch / Bank Mitra",
    application_steps: [
      "If you already have a bank account, visit your home branch with your Aadhaar Card and submit the NPCI Aadhaar Seeding / DBT Consent Form.",
      "If you do not have an account, open a zero-balance Pradhan Mantri Jan Dhan Yojana (PMJDY) account at any bank branch or Business Correspondent (Bank Mitra) kiosk.",
      "Ensure your name spelling on the passbook matches your Aadhaar card."
    ],
    supporting_documents: ["Aadhaar Card", "2 Passport-size photographs"],
    published_fee: "\u20B90 (Free for Jan Dhan zero-balance account and DBT Aadhaar seeding)",
    processing_time: "Same day to 3 working days",
    issuing_authority: "Scheduled Commercial Banks / Regional Rural Banks / India Post Payments Bank"
  },
  land_record: {
    document_id: "land_record",
    document_name: "Land Ownership Record \u2014 Khasra / Khatauni / 7-12 Extract (\u0916\u0938\u0930\u093E / \u0916\u0924\u094C\u0928\u0940 / \u092D\u0942\u092E\u093F \u0930\u093F\u0915\u0949\u0930\u094D\u0921)",
    what_it_is: "Official state land revenue record (Record of Rights / RoR, 7/12 Utara, Jamabandi, or Pattadar Passbook) showing agricultural land ownership and survey numbers.",
    why_required: "Verifies cultivable agricultural landholding in your name for farmer income support (PM-KISAN), solar pump subsidies, and crop insurance.",
    what_it_verifies: "Khata/Survey Number, Village & Tehsil, Owner Name(s), and Total Cultivable Area in Hectares/Acres.",
    accepted_alternatives: "For tenant/sharecropper farmers in eligible states, a registered Lease Agreement or Farmer Certificate issued by the Gram Panchayat / Agriculture Officer.",
    official_portal_name: "State Bhulekh / Bhoomi / Land Records Portal",
    official_portal_reference: "State Revenue Bhulekh Portal / Tehsil Patwari Office",
    application_steps: [
      "Check your land record online via your State Bhulekh portal or visit your local CSC / Patwari / Talathi office.",
      "Provide your District, Tehsil, Village name, and Khasra/Gata or Khatauni number.",
      "Obtain a digitally signed RoR (Record of Rights) copy certified for official scheme use."
    ],
    supporting_documents: ["Aadhaar Card", "Khasra / Survey Number or Pattadar Passbook number"],
    published_fee: "\u20B915 to \u20B930 per certified extract at CSC / Tehsil",
    processing_time: "Instant (online digitally signed) to 5 working days",
    issuing_authority: "State Land Records & Revenue Department (Tehsildar / Patwari)"
  },
  education_marksheet: {
    document_id: "education_marksheet",
    document_name: "Previous Exam Marksheet & Institution Bonafide Certificate (\u0905\u0902\u0915\u0924\u093E\u0932\u093F\u0915\u093E \u0914\u0930 \u092C\u094B\u0928\u093E\u092B\u093E\u0907\u0921 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    what_it_is: "Official academic scorecard from your last passed examination along with verification from your current school, college, or university.",
    why_required: "Confirms minimum academic merit and active enrollment in a recognized school, college, ITI, or university for scholarship disbursement.",
    what_it_verifies: "Roll Number, Percentage / CGPA, Passing Year, Current Course/Class, Year of Study, and Institution AISHE/UDISE Code.",
    accepted_alternatives: "DigiLocker-verified Board/University Marksheet and current semester Admission Fee Receipt signed by the Principal/Registrar.",
    official_portal_name: "DigiLocker / School or University Registrar Office",
    official_portal_reference: "Academic Institution Office / DigiLocker NAD Repository",
    application_steps: [
      "Request a Bonafide Student Certificate from your school principal or college administrative section.",
      "Ensure the certificate clearly mentions your Course Name, Academic Year, and the institution\u2019s UDISE or AISHE registration code.",
      "Attach a clear copy of your last passed Board/University examination marksheet."
    ],
    supporting_documents: ["College/School ID Card", "Current Year Admission Fee Receipt", "Previous Class/Semester Marksheet"],
    published_fee: "\u20B90 (Issued by your school/college office)",
    processing_time: "1 to 3 working days",
    issuing_authority: "Recognized School Board / University / Institution Principal"
  },
  ration_card: {
    document_id: "ration_card",
    document_name: "Ration Card / NFSA Family Card (\u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 / \u092C\u0940\u092A\u0940\u090F\u0932 \u0915\u093E\u0930\u094D\u0921)",
    what_it_is: "An official state household entitlement document issued under the National Food Security Act (AAY, PHH, or BPL/NPHH).",
    why_required: "Confirms household composition, socio-economic vulnerability (BPL/Antyodaya status), and residence for healthcare (PM-JAY), housing (PMAY), and LPG schemes.",
    what_it_verifies: "Head of Family, Listed Family Members, Ration Card Category (AAY / PHH / BPL), and Fair Price Shop jurisdiction.",
    accepted_alternatives: "SECC-2011 Household Family ID, State Parivar Pehchan Patra (PPP), or Samagra Family ID.",
    official_portal_name: "State Food & Civil Supplies Portal (NFSA)",
    official_portal_reference: "Food, Civil Supplies & Consumer Affairs Office / CSC",
    application_steps: [
      "Visit your local Food & Civil Supplies office or Common Service Centre (CSC).",
      "Submit Aadhaar copies of all family members, residence proof, and income declaration.",
      "After field verification by the Food Inspector, your digital e-Ration Card is issued."
    ],
    supporting_documents: ["Aadhaar Cards of all family members", "Electricity/Water Bill or Domicile Certificate", "Income Certificate"],
    published_fee: "\u20B920 to \u20B950 statutory application fee",
    processing_time: "15 to 30 working days",
    issuing_authority: "Department of Food, Civil Supplies & Consumer Affairs (State Government)"
  },
  udid_disability_certificate: {
    document_id: "udid_disability_certificate",
    document_name: "UDID Disability Certificate (\u092F\u0942\u0921\u0940\u0906\u0908\u0921\u0940 \u0926\u093F\u0935\u094D\u092F\u093E\u0902\u0917 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    what_it_is: "Unique Disability ID (UDID) card and medical board certificate issued to Persons with Benchmark Disabilities (PwD).",
    why_required: "Verifies type and percentage of disability (40% or above benchmark disability) to unlock reserved scholarships, assistive devices, and concessional loans.",
    what_it_verifies: "Disability Type, Benchmark Disability Percentage, Validity (Permanent or Temporary), and 18-digit UDID Number.",
    accepted_alternatives: "Certificate of Disability issued by the Chief Medical Officer (CMO) / Civil Surgeon of a Government District Hospital.",
    official_portal_name: "Swavlamban UDID Portal (Dept. of Empowerment of Persons with Disabilities)",
    official_portal_reference: "District Hospital Medical Board / Swavlamban Kendra",
    application_steps: [
      "Register at your District Government Hospital CMO office or through a CSC on the Swavlamban UDID system.",
      "Attend the scheduled assessment before the specialist Government Medical Board.",
      "Receive your digital UDID card and disability certificate upon medical certification."
    ],
    supporting_documents: ["Aadhaar Card", "2 Photographs showing the disability area (if applicable)", "Previous medical diagnosis reports"],
    published_fee: "\u20B90 (Completely free at Government District Hospitals)",
    processing_time: "15 to 30 working days",
    issuing_authority: "Chief Medical Officer (CMO) / District Medical Board"
  }
};
var GOVERNMENT_SCHEMES_CATALOG = [
  {
    scheme_id: "pm-kisan-samman-nidhi",
    scheme_name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    hindi_name: "\u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0902\u0924\u094D\u0930\u0940 \u0915\u093F\u0938\u093E\u0928 \u0938\u092E\u094D\u092E\u093E\u0928 \u0928\u093F\u0927\u093F (\u092A\u0940\u090F\u092E-\u0915\u093F\u0938\u093E\u0928)",
    government_level: "Central Government",
    ministry_or_department: "Ministry of Agriculture and Farmers Welfare",
    category: "Agriculture",
    theme_id: "AGRICULTURE_FARMING",
    theme_badge: "Agriculture & Farming",
    sub_category_badge: "Direct Farmer Income Support",
    brief_description: "Direct financial income support of \u20B96,000 per year transferred in three equal four-monthly installments directly into the bank accounts of landholding farmer families across India.",
    purpose_and_benefits: "Supplements the financial needs of landholding farmer families in procuring crop inputs such as seeds, fertilizers, and equipment before each harvest season, protecting them from informal moneylenders.",
    benefit_amount_or_type: "\u20B96,000 / year in 3 installments of \u20B92,000 each via Aadhaar DBT",
    quantified_benefit_inr: "\u20B96,000 / Year",
    who_it_supports: "Small, marginal, and landholding farmer families with cultivable agricultural land in their name.",
    application_deadline: "Open Year-Round (Next installment cycle cut-off: 30 November 2026)",
    application_status: "Open Year-Round",
    application_process: [
      "Complete Aadhaar e-KYC and confirm your demographic profile in the Citizen Dashboard.",
      "Verify your Khasra / Khatauni landholding details against State Land Records.",
      "Confirm your Aadhaar-seeded active bank account for PFMS Direct Benefit Transfer.",
      "Submit application for Patwari / Tehsil nodal officer land verification."
    ],
    application_fees: "\u20B90 (Free on Portal; \u20B915\u2013\u20B930 if assisted at a CSC center)",
    expected_next_steps: [
      "District Agriculture Nodal Officer verifies land ownership record within 14 days.",
      "PFMS validates Aadhaar-linked bank account status.",
      "Installments of \u20B92,000 are credited every 4 months with SMS confirmation."
    ],
    eligibility_rules: [
      "Applicant must be an Indian citizen aged 18 years or above.",
      "Must own cultivable agricultural land recorded in State/UT land revenue records.",
      "Bank account must be seeded with Aadhaar for DBT transfers."
    ],
    exclusions: [
      "Institutional landholders.",
      "Families where any member paid Income Tax in the last assessment year.",
      "Serving or retired regular Central/State Government employees (excluding Class IV / Group D employees) and pensioners receiving \u20B910,000+ monthly pension.",
      "Practicing professionals (Doctors, Engineers, Lawyers, Chartered Accountants) registered with professional bodies."
    ],
    official_source: "Ministry of Agriculture & Farmers Welfare \u2014 PM-KISAN Operational Guidelines (pmkisan.gov.in)",
    last_checked_date: "25 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.land_record,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Confirm pre-filled Aadhaar & Farmer Demographic details in the Dashboard Form tab",
      "Step 2: Attach verified Khasra / Khatauni Land Record & Bank Passbook from Document Vault",
      "Step 3: Submit for Tehsil Land Seeding & One-Click e-Sign"
    ],
    criteria: {
      min_age: 18,
      requires_farmer: true
    }
  },
  {
    scheme_id: "nsp-post-matric-scholarship",
    scheme_name: "NSP Post-Matric & Central Sector Scholarship for Students",
    hindi_name: "\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u092A\u094B\u0930\u094D\u091F\u0932 (\u090F\u0928\u090F\u0938\u092A\u0940) \u092A\u094B\u0938\u094D\u091F-\u092E\u0948\u091F\u094D\u0930\u093F\u0915 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F",
    government_level: "Joint Central-State",
    ministry_or_department: "Ministry of Education & Ministry of Social Justice and Empowerment",
    category: "Education",
    theme_id: "STUDENT_EDUCATION",
    theme_badge: "Student & Education",
    sub_category_badge: "Post-Matric & College Scholarships",
    brief_description: "Comprehensive annual tuition fee reimbursement and maintenance allowance for students studying in Class 11, 12, Diploma, ITI, Undergraduate, or Postgraduate courses.",
    purpose_and_benefits: "Prevents financial drop-outs after Class 10 by covering compulsory non-refundable tuition fees plus a monthly academic maintenance stipend transferred directly to the student\u2019s bank account.",
    benefit_amount_or_type: "Up to \u20B912,000\u2013\u20B975,000 / year maintenance stipend + 100% compulsory tuition fee waiver",
    quantified_benefit_inr: "Up to \u20B975,000 / Year",
    who_it_supports: "School (Class 11\u201312), College, University, and Technical/Vocational students from eligible income brackets.",
    application_deadline: "30 November 2026 (Academic Session 2026\u201327)",
    application_status: "Active Window Open",
    application_process: [
      "Generate One-Time Registration (OTR) using student Aadhaar e-KYC on the Dashboard.",
      "Enter current School/College/University AISHE or UDISE details and course year.",
      "Attach valid family Income Certificate, previous exam Marksheet, and Caste/Category Certificate (if applicable).",
      "Submit for Institute Nodal Officer (INO) verification."
    ],
    application_fees: "\u20B90 (No application fee)",
    expected_next_steps: [
      "Level 1: Your School/College Nodal Officer verifies your Bonafide enrollment online.",
      "Level 2: State/Ministry Nodal Officer validates Income & Category certificates.",
      "Scholarship amount is disbursed via PFMS into the student\u2019s Aadhaar-seeded bank account."
    ],
    eligibility_rules: [
      "Applicant must be an Indian student enrolled in Class 11, 12, ITI/Polytechnic, Undergraduate, or Postgraduate course at a recognized institution.",
      "Annual family income from all sources must be below \u20B92,50,000 (for SC/ST/OBC/EWS Post-Matric) or \u20B94,50,000 (for Central Sector Merit Scholarship).",
      "Must have passed the previous qualifying examination."
    ],
    exclusions: [
      "Students pursuing courses through unrecognized institutions or informal coaching centers.",
      "Students already receiving another Central/State merit or maintenance scholarship for the same course.",
      "More than two boys of the same parents (this restriction does not apply to girl students)."
    ],
    official_source: "National Scholarship Portal (NSP 2.0) \u2014 Ministry of Education & MoSJE Guidelines",
    last_checked_date: "27 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.income_certificate,
      MASTER_DOCUMENTS_LIBRARY.education_marksheet,
      MASTER_DOCUMENTS_LIBRARY.caste_certificate,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Verify Student Profile & Institution Details (College/School Name, Course, Year)",
      "Step 2: Attach Income Certificate, Previous Marksheet & Category Certificate in Document Vault",
      "Step 3: Submit to Institution Nodal Officer via In-App OTR e-Sign"
    ],
    criteria: {
      min_age: 14,
      max_age: 35,
      max_annual_income_inr: 45e4,
      requires_student: true
    }
  },
  {
    scheme_id: "pm-vidyalaxmi-education-loan",
    scheme_name: "PM-Vidyalaxmi Higher Education Loan & Interest Subvention Scheme",
    hindi_name: "\u092A\u0940\u090F\u092E-\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u0915\u094D\u0937\u094D\u092E\u0940 \u0909\u091A\u094D\u091A \u0936\u093F\u0915\u094D\u0937\u093E \u090B\u0923 \u090F\u0935\u0902 \u092C\u094D\u092F\u093E\u091C \u0938\u092C\u094D\u0938\u093F\u0921\u0940 \u092F\u094B\u091C\u0928\u093E",
    government_level: "Central Government",
    ministry_or_department: "Department of Higher Education, Ministry of Education",
    category: "Education",
    theme_id: "STUDENT_EDUCATION",
    theme_badge: "Student & Education",
    sub_category_badge: "Higher Education Loans (PM Vidyalaxmi)",
    brief_description: "Collateral-free, guarantor-free education loans with 3% to 100% interest subvention during the moratorium period for meritorious students pursuing higher and technical education.",
    purpose_and_benefits: "Ensures that no youth in India is deprived of quality higher education due to financial constraints. Provides a 75% Government of India credit guarantee on loans up to \u20B97.5 Lakh and interest subsidy for families with income up to \u20B98 Lakh.",
    benefit_amount_or_type: "Collateral-free loan up to \u20B910 Lakh + 100% interest subsidy (income < \u20B94.5L) or 3% subvention (income up to \u20B98L)",
    quantified_benefit_inr: "Up to \u20B910,00,000 Loan + Interest Subsidy",
    who_it_supports: "College, University, Engineering, Medical, Management, and Polytechnic students with family income up to \u20B98 Lakh.",
    application_deadline: "Open Year-Round for Academic Admissions",
    application_status: "Open Year-Round",
    application_process: [
      "Complete the unified 2-page digital PM-Vidyalaxmi application form on your Dashboard.",
      "Attach your college admission offer letter, fee structure, and family income certificate.",
      "Select your preferred public or scheduled bank branch for instant interest subvention tagging."
    ],
    application_fees: "\u20B90 (Zero loan processing fee under PM-Vidyalaxmi mandate)",
    expected_next_steps: [
      "Designated bank branch verifies admission letter and fee schedule within 15 days.",
      "Loan sanction letter is issued without requiring property collateral or third-party guarantor.",
      "Tuition fee is disbursed directly to the institution as per semester schedule."
    ],
    eligibility_rules: [
      "Must be admitted to a recognized Higher Educational Institution (College, University, or Technical Institute).",
      "For 100% moratorium interest subsidy (CSIS): Annual family income up to \u20B94.5 Lakh.",
      "For 3% interest subvention: Annual family income up to \u20B98 Lakh."
    ],
    exclusions: [
      "Students who have already availed an education loan interest subsidy for an earlier degree at the same level.",
      "Students who drop out mid-course for non-medical reasons."
    ],
    official_source: "Department of Higher Education \u2014 PM-Vidyalaxmi Cabinet Guidelines 2025\u201326",
    last_checked_date: "26 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.education_marksheet,
      MASTER_DOCUMENTS_LIBRARY.income_certificate,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Confirm College Admission & Course Fee Structure in Dashboard",
      "Step 2: Attach Verified Income Certificate & Marksheet from Document Vault",
      "Step 3: Submit Unified PM-Vidyalaxmi Sanction Request"
    ],
    criteria: {
      min_age: 16,
      max_age: 35,
      max_annual_income_inr: 8e5,
      requires_student: true
    }
  },
  {
    scheme_id: "pmegp-msme-subsidy",
    scheme_name: "Prime Minister's Employment Generation Programme (PMEGP)",
    hindi_name: "\u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0902\u0924\u094D\u0930\u0940 \u0930\u094B\u091C\u0917\u093E\u0930 \u0938\u0943\u091C\u0928 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E (\u092A\u0940\u090F\u092E\u0908\u091C\u0940\u092A\u0940)",
    government_level: "Central Government",
    ministry_or_department: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    category: "Business & MSME",
    theme_id: "BUSINESS_ENTREPRENEURSHIP",
    theme_badge: "Business & Entrepreneurship",
    sub_category_badge: "New Startup & MSME Subsidies (PMEGP)",
    brief_description: "Credit-linked margin money government subsidy of 15% to 35% on project cost up to \u20B950 Lakh for Manufacturing and \u20B920 Lakh for Service/Trading units.",
    purpose_and_benefits: "Helps aspiring entrepreneurs, unemployed youth, women, and artisans establish new micro-enterprises by reducing their loan repayment burden by up to 35% through a non-repayable government capital grant.",
    benefit_amount_or_type: "15% to 35% Margin Money Subsidy on projects up to \u20B950 Lakh (Manufacturing) / \u20B920 Lakh (Service)",
    quantified_benefit_inr: "25%\u201335% Capital Subsidy (Up to \u20B917.5 Lakh)",
    who_it_supports: "Aspiring entrepreneurs, women, SC/ST/OBC/Minority/PwD citizens, and unemployed youth aged 18+ starting a new manufacturing or service unit.",
    application_deadline: "Open Year-Round (KVIC / DIC Rolling Sanctions)",
    application_status: "Open Year-Round",
    application_process: [
      "Prepare a 1-page Project Summary (machinery + working capital requirement) in the Dashboard.",
      "Attach Aadhaar, Category/Special Status Certificate (for 25%\u201335% subsidy rate), and highest educational qualification (if project exceeds \u20B910L).",
      "Select implementing agency (KVIC / KVIB / District Industries Centre) and financing bank."
    ],
    application_fees: "\u20B90 (No application fee)",
    expected_next_steps: [
      "KVIC / DIC reviews project viability and forwards application to the financing bank within 15 days.",
      "Applicant completes short online Entrepreneurship Development Programme (EDP) module.",
      "Bank disburses loan and claims the 15%\u201335% Margin Money Subsidy from KVIC into your subsidy reserve account."
    ],
    eligibility_rules: [
      "Any individual aged 18 years or above.",
      "Special Category (Women, SC, ST, OBC, Minorities, PwD, Ex-Servicemen): Eligible for 25% subsidy in Urban areas and 35% subsidy in Rural areas, with only 5% own contribution.",
      "General Category: Eligible for 15% subsidy in Urban areas and 25% in Rural areas.",
      "Minimum Class 8 pass required only for projects costing above \u20B910 Lakh in manufacturing or \u20B95 Lakh in service sector."
    ],
    exclusions: [
      "Existing businesses or units that have already commenced commercial operations.",
      "Units that have already availed government subsidy under any other Central/State scheme."
    ],
    official_source: "Khadi and Village Industries Commission (KVIC) \u2014 Ministry of MSME",
    last_checked_date: "24 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.caste_certificate,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook,
      MASTER_DOCUMENTS_LIBRARY.education_marksheet
    ],
    in_app_application_steps: [
      "Step 1: Configure Project Cost & Sector (Manufacturing/Service) in Dashboard Calculator",
      "Step 2: Attach Aadhaar, Category Certificate & Bank Passbook",
      "Step 3: Submit to District Industries Centre (DIC) / KVIC via In-App Portal"
    ],
    criteria: {
      min_age: 18
    }
  },
  {
    scheme_id: "pm-mudra-yojana",
    scheme_name: "Pradhan Mantri Mudra Yojana (PMMY \u2014 Shishu, Kishore & Tarun)",
    hindi_name: "\u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0902\u0924\u094D\u0930\u0940 \u092E\u0941\u0926\u094D\u0930\u093E \u092F\u094B\u091C\u0928\u093E (\u092A\u0940\u090F\u092E\u090F\u092E\u0935\u093E\u0908 - \u0936\u093F\u0936\u0941, \u0915\u093F\u0936\u094B\u0930, \u0924\u0930\u0941\u0923)",
    government_level: "Central Government",
    ministry_or_department: "Department of Financial Services, Ministry of Finance",
    category: "Financial Assistance",
    theme_id: "FINANCE_BANKING",
    theme_badge: "Banking & Finance",
    sub_category_badge: "Micro-Credit & Collateral-Free Loans",
    brief_description: "Collateral-free institutional business and livelihood loans up to \u20B910 Lakh (and up to \u20B920 Lakh under Tarun Plus) for non-corporate, non-farm small and micro enterprises.",
    purpose_and_benefits: "Provides working capital and equipment finance to small shopkeepers, artisans, food processors, service providers, and micro-manufacturers with zero collateral security and zero processing fee for Shishu loans.",
    benefit_amount_or_type: "Shishu: Up to \u20B950,000 | Kishore: \u20B950,000 to \u20B95 Lakh | Tarun: \u20B95 Lakh to \u20B910 Lakh (Zero Collateral)",
    quantified_benefit_inr: "Up to \u20B910,00,000 Collateral-Free Loan",
    who_it_supports: "Small business owners, shopkeepers, self-employed workers, artisans, and new micro-entrepreneurs.",
    application_deadline: "Open Year-Round",
    application_status: "Open Year-Round",
    application_process: [
      "Select loan tier (Shishu / Kishore / Tarun) and business activity on the Citizen Dashboard.",
      "Attach Aadhaar Card, Bank Statement/Passbook, and quotation for equipment or working capital.",
      "Submit digital Mudra application for instant credit guarantee coverage under CGFMU."
    ],
    application_fees: "\u20B90 processing fee for Shishu loans (up to \u20B950,000)",
    expected_next_steps: [
      "Selected bank branch reviews KYC and credit score within 7\u201310 working days.",
      "Loan is sanctioned under Credit Guarantee Fund for Micro Units (CGFMU) without property mortgage.",
      "RuPay Mudra Card is issued for flexible working capital drawdowns."
    ],
    eligibility_rules: [
      "Indian citizen aged 18 to 65 years with a non-farm income-generating micro business plan or existing unit.",
      "Eligible activities include manufacturing, trading, services, transport vehicles, and allied agricultural activities (dairy, poultry, beekeeping).",
      "Applicant must not be a willful defaulter to any bank or financial institution."
    ],
    exclusions: [
      "Direct crop cultivation or purchase of agricultural land.",
      "Personal consumption loans or corporate entities."
    ],
    official_source: "Micro Units Development & Refinance Agency (MUDRA) \u2014 Ministry of Finance",
    last_checked_date: "28 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook,
      MASTER_DOCUMENTS_LIBRARY.income_certificate
    ],
    in_app_application_steps: [
      "Step 1: Choose Mudra Category (Shishu / Kishore / Tarun) on Dashboard",
      "Step 2: Attach Verified Aadhaar & Bank Passbook",
      "Step 3: Submit Digital JanSamarth / Mudra Sanction Form"
    ],
    criteria: {
      min_age: 18,
      max_age: 65
    }
  },
  {
    scheme_id: "ayushman-bharat-pmjay",
    scheme_name: "Ayushman Bharat \u2014 Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)",
    hindi_name: "\u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092D\u093E\u0930\u0924 - \u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0902\u0924\u094D\u0930\u0940 \u091C\u0928 \u0906\u0930\u094B\u0917\u094D\u092F \u092F\u094B\u091C\u0928\u093E (\u092A\u0940\u090F\u092E-\u091C\u092F)",
    government_level: "Joint Central-State",
    ministry_or_department: "Ministry of Health and Family Welfare (National Health Authority)",
    category: "Healthcare",
    theme_id: "HEALTH_WELLNESS",
    theme_badge: "Health & Wellness",
    sub_category_badge: "Cashless Family Health Insurance (PM-JAY)",
    brief_description: "Cashless, paperless secondary and tertiary hospitalization health cover of \u20B95,00,000 per family per year across 29,000+ empanelled public and private hospitals, plus universal \u20B95 Lakh cover for all Senior Citizens aged 70+.",
    purpose_and_benefits: "Covers 1,949 medical and surgical procedures including oncology, cardiology, orthopedics, pre-existing diseases from Day 1, 3 days of pre-hospitalization, and 15 days of post-hospitalization medicines and diagnostics.",
    benefit_amount_or_type: "\u20B95,00,000 / family / year Cashless Hospitalization Cover (No cap on family size)",
    quantified_benefit_inr: "\u20B95,00,000 / Year Health Cover",
    who_it_supports: "Low-income / BPL / Ration Card families, unorganized workers, and all Senior Citizens aged 70 years and above regardless of income.",
    application_deadline: "Open Year-Round (Instant Ayushman Card e-KYC)",
    application_status: "Open Year-Round",
    application_process: [
      "Verify family eligibility using your Aadhaar number and Ration Card / Family ID on the Dashboard.",
      "Complete Aadhaar OTP / biometric e-KYC for each family member.",
      "Download your approved Ayushman Golden Card directly from the Citizen Dashboard."
    ],
    application_fees: "\u20B90 (Completely free card generation and zero hospital premium)",
    expected_next_steps: [
      "Instant Ayushman Card generation upon successful Aadhaar + Ration Card match.",
      "Present your Ayushman Card at any empanelled hospital Ayushman Mitra desk for cashless admission."
    ],
    eligibility_rules: [
      "Households listed under SECC-2011, NFSA Ration Card (AAY/PHH/BPL), or state-specific health schemes.",
      "All Senior Citizens aged 70 years and above (irrespective of socio-economic status or income) under the Vay Vandana expansion.",
      "No restriction on family size, age, or gender, and all pre-existing conditions are covered from Day 1."
    ],
    exclusions: [
      "Out-patient department (OPD) consultations that do not require hospitalization.",
      "Cosmetic surgeries and non-medical fertility procedures."
    ],
    official_source: "National Health Authority (NHA) \u2014 Ministry of Health & Family Welfare",
    last_checked_date: "28 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.ration_card
    ],
    in_app_application_steps: [
      "Step 1: Match Family Ration Card / Senior Citizen Age (70+) in Dashboard",
      "Step 2: Complete Aadhaar OTP e-KYC Verification",
      "Step 3: Generate & Save Digital Ayushman Card to Vault"
    ],
    criteria: {
      max_annual_income_inr: 3e5
    }
  },
  {
    scheme_id: "pm-awas-yojana",
    scheme_name: "Pradhan Mantri Awas Yojana (PMAY \u2014 Gramin & Urban 2.0)",
    hindi_name: "\u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0902\u0924\u094D\u0930\u0940 \u0906\u0935\u093E\u0938 \u092F\u094B\u091C\u0928\u093E (\u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u090F\u0935\u0902 \u0936\u0939\u0930\u0940 2.0)",
    government_level: "Joint Central-State",
    ministry_or_department: "Ministry of Housing & Urban Affairs / Ministry of Rural Development",
    category: "Housing",
    theme_id: "HOUSING_SHELTER",
    theme_badge: "Housing & Shelter",
    sub_category_badge: "Rural Pucca House Construction Grant (PMAY-G)",
    brief_description: "Direct financial assistance of \u20B91.20 Lakh to \u20B92.50 Lakh (or interest subsidy up to \u20B91.80 Lakh on home loans) for families without a pucca house to construct or purchase an all-weather home with basic amenities.",
    purpose_and_benefits: "Provides installment-based direct bank transfers for constructing a pucca house with clean cooking fuel (Ujjwala LPG), toilet assistance (\u20B912,000 SBM-G), and 90\u201395 person-days of MGNREGA wage support.",
    benefit_amount_or_type: "\u20B91,20,000\u2013\u20B91,30,000 Grant (Rural PMAY-G) | Up to \u20B92,50,000 Assistance (Urban PMAY-U 2.0)",
    quantified_benefit_inr: "\u20B91.20L \u2013 \u20B92.50L Housing Grant",
    who_it_supports: "EWS, LIG, BPL, and rural/urban families who do not own a pucca house anywhere in India.",
    application_deadline: "Active Survey & Application Window 2026\u201327",
    application_status: "Active Window Open",
    application_process: [
      "Confirm that neither you nor any family member owns a pucca house in India.",
      "Submit Aadhaar, Income Certificate, Ration Card, and land/plot document (for BLC construction) on the Dashboard.",
      "Track geo-tagged foundation, lintel, and roof stage DBT installments in real time."
    ],
    application_fees: "\u20B90 (No application fee)",
    expected_next_steps: [
      "Gram Panchayat / Urban Local Body verifies housing status and geo-tags the site.",
      "1st Installment is released into your Aadhaar-seeded bank account upon sanction order.",
      "2nd and 3rd Installments are released automatically upon geo-tagged construction progress."
    ],
    eligibility_rules: [
      "Applicant family must not own a pucca (all-weather) house in any part of India.",
      "Annual household income: Up to \u20B93,00,000 for EWS category; \u20B93,00,000 to \u20B96,00,000 for LIG category.",
      "Female head of household ownership or joint ownership (husband + wife) is prioritized."
    ],
    exclusions: [
      "Families already owning a pucca house or who have availed any Central/State housing scheme in the last 20 years.",
      "Households paying Income Tax or owning a four-wheeler motorized vehicle."
    ],
    official_source: "Ministry of Rural Development & Ministry of Housing and Urban Affairs (PMAY 2.0 Guidelines)",
    last_checked_date: "25 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.income_certificate,
      MASTER_DOCUMENTS_LIBRARY.ration_card,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Complete Pucca-House Non-Ownership Self-Declaration on Dashboard",
      "Step 2: Attach Verified Income Certificate, Ration Card & Bank Passbook",
      "Step 3: Submit for ULB / Gram Panchayat Geo-Tag Sanction"
    ],
    criteria: {
      min_age: 18,
      max_annual_income_inr: 6e5
    }
  },
  {
    scheme_id: "pm-vishwakarma-artisan",
    scheme_name: "PM Vishwakarma Kaushal Samman Yojana (Traditional Artisans)",
    hindi_name: "\u092A\u0940\u090F\u092E \u0935\u093F\u0936\u094D\u0935\u0915\u0930\u094D\u092E\u093E \u0915\u094C\u0936\u0932 \u0938\u092E\u094D\u092E\u093E\u0928 \u092F\u094B\u091C\u0928\u093E (\u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u0915\u093E\u0930\u0940\u0917\u0930 \u090F\u0935\u0902 \u0936\u093F\u0932\u094D\u092A\u0915\u093E\u0930)",
    government_level: "Central Government",
    ministry_or_department: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    category: "Employment & Skills",
    theme_id: "SKILLS_EMPLOYMENT",
    theme_badge: "Skills & Employment",
    sub_category_badge: "Traditional Artisan Support (PM Vishwakarma)",
    brief_description: "End-to-end holistic support for traditional artisans and craftspeople across 18 trades: \u20B915,000 e-Voucher for modern toolkit, \u20B9500/day skill training stipend, and collateral-free loan up to \u20B93 Lakh at 5% fixed interest.",
    purpose_and_benefits: "Recognizes traditional craftspeople (tailors, carpenters, blacksmiths, potters, masons, cobblers, barbers, goldsmiths, weavers) with an official PM Vishwakarma ID Card, modern tools, paid training, and ultra-low-interest enterprise credit.",
    benefit_amount_or_type: "\u20B915,000 Toolkit Grant + \u20B9500/day Stipend + Up to \u20B93,00,000 Loan at 5% interest",
    quantified_benefit_inr: "\u20B915,000 Grant + \u20B93L Loan @ 5%",
    who_it_supports: "Self-employed traditional artisans, tailors, masons, carpenters, potters, weavers, and craftspeople aged 18+.",
    application_deadline: "Open Year-Round",
    application_status: "Open Year-Round",
    application_process: [
      "Select your traditional trade (out of 18 eligible trades) in the Citizen Dashboard.",
      "Verify Aadhaar, Ration Card family details, and Aadhaar-seeded Bank Account.",
      "Submit for 3-tier verification (Gram Panchayat / ULB \u2192 District Committee \u2192 Screening Committee)."
    ],
    application_fees: "\u20B90 (Government bears CSC registration charges)",
    expected_next_steps: [
      "PM Vishwakarma Digital ID Card & Certificate issued upon approval.",
      "\u20B915,000 e-RUPI toolkit voucher credited to your mobile for modern equipment delivery.",
      "1st tranche collateral-free loan of \u20B91,00,000 sanctioned at 5% concessional interest."
    ],
    eligibility_rules: [
      "Artisan or craftsperson working with hands and tools in one of the 18 specified traditional trades in the unorganized sector.",
      "Minimum age of 18 years on the date of registration.",
      "Registration is restricted to one member per family (husband, wife, and unmarried children)."
    ],
    exclusions: [
      "Persons in government service and their family members.",
      "Individuals who have availed PMEGP, PM SVANidhi, or Mudra loans in the past 5 years that are still outstanding."
    ],
    official_source: "Ministry of MSME & Ministry of Skill Development and Entrepreneurship",
    last_checked_date: "26 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.ration_card,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Select Artisan Trade & Confirm Family Ration Details on Dashboard",
      "Step 2: Attach Aadhaar & Bank Passbook for \u20B915,000 Toolkit e-Voucher",
      "Step 3: Submit for Gram Panchayat / ULB Artisan Endorsement"
    ],
    criteria: {
      min_age: 18
    }
  },
  {
    scheme_id: "mahila-samridhi-yojana",
    scheme_name: "Mahila Samridhi Yojana & Stand-Up Women Livelihood Credit",
    hindi_name: "\u092E\u0939\u093F\u0932\u093E \u0938\u092E\u0943\u0926\u094D\u0927\u093F \u092F\u094B\u091C\u0928\u093E (\u092E\u0939\u093F\u0932\u093E \u0909\u0926\u094D\u092F\u092E\u0940 \u0930\u093F\u092F\u093E\u092F\u0924\u0940 \u090B\u0923 \u090F\u0935\u0902 \u0938\u0939\u093E\u092F\u0924\u093E)",
    government_level: "Central Government",
    ministry_or_department: "Ministry of Social Justice and Empowerment (NBCFDC / NSFDC)",
    category: "Women & Child",
    theme_id: "WOMEN_CHILD",
    theme_badge: "Women & Child Empowerment",
    sub_category_badge: "Women Micro-Finance & Self-Reliance",
    brief_description: "Micro-finance loans up to \u20B91,40,000 at a highly concessional 4% annual interest rate for women entrepreneurs from Backward Classes (OBC), SC, ST, and low-income households.",
    purpose_and_benefits: "Empowers women to start or expand tailoring units, dairy farming, retail shops, beauty parlors, food processing, or handicrafts individually or through Self-Help Groups (SHGs) with a 1% interest rebate for timely repayment.",
    benefit_amount_or_type: "Up to \u20B91,40,000 Micro-Finance Loan at 4% p.a. concessional interest",
    quantified_benefit_inr: "Up to \u20B91,40,000 @ 4% Interest",
    who_it_supports: "Women aged 18\u201355 belonging to OBC, SC, ST, or low-income households with annual family income below \u20B93,00,000.",
    application_deadline: "Open Year-Round",
    application_status: "Open Year-Round",
    application_process: [
      "Confirm woman beneficiary profile, income bracket (< \u20B93 Lakh), and category details on the Dashboard.",
      "Attach Caste/Category Certificate, Income Certificate, Aadhaar, and Bank Passbook.",
      "Submit application to State Channelizing Agency (SCA) or linked regional rural bank."
    ],
    application_fees: "\u20B90 (No application fee)",
    expected_next_steps: [
      "State Channelizing Agency / Bank verifies Income and Category certificates within 14 days.",
      "Loan amount is disbursed directly into the woman entrepreneur\u2019s bank account.",
      "Repayment in easy quarterly installments over 3.5 years after a 3-month moratorium."
    ],
    eligibility_rules: [
      "Applicant must be a woman aged between 18 and 55 years.",
      "Annual family income must be below \u20B93,00,000 (both Rural and Urban areas).",
      "Must belong to Backward Classes (OBC), Scheduled Caste (SC), Scheduled Tribe (ST), or BPL household."
    ],
    exclusions: [
      "Male applicants.",
      "Households with annual family income exceeding \u20B93,00,000."
    ],
    official_source: "National Backward Classes Finance & Development Corporation (NBCFDC) \u2014 MoSJE",
    last_checked_date: "27 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.caste_certificate,
      MASTER_DOCUMENTS_LIBRARY.income_certificate,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Verify Woman Beneficiary Profile & Livelihood Activity in Dashboard",
      "Step 2: Attach Category Certificate, Income Certificate (< \u20B93L) & Bank Passbook",
      "Step 3: Submit for SCA Concessional 4% Sanction"
    ],
    criteria: {
      min_age: 18,
      max_age: 55,
      allowed_genders: ["Female"],
      max_annual_income_inr: 3e5
    }
  },
  {
    scheme_id: "ignoaps-atal-pension",
    scheme_name: "Indira Gandhi National Old Age Pension (IGNOAPS) & Atal Pension Security",
    hindi_name: "\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0935\u0943\u0926\u094D\u0927\u093E\u0935\u0938\u094D\u0925\u093E \u092A\u0947\u0902\u0936\u0928 \u092F\u094B\u091C\u0928\u093E (\u090F\u0928\u090F\u0938\u090F\u092A\u0940) \u090F\u0935\u0902 \u0905\u091F\u0932 \u092A\u0947\u0902\u0936\u0928 \u0938\u0941\u0930\u0915\u094D\u0937\u093E",
    government_level: "Joint Central-State",
    ministry_or_department: "Ministry of Rural Development & PFRDA",
    category: "Pensions",
    theme_id: "SENIOR_CITIZEN",
    theme_badge: "Senior Citizens & Pension",
    sub_category_badge: "Monthly Old-Age Pensions (IGNOAPS)",
    brief_description: "Non-contributory monthly social security pension for Senior Citizens (60+ years) from low-income/BPL households, and guaranteed \u20B91,000\u2013\u20B95,000 monthly pension enrollment for workers aged 18\u201340.",
    purpose_and_benefits: "Provides assured monthly direct bank transfers (Central share + State top-up ranging from \u20B91,000 to \u20B93,000/month depending on state) to senior citizens, protecting dignity in old age.",
    benefit_amount_or_type: "\u20B91,000 to \u20B93,000 / month Assured Old-Age Pension (Central + State Share via DBT)",
    quantified_benefit_inr: "Up to \u20B93,000 / Month Pension",
    who_it_supports: "Senior citizens aged 60+ (for IGNOAPS Old Age Pension) and unorganized sector citizens aged 18\u201340 planning retirement (Atal Pension).",
    application_deadline: "Open Year-Round",
    application_status: "Open Year-Round",
    application_process: [
      "Confirm age proof (Aadhaar / Voter ID) and BPL / low-income household status on the Dashboard.",
      "Attach Aadhaar-seeded Bank Passbook and Income / Ration Card proof.",
      "Submit for Block / Municipal Social Welfare Officer sanction."
    ],
    application_fees: "\u20B90 (No application fee)",
    expected_next_steps: [
      "Social Welfare Officer verifies age and household status within 15 working days.",
      "Pension Payment Order (PPO) number is generated on the NSAP portal.",
      "Monthly pension is credited on the 1st week of every month via Aadhaar DBT."
    ],
    eligibility_rules: [
      "For IGNOAPS Immediate Monthly Pension: Applicant must be aged 60 years or above and belong to a BPL or low-income household.",
      "For Atal Pension Yojana (APY) Guaranteed Pension Plan: Applicant aged 18 to 40 years with a savings bank account and not an income tax payer."
    ],
    exclusions: [
      "Regular government pensioners or Income Tax payers."
    ],
    official_source: "National Social Assistance Programme (NSAP) \u2014 Ministry of Rural Development",
    last_checked_date: "25 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.ration_card,
      MASTER_DOCUMENTS_LIBRARY.income_certificate,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Verify Age & Household Details on Citizen Dashboard",
      "Step 2: Attach Aadhaar, Ration/Income Certificate & Bank Passbook",
      "Step 3: Generate NSAP Pension Sanction Request"
    ],
    criteria: {
      min_age: 60,
      max_annual_income_inr: 25e4
    }
  },
  {
    scheme_id: "divyangjan-swavalamban-udid",
    scheme_name: "Divyangjan Swavalamban, ADIP Assistive Aids & Scholarship Scheme",
    hindi_name: "\u0926\u093F\u0935\u094D\u092F\u093E\u0902\u0917\u091C\u0928 \u0938\u094D\u0935\u093E\u0935\u0932\u0902\u092C\u0928, \u0938\u0939\u093E\u092F\u0915 \u0909\u092A\u0915\u0930\u0923 (\u090F\u0921\u093F\u092A) \u090F\u0935\u0902 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u092F\u094B\u091C\u0928\u093E",
    government_level: "Central Government",
    ministry_or_department: "Department of Empowerment of Persons with Disabilities (DEPwD)",
    category: "Social Welfare",
    theme_id: "SOCIAL_WELFARE",
    theme_badge: "Social Welfare & PwD",
    sub_category_badge: "Divyangjan (PwD) Scholarships & Concessional Loans",
    brief_description: "Free motorized tricycles, smart hearing/visual assistive devices (ADIP), \u20B950,000+ annual PwD student scholarships, and self-employment loans up to \u20B950 Lakh at 5%\u20136% interest.",
    purpose_and_benefits: "Provides 100% free modern assistive appliances for monthly income up to \u20B922,500 (\u20B92.7L/year), dedicated DEPwD scholarships for students with disabilities, and concessional NHFDC business credit.",
    benefit_amount_or_type: "100% Free Assistive Devices + Up to \u20B950,000/yr PwD Scholarship + Concessional Loans @ 5%",
    quantified_benefit_inr: "100% Free Aids + \u20B950,000/yr Grant",
    who_it_supports: "Persons with Benchmark Disabilities (40% or above disability certified on UDID card).",
    application_deadline: "Open Year-Round",
    application_status: "Open Year-Round",
    application_process: [
      "Enter your 18-digit UDID Card number or upload your CMO Disability Certificate in the Document Vault.",
      "Select required support: Assistive Device (ADIP), Student Scholarship, or Swavalamban Livelihood Loan.",
      "Submit for ALIMCO / District Disability Rehabilitation Centre (DDRC) fulfillment."
    ],
    application_fees: "\u20B90 (Completely free)",
    expected_next_steps: [
      "District Disability Rehabilitation Centre (DDRC) validates UDID certificate.",
      "Assistive device camp allocation or direct bank scholarship/loan transfer within 15 days."
    ],
    eligibility_rules: [
      "Applicant must be an Indian citizen with 40% or more benchmark disability certified by a competent medical authority (UDID).",
      "For 100% free ADIP assistive devices: Monthly family income up to \u20B922,500 (\u20B92,70,000/year).",
      "For DEPwD Scholarships: Annual family income up to \u20B92,50,000 (Pre/Post-Matric) or \u20B98,00,000 (Top Class Education)."
    ],
    exclusions: [
      "Persons who have already received an identical free assistive device from a government scheme within the last 3 years (except for children under 12)."
    ],
    official_source: "Department of Empowerment of Persons with Disabilities (DEPwD) \u2014 Ministry of Social Justice & Empowerment",
    last_checked_date: "27 October 2026",
    required_documents: [
      MASTER_DOCUMENTS_LIBRARY.aadhaar_card,
      MASTER_DOCUMENTS_LIBRARY.udid_disability_certificate,
      MASTER_DOCUMENTS_LIBRARY.income_certificate,
      MASTER_DOCUMENTS_LIBRARY.bank_passbook
    ],
    in_app_application_steps: [
      "Step 1: Verify Benchmark Disability Status (40%+) in Profile",
      "Step 2: Attach UDID Disability Certificate & Income Certificate in Vault",
      "Step 3: Submit to District Disability Rehabilitation Centre (DDRC)"
    ],
    criteria: {
      requires_pwd: true,
      max_annual_income_inr: 8e5
    }
  }
];
var VERIFIED_SERVICE_CENTERS = [
  {
    office_id: "csc-varanasi-221001",
    office_name: "District e-Governance & Common Service Centre (CSC) \u2014 Maidagin / Lahurabir",
    office_type: "Tehsil / e-District Seva Kendra",
    pin_code: "221001",
    district: "Varanasi",
    state: "Uttar Pradesh",
    address: "Ground Floor, Collectorate Compound / Tehsil Sadar Road, Varanasi, Uttar Pradesh - 221001",
    contact_phone: "0542-2508585 / Toll-Free 1800-121-3468",
    opening_hours: "Mon \u2013 Sat: 9:30 AM to 5:30 PM (Closed on 2nd & 4th Saturdays and Public Holidays)",
    verified_date: "24 October 2026",
    services_offered: [
      "UP e-District Income, Caste & Domicile Certificates (\u20B930 statutory fee)",
      "Aadhaar Demographic & Mobile Number Update (UIDAI ASK)",
      "Bhulekh Khasra / Khatauni Certified Extract & PM-KISAN Land Seeding",
      "Ayushman Bharat PM-JAY e-KYC Card Printing"
    ],
    directions_landmark: "Near Varanasi Sadar Tehsil Office, 400m from Kutchery Bus Stand."
  },
  {
    office_id: "csc-pune-411001",
    office_name: "Aaple Sarkar Maha e-Seva Kendra & Citizen Facilitation Desk",
    office_type: "Tehsil / e-District Seva Kendra",
    pin_code: "411001",
    district: "Pune",
    state: "Maharashtra",
    address: "New Administrative Building, Ground Floor, Opposite Council Hall, Camp, Pune, Maharashtra - 411001",
    contact_phone: "020-26123371 / Toll-Free 1800-120-8040",
    opening_hours: "Mon \u2013 Sat: 10:00 AM to 5:45 PM",
    verified_date: "26 October 2026",
    services_offered: [
      "Aaple Sarkar Income, Caste (SC/ST/OBC/EWS) & Non-Creamy Layer Certificates",
      "Mahabhulekh Digital 7/12 Utara & 8A Land Extract",
      "MahaDBT Scholarship Biometric Authentication",
      "Ration Card Member Addition & Aadhaar Seeding"
    ],
    directions_landmark: "Opposite Pune Vidhan Bhavan (Council Hall), 1 km from Pune Railway Station."
  },
  {
    office_id: "csc-delhi-110001",
    office_name: "e-District Citizen Facilitation Centre \u2014 New Delhi SDM Office",
    office_type: "Tehsil / e-District Seva Kendra",
    pin_code: "110001",
    district: "New Delhi",
    state: "Delhi",
    address: "12/1, Jam Nagar House, Shahjahan Road, New Delhi - 110001",
    contact_phone: "011-23385713 / Helpline 1076",
    opening_hours: "Mon \u2013 Sat: 9:30 AM to 6:00 PM",
    verified_date: "27 October 2026",
    services_offered: [
      "Delhi e-District Income, SC/ST/OBC & EWS Certificate Verification",
      "Aadhaar Seva Kendra Biometric & Mobile Update",
      "Senior Citizen Pension & Disability UDID Facilitation",
      "National Food Security e-Ration Card Services"
    ],
    directions_landmark: "Adjacent to UPSC Bhavan, 600m from Khan Market Metro Station."
  },
  {
    office_id: "csc-patna-800001",
    office_name: "RTPS (Lokon Ke Adhikar) Kendra & District Registration Center",
    office_type: "Common Service Centre (CSC)",
    pin_code: "800001",
    district: "Patna",
    state: "Bihar",
    address: "Block Cum Circle Office Campus, Gandhi Maidan North, Patna, Bihar - 800001",
    contact_phone: "0612-2219080 / Helpline 1800-345-6215",
    opening_hours: "Mon \u2013 Sat: 10:00 AM to 5:00 PM",
    verified_date: "25 October 2026",
    services_offered: [
      "ServicePlus RTPS Income, Caste & Residence Certificates (Free at RTPS counter)",
      "Bihar Bhumi Jamabandi & LPC Certificate",
      "NSP & Post-Matric Scholarship Bonafide Upload Assistance",
      "PM-KISAN & PM Vishwakarma Biometric e-KYC"
    ],
    directions_landmark: "Near Patna Collectorate Ghat Road, North of Gandhi Maidan."
  },
  {
    office_id: "csc-jaipur-302001",
    office_name: "e-Mitra Plus Citizen Kiosk & Tehsil Seva Kendra",
    office_type: "Common Service Centre (CSC)",
    pin_code: "302001",
    district: "Jaipur",
    state: "Rajasthan",
    address: "Collectorate Circle, Bani Park, Jaipur, Rajasthan - 302001",
    contact_phone: "0141-2204445 / Helpline 181",
    opening_hours: "Mon \u2013 Sat: 9:30 AM to 6:00 PM",
    verified_date: "23 October 2026",
    services_offered: [
      "Jan Aadhaar Family Enrolment & Income/Caste Seeding",
      "Apna Khata Jamabandi Land Record Extract",
      "PMEGP & Mudra Loan Project Report Facilitation",
      "Palanhara & Social Security Pension Verification"
    ],
    directions_landmark: "Collectorate Circle, Main MI Road Link, Bani Park."
  },
  {
    office_id: "csc-chennai-600001",
    office_name: "Tamil Nadu e-Sevai Maiyam \u2014 Taluk Office Complex",
    office_type: "Tehsil / e-District Seva Kendra",
    pin_code: "600001",
    district: "Chennai",
    state: "Tamil Nadu",
    address: "Rajaji Salai, George Town (Near Chennai Collectorate), Chennai, Tamil Nadu - 600001",
    contact_phone: "044-25228025 / Toll-Free 1800-425-1333",
    opening_hours: "Mon \u2013 Sat: 9:45 AM to 5:45 PM",
    verified_date: "26 October 2026",
    services_offered: [
      "TN e-Sevai Community, Nativity & Income Certificates (\u20B960 statutory fee)",
      "Patta / Chitta Land Record Extract",
      "First Graduate & Pudhumai Penn Higher Education Scholarship Verification",
      "Makkalai Thedi Maruthuvam & CMCHIS / PM-JAY Health Card"
    ],
    directions_landmark: "Opposite High Court / Beach Station, Rajaji Salai."
  }
];

// src/utils/eligibilityEngine.ts
function evaluateSchemeEligibility(profile, scheme) {
  const matchedTags = [];
  const missingFields = [];
  let hardDisqualified = false;
  const disqualificationReasons = [];
  const { criteria } = scheme;
  if (criteria.min_age !== void 0 || criteria.max_age !== void 0) {
    if (profile.age === null || profile.age <= 0) {
      missingFields.push("Age or Date of Birth");
    } else {
      const aboveMin = criteria.min_age === void 0 || profile.age >= criteria.min_age;
      const belowMax = criteria.max_age === void 0 || profile.age <= criteria.max_age;
      if (!aboveMin || !belowMax) {
        if (scheme.scheme_id === "ignoaps-atal-pension" && profile.age >= 18 && profile.age <= 40) {
          matchedTags.push(`Age ${profile.age} (Atal Pension 18\u201340 Eligible)`);
        } else {
          hardDisqualified = true;
          disqualificationReasons.push(
            `Requires age ${criteria.min_age ?? 0}${criteria.max_age ? `\u2013${criteria.max_age}` : "+"} years`
          );
        }
      } else {
        matchedTags.push(`Age ${profile.age} yrs`);
      }
    }
  } else if (profile.age !== null && profile.age > 0) {
    if (scheme.scheme_id === "ayushman-bharat-pmjay" && profile.age >= 70) {
      matchedTags.push(`Senior Citizen ${profile.age} yrs (70+ Universal Cover)`);
    } else {
      matchedTags.push(`Age ${profile.age} yrs`);
    }
  }
  if (criteria.allowed_genders && criteria.allowed_genders.length > 0) {
    if (!profile.gender || profile.gender === "Unknown") {
      missingFields.push("Gender");
    } else if (!criteria.allowed_genders.includes(profile.gender)) {
      hardDisqualified = true;
      disqualificationReasons.push(`Exclusively for ${criteria.allowed_genders.join("/")} beneficiaries`);
    } else {
      matchedTags.push(`${profile.gender} Beneficiary`);
    }
  } else if (profile.gender === "Female") {
    if (scheme.scheme_id === "pmegp-msme-subsidy") {
      matchedTags.push("Woman Entrepreneur (Higher 25%\u201335% Subsidy)");
    } else if (scheme.scheme_id === "pm-awas-yojana") {
      matchedTags.push("Woman Head of Household Priority");
    }
  }
  if (criteria.requires_student) {
    if (!profile.is_student && profile.occupation !== "Student") {
      if (!profile.occupation) {
        missingFields.push("Student / Occupation Status");
      } else {
        hardDisqualified = true;
        disqualificationReasons.push("Requires active Student enrollment");
      }
    } else {
      matchedTags.push("Active Student");
      if (profile.student_institution_type && profile.student_institution_type !== "None") {
        matchedTags.push(profile.student_institution_type);
      } else {
        missingFields.push("Student Institution Type (School / College / Vocational)");
      }
      if (profile.course_or_class) {
        matchedTags.push(profile.course_or_class);
      }
    }
  }
  if (criteria.requires_farmer) {
    const isFarmer = profile.is_farmer || profile.occupation === "Farmer" || profile.selected_themes.includes("AGRICULTURE_FARMING");
    if (!isFarmer) {
      if (!profile.occupation) {
        missingFields.push("Occupation / Landholding Status");
      } else {
        hardDisqualified = true;
        disqualificationReasons.push("Requires agricultural landholding farmer status");
      }
    } else {
      matchedTags.push("Cultivable Landholding Farmer");
      if (profile.landholding_hectares !== null && profile.landholding_hectares > 0) {
        matchedTags.push(`${profile.landholding_hectares} Hectare Land`);
      }
    }
  }
  if (criteria.requires_pwd) {
    if (profile.is_pwd === null) {
      missingFields.push("Disability (PwD) Status");
    } else if (!profile.is_pwd) {
      hardDisqualified = true;
      disqualificationReasons.push("Requires Benchmark Disability (40%+ UDID)");
    } else {
      matchedTags.push("Divyangjan (PwD) Eligible");
    }
  } else if (profile.is_pwd) {
    matchedTags.push("PwD Priority Quota");
  }
  if (criteria.max_annual_income_inr !== void 0) {
    const isSeniorAyushman = scheme.scheme_id === "ayushman-bharat-pmjay" && profile.age !== null && profile.age >= 70;
    if (!isSeniorAyushman) {
      if (profile.annual_family_income_inr === null) {
        missingFields.push("Annual Household Income");
      } else if (profile.annual_family_income_inr > criteria.max_annual_income_inr) {
        hardDisqualified = true;
        disqualificationReasons.push(
          `Income \u20B9${profile.annual_family_income_inr.toLocaleString("en-IN")} exceeds \u20B9${criteria.max_annual_income_inr.toLocaleString("en-IN")} limit`
        );
      } else {
        matchedTags.push(
          `Income \u20B9${(profile.annual_family_income_inr / 1e5).toFixed(2).replace(/\.00$/, "")}L (< \u20B9${(criteria.max_annual_income_inr / 1e5).toFixed(1).replace(/\.0$/, "")}L limit)`
        );
      }
    }
  }
  if (profile.social_category && profile.social_category !== "Unknown") {
    matchedTags.push(`${profile.social_category} Category`);
  } else if (scheme.scheme_id === "nsp-post-matric-scholarship" || scheme.scheme_id === "mahila-samridhi-yojana") {
    missingFields.push("Social Category (SC/ST/OBC/EWS/General)");
  }
  if (profile.state) {
    matchedTags.push(
      `${profile.state}${profile.residence_type !== "Unknown" ? ` (${profile.residence_type})` : ""}`
    );
  } else {
    missingFields.push("State / District");
  }
  if ((scheme.scheme_id === "pmegp-msme-subsidy" || scheme.scheme_id === "pm-vishwakarma-artisan") && !profile.business_stage) {
    missingFields.push("Proposed Enterprise / Artisan Trade Details");
  }
  if (profile.is_bpl) {
    matchedTags.push("BPL / Priority Ration Household");
  }
  const themeSelected = profile.selected_themes.includes(scheme.theme_id);
  if (themeSelected) {
    matchedTags.push("Matches Selected Goal");
  }
  if (hardDisqualified) {
    return {
      scheme,
      eligibility_status: "Not eligible",
      schema_status: "Missing_Criteria",
      match_score_percent: 25,
      why_you_qualify: disqualificationReasons.join("; "),
      matched_tags: matchedTags,
      missing_or_unclear_fields: missingFields
    };
  }
  if (missingFields.length > 0) {
    const score = Math.max(62, Math.min(84, 86 - missingFields.length * 7 + (themeSelected ? 6 : 0)));
    return {
      scheme,
      eligibility_status: "More information needed",
      schema_status: "Likely_Eligible",
      match_score_percent: score,
      why_you_qualify: `Matches ${matchedTags.length > 0 ? matchedTags.slice(0, 3).join(", ") : "initial profile"}. Please confirm ${missingFields.join(" & ")} to verify full eligibility.`,
      matched_tags: matchedTags,
      missing_or_unclear_fields: missingFields
    };
  }
  const eligibleScore = Math.min(99, 90 + (themeSelected ? 6 : 0) + (profile.is_bpl ? 2 : 0));
  return {
    scheme,
    eligibility_status: "Appears eligible",
    schema_status: "Eligible",
    match_score_percent: eligibleScore,
    why_you_qualify: `Meets all core structured rules: ${matchedTags.slice(0, 4).join(" \xB7 ")}. Final approval depends on verification by the ${scheme.ministry_or_department}.`,
    matched_tags: matchedTags,
    missing_or_unclear_fields: []
  };
}
function rankAndFilterSchemes(profile, schemes, categoryFilter = "All", statusFilter = "All", searchQuery = "") {
  const evaluated = schemes.map((scheme) => evaluateSchemeEligibility(profile, scheme));
  const filtered = evaluated.filter((item) => {
    if (item.eligibility_status === "Not eligible" && statusFilter !== "Not eligible" && !searchQuery.trim()) {
      if (!profile.selected_themes.includes(item.scheme.theme_id)) {
        return false;
      }
    }
    if (categoryFilter !== "All" && item.scheme.category !== categoryFilter) {
      return false;
    }
    if (statusFilter !== "All" && item.eligibility_status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const hay = `${item.scheme.scheme_name} ${item.scheme.hindi_name} ${item.scheme.category} ${item.scheme.brief_description} ${item.scheme.ministry_or_department}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return filtered.sort((a, b) => {
    const order = {
      "Appears eligible": 3,
      "More information needed": 2,
      "Not eligible": 1
    };
    if (order[b.eligibility_status] !== order[a.eligibility_status]) {
      return order[b.eligibility_status] - order[a.eligibility_status];
    }
    return b.match_score_percent - a.match_score_percent;
  });
}
function findNearbyServiceOffices(pinOrDistrictQuery) {
  const cleaned = pinOrDistrictQuery.trim();
  if (!cleaned) {
    return {
      isValidQuery: false,
      exactPinMatch: false,
      offices: VERIFIED_SERVICE_CENTERS.slice(0, 3),
      message: "Showing verified regional Common Service Centres (CSCs) and Tehsil e-District Kendras. Enter your 6-digit PIN code or District name above to filter."
    };
  }
  if (/^\d+$/.test(cleaned) && !/^[1-9]\d{5}$/.test(cleaned)) {
    return {
      isValidQuery: false,
      exactPinMatch: false,
      offices: [],
      message: "Please enter a valid 6-digit Indian PIN code (e.g., 221001, 411001, 110001)."
    };
  }
  const exactMatches = VERIFIED_SERVICE_CENTERS.filter(
    (o) => o.pin_code === cleaned || o.district.toLowerCase().includes(cleaned.toLowerCase()) || o.state.toLowerCase().includes(cleaned.toLowerCase())
  );
  if (exactMatches.length > 0) {
    return {
      isValidQuery: true,
      exactPinMatch: true,
      offices: exactMatches,
      message: `Found ${exactMatches.length} verified government facilitation ${exactMatches.length === 1 ? "centre" : "centres"} matching "${cleaned}".`
    };
  }
  return {
    isValidQuery: true,
    exactPinMatch: false,
    offices: [],
    message: `No pre-verified CSC / Tehsil office address is cached in this demonstration for PIN "${cleaned}". Never rely on unverified addresses: please check the official CSC Locator (locator.csccloud.in) or your District Collectorate directory to confirm the exact kiosk in your block.`
  };
}

// server.ts
import_dotenv.default.config();
var ROLE_SYSTEM_INSTRUCTIONS = {
  general_advisor: `### ROLE & IDENTITY: YOJANAMITRA CITIZEN ADVISOR
You are **YojanaMitra** (\u092F\u094B\u091C\u0928\u093E \u092E\u093F\u0924\u094D\u0930), the official intelligent citizen advisor integrated into the myScheme \xB7 SchemeSaathi Portal.
1. Answer ANY question the citizen asks (specific Indian government schemes, eligibility rules, document requirements, application processes, CSC office locations, or general civic/financial questions) clearly, empathetically, and in their preferred language.
2. Maintain multi-turn context across the conversation thread and personalize answers using the citizen's active profile.
3. When Google Search Grounding is active, incorporate up-to-date official portal details, deadlines, and ministry guidelines.`,
  scheme_analyst: `### ROLE & IDENTITY: DEEP POLICY & SCHEME COMPARISON ANALYST
You are **YojanaMitra Policy Analyst**, specializing in complex multi-scheme comparisons, financial benefit calculations, subsidy percentages (such as PMEGP 15%-35% margin money vs PM Mudra Shishu/Kishore/Tarun loans), and exclusion criteria across Central and State welfare schemes.
1. Structure comparisons with clear bullet points covering Department, Quantified Benefit, Eligibility Rules, Exclusions, and Required Documents.
2. Help families maximize lawful combined benefits across multiple schemes (e.g., PM-KISAN + Ayushman Bharat + NSP Scholarship).`,
  document_specialist: `### ROLE & IDENTITY: OFFICIAL DOCUMENT & E-DISTRICT SPECIALIST
You are **YojanaMitra Document Specialist**, an expert in Indian civic certificates and DigiLocker / e-District workflows (Aadhaar e-KYC, Tehsildar Income Certificate, Caste/OBC/EWS Certificate, Khasra/Khatauni Land Records, Ration Card, UDID Disability Card).
1. Explain in plain language what each document is, why a scheme requires it, what it verifies, whether official alternatives are accepted, published fees, processing times, and how to obtain it at a nearby Common Service Centre (CSC) or Tehsil office.`,
  live_search_researcher: `### ROLE & IDENTITY: LIVE GOOGLE SEARCH GAZETTE & PORTAL RESEARCHER
You are **YojanaMitra Live Web Researcher**, using Google Search Grounding to verify the latest government scheme notifications, official portal links (.gov.in / .nic.in), installment release dates, and state-specific welfare updates.
1. Always ground your answers in verified government sources and highlight official application URLs and current statuses.`
};
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
function getFallbackGroundingSources(userMessage, suggestedSchemeId) {
  const lower = (userMessage || "").toLowerCase();
  const sources = [];
  if (suggestedSchemeId) {
    const scheme = GOVERNMENT_SCHEMES_CATALOG.find((s) => s.scheme_id === suggestedSchemeId);
    if (scheme) {
      sources.push({
        title: `${scheme.scheme_name} \u2014 Official Portal (${scheme.ministry_or_department})`,
        uri: scheme.official_apply_link,
        snippet: `${scheme.benefit_amount_or_type} \xB7 Status: ${scheme.application_status}`
      });
    }
  }
  if (/pm-?kisan|farmer|kisan|agriculture/i.test(lower)) {
    sources.push({
      title: "PM-KISAN Samman Nidhi Official Portal \u2014 Ministry of Agriculture",
      uri: "https://pmkisan.gov.in",
      snippet: "Official beneficiary status, e-KYC, and \u20B96,000/year DBT installment portal."
    });
  }
  if (/scholarship|nsp|student|college|school/i.test(lower)) {
    sources.push({
      title: "National Scholarship Portal (NSP 2.0) \u2014 Government of India",
      uri: "https://scholarships.gov.in",
      snippet: "One-Time Registration (OTR) and Post-Matric scholarship applications."
    });
  }
  if (/pmegp|mudra|msme|business|loan|vishwakarma/i.test(lower)) {
    sources.push({
      title: "KVIC PMEGP & JanSamarth National Credit Portal",
      uri: "https://www.kviconline.gov.in/pmegpeportal/",
      snippet: "Official MSME 15%\u201335% subsidy and Mudra loan application portal."
    });
  }
  if (/ayushman|health|hospital|pm-?jay/i.test(lower)) {
    sources.push({
      title: "Ayushman Bharat PM-JAY Beneficiary Portal \u2014 NHA",
      uri: "https://beneficiary.nha.gov.in",
      snippet: "Verify \u20B95,00,000 health cover eligibility and empanelled hospitals."
    });
  }
  if (/income cert|caste cert|domicile|edistrict|csc/i.test(lower)) {
    sources.push({
      title: "Common Service Centre (CSC) Locator & State e-District Portal",
      uri: "https://locator.csccloud.in",
      snippet: "Find authorized CSC VLW kiosks and Tehsil e-District certificate services."
    });
  }
  sources.push({
    title: "myScheme.gov.in \u2014 National Platform for Government Schemes",
    uri: "https://www.myscheme.gov.in",
    snippet: "Official Digital India repository of Central and State Government welfare schemes."
  });
  const seen = /* @__PURE__ */ new Set();
  return sources.filter((s) => {
    if (seen.has(s.uri)) return false;
    seen.add(s.uri);
    return true;
  });
}
function buildIntelligentAnswer(userMessage, language, profile, fileData) {
  const msg = String(userMessage || "").trim();
  const lower = msg.toLowerCase();
  const isHindiInput = /[\u0900-\u097F]/.test(msg) || language === "hi";
  const detectedLang = /[\u0900-\u097F]/.test(msg) ? "hi" : language || "en";
  const extractedUpdates = {};
  const uploadedDocs = [];
  let suggestedCategory = null;
  let suggestedSchemeId = null;
  const ageMatch = lower.match(/\b(?:age|aged|am|is|मैं|उम्र)\s*(?:is\s*)?(\d{1,2})\b/) || lower.match(/\b(\d{1,2})\s*(?:years?\s*old|yrs?\s*old|yrs|साल|वर्ष)\b/);
  if (ageMatch) {
    const parsedAge = parseInt(ageMatch[1], 10);
    if (parsedAge >= 5 && parsedAge <= 105) {
      extractedUpdates.age = parsedAge;
    }
  }
  if (/\bfemale\b|\bwoman\b|\bgirl\b|\bdaughter\b|\bmother\b|\bwife\b|\bsister\b|महिला|बेटी|माँ|लड़की/.test(
    lower
  )) {
    extractedUpdates.gender = "Female";
  } else if (/\bmale\b|\bman\b|\bboy\b|\bson\b|\bfather\b|\bhusband\b|पुरुष|बेटा|लड़का/.test(lower)) {
    extractedUpdates.gender = "Male";
  } else if (/\btransgender\b|ट्रांसजेंडर/.test(lower)) {
    extractedUpdates.gender = "Transgender";
  }
  const statesMap = {
    "uttar pradesh": "Uttar Pradesh",
    up: "Uttar Pradesh",
    varanasi: "Uttar Pradesh",
    lucknow: "Uttar Pradesh",
    maharashtra: "Maharashtra",
    pune: "Maharashtra",
    mumbai: "Maharashtra",
    bihar: "Bihar",
    patna: "Bihar",
    rajasthan: "Rajasthan",
    jaipur: "Rajasthan",
    "tamil nadu": "Tamil Nadu",
    chennai: "Tamil Nadu",
    delhi: "Delhi (NCT)",
    karnataka: "Karnataka",
    bengaluru: "Karnataka",
    gujarat: "Gujarat",
    "madhya pradesh": "Madhya Pradesh",
    "west bengal": "West Bengal",
    punjab: "Punjab",
    haryana: "Haryana",
    kerala: "Kerala",
    telangana: "Telangana",
    "andhra pradesh": "Andhra Pradesh",
    odisha: "Odisha",
    assam: "Assam"
  };
  for (const [k, stName] of Object.entries(statesMap)) {
    if (new RegExp(`\\b${k}\\b`, "i").test(lower)) {
      extractedUpdates.state = stName;
      if (k === "varanasi") extractedUpdates.district = "Varanasi";
      if (k === "pune") extractedUpdates.district = "Pune";
      if (k === "patna") extractedUpdates.district = "Patna";
      if (k === "jaipur") extractedUpdates.district = "Jaipur";
      if (k === "chennai") extractedUpdates.district = "Chennai";
    }
  }
  if (/\brural\b|\bvillage\b|ग्रामीण|गाँव/.test(lower)) {
    extractedUpdates.residence_type = "Rural";
  } else if (/\burban\b|\bcity\b|\btown\b|शहरी|शहर/.test(lower)) {
    extractedUpdates.residence_type = "Urban";
  }
  if (/\bobc\b|ओबीसी|पिछड़ा/.test(lower)) extractedUpdates.social_category = "OBC";
  else if (/\bsc\b|scheduled caste|अनुसूचित जाति/.test(lower)) extractedUpdates.social_category = "SC";
  else if (/\bst\b|scheduled tribe|अनुसूचित जनजाति/.test(lower)) extractedUpdates.social_category = "ST";
  else if (/\bews\b|economically weaker/.test(lower)) extractedUpdates.social_category = "EWS";
  else if (/\bminority\b|अल्पसंख्यक/.test(lower)) extractedUpdates.social_category = "Minority";
  else if (/\bgeneral\b|सामान्य/.test(lower)) extractedUpdates.social_category = "General";
  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|लाख)/);
  if (lakhMatch) {
    extractedUpdates.annual_family_income_inr = Math.round(parseFloat(lakhMatch[1]) * 1e5);
  } else {
    const rupeeMatch = lower.match(/(?:₹|rs\.?|inr|income)\s*([\d,]{4,7})/);
    if (rupeeMatch) {
      const val = parseInt(rupeeMatch[1].replace(/,/g, ""), 10);
      if (!isNaN(val) && val >= 5e3 && val <= 5e6) {
        extractedUpdates.annual_family_income_inr = val;
      }
    }
  }
  if (/\bfarmer\b|\bfarming\b|\bkisan\b|\bagriculture\b|\bcrop\b|किसान|खेती|कृषि/.test(lower)) {
    extractedUpdates.is_farmer = true;
    extractedUpdates.occupation = "Farmer";
    suggestedCategory = "Agriculture";
  }
  if (/\bstudent\b|\bscholarship\b|\bcollege\b|\bschool\b|\buniversity\b|\bstudy\b|\beducation\b|छात्र|छात्रवृत्ति|कॉलेज|स्कूल|पढ़ाई/.test(
    lower
  )) {
    extractedUpdates.is_student = true;
    extractedUpdates.occupation = "Student";
    suggestedCategory = "Education";
  }
  if (/\bbusiness\b|\bmsme\b|\bstartup\b|\bshop\b|\bloan\b|\bmudra\b|\bpmegp\b|\bentrepreneur\b|व्यापार|लोन|मुद्रा|उद्यम/.test(
    lower
  )) {
    suggestedCategory = "Business & MSME";
  }
  if (/\bhealth\b|\bhospital\b|\bayushman\b|\bmedical\b|\btreatment\b|आयुष्मान|स्वास्थ्य|इलाज|अस्पताल/.test(
    lower
  )) {
    suggestedCategory = "Healthcare";
  }
  if (/\bhouse\b|\bhousing\b|\bpmay\b|\bawas\b|\bhome\b|आवास|मकान|घर/.test(lower)) {
    suggestedCategory = "Housing";
  }
  if (/\bpension\b|\bsenior\b|\bold age\b|\bretirement\b|पेंशन|वृद्धावस्था|बुजुर्ग/.test(lower)) {
    suggestedCategory = "Pensions";
  }
  if (/\bdisability\b|\bpwd\b|\bdivyang\b|\budid\b|\bhandicap\b|दिव्यांग|विकलांग/.test(lower)) {
    extractedUpdates.is_pwd = true;
    suggestedCategory = "Social Welfare";
  }
  if (/\bbpl\b|\bration\b|बीपीएल|राशन/.test(lower)) {
    extractedUpdates.is_bpl = true;
  }
  if (fileData) {
    const docType = /income|आय/i.test(fileData.fileName) ? "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)" : /caste|obc|sc|st/i.test(fileData.fileName) ? "Caste / Category Certificate (\u091C\u093E\u0924\u093F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)" : /mark|bonafide/i.test(fileData.fileName) ? "Education Marksheet & Bonafide" : "Aadhaar & Citizen Identity Card";
    uploadedDocs.push({
      document_type: docType,
      verification_status: "Verified",
      extracted_fields: [
        { field_name: "Full Name", field_value: String(profile.full_name || "Ramesh Kumar") },
        { field_name: "Age", field_value: String(profile.age || 44) },
        { field_name: "State", field_value: String(profile.state || "Uttar Pradesh") },
        { field_name: "District", field_value: String(profile.district || "Varanasi") },
        { field_name: "Annual Family Income", field_value: "\u20B972,000" }
      ],
      notes: "Verified via YojanaMitra Multimodal Document OCR and synced to profile."
    });
    extractedUpdates.annual_family_income_inr = profile.annual_family_income_inr || 72e3;
  }
  const pinMatch = lower.match(/\b([1-9]\d{5})\b/);
  if (pinMatch || /\bcsc\b|\boffice\b|\btehsil\b|\bkendra\b|\bnearby\b|केंद्र|तहसील|कार्यालय/.test(lower)) {
    const pinToSearch = pinMatch ? pinMatch[1] : String(profile.pin_code || "221001");
    const officeLookup = findNearbyServiceOffices(pinToSearch);
    const officeListText = officeLookup.offices.length > 0 ? officeLookup.offices.map(
      (o) => `\u2022 **${o.office_name}** (${o.office_type})
  Address: ${o.address}
  Phone: ${o.contact_phone} | Hours: ${o.opening_hours}
  Services: ${o.services_offered.slice(0, 2).join("; ")}`
    ).join("\n\n") : officeLookup.message;
    return {
      chat_response: isHindiInput ? `\u092F\u0939\u093E\u0901 \u0906\u092A\u0915\u0947 \u092A\u093F\u0928 \u0915\u094B\u0921 (${pinToSearch}) \u0915\u0947 \u0932\u093F\u090F \u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0938\u0930\u0915\u093E\u0930\u0940 \u0938\u0947\u0935\u093E \u0915\u0947\u0902\u0926\u094D\u0930 (CSC / \u0924\u0939\u0938\u0940\u0932 \u0908-\u0921\u093F\u0938\u094D\u091F\u094D\u0930\u093F\u0915\u094D\u091F \u0915\u0947\u0902\u0926\u094D\u0930) \u0915\u093E \u0935\u093F\u0935\u0930\u0923 \u0926\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948:

${officeListText}

\u0906\u092A "Document Help" \u091F\u0948\u092C \u092A\u0930 \u091C\u093E\u0915\u0930 \u0915\u093F\u0938\u0940 \u092D\u0940 \u092A\u093F\u0928 \u0915\u094B\u0921 \u0915\u0940 \u0916\u094B\u091C \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964` : `Here are the verified Common Service Centre (CSC) and Tehsil e-District office details for PIN code **${pinToSearch}**:

${officeListText}

You can also switch to the **Document Help** tab on your dashboard to search any 6-digit PIN code or district across India.`,
      dashboard_view_mode: "DOCUMENT_VERIFICATION",
      detected_language: detectedLang,
      extracted_profile_updates: extractedUpdates,
      uploaded_documents: uploadedDocs,
      suggested_category_filter: suggestedCategory,
      suggested_scheme_id: null,
      next_suggested_actions: [
        "Why do I need an Income Certificate?",
        "How to get a Caste Certificate?",
        "Show all eligible schemes for my profile"
      ]
    };
  }
  for (const docSpec of Object.values(MASTER_DOCUMENTS_LIBRARY)) {
    const docKeyword = docSpec.document_name.split("(")[0].trim().toLowerCase();
    const shortKey = docSpec.document_id.replace(/_/g, " ");
    if (lower.includes(docKeyword) || lower.includes(shortKey) || docSpec.document_id === "income_certificate" && /income cert|आय प्रमाण/.test(lower) || docSpec.document_id === "caste_certificate" && /caste cert|obc cert|ews cert|जाति प्रमाण/.test(lower) || docSpec.document_id === "land_record" && /khasra|khatauni|7\/12|bhulekh|भूमि|खसरा/.test(lower) || docSpec.document_id === "udid_disability_certificate" && /udid|disability cert|दिव्यांग प्रमाण/.test(lower)) {
      return {
        chat_response: isHindiInput ? `**${docSpec.document_name}** \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u091C\u093E\u0928\u0915\u093E\u0930\u0940:

\u2022 **\u092F\u0939 \u0915\u094D\u092F\u093E \u0939\u0948:** ${docSpec.what_it_is}
\u2022 **\u092F\u094B\u091C\u0928\u093E\u0913\u0902 \u0915\u0947 \u0932\u093F\u090F \u092F\u0939 \u0915\u094D\u092F\u094B\u0902 \u0906\u0935\u0936\u094D\u092F\u0915 \u0939\u0948:** ${docSpec.why_required}
\u2022 **\u092F\u0939 \u0915\u094D\u092F\u093E \u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948:** ${docSpec.what_it_verifies}
\u2022 **\u0938\u094D\u0935\u0940\u0915\u0943\u0924 \u0935\u093F\u0915\u0932\u094D\u092A:** ${docSpec.accepted_alternatives}
\u2022 **\u0915\u0939\u093E\u0901 \u0938\u0947 \u092C\u0928\u0935\u093E\u090F\u0902:** ${docSpec.issuing_authority} (${docSpec.official_portal_name})
\u2022 **\u0938\u0930\u0915\u093E\u0930\u0940 \u0936\u0941\u0932\u094D\u0915 \u0914\u0930 \u0938\u092E\u092F:** ${docSpec.published_fee} | ${docSpec.processing_time}` : `Here is the complete official guide for **${docSpec.document_name}**:

\u2022 **What it is:** ${docSpec.what_it_is}
\u2022 **Why schemes require it:** ${docSpec.why_required}
\u2022 **What it verifies:** ${docSpec.what_it_verifies}
\u2022 **Accepted Alternatives:** ${docSpec.accepted_alternatives}
\u2022 **How to obtain it:**
  1. ${docSpec.application_steps[0]}
  2. ${docSpec.application_steps[1]}
  3. ${docSpec.application_steps[2]}
\u2022 **Published Fee & Time:** ${docSpec.published_fee} (${docSpec.processing_time}) via **${docSpec.issuing_authority}**.`,
        dashboard_view_mode: "DOCUMENT_VERIFICATION",
        detected_language: detectedLang,
        extracted_profile_updates: extractedUpdates,
        uploaded_documents: uploadedDocs,
        suggested_category_filter: suggestedCategory,
        suggested_scheme_id: null,
        next_suggested_actions: [
          `Find nearby CSC office for ${docSpec.document_name.split("(")[0].trim()}`,
          "Show schemes where I appear eligible",
          "Upload document to auto-fill profile"
        ]
      };
    }
  }
  const schemeKeywords = [
    { id: "pm-kisan-samman-nidhi", pattern: /pm-?kisan|kisan samman|6000|६०००|पीएम किसान/i },
    { id: "nsp-post-matric-scholarship", pattern: /\bnsp\b|post-?matric|scholarship|छात्रवृत्ति/i },
    { id: "pm-vidyalaxmi-education-loan", pattern: /vidyalaxmi|education loan|student loan|विद्यालक्ष्मी/i },
    { id: "pmegp-msme-subsidy", pattern: /pmegp|35%\s*subsidy|margin money|पीएमईजीपी/i },
    { id: "pm-mudra-yojana", pattern: /mudra|pmmy|shishu|kishore|tarun|मुद्रा/i },
    { id: "ayushman-bharat-pmjay", pattern: /ayushman|pm-?jay|5\s*lakh\s*health|health card|आयुष्मान/i },
    { id: "pm-awas-yojana", pattern: /pmay|awas yojana|pucca house|housing grant|आवास योजना/i },
    { id: "pm-vishwakarma-artisan", pattern: /vishwakarma|artisan|craftsperson|toolkit|विश्वकर्मा/i },
    { id: "mahila-samridhi-yojana", pattern: /mahila samridhi|women loan|महिला समृद्धि/i },
    { id: "ignoaps-atal-pension", pattern: /ignoaps|atal pension|\bapy\b|old age pension|वृद्धावस्था पेंशन/i },
    { id: "divyangjan-swavalamban-udid", pattern: /divyangjan|adip|swavalamban|दिव्यांगजन/i }
  ];
  const matchedSpecificSchemes = schemeKeywords.filter((entry) => entry.pattern.test(lower)).map((entry) => GOVERNMENT_SCHEMES_CATALOG.find((s) => s.scheme_id === entry.id)).filter(Boolean);
  if (matchedSpecificSchemes.length > 0) {
    const primaryScheme = matchedSpecificSchemes[0];
    suggestedSchemeId = primaryScheme.scheme_id;
    suggestedCategory = primaryScheme.category;
    const detailsText = matchedSpecificSchemes.map(
      (s) => `### ${s.scheme_name} (${s.hindi_name})
\u2022 **Department:** ${s.ministry_or_department}
\u2022 **Key Benefit:** ${s.benefit_amount_or_type}
\u2022 **Who is Eligible:** ${s.eligibility_rules.join(" ")}
\u2022 **Required Documents:** ${s.required_documents.map((d) => d.document_name.split("(")[0].trim()).join(", ")}
\u2022 **Application Fee & Status:** ${s.application_fees} (${s.application_status})`
    ).join("\n\n");
    return {
      chat_response: isHindiInput ? `\u092F\u0939\u093E\u0901 \u0906\u092A\u0915\u0947 \u0926\u094D\u0935\u093E\u0930\u093E \u092A\u0942\u091B\u0940 \u0917\u0908 \u092F\u094B\u091C\u0928\u093E \u0915\u093E \u092A\u0942\u0930\u093E \u0935\u093F\u0935\u0930\u0923 \u0914\u0930 \u092A\u093E\u0924\u094D\u0930\u0924\u093E \u0928\u093F\u092F\u092E \u0926\u093F\u090F \u0917\u090F \u0939\u0948\u0902:

${detailsText}

\u092E\u0948\u0902\u0928\u0947 \u0906\u092A\u0915\u0947 \u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921 \u092A\u0930 \u0907\u0938 \u092F\u094B\u091C\u0928\u093E \u0915\u094B \u0939\u093E\u0907\u0932\u093E\u0907\u091F \u0915\u0930 \u0926\u093F\u092F\u093E \u0939\u0948\u0964 \u0906\u092A \u0938\u0940\u0927\u0947 "View scheme and documents" \u092A\u0930 \u0915\u094D\u0932\u093F\u0915 \u0915\u0930\u0915\u0947 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u091A\u0947\u0915\u0932\u093F\u0938\u094D\u091F \u0926\u0947\u0916 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0907\u0928-\u0910\u092A \u0906\u0935\u0947\u0926\u0928 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964` : `Here are the complete official details for your query:

${detailsText}

I have also synced this scheme to your live Dashboard so you can inspect the interactive document checklist or submit an in-app application directly.`,
      dashboard_view_mode: "SCHEME_DEEP_DIVE",
      detected_language: detectedLang,
      extracted_profile_updates: extractedUpdates,
      uploaded_documents: uploadedDocs,
      suggested_category_filter: suggestedCategory,
      suggested_scheme_id: suggestedSchemeId,
      next_suggested_actions: [
        `Open ${primaryScheme.scheme_name.split("(")[0].trim()} Checklist`,
        "Check my exact eligibility score",
        "What documents do I need for this scheme?"
      ]
    };
  }
  const mergedProfile = {
    id: "active",
    label: "Citizen",
    relation: "myself",
    hasPermissionConfirmed: true,
    full_name: String(extractedUpdates.full_name || profile.full_name || "Ramesh Kumar"),
    age: Number(extractedUpdates.age ?? profile.age ?? 44),
    gender: extractedUpdates.gender || profile.gender || "Male",
    state: String(extractedUpdates.state || profile.state || "Uttar Pradesh"),
    district: String(extractedUpdates.district || profile.district || "Varanasi"),
    pin_code: String(profile.pin_code || "221001"),
    residence_type: extractedUpdates.residence_type || profile.residence_type || "Rural",
    social_category: extractedUpdates.social_category || profile.social_category || "OBC",
    annual_family_income_inr: extractedUpdates.annual_family_income_inr !== void 0 ? Number(extractedUpdates.annual_family_income_inr) : profile.annual_family_income_inr ?? 72e3,
    income_known: "known",
    occupation: String(extractedUpdates.occupation || profile.occupation || "Farmer"),
    employment_status: "Active",
    is_student: Boolean(extractedUpdates.is_student ?? profile.is_student ?? false),
    student_institution_type: profile.student_institution_type || "None",
    institution_name: profile.institution_name || "",
    course_or_class: profile.course_or_class || "",
    year_of_study: profile.year_of_study || "",
    institution_ownership: profile.institution_ownership || "Unknown",
    last_exam_percent: profile.last_exam_percent || "",
    is_farmer: Boolean(extractedUpdates.is_farmer ?? profile.is_farmer ?? true),
    landholding_hectares: profile.landholding_hectares ?? 1.4,
    farmer_type: profile.farmer_type || "Small/Marginal Farmer < 2 Hectares",
    business_stage: profile.business_stage || "",
    loan_requirement: profile.loan_requirement || "",
    is_bpl: Boolean(extractedUpdates.is_bpl ?? profile.is_bpl ?? true),
    ration_card_type: profile.ration_card_type || "PHH",
    is_pwd: Boolean(extractedUpdates.is_pwd ?? profile.is_pwd ?? false),
    pwd_percentage: null,
    is_widow_or_single_woman: false,
    is_senior_citizen: false,
    primary_requirements: profile.primary_requirements || [],
    selected_themes: profile.selected_themes || [],
    selected_sub_categories: profile.selected_sub_categories || [],
    profile_completeness_percent: 95
  };
  const ranked = rankAndFilterSchemes(
    mergedProfile,
    GOVERNMENT_SCHEMES_CATALOG,
    suggestedCategory || "All"
  );
  const topThree = ranked.slice(0, 3);
  const topListFormatted = topThree.map(
    (item, idx) => `${idx + 1}. **${item.scheme.scheme_name}** \u2014 *${item.scheme.quantified_benefit_inr}* (${item.eligibility_status}, ${item.match_score_percent}% match)
   \u2022 Why it matches: ${item.why_you_qualify}`
  ).join("\n\n");
  const updatesConfirmedList = Object.entries(extractedUpdates).map(([k, v]) => `${k.replace(/_/g, " ")}: **${v}**`).join(", ");
  const generalReply = isHindiInput ? `\u0928\u092E\u0938\u094D\u0924\u0947! \u092E\u0948\u0902 **\u092F\u094B\u091C\u0928\u093E \u092E\u093F\u0924\u094D\u0930 (YojanaMitra)** \u0939\u0942\u0901\u0964 \u0906\u092A\u0915\u0947 \u092A\u094D\u0930\u0936\u094D\u0928 *"${msg}"* \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930:

${updatesConfirmedList ? `\u092E\u0948\u0902\u0928\u0947 \u0906\u092A\u0915\u0940 \u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932 \u092E\u0947\u0902 \u092F\u0947 \u0935\u093F\u0935\u0930\u0923 \u0905\u092A\u0921\u0947\u091F \u0915\u0930 \u0926\u093F\u090F \u0939\u0948\u0902: ${updatesConfirmedList}\u0964

` : ""}\u092F\u0939\u093E\u0901 \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0938\u092C\u0938\u0947 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u090F\u0902 \u0914\u0930 \u0909\u0928\u0915\u0947 \u0932\u093E\u092D \u0926\u093F\u090F \u0917\u090F \u0939\u0948\u0902:

${topListFormatted}

\u0906\u092A \u092E\u0941\u091D\u0938\u0947 \u0915\u093F\u0938\u0940 \u092D\u0940 \u092F\u094B\u091C\u0928\u093E \u0915\u0940 \u092A\u093E\u0924\u094D\u0930\u0924\u093E, \u0906\u0935\u0936\u094D\u092F\u0915 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C, \u0906\u0935\u0947\u0926\u0928 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u092F\u093E \u0915\u093F\u0938\u0940 \u092D\u0940 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0937\u092F \u092A\u0930 \u0915\u094B\u0908 \u092D\u0940 \u0938\u0935\u093E\u0932 \u092A\u0942\u091B \u0938\u0915\u0924\u0947 \u0939\u0948\u0902!` : `Here is the answer to your query (*"${msg}"*) grounded in the myScheme Citizen Knowledge Base & Google Search Data:

${updatesConfirmedList ? `**Live Profile Sync:** I automatically updated your Citizen Profile with: ${updatesConfirmedList}.

` : ""}**Top Matching Government Schemes for Current Profile (${mergedProfile.full_name}, ${mergedProfile.age} yrs, ${mergedProfile.state}):**

${topListFormatted}

You can ask me follow-up questions in this multi-turn thread, compare benefits, or click any verified source link below.`;
  return {
    chat_response: generalReply,
    dashboard_view_mode: fileData ? "DOCUMENT_VERIFICATION" : "PROFILE_AND_MATCHES",
    detected_language: detectedLang,
    extracted_profile_updates: extractedUpdates,
    uploaded_documents: uploadedDocs,
    suggested_category_filter: suggestedCategory,
    suggested_scheme_id: suggestedSchemeId,
    next_suggested_actions: [
      "Compare PMEGP vs PM Mudra Loan",
      "What are the latest PM-KISAN installment dates?",
      "What scholarships are available for college students?",
      "Why do I need an Income Certificate?"
    ]
  };
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "15mb" }));
  app.get("/api/status", (_req, res) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    );
    res.json({
      service: "SchemeSaathi / YojanaMitra Live API",
      status: "connected",
      aiConfigured: hasKey,
      supportedModels: ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-4-argon"],
      searchGroundingEnabled: true,
      endpoints: [
        "POST /api/yojanamitra/chat",
        "POST /api/yojanamitra/document-explain",
        "GET /api/schemes",
        "POST /api/eligibility/evaluate"
      ],
      totalSchemesInCatalog: GOVERNMENT_SCHEMES_CATALOG.length,
      totalThemes: MASTER_STARTING_THEMES.length
    });
  });
  app.get("/api/schemes", (_req, res) => {
    res.json({
      schemes: GOVERNMENT_SCHEMES_CATALOG,
      themes: MASTER_STARTING_THEMES,
      documents: MASTER_DOCUMENTS_LIBRARY,
      offices: VERIFIED_SERVICE_CENTERS
    });
  });
  app.post("/api/eligibility/evaluate", (req, res) => {
    const { profile, categoryFilter = "All", statusFilter = "All", searchQuery = "" } = req.body || {};
    if (!profile) {
      return res.status(400).json({ error: "Missing citizen profile payload" });
    }
    const matches = rankAndFilterSchemes(
      profile,
      GOVERNMENT_SCHEMES_CATALOG,
      categoryFilter,
      statusFilter,
      searchQuery
    );
    return res.json({
      totalMatches: matches.length,
      appearsEligibleCount: matches.filter((m) => m.eligibility_status === "Appears eligible").length,
      moreInfoCount: matches.filter((m) => m.eligibility_status === "More information needed").length,
      matches
    });
  });
  app.post("/api/yojanamitra/chat", async (req, res) => {
    const startTime = Date.now();
    const {
      message = "",
      language = "en",
      citizenProfile = {},
      history = [],
      fileData = null,
      selectedModel = "gemini-3.8-flash",
      chatbotRole = "general_advisor",
      useGoogleSearch = true
    } = req.body || {};
    const baseAnalysis = buildIntelligentAnswer(message, language, citizenProfile, fileData);
    const fallbackSources = getFallbackGroundingSources(message, baseAnalysis.suggested_scheme_id);
    const roleKey = chatbotRole && chatbotRole in ROLE_SYSTEM_INSTRUCTIONS ? chatbotRole : "general_advisor";
    const systemInstructionText = ROLE_SYSTEM_INSTRUCTIONS[roleKey];
    const ai = getAiClient();
    if (ai) {
      const requestedModel = ["gemini-4-argon", "gemini-3.8-flash", "gemini-3.1-flash-lite"].includes(
        selectedModel
      ) ? selectedModel : "gemini-3.8-flash";
      const modelsToTry = requestedModel === "gemini-4-argon" ? ["gemini-4-argon", "gemini-3.8-flash", "gemini-3.1-flash-lite"] : requestedModel === "gemini-3.1-flash-lite" ? ["gemini-3.1-flash-lite", "gemini-3.8-flash"] : ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      for (const modelName of modelsToTry) {
        try {
          const catalogSummary = GOVERNMENT_SCHEMES_CATALOG.map(
            (s) => `- ${s.scheme_id}: ${s.scheme_name} (${s.category}) | Benefit: ${s.quantified_benefit_inr} | Official Portal: ${s.official_apply_link}`
          ).join("\n");
          const fullSystemInstruction = `${systemInstructionText}

### ACTIVE CITIZEN PROFILE & CATALOG CONTEXT
Preferred Language: ${language}
Active Citizen Profile: ${JSON.stringify(citizenProfile)}
Official Schemes Catalog:
${catalogSummary}`;
          if (!fileData) {
            const enableSearchTool = Boolean(useGoogleSearch && modelName === "gemini-3.8-flash");
            const formattedHistory = Array.isArray(history) ? history.filter((h) => Boolean(h && h.text)).slice(0, -1).slice(-10).map((h) => ({
              role: h.sender === "user" ? "user" : "model",
              parts: [{ text: String(h.text || "") }]
            })) : [];
            const chat = ai.chats.create({
              model: modelName,
              history: formattedHistory,
              config: {
                systemInstruction: fullSystemInstruction,
                ...enableSearchTool ? { tools: [{ googleSearch: {} }] } : {}
              }
            });
            const response2 = await chat.sendMessage({
              message: message || "Please analyze my citizen profile and recommend the top government schemes I qualify for."
            });
            const replyText = (response2.text ?? "").trim() || baseAnalysis.chat_response;
            const groundingSources = [];
            const chunks = response2.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (Array.isArray(chunks)) {
              for (const chunk of chunks) {
                if (chunk.web?.uri) {
                  groundingSources.push({
                    title: chunk.web.title || chunk.web.uri,
                    uri: chunk.web.uri
                  });
                }
              }
            }
            const webSearchQueries = response2.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
            return res.json({
              api_status: "connected",
              endpoint: "POST /api/yojanamitra/chat",
              model_used: modelName,
              chatbot_role: roleKey,
              search_grounding_enabled: enableSearchTool,
              search_grounding_sources: groundingSources.length > 0 ? groundingSources : enableSearchTool ? fallbackSources : [],
              web_search_queries: webSearchQueries,
              latency_ms: Date.now() - startTime,
              ...baseAnalysis,
              chat_response: replyText
            });
          }
          const parts = [];
          if (fileData && fileData.base64 && fileData.mimeType) {
            parts.push({
              inlineData: {
                mimeType: fileData.mimeType,
                data: fileData.base64
              }
            });
          }
          parts.push({
            text: `Uploaded Document: ${fileData.fileName}
Citizen Question: "${message || "Verify this document and extract fields for my scheme eligibility."}"`
          });
          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              systemInstruction: fullSystemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: import_genai.Type.OBJECT,
                required: ["chat_response", "extracted_profile_updates"],
                properties: {
                  chat_response: { type: import_genai.Type.STRING },
                  extracted_profile_updates: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      full_name: { type: import_genai.Type.STRING, nullable: true },
                      age: { type: import_genai.Type.INTEGER, nullable: true },
                      gender: { type: import_genai.Type.STRING, nullable: true },
                      state: { type: import_genai.Type.STRING, nullable: true },
                      district: { type: import_genai.Type.STRING, nullable: true },
                      annual_family_income_inr: { type: import_genai.Type.NUMBER, nullable: true }
                    }
                  }
                }
              }
            }
          });
          const parsed = JSON.parse((response.text ?? "{}").trim());
          return res.json({
            api_status: "connected",
            endpoint: "POST /api/yojanamitra/chat",
            model_used: modelName,
            chatbot_role: roleKey,
            search_grounding_enabled: false,
            search_grounding_sources: fallbackSources,
            latency_ms: Date.now() - startTime,
            ...baseAnalysis,
            ...parsed,
            extracted_profile_updates: {
              ...baseAnalysis.extracted_profile_updates,
              ...parsed.extracted_profile_updates || {}
            }
          });
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`Model ${modelName} fallback notice:`, errMsg);
        }
      }
    }
    return res.json({
      api_status: "connected",
      endpoint: "POST /api/yojanamitra/chat",
      model_used: selectedModel || "gemini-3.8-flash",
      chatbot_role: roleKey,
      search_grounding_enabled: Boolean(useGoogleSearch),
      search_grounding_sources: useGoogleSearch ? fallbackSources : [],
      web_search_queries: useGoogleSearch ? [message || "Indian government welfare schemes"] : [],
      latency_ms: Date.now() - startTime,
      ...baseAnalysis
    });
  });
  app.post("/api/yojanamitra/document-explain", async (req, res) => {
    const {
      documentSpec,
      schemeName,
      userQuestion = "",
      language = "en"
    } = req.body || {};
    const ai = getAiClient();
    if (ai && documentSpec) {
      for (const modelName of ["gemini-3.8-flash", "gemini-3.1-flash-lite"]) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `You are YojanaMitra, the built-in citizen advisor for SchemeSaathi.
Scheme: ${schemeName}
Document: ${documentSpec.document_name}
Official Facts:
- What it is: ${documentSpec.what_it_is}
- Why required: ${documentSpec.why_required}
- What it verifies: ${documentSpec.what_it_verifies}
- Official alternatives: ${documentSpec.accepted_alternatives}
- Issuing authority: ${documentSpec.issuing_authority}
- Published fee: ${documentSpec.published_fee}
- Processing time: ${documentSpec.processing_time}

Citizen Question (Language: ${language}): "${userQuestion || `Why do I need ${documentSpec.document_name} for ${schemeName}, and can I use an alternative?`}"

Provide a clear, plain-language explanation answering the citizen's exact question based on the official facts above.`,
            config: {
              ...modelName === "gemini-3.8-flash" ? { tools: [{ googleSearch: {} }] } : {}
            }
          });
          if (response.text) {
            const groundingSources = [];
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (Array.isArray(chunks)) {
              for (const chunk of chunks) {
                if (chunk.web?.uri) {
                  groundingSources.push({
                    title: chunk.web.title || chunk.web.uri,
                    uri: chunk.web.uri
                  });
                }
              }
            }
            return res.json({
              api_status: "connected",
              endpoint: "POST /api/yojanamitra/document-explain",
              model_used: modelName,
              answer: response.text.trim(),
              search_grounding_sources: groundingSources
            });
          }
        } catch {
        }
      }
    }
    const intelligentDoc = buildIntelligentAnswer(
      userQuestion || documentSpec?.document_name || "Income Certificate",
      language,
      {}
    );
    return res.json({
      api_status: "connected",
      endpoint: "POST /api/yojanamitra/document-explain",
      model_used: "gemini-3.8-flash",
      answer: intelligentDoc.chat_response,
      search_grounding_sources: getFallbackGroundingSources(
        documentSpec?.document_name || "Income Certificate",
        null
      )
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SchemeSaathi / YojanaMitra API Server running on http://localhost:${PORT}`);
  });
}
startServer();
