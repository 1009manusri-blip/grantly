import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Clock,
  Calendar,
  Layers,
  Milestone,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  AlertTriangle,
  Info,
  Check,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';
import { calculateDaysRemaining, formatCountdown, formatDate } from '../utils/dates';

export const ScholarshipDetailModal: React.FC = () => {
  const {
    selectedScholarshipId,
    setSelectedScholarshipId,
    scholarships,
    profile,
    documents,
    savedScholarshipIds,
    toggleSaveScholarship,
    updateApplicationStage,
    setGapAnalyzerScholarshipId,
    setTab,
  } = useApp();

  useEffect(() => {
    if (!selectedScholarshipId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedScholarshipId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScholarshipId, setSelectedScholarshipId]);

  if (!selectedScholarshipId) return null;

  const scholarship = scholarships.find((s) => s.id === selectedScholarshipId);
  if (!scholarship) return null;

  const match = evaluateScholarshipMatch(scholarship, profile, documents);
  const daysRemaining = calculateDaysRemaining(scholarship.deadline);
  const isSaved = savedScholarshipIds.includes(scholarship.id);

  // Check which documents user already has in Document Vault
  const userDocTypes = new Set(documents.map((d) => d.type.toLowerCase().trim()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-scholarship-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedScholarshipId(null);
      }}
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-blue-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white p-6 relative">
          <button
            onClick={() => setSelectedScholarshipId(null)}
            className="absolute top-5 right-5 text-blue-200 hover:text-white p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close Truth Card"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {scholarship.provider}
            </span>
            <span className="text-blue-300">·</span>
            <span className="text-xs text-blue-100 font-medium">{scholarship.category}</span>
            <span className="text-blue-300">·</span>

            {/* Verification Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                scholarship.verificationStatus === 'Official Source Verified'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : scholarship.verificationStatus === 'Demo Information'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'bg-white/10 text-blue-100 border border-white/20'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{scholarship.verificationStatus}</span>
            </span>
          </div>

          <h2 id="modal-scholarship-title" className="text-2xl font-bold font-['Space_Grotesk'] text-white leading-tight">
            {scholarship.name}
          </h2>

          {/* Quick Metrics Bar in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/15">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200">Award Amount</span>
              <p className="text-lg font-extrabold text-cyan-200 font-['Space_Grotesk'] mt-0.5">
                {scholarship.amountFormatted}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200">Application Deadline</span>
              <p className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                {formatDate(scholarship.deadline)} ({formatCountdown(daysRemaining)})
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-blue-200">Your Match Status</span>
              <p className="text-sm font-bold text-white mt-0.5">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    match.status === 'ELIGIBLE'
                      ? 'bg-emerald-500 text-white'
                      : match.status === 'POTENTIALLY ELIGIBLE'
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {match.matchPercentage}% · {match.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Detailed Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Program Description & Scope
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scholarship.longDescription}
            </p>
            {scholarship.quotaOrDisbursals && (
              <p className="text-xs font-semibold text-[#4169E1] mt-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Annual Cohort: {scholarship.quotaOrDisbursals}</span>
              </p>
            )}
          </div>

          {/* Detailed Eligibility Checklist */}
          <div className="p-4 rounded-2xl bg-[#F4F7FF] border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554]">
                Eligibility Truth Table
              </h3>
              <button
                onClick={() => {
                  setSelectedScholarshipId(null);
                  setGapAnalyzerScholarshipId(scholarship.id);
                  setTab('analyzer');
                }}
                className="text-xs font-semibold text-[#4169E1] hover:underline"
              >
                Deep Gap Analysis →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Education Level</span>
                <p className="font-semibold text-[#172554] mt-0.5">{scholarship.eligibleLevels.join(', ')}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Qualifying Degrees</span>
                <p className="font-semibold text-[#172554] mt-0.5">{scholarship.eligibleDegrees.join(', ')}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Academic Cutoff</span>
                <p className="font-semibold text-[#172554] mt-0.5">
                  {scholarship.minPercentage ? `Minimum ${scholarship.minPercentage}% marks` : 'No cutoff'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Family Income Ceiling</span>
                <p className="font-semibold text-[#172554] mt-0.5">
                  {scholarship.maxFamilyIncome ? `Below ${formatINR(scholarship.maxFamilyIncome)}/yr` : 'Open to all'}
                </p>
              </div>
            </div>
          </div>

          {/* Required Documents & Vault Cross-Check */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Required Documents Checklist
              </h3>
              <span className="text-[11px] text-slate-500">Cross-referenced with your Vault</span>
            </div>

            <div className="space-y-1.5">
              {scholarship.requiredDocuments.map((docName) => {
                const lower = docName.toLowerCase().trim();
                const hasDoc = Array.from(userDocTypes).some(
                  (ud) => ud.includes(lower) || lower.includes(ud) || (lower.includes('income') && ud.includes('income')) || (lower.includes('marksheet') && ud.includes('transcript'))
                );

                return (
                  <div
                    key={docName}
                    className="p-2.5 rounded-xl border border-blue-100 hover:border-blue-200 bg-white flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-medium text-[#172554]">{docName}</span>
                    {hasDoc ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Ready in Vault</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Missing in Vault</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Application Procedure */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Step-by-Step Official Procedure
            </h3>
            <div className="space-y-2">
              {scholarship.applicationSteps.map((s) => (
                <div key={s.step} className="flex gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#EAF1FF] text-[#4169E1] font-bold flex items-center justify-center shrink-0 text-xs border border-blue-200/60">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#172554]">{s.title}</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{s.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combination Restrictions & Stacking Rules */}
          <div className="p-3.5 rounded-2xl bg-[#EAF1FF]/50 border border-blue-200/60 text-xs space-y-1">
            <p className="font-bold text-[#172554] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#4169E1]" />
              <span>Combination & Multi-Award Rules</span>
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {scholarship.combinationRestrictions.stackingNotes}
            </p>
            {scholarship.combinationRestrictions.conflictsWith.length > 0 && (
              <p className="text-red-700 font-semibold text-[11px] pt-1">
                Conflicts with: {scholarship.combinationRestrictions.conflictsWith.join(', ')}
              </p>
            )}
          </div>

          {/* Reality Check: Fine-Print & Compliance Obligations */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554]">
                  Reality Check: Fine-Print & Compliance Obligations
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#4169E1]">
                {scholarship.supportType || 'Direct Bank Transfer (DBT)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Renewal Benchmark</span>
                <span className="font-medium text-slate-800 leading-snug block mt-0.5">
                  {scholarship.renewalConditions || 'One-time disbursed award.'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Norms</span>
                <span className="font-medium text-slate-800 leading-snug block mt-0.5">
                  {scholarship.attendanceRequirement || 'Standard institutional minimum attendance required.'}
                </span>
              </div>
            </div>

            {scholarship.realityCheckNotes && scholarship.realityCheckNotes.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Mandatory Fine-Print Clauses:
                </span>
                <ul className="space-y-1">
                  {scholarship.realityCheckNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <span className="text-[#4169E1] font-bold shrink-0">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Verification Source Metadata */}
          <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-100">
            <span>Last verified on official registry: {formatDate(scholarship.lastVerifiedDate)}</span>
            <a
              href={scholarship.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4169E1] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Official Regulatory Guidelines</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#F4F7FF] border-t border-blue-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-[#4169E1] border-[#4169E1] text-white shadow-xs'
                  : 'border-blue-200 text-slate-700 hover:bg-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved to Radar' : 'Save Opportunity'}</span>
            </button>

            <button
              onClick={() => {
                updateApplicationStage(scholarship.id, 'PREPARE');
                setSelectedScholarshipId(null);
                setTab('journey');
              }}
              className="py-2 px-3 text-xs font-semibold rounded-xl border border-blue-200 text-slate-700 hover:bg-white flex items-center gap-1.5 transition-colors"
            >
              <Milestone className="w-3.5 h-3.5 text-[#4169E1]" />
              <span>Track in Journey</span>
            </button>
          </div>

          <a
            href={scholarship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:from-[#3557c7] hover:to-[#6553c7] text-white flex items-center gap-2 shadow-sm shadow-[#4169E1]/25 transition-all"
          >
            <span>Visit Official Application Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
