import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Milestone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Bookmark,
  FileCheck2,
  Check,
  ChevronRight,
  Sparkles,
  FolderArchive,
  AlertCircle,
} from 'lucide-react';
import { JourneyStage, Scholarship } from '../types/scholarship';
import { formatINR } from '../utils/matching';
import { calculateDaysRemaining, formatCountdown, getPriorityLevel, formatDate } from '../utils/dates';

const ALL_STAGES: JourneyStage[] = ['DISCOVER', 'MATCH', 'PREPARE', 'APPLY', 'SUBMITTED', 'AWARDED'];

export const ScholarshipJourneyView: React.FC = () => {
  const {
    scholarships,
    applicationTracks,
    documents,
    updateApplicationStage,
    updateApplicationChecklist,
    updateApplicationNotes,
    setSelectedScholarshipId,
    setTab,
  } = useApp();

  const [activeStageFilter, setActiveStageFilter] = useState<'ALL' | JourneyStage>('ALL');

  // Collect all tracked scholarships with memoization
  const trackedList = useMemo(() => {
    return Object.values(applicationTracks)
      .map((track) => {
        const sch = scholarships.find((s) => s.id === track.scholarshipId);
        return { track, sch };
      })
      .filter((item): item is { track: typeof item.track; sch: Scholarship } => Boolean(item.sch));
  }, [applicationTracks, scholarships]);

  const filteredTracks = useMemo(() => {
    return activeStageFilter === 'ALL'
      ? trackedList
      : trackedList.filter((item) => item.track.stage === activeStageFilter);
  }, [activeStageFilter, trackedList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold mb-2 border border-blue-200/60 shadow-xs">
            <Milestone className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Structured 6-Stage Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] tracking-tight">
            Scholarship Application Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track your ongoing applications stage-by-stage from initial discovery to final grant award disbursal.
          </p>
        </div>

        <button
          onClick={() => setTab('discover')}
          className="self-start md:self-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:from-[#3557c7] hover:to-[#6553c7] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-[#4169E1]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity to Journey</span>
        </button>
      </div>

      {/* 6 STAGES STEPPER PIPELINE VISUAL */}
      <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] overflow-x-auto">
        <div className="min-w-[650px] grid grid-cols-6 gap-2">
          {ALL_STAGES.map((st, i) => {
            const countInStage = trackedList.filter((item) => item.track.stage === st).length;
            const isFilterActive = activeStageFilter === st;

            return (
              <button
                key={st}
                onClick={() => setActiveStageFilter(activeStageFilter === st ? 'ALL' : st)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isFilterActive
                    ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] shadow-xs'
                    : 'border-blue-50 hover:border-blue-200 bg-[#F4F7FF]/50 hover:bg-[#F4F7FF]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>0{i + 1}</span>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-black ${
                    isFilterActive ? 'bg-[#4169E1] text-white border-[#4169E1]' : 'bg-white border-blue-100 text-slate-800'
                  }`}>
                    {countInStage}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-[#172554] mt-2 font-['Space_Grotesk']">
                  {st}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {st === 'DISCOVER'
                    ? 'Catalog found'
                    : st === 'MATCH'
                    ? 'Criteria evaluated'
                    : st === 'PREPARE'
                    ? 'Dossier ready'
                    : st === 'APPLY'
                    ? 'In-progress'
                    : st === 'SUBMITTED'
                    ? 'Under verification'
                    : 'Funding received'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE TRACKED SCHOLARSHIPS CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredTracks.length}</strong> active tracked opportunity(s)
          </span>
          {activeStageFilter !== 'ALL' && (
            <button
              onClick={() => setActiveStageFilter('ALL')}
              className="text-[#4169E1] font-semibold hover:underline"
            >
              Show all stages
            </button>
          )}
        </div>

        {filteredTracks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center mx-auto">
              <Milestone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172554]">No scholarships in this stage</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Move opportunities through stages or browse the discovery catalog to add more.
            </p>
            <button
              onClick={() => setTab('discover')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all"
            >
              Browse Discovery Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTracks.map(({ track, sch }) => {
              const completedCount = track.checklist.filter((c) => c.completed).length;
              const percent = Math.round((completedCount / (track.checklist.length || 1)) * 100);

              const daysRemaining = calculateDaysRemaining(sch.deadline);
              const countdownLabel = formatCountdown(daysRemaining);
              const priority = getPriorityLevel(daysRemaining);

              const requiredDocs = sch.requiredDocuments || [];
              const verifiedDocsCount = requiredDocs.filter((req) => {
                const lower = req.toLowerCase().trim();
                return documents.some((d) => {
                  const dLower = d.type.toLowerCase().trim();
                  return (
                    dLower.includes(lower) ||
                    lower.includes(dLower) ||
                    (dLower.includes('income') && lower.includes('income')) ||
                    (dLower.includes('transcript') && lower.includes('marksheet'))
                  );
                });
              }).length;
              const totalDocs = requiredDocs.length;
              const isVaultReady = totalDocs > 0 && verifiedDocsCount === totalDocs;

              return (
                <div
                  key={track.scholarshipId}
                  className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-5 flex flex-col justify-between hover:border-blue-200 transition-all"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#4169E1] uppercase tracking-wider">
                          {sch.provider}
                        </span>
                        <h3 className="text-base font-bold text-[#172554] leading-snug mt-0.5">
                          {sch.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              priority === 'HIGH'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : priority === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : priority === 'EXPIRED'
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{countdownLabel}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Closes: <strong>{formatDate(sch.deadline)}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk'] shrink-0">
                        {sch.amountFormatted}
                      </span>
                    </div>

                    {/* Document Vault Readiness Badge */}
                    <div className="p-3 rounded-2xl bg-[#F4F7FF] border border-blue-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FolderArchive className="w-4 h-4 text-[#4169E1] shrink-0" />
                        <div>
                          <span className="font-bold text-[#172554]">Vault Dossier: </span>
                          <span className={isVaultReady ? 'text-emerald-700 font-bold' : 'text-[#4169E1] font-bold'}>
                            {verifiedDocsCount}/{totalDocs} Documents Verified
                          </span>
                        </div>
                      </div>
                      {!isVaultReady && (
                        <button
                          onClick={() => setTab('vault')}
                          className="text-[11px] font-bold text-[#4169E1] hover:underline shrink-0"
                        >
                          Upload Missing →
                        </button>
                      )}
                    </div>

                    {/* Stage Selector */}
                    <div>
                      <label
                        htmlFor={`journey-stage-${track.scholarshipId}`}
                        className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                      >
                        Current Application Stage
                      </label>
                      <select
                        id={`journey-stage-${track.scholarshipId}`}
                        value={track.stage}
                        onChange={(e) =>
                          updateApplicationStage(track.scholarshipId, e.target.value as JourneyStage)
                        }
                        className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-[#F4F7FF] text-[#172554]"
                      >
                        {ALL_STAGES.map((s) => (
                          <option key={s} value={s}>
                            Stage: {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Application Checklist */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span className="font-bold text-[#172554]">Required Dossier Milestones</span>
                        <span className="font-semibold text-slate-500">{percent}% Complete</span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-[#EAF1FF] overflow-hidden mb-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="space-y-1.5">
                        {track.checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              updateApplicationChecklist(track.scholarshipId, item.id, !item.completed)
                            }
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                              item.completed
                                ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-500'
                                : 'bg-white border-blue-100 hover:border-blue-200 text-slate-800'
                            }`}
                          >
                            <span className={item.completed ? 'line-through text-slate-400' : 'font-medium'}>
                              {item.label}
                            </span>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                item.completed
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-blue-200 bg-white'
                              }`}
                            >
                              {item.completed && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Application Notes & Tracking Reference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Application ID #NSP84920, College attestation done"
                        value={track.notes || ''}
                        onChange={(e) => updateApplicationNotes(track.scholarshipId, e.target.value)}
                        className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedScholarshipId(sch.id)}
                      className="text-xs font-semibold text-[#4169E1] hover:underline"
                    >
                      View Truth Card →
                    </button>
                    <a
                      href={sch.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 text-xs font-bold rounded-lg bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white hover:opacity-95 transition-all shadow-xs"
                    >
                      Open Official Portal
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
