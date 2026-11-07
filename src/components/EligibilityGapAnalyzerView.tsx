import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderArchive,
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';

export const EligibilityGapAnalyzerView: React.FC = () => {
  const {
    scholarships,
    profile,
    documents,
    gapAnalyzerScholarshipId,
    setGapAnalyzerScholarshipId,
    setSelectedScholarshipId,
    setShowOnboardingModal,
    setTab,
  } = useApp();

  // Active selected scholarship for deep inspection
  const selectedId = gapAnalyzerScholarshipId || scholarships[0]?.id;
  const currentScholarship = useMemo(() => {
    return scholarships.find((s) => s.id === selectedId) || scholarships[0];
  }, [scholarships, selectedId]);

  const match = useMemo(() => {
    return evaluateScholarshipMatch(currentScholarship, profile, documents);
  }, [currentScholarship, profile, documents]);

  // Separate criteria into satisfied, not satisfied, and missing
  const satisfiedCriteria = useMemo(() => {
    return match.criteriaBreakdown.filter((c) => c.status === 'satisfied');
  }, [match]);

  const notSatisfiedCriteria = useMemo(() => {
    return match.criteriaBreakdown.filter((c) => c.status === 'not_satisfied');
  }, [match]);

  const missingCriteria = useMemo(() => {
    return match.criteriaBreakdown.filter((c) => c.status === 'missing_info');
  }, [match]);

  // Cross-scheme unlock leverage calculation:
  // For each missing document, find other scholarships needing it and total value
  const crossSchemeDocumentImpact = useMemo(() => {
    return match.missingDocuments.map((docName) => {
      const lower = docName.toLowerCase().trim();
      const otherNeeding = scholarships.filter((s) =>
        s.id !== currentScholarship.id &&
        s.requiredDocuments.some((req) => {
          const r = req.toLowerCase().trim();
          return (
            r.includes(lower) ||
            lower.includes(r) ||
            (lower.includes('income') && r.includes('income')) ||
            (lower.includes('transcript') && r.includes('marksheet'))
          );
        })
      );
      const totalUnlockedValue = otherNeeding.reduce((sum, s) => sum + s.amount, 0);
      return {
        docName,
        otherCount: otherNeeding.length,
        totalUnlockedValue,
        schemes: otherNeeding.slice(0, 2).map((s) => s.name),
      };
    });
  }, [match.missingDocuments, scholarships, currentScholarship.id]);

  // Total cross-scheme value unlockable
  const totalCrossSchemeValue = useMemo(() => {
    const uniqueScholarshipIds = new Set<string>();
    match.missingDocuments.forEach((docName) => {
      const lower = docName.toLowerCase().trim();
      scholarships.forEach((s) => {
        if (s.id !== currentScholarship.id) {
          const matches = s.requiredDocuments.some((req) => {
            const r = req.toLowerCase().trim();
            return (
              r.includes(lower) ||
              lower.includes(r) ||
              (lower.includes('income') && r.includes('income')) ||
              (lower.includes('transcript') && r.includes('marksheet'))
            );
          });
          if (matches) uniqueScholarshipIds.add(s.id);
        }
      });
    });
    return scholarships
      .filter((s) => uniqueScholarshipIds.has(s.id))
      .reduce((sum, s) => sum + s.amount, 0);
  }, [match.missingDocuments, scholarships, currentScholarship.id]);

  // Alternative recommendations if not eligible
  const alternatives = useMemo(() => {
    return scholarships
      .filter((s) => s.id !== currentScholarship.id)
      .map((s) => ({ s, m: evaluateScholarshipMatch(s, profile, documents) }))
      .filter((item) => item.m.status === 'ELIGIBLE' || item.m.status === 'POTENTIALLY ELIGIBLE')
      .slice(0, 3);
  }, [scholarships, currentScholarship.id, profile, documents]);


  // Mode toggle: Deep Diagnostic vs Catalogue-wide Almost Eligible Scanner
  const [viewMode, setViewMode] = useState<'diagnostic' | 'almost_eligible'>('diagnostic');

  // Almost Eligible Opportunities scanner across catalog
  const almostEligibleList = useMemo(() => {
    return scholarships
      .map((s) => {
        const m = evaluateScholarshipMatch(s, profile, documents);
        if (m.status === 'ELIGIBLE') return null; // already fully eligible

        const academicGap = (s.minPercentage || 0) - (profile.academicPercentage || 0);
        const isCloseAcademic = academicGap > 0 && academicGap <= 5;

        const incomeGap = (profile.familyIncome || 0) - (s.maxFamilyIncome || 0);
        const isCloseIncome = incomeGap > 0 && incomeGap <= 100000;

        const userDocTypes = documents.map((d) => d.type.toLowerCase());
        const missingDocs = s.requiredDocuments.filter(
          (req) => !userDocTypes.some((ud) => ud.includes(req.toLowerCase()) || req.toLowerCase().includes(ud))
        );
        const isSingleDoc = missingDocs.length === 1 && m.criteriaBreakdown.filter((c) => c.category !== 'Document').every((c) => c.status === 'satisfied');

        if (isCloseAcademic || isCloseIncome || isSingleDoc || m.matchPercentage >= 65) {
          return {
            scholarship: s,
            match: m,
            academicGap: isCloseAcademic ? academicGap : null,
            incomeGap: isCloseIncome ? incomeGap : null,
            isSingleDoc,
            missingDocName: isSingleDoc ? missingDocs[0] : null,
            missingDocsCount: missingDocs.length,
          };
        }
        return null;
      })
      .filter(Boolean) as {
        scholarship: typeof scholarships[0];
        match: ReturnType<typeof evaluateScholarshipMatch>;
        academicGap: number | null;
        incomeGap: number | null;
        isSingleDoc: boolean;
        missingDocName: string | null;
        missingDocsCount: number;
      }[];
  }, [scholarships, profile, documents]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold mb-1 border border-blue-200/60">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Signature Intelligence Feature</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
            Eligibility Gap Analyzer & Scanner
          </h1>
          <p className="text-xs sm:text-sm text-[#506184] mt-1">
            Deterministic rule breakdown showing satisfied requirements, cutoff gaps, and actionable steps to unlock funding.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-2 bg-[#EAF1FF]/70 p-1 rounded-2xl border border-blue-200/80">
          <button
            type="button"
            onClick={() => setViewMode('diagnostic')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              viewMode === 'diagnostic'
                ? 'bg-[#4169E1] text-white shadow-xs'
                : 'text-[#172554] hover:bg-white/60'
            }`}
          >
            Deep Diagnostic
          </button>
          <button
            type="button"
            onClick={() => setViewMode('almost_eligible')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              viewMode === 'almost_eligible'
                ? 'bg-[#4169E1] text-white shadow-xs'
                : 'text-[#172554] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Almost Eligible ({almostEligibleList.length})</span>
          </button>
        </div>
      </div>

      {viewMode === 'almost_eligible' ? (
        /* ALMOST ELIGIBLE CATALOGUE SCANNER VIEW */
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-purple-500/10 border border-amber-200/70 rounded-3xl p-6 sm:p-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>CUTOFF DELTA SCANNER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172554]">
              Scholarships Just Out of Reach ({almostEligibleList.length} Opportunities Detected)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              You are within a 5% academic cutoff, ₹1 Lakh family income ceiling, or 1 missing document from qualifying for these high-value scholarships. Review exact deltas, simulate in the What-If Sandbox, or upload missing certificates to qualify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {almostEligibleList.map(({ scholarship: s, match: m, academicGap, incomeGap, isSingleDoc, missingDocName }) => (
              <div
                key={s.id}
                className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-[#4169E1] uppercase tracking-wider">
                        {s.provider}
                      </span>
                      <h3 className="text-base font-bold text-[#172554] leading-snug mt-0.5">
                        {s.name}
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 shrink-0">
                      {m.matchPercentage}% Fit
                    </span>
                  </div>

                  <div className="font-extrabold text-lg text-[#172554] font-['Space_Grotesk']">
                    {s.amountFormatted}
                  </div>

                  {/* Specific Delta Badges */}
                  <div className="space-y-2 pt-1">
                    {academicGap !== null && (
                      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-900">
                          Academic Cutoff Gap:
                        </span>
                        <span className="font-extrabold text-amber-800">
                          Only {academicGap.toFixed(1)}% below cutoff ({profile.academicPercentage}% vs required {s.minPercentage}%)
                        </span>
                      </div>
                    )}

                    {incomeGap !== null && (
                      <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs">
                        <span className="font-bold text-[#172554]">
                          Household Income Delta:
                        </span>
                        <span className="font-extrabold text-[#4169E1]">
                          ₹{(incomeGap / 1000).toFixed(0)}k above cutoff
                        </span>
                      </div>
                    )}

                    {isSingleDoc && missingDocName && (
                      <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-2xl flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-900">
                          Single Missing Document:
                        </span>
                        <span className="font-extrabold text-purple-800 line-clamp-1 max-w-[200px]">
                          {missingDocName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setGapAnalyzerScholarshipId(s.id);
                      setViewMode('diagnostic');
                    }}
                    className="py-2.5 px-3 rounded-2xl text-xs font-bold bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition shadow-2xs text-center"
                  >
                    Deep Diagnostic →
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('whatif')}
                    className="py-2.5 px-3 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-center"
                  >
                    What-If Sandbox
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SINGLE SCHOLARSHIP DEEP DIAGNOSTIC VIEW */
        <>
          {/* Scholarship Selector Dropdown */}
          <div className="flex items-center justify-end gap-2">
            <label htmlFor="gap-analyzer-select" className="text-xs font-bold text-[#172554] shrink-0">
              Selected Scheme:
            </label>
            <select
              id="gap-analyzer-select"
              value={selectedId}
              onChange={(e) => setGapAnalyzerScholarshipId(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-2xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554] shadow-xs"
            >
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.amountFormatted})
                </option>
              ))}
            </select>
          </div>

      {/* STRATEGIC ACTION ROADMAP & CROSS-SCHEME LEVERAGE */}
      <div className="bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-400/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Strategic Action Roadmap & Unlocked Value Impact
            </h2>
          </div>
          {totalCrossSchemeValue > 0 && (
            <span className="text-xs font-bold bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-cyan-200 border border-white/20 self-start sm:self-auto">
              Cross-Scheme Leverage: +{formatINR(totalCrossSchemeValue)} Available
            </span>
          )}
        </div>

        <p className="text-xs text-blue-100 leading-relaxed max-w-3xl">
          Actionable pathway to eliminate eligibility gaps for <strong>{currentScholarship.name}</strong>. Resolving verified document requirements and testing threshold milestones also compounds across multiple other schemes simultaneously.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick-Win Document Uploads */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Quick-Win Resolvable Proofs ({match.missingDocuments.length})</span>
              </span>
              <button
                onClick={() => setTab('vault')}
                className="text-[11px] font-bold text-cyan-200 hover:text-white transition-colors"
              >
                Open Vault →
              </button>
            </div>

            {match.missingDocuments.length === 0 ? (
              <p className="text-xs text-blue-100/80 bg-white/5 p-3 rounded-xl">
                All mandatory verification documents are present in your vault! No document blocker for this scholarship.
              </p>
            ) : (
              <div className="space-y-2">
                {crossSchemeDocumentImpact.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{item.docName}</p>
                      <p className="text-[11px] text-blue-200 mt-0.5">
                        {item.otherCount > 0
                          ? `Also unlocks ${item.otherCount} other scheme(s) (+${formatINR(item.totalUnlockedValue)})`
                          : 'Required for this application dossier'}
                      </p>
                    </div>
                    <button
                      onClick={() => setTab('vault')}
                      className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shrink-0 transition-colors shadow-2xs"
                    >
                      Upload Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hard Thresholds & What-If Delta */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Academic & Statutory Threshold Gaps ({notSatisfiedCriteria.length})</span>
              </span>
              <button
                onClick={() => setTab('whatif')}
                className="text-[11px] font-bold text-cyan-200 hover:text-white transition-colors"
              >
                Test in Sandbox →
              </button>
            </div>

            {notSatisfiedCriteria.length === 0 ? (
              <p className="text-xs text-blue-100/80 bg-white/5 p-3 rounded-xl">
                All statutory criteria (academic score, income limits, domicile, reservation) are fully satisfied!
              </p>
            ) : (
              <div className="space-y-2">
                {notSatisfiedCriteria.map((crit, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{crit.name}</p>
                      <p className="text-[11px] text-amber-200 mt-0.5">
                        Required: {crit.requirement} · Profile: {crit.studentValue}
                      </p>
                    </div>
                    <button
                      onClick={() => setTab('whatif')}
                      className="py-1.5 px-3 rounded-lg bg-[#4169E1] hover:bg-blue-600 text-white font-bold text-[11px] shrink-0 transition-colors shadow-2xs"
                    >
                      Simulate Delta
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OVERVIEW PANEL FOR SELECTED SCHOLARSHIP */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-[0_6px_24px_rgb(65,105,225,0.04)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4169E1] mb-1">
              <span>{currentScholarship.provider}</span>
              <span aria-hidden="true">·</span>
              <span>{currentScholarship.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200/60">
                {currentScholarship.verificationStatus}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172554] font-['Space_Grotesk']">
              {currentScholarship.name}
            </h2>
            <p className="text-xs text-[#506184] mt-1 max-w-2xl">{currentScholarship.description}</p>
          </div>

          <div className="flex items-center gap-4 bg-[#F4F7FF] p-4 rounded-2xl border border-blue-100 shrink-0">
            <div>
              <span className="text-[10px] text-[#506184] uppercase font-bold block">Eligibility Score</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
                  {match.matchPercentage}%
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    match.status === 'ELIGIBLE'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      : match.status === 'POTENTIALLY ELIGIBLE'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      : 'bg-red-50 text-red-800 border border-red-200/60'
                  }`}
                >
                  {match.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedScholarshipId(currentScholarship.id)}
              className="py-2 px-3 text-xs font-semibold rounded-full bg-white border border-blue-200 hover:bg-[#EAF1FF] text-[#172554] shadow-xs transition-colors"
            >
              Truth Card
            </button>
          </div>
        </div>

        {/* SUMMARY VERDICT */}
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
            match.status === 'ELIGIBLE'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : match.status === 'POTENTIALLY ELIGIBLE'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-red-50/70 border-red-200 text-red-950'
          }`}
        >
          {match.status === 'ELIGIBLE' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : match.status === 'POTENTIALLY ELIGIBLE' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">Eligibility Diagnostic Summary</p>
            <p className="mt-0.5 text-xs leading-relaxed opacity-90">{match.explanation}</p>
          </div>
        </div>

        {/* 3-COLOR CRITERIA BREAKDOWN */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#172554]">
            Criteria Verification Breakdown
          </h3>

          <div className="space-y-3">
            {match.criteriaBreakdown.map((crit, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  crit.status === 'satisfied'
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : crit.status === 'not_satisfied'
                    ? 'bg-red-50/40 border-red-200/80'
                    : 'bg-amber-50/40 border-amber-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {crit.status === 'satisfied' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {crit.status === 'not_satisfied' && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    {crit.status === 'missing_info' && (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className="text-sm font-bold text-[#172554]">{crit.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        crit.status === 'satisfied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : crit.status === 'not_satisfied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {crit.status === 'satisfied'
                        ? 'Requirement Met'
                        : crit.status === 'not_satisfied'
                        ? 'Not Met'
                        : 'Information Missing'}
                    </span>
                  </div>

                  <div className="text-xs text-[#506184] sm:text-right">
                    <span>Required: </span>
                    <strong className="text-[#172554]">{crit.requirement}</strong>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <p className="text-[#172554] leading-relaxed">
                    <span className="font-semibold text-[#172554]">Analysis: </span>
                    {crit.message}
                  </p>
                  <span className="text-[11px] text-[#506184] shrink-0">
                    Your Profile: <strong className="text-[#172554]">{crit.studentValue}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MISSING DOCUMENTS SECTION */}
        {match.missingDocuments.length > 0 && (
          <div className="p-5 rounded-3xl bg-[#EAF1FF]/60 border border-blue-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4169E1]">
                <FolderArchive className="w-5 h-5" />
                <h3 className="text-sm font-bold text-[#172554]">
                  Missing Documents Required for Application
                </h3>
              </div>
              <button
                onClick={() => setTab('vault')}
                className="text-xs font-semibold text-[#4169E1] hover:underline"
              >
                Go to Document Vault →
              </button>
            </div>

            <p className="text-xs text-[#506184]">
              The following certificates are listed in the official checklist for this scholarship but have not yet been uploaded or verified in your Document Vault:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {match.missingDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white border border-blue-100 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#172554]">{doc}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200/60">
                    Upload Needed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FUTURE REQUIREMENTS UNLOCK NOTE */}
        {match.unlockedFutureRequirements.length > 0 && (
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-blue-950 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-blue-900">
              <TrendingUp className="w-4 h-4 text-[#4169E1]" />
              <span>Future Requirement Unlock Potential</span>
            </p>
            {match.unlockedFutureRequirements.map((req, i) => (
              <p key={i} className="text-blue-900 text-[11px] leading-relaxed">
                {req}
              </p>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="py-2.5 px-4 rounded-full bg-white border border-blue-200 text-[#172554] text-xs font-semibold hover:bg-[#F4F7FF] transition-colors shadow-xs"
          >
            Update Profile Information
          </button>
          <button
            onClick={() => setTab('whatif')}
            className="py-2.5 px-4 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold hover:bg-[#4169E1] hover:text-white transition-colors"
          >
            Test in What-If Sandbox
          </button>
          <button
            onClick={() => setSelectedScholarshipId(currentScholarship.id)}
            className="py-2.5 px-5 rounded-full bg-[#4169E1] text-white text-xs font-semibold hover:bg-[#3252BF] transition-colors shadow-md shadow-[#4169E1]/25"
          >
            View Official Application Steps
          </button>
        </div>
      </div>

      {/* RECOMMENDED ALTERNATIVES IF CURRENT SCHOLARSHIP HAS GAPS */}
      {match.status === 'INELIGIBLE' && alternatives.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#172554] font-['Space_Grotesk']">
            Alternative Scholarships You Qualify For
          </h3>
          <p className="text-xs text-[#506184]">
            While you do not meet the criteria for {currentScholarship.name}, here are high-matching alternative opportunities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternatives.map(({ s, m }) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#4169E1]">{s.provider}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      {m.matchPercentage}% Match
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#172554] leading-snug">{s.name}</h4>
                  <p className="text-xs text-[#506184] mt-1 line-clamp-2">{s.description}</p>
                  <p className="text-sm font-extrabold text-[#172554] mt-3 font-['Space_Grotesk']">
                    {s.amountFormatted}
                  </p>
                </div>
                <button
                  onClick={() => setGapAnalyzerScholarshipId(s.id)}
                  className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-full bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-colors"
                >
                  Analyze This Opportunity →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
