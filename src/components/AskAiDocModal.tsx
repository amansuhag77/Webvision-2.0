import React, { useState } from 'react';
import {
  X,
  Volume2,
  Square,
  Mic,
  Send,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { RequiredDocumentSpec, SupportedLanguageCode } from '../types/schemes';
import { SUPPORTED_LANGUAGES } from '../data/schemesCatalog';

interface AskAiDocModalProps {
  documentSpec: RequiredDocumentSpec | null;
  schemeName: string;
  language: SupportedLanguageCode;
  onClose: () => void;
  onOpenMissingDocHelp: (doc: RequiredDocumentSpec) => void;
}

export const AskAiDocModal: React.FC<AskAiDocModalProps> = ({
  documentSpec,
  schemeName,
  language,
  onClose,
  onOpenMissingDocHelp,
}) => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!documentSpec) return null;

  const langObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleAskQuestion = async (customQ?: string) => {
    const qText = (customQ !== undefined ? customQ : question).trim();
    if (!qText) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/yojanamitra/document-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentSpec,
          schemeName,
          userQuestion: qText,
          language,
        }),
      });
      const data = await res.json();
      setAiResponse(data.answer || null);
    } catch {
      setAiResponse(
        `Based on official ${schemeName} guidelines: ${documentSpec.why_required} Accepted alternatives: ${documentSpec.accepted_alternatives}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakExplanation = () => {
    const summaryToRead =
      aiResponse ||
      `${documentSpec.document_name}. What it is: ${documentSpec.what_it_is} Why required for ${schemeName}: ${documentSpec.why_required} What it verifies: ${documentSpec.what_it_verifies} Official alternatives: ${documentSpec.accepted_alternatives}`;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(summaryToRead);
      utterance.lang = langObj.speechLang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleVoiceQuestion = () => {
    setQuestion(`Why do I need ${documentSpec.document_name} and is an alternative accepted?`);
    handleAskQuestion(
      `Why do I need ${documentSpec.document_name} and is an alternative accepted?`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-ai-doc-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#0F2942] text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-amber-300">
              YojanaMitra Official Document Guide · {schemeName}
            </div>
            <h2 id="ask-ai-doc-title" className="text-lg font-bold mt-0.5">
              {documentSpec.document_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close document explanation modal"
            className="min-w-[40px] min-h-[40px] rounded-lg hover:bg-white/10 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Plain-language verification rules from {documentSpec.issuing_authority}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSpeakExplanation}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-md flex items-center gap-1.5 text-slate-800"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>{isSpeaking ? 'Reading Aloud...' : 'Listen in Audio'}</span>
            </button>
            {isSpeaking && (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center gap-1"
              >
                <Square className="w-3 h-3" />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-700">1. What this document is</div>
              <p className="text-sm text-slate-900 mt-1 leading-relaxed">
                {documentSpec.what_it_is}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-700">
                2. Why this particular scheme requires it
              </div>
              <p className="text-sm text-slate-900 mt-1 leading-relaxed">
                {documentSpec.why_required}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-700">
                3. What information it verifies
              </div>
              <p className="text-sm text-slate-900 mt-1 leading-relaxed">
                {documentSpec.what_it_verifies}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs font-bold text-amber-950">
                4. Does the official rule accept an alternative?
              </div>
              <p className="text-sm text-amber-900 mt-1 leading-relaxed">
                {documentSpec.accepted_alternatives}
              </p>
            </div>
          </div>

          {/* Ask a Custom Question about this Document */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#0F2942]" />
                Ask YojanaMitra a specific question about {documentSpec.document_name}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                `Why do I need ${documentSpec.document_name}?`,
                'Can I submit my family head’s certificate instead?',
                'How long is this certificate valid?',
              ].map((sampleQ) => (
                <button
                  key={sampleQ}
                  type="button"
                  onClick={() => {
                    setQuestion(sampleQ);
                    handleAskQuestion(sampleQ);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  {sampleQ}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceQuestion}
                aria-label="Ask document question using voice"
                className="min-w-[42px] min-h-[42px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center justify-center"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Why do I need an income certificate?"
                aria-label="Ask a question about this required document"
                className="flex-1 min-h-[42px] px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="min-h-[42px] px-4 bg-[#0F2942] hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </form>

            {isLoading && (
              <div className="text-xs text-slate-600 flex items-center gap-2 py-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0F2942]" />
                <span>Checking official scheme document guidelines...</span>
              </div>
            )}

            {aiResponse && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2942] mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>YojanaMitra Grounded Answer:</span>
                </div>
                {aiResponse}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Don’t have this document yet? See step-by-step application help &amp; nearby offices.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMissingDocHelp(documentSpec);
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#0F2942] hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5"
            >
              <span>How to Get This Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
