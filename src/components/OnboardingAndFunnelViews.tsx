import React, { useState } from 'react';
import {
  User,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  Square,
  HelpCircle,
  GraduationCap,
  Sprout,
  Landmark,
  Briefcase,
  HeartPulse,
  Home,
  Wrench,
  Award,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import {
  BeneficiaryRelation,
  CitizenProfile,
  SupportedLanguageCode,
  SocialCategory,
  ResidenceType,
  StudentInstitutionType,
} from '../types/schemes';
import {
  INDIAN_STATES_LIST,
  MASTER_STARTING_THEMES,
  SUPPORTED_LANGUAGES,
  UNFAMILIAR_TERMS_GLOSSARY,
} from '../data/schemesCatalog';
import { HeroCivicIllustration, SchemeCategoryIllustration } from './CivicIllustrations';
import { validateMobileOrEmail } from '../utils/eligibilityEngine';

const THEME_TO_ILLUSTRATION_CATEGORY: Record<string, string> = {
  STUDENT_EDUCATION: 'Education',
  AGRICULTURE_FARMING: 'Agriculture',
  FINANCE_BANKING: 'Financial Assistance',
  BUSINESS_ENTREPRENEURSHIP: 'Business & MSME',
  HEALTH_WELLNESS: 'Healthcare',
  HOUSING_SHELTER: 'Housing',
  SKILLS_EMPLOYMENT: 'Employment & Skills',
  WOMEN_CHILD: 'Women & Child',
  SOCIAL_WELFARE: 'Social Welfare',
  SENIOR_CITIZEN: 'Pensions',
};

// ============================================================================
// SCREEN 1: WELCOME, BENEFICIARY SELECTION & THEME-FIRST STARTING GRID
// ============================================================================
interface WelcomeAndThemesViewProps {
  activeProfile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  onSelectRelation: (
    relation: BeneficiaryRelation,
    permissionConfirmed: boolean,
    customLabel?: string
  ) => void;
  onContinueToLogin: () => void;
  onJumpToQuestionnaire: () => void;
  onJumpToMatches: () => void;
  isLoggedIn: boolean;
}

export const WelcomeAndThemesView: React.FC<WelcomeAndThemesViewProps> = ({
  activeProfile,
  onUpdateProfile,
  onSelectRelation,
  onContinueToLogin,
  onJumpToQuestionnaire,
  onJumpToMatches,
  isLoggedIn,
}) => {
  const [primaryChoice, setPrimaryChoice] = useState<'myself' | 'someone_else'>(
    activeProfile.relation === 'myself' ? 'myself' : 'someone_else'
  );
  const [secondaryRelation, setSecondaryRelation] = useState<'family_member' | 'someone_i_know'>(
    activeProfile.relation === 'someone_i_know' ? 'someone_i_know' : 'family_member'
  );
  const [beneficiaryNameInput, setBeneficiaryNameInput] = useState(
    activeProfile.relation === 'myself' ? '' : activeProfile.full_name
  );
  const [permissionChecked, setPermissionChecked] = useState(activeProfile.hasPermissionConfirmed);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleToggleTheme = (themeId: string) => {
    const exists = activeProfile.selected_themes.includes(themeId);
    const nextThemes = exists
      ? activeProfile.selected_themes.filter((t) => t !== themeId)
      : [...activeProfile.selected_themes, themeId];
    onUpdateProfile({
      ...activeProfile,
      selected_themes: nextThemes,
    });
  };

  const handleToggleSubCategory = (subCat: string) => {
    const exists = activeProfile.selected_sub_categories.includes(subCat);
    const nextSubs = exists
      ? activeProfile.selected_sub_categories.filter((s) => s !== subCat)
      : [...activeProfile.selected_sub_categories, subCat];
    onUpdateProfile({
      ...activeProfile,
      selected_sub_categories: nextSubs,
    });
  };

  const handleProceedFromWelcome = (destination: 'login' | 'questionnaire' | 'matches') => {
    if (primaryChoice === 'someone_else' && !permissionChecked) {
      setPermissionError(
        'Please confirm that you have permission from this person to enter their eligibility details.'
      );
      return;
    }
    setPermissionError(null);
    const finalRelation: BeneficiaryRelation =
      primaryChoice === 'myself' ? 'myself' : secondaryRelation;
    onSelectRelation(
      finalRelation,
      primaryChoice === 'myself' ? true : permissionChecked,
      beneficiaryNameInput
    );

    if (destination === 'login' && !isLoggedIn) {
      onContinueToLogin();
    } else if (destination === 'matches') {
      onJumpToMatches();
    } else {
      onJumpToQuestionnaire();
    }
  };

  const renderThemeIcon = (iconName: string) => {
    const cls = 'w-5 h-5 text-[#15803D] shrink-0';
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={cls} />;
      case 'Sprout':
        return <Sprout className={cls} />;
      case 'Landmark':
        return <Landmark className={cls} />;
      case 'Briefcase':
        return <Briefcase className={cls} />;
      case 'HeartPulse':
        return <HeartPulse className={cls} />;
      case 'Home':
        return <Home className={cls} />;
      case 'Wrench':
        return <Wrench className={cls} />;
      case 'Users':
        return <Users className={cls} />;
      case 'Award':
        return <Award className={cls} />;
      default:
        return <ShieldCheck className={cls} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#15803D]">
              myScheme · SchemeSaathi National Citizen Welfare Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Discover Government Schemes, Check Eligibility &amp; Prepare Documents with Confidence
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Simple, multilingual guidance in English, Hindi, and regional Indian languages. Answer a few step-by-step questions or ask our live Gemini AI advisor to find Central and State benefits you qualify for.
            </p>
          </div>

          {/* Step 1: Mandatory Question "Who are you looking for schemes for?" */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              1. Who are you looking for schemes for?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPrimaryChoice('myself');
                  setPermissionError(null);
                }}
                className={`min-h-[60px] p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-colors ${
                  primaryChoice === 'myself'
                    ? 'bg-emerald-50/70 text-[#15803D] border-[#16A34A]'
                    : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <User className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-sm font-bold">For myself</div>
                  <div
                    className={`text-xs ${
                      primaryChoice === 'myself' ? 'text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    Check my own eligibility &amp; documents
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrimaryChoice('someone_else')}
                className={`min-h-[60px] p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-colors ${
                  primaryChoice === 'someone_else'
                    ? 'bg-emerald-50/70 text-[#15803D] border-[#16A34A]'
                    : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Users className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-sm font-bold">For someone else</div>
                  <div
                    className={`text-xs ${
                      primaryChoice === 'someone_else' ? 'text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    Help a family member, neighbor, or citizen
                  </div>
                </div>
              </button>
            </div>

            {/* Conditional Sub-Options when "For someone else" is chosen */}
            {primaryChoice === 'someone_else' && (
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    Who is the person needing support?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSecondaryRelation('family_member')}
                      className={`min-h-[48px] px-4 py-2.5 rounded-lg border-2 text-sm font-semibold text-left flex items-center justify-between ${
                        secondaryRelation === 'family_member'
                          ? 'bg-emerald-50 border-[#16A34A] text-[#15803D]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>For a family member</span>
                      {secondaryRelation === 'family_member' && (
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSecondaryRelation('someone_i_know')}
                      className={`min-h-[48px] px-4 py-2.5 rounded-lg border-2 text-sm font-semibold text-left flex items-center justify-between ${
                        secondaryRelation === 'someone_i_know'
                          ? 'bg-emerald-50 border-[#16A34A] text-[#15803D]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>For someone I know</span>
                      {secondaryRelation === 'someone_i_know' && (
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="beneficiary-name-input"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Beneficiary’s First Name or Label (Kept separate from your own account profile):
                  </label>
                  <input
                    id="beneficiary-name-input"
                    type="text"
                    value={beneficiaryNameInput}
                    onChange={(e) => setBeneficiaryNameInput(e.target.value)}
                    placeholder="e.g., Daughter Priya / Neighbor Kisan Lal"
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong>Important:</strong> All eligibility questions (such as age, education, income, and category) must be answered using the details of the person who needs the scheme. Their beneficiary profile will be saved separately from your account holder profile.
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={permissionChecked}
                    onChange={(e) => {
                      setPermissionChecked(e.target.checked);
                      if (e.target.checked) setPermissionError(null);
                    }}
                    className="mt-0.5 w-5 h-5 rounded border-slate-300 text-[#15803D]"
                  />
                  <span className="text-xs font-medium text-slate-800 leading-relaxed">
                    I confirm that I have permission from this person (or their legal guardian) to provide their information for checking government scheme eligibility.
                  </span>
                </label>

                {permissionError && (
                  <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
                    {permissionError}
                  </p>
                )}
              </div>
            )}

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleProceedFromWelcome('questionnaire')}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Find Schemes For Me (Step-by-Step)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleProceedFromWelcome(isLoggedIn ? 'matches' : 'login')}
                className="min-h-[48px] px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm transition-colors"
              >
                {isLoggedIn ? 'View Matched Dashboard' : 'Sign In & Voice Setup'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Hero Illustration */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl overflow-hidden bg-[#0F2942]">
          <HeroCivicIllustration className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Stage 1: Theme-First Starting Page Categorization Grid with Scheme Pictures */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-[#15803D]">
              myScheme Categorization Grid · Browse by Citizen Welfare Theme
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Explore Schemes by Life &amp; Livelihood Theme
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select one or more illustrated welfare themes below (Student, Agriculture, Finance, Business, Health, Housing) to filter questions and schemes.
            </p>
          </div>

          {activeProfile.selected_themes.length > 0 && (
            <button
              type="button"
              onClick={() => handleProceedFromWelcome('questionnaire')}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap"
            >
              <span>
                Proceed with {activeProfile.selected_themes.length} Selected{' '}
                {activeProfile.selected_themes.length === 1 ? 'Theme' : 'Themes'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTER_STARTING_THEMES.map((theme) => {
            const isSelected = activeProfile.selected_themes.includes(theme.theme_id);
            const illustrationCat =
              THEME_TO_ILLUSTRATION_CATEGORY[theme.theme_id] || 'Social Welfare';

            return (
              <div
                key={theme.theme_id}
                className={`rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-50/30 border-[#16A34A] shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Scheme Theme Picture Banner */}
                  <div className="relative border-b border-slate-100">
                    <SchemeCategoryIllustration
                      category={illustrationCat}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/95 border border-slate-200 text-xs font-mono font-bold text-[#15803D] tabular-nums shadow-xs">
                      {theme.estimated_scheme_count} Schemes
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        {renderThemeIcon(theme.icon_name)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {theme.theme_title}
                        </h3>
                        <div className="text-xs font-medium text-slate-500">
                          {theme.hindi_title}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {theme.short_description}
                    </p>

                    {/* Sub-Categories */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                        Sub-Categories:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {theme.sub_categories.slice(0, 3).map((sub) => {
                          const subActive = activeProfile.selected_sub_categories.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                handleToggleSubCategory(sub);
                                if (!isSelected) handleToggleTheme(theme.theme_id);
                              }}
                              className={`text-[11px] px-2 py-1 rounded border text-left transition-colors ${
                                subActive
                                  ? 'bg-[#15803D] text-white border-[#15803D]'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => handleToggleTheme(theme.theme_id)}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-[#15803D] text-white'
                        : 'bg-slate-100 hover:bg-emerald-50 hover:text-[#15803D] text-slate-900'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Theme Selected</span>
                      </>
                    ) : (
                      <span>Select {theme.theme_title.split('&')[0].trim()}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 2: LOGIN OR SIGN UP (MOBILE OTP & EMAIL VERIFICATION)
// ============================================================================
interface LoginVerificationViewProps {
  onLoginSuccess: (identifier: string, method: 'mobile' | 'email') => void;
  onSkipToVoice: () => void;
}

export const LoginVerificationView: React.FC<LoginVerificationViewProps> = ({
  onLoginSuccess,
  onSkipToVoice,
}) => {
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [identifier, setIdentifier] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('482910');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateMobileOrEmail(identifier, authMethod);
    if (!check.valid) {
      setErrorMsg(check.error || 'Invalid input');
      return;
    }
    setErrorMsg(null);
    setOtpSent(true);
    setInfoNotice(
      authMethod === 'mobile'
        ? `A 6-digit verification OTP has been sent to +91 ${check.normalized}. (Demo OTP pre-filled: 482910)`
        : `A verification code and secure sign-in link have been sent to ${check.normalized}. (Demo Code: 482910)`
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.replace(/\D/g, '');
    if (cleanOtp.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code sent to you.');
      return;
    }
    setErrorMsg(null);
    onLoginSuccess(identifier, authMethod);
  };

  const handleResendCode = () => {
    setResendCount((c) => c + 1);
    setInfoNotice(
      `Verification code resent (#${resendCount + 1}). You may use code 482910 to verify immediately.`
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      <div>
        <div className="text-xs font-bold text-[#15803D]">
          Step 2 of 4 · Citizen Account &amp; Saved Profile Access
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Sign In or Create Your Citizen Account
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Save your eligibility answers, document checklist, and family profiles so you can return anytime without filling everything in again.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setAuthMethod('mobile');
            setIdentifier('9876543210');
            setOtpSent(false);
            setErrorMsg(null);
          }}
          className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
            authMethod === 'mobile'
              ? 'bg-white text-[#15803D] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Mobile Number &amp; OTP</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMethod('email');
            setIdentifier('ramesh.kumar@india.gov.in');
            setOtpSent(false);
            setErrorMsg(null);
          }}
          className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
            authMethod === 'email'
              ? 'bg-white text-[#15803D] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Code / Secure Link</span>
        </button>
      </div>

      {!otpSent ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label
              htmlFor="auth-identifier-input"
              className="block text-sm font-bold text-slate-800 mb-1.5"
            >
              {authMethod === 'mobile'
                ? 'Enter Your 10-Digit Mobile Number'
                : 'Enter Your Email Address'}
            </label>
            <div className="flex items-center gap-2">
              {authMethod === 'mobile' && (
                <span className="min-h-[48px] px-3.5 bg-slate-100 border border-slate-300 rounded-xl flex items-center text-sm font-mono font-semibold text-slate-700">
                  +91
                </span>
              )}
              <input
                id="auth-identifier-input"
                type={authMethod === 'mobile' ? 'tel' : 'email'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={authMethod === 'mobile' ? '9876543210' : 'name@example.com'}
                className="flex-1 min-h-[48px] px-4 py-2.5 text-base border border-slate-300 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {authMethod === 'mobile'
                ? 'We will send a one-time 6-digit verification code via SMS.'
                : 'We will send a 6-digit verification code and a one-click sign-in link to your email.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <span>
              {authMethod === 'mobile'
                ? 'Send OTP to Mobile Number'
                : 'Send Verification Code & Sign-In Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {infoNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              {infoNotice}
            </div>
          )}

          <div>
            <label
              htmlFor="otp-code-input"
              className="block text-sm font-bold text-slate-800 mb-1.5"
            >
              Enter 6-Digit Verification Code (OTP)
            </label>
            <input
              id="otp-code-input"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="482910"
              className="w-full min-h-[48px] px-4 py-2.5 text-lg tracking-widest font-mono font-bold border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={handleResendCode}
              className="font-semibold text-[#15803D] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend Verification Code</span>
            </button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-slate-600 hover:underline"
            >
              Change {authMethod === 'mobile' ? 'mobile number' : 'email address'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify &amp; Continue to Voice Assistant</span>
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Your information is kept private and never sold.</span>
        <button
          type="button"
          onClick={onSkipToVoice}
          className="font-semibold text-slate-700 hover:text-slate-900 underline"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 3: MULTILINGUAL VOICE ASSISTANT & LANGUAGE SELECTION
// ============================================================================
interface VoiceLanguageIntroViewProps {
  language: SupportedLanguageCode;
  onLanguageChange: (lang: SupportedLanguageCode) => void;
  onContinueToQuestionnaire: () => void;
  onOpenAssistantDrawer: () => void;
}

export const VoiceLanguageIntroView: React.FC<VoiceLanguageIntroViewProps> = ({
  language,
  onLanguageChange,
  onContinueToQuestionnaire,
  onOpenAssistantDrawer,
}) => {
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [askingMicPermission, setAskingMicPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedLanguagePending, setDetectedLanguagePending] = useState<SupportedLanguageCode | null>(
    null
  );
  const [typedAlternative, setTypedAlternative] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayGreeting = (textToSpeak: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.lang = currentLang.speechLang;
      u.onstart = () => setIsPlayingAudio(true);
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    }
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const handleMicButtonClick = () => {
    if (!micPermissionGranted) {
      setAskingMicPermission(true);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      if (language === 'en') {
        setTranscript('नमस्ते, मुझे अपनी बेटी की कॉलेज छात्रवृत्ति और किसान योजना की जानकारी चाहिए।');
        setDetectedLanguagePending('hi');
      } else {
        setTranscript(
          'Namaste, I am looking for agriculture and scholarship schemes for my family in Varanasi.'
        );
        setDetectedLanguagePending(language);
      }
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-bold text-[#15803D]">
          Step 3 of 4 · Multilingual Voice &amp; Language Setup
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          “Speak in the language you are comfortable with.”
        </h1>
        <p className="text-base text-slate-700 mt-1 font-medium">
          {currentLang.welcomeGreeting}
        </p>
      </div>

      {/* Manual Language Selection Grid */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2.5">
          Select or Change Your Preferred Language:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onLanguageChange(lang.code);
                  setDetectedLanguagePending(null);
                }}
                className={`min-h-[54px] p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-colors ${
                  active
                    ? 'bg-emerald-50/70 text-[#15803D] border-[#16A34A]'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{lang.nativeName}</div>
                  <div className={`text-xs ${active ? 'text-emerald-800' : 'text-slate-500'}`}>
                    {lang.name}
                  </div>
                </div>
                {active && <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Assistant Interactive Console */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                YojanaMitra Voice Guide ({currentLang.nativeName})
              </div>
              <div className="text-xs text-slate-600">
                Guides you through eligibility questions one at a time
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePlayGreeting(currentLang.voiceIntroPrompt)}
              className="min-h-[40px] px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 text-slate-800"
            >
              <Volume2 className="w-4 h-4 text-[#15803D]" />
              <span>{isPlayingAudio ? 'Playing Audio...' : 'Replay Voice Greeting'}</span>
            </button>
            {isPlayingAudio && (
              <button
                type="button"
                onClick={handleStopAudio}
                className="min-h-[40px] px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-1"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 leading-relaxed">
          “{currentLang.voiceIntroPrompt}”
        </div>

        {/* Microphone Permission Prompt */}
        {askingMicPermission && !micPermissionGranted && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
            <div className="text-xs font-bold text-amber-950">
              Microphone Permission Required Before Listening
            </div>
            <p className="text-xs text-amber-900">
              May SchemeSaathi use your device microphone to listen to your spoken answer and detect your preferred language?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMicPermissionGranted(true);
                  setAskingMicPermission(false);
                  setIsListening(true);
                  setTimeout(() => {
                    setIsListening(false);
                    setTranscript(
                      'नमस्ते, मुझे अपनी बेटी की कॉलेज छात्रवृत्ति और किसान योजना की जानकारी चाहिए।'
                    );
                    setDetectedLanguagePending('hi');
                  }, 900);
                }}
                className="px-3.5 py-2 text-xs font-bold bg-[#15803D] text-white rounded-lg"
              >
                Allow Microphone &amp; Start Listening
              </button>
              <button
                type="button"
                onClick={() => setAskingMicPermission(false)}
                className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg"
              >
                Not Now
              </button>
            </div>
          </div>
        )}

        {/* Microphone Button & Listening Indicator */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
          <button
            type="button"
            onClick={handleMicButtonClick}
            className={`w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-colors ${
              isListening
                ? 'bg-red-600 text-white'
                : 'bg-[#15803D] hover:bg-[#166534] text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Listening... Tap to Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-amber-300" />
                <span>Tap Microphone to Speak</span>
              </>
            )}
          </button>

          <span className="text-xs text-slate-600">
            {isListening
              ? 'Listening indicator active: Speak naturally in Hindi, English, or regional language...'
              : 'Or type your response below if you prefer not to use voice.'}
          </span>
        </div>

        {/* Live Transcript & Language Detection Confirmation */}
        {transcript && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-500">Voice Transcript Captured:</div>
            <p className="text-sm font-medium text-slate-900">“{transcript}”</p>

            {detectedLanguagePending && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-emerald-950">
                  Detected Language:{' '}
                  {SUPPORTED_LANGUAGES.find((l) => l.code === detectedLanguagePending)?.nativeName}{' '}
                  ({SUPPORTED_LANGUAGES.find((l) => l.code === detectedLanguagePending)?.name}). Would you like to continue in this language?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange(detectedLanguagePending);
                      setDetectedLanguagePending(null);
                    }}
                    className="px-3 py-1 text-xs font-bold bg-[#15803D] text-white rounded-md"
                  >
                    Confirm Language
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetectedLanguagePending(null)}
                    className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-md"
                  >
                    Keep {currentLang.name}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Typed Alternative Input */}
        <div className="pt-2 border-t border-slate-200">
          <label htmlFor="voice-typed-alt" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Typed Response (Alternative to Voice):
          </label>
          <div className="flex items-center gap-2">
            <input
              id="voice-typed-alt"
              type="text"
              value={typedAlternative}
              onChange={(e) => setTypedAlternative(e.target.value)}
              placeholder="Type your requirement or preferred language here..."
              className="flex-1 min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                if (typedAlternative.trim()) {
                  setTranscript(typedAlternative.trim());
                  setTypedAlternative('');
                }
              }}
              className="min-h-[44px] px-4 py-2 text-xs font-bold bg-slate-800 text-white rounded-lg"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onOpenAssistantDrawer}
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold"
        >
          Open Full YojanaMitra Chat &amp; Document Scanner
        </button>

        <button
          type="button"
          onClick={onContinueToQuestionnaire}
          className="min-h-[48px] px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm flex items-center gap-2"
        >
          <span>Continue to Step-by-Step Eligibility Finder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 4: MYSCHEME.GOV.IN STYLE PROGRESSIVE ELIGIBILITY QUESTIONNAIRE
// ============================================================================
interface EligibilityQuestionnaireViewProps {
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  onFinishQuestionnaire: () => void;
  onBackToVoice: () => void;
}

export const EligibilityQuestionnaireView: React.FC<EligibilityQuestionnaireViewProps> = ({
  profile,
  onUpdateProfile,
  onFinishQuestionnaire,
  onBackToVoice,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [openGlossaryKey, setOpenGlossaryKey] = useState<string | null>(null);

  const updateField = <K extends keyof CitizenProfile>(key: K, value: CitizenProfile[K]) => {
    onUpdateProfile({
      ...profile,
      [key]: value,
    });
  };

  const handleResetForm = () => {
    onUpdateProfile({
      ...profile,
      age: 28,
      gender: 'Female',
      state: 'Maharashtra',
      district: 'Pune',
      residence_type: 'Urban',
      social_category: 'OBC',
      annual_family_income_inr: 180000,
      income_known: 'known',
    });
    setCurrentStep(1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Title Above Card (Matching myscheme.gov.in/find-scheme) */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Help us find the best schemes for you
        </h1>
        <p className="text-xs text-slate-600">
          Checking eligibility for:{' '}
          <strong className="text-slate-900">
            {profile.relation === 'myself'
              ? 'Myself (Account Holder)'
              : `${profile.full_name || 'Beneficiary'} (${
                  profile.relation === 'family_member' ? 'Family Member' : 'Someone I Know'
                })`}
          </strong>{' '}
          · Completeness {profile.profile_completeness_percent}%
        </p>
      </div>

      {/* myScheme Signature Card with Connected Green Circle Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/60 p-6 sm:p-10 space-y-8">
        {/* Connected Circle Stepper (o---o---o---o) */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((stepNum, idx) => {
              const isCompleted = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <React.Fragment key={stepNum}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(stepNum as 1 | 2 | 3 | 4)}
                    aria-label={`Go to Step ${stepNum}`}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'border-2 border-[#16A34A] bg-white ring-4 ring-emerald-50'
                        : isCompleted
                        ? 'bg-[#16A34A] text-white border-2 border-[#16A34A]'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />}
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  {idx < 3 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 ${
                        currentStep > stepNum ? 'bg-[#16A34A]' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            {[
              { step: 1, label: '1. Gender, Age & State' },
              { step: 2, label: '2. Category & Income' },
              { step: 3, label: '3. Occupation & Student' },
              { step: 4, label: '4. Review & Edit' },
            ].map((t) => (
              <button
                key={t.step}
                type="button"
                onClick={() => setCurrentStep(t.step as 1 | 2 | 3 | 4)}
                className={
                  currentStep === t.step
                    ? 'text-[#15803D] font-bold underline underline-offset-4'
                    : 'hover:text-slate-800'
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1: GENDER ICON TILES, AGE DROPDOWN/INPUT, NAME & STATE (Exact myscheme.gov.in style) */}
        {currentStep === 1 && (
          <div className="max-w-xl mx-auto space-y-7">
            {/* Gender Selection Tiles */}
            <div className="space-y-3">
              <div className="text-base font-bold text-slate-900">
                <span className="text-red-600 mr-0.5">*</span>Tell us about yourself, you are a...
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(
                  [
                    { value: 'Male', symbol: '♂', label: 'Male' },
                    { value: 'Female', symbol: '♀', label: 'Female' },
                    { value: 'Transgender', symbol: '⚧', label: 'Transgender' },
                  ] as const
                ).map((item) => {
                  const selected = profile.gender === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => updateField('gender', item.value)}
                      className={`min-h-[108px] p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        selected
                          ? 'border-[#16A34A] bg-emerald-50/40 text-[#15803D] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-3xl leading-none font-normal" aria-hidden="true">
                        {item.symbol}
                      </span>
                      <span className="text-sm font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inline Age Selection ("*and your age is [ 44 v ] years") */}
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="q-age-select" className="text-base font-bold text-slate-900">
                <span className="text-red-600 mr-0.5">*</span>and your age is
              </label>
              <select
                id="q-age-select"
                value={profile.age ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  updateField('age', v === '' ? null : parseInt(v, 10));
                }}
                className="min-h-[46px] px-4 py-2 text-base font-bold border-2 border-slate-300 focus:border-[#16A34A] rounded-xl bg-white text-slate-900 font-mono"
              >
                <option value="">--</option>
                {Array.from({ length: 95 }, (_, i) => i + 5).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <span className="text-base font-bold text-slate-900">years</span>
            </div>

            {/* Beneficiary Name & State / Residence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label htmlFor="q-full-name" className="block text-xs font-bold text-slate-700 mb-1">
                  Beneficiary Full Name
                </label>
                <input
                  id="q-full-name"
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  placeholder="e.g., Ramesh Kumar"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label htmlFor="q-state" className="block text-xs font-bold text-slate-700 mb-1">
                  State / Union Territory
                </label>
                <select
                  id="q-state"
                  value={profile.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="q-district" className="block text-xs font-bold text-slate-700 mb-1">
                  District
                </label>
                <input
                  id="q-district"
                  type="text"
                  value={profile.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="e.g., Varanasi / Pune"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1">
                  Please select your area of residence
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Urban', 'Rural', 'Unknown'] as ResidenceType[]).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => updateField('residence_type', res)}
                      className={`min-h-[44px] py-2 px-2 rounded-xl border-2 text-xs font-bold ${
                        profile.residence_type === res
                          ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {res === 'Unknown' ? 'Not Sure' : res}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ELIGIBILITY CATEGORY, HOUSEHOLD INCOME & SPECIAL CIRCUMSTANCES */}
        {currentStep === 2 && (
          <div className="max-w-xl mx-auto space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-base font-bold text-slate-900">
                  <span className="text-red-600 mr-0.5">*</span>You belong to... (Social Category)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGlossaryKey(
                      openGlossaryKey === 'social_category' ? null : 'social_category'
                    )
                  }
                  className="text-xs font-semibold text-[#15803D] flex items-center gap-1 hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why is this needed?</span>
                </button>
              </div>

              {openGlossaryKey === 'social_category' && (
                <div className="p-3.5 mb-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                  <strong>{UNFAMILIAR_TERMS_GLOSSARY.social_category.title}</strong>:{' '}
                  {UNFAMILIAR_TERMS_GLOSSARY.social_category.explanation}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(
                  ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Unknown'] as SocialCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateField('social_category', cat)}
                    className={`min-h-[46px] py-2 px-3 rounded-xl border-2 text-xs font-bold ${
                      profile.social_category === cat
                        ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'Unknown' ? 'I don’t know' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Household Income */}
            <div className="space-y-2.5">
              <label htmlFor="q-income" className="block text-base font-bold text-slate-900">
                What is your family’s annual income? (₹)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Below ₹1 Lakh (₹72,000)', val: 72000 },
                  { label: '₹1L – ₹2.5 Lakh (₹1,80,000)', val: 180000 },
                  { label: '₹2.5L – ₹5 Lakh (₹3,20,000)', val: 320000 },
                  { label: '₹5L – ₹8 Lakh (₹6,00,000)', val: 600000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      onUpdateProfile({
                        ...profile,
                        annual_family_income_inr: preset.val,
                        income_known: 'known',
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold ${
                      profile.annual_family_income_inr === preset.val
                        ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProfile({
                      ...profile,
                      annual_family_income_inr: null,
                      income_known: 'dont_know',
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold ${
                    profile.income_known === 'dont_know' && profile.annual_family_income_inr === null
                      ? 'bg-amber-50 text-amber-900 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  I don’t know exact income
                </button>
              </div>

              <input
                id="q-income"
                type="number"
                value={profile.annual_family_income_inr ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  onUpdateProfile({
                    ...profile,
                    annual_family_income_inr: v === '' ? null : parseInt(v, 10),
                    income_known: v === '' ? 'dont_know' : 'known',
                  });
                }}
                placeholder="Or enter exact annual family income in Rupees (e.g., 72000)"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono"
              />
            </div>

            {/* BPL & Disability Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Do you belong to BPL category?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGlossaryKey(openGlossaryKey === 'bpl_ration' ? null : 'bpl_ration')
                    }
                    className="text-[11px] font-semibold text-[#15803D] underline"
                  >
                    Explain
                  </button>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: 'Yes', val: true },
                    { label: 'No', val: false },
                    { label: 'Not sure', val: null },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updateField('is_bpl', opt.val)}
                      className={`flex-1 min-h-[40px] rounded-lg border-2 text-xs font-bold ${
                        profile.is_bpl === opt.val
                          ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="block text-xs font-bold text-slate-800">
                  Are you differently abled (PwD)?
                </span>
                <div className="flex gap-2">
                  {[
                    { label: 'Yes', val: true },
                    { label: 'No', val: false },
                    { label: 'Not sure', val: null },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updateField('is_pwd', opt.val)}
                      className={`flex-1 min-h-[40px] rounded-lg border-2 text-xs font-bold ${
                        profile.is_pwd === opt.val
                          ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: OCCUPATION & CONDITIONAL STUDENT / FARMER QUESTIONS */}
        {currentStep === 3 && (
          <div className="max-w-xl mx-auto space-y-5">
            <div>
              <span className="block text-base font-bold text-slate-900 mb-2.5">
                Current Occupation &amp; Employment Status
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Farmer',
                  'Student',
                  'MSME Entrepreneur',
                  'Traditional Artisan',
                  'Daily Wage / Unorganized Worker',
                  'Homemaker / Self-Help Group',
                  'Unemployed / Job Seeker',
                  'Senior Citizen / Retired',
                ].map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => {
                      onUpdateProfile({
                        ...profile,
                        occupation: occ,
                        is_student: occ === 'Student' ? true : profile.is_student,
                        is_farmer: occ === 'Farmer' ? true : profile.is_farmer,
                      });
                    }}
                    className={`min-h-[46px] p-2.5 rounded-xl border-2 text-xs font-bold text-left ${
                      profile.occupation === occ
                        ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle: Is the beneficiary currently a Student? */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">Are you a student?</div>
                  <div className="text-xs text-slate-600">
                    Unlocks school, college, university, and vocational scholarship rules.
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('is_student', true)}
                    className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-bold border-2 ${
                      profile.is_student
                        ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                        : 'bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('is_student', false)}
                    className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-bold border-2 ${
                      !profile.is_student
                        ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                        : 'bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* CONDITIONAL STUDENT SUB-QUESTIONS */}
              {profile.is_student && (
                <div className="pt-3 border-t border-slate-200 space-y-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-800 mb-2">
                      Which educational institution does the student attend?
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(
                        [
                          'School',
                          'College or University',
                          'Vocational or Other',
                        ] as StudentInstitutionType[]
                      ).map((instType) => (
                        <button
                          key={instType}
                          type="button"
                          onClick={() => updateField('student_institution_type', instType)}
                          className={`min-h-[44px] p-3 rounded-lg border-2 text-xs font-bold text-left ${
                            profile.student_institution_type === instType
                              ? 'bg-emerald-50 text-[#15803D] border-[#16A34A]'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {instType === 'Vocational or Other'
                            ? 'A vocational or other educational institution'
                            : instType}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="q-inst-name"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Institution Name
                      </label>
                      <input
                        id="q-inst-name"
                        type="text"
                        value={profile.institution_name}
                        onChange={(e) => updateField('institution_name', e.target.value)}
                        placeholder="e.g., Govt Inter College / BHU / Govt ITI"
                        className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="q-course-class"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Class or Course Name
                      </label>
                      <input
                        id="q-course-class"
                        type="text"
                        value={profile.course_or_class}
                        onChange={(e) => updateField('course_or_class', e.target.value)}
                        placeholder="e.g., Class 12 / B.Sc. / B.Tech / ITI"
                        className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="q-study-year"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Year of Study
                      </label>
                      <select
                        id="q-study-year"
                        value={profile.year_of_study}
                        onChange={(e) => updateField('year_of_study', e.target.value)}
                        className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year / Current Class">
                          1st Year / Current School Class
                        </option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th / Final Year">4th / Final Year</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="q-inst-ownership"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Institution Type
                      </label>
                      <select
                        id="q-inst-ownership"
                        value={profile.institution_ownership}
                        onChange={(e) =>
                          updateField(
                            'institution_ownership',
                            e.target.value as CitizenProfile['institution_ownership']
                          )
                        }
                        className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="Government">Government Institution</option>
                        <option value="Aided">Government-Aided Institution</option>
                        <option value="Private">Recognized Private Institution</option>
                        <option value="Unknown">I don’t know</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & EDIT ANSWERS */}
        {currentStep === 4 && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h2 className="text-sm font-bold text-slate-900">
                  Review &amp; Edit Beneficiary Answers
                </h2>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#15803D] flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit from Step 1</span>
                </button>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <dt className="text-slate-500">Beneficiary &amp; Relation</dt>
                  <dd className="font-bold text-slate-900 mt-0.5">
                    {profile.full_name || 'Not entered'} ({profile.relation.replace(/_/g, ' ')})
                  </dd>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <dt className="text-slate-500">Age &amp; Gender</dt>
                  <dd className="font-bold text-slate-900 mt-0.5 tabular-nums">
                    {profile.age !== null ? `${profile.age} years` : 'Not specified'} ·{' '}
                    {profile.gender}
                  </dd>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <dt className="text-slate-500">Location &amp; Area</dt>
                  <dd className="font-bold text-slate-900 mt-0.5">
                    {profile.district ? `${profile.district}, ` : ''}
                    {profile.state || 'State not set'} ({profile.residence_type})
                  </dd>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <dt className="text-slate-500">Social Category &amp; Annual Income</dt>
                  <dd className="font-bold text-slate-900 mt-0.5 tabular-nums">
                    {profile.social_category} ·{' '}
                    {profile.annual_family_income_inr !== null
                      ? `₹${profile.annual_family_income_inr.toLocaleString('en-IN')}/yr`
                      : 'Income Not Known'}
                  </dd>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <dt className="text-slate-500">Occupation &amp; Student Status</dt>
                  <dd className="font-bold text-slate-900 mt-0.5">
                    {profile.occupation || 'Not set'} ·{' '}
                    {profile.is_student
                      ? `Student (${profile.student_institution_type})`
                      : 'Not a Student'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Centered myscheme.gov.in Style Bottom CTA ("Next ->" and "Reset Form") */}
        <div className="flex flex-col items-center space-y-3 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                className="min-h-[46px] px-8 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinishQuestionnaire}
                className="min-h-[46px] px-8 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-bold flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit &amp; Show Matching Schemes</span>
              </button>
            )}

            {currentStep < 4 && (
              <button
                type="button"
                onClick={onFinishQuestionnaire}
                className="min-h-[46px] px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                Skip to Matching Schemes
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-semibold text-[#15803D] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
            <button
              type="button"
              onClick={onBackToVoice}
              className="text-xs text-slate-500 hover:underline"
            >
              Voice &amp; Language Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
