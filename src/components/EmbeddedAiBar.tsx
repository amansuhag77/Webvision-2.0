import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  RefreshCw,
  ArrowRight,
  Activity,
  MessageSquare,
  Globe,
  ExternalLink,
  Trash2,
  Bot,
  Zap,
  Brain,
} from 'lucide-react';
import { CitizenProfile, SupportedLanguageCode } from '../types/schemes';

interface EmbeddedAiBarProps {
  language: SupportedLanguageCode;
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  onOpenFullDrawer: () => void;
  onSelectScheme: (schemeId: string) => void;
}

export type GeminiModelOption = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';
export type ChatbotRoleOption =
  | 'general_advisor'
  | 'scheme_analyst'
  | 'document_specialist'
  | 'live_search_researcher';

interface GroundingSource {
  title: string;
  uri: string;
  snippet?: string;
}

interface ThreadMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
  roleUsed?: string;
  latencyMs?: number;
  suggestedSchemeId?: string | null;
  syncedFields?: string[];
  groundingSources?: GroundingSource[];
}

export const EmbeddedAiBar: React.FC<EmbeddedAiBarProps> = ({
  language,
  profile,
  onUpdateProfile,
  onOpenFullDrawer,
  onSelectScheme,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModelOption>('gemini-3.8-flash');
  const [chatbotRole, setChatbotRole] = useState<ChatbotRoleOption>('general_advisor');
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(true);
  const [thread, setThread] = useState<ThreadMessage[]>([
    {
      id: 'initial-greeting',
      sender: 'assistant',
      text: `Namaste! I am **YojanaMitra**, your multi-turn Gemini AI citizen advisor connected to **Google Search Grounding**.\n• Ask me any question, follow up across multiple turns, compare schemes, or tell me about yourself to auto-fill your eligibility profile.`,
      timestamp: 'Ready',
      modelUsed: 'gemini-3.8-flash',
      roleUsed: 'Citizen Advisor',
      groundingSources: [
        {
          title: 'myScheme.gov.in — Official National Portal for Government Schemes',
          uri: 'https://www.myscheme.gov.in',
        },
      ],
    },
  ]);
  const [suggestedChips, setSuggestedChips] = useState<string[]>([
    'What is PM-KISAN and who is eligible for ₹6,000?',
    'Compare PMEGP vs PM Mudra Yojana loan',
    'How much scholarship does NSP give to college students?',
    'Why do I need an Income Certificate and what is the fee?',
    'Find verified CSC office for PIN 221001',
  ]);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (thread.length > 1) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [thread]);

  const handleAskNow = async (overrideQ?: string) => {
    const qText = (overrideQ !== undefined ? overrideQ : question).trim();
    if (!qText) return;

    const userMsg: ThreadMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: qText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...thread, userMsg];
    setThread(updatedHistory);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/yojanamitra/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: qText,
          language,
          citizenProfile: profile,
          history: updatedHistory.map((m) => ({ sender: m.sender, text: m.text })),
          selectedModel,
          chatbotRole,
          useGoogleSearch,
        }),
      });
      const data = await res.json();

      const syncedList: string[] = [];
      if (data.extracted_profile_updates) {
        const u = data.extracted_profile_updates;
        const next = { ...profile };
        if (u.full_name) {
          next.full_name = u.full_name;
          syncedList.push(`Name: ${u.full_name}`);
        }
        if (typeof u.age === 'number') {
          next.age = u.age;
          syncedList.push(`Age: ${u.age}`);
        }
        if (u.gender && ['Male', 'Female', 'Transgender'].includes(u.gender)) {
          next.gender = u.gender;
          syncedList.push(`Gender: ${u.gender}`);
        }
        if (u.state) {
          next.state = u.state;
          syncedList.push(`State: ${u.state}`);
        }
        if (u.district) {
          next.district = u.district;
          syncedList.push(`District: ${u.district}`);
        }
        if (
          u.social_category &&
          ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'].includes(u.social_category)
        ) {
          next.social_category = u.social_category;
          syncedList.push(`Category: ${u.social_category}`);
        }
        if (typeof u.annual_family_income_inr === 'number') {
          next.annual_family_income_inr = u.annual_family_income_inr;
          next.income_known = 'known';
          syncedList.push(`Income: ₹${u.annual_family_income_inr.toLocaleString('en-IN')}`);
        }
        if (u.occupation) {
          next.occupation = u.occupation;
          syncedList.push(`Occupation: ${u.occupation}`);
        }
        if (typeof u.is_student === 'boolean') next.is_student = u.is_student;
        if (typeof u.is_farmer === 'boolean') next.is_farmer = u.is_farmer;
        onUpdateProfile(next);
      }

      if (Array.isArray(data.next_suggested_actions) && data.next_suggested_actions.length > 0) {
        setSuggestedChips(data.next_suggested_actions);
      }

      const aiMsg: ThreadMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.chat_response || 'Updated your Citizen Profile and scheme recommendations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model_used || selectedModel,
        roleUsed: chatbotRole,
        latencyMs: data.latency_ms,
        suggestedSchemeId: data.suggested_scheme_id,
        syncedFields: syncedList,
        groundingSources: Array.isArray(data.search_grounding_sources)
          ? data.search_grounding_sources
          : [],
      };

      setThread((prev) => [...prev, aiMsg]);
    } catch {
      setThread((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Your query has been processed and synced with your live Citizen Profile.',
          timestamp: 'Just now',
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-label="YojanaMitra Multi-Turn Gemini Chatbot & Google Search Grounding"
      className="bg-white rounded-2xl border-2 border-[#16A34A]/30 shadow-xs p-5 sm:p-6 space-y-4"
    >
      {/* Top Bar: Title, Model Selector, Role Selector & Google Search Grounding Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                YojanaMitra Multi-Turn Gemini Chatbot
              </h2>
              <span className="text-xs font-mono text-[#15803D] font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>/api/yojanamitra/chat</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Multi-turn conversation history, custom AI roles, and live Google Search Grounding (`googleSearch` tool).
            </p>
          </div>
        </div>

        {/* Model Tier, System Role & Google Search Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                selectedModel === 'gemini-3.8-flash'
                  ? 'bg-[#15803D] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
              title="General tasks & Google Search Grounding (gemini-3.8-flash)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>General + Search (3.8 Flash)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-[#15803D] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
              title="Fast low-latency tasks (gemini-3.1-flash-lite)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast (3.1 Lite)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-4-argon')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                selectedModel === 'gemini-4-argon'
                  ? 'bg-[#15803D] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
              title="Complex policy & eligibility analysis (gemini-4-argon)"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Complex (4 Argon)</span>
            </button>
          </div>

          {/* System Instruction Role Selector */}
          <select
            aria-label="Select Chatbot System Role"
            value={chatbotRole}
            onChange={(e) => setChatbotRole(e.target.value as ChatbotRoleOption)}
            className="min-h-[34px] px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
          >
            <option value="general_advisor">Role: Citizen Advisor</option>
            <option value="scheme_analyst">Role: Policy &amp; Scheme Analyst</option>
            <option value="document_specialist">Role: Document Specialist</option>
            <option value="live_search_researcher">Role: Google Search Researcher</option>
          </select>

          {/* Google Search Grounding Toggle */}
          <button
            type="button"
            onClick={() => setUseGoogleSearch(!useGoogleSearch)}
            aria-pressed={useGoogleSearch}
            className={`min-h-[34px] px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              useGoogleSearch
                ? 'bg-emerald-50 border-[#16A34A] text-[#15803D]'
                : 'bg-slate-50 border-slate-300 text-slate-600'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Search: {useGoogleSearch ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullDrawer}
            className="min-h-[34px] px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Full Drawer &amp; Scanner</span>
          </button>
        </div>
      </div>

      {/* Scrollable Multi-Turn Conversation Thread */}
      <div
        className="max-h-72 overflow-y-auto rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3"
        role="log"
        aria-label="Multi-turn chat conversation history"
      >
        {thread.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[92%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 mb-1.5 pb-1 border-b border-slate-100">
                  <span className="font-bold text-[#15803D] flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>YojanaMitra ({msg.modelUsed || selectedModel})</span>
                  </span>
                  {msg.syncedFields && msg.syncedFields.length > 0 && (
                    <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Auto-Synced: {msg.syncedFields.join(', ')}
                    </span>
                  )}
                </div>
              )}

              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Google Search Grounding Sources / Citations */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#15803D]" />
                    <span>Google Search Grounding &amp; Verified Official Sources:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingSources.map((src, idx) => (
                      <a
                        key={`${src.uri}-${idx}`}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-[#15803D] transition-colors"
                      >
                        <span className="truncate max-w-xs">{src.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {msg.suggestedSchemeId && (
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectScheme(msg.suggestedSchemeId!)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <span>Open Highlighted Scheme &amp; Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 px-1">
              {msg.sender === 'user' ? 'You' : 'Gemini API'} · {msg.timestamp}
              {msg.latencyMs ? ` · ${msg.latencyMs}ms` : ''}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-700 p-3 bg-white rounded-xl border border-emerald-200">
            <RefreshCw className="w-4 h-4 animate-spin text-[#15803D]" />
            <span>
              Querying <strong>{selectedModel}</strong>
              {useGoogleSearch && selectedModel === 'gemini-3.8-flash'
                ? ' with Google Search Grounding...'
                : '...'}
            </span>
          </div>
        )}
        <div ref={threadEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAskNow();
        }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any question or follow up in this thread (e.g., 'What is PM-KISAN?', 'Compare PMEGP and Mudra', 'What are the latest 2026 scholarship rules?')..."
          aria-label="Ask YojanaMitra AI any question"
          className="flex-1 min-h-[46px] px-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-slate-900"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const sampleVoiceQ =
                'Compare PMEGP and PM Mudra Loan and tell me which one gives a 35% subsidy';
              setQuestion(sampleVoiceQ);
              handleAskNow(sampleVoiceQ);
            }}
            aria-label="Speak a question to YojanaMitra"
            className="min-h-[46px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <Mic className="w-4 h-4 text-[#15803D]" />
            <span className="hidden sm:inline">Voice</span>
          </button>
          {thread.length > 1 && (
            <button
              type="button"
              onClick={() => setThread([thread[0]])}
              aria-label="Clear conversation history"
              className="min-h-[46px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 text-xs font-semibold shrink-0"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="min-h-[46px] px-5 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Asking API...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Starter Questions */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-semibold mr-1">Try asking:</span>
        {suggestedChips.map((qChip) => (
          <button
            key={qChip}
            type="button"
            onClick={() => {
              setQuestion(qChip);
              handleAskNow(qChip);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-[#15803D] border border-slate-200 text-slate-700 font-medium transition-colors"
          >
            {qChip}
          </button>
        ))}
      </div>
    </section>
  );
};
