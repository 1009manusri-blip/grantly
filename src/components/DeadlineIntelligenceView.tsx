import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar as CalendarIcon,
  List,
  Sparkles,
  ChevronRight,
  Bookmark,
  Check,
} from 'lucide-react';
import { calculateDaysRemaining, formatCountdown, formatDate, getPriorityLevel } from '../utils/dates';
import { evaluateScholarshipMatch } from '../utils/matching';

export const DeadlineIntelligenceView: React.FC = () => {
  const {
    scholarships,
    profile,
    documents,
    savedScholarshipIds,
    setSelectedScholarshipId,
    setGapAnalyzerScholarshipId,
    setTab,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'saved' | 'closed'>('all');

  // Daily action items state
  const [actionItems, setActionItems] = useState([
    { id: 'a1', label: 'Order Bonafide Certificate from College Registrar', done: true, due: 'Today' },
    { id: 'a2', label: 'Submit Class 12th Board marks for e-attestation', done: true, due: 'Today' },
    { id: 'a3', label: 'Draft 500-word statement of purpose for Reliance / Google grant', done: false, due: 'Tomorrow' },
    { id: 'a4', label: 'Verify Aadhaar-seeding with bank branch manager for DBT', done: false, due: 'In 3 days' },
  ]);

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // Compute deadline intelligence
  const allDeadlines = scholarships.map((sch) => {
    const days = calculateDaysRemaining(sch.deadline);
    const priority = getPriorityLevel(days);
    const match = evaluateScholarshipMatch(sch, profile, documents);
    const isSaved = savedScholarshipIds.includes(sch.id);
    return { sch, days, priority, match, isSaved };
  });

  const urgentCount = allDeadlines.filter((d) => d.priority === 'HIGH').length;
  const closedCount = allDeadlines.filter((d) => d.priority === 'EXPIRED').length;

  const deadlineList = allDeadlines
    .filter((item) => {
      if (activeFilter === 'high') return item.priority === 'HIGH';
      if (activeFilter === 'saved') return item.isSaved;
      if (activeFilter === 'closed') return item.priority === 'EXPIRED';
      return true;
    })
    .sort((a, b) => a.days - b.days);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold mb-2 border border-blue-200/60 shadow-xs">
            <CalendarClock className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Time-Sensitive Execution Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] tracking-tight">
            Deadline Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dynamic calendar and daily actionable milestones to guarantee zero missed submissions.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-blue-100 rounded-xl shadow-xs self-start md:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#172554] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#172554] hover:bg-[#F4F7FF]'
            }`}
          >
            All Deadlines ({scholarships.length})
          </button>
          <button
            onClick={() => setActiveFilter('high')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'high'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
            }`}
          >
            Urgent High Priority ({urgentCount})
          </button>
          <button
            onClick={() => setActiveFilter('saved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'saved'
                ? 'bg-[#4169E1] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#4169E1] hover:bg-[#EAF1FF]'
            }`}
          >
            My Saved ({savedScholarshipIds.length})
          </button>
          <button
            onClick={() => setActiveFilter('closed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'closed'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Closed / Past ({closedCount})
          </button>
        </div>
      </div>

      {/* DAILY ACTION PLAN & URGENCY BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Action Plan */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172554]">Daily Application Action Plan</h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
              {actionItems.filter((a) => a.done).length} / {actionItems.length} Done
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Recommended daily task checklist to stay ahead of government server traffic jams.
          </p>

          <div className="space-y-2 pt-1">
            {actionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleActionItem(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                  item.done
                    ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-500'
                    : 'bg-white border-blue-100 hover:border-blue-300 hover:bg-[#F4F7FF]/50 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      item.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-blue-200 bg-white'
                    }`}
                  >
                    {item.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={item.done ? 'line-through text-slate-400' : 'font-medium text-[#172554]'}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 shrink-0">{item.due}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172554]">
              Upcoming Scholarship Submission Windows ({deadlineList.length})
            </h3>
            <span className="text-xs text-slate-500">Sorted by closing date</span>
          </div>

          <div className="space-y-3">
            {deadlineList.map(({ sch, days, priority, match, isSaved }) => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl border border-blue-100 hover:border-blue-200 hover:bg-[#F4F7FF]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#4169E1]">{sch.provider}</span>
                    <span>·</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        priority === 'EXPIRED'
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : priority === 'HIGH'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {priority === 'EXPIRED' ? 'Closed' : `${priority} Priority`}
                    </span>
                    {isSaved && (
                      <span className="text-[10px] font-bold text-[#4169E1] bg-[#EAF1FF] px-2 py-0.5 rounded-full border border-blue-200/50">
                        Saved
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[#172554]">{sch.name}</h4>
                  <p className="text-xs text-slate-500">
                    Official Closing: <strong>{formatDate(sch.deadline)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk'] block">
                      {sch.amountFormatted}
                    </span>
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {formatCountdown(days)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedScholarshipId(sch.id)}
                    className="py-2 px-3.5 text-xs font-semibold rounded-xl bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-all shadow-2xs"
                  >
                    Truth Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
