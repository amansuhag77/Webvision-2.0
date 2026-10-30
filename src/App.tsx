/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Home,
  ClipboardList,
  LayoutGrid,
  FileSearch,
  Bookmark,
  ShieldAlert,
} from 'lucide-react';
import {
  AppScreenId,
  ApplicationRecord,
  BeneficiaryRelation,
  CitizenProfile,
  DocumentChecklistChoice,
  GovernmentScheme,
  RequiredDocumentSpec,
  SupportedLanguageCode,
  UploadedDocumentRecord,
} from './types/schemes';
import {
  GOVERNMENT_SCHEMES_CATALOG,
  MASTER_DOCUMENTS_LIBRARY,
} from './data/schemesCatalog';
import {
  calculateProfileCompleteness,
  evaluateSchemeEligibility,
  rankAndFilterSchemes,
} from './utils/eligibilityEngine';
import {
  WelcomeAndThemesView,
  LoginVerificationView,
  VoiceLanguageIntroView,
  EligibilityQuestionnaireView,
} from './components/OnboardingAndFunnelViews';
import {
  MatchingSchemesDashboardView,
  SchemeDetailsView,
  SavedAndProfilesView,
} from './components/DashboardAndSchemeViews';
import { MissingDocView } from './components/MissingDocView';
import { AskAiDocModal } from './components/AskAiDocModal';
import { YojanaMitraDrawer } from './components/YojanaMitraDrawer';
import { EmbeddedAiBar } from './components/EmbeddedAiBar';
import { AshokaEmblemSvg, DigitalIndiaTricolorMark } from './components/CivicIllustrations';

const INITIAL_PROFILES: CitizenProfile[] = [
  {
    id: 'profile-myself',
    label: 'Myself (Account Holder)',
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
    primary_requirements: ['Agriculture', 'Housing', 'Healthcare'],
    selected_themes: ['AGRICULTURE_FARMING', 'HOUSING_SHELTER', 'HEALTH_WELLNESS'],
    selected_sub_categories: ['Direct Farmer Income Support'],
    profile_completeness_percent: 100,
  },
  {
    id: 'profile-daughter',
    label: 'Priya Kumari (Daughter)',
    relation: 'family_member',
    hasPermissionConfirmed: true,
    full_name: 'Priya Kumari',
    age: 19,
    gender: 'Female',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    pin_code: '221001',
    residence_type: 'Rural',
    social_category: 'OBC',
    annual_family_income_inr: 72000,
    income_known: 'known',
    occupation: 'Student',
    employment_status: 'Full-Time Student',
    is_student: true,
    student_institution_type: 'College or University',
    institution_name: 'Banaras Hindu University (BHU)',
    course_or_class: 'B.Sc. (Hons.) Agriculture',
    year_of_study: '2nd Year',
    institution_ownership: 'Government',
    last_exam_percent: '82%',
    is_farmer: false,
    landholding_hectares: null,
    farmer_type: '',
    business_stage: '',
    loan_requirement: '',
    is_bpl: true,
    ration_card_type: 'PHH',
    is_pwd: false,
    pwd_percentage: null,
    is_widow_or_single_woman: false,
    is_senior_citizen: false,
    primary_requirements: ['Education'],
    selected_themes: ['STUDENT_EDUCATION', 'WOMEN_CHILD'],
    selected_sub_categories: ['Post-Matric & College Scholarships'],
    profile_completeness_percent: 100,
  },
];

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    application_id: 'PMK-UP-2026-40918',
    scheme_id: 'pm-kisan-samman-nidhi',
    scheme_name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    ministry_or_department: 'Ministry of Agriculture and Farmers Welfare',
    beneficiary_id: 'profile-myself',
    beneficiary_name: 'Ramesh Kumar',
    beneficiary_relation: 'myself',
    benefit_amount: '₹6,000 / Year (Installment #18: ₹2,000)',
    submitted_at: '18 Oct 2026',
    last_updated: 'Today, 10:15 AM',
    current_stage_label: 'Sanctioned — PFMS DBT Queued',
    overall_status: 'Sanctioned - DBT Queued',
    stages: [
      {
        stage_name: '1. Aadhaar e-KYC & Portal Submission',
        status: 'Completed',
        timestamp: '18 Oct 2026',
        detail: 'UIDAI biometric/OTP e-KYC verified on Citizen Dashboard.',
      },
      {
        stage_name: '2. Tehsil / Patwari Land Seeding',
        status: 'Completed',
        timestamp: '23 Oct 2026',
        detail: 'Khasra 1.4 Ha verified by Sadar Tehsil Varanasi Nodal Officer.',
      },
      {
        stage_name: '3. PFMS Bank Account & FTO Release',
        status: 'In Progress',
        timestamp: 'Active Stage',
        detail: 'Fund Transfer Order (FTO) generated for Aadhaar-seeded SBI account.',
      },
    ],
  },
];

export default function App() {
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [activeScreen, setActiveScreen] = useState<AppScreenId>(
    isAutostart ? 'matching_schemes' : 'welcome_themes'
  );
  const [language, setLanguage] = useState<SupportedLanguageCode>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUserLabel, setLoggedInUserLabel] = useState<string>('+91 9876543210');

  const [profiles, setProfiles] = useState<CitizenProfile[]>(() => {
    try {
      const saved = localStorage.getItem('schemesaathi_profiles_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(INITIAL_PROFILES[0].id);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || profiles[0],
    [profiles, activeProfileId]
  );

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pm-kisan-samman-nidhi');
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([
    'pm-kisan-samman-nidhi',
    'nsp-post-matric-scholarship',
  ]);
  const [docChecklist, setDocChecklist] = useState<Record<string, DocumentChecklistChoice>>({
    aadhaar_card: 'have_it',
    land_record: 'have_it',
    bank_passbook: 'have_it',
    income_certificate: 'need_help',
    caste_certificate: 'not_sure',
    education_marksheet: 'have_it',
  });

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocumentRecord[]>([
    {
      id: 'initial-aadhaar-doc',
      document_type: 'Aadhaar Card (आधार कार्ड)',
      file_name: 'Ramesh_Kumar_Aadhaar_Verified.pdf',
      verification_status: 'Verified',
      extracted_fields: [
        { field_name: 'Full Name', field_value: 'Ramesh Kumar' },
        { field_name: 'District', field_value: 'Varanasi' },
        { field_name: 'State', field_value: 'Uttar Pradesh' },
      ],
      notes: 'Pre-verified via UIDAI DigiLocker sync.',
      uploaded_at: 'Verified',
    },
  ]);

  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [askAiDocTarget, setAskAiDocTarget] = useState<RequiredDocumentSpec | null>(null);
  const [missingDocTarget, setMissingDocTarget] = useState<RequiredDocumentSpec | null>(
    MASTER_DOCUMENTS_LIBRARY.income_certificate
  );
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Sync profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('schemesaathi_profiles_v1', JSON.stringify(profiles));
    } catch {
      // ignore storage error
    }
  }, [profiles]);

  const handleUpdateActiveProfile = (updated: CitizenProfile) => {
    const withCompleteness: CitizenProfile = {
      ...updated,
      profile_completeness_percent: calculateProfileCompleteness(updated),
    };
    setProfiles((prev) =>
      prev.map((p) => (p.id === withCompleteness.id ? withCompleteness : p))
    );
  };

  const handleSelectRelationFromWelcome = (
    relation: BeneficiaryRelation,
    permissionConfirmed: boolean,
    customName?: string
  ) => {
    if (relation === 'myself') {
      const myselfProf = profiles.find((p) => p.relation === 'myself') || profiles[0];
      setActiveProfileId(myselfProf.id);
    } else {
      // Switch to or update family/someone profile
      const existingOther = profiles.find((p) => p.relation !== 'myself');
      if (existingOther) {
        const updatedOther: CitizenProfile = {
          ...existingOther,
          relation,
          hasPermissionConfirmed: permissionConfirmed,
          full_name: customName?.trim() ? customName.trim() : existingOther.full_name,
        };
        setProfiles((prev) =>
          prev.map((p) => (p.id === existingOther.id ? updatedOther : p))
        );
        setActiveProfileId(existingOther.id);
      } else {
        const newId = `profile-${Date.now()}`;
        const created: CitizenProfile = {
          ...INITIAL_PROFILES[1],
          id: newId,
          relation,
          hasPermissionConfirmed: permissionConfirmed,
          full_name: customName?.trim() || 'Family Beneficiary',
          label: customName?.trim() || 'Family Beneficiary',
        };
        setProfiles((prev) => [...prev, created]);
        setActiveProfileId(newId);
      }
    }
  };

  const matchedSchemes = useMemo(
    () => rankAndFilterSchemes(activeProfile, GOVERNMENT_SCHEMES_CATALOG),
    [activeProfile]
  );

  const selectedSchemeEvaluated = useMemo(() => {
    const found = matchedSchemes.find((m) => m.scheme.scheme_id === selectedSchemeId);
    if (found) return found;
    const rawScheme =
      GOVERNMENT_SCHEMES_CATALOG.find((s) => s.scheme_id === selectedSchemeId) ||
      GOVERNMENT_SCHEMES_CATALOG[0];
    return evaluateSchemeEligibility(activeProfile, rawScheme);
  }, [matchedSchemes, selectedSchemeId, activeProfile]);

  const handleToggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    );
  };

  const handleSubmitInAppApplication = (scheme: GovernmentScheme) => {
    const newApp: ApplicationRecord = {
      application_id: `MYS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`,
      scheme_id: scheme.scheme_id,
      scheme_name: scheme.scheme_name,
      ministry_or_department: scheme.ministry_or_department,
      beneficiary_id: activeProfile.id,
      beneficiary_name: activeProfile.full_name || 'Citizen Beneficiary',
      beneficiary_relation: activeProfile.relation,
      benefit_amount: scheme.quantified_benefit_inr,
      submitted_at: 'Just now',
      last_updated: 'Just now',
      current_stage_label: 'Under Nodal Officer Verification',
      overall_status: 'Under Verification',
      stages: [
        {
          stage_name: '1. In-App e-Sign & Profile Submission',
          status: 'Completed',
          timestamp: 'Just now',
          detail: 'Submitted via SchemeSaathi Citizen Dashboard.',
        },
        {
          stage_name: '2. Department Nodal Document Check',
          status: 'In Progress',
          timestamp: 'Active Stage',
          detail: `Sent to ${scheme.ministry_or_department} verification desk.`,
        },
        {
          stage_name: '3. PFMS Direct Benefit Transfer (DBT)',
          status: 'Pending',
          timestamp: 'Scheduled',
          detail: 'Credited upon nodal officer sanction.',
        },
      ],
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleAddFamilyProfile = (
    name: string,
    relation: 'family_member' | 'someone_i_know',
    age: number
  ) => {
    const newId = `profile-${Date.now()}`;
    const newProf: CitizenProfile = {
      ...INITIAL_PROFILES[1],
      id: newId,
      label: name,
      full_name: name,
      relation,
      age,
      is_student: age <= 25,
      occupation: age <= 25 ? 'Student' : 'Unemployed / Job Seeker',
      hasPermissionConfirmed: true,
    };
    newProf.profile_completeness_percent = calculateProfileCompleteness(newProf);
    setProfiles((prev) => [...prev, newProf]);
    setActiveProfileId(newId);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (activeProfileId === id) {
      setActiveProfileId(remaining[0].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] pb-20 md:pb-0">
      {/* STRICT 3-ZONE TOP BAR CONTRACT WITH MYSCHEME OFFICIAL GREEN BRANDING */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-8 shadow-xs">
        {/* Zone 1: Brand Identity (National Emblem + myScheme / SchemeSaathi + Digital India mark) */}
        <a
          href="#welcome"
          onClick={(e) => {
            e.preventDefault();
            setActiveScreen('welcome_themes');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <AshokaEmblemSvg className="w-6 h-8 shrink-0" />
          <span className="text-xl font-extrabold tracking-tight font-display border-l border-slate-300 pl-2.5">
            <span className="text-[#16A34A]">my</span>
            <span className="text-[#1E293B]">Scheme</span>
            <span className="text-slate-400 font-normal mx-1.5">·</span>
            <span className="text-[#0F2942] text-base">SchemeSaathi</span>
          </span>
          <span className="hidden lg:inline-flex items-center border-l border-slate-200 pl-2.5">
            <DigitalIndiaTricolorMark className="w-7 h-5" />
          </span>
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => setActiveScreen('welcome_themes')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeScreen === 'welcome_themes'
                ? 'text-[#15803D] font-bold underline underline-offset-8'
                : ''
            }`}
          >
            Start &amp; Themes
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('questionnaire')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeScreen === 'questionnaire'
                ? 'text-[#15803D] font-bold underline underline-offset-8'
                : ''
            }`}
          >
            Eligibility Check
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('matching_schemes')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeScreen === 'matching_schemes' || activeScreen === 'scheme_details'
                ? 'text-[#15803D] font-bold underline underline-offset-8'
                : ''
            }`}
          >
            Matching Schemes
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('missing_doc_help')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeScreen === 'missing_doc_help'
                ? 'text-[#15803D] font-bold underline underline-offset-8'
                : ''
            }`}
          >
            Document Help
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('saved_and_profiles')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeScreen === 'saved_and_profiles'
                ? 'text-[#15803D] font-bold underline underline-offset-8'
                : ''
            }`}
          >
            Saved &amp; Tracker
          </button>
        </nav>

        {/* Zone 3: 1 primary action ("Ask the assistant") */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            className="min-h-[42px] px-4 py-2 text-xs font-bold text-white bg-[#15803D] rounded-lg hover:bg-[#166534] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Ask the assistant</span>
          </button>
        </div>
      </header>

      {/* Secondary Stepper / Journey Bar Below the Fold */}
      <div className="bg-emerald-50/60 border-b border-emerald-200/80 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {(
              [
                { id: 'welcome_themes', label: '1. Beneficiary & Themes' },
                { id: 'login_verify', label: '2. Login / Verify' },
                { id: 'voice_language', label: '3. Voice & Language' },
                { id: 'questionnaire', label: '4. Questionnaire' },
                { id: 'matching_schemes', label: '5. Matching Schemes' },
                { id: 'scheme_details', label: '6. Scheme & Checklist' },
                { id: 'missing_doc_help', label: '7. Obtain Documents' },
                { id: 'saved_and_profiles', label: '8. Saved & Profiles' },
              ] as Array<{ id: AppScreenId; label: string }>
            ).map((step) => {
              const isCurrent = activeScreen === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveScreen(step.id)}
                  className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-emerald-100/80 hover:text-slate-900'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>

          <div className="text-slate-600 hidden lg:block">
            Active Beneficiary:{' '}
            <strong className="text-slate-900">{activeProfile.full_name || 'Citizen'}</strong> ·{' '}
            {isLoggedIn ? `Verified (${loggedInUserLabel})` : 'Guest Session'}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Live API-Connected Gemini Chatbot Q&A Bar */}
        <EmbeddedAiBar
          profile={activeProfile}
          onUpdateProfile={handleUpdateActiveProfile}
          language={language}
          onOpenFullDrawer={() => setIsAssistantOpen(true)}
          onSelectScheme={(schemeId) => {
            setSelectedSchemeId(schemeId);
            setActiveScreen('scheme_details');
          }}
        />

        {activeScreen === 'welcome_themes' && (
          <WelcomeAndThemesView
            activeProfile={activeProfile}
            onUpdateProfile={handleUpdateActiveProfile}
            onSelectRelation={handleSelectRelationFromWelcome}
            onContinueToLogin={() => setActiveScreen('login_verify')}
            onJumpToQuestionnaire={() => setActiveScreen('questionnaire')}
            onJumpToMatches={() => setActiveScreen('matching_schemes')}
            isLoggedIn={isLoggedIn}
          />
        )}

        {activeScreen === 'login_verify' && (
          <LoginVerificationView
            onLoginSuccess={(identifier) => {
              setIsLoggedIn(true);
              setLoggedInUserLabel(identifier);
              setActiveScreen('voice_language');
            }}
            onSkipToVoice={() => setActiveScreen('voice_language')}
          />
        )}

        {activeScreen === 'voice_language' && (
          <VoiceLanguageIntroView
            language={language}
            onLanguageChange={setLanguage}
            onContinueToQuestionnaire={() => setActiveScreen('questionnaire')}
            onOpenAssistantDrawer={() => setIsAssistantOpen(true)}
          />
        )}

        {activeScreen === 'questionnaire' && (
          <EligibilityQuestionnaireView
            profile={activeProfile}
            onUpdateProfile={handleUpdateActiveProfile}
            onFinishQuestionnaire={() => setActiveScreen('matching_schemes')}
            onBackToVoice={() => setActiveScreen('voice_language')}
          />
        )}

        {activeScreen === 'matching_schemes' && (
          <MatchingSchemesDashboardView
            activeProfile={activeProfile}
            allProfiles={profiles}
            onSwitchProfile={setActiveProfileId}
            matchedSchemes={matchedSchemes}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onSelectSchemeForDetails={(schemeId) => {
              setSelectedSchemeId(schemeId);
              setActiveScreen('scheme_details');
            }}
            onEditQuestionnaire={() => setActiveScreen('questionnaire')}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            applications={applications}
            uploadedDocs={uploadedDocs}
            onNavigateSavedAndProfiles={() => setActiveScreen('saved_and_profiles')}
          />
        )}

        {activeScreen === 'scheme_details' && (
          <SchemeDetailsView
            evaluatedMatch={selectedSchemeEvaluated}
            profile={activeProfile}
            isSaved={savedSchemeIds.includes(selectedSchemeEvaluated.scheme.scheme_id)}
            onToggleSave={() =>
              handleToggleSaveScheme(selectedSchemeEvaluated.scheme.scheme_id)
            }
            docChecklist={docChecklist}
            onUpdateDocChecklist={(docId, choice) =>
              setDocChecklist((prev) => ({ ...prev, [docId]: choice }))
            }
            uploadedDocs={uploadedDocs}
            onAskAiAboutDoc={(doc) => setAskAiDocTarget(doc)}
            onOpenMissingDocHelp={(doc) => {
              setMissingDocTarget(doc);
              setActiveScreen('missing_doc_help');
            }}
            onSubmitInAppApplication={handleSubmitInAppApplication}
            existingApplication={applications.find(
              (a) =>
                a.scheme_id === selectedSchemeEvaluated.scheme.scheme_id &&
                a.beneficiary_id === activeProfile.id
            )}
            onBackToMatches={() => setActiveScreen('matching_schemes')}
          />
        )}

        {activeScreen === 'missing_doc_help' && (
          <MissingDocView
            selectedDoc={missingDocTarget}
            onSelectDoc={setMissingDocTarget}
            defaultPinCode={activeProfile.pin_code || '221001'}
            onBack={() => setActiveScreen('scheme_details')}
            onAskAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {activeScreen === 'saved_and_profiles' && (
          <SavedAndProfilesView
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSwitchProfile={setActiveProfileId}
            onAddFamilyProfile={handleAddFamilyProfile}
            onDeleteProfile={handleDeleteProfile}
            savedSchemes={GOVERNMENT_SCHEMES_CATALOG.filter((s) =>
              savedSchemeIds.includes(s.scheme_id)
            )}
            onOpenScheme={(schemeId) => {
              setSelectedSchemeId(schemeId);
              setActiveScreen('scheme_details');
            }}
            onRemoveSavedScheme={handleToggleSaveScheme}
            applications={applications}
            uploadedDocs={uploadedDocs}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}
      </main>

      {/* Transparent Demonstration & Production Integrations Disclosure Footer (Requirement 10) */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-6 mt-12">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong>Interactive Civic Demonstration &amp; Production Integration Notice:</strong>{' '}
              SchemeSaathi (YojanaMitra) is an interactive civic discovery and eligibility prototype grounded in published Central and State scheme structures. Sample scheme matches, OTP codes, and pre-filled DBT statuses are for demonstration and should not be treated as official sanction orders. For live production deployment, connect: (1) <strong>API Setu / myScheme.gov.in Open APIs</strong> for live gazette notifications and deadlines, (2) <strong>UIDAI Aadhaar e-KYC &amp; DigiLocker API</strong> for cryptographic document verification, (3) <strong>Bhashini National Language Translation Mission API</strong> for 22 scheduled Indian languages ASR/TTS, and (4) <strong>MeitY CSC Locator GIS API</strong> for real-time kiosk availability.
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>SchemeSaathi — Citizen Welfare Discovery &amp; Document Readiness Platform</span>
            <span>Privacy-First Design · Zero External Redirects · Accessible WCAG AA</span>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-Right Green "my" AI Bot Button (Matching myscheme.gov.in screenshot) */}
      {!isAssistantOpen && (
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          aria-label="Open myScheme YojanaMitra AI Chatbot"
          className="fixed bottom-16 md:bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xl border-2 border-white flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
        >
          <span className="text-[9px] font-black tracking-tighter bg-white text-[#15803D] px-1 rounded-xs leading-tight mb-0.5">
            my
          </span>
          <Sparkles className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Mobile Bottom Tab Bar (Thumb-Zone Navigation for Mobile Viewports) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center h-14 px-1"
      >
        <button
          type="button"
          onClick={() => setActiveScreen('welcome_themes')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeScreen === 'welcome_themes' ? 'text-[#15803D] font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Start</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('questionnaire')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeScreen === 'questionnaire' ? 'text-[#15803D] font-bold' : 'text-slate-500'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Eligibility</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('matching_schemes')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeScreen === 'matching_schemes' || activeScreen === 'scheme_details'
              ? 'text-[#15803D] font-bold'
              : 'text-slate-500'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Schemes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('missing_doc_help')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeScreen === 'missing_doc_help' ? 'text-[#15803D] font-bold' : 'text-slate-500'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Docs Help</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('saved_and_profiles')}
          className={`min-h-[44px] flex flex-col items-center justify-center ${
            activeScreen === 'saved_and_profiles' ? 'text-[#15803D] font-bold' : 'text-slate-500'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tracker</span>
        </button>
      </nav>

      {/* Ask AI Document Explanation Modal */}
      <AskAiDocModal
        documentSpec={askAiDocTarget}
        schemeName={selectedSchemeEvaluated.scheme.scheme_name}
        language={language}
        onClose={() => setAskAiDocTarget(null)}
        onOpenMissingDocHelp={(doc) => {
          setMissingDocTarget(doc);
          setActiveScreen('missing_doc_help');
        }}
      />

      {/* YojanaMitra Multimodal Voice & Document Assistant Drawer */}
      <YojanaMitraDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        profile={activeProfile}
        onUpdateProfile={handleUpdateActiveProfile}
        uploadedDocs={uploadedDocs}
        onAddUploadedDoc={(doc) => setUploadedDocs((prev) => [doc, ...prev])}
        matchedSchemes={matchedSchemes}
        onSelectScheme={(schemeId) => {
          setSelectedSchemeId(schemeId);
          setActiveScreen('scheme_details');
        }}
      />
    </div>
  );
}
