import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  CheckCircle2,
  X,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FundingQuestModal: React.FC = () => {
  const {
    questMissions,
    completeQuestMission,
    showQuestModal,
    setShowQuestModal,
    totalQuestPoints,
    setTab,
  } = useApp();

  if (!showQuestModal) return null;

  const completedCount = questMissions.filter((q) => q.completed).length;
  const totalMissions = questMissions.length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);

  const triggerCelebrate = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-blue-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white p-6 relative">
          <button
            onClick={() => setShowQuestModal(false)}
            className="absolute top-5 right-5 text-blue-200 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close Quest Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Scholarship Application Milestones</span>
          </div>

          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Funding Quest: Path to Full Support
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Systematic milestones designed to maximize your application readiness and win rate.
          </p>

          {/* Points & Progress Banner */}
          <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-200">Total Milestone Score</span>
              <p className="text-2xl font-black text-white font-['Space_Grotesk'] mt-0.5">
                {totalQuestPoints} <span className="text-xs font-semibold text-cyan-200">pts</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-blue-200">Milestones Cleared</span>
              <p className="text-base font-extrabold text-[#EAF1FF] font-['Space_Grotesk'] mt-0.5">
                {completedCount} / {totalMissions} ({progressPercent}%)
              </p>
            </div>
          </div>
        </div>

        {/* Missions List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {questMissions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                mission.completed
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-800'
                  : 'bg-white border-blue-100 hover:border-blue-200 text-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      mission.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#F4F7FF] text-[#172554] border border-blue-100'
                    }`}
                  >
                    {mission.category}
                  </span>
                  <span className="text-xs font-extrabold text-[#4169E1]">
                    +{mission.points} pts
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#172554]">{mission.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{mission.description}</p>
              </div>

              <div className="shrink-0 pt-1">
                {mission.completed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      completeQuestMission(mission.id);
                      triggerCelebrate();
                    }}
                    className="py-1 px-3 rounded-lg border border-[#4169E1] text-[#4169E1] text-xs font-semibold hover:bg-[#4169E1] hover:text-white transition-all shadow-2xs"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F4F7FF] border-t border-blue-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Completing all milestones places your profile in the top 5% of prepared applicants.
          </p>
          <button
            onClick={() => setShowQuestModal(false)}
            className="py-2 px-4 rounded-xl bg-[#172554] text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
