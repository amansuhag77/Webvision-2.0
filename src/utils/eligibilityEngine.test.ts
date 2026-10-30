import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProfileCompleteness,
  evaluateSchemeEligibility,
  findNearbyServiceOffices,
  parseDocumentExtractionToProfile,
  rankAndFilterSchemes,
  validateMobileOrEmail,
} from './eligibilityEngine';
import { GOVERNMENT_SCHEMES_CATALOG } from '../data/schemesCatalog';
import { CitizenProfile } from '../types/schemes';

function createBaseProfile(overrides: Partial<CitizenProfile> = {}): CitizenProfile {
  return {
    id: 'test-profile-1',
    label: 'Myself',
    relation: 'myself',
    hasPermissionConfirmed: true,
    full_name: 'Ramesh Kumar',
    age: 44,
    gender: 'Male',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    pin_code: '221001',
    residence_type: 'Rural',
    social_category: 'OBC',
    annual_family_income_inr: 72000,
    income_known: 'known',
    occupation: 'Farmer',
    employment_status: 'Self-Employed',
    is_student: false,
    student_institution_type: 'None',
    institution_name: '',
    course_or_class: '',
    year_of_study: '',
    institution_ownership: 'Unknown',
    last_exam_percent: '',
    is_farmer: true,
    landholding_hectares: 1.4,
    farmer_type: 'Small/Marginal Farmer < 2 Hectares',
    business_stage: '',
    loan_requirement: '',
    is_bpl: true,
    ration_card_type: 'PHH',
    is_pwd: false,
    pwd_percentage: null,
    is_widow_or_single_woman: false,
    is_senior_citizen: false,
    primary_requirements: ['Agriculture', 'Housing'],
    selected_themes: ['AGRICULTURE_FARMING'],
    selected_sub_categories: [],
    profile_completeness_percent: 100,
    ...overrides,
  };
}

test('evaluateSchemeEligibility marks farmer profile as Appears eligible for PM-KISAN', () => {
  const farmerProfile = createBaseProfile();
  const pmKisan = GOVERNMENT_SCHEMES_CATALOG.find((s) => s.scheme_id === 'pm-kisan-samman-nidhi')!;
  const result = evaluateSchemeEligibility(farmerProfile, pmKisan);

  assert.equal(result.eligibility_status, 'Appears eligible');
  assert.equal(result.schema_status, 'Eligible');
  assert.ok(result.match_score_percent >= 90);
});

test('evaluateSchemeEligibility distinguishes More information needed when income or age is missing', () => {
  const incompleteProfile = createBaseProfile({
    age: null,
    annual_family_income_inr: null,
    income_known: 'dont_know',
  });
  const pmAwas = GOVERNMENT_SCHEMES_CATALOG.find((s) => s.scheme_id === 'pm-awas-yojana')!;
  const result = evaluateSchemeEligibility(incompleteProfile, pmAwas);

  assert.equal(result.eligibility_status, 'More information needed');
  assert.equal(result.schema_status, 'Likely_Eligible');
  assert.ok(result.missing_or_unclear_fields.includes('Age or Date of Birth'));
  assert.ok(result.missing_or_unclear_fields.includes('Annual Household Income'));
});

test('evaluateSchemeEligibility handles Student conditional institution fields properly', () => {
  const studentWithoutInstitution = createBaseProfile({
    age: 19,
    occupation: 'Student',
    is_student: true,
    is_farmer: false,
    student_institution_type: 'None',
    annual_family_income_inr: 120000,
  });
  const nsp = GOVERNMENT_SCHEMES_CATALOG.find((s) => s.scheme_id === 'nsp-post-matric-scholarship')!;
  const res1 = evaluateSchemeEligibility(studentWithoutInstitution, nsp);
  assert.equal(res1.eligibility_status, 'More information needed');

  const studentWithCollege = {
    ...studentWithoutInstitution,
    student_institution_type: 'College or University' as const,
    institution_name: 'Banaras Hindu University',
    course_or_class: 'B.Sc. Agriculture',
    year_of_study: '2nd Year',
  };
  const res2 = evaluateSchemeEligibility(studentWithCollege, nsp);
  assert.equal(res2.eligibility_status, 'Appears eligible');
});

test('validateMobileOrEmail validates 10-digit Indian mobile numbers and email addresses', () => {
  assert.equal(validateMobileOrEmail('9876543210', 'mobile').valid, true);
  assert.equal(validateMobileOrEmail('12345', 'mobile').valid, false);
  assert.equal(validateMobileOrEmail('citizen@india.gov.in', 'email').valid, true);
  assert.equal(validateMobileOrEmail('invalid-email', 'email').valid, false);
});

test('findNearbyServiceOffices returns verified offices for known PIN and transparent guidance for unknown PIN', () => {
  const varanasiRes = findNearbyServiceOffices('221001');
  assert.equal(varanasiRes.isValidQuery, true);
  assert.equal(varanasiRes.exactPinMatch, true);
  assert.ok(varanasiRes.offices.length >= 1);

  const invalidPin = findNearbyServiceOffices('99');
  assert.equal(invalidPin.isValidQuery, false);

  const unverifiedPin = findNearbyServiceOffices('560099');
  assert.equal(unverifiedPin.isValidQuery, true);
  assert.equal(unverifiedPin.exactPinMatch, false);
  assert.equal(unverifiedPin.offices.length, 0);
});

test('parseDocumentExtractionToProfile merges OCR extracted fields and recalculates completeness', () => {
  const emptyProfile = createBaseProfile({
    full_name: '',
    age: null,
    state: '',
    district: '',
    annual_family_income_inr: null,
  });

  const merged = parseDocumentExtractionToProfile(emptyProfile, [
    { field_name: 'Full Name', field_value: 'Sunita Devi' },
    { field_name: 'Age', field_value: '28 years' },
    { field_name: 'Gender', field_value: 'Female' },
    { field_name: 'State', field_value: 'Maharashtra' },
    { field_name: 'District', field_value: 'Pune' },
    { field_name: 'Annual Family Income', field_value: '₹2,20,000' },
  ]);

  assert.equal(merged.full_name, 'Sunita Devi');
  assert.equal(merged.age, 28);
  assert.equal(merged.gender, 'Female');
  assert.equal(merged.state, 'Maharashtra');
  assert.equal(merged.annual_family_income_inr, 220000);
  assert.ok(calculateProfileCompleteness(merged) >= 85);
});
