import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateScholarshipMatch } from '../utils/matching';
import { computeComparisonHighlights } from '../utils/comparison';
import { formatDate, getDaysUntil } from '../utils/dates';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Info,
  Scale,
} from 'lucide-react';

export const ComparisonStudioView: React.FC = () => {
  const {
    scholarships,
    profile,
    documents,
    comparisonIds,
    addToComparison,
    removeFromComparison,
    clearComparison,
    setSelectedScholarshipId,
    setGapAnalyzerScholarshipId,
    setTab,
    updateApplicationStage,
  } = useApp();

  const [selectedToAdd, setSelectedToAdd] = useState<string>('');

  // Selected scholarship objects
  const comparedScholarships = useMemo(() => {
    return comparisonIds
      .map((id) => scholarships.find((s) => s.id === id))
      .filter(Boolean) as typeof scholarships;
  }, [comparisonIds, scholarships]);

  // Compute 5 highlight badges
  const highlights = useMemo(() => {
    return computeComparisonHighlights(comparedScholarships, profile, documents);
  }, [comparedScholarships, profile, documents]);

  // Available scholarships to add (not yet in comparisonIds)
  const availableToAdd = useMemo(() => {
    return scholarships.filter((s) => !comparisonIds.includes(s.id));
  }, [scholarships, comparisonIds]);

  const handleAddSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      addToComparison(val);
      setSelectedToAdd('');
    }
  };

  const handleResetDefault = () => {
    clearComparison();
    addToComparison('sch-reliance-ug');
    addToComparison('sch-central-sector');
    addToComparison('sch-ffe-stem');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-white via-[#F4F7FF] to-[#EAF1FF] border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/70 text-[#4169E1] rounded-full text-xs font-semibold tracking-wide">
              <Scale className="w-3.5 h-3.5" />
              <span>GRANTLY DECISION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Scholarship Comparison Studio
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Compare 2 to 5 scholarships side-by-side on exact financial value, strict eligibility constraints, fine-print obligations, and effort ratings. No ambiguous estimates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Picker */}
            {availableToAdd.length > 0 && comparisonIds.length < 5 && (
              <div className="relative">
                <select
                  value={selectedToAdd}
                  onChange={handleAddSelect}
                  className="bg-white text-slate-700 text-xs sm:text-sm font-medium border border-blue-200 rounded-2xl px-3.5 py-2.5 pr-8 hover:border-[#4169E1] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 cursor-pointer shadow-sm transition"
                  aria-label="Add scholarship to comparison"
                >
                  <option value="">+ Add Scholarship ({comparisonIds.length}/5)</option>
                  {availableToAdd.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.amountFormatted})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {comparisonIds.length > 0 && (
              <button
                type="button"
                onClick={clearComparison}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-2xl transition shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4169E1] bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-2xl transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Reset Benchmark Set
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {comparedScholarships.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-3xl p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-50 text-[#4169E1] rounded-2xl flex items-center justify-center">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#172554]">No Scholarships Selected for Comparison</h2>
          <p className="text-slate-600 max-w-md mx-auto text-sm">
            Select at least 2 scholarships to compare financial value, eligibility gaps, renewal clauses, and required documents.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4169E1] hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-sm transition"
            >
              Load Benchmark Comparison (3 Schemes)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Five Signature Decision Highlights */}
          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#7664D8]" />
              <h2 className="text-base font-bold text-[#172554] tracking-tight">
                Studio Synthesis: 5 Decision Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Highlight 1: Best Financial */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/70 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    Best Financial Benefit
                  </span>
                </div>
                <div className="font-bold text-sm text-[#172554] line-clamp-1">
                  {highlights.bestFinancial ? highlights.bestFinancial.name : '—'}
                </div>
                <div className="text-xs text-emerald-700 font-semibold">
                  {highlights.bestFinancial ? highlights.bestFinancial.amountFormatted : 'N/A'}
                </div>
              </div>

              {/* Highlight 2: Best Match */}
              <div className="p-3.5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/70 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-blue-800">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Best Eligibility Match
                  </span>
                </div>
                <div className="font-bold text-sm text-[#172554] line-clamp-1">
                  {highlights.bestMatch ? highlights.bestMatch.name : '—'}
                </div>
                <div className="text-xs text-blue-700 font-semibold">
                  {highlights.bestMatch
                    ? `${evaluateScholarshipMatch(highlights.bestMatch, profile, documents).matchPercentage}% Fit`
                    : 'N/A'}
                </div>
              </div>

              {/* Highlight 3: Least Complicated */}
              <div className="p-3.5 bg-gradient-to-br from-purple-50/80 to-violet-50/50 border border-purple-200/70 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Least Complicated
                  </span>
                </div>
                <div className="font-bold text-sm text-[#172554] line-clamp-1">
                  {highlights.leastComplicated ? highlights.leastComplicated.name : '—'}
                </div>
                <div className="text-xs text-purple-700 font-semibold">
                  {highlights.leastComplicated ? `${highlights.leastComplicated.difficultyRating} Effort` : 'N/A'}
                </div>
              </div>

              {/* Highlight 4: Nearest Deadline */}
              <div className="p-3.5 bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/70 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Nearest Deadline
                  </span>
                </div>
                <div className="font-bold text-sm text-[#172554] line-clamp-1">
                  {highlights.nearestDeadline ? highlights.nearestDeadline.name : '—'}
                </div>
                <div className="text-xs text-amber-700 font-semibold">
                  {highlights.nearestDeadline
                    ? `${getDaysUntil(highlights.nearestDeadline.deadline)} days (${formatDate(highlights.nearestDeadline.deadline)})`
                    : 'N/A'}
                </div>
              </div>

              {/* Highlight 5: Best Overall */}
              <div className="p-3.5 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-300/80 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4169E1]">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Best Overall Fit
                  </span>
                </div>
                <div className="font-bold text-sm text-[#172554] line-clamp-1">
                  {highlights.bestOverall ? highlights.bestOverall.name : '—'}
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  Composite Financial + Match Leader
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix Table */}
          <div className="bg-white border border-blue-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#F8FAFF] border-b border-blue-100">
                    <th className="p-4 sm:p-5 w-52 min-w-[200px] text-xs font-bold uppercase tracking-wider text-slate-500">
                      Criteria & Attributes
                    </th>
                    {comparedScholarships.map((s) => {
                      const matchRes = evaluateScholarshipMatch(s, profile, documents);
                      const isOverall = highlights.bestOverall?.id === s.id;
                      return (
                        <th
                          key={s.id}
                          className={`p-4 sm:p-5 min-w-[260px] max-w-[320px] align-top ${
                            isOverall ? 'bg-blue-50/40 border-x border-blue-200/70' : ''
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {s.providerType}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromComparison(s.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                                title="Remove from comparison"
                                aria-label={`Remove ${s.name} from comparison`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="font-extrabold text-[#172554] text-base leading-snug">
                              {s.name}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              {s.provider}
                            </div>

                            {/* Badge row */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {highlights.bestFinancial?.id === s.id && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                                  Top Financial
                                </span>
                              )}
                              {highlights.bestMatch?.id === s.id && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800">
                                  Top Match
                                </span>
                              )}
                              {highlights.leastComplicated?.id === s.id && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-800">
                                  Low Friction
                                </span>
                              )}
                              {isOverall && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                  ★ Best Overall
                                </span>
                              )}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Row: Financial Grant */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Grant Amount & Cadence
                    </td>
                    {comparedScholarships.map((s) => (
                      <td key={s.id} className="p-4 sm:p-5 align-top">
                        <div className="font-extrabold text-base text-[#172554]">
                          {s.amountFormatted}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {s.paymentFrequency || s.amountType}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Support Type */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Support Disbursement Type
                    </td>
                    {comparedScholarships.map((s) => (
                      <td key={s.id} className="p-4 sm:p-5 align-top">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-xl bg-blue-50 text-[#4169E1] border border-blue-200">
                          {s.supportType || 'Direct Bank Transfer (DBT)'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Fit & Eligibility Status */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Eligibility & Match Fit
                    </td>
                    {comparedScholarships.map((s) => {
                      const res = evaluateScholarshipMatch(s, profile, documents);
                      const isEligible = res.status === 'ELIGIBLE';
                      const isPotential = res.status === 'POTENTIALLY ELIGIBLE';
                      return (
                        <td key={s.id} className="p-4 sm:p-5 align-top">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                                isEligible
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isPotential
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {res.status}
                            </span>
                            <span className="text-xs font-extrabold text-[#172554]">
                              {res.matchPercentage}%
                            </span>
                          </div>
                          {res.reasons.length > 0 && (
                            <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {res.reasons[0]}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Cutoffs */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Cutoff & Academic Bar
                    </td>
                    {comparedScholarships.map((s) => {
                      const meetsPercentage = (profile.academicPercentage || 0) >= (s.minPercentage || 0);
                      return (
                        <td key={s.id} className="p-4 sm:p-5 align-top">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-[#172554]">
                            <span>Min {s.minPercentage}%</span>
                            {meetsPercentage ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Your score: {profile.academicPercentage}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Family Income Limit */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Family Income Ceiling
                    </td>
                    {comparedScholarships.map((s) => {
                      const meetsIncome = (profile.familyIncome || 0) <= (s.maxFamilyIncome || 0);
                      return (
                        <td key={s.id} className="p-4 sm:p-5 align-top">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-[#172554]">
                            <span>₹{(s.maxFamilyIncome / 100000).toFixed(1)}L / year</span>
                            {meetsIncome ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Your household: ₹{((profile.familyIncome || 0) / 100000).toFixed(1)}L
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Deadlines */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Deadline & Urgency
                    </td>
                    {comparedScholarships.map((s) => {
                      const days = getDaysUntil(s.deadline);
                      const isPast = days < 0;
                      return (
                        <td key={s.id} className="p-4 sm:p-5 align-top">
                          <div className="font-bold text-sm text-[#172554]">
                            {formatDate(s.deadline)}
                          </div>
                          <div
                            className={`text-xs font-semibold mt-0.5 ${
                              isPast
                                ? 'text-slate-400'
                                : days <= 7
                                ? 'text-rose-600'
                                : days <= 20
                                ? 'text-amber-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {isPast ? 'Closed Window' : `${days} days remaining`}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Required Documents */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Documents & Readiness
                    </td>
                    {comparedScholarships.map((s) => {
                      const userDocTypes = documents.map((d) => d.type);
                      const missingDocs = s.requiredDocuments.filter((d) => !userDocTypes.includes(d));
                      return (
                        <td key={s.id} className="p-4 sm:p-5 align-top">
                          <div className="font-bold text-sm text-[#172554]">
                            {s.requiredDocuments.length} mandatory documents
                          </div>
                          {missingDocs.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              All Ready in Vault
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {missingDocs.length} missing from Vault
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Application Method & Friction */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Application Method & Effort
                    </td>
                    {comparedScholarships.map((s) => (
                      <td key={s.id} className="p-4 sm:p-5 align-top">
                        <div className="font-bold text-sm text-[#172554]">
                          {s.applicationMethod || 'Online Portal'}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Effort rating: {s.difficultyRating || 'Moderate'}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Renewal Benchmark */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Renewal Conditions (Fine-Print)
                    </td>
                    {comparedScholarships.map((s) => (
                      <td key={s.id} className="p-4 sm:p-5 align-top">
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {s.renewalConditions || 'One-time disbursed award. Check institutional scheme circular for successive year guidelines.'}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Attendance */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Attendance Norms
                    </td>
                    {comparedScholarships.map((s) => (
                      <td key={s.id} className="p-4 sm:p-5 align-top">
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {s.attendanceRequirement || 'Standard institutional minimum attendance required.'}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Stacking Rules */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      Stacking & Dual-Aid Policy
                    </td>
                    {comparedScholarships.map((s) => {
                      const allows = s.combinationRestrictions?.allowsStacking;
                      return (
                        <td key={s.id} className="p-4 sm:p-5 align-top">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-1 ${
                              allows ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {allows ? 'Stacking Permitted' : 'Strict Non-Stackable'}
                          </span>
                          <p className="text-xs text-slate-600 leading-snug">
                            {s.combinationRestrictions?.stackingNotes || 'Check scheme circular.'}
                          </p>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Actions */}
                  <tr className="bg-slate-50/40">
                    <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500">
                      Next Step Actions
                    </td>
                    {comparedScholarships.map((s) => (
                      <td key={s.id} className="p-4 sm:p-5 align-top space-y-2">
                        <button
                          type="button"
                          onClick={() => setSelectedScholarshipId(s.id)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#4169E1] hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
                        >
                          <Info className="w-3.5 h-3.5" />
                          Truth Card & Details
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateApplicationStage(s.id, 'PREPARE');
                            setTab('journey');
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-blue-50 text-[#172554] border border-blue-200 rounded-xl transition shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#4169E1]" />
                          Prepare in Journey
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setGapAnalyzerScholarshipId(s.id);
                            setTab('analyzer');
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#4169E1] transition"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          Diagnostic Gap Analysis
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
