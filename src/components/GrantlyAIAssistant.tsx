import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  X,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Clock,
  FileCheck2,
  User,
  ShieldCheck,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';
import { calculateDaysRemaining, formatCountdown } from '../utils/dates';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actions?: { label: string; tab?: string; scholarshipId?: string }[];
}

const SUGGESTED_QUESTIONS = [
  'Which scholarships match my profile?',
  'Find scholarships for B.Tech students',
  'What documents should I prepare?',
  'Which deadlines are closing soon?',
  'Explain why I might be ineligible for Pragati',
  'How does scholarship stacking work?',
];

export const GrantlyAIAssistant: React.FC<{ isDrawer?: boolean }> = ({ isDrawer = false }) => {
  const {
    profile,
    scholarships,
    documents,
    showAssistantDrawer,
    setShowAssistantDrawer,
    setSelectedScholarshipId,
    setGapAnalyzerScholarshipId,
    setTab,
  } = useApp();

  useEffect(() => {
    if (!isDrawer || !showAssistantDrawer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAssistantDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawer, showAssistantDrawer, setShowAssistantDrawer]);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello ${profile.fullName || 'there'}! I am your GRANTLY Scholarship Advisor. I can analyze your eligibility against our database of 12+ verified schemes, check document requirements, and help you strategize deadlines. What would you like to explore today?`,
    },
  ]);

  if (isDrawer && !showAssistantDrawer) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process intelligent deterministic response based on live profile & scholarships
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let actions: Message['actions'] = [];

      if (q.includes('match') || q.includes('eligible') || q.includes('profile')) {
        const matches = scholarships.filter((s) => {
          const res = evaluateScholarshipMatch(s, profile, documents);
          return res.status === 'ELIGIBLE' || res.status === 'POTENTIALLY ELIGIBLE';
        });
        const total = matches.reduce((acc, s) => acc + s.amount, 0);

        reply = `Based on your profile (${profile.educationLevel}, ${profile.degree || 'General'}, ${profile.academicScore || 75}% score, ${formatINR(profile.annualFamilyIncome || 450000)} income), you are currently matched with ${matches.length} scholarships representing ${formatINR(total)} in total potential funding!\n\nTop matches:\n${matches.slice(0, 3).map((s, i) => `${i + 1}. ${s.name} (${s.amountFormatted})`).join('\n')}`;
        actions = [
          { label: 'View All Matches in Dashboard', tab: 'dashboard' },
          { label: 'Explore Opportunity Radar', tab: 'radar' },
        ];
      } else if (q.includes('b.tech') || q.includes('engineering') || q.includes('stem')) {
        const techSchs = scholarships.filter((s) =>
          s.eligibleDegrees.some((d) => d.includes('B.Tech') || d === 'All')
        );
        reply = `We have ${techSchs.length} scholarships open to engineering and technical students, including Reliance Foundation UG Grant, AICTE Pragati (girls in tech), Google APAC Scholarship, and FFE Engineering Fellowship.`;
        actions = [
          { label: 'Explore Discovery Catalog', tab: 'discover' },
          { label: 'Open Stacking Simulator', tab: 'stacking' },
        ];
      } else if (q.includes('document') || q.includes('vault') || q.includes('upload') || q.includes('prepare')) {
        reply = `You currently have ${documents.length} verified certificates in your Document Vault. The highest leverage documents are:\n1. Family Income Certificate (accepted across 4+ schemes)\n2. Academic Transcript / Marksheet\n3. Bonafide College Certificate.\n\nMake sure your certificates are issued for the current financial year!`;
        actions = [
          { label: 'Open Document Vault', tab: 'vault' },
        ];
      } else if (q.includes('deadline') || q.includes('urgent') || q.includes('closing')) {
        const urgent = scholarships
          .map((s) => ({ s, days: calculateDaysRemaining(s.deadline) }))
          .sort((a, b) => a.days - b.days)
          .slice(0, 3);

        reply = `Here are the nearest upcoming scholarship deadlines:\n${urgent.map((u, i) => `${i + 1}. ${u.s.name} - ${formatCountdown(u.days)} (${u.s.deadline})`).join('\n')}`;
        actions = [
          { label: 'Open Deadline Intelligence', tab: 'deadlines' },
        ];
      } else if (q.includes('pragati') || q.includes('ineligible') || q.includes('why')) {
        const pragati = scholarships.find((s) => s.id === 'sch-pragati-women');
        if (pragati) {
          const res = evaluateScholarshipMatch(pragati, profile, documents);
          reply = `AICTE Pragati Scheme analysis for your profile:\nStatus: ${res.status}\n\nKey rules:\n- Reserved exclusively for female applicants pursuing technical degrees/diplomas\n- Family income below ₹8,00,000/yr\n- Enrolled in AICTE-approved institution\n\nDiagnostic: ${res.explanation}`;
          actions = [
            { label: 'Deep Gap Analysis for Pragati', tab: 'analyzer', scholarshipId: 'sch-pragati-women' },
          ];
        }
      } else if (q.includes('stack') || q.includes('combination') || q.includes('combine')) {
        reply = `Scholarship stacking allows receiving multiple grants concurrently. However, statutory government regulations generally forbid receiving two central government scholarships (like NSP Central Sector + AICTE Pragati) at the same time. Private CSR awards and research stipends usually stack freely with college fee concessions!`;
        actions = [
          { label: 'Launch Stacking Simulator', tab: 'stacking' },
        ];
      } else {
        reply = `I analyzed your query: "${query}". You can explore opportunities in our catalog, run the Gap Analyzer to verify specific criteria, or simulate funding stacks. What would you like to review next?`;
        actions = [
          { label: 'Go to Dashboard', tab: 'dashboard' },
          { label: 'Open Discovery Catalog', tab: 'discover' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          actions,
        },
      ]);
    }, 400);
  };

  const content = (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Drawer / Card Header */}
      <div className="p-4 bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-between border-b border-blue-400/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4169E1] to-[#7664D8] flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">GRANTLY AI Advisor</h3>
            <p className="text-[10px] text-cyan-200">Rule-based verified scholarship assistant</p>
          </div>
        </div>
        {isDrawer && (
          <button
            onClick={() => setShowAssistantDrawer(false)}
            className="text-blue-100 hover:text-white p-1 rounded-lg"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-[#F4F7FF] border-b border-blue-100/70 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Prompts:</span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-blue-100 hover:border-[#4169E1] hover:text-[#4169E1] hover:bg-[#EAF1FF] rounded-lg transition-all text-[#172554] shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white rounded-br-none shadow-xs'
                  : 'bg-[#F4F7FF] text-[#172554] border border-blue-100/80 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>

            {m.actions && m.actions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {m.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (act.scholarshipId) {
                        setGapAnalyzerScholarshipId(act.scholarshipId);
                      }
                      if (act.tab) {
                        setTab(act.tab as any);
                        if (isDrawer) setShowAssistantDrawer(false);
                      }
                    }}
                    className="py-1 px-2.5 rounded-lg bg-[#EAF1FF] text-[#4169E1] text-[11px] font-bold hover:bg-[#4169E1] hover:text-white transition-colors flex items-center gap-1 border border-blue-200/50"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-blue-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about eligibility, documents, or deadlines..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-xs py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white hover:opacity-95 disabled:opacity-40 transition-all"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );

  if (isDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="fixed inset-0 bg-[#172554]/40 backdrop-blur-xs transition-opacity"
          onClick={() => setShowAssistantDrawer(false)}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-label="GRANTLY AI Scholarship Advisor"
          className="relative z-10 w-full sm:w-96 h-full shadow-2xl border-l border-blue-100 animate-in slide-in-from-right duration-200"
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.06)] h-[650px] overflow-hidden">
        {content}
      </div>
    </div>
  );
};
