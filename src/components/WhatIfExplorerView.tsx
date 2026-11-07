import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';
import { EducationLevel, StudentProfile } from '../types/scholarship';

export const WhatIfExplorerView: React.FC = () => {
  const { profile, scholarships, documents, setSelectedScholarshipId } = useApp();

  // Hypothetical state (isolated from actual profile!)
  const [hypoScore, setHypoScore] = useState<number>(profile.academicScore || 75);
  const [hypoIncome, setHypoIncome] = useState<number>(profile.annualFamilyIncome || 450000);
  const [hypoLevel, setHypoLevel] = useState<EducationLevel>(profile.educationLevel || 'Undergraduate');

  // Baseline evaluation with REAL profile
  const baselineMatches = useMemo(() => {
    return scholarships.filter((s) => {
      const res = evaluateScholarshipMatch(s, profile, documents);
      return res.status === 'ELIGIBLE' || res.status === 'POTENTIALLY ELIGIBLE';
    });
  }, [scholarships, profile, documents]);

  // Hypothetical evaluation with SANDBOX profile
  const hypoProfile: StudentProfile = useMemo(() => {
    return {
      ...profile,
      academicScore: hypoScore,
      academicScoreType: 'percentage',
      annualFamilyIncome: hypoIncome,
      educationLevel: hypoLevel,
    };
  }, [profile, hypoScore, hypoIncome, hypoLevel]);

  const hypoMatches = useMemo(() => {
    return scholarships.map((s) => {
      const res = evaluateScholarshipMatch(s, hypoProfile, documents);
      const isBaseline = baselineMatches.some((b) => b.id === s.id);
      return {
        scholarship: s,
        res,
        isBaseline,
        isNewlyUnlocked: (res.status === 'ELIGIBLE' || res.status === 'POTENTIALLY ELIGIBLE') && !isBaseline,
      };
    });
  }, [scholarships, hypoProfile, documents, baselineMatches]);

  const newlyUnlocked = hypoMatches.filter((m) => m.isNewlyUnlocked);
  const totalHypoFunding = hypoMatches
    .filter((m) => m.res.status === 'ELIGIBLE' || m.res.status === 'POTENTIALLY ELIGIBLE')
    .reduce((sum, m) => sum + m.scholarship.amount, 0);

  const baselineFunding = baselineMatches.reduce((sum, s) => sum + s.amount, 0);
  const fundingDelta = totalHypoFunding - baselineFunding;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold mb-2 border border-blue-200/60 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Predictive Scenario Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] tracking-tight">
            What-If Scholarship Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Simulate academic improvements and degree transitions to see which funding opportunities unlock in the future.
          </p>
        </div>
      </div>

      {/* Mandatory Sandbox Transparency Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex gap-3 items-start shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold">Hypothetical Simulation Sandbox — Integrity Notice</p>
          <p className="text-[11px] text-amber-900 mt-0.5">
            Adjusting parameters here does <strong>not</strong> change your verified student profile. Official scholarship applications strictly require government-issued income certificates and university transcripts. Never misrepresent credentials on official portals.
          </p>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS & SIDE-BY-SIDE SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sandbox Sliders */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-6">
          <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4169E1]" />
            <span>Adjust Simulation Variables</span>
          </h3>

          {/* Variable 1: Academic Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Academic Percentage</label>
              <span className="text-sm font-extrabold text-[#4169E1] font-['Space_Grotesk']">
                {hypoScore}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="98"
              step="1"
              value={hypoScore}
              onChange={(e) => setHypoScore(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#4169E1]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>50% Minimum</span>
              <span>Baseline: {profile.academicScore}%</span>
              <span>98% Honors</span>
            </div>
          </div>

          {/* Variable 2: Family Income */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Annual Family Income</label>
              <span className="text-sm font-extrabold text-[#4169E1] font-['Space_Grotesk']">
                {formatINR(hypoIncome)}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="1500000"
              step="25000"
              value={hypoIncome}
              onChange={(e) => setHypoIncome(parseInt(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#4169E1]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>₹1 Lakh</span>
              <span>Baseline: {formatINR(profile.annualFamilyIncome)}</span>
              <span>₹15 Lakhs</span>
            </div>
          </div>

          {/* Variable 3: Education Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Future Education Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Undergraduate', 'Postgraduate', 'Diploma'] as EducationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setHypoLevel(lvl)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    hypoLevel === lvl
                      ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] shadow-xs'
                      : 'border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setHypoScore(profile.academicScore || 75);
              setHypoIncome(profile.annualFamilyIncome || 450000);
              setHypoLevel(profile.educationLevel || 'Undergraduate');
            }}
            className="w-full py-2.5 rounded-xl border border-blue-200 text-xs font-semibold text-slate-600 hover:bg-[#F4F7FF] transition-colors"
          >
            Reset Variables to Current Profile
          </button>
        </div>

        {/* Impact Comparison Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Baseline Card */}
            <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Current Verified Profile
              </span>
              <p className="text-2xl font-black text-[#172554] font-['Space_Grotesk']">
                {baselineMatches.length} Scholarships
              </p>
              <p className="text-xs text-slate-500">
                Potential Pool: <strong>{formatINR(baselineFunding)}</strong>
              </p>
            </div>

            {/* Sandbox Impact Card */}
            <div className="bg-gradient-to-tr from-[#4169E1] to-[#7664D8] text-white rounded-3xl p-6 shadow-md shadow-[#4169E1]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-blue-100 tracking-wider">
                In This Scenario
              </span>
              <p className="text-2xl font-black text-white font-['Space_Grotesk']">
                {hypoMatches.filter((m) => m.res.status === 'ELIGIBLE' || m.res.status === 'POTENTIALLY ELIGIBLE').length} Scholarships
              </p>
              <p className="text-xs text-blue-100">
                Funding Pool: <strong>{formatINR(totalHypoFunding)}</strong>{' '}
                {fundingDelta > 0 && <span className="text-emerald-300 font-bold">(+{formatINR(fundingDelta)})</span>}
              </p>
            </div>
          </div>

          {/* Newly Unlocked List */}
          <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172554] flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-600" />
                <span>Newly Unlocked Opportunities in this Scenario ({newlyUnlocked.length})</span>
              </h3>
            </div>

            {newlyUnlocked.length === 0 ? (
              <p className="text-xs text-slate-500 bg-[#F4F7FF] p-6 rounded-2xl text-center border border-blue-100/60">
                No new scholarships unlocked with current slider values. Try increasing academic percentage or switching education level to see unlockable schemes!
              </p>
            ) : (
              <div className="space-y-3">
                {newlyUnlocked.map(({ scholarship, res }) => (
                  <div
                    key={scholarship.id}
                    className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold mb-0.5">
                        <span>{scholarship.provider}</span>
                        <span>·</span>
                        <span>{scholarship.category}</span>
                      </div>
                      <h4 className="font-bold text-[#172554] text-sm">{scholarship.name}</h4>
                      <p className="text-slate-600 mt-1 text-[11px]">
                        Requirement met under scenario: {res.explanation}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk'] block">
                        {scholarship.amountFormatted}
                      </span>
                      <button
                        onClick={() => setSelectedScholarshipId(scholarship.id)}
                        className="text-xs font-semibold text-[#4169E1] hover:underline mt-1"
                      >
                        Inspect Rules →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
