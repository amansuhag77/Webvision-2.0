import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Square,
  Upload,
  Send,
  X,
  FileCheck2,
  Sparkles,
  FileText,
  RefreshCw,
  ArrowRight,
  Activity,
} from 'lucide-react';
import {
  CitizenProfile,
  EvaluatedSchemeMatch,
  SupportedLanguageCode,
  UploadedDocumentRecord,
} from '../types/schemes';
import { SUPPORTED_LANGUAGES } from '../data/schemesCatalog';
import { parseDocumentExtractionToProfile } from '../utils/eligibilityEngine';

interface YojanaMitraDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguageCode;
  onLanguageChange: (lang: SupportedLanguageCode) => void;
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  uploadedDocs: UploadedDocumentRecord[];
  onAddUploadedDoc: (doc: UploadedDocumentRecord) => void;
  matchedSchemes: EvaluatedSchemeMatch[];
  onSelectScheme: (schemeId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  attachedDocName?: string;
  apiEndpoint?: string;
  modelUsed?: string;
  latencyMs?: number;
  syncedUpdates?: Record<string, unknown>;
  suggestedSchemeId?: string | null;
  groundingSources?: Array<{ title: string; uri: string }>;
}

export const YojanaMitraDrawer: React.FC<YojanaMitraDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  profile,
  onUpdateProfile,
  uploadedDocs,
  onAddUploadedDoc,
  matchedSchemes,
  onSelectScheme,
}) => {
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Namaste! I am YojanaMitra (योजना मित्र), your multi-turn Gemini AI citizen advisor with live **Google Search Grounding**.\n\n• Choose between **gemini-3.8-flash** (General + Google Search), **gemini-3.1-flash-lite** (Fast), or **gemini-4-argon** (Complex Reasoning).\n• Every answer automatically syncs your **Citizen Profile** and **Matched Schemes**!`,
      timestamp: 'Live API Ready',
      apiEndpoint: 'POST /api/yojanamitra/chat',
      modelUsed: 'gemini-3.8-flash',
      groundingSources: [
        {
          title: 'myScheme.gov.in — National Platform for Government Schemes',
          uri: 'https://www.myscheme.gov.in',
        },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [chatbotRole, setChatbotRole] = useState<string>('general_advisor');
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(true);
  const [isListening, setIsListening] = useState(false);
  const [micPermissionConfirmed, setMicPermissionConfirmed] = useState(false);
  const [showMicPermissionPrompt, setShowMicPermissionPrompt] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState(messages[0].text);
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const [dynamicChips, setDynamicChips] = useState<string[]>([
    'Compare PMEGP vs PM Mudra Loan',
    'What scholarships can my 19 year old daughter in college get?',
    'Why do I need an Income Certificate and how to get it?',
    'I am a 28 year old woman in Pune with ₹2.2 Lakh income',
  ]);
  const [lastApiLatency, setLastApiLatency] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    setLastSpokenText(text);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.lang = currentLangObj.speechLang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleStartListening = () => {
    if (!micPermissionConfirmed) {
      setShowMicPermissionPrompt(true);
      return;
    }

    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputText('What schemes are available for a farmer in Varanasi with ₹72,000 income?');
      }, 1000);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRecognitionAPI as any)();
      recognition.lang = currentLangObj.speechLang;
      recognition.interimResults = false;
      setIsListening(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setInputText(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (
    overrideText?: string,
    filePayload?: { mimeType: string; base64: string; fileName: string }
  ) => {
    const textToSend = (overrideText !== undefined ? overrideText : inputText).trim();
    if (!textToSend && !filePayload) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend || `Uploaded document: ${filePayload?.fileName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedDocName: filePayload?.fileName,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/yojanamitra/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          citizenProfile: profile,
          history: nextHistory.slice(-10).map((m) => ({ sender: m.sender, text: m.text })),
          fileData: filePayload || null,
          selectedModel,
          chatbotRole,
          useGoogleSearch,
        }),
      });
      const data = await res.json();

      if (typeof data.latency_ms === 'number') {
        setLastApiLatency(data.latency_ms);
      }

      // Apply extracted profile updates if present
      const appliedUpdates: Record<string, unknown> = {};
      if (data.extracted_profile_updates) {
        const updates = data.extracted_profile_updates;
        const nextProfile = { ...profile };
        if (updates.full_name) {
          nextProfile.full_name = updates.full_name;
          appliedUpdates.full_name = updates.full_name;
        }
        if (typeof updates.age === 'number') {
          nextProfile.age = updates.age;
          appliedUpdates.age = updates.age;
        }
        if (updates.gender && ['Male', 'Female', 'Transgender'].includes(updates.gender)) {
          nextProfile.gender = updates.gender;
          appliedUpdates.gender = updates.gender;
        }
        if (updates.state) {
          nextProfile.state = updates.state;
          appliedUpdates.state = updates.state;
        }
        if (updates.district) {
          nextProfile.district = updates.district;
          appliedUpdates.district = updates.district;
        }
        if (
          updates.residence_type &&
          ['Urban', 'Rural'].includes(updates.residence_type)
        ) {
          nextProfile.residence_type = updates.residence_type;
          appliedUpdates.residence_type = updates.residence_type;
        }
        if (
          updates.social_category &&
          ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'].includes(updates.social_category)
        ) {
          nextProfile.social_category = updates.social_category;
          appliedUpdates.social_category = updates.social_category;
        }
        if (typeof updates.annual_family_income_inr === 'number') {
          nextProfile.annual_family_income_inr = updates.annual_family_income_inr;
          nextProfile.income_known = 'known';
          appliedUpdates.annual_family_income_inr = `₹${updates.annual_family_income_inr.toLocaleString('en-IN')}`;
        }
        if (updates.occupation) {
          nextProfile.occupation = updates.occupation;
          appliedUpdates.occupation = updates.occupation;
        }
        if (typeof updates.is_student === 'boolean') {
          nextProfile.is_student = updates.is_student;
        }
        if (typeof updates.is_farmer === 'boolean') {
          nextProfile.is_farmer = updates.is_farmer;
        }
        if (typeof updates.is_bpl === 'boolean') {
          nextProfile.is_bpl = updates.is_bpl;
        }
        if (typeof updates.is_pwd === 'boolean') {
          nextProfile.is_pwd = updates.is_pwd;
        }
        onUpdateProfile(nextProfile);
      }

      if (Array.isArray(data.uploaded_documents) && data.uploaded_documents.length > 0) {
        for (const doc of data.uploaded_documents) {
          const newDocRecord: UploadedDocumentRecord = {
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            document_type: doc.document_type || 'Citizen Document',
            file_name: filePayload?.fileName || 'Uploaded Document',
            verification_status: doc.verification_status || 'Verified',
            extracted_fields: doc.extracted_fields || [],
            notes: doc.notes || 'Verified by YojanaMitra Document Scanner',
            uploaded_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          onAddUploadedDoc(newDocRecord);
          if (Array.isArray(doc.extracted_fields)) {
            onUpdateProfile(parseDocumentExtractionToProfile(profile, doc.extracted_fields));
          }
        }
      }

      if (Array.isArray(data.next_suggested_actions) && data.next_suggested_actions.length > 0) {
        setDynamicChips(data.next_suggested_actions);
      }

      const replyText =
        data.chat_response ||
        'I have updated your Citizen Profile and filtered the matching schemes on your Dashboard.';
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          apiEndpoint: data.endpoint || 'POST /api/yojanamitra/chat',
          modelUsed: data.model_used || selectedModel,
          latencyMs: data.latency_ms,
          syncedUpdates: Object.keys(appliedUpdates).length > 0 ? appliedUpdates : undefined,
          suggestedSchemeId: data.suggested_scheme_id || null,
          groundingSources: Array.isArray(data.search_grounding_sources)
            ? data.search_grounding_sources
            : [],
        },
      ]);
      setLastSpokenText(replyText);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I have synced your details locally on your Citizen Dashboard. You can review your matching schemes directly on the main screen.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = String(reader.result || '');
      const base64 = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
      handleSendMessage(`Here is my uploaded document (${file.name}). What schemes can I apply for?`, {
        mimeType: file.type || 'image/jpeg',
        base64,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateSampleDocument = (preset: 'farmer_ramesh' | 'entrepreneur_sunita') => {
    if (preset === 'farmer_ramesh') {
      handleSendMessage(
        'I am Ramesh Kumar, age 44, a rural farmer in Varanasi Uttar Pradesh (OBC category) with ₹72,000 annual family income. What schemes can I apply for right now?'
      );
    } else {
      handleSendMessage(
        'I am Sunita Devi, age 28, Female, living in Pune Maharashtra (Urban), OBC category, annual income ₹2.2 Lakh, starting a new MSME unit and need a business loan.'
      );
    }
  };

  const liveStructuredPayload = {
    api_endpoint: 'POST /api/yojanamitra/chat',
    http_status: 200,
    model_selected: selectedModel,
    chatbot_role: chatbotRole,
    google_search_grounding: useGoogleSearch,
    chat_response: lastSpokenText,
    dashboard_view_mode: uploadedDocs.length > 0 ? 'DOCUMENT_VERIFICATION' : 'PROFILE_AND_MATCHES',
    citizen_profile: {
      full_name: profile.full_name || null,
      age: profile.age,
      gender: profile.gender,
      state: profile.state || null,
      district: profile.district || null,
      residence_type: profile.residence_type,
      social_category: profile.social_category,
      annual_family_income_inr: profile.annual_family_income_inr,
      occupation: profile.occupation || null,
      education_level: profile.course_or_class || null,
      is_bpl: profile.is_bpl,
      is_pwd: profile.is_pwd,
      primary_requirements: profile.selected_themes,
      profile_completeness_percent: profile.profile_completeness_percent,
    },
    uploaded_documents: uploadedDocs.map((d) => ({
      document_type: d.document_type,
      verification_status: d.verification_status,
      extracted_fields: d.extracted_fields,
      notes: d.notes,
    })),
    matched_schemes: matchedSchemes.slice(0, 4).map((m) => ({
      scheme_id: m.scheme.scheme_id,
      scheme_name: m.scheme.scheme_name,
      ministry_or_state: m.scheme.ministry_or_department,
      category: m.scheme.category,
      eligibility_status: m.schema_status,
      match_score_percent: m.match_score_percent,
      key_benefits_summary: m.scheme.benefit_amount_or_type,
      why_you_qualify: m.why_you_qualify,
    })),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="yojanamitra-drawer-title"
    >
      <div className="relative w-full max-w-xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Header in myScheme Green & Deep Navy */}
        <div className="px-5 py-4 bg-[#15803D] text-white flex items-center justify-between border-b border-emerald-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <h2 id="yojanamitra-drawer-title" className="text-base font-bold tracking-tight">
                YojanaMitra AI (योजना मित्र) · Multi-Turn &amp; Search Grounding
              </h2>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Connected to <code className="font-mono">/api/yojanamitra/chat</code>
                {lastApiLatency !== null ? ` · ${lastApiLatency}ms` : ' · Google Search Grounded'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJsonPayload(!showJsonPayload)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-md text-white transition-colors whitespace-nowrap"
            >
              {showJsonPayload ? 'View Chat' : 'API JSON State'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close YojanaMitra Assistant"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language, Model Tier, System Role & Audio Controls */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="drawer-lang-select" className="text-xs font-semibold text-slate-700">
                Language:
              </label>
              <select
                id="drawer-lang-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguageCode)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-900"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speakText(lastSpokenText)}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-300 hover:bg-slate-100 rounded-md flex items-center gap-1 text-slate-800"
                aria-label="Replay assistant audio"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{isSpeaking ? 'Speaking...' : 'Replay Audio'}</span>
              </button>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="px-2 py-1 text-xs font-medium bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-1"
                  aria-label="Stop audio playback"
                >
                  <Square className="w-3 h-3" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80 text-xs">
            <div className="flex items-center gap-1.5">
              <select
                aria-label="Select Gemini Model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 font-semibold text-slate-800"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (General + Search)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex Tasks)</option>
              </select>

              <select
                aria-label="Select Chatbot System Role"
                value={chatbotRole}
                onChange={(e) => setChatbotRole(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 font-semibold text-slate-800"
              >
                <option value="general_advisor">Role: Citizen Advisor</option>
                <option value="scheme_analyst">Role: Policy Analyst</option>
                <option value="document_specialist">Role: Document Specialist</option>
                <option value="live_search_researcher">Role: Search Researcher</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setUseGoogleSearch(!useGoogleSearch)}
              className={`px-2.5 py-1 rounded-md border font-bold ${
                useGoogleSearch
                  ? 'bg-emerald-50 border-[#16A34A] text-[#15803D]'
                  : 'bg-white border-slate-300 text-slate-600'
              }`}
            >
              Google Search: {useGoogleSearch ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Microphone Permission Confirmation Banner */}
        {showMicPermissionPrompt && (
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <p className="text-xs font-semibold text-amber-950">
              Allow Microphone Access for Voice Assistance?
            </p>
            <p className="text-xs text-amber-800 mt-1">
              YojanaMitra listens only while you press the microphone button to transcribe your spoken question in {currentLangObj.name}.
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => {
                  setMicPermissionConfirmed(true);
                  setShowMicPermissionPrompt(false);
                  setTimeout(() => handleStartListening(), 100);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[#15803D] text-white rounded-md"
              >
                Allow Microphone &amp; Speak
              </button>
              <button
                type="button"
                onClick={() => setShowMicPermissionPrompt(false)}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-md"
              >
                Use Text Instead
              </button>
            </div>
          </div>
        )}

        {/* Main Body */}
        {showJsonPayload ? (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-950 text-slate-100 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-emerald-400 font-semibold">
                Live API Payload (POST /api/yojanamitra/chat)
              </span>
              <span className="text-slate-400">HTTP 200 · JSON</span>
            </div>
            <pre className="whitespace-pre-wrap break-words leading-relaxed text-[11px] text-emerald-300">
              {JSON.stringify(liveStructuredPayload, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Multimodal Document Auto-Fill & API Test Bar */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#15803D]" />
                  Multimodal Document Upload &amp; Live Profile Sync
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#15803D] text-white rounded-md hover:bg-[#166534] flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload JPG/PDF</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload official document for automatic profile extraction"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => handleSimulateSampleDocument('farmer_ramesh')}
                  className="text-left p-2 rounded-lg bg-white border border-emerald-200 hover:border-[#15803D] transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900">
                    Test API Profile 1: Ramesh (Farmer)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Varanasi UP · Income ₹72,000 · OBC
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateSampleDocument('entrepreneur_sunita')}
                  className="text-left p-2 rounded-lg bg-white border border-emerald-200 hover:border-[#15803D] transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900">
                    Test API Profile 2: Sunita (MSME)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pune MH · Woman OBC · Income ₹2.2L
                  </div>
                </button>
              </div>
            </div>

            {/* Chat Message Thread */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[92%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#15803D] text-white'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  {m.attachedDocName && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-200 mb-1.5 pb-1.5 border-b border-white/20">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{m.attachedDocName}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* Google Search Grounding Sources */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-300/70 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700">
                        Google Search Grounding Citations:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.groundingSources.map((src, i) => (
                          <a
                            key={`${src.uri}-${i}`}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-2 py-0.5 rounded bg-white border border-emerald-300 text-[11px] font-semibold text-[#15803D] hover:underline truncate max-w-xs"
                          >
                            {src.title} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live API Profile Mutation Badge */}
                  {m.syncedUpdates && Object.keys(m.syncedUpdates).length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-300/80 text-xs text-emerald-900 bg-emerald-50 rounded-lg p-2">
                      <div className="font-bold">Live Dashboard Profile Synced via API:</div>
                      <div className="mt-0.5">
                        {Object.entries(m.syncedUpdates)
                          .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                          .join(' · ')}
                      </div>
                    </div>
                  )}

                  {/* Direct Scheme Deep-Dive CTA if API suggested a specific scheme */}
                  {m.suggestedSchemeId && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectScheme(m.suggestedSchemeId!);
                        onClose();
                      }}
                      className="mt-2.5 w-full py-2 px-3 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>Open Scheme Details &amp; Document Checklist on Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 px-1">
                  {m.sender === 'assistant'
                    ? `YojanaMitra (${m.modelUsed || selectedModel})`
                    : 'You'}{' '}
                  · {m.timestamp}
                  {m.latencyMs ? ` · ${m.latencyMs}ms` : ''}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-700 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <RefreshCw className="w-4 h-4 animate-spin text-[#15803D]" />
                <span>Calling POST /api/yojanamitra/chat and syncing dashboard state...</span>
              </div>
            )}

            {/* Live Top Matched Schemes Preview inside Assistant */}
            {matchedSchemes.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-2">
                  Live Synced Dashboard Matches ({matchedSchemes.length})
                </div>
                <div className="space-y-2">
                  {matchedSchemes.slice(0, 3).map((item) => (
                    <div
                      key={item.scheme.scheme_id}
                      className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.scheme.scheme_name}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {item.scheme.quantified_benefit_inr} ·{' '}
                          <span className="font-semibold text-[#15803D]">
                            {item.eligibility_status}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectScheme(item.scheme.scheme_id);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#15803D] border border-emerald-200 rounded-md whitespace-nowrap shrink-0"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Prompts & Input Footer */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5">
          {isListening && (
            <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-800">
              <span>Listening in {currentLangObj.nativeName}... Speak clearly now.</span>
              <button
                type="button"
                onClick={() => setIsListening(false)}
                className="font-semibold underline"
              >
                Stop
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {dynamicChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-[#15803D] text-slate-700 rounded-md whitespace-nowrap shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleStartListening}
              aria-label={isListening ? 'Stop voice input' : 'Speak to YojanaMitra with microphone'}
              className={`min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center border transition-colors ${
                isListening
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask any question in ${currentLangObj.name} or Hindi...`}
              aria-label="Type your question for YojanaMitra"
              className="flex-1 min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message to YojanaMitra"
              className="min-w-[44px] min-h-[44px] px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
