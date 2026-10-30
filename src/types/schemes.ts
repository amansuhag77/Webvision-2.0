export type BeneficiaryRelation = 'myself' | 'family_member' | 'someone_i_know';

export type SupportedLanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  speechLang: string;
  voiceSupported: boolean;
  welcomeGreeting: string;
  voiceIntroPrompt: string;
}

export type ResidenceType = 'Urban' | 'Rural' | 'Unknown';
export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'Unknown';
export type StudentInstitutionType = 'School' | 'College or University' | 'Vocational or Other' | 'None';

export interface CitizenProfile {
  id: string;
  label: string;
  relation: BeneficiaryRelation;
  hasPermissionConfirmed: boolean;
  full_name: string;
  age: number | null;
  dob?: string;
  gender: 'Male' | 'Female' | 'Transgender' | 'Unknown';
  state: string;
  district: string;
  pin_code: string;
  residence_type: ResidenceType;
  social_category: SocialCategory;
  annual_family_income_inr: number | null;
  income_known: 'known' | 'dont_know';
  occupation: string;
  employment_status: string;
  is_student: boolean;
  student_institution_type: StudentInstitutionType;
  institution_name: string;
  course_or_class: string;
  year_of_study: string;
  institution_ownership: 'Government' | 'Private' | 'Aided' | 'Unknown';
  last_exam_percent: string;
  is_farmer: boolean;
  landholding_hectares: number | null;
  farmer_type: string;
  business_stage: string;
  loan_requirement: string;
  is_bpl: boolean | null;
  ration_card_type: 'AAY' | 'PHH' | 'NPHH' | 'None' | 'Unknown';
  is_pwd: boolean | null;
  pwd_percentage: number | null;
  is_widow_or_single_woman: boolean;
  is_senior_citizen: boolean;
  primary_requirements: string[];
  selected_themes: string[];
  selected_sub_categories: string[];
  profile_completeness_percent: number;
}

export type DocumentChecklistChoice = 'have_it' | 'need_help' | 'not_sure';

export interface RequiredDocumentSpec {
  document_id: string;
  document_name: string;
  what_it_is: string;
  why_required: string;
  what_it_verifies: string;
  accepted_alternatives: string;
  official_portal_name: string;
  official_portal_reference: string;
  application_steps: string[];
  supporting_documents: string[];
  published_fee: string;
  processing_time: string;
  issuing_authority: string;
}

export interface GovernmentScheme {
  scheme_id: string;
  scheme_name: string;
  hindi_name: string;
  government_level: 'Central Government' | 'State Government' | 'Joint Central-State';
  ministry_or_department: string;
  category:
    | 'Education'
    | 'Agriculture'
    | 'Healthcare'
    | 'Housing'
    | 'Business & MSME'
    | 'Financial Assistance'
    | 'Employment & Skills'
    | 'Pensions'
    | 'Women & Child'
    | 'Social Welfare';
  theme_id: string;
  theme_badge: string;
  sub_category_badge: string;
  brief_description: string;
  purpose_and_benefits: string;
  benefit_amount_or_type: string;
  quantified_benefit_inr: string;
  who_it_supports: string;
  application_deadline: string;
  application_status: 'Open Year-Round' | 'Active Window Open' | 'Closing Soon';
  application_process: string[];
  application_fees: string;
  expected_next_steps: string[];
  eligibility_rules: string[];
  exclusions: string[];
  official_source: string;
  last_checked_date: string;
  required_documents: RequiredDocumentSpec[];
  in_app_application_steps: string[];
  // Structured rule matching criteria
  criteria: {
    min_age?: number;
    max_age?: number;
    allowed_genders?: Array<'Male' | 'Female' | 'Transgender'>;
    allowed_categories?: SocialCategory[];
    max_annual_income_inr?: number;
    allowed_residence?: Array<'Urban' | 'Rural'>;
    requires_student?: boolean;
    requires_farmer?: boolean;
    requires_bpl?: boolean;
    requires_pwd?: boolean;
    target_occupations?: string[];
  };
}

export interface EvaluatedSchemeMatch {
  scheme: GovernmentScheme;
  eligibility_status: 'Appears eligible' | 'More information needed' | 'Not eligible';
  schema_status: 'Eligible' | 'Likely_Eligible' | 'Missing_Criteria';
  match_score_percent: number;
  why_you_qualify: string;
  matched_tags: string[];
  missing_or_unclear_fields: string[];
}

export interface UploadedDocumentRecord {
  id: string;
  document_type: string;
  file_name: string;
  verification_status: 'Verified' | 'Needs Clearer Upload' | 'Expired_Or_Mismatch';
  extracted_fields: Array<{ field_name: string; field_value: string }>;
  notes: string;
  uploaded_at: string;
}

export interface ApplicationStageItem {
  stage_name: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  timestamp: string;
  detail: string;
}

export interface ApplicationRecord {
  application_id: string;
  scheme_id: string;
  scheme_name: string;
  ministry_or_department: string;
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_relation: BeneficiaryRelation;
  benefit_amount: string;
  submitted_at: string;
  last_updated: string;
  current_stage_label: string;
  overall_status: 'Under Verification' | 'Sanctioned - DBT Queued' | 'Action Required';
  stages: ApplicationStageItem[];
}

export interface ServiceCenterOffice {
  office_id: string;
  office_name: string;
  office_type: 'Common Service Centre (CSC)' | 'Tehsil / e-District Seva Kendra' | 'Jan Seva Kendra / Ward Office';
  pin_code: string;
  district: string;
  state: string;
  address: string;
  contact_phone: string;
  opening_hours: string;
  verified_date: string;
  services_offered: string[];
  directions_landmark: string;
}

export interface StartingPageTheme {
  theme_id: string;
  theme_title: string;
  hindi_title: string;
  icon_name: string;
  short_description: string;
  sub_categories: string[];
  estimated_scheme_count: number;
}

export type AppScreenId =
  | 'welcome_themes'
  | 'login_verify'
  | 'voice_language'
  | 'questionnaire'
  | 'matching_schemes'
  | 'scheme_details'
  | 'missing_doc_help'
  | 'saved_and_profiles';

export type DashboardViewMode =
  | 'ONBOARDING_DISCOVERY'
  | 'PROFILE_AND_MATCHES'
  | 'SCHEME_DEEP_DIVE'
  | 'DOCUMENT_VERIFICATION'
  | 'IN_APP_APPLICATION_FORM';

export type FunnelStage =
  | 'STARTING_THEME_GRID'
  | 'THEME_SUBCATEGORY_SELECT'
  | 'DEMOGRAPHIC_AND_CATEGORY_FUNNEL'
  | 'SCHEME_MATCH_DASHBOARD';
