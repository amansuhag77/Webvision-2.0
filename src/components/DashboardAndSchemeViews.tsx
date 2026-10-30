import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  FileText,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Search,
  Building2,
  Clock,
  ShieldCheck,
  UserPlus,
  Trash2,
  Edit3,
  Upload,
  Check,
} from 'lucide-react';
import {
  ApplicationRecord,
  CitizenProfile,
  DocumentChecklistChoice,
  EvaluatedSchemeMatch,
  GovernmentScheme,
  RequiredDocumentSpec,
  UploadedDocumentRecord,
} from '../types/schemes';
import { SchemeCategoryIllustration } from './CivicIllustrations';

// ============================================================================
// SCREEN 5: MATCHING SCHEMES & LIVE CITIZEN ELIGIBILITY DASHBOARD
// ============================================================================
interface MatchingSchemesDashboardViewProps {
  activeProfile: CitizenProfile;
  allProfiles: CitizenProfile[];
  onSwitchProfile: (profileId: string) => void;
  matchedSchemes: EvaluatedSchemeMatch[];
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onSelectSchemeForDetails: (schemeId: string) => void;
  onEditQuestionnaire: () => void;
  onOpenAssistant: () => void;
  applications: ApplicationRecord[];
  uploadedDocs: UploadedDocumentRecord[];
  onNavigateSavedAndProfiles: () => void;
}

const SCHEME_CATEGORIES = [
  'All',
  'Agriculture',
  'Education',
  'Healthcare',
  'Housing',
  'Business & MSME',
  'Financial Assistance',
  'Employment & Skills',
  'Women & Child',
  'Pensions',
  'Social Welfare',
];

export const MatchingSchemesDashboardView: React.FC<MatchingSchemesDashboardViewProps> = ({
  activeProfile,
  allProfiles,
  onSwitchProfile,
  matchedSchemes,
  savedSchemeIds,
  onToggleSaveScheme,
  onSelectSchemeForDetails,
  onEditQuestionnaire,
  onOpenAssistant,
  applications,
  uploadedDocs,
  onNavigateSavedAndProfiles,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const appearsEligibleCount = matchedSchemes.filter(
    (m) => m.eligibility_status === 'Appears eligible'
  ).length;
  const moreInfoCount = matchedSchemes.filter(
    (m) => m.eligibility_status === 'More information needed'
  ).length;

  const displayedSchemes = matchedSchemes.filter((item) => {
    if (categoryFilter !== 'All' && item.scheme.category !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'All' && item.eligibility_status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const hay = `${item.scheme.scheme_name} ${item.scheme.hindi_name} ${item.scheme.category} ${item.scheme.brief_description} ${item.scheme.ministry_or_department}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Citizen Eligibility & Live Application Status Dashboard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-semibold text-slate-500">
              myScheme Live Citizen Dashboard · Beneficiary:{' '}
              <span className="text-slate-900 font-bold">
                {activeProfile.full_name || 'Citizen Profile'} (
                {activeProfile.relation === 'myself'
                  ? 'Myself'
                  : activeProfile.relation === 'family_member'
                  ? 'Family Member'
                  : 'Someone I Know'}
                )
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Matching Government Schemes &amp; Eligibility Tracker
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Eligibility results are matched using structured scheme rules. Final approval and disbursement depend on verification by the responsible government authority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allProfiles.length > 1 && (
              <select
                aria-label="Switch active beneficiary profile"
                value={activeProfile.id}
                onChange={(e) => onSwitchProfile(e.target.value)}
                className="min-h-[42px] px-3 py-2 text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg text-slate-900"
              >
                {allProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    Profile: {p.full_name || p.label} ({p.relation.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={onEditQuestionnaire}
              className="min-h-[42px] px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Eligibility Answers</span>
            </button>

            <button
              type="button"
              onClick={onOpenAssistant}
              className="min-h-[42px] px-4 py-2 text-xs font-bold bg-[#0F2942] hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Doc / Ask YojanaMitra</span>
            </button>
          </div>
        </div>

        {/* 4-Column Civic Dashboard Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs font-semibold text-emerald-900">Appears Eligible</div>
            <div className="text-xl font-extrabold text-emerald-950 mt-1 tabular-nums whitespace-nowrap">
              {appearsEligibleCount} Schemes
            </div>
            <div className="text-xs text-emerald-800 mt-1">
              Meets all structured profile criteria
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="text-xs font-semibold text-amber-900">More Information Needed</div>
            <div className="text-xl font-extrabold text-amber-950 mt-1 tabular-nums whitespace-nowrap">
              {moreInfoCount} Schemes
            </div>
            <div className="text-xs text-amber-800 mt-1">
              Confirm missing fields to unlock
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-600">
              Citizen Profile &amp; Verified Docs
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums whitespace-nowrap">
              {activeProfile.profile_completeness_percent}% · {uploadedDocs.length} Verified
            </div>
            <div className="text-xs text-slate-600 mt-1 truncate">
              {activeProfile.state || 'All India'} · {activeProfile.social_category} ·{' '}
              {activeProfile.annual_family_income_inr !== null
                ? `₹${activeProfile.annual_family_income_inr.toLocaleString('en-IN')}`
                : 'Income Unset'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-600">
                Real-Time Applications &amp; Saved
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums whitespace-nowrap">
                {applications.length} Active · {savedSchemeIds.length} Saved
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateSavedAndProfiles}
              className="text-xs font-bold text-[#0F2942] hover:underline text-left mt-1"
            >
              Track Applications &amp; Profiles →
            </button>
          </div>
        </div>

        {/* Real-Time Application Update Banner (when user has active applications) */}
        {applications.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-amber-300">
                Real-Time Application Status Update · ID {applications[0].application_id}
              </div>
              <div className="text-sm font-bold">
                {applications[0].scheme_name} — {applications[0].current_stage_label}
              </div>
              <div className="text-xs text-slate-300">
                Beneficiary: {applications[0].beneficiary_name} · Benefit:{' '}
                {applications[0].benefit_amount} · Updated {applications[0].last_updated}
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateSavedAndProfiles}
              className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white whitespace-nowrap"
            >
              View Live Tracker
            </button>
          </div>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes by name, benefit, or department (e.g., PM-KISAN, Scholarship, Mudra, Housing)..."
              aria-label="Search matching government schemes"
              className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          {/* Eligibility Status Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            {[
              { label: `All Matches (${matchedSchemes.length})`, value: 'All' },
              { label: `Appears eligible (${appearsEligibleCount})`, value: 'Appears eligible' },
              {
                label: `More information needed (${moreInfoCount})`,
                value: 'More information needed',
              },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab.value
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#0F2942] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {displayedSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            No schemes match the current filter combination
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Try resetting the category filter to “All” or updating your eligibility profile answers.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0F2942] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedSchemes.map((item) => {
            const { scheme } = item;
            const isSaved = savedSchemeIds.includes(scheme.scheme_id);
            const isEligible = item.eligibility_status === 'Appears eligible';

            return (
              <article
                key={scheme.scheme_id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <div>
                  {/* Scheme Visual Header Banner */}
                  <div className="relative border-b border-slate-100">
                    <SchemeCategoryIllustration
                      category={scheme.category}
                      schemeId={scheme.scheme_id}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                          isEligible
                            ? 'bg-[#15803D] text-white'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        {isEligible ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{item.eligibility_status}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => onToggleSaveScheme(scheme.scheme_id)}
                        aria-label={
                          isSaved ? `Remove ${scheme.scheme_name} from saved` : `Save ${scheme.scheme_name}`
                        }
                        className="min-h-[36px] px-2.5 py-1 rounded-md bg-white/95 hover:bg-white text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        {isSaved ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#15803D]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 text-slate-600" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-slate-700">
                        {scheme.ministry_or_department}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{scheme.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Match {item.match_score_percent}%
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 leading-snug">
                        {scheme.scheme_name}
                      </h2>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">
                        {scheme.hindi_name}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {scheme.brief_description}
                    </p>

                    {/* Quantified Benefits & Who It Supports */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">Main Benefits: </span>
                        <span className="font-semibold text-emerald-800">
                          {scheme.benefit_amount_or_type}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Who it supports: </span>
                        <span className="text-slate-700">{scheme.who_it_supports}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Application Deadline: </span>
                        <span className="text-slate-700 tabular-nums">
                          {scheme.application_deadline}
                        </span>
                      </div>
                    </div>

                    {/* Clear Explanation of Why It Matches the Profile */}
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        isEligible
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50/70 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="font-bold mb-0.5">
                        Why this scheme matches your profile:
                      </div>
                      <p>{item.why_you_qualify}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectSchemeForDetails(scheme.scheme_id)}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View scheme and documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCREEN 6: SCHEME DETAILS, DOCUMENT CHECKLIST & IN-APP APPLICATION
// ============================================================================
interface SchemeDetailsViewProps {
  evaluatedMatch: EvaluatedSchemeMatch;
  profile: CitizenProfile;
  isSaved: boolean;
  onToggleSave: () => void;
  docChecklist: Record<string, DocumentChecklistChoice>;
  onUpdateDocChecklist: (docId: string, choice: DocumentChecklistChoice) => void;
  uploadedDocs: UploadedDocumentRecord[];
  onAskAiAboutDoc: (doc: RequiredDocumentSpec) => void;
  onOpenMissingDocHelp: (doc: RequiredDocumentSpec) => void;
  onSubmitInAppApplication: (scheme: GovernmentScheme) => void;
  existingApplication?: ApplicationRecord;
  onBackToMatches: () => void;
}

export const SchemeDetailsView: React.FC<SchemeDetailsViewProps> = ({
  evaluatedMatch,
  profile,
  isSaved,
  onToggleSave,
  docChecklist,
  onUpdateDocChecklist,
  uploadedDocs,
  onAskAiAboutDoc,
  onOpenMissingDocHelp,
  onSubmitInAppApplication,
  existingApplication,
  onBackToMatches,
}) => {
  const { scheme } = evaluatedMatch;
  const [eSignConfirmed, setESignConfirmed] = useState(true);
  const [applicationSubmittedToast, setApplicationSubmittedToast] = useState(false);

  const handleApplyClick = () => {
    onSubmitInAppApplication(scheme);
    setApplicationSubmittedToast(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Save Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToMatches}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#15803D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matching Schemes</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleSave}
            className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#15803D]" />
                <span>Saved in Your Schemes</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-600" />
                <span>Save Scheme for Later</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Scheme Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <SchemeCategoryIllustration
          category={scheme.category}
          schemeId={scheme.scheme_id}
          className="w-full h-44 object-cover"
        />
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              {scheme.government_level} · <strong>{scheme.ministry_or_department}</strong>
            </span>
            <span className="font-mono">
              Status: <strong>{scheme.application_status}</strong> · Last checked:{' '}
              {scheme.last_checked_date}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {scheme.scheme_name}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">{scheme.hindi_name}</p>
          </div>

          {/* Eligibility Match Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
              evaluatedMatch.eligibility_status === 'Appears eligible'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="space-y-1">
              <div className="text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Profile Match Status: {evaluatedMatch.eligibility_status} (
                  {evaluatedMatch.match_score_percent}% Match)
                </span>
              </div>
              <p className="text-xs leading-relaxed">{evaluatedMatch.why_you_qualify}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs opacity-75">Quantified Benefit</div>
              <div className="text-base font-extrabold tabular-nums">
                {scheme.quantified_benefit_inr}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Interactive Required Documents Checklist with "Ask AI" */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="border-b border-slate-200 pb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-800">
              Interactive Document Readiness Checklist
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Required Documents for {scheme.scheme_name}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Mark your status for each required document below. Click <strong>“Ask AI”</strong> beside any document for a plain-language explanation of what it verifies and whether an alternative is accepted.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {scheme.required_documents.map((doc) => {
            const currentChoice: DocumentChecklistChoice =
              docChecklist[doc.document_id] || 'have_it';
            const isVerifiedByUpload = uploadedDocs.some((u) =>
              u.document_type.toLowerCase().includes(doc.document_name.split(' ')[0].toLowerCase())
            );

            return (
              <div
                key={doc.document_id}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{doc.document_name}</h3>
                      {isVerifiedByUpload && (
                        <span className="text-xs font-bold text-emerald-800">
                          · Verified in Document Vault
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{doc.what_it_is}</p>
                    <p className="text-xs text-slate-700">
                      <strong>Verifies:</strong> {doc.what_it_verifies}
                    </p>
                  </div>

                  {/* "Ask AI" Button Beside Each Document (Mandatory Requirement 7) */}
                  <button
                    type="button"
                    onClick={() => onAskAiAboutDoc(doc)}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0F2942] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ask AI</span>
                  </button>
                </div>

                {/* 3 Mandatory Checklist Radio Buttons: "I have this" / "I need help getting this" / "I'm not sure" */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto flex-1">
                    {(
                      [
                        { id: 'have_it', label: 'I have this' },
                        { id: 'need_help', label: 'I need help getting this' },
                        { id: 'not_sure', label: 'I’m not sure' },
                      ] as Array<{ id: DocumentChecklistChoice; label: string }>
                    ).map((opt) => {
                      const active = currentChoice === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onUpdateDocChecklist(doc.document_id, opt.id)}
                          className={`min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            active
                              ? opt.id === 'have_it'
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : opt.id === 'need_help'
                                ? 'bg-amber-700 text-white border-amber-700'
                                : 'bg-slate-800 text-white border-slate-800'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {(currentChoice === 'need_help' || currentChoice === 'not_sure') && (
                    <button
                      type="button"
                      onClick={() => onOpenMissingDocHelp(doc)}
                      className="min-h-[42px] px-4 py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>How to obtain &amp; nearby offices</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheme Purpose, Rules, Exclusions & Official Source Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Purpose &amp; Benefits</h2>
            <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
              {scheme.purpose_and_benefits}
            </p>
            <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950">
              <strong>Benefit Summary:</strong> {scheme.benefit_amount_or_type}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Official Eligibility Rules
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {scheme.eligibility_rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">Exclusions</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {scheme.exclusions.map((ex, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Application Dates, Fees &amp; Expected Next Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Application Window / Deadline</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {scheme.application_deadline}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Application Fee</div>
                <div className="font-bold text-slate-900 mt-0.5">{scheme.application_fees}</div>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-700 mb-1.5">
              Expected Next Steps After Submission:
            </div>
            <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside">
              {scheme.expected_next_steps.map((nxt, idx) => (
                <li key={idx}>{nxt}</li>
              ))}
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div>
              <strong>Official Source &amp; Guidelines:</strong> {scheme.official_source}
            </div>
            <div>
              <strong>Date Information Last Checked:</strong> {scheme.last_checked_date}
            </div>
          </div>
        </div>

        {/* Right Column: In-App Application Workflow (Zero External Redirects Guardrail) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 h-fit">
          <div>
            <div className="text-xs font-semibold text-emerald-800">
              In-App Unified Application Desk
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Submit Application Directly on Dashboard
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Pre-filled with {profile.full_name || 'Beneficiary'}’s verified profile details.
            </p>
          </div>

          <div className="space-y-2.5">
            {scheme.in_app_application_steps.map((stepText, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-[#0F2942] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                  {idx + 1}
                </span>
                <span>{stepText}</span>
              </div>
            ))}
          </div>

          {/* Pre-filled Citizen Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Pre-Filled Beneficiary Details:</div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary Name:</span>
              <span className="font-semibold text-slate-900">
                {profile.full_name || 'Ramesh Kumar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Age / Category:</span>
              <span className="font-semibold text-slate-900">
                {profile.age ?? 44} yrs · {profile.social_category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">State / District:</span>
              <span className="font-semibold text-slate-900">
                {profile.district || 'Varanasi'}, {profile.state || 'Uttar Pradesh'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DBT Bank Seeding:</span>
              <span className="font-semibold text-emerald-700">NPCI Aadhaar Active</span>
            </div>
          </div>

          {existingApplication || applicationSubmittedToast ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Application Submitted &amp; Tracked Live!</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Reference ID:{' '}
                <strong className="font-mono">
                  {existingApplication?.application_id || 'APP-2026-89412'}
                </strong>
                . Nodal officer verification is in progress on your Real-Time Application Tracker.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eSignConfirmed}
                  onChange={(e) => setESignConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300"
                />
                <span>
                  I authorize Aadhaar e-Sign &amp; Direct Benefit Transfer (DBT) verification for{' '}
                  {scheme.scheme_name}.
                </span>
              </label>

              <button
                type="button"
                disabled={!eSignConfirmed}
                onClick={handleApplyClick}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit In-App Application via e-Sign</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN 8: SAVED SCHEMES, BENEFICIARY PROFILES & REAL-TIME TRACKER
// ============================================================================
interface SavedAndProfilesViewProps {
  profiles: CitizenProfile[];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  onAddFamilyProfile: (name: string, relation: 'family_member' | 'someone_i_know', age: number) => void;
  onDeleteProfile: (id: string) => void;
  savedSchemes: GovernmentScheme[];
  onOpenScheme: (schemeId: string) => void;
  onRemoveSavedScheme: (schemeId: string) => void;
  applications: ApplicationRecord[];
  uploadedDocs: UploadedDocumentRecord[];
  onOpenAssistant: () => void;
}

export const SavedAndProfilesView: React.FC<SavedAndProfilesViewProps> = ({
  profiles,
  activeProfileId,
  onSwitchProfile,
  onAddFamilyProfile,
  onDeleteProfile,
  savedSchemes,
  onOpenScheme,
  onRemoveSavedScheme,
  applications,
  uploadedDocs,
  onOpenAssistant,
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState<'family_member' | 'someone_i_know'>(
    'family_member'
  );
  const [newMemberAge, setNewMemberAge] = useState('19');
  const [newMemberConsent, setNewMemberConsent] = useState(true);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberConsent) return;
    onAddFamilyProfile(
      newMemberName.trim(),
      newMemberRelation,
      parseInt(newMemberAge, 10) || 20
    );
    setNewMemberName('');
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold text-slate-500">
          Citizen Account Workspace · Multi-Beneficiary &amp; Application Tracking
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Real-Time Application Tracker, Saved Schemes &amp; Beneficiary Profiles
        </h1>
      </div>

      {/* Real-Time Application Status Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Real-Time Submitted Applications ({applications.length})
            </h2>
            <p className="text-xs text-slate-600">
              Live stage-by-stage verification and Direct Benefit Transfer (DBT) sanction status.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500 font-mono">
                    Application ID: <strong>{app.application_id}</strong> · Submitted:{' '}
                    {app.submitted_at}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{app.scheme_name}</h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Beneficiary: <strong>{app.beneficiary_name}</strong> (
                    {app.beneficiary_relation.replace(/_/g, ' ')}) · Benefit:{' '}
                    <strong className="text-emerald-800">{app.benefit_amount}</strong>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-md bg-emerald-800 text-white text-xs font-bold">
                  {app.current_stage_label}
                </span>
              </div>

              {/* 4-Stage Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {app.stages.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs ${
                      st.status === 'Completed'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : st.status === 'In Progress'
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{st.stage_name}</span>
                      <span className="font-mono text-[11px]">{st.status}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">{st.detail}</p>
                    <div className="mt-1 text-[10px] opacity-75 font-mono">{st.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Beneficiary Profiles & Privacy Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Saved Beneficiary Profiles ({profiles.length})
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Each family member or known person has a separate eligibility profile from the account holder. You can switch or delete profiles at any time.
            </p>
          </div>

          <div className="space-y-3">
            {profiles.map((p) => {
              const isCurrent = p.id === activeProfileId;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-slate-900/5 border-[#0F2942]'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {p.full_name || p.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        · {p.relation === 'myself' ? 'Account Holder (Myself)' : p.relation === 'family_member' ? 'Family Member' : 'Someone I Know'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Age: {p.age ?? 'Unset'} · {p.gender} · {p.occupation || 'Occupation unset'} ·{' '}
                      {p.state || 'State unset'} · Completeness {p.profile_completeness_percent}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCurrent ? (
                      <button
                        type="button"
                        onClick={() => onSwitchProfile(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold"
                      >
                        Switch to Profile
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold">
                        Active Profile
                      </span>
                    )}

                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteProfile(p.id)}
                        aria-label={`Delete profile for ${p.full_name || p.label}`}
                        className="min-w-[38px] min-h-[38px] rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Separate Family Member / Known Person Profile Form */}
          <form
            onSubmit={handleCreateProfile}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
          >
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#0F2942]" />
              <span>Add Separate Profile for a Family Member or Someone You Know</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Person’s Name (e.g. Daughter Ananya)"
                aria-label="New beneficiary full name"
                className="min-h-[40px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
              <select
                value={newMemberRelation}
                onChange={(e) =>
                  setNewMemberRelation(e.target.value as 'family_member' | 'someone_i_know')
                }
                aria-label="Relationship to beneficiary"
                className="min-h-[40px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              >
                <option value="family_member">For a family member</option>
                <option value="someone_i_know">For someone I know</option>
              </select>
              <input
                type="number"
                value={newMemberAge}
                onChange={(e) => setNewMemberAge(e.target.value)}
                placeholder="Age (e.g. 19)"
                aria-label="Beneficiary age in years"
                className="min-h-[40px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={newMemberConsent}
                onChange={(e) => setNewMemberConsent(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span>
                I confirm I have permission from this person to enter their details.
              </span>
            </label>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0F2942] text-white text-xs font-bold"
            >
              Create Separate Beneficiary Profile
            </button>
          </form>
        </div>

        {/* Right Column: Saved Schemes & Document Vault Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Saved Schemes ({savedSchemes.length})
            </h2>
            {savedSchemes.length === 0 ? (
              <p className="text-xs text-slate-600">
                You have not bookmarked any schemes yet. Click “Save” on any scheme card to keep it here for quick access.
              </p>
            ) : (
              <div className="space-y-3">
                {savedSchemes.map((s) => (
                  <div
                    key={s.scheme_id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="text-sm font-bold text-slate-900">{s.scheme_name}</div>
                    <div className="text-xs text-emerald-800 font-semibold">
                      {s.quantified_benefit_inr} · Deadline: {s.application_deadline}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenScheme(s.scheme_id)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold"
                      >
                        Open Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSavedScheme(s.scheme_id)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Verified Document Vault ({uploadedDocs.length})
              </h2>
              <button
                type="button"
                onClick={onOpenAssistant}
                className="text-xs font-bold text-[#0F2942] hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Scan Document</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Document uploads are optional during initial scheme discovery. Any document scanned with YojanaMitra is used solely to auto-fill your eligibility profile and check readiness.
            </p>
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs space-y-1"
              >
                <div className="font-bold text-emerald-950">{doc.document_type}</div>
                <div className="text-emerald-800">
                  File: {doc.file_name} · Status: <strong>{doc.verification_status}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
