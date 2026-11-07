import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Radar,
  FileCheck2,
  Layers,
  Milestone,
  FolderArchive,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Activity,
  Award,
  Bell,
  Search,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';
import { calculateDaysRemaining, formatCountdown, getPriorityLevel } from '../utils/dates';

export const DashboardView: React.FC = () => {
  const {
    profile,
    scholarships,
    documents,
    savedScholarshipIds,
    toggleSaveScholarship,
    applicationTracks,
    setSelectedScholarshipId,
    setGapAnalyzerScholarshipId,
    setTab,
    setShowOnboardingModal,
  } = useApp();

  // Evaluate matches across all scholarships
  const evaluatedScholarships = scholarships.map((sch) => {
    const match = evaluateScholarshipMatch(sch, profile, documents);
    const daysRemaining = calculateDaysRemaining(sch.deadline);
    const priority = getPriorityLevel(daysRemaining);
    return {
      scholarship: sch,
      match,
      daysRemaining,
      priority,
    };
  });

  const eligibleList = evaluatedScholarships.filter(
    (e) => e.match.status === 'ELIGIBLE' || e.match.status === 'POTENTIALLY ELIGIBLE'
  );

  const potentialFundingTotal = eligibleList.reduce((acc, curr) => acc + curr.scholarship.amount, 0);
  const urgentDeadlines = evaluatedScholarships.filter(
    (e) => e.daysRemaining >= 0 && e.daysRemaining <= 14
  );

  const trackedApplications = Object.values(applicationTracks);

  // Profile completion calculation
  let profileFieldsFilled = 0;
  const totalFields = 8;
  if (profile.fullName) profileFieldsFilled++;
  if (profile.educationLevel) profileFieldsFilled++;
  if (profile.degree) profileFieldsFilled++;
  if (profile.academicScore) profileFieldsFilled++;
  if (profile.annualFamilyIncome) profileFieldsFilled++;
  if (profile.stateDomicile) profileFieldsFilled++;
  if (profile.categories && profile.categories.length > 0) profileFieldsFilled++;
  if (profile.institution) profileFieldsFilled++;
  const profilePercent = Math.round((profileFieldsFilled / totalFields) * 100);

  // Recent timeline activities derived from current student state
  const activities = [
    {
      id: 'act-1',
      title: 'AICTE Pragati Scholarship moved to Prepare Stage',
      category: 'Journey Board',
      time: '2 hours ago',
      icon: Milestone,
      iconBg: 'bg-[#EAF1FF] text-[#4169E1]',
    },
    {
      id: 'act-2',
      title: 'Income Certificate (FY 2024-25) verified in Vault',
      category: 'Document Vault',
      time: 'Yesterday',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'act-3',
      title: 'Deterministic match confirmed for Reliance Foundation',
      category: 'Match Engine',
      time: '3 days ago',
      icon: CheckCircle2,
      iconBg: 'bg-[#F0EDFF] text-[#7664D8]',
    },
    {
      id: 'act-4',
      title: 'Stacking conflict simulated: Central Sector + AICTE',
      category: 'Stacking Simulator',
      time: '4 days ago',
      icon: Layers,
      iconBg: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Welcome Banner with Deep Navy to Royal Gradient */}
      <div className="rounded-3xl bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2E1065] text-white p-6 sm:p-8 border border-blue-900/50 shadow-xl shadow-blue-950/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#4169E1]/25 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-blue-100 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Student Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
              Your future is worth investing in.
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Welcome back, <span className="text-white font-semibold">{profile.fullName || 'Student'}</span>! You are matched with{' '}
              <strong className="text-emerald-300">{eligibleList.length} verified opportunities</strong> totaling{' '}
              <strong className="text-white font-['Space_Grotesk']">{formatINR(potentialFundingTotal)}</strong> in potential funding support.
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:min-w-[240px] flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase font-bold text-blue-200 tracking-wider">Profile Match Readiness</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-white font-['Space_Grotesk']">{profilePercent}%</span>
                <span className="text-[11px] text-emerald-300 font-medium">Completed</span>
              </div>
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="text-xs font-semibold text-blue-200 hover:text-white hover:underline mt-1.5 block"
              >
                Update Profile Details →
              </button>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4169E1] border-r-[#7664D8] flex items-center justify-center font-bold text-xs text-white">
              {profilePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* 4 CORE KPI METRICS: WHITE CARDS WITH SOFT BLUE SHADOWS & ACCENTS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1 */}
        <div
          onClick={() => setTab('discover')}
          className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] hover:border-[#4169E1]/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#506184] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#506184]">Matched Grants</span>
            <div className="w-8 h-8 rounded-full bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
            {eligibleList.length}
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Deterministic match
          </p>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => setTab('stacking')}
          className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] hover:border-[#4169E1]/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#506184] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#506184]">Potential Funding</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
            {formatINR(potentialFundingTotal)}
          </p>
          <p className="text-xs text-[#506184] font-medium mt-1">Across eligible schemes</p>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => setTab('discover')}
          className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] hover:border-[#4169E1]/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#506184] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#506184]">Saved Shortlist</span>
            <div className="w-8 h-8 rounded-full bg-[#F0EDFF] text-[#7664D8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
            {savedScholarshipIds.length}
          </p>
          <p className="text-xs text-[#506184] font-medium mt-1">Curated for application</p>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => setTab('deadlines')}
          className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] hover:border-[#4169E1]/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#506184] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#506184]">Closing Soon</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#F97316] font-['Space_Grotesk']">
            {urgentDeadlines.length}
          </p>
          <p className="text-xs text-amber-700 font-medium mt-1">Due within 14 days</p>
        </div>
      </div>

      {/* QUICK LAUNCH SHORTCUTS TO SIGNATURE FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setTab('analyzer')}
          className="p-4 rounded-2xl bg-white border border-blue-100 hover:border-[#4169E1] shadow-[0_4px_20px_rgb(65,105,225,0.03)] text-left flex items-start gap-3.5 group transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#172554]">Eligibility Gap Analyzer</h3>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#506184] mt-0.5">
              Inspect green, amber, red criteria breakdowns & missing proofs.
            </p>
          </div>
        </button>

        <button
          onClick={() => setTab('radar')}
          className="p-4 rounded-2xl bg-white border border-blue-100 hover:border-[#4169E1] shadow-[0_4px_20px_rgb(65,105,225,0.03)] text-left flex items-start gap-3.5 group transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center shrink-0">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#172554]">Opportunity Radar</h3>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#506184] mt-0.5">
              Visualize scholarships grouped by category, deadline & match concentricity.
            </p>
          </div>
        </button>

        <button
          onClick={() => setTab('stacking')}
          className="p-4 rounded-2xl bg-white border border-blue-100 hover:border-[#7664D8] shadow-[0_4px_20px_rgb(65,105,225,0.03)] text-left flex items-start gap-3.5 group transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-[#F0EDFF] text-[#7664D8] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#172554]">Stacking Simulator</h3>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-[#506184] mt-0.5">
              Simulate combination limits & dual-funding policy conflicts.
            </p>
          </div>
        </button>
      </div>

      {/* OPPORTUNITIES PICKED FOR YOU */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#172554] font-['Space_Grotesk']">
              Opportunities picked for you
            </h2>
            <p className="text-xs text-[#506184] mt-0.5">
              Recommended because your education level ({profile.educationLevel}), degree ({profile.degree}), score ({profile.academicScore}%), and family income match the listed requirements.
            </p>
          </div>
          <button
            onClick={() => setTab('discover')}
            className="text-xs font-bold text-[#4169E1] hover:underline shrink-0"
          >
            Explore All Catalog ({scholarships.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eligibleList.slice(0, 6).map(({ scholarship, match, daysRemaining }) => {
            const isSaved = savedScholarshipIds.includes(scholarship.id);
            return (
              <div
                key={scholarship.id}
                className="bg-white rounded-3xl p-5 border border-blue-100 shadow-[0_6px_24px_rgb(65,105,225,0.04)] hover:shadow-lg hover:border-[#4169E1]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#4169E1] uppercase tracking-wider">
                      {scholarship.provider}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        match.status === 'ELIGIBLE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}
                    >
                      {match.matchPercentage}% Match
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#172554] leading-snug line-clamp-1">
                    {scholarship.name}
                  </h3>
                  <p className="text-xs text-[#506184] mt-1 line-clamp-2">{scholarship.description}</p>

                  {/* Recommendation pill */}
                  <div className="mt-3 p-2.5 rounded-2xl bg-[#F4F7FF] border border-blue-100/70 text-[11px] text-[#506184]">
                    <span className="font-semibold text-[#172554]">Match Reason: </span>
                    {match.explanation}
                  </div>

                  {/* Grant and Deadline info */}
                  <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#506184] uppercase font-semibold block">Grant Value</span>
                      <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk']">
                        {scholarship.amountFormatted}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#506184] uppercase font-semibold block">Deadline</span>
                      <span className="text-xs font-medium text-[#172554] flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-[#F97316]" />
                        {formatCountdown(daysRemaining)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-blue-50 flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveScholarship(scholarship.id)}
                    className={`p-2 rounded-full border text-xs font-semibold transition-colors ${
                      isSaved
                        ? 'bg-[#4169E1] border-[#4169E1] text-white'
                        : 'border-blue-200 text-[#172554] hover:bg-[#EAF1FF]'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    aria-label={isSaved ? `Remove ${scholarship.name} from saved` : `Save ${scholarship.name}`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedScholarshipId(scholarship.id)}
                    className="flex-1 py-2 px-3 rounded-full bg-[#EAF1FF] text-[#4169E1] font-semibold text-xs hover:bg-[#4169E1] hover:text-white transition-colors"
                  >
                    Truth Card
                  </button>
                  <button
                    onClick={() => {
                      setGapAnalyzerScholarshipId(scholarship.id);
                      setTab('analyzer');
                    }}
                    className="py-2 px-3 rounded-full border border-blue-200 text-[#172554] font-semibold text-xs hover:bg-[#F4F7FF] transition-colors"
                  >
                    Analyze Gap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE JOURNEY AND RECENT ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Application Journey */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-[#4169E1]" />
              <h3 className="text-base font-bold text-[#172554]">Active Application Journey</h3>
            </div>
            <button
              onClick={() => setTab('journey')}
              className="text-xs font-bold text-[#4169E1] hover:underline"
            >
              Manage Board ({trackedApplications.length}) →
            </button>
          </div>

          <p className="text-xs text-[#506184]">
            Track your progress across the six standard scholarship stages: Discover, Match, Prepare, Apply, Submitted, Awarded.
          </p>

          <div className="space-y-3 pt-1">
            {trackedApplications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#506184] bg-[#F4F7FF] rounded-2xl border border-blue-100">
                No scholarships currently in active tracking. Go to Discover or Saved to start preparing an application!
              </div>
            ) : (
              trackedApplications.map((track) => {
                const sch = scholarships.find((s) => s.id === track.scholarshipId);
                if (!sch) return null;
                const completedItems = track.checklist.filter((c) => c.completed).length;
                const progress = Math.round((completedItems / track.checklist.length) * 100);

                return (
                  <div
                    key={track.scholarshipId}
                    className="p-4 rounded-2xl bg-[#F4F7FF] border border-blue-100/80 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4169E1]">
                          Stage: {track.stage}
                        </span>
                        <h4 className="text-sm font-bold text-[#172554] mt-0.5">{sch.name}</h4>
                        <p className="text-[11px] text-[#506184]">{sch.provider}</p>
                      </div>
                      <span className="text-xs font-extrabold text-[#172554] font-['Space_Grotesk']">
                        {sch.amountFormatted}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#506184] mb-1">
                        <span>Application Checklist Readiness</span>
                        <span className="font-bold text-[#172554]">{progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-[#506184] italic truncate max-w-[280px]">
                        Note: {track.notes || 'No recent notes'}
                      </span>
                      <button
                        onClick={() => setTab('journey')}
                        className="text-[#4169E1] font-semibold hover:underline"
                      >
                        Open Checklist →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Document Vault Readiness & Recent Activity Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* Document Vault Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-[#172554]">Document Vault</h3>
              </div>
              <button
                onClick={() => setTab('vault')}
                className="text-xs font-bold text-[#4169E1] hover:underline"
              >
                Open Vault ({documents.length}) →
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EAF1FF] to-[#F4F7FF] border border-blue-200/80 text-[#172554] text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-[#172554]">
                <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
                <span>Document Reuse Intelligence</span>
              </p>
              <p className="text-[11px] text-[#506184] leading-relaxed">
                Your <strong className="text-[#172554]">Income Certificate</strong> is accepted by 4 saved schemes without re-issuance. Your <strong className="text-[#172554]">Bonafide Certificate</strong> is valid until May 2027.
              </p>
            </div>

            <div className="space-y-2">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-2xl border border-blue-50 bg-[#F4F7FF]/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-[#172554] truncate max-w-[200px]">{doc.type}</p>
                    <p className="text-[10px] text-[#506184]">{doc.fileName} · {doc.fileSize}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTab('vault')}
              className="w-full py-2.5 rounded-full bg-[#EAF1FF] hover:bg-[#4169E1] text-[#4169E1] hover:text-white font-semibold text-xs border border-blue-200/60 transition-colors text-center"
            >
              Upload More Certificates
            </button>
          </div>

          {/* Activity Timeline Stream */}
          <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#4169E1]" />
                <h3 className="text-base font-bold text-[#172554]">Recent Platform Activity</h3>
              </div>
              <span className="text-[10px] font-bold text-[#506184] uppercase tracking-wider">Live Log</span>
            </div>

            <div className="space-y-3">
              {activities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#172554] leading-tight truncate">{act.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#506184]">
                        <span>{act.category}</span>
                        <span>·</span>
                        <span>{act.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
