import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Info,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { simulateScholarshipStacking } from '../utils/stacking';
import { formatINR } from '../utils/matching';
import { Scholarship } from '../types/scholarship';

export const ScholarshipStackingSimulatorView: React.FC = () => {
  const {
    scholarships,
    savedScholarshipIds,
    setSelectedScholarshipId,
    completeQuestMission,
  } = useApp();

  // Initially selected scholarships in the simulation (defaults to saved ones or first 2)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (savedScholarshipIds.length > 0) {
      return savedScholarshipIds.slice(0, 3);
    }
    return [scholarships[0]?.id, scholarships[1]?.id].filter(Boolean);
  });

  const selectedScholarships = scholarships.filter((s) => selectedIds.includes(s.id));
  const availableToAdd = scholarships.filter((s) => !selectedIds.includes(s.id));

  // Run pure stacking simulation engine
  const simulation = simulateScholarshipStacking(selectedScholarships);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length >= 2) {
        completeQuestMission('quest-stack-sim');
      }
      return next;
    });
  };

  const handleClear = () => {
    setSelectedIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold mb-2 border border-blue-200/60 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Financial Planning & Policy Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] tracking-tight">
            Scholarship Stacking Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explore multi-scholarship combinations and test for dual-funding statutory restrictions.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleClear}
            className="self-start md:self-auto py-2 px-3.5 text-xs font-semibold text-slate-600 hover:text-red-600 border border-blue-200/80 rounded-xl bg-white hover:bg-red-50/50 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>
        )}
      </div>

      {/* TOP CALCULATION METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gross Projected Sum */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Gross Combined Total
          </span>
          <p className="text-3xl font-black text-[#172554] font-['Space_Grotesk']">
            {formatINR(simulation.grossPotentialFunding)}
          </p>
          <p className="text-xs text-slate-500">
            Raw arithmetic sum of {selectedScholarships.length} selected award{selectedScholarships.length === 1 ? '' : 's'}.
          </p>
        </div>

        {/* Permitted Stackable Ceiling */}
        <div className="bg-gradient-to-br from-white to-[#F4F7FF] rounded-2xl p-6 border border-emerald-200/70 shadow-[0_4px_24px_rgb(16,185,129,0.06)] space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Allowable Stack Estimate
          </span>
          <p className="text-3xl font-black text-emerald-700 font-['Space_Grotesk']">
            {formatINR(simulation.allowableStackedFunding)}
          </p>
          <p className="text-xs text-slate-500">
            Adjusted for dual-receipt limits and statutory government restrictions.
          </p>
        </div>

        {/* Policy Conflict Status */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Policy Integrity Verdict
          </span>
          <div className="flex items-center gap-2 mt-1">
            {simulation.hasBlockingConflicts ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Conflicting Regulations Detected</span>
              </span>
            ) : selectedScholarships.length === 0 ? (
              <span className="text-xs text-slate-400">No scholarships selected</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Permitted Combination</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {simulation.conflicts.length} policy note{simulation.conflicts.length === 1 ? '' : 's'} flagged.
          </p>
        </div>
      </div>

      {/* POLICY CONFLICT & RESTRICTION ALERTS */}
      {simulation.conflicts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Dual-Funding & Regulatory Conflicts Flagged by Simulator</span>
          </div>

          <div className="space-y-2">
            {simulation.conflicts.map((conflict, i) => (
              <div key={i} className="p-3.5 bg-white/90 rounded-xl border border-amber-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172554]">
                    {conflict.scholarshipA} ↔ {conflict.scholarshipB}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    Dual Receipt Block
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">{conflict.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STACK COMPOSITION TABLE & ADD/REMOVE CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selected Stack List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172554]">
              Active Stack Composition ({selectedScholarships.length})
            </h3>
            <span className="text-xs text-slate-500">Click remove to adjust combinations</span>
          </div>

          {selectedScholarships.length === 0 ? (
            <div className="p-8 text-center bg-[#F4F7FF] rounded-2xl border border-blue-100/70 space-y-2 text-xs text-slate-500">
              <p className="font-semibold text-[#172554]">Your stacking canvas is empty.</p>
              <p>Select scholarships from the pool on the right to simulate funding combinations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedScholarships.map((sch) => (
                <div
                  key={sch.id}
                  className="p-4 rounded-2xl border border-blue-100 hover:border-blue-200 hover:bg-[#F4F7FF]/30 transition-all flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#4169E1]">{sch.provider}</span>
                      <span>·</span>
                      <span>{sch.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#172554] mt-0.5">{sch.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      Policy: {sch.combinationRestrictions.stackingNotes}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk']">
                      {sch.amountFormatted}
                    </span>
                    <button
                      onClick={() => handleToggle(sch.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove from stack"
                      aria-label={`Remove ${sch.name} from stack`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statutory Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-[#EAF1FF]/60 border border-blue-200/60 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-[#172554] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
              <span>Mandatory Stacking Disclaimer</span>
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {simulation.disclaimer}
            </p>
          </div>
        </div>

        {/* Add from Available Pool */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
          <h3 className="text-base font-bold text-[#172554]">
            Add Scholarships to Stack ({availableToAdd.length})
          </h3>
          <p className="text-xs text-slate-500">
            Click plus to incorporate into your active financial projection model.
          </p>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {availableToAdd.map((sch) => (
              <div
                key={sch.id}
                className="p-3.5 rounded-xl border border-blue-50 hover:border-blue-200 hover:bg-[#F4F7FF] transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-[#172554] line-clamp-1">{sch.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{sch.provider}</span>
                    <span>·</span>
                    <span className="font-bold text-[#172554]">{sch.amountFormatted}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(sch.id)}
                  className="p-2 rounded-lg bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-all shrink-0 font-medium"
                  title="Add to stack"
                  aria-label={`Add ${sch.name} to stack`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
