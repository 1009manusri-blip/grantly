import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radar,
  Compass,
  Bookmark,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  Filter,
  List,
  Eye,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';
import { calculateDaysRemaining, formatCountdown, getPriorityLevel } from '../utils/dates';
import { Scholarship, ScholarshipCategory } from '../types/scholarship';

const RADAR_CATEGORIES: ScholarshipCategory[] = [
  'Government',
  'Merit-based',
  'Need-based',
  'Private',
  'Institutional',
  'International',
];

export const OpportunityRadarView: React.FC = () => {
  const {
    scholarships,
    profile,
    documents,
    savedScholarshipIds,
    toggleSaveScholarship,
    setSelectedScholarshipId,
    setGapAnalyzerScholarshipId,
    setTab,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [selectedBlipId, setSelectedBlipId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'list'>('radar');
  const [projectionMode, setProjectionMode] = useState<'match' | 'urgency' | 'amount'>('match');

  // Dynamic concentric ring labels according to projection dimension
  const ringLabels = useMemo(() => {
    if (projectionMode === 'urgency') {
      return [
        { r: 210, label: '>60 Days Remaining' },
        { r: 160, label: '≤45 Days Remaining' },
        { r: 105, label: '≤30 Days Remaining' },
        { r: 50, label: '≤14 Days (Urgent Call)' },
      ];
    }
    if (projectionMode === 'amount') {
      return [
        { r: 210, label: '<₹50,000' },
        { r: 160, label: '₹75,000+' },
        { r: 105, label: '₹1,50,000+' },
        { r: 50, label: '₹2,50,000+ (Premier)' },
      ];
    }
    return [
      { r: 210, label: '25% Match' },
      { r: 160, label: '50% Match' },
      { r: 105, label: '75% Match' },
      { r: 50, label: '100% Target Match' },
    ];
  }, [projectionMode]);

  // Compute match & coordinates for each scholarship on the radar
  const radarPoints = useMemo(() => {
    const center = 250; // SVG center coordinate (500x500 viewport)
    const maxRadius = 210; // Max radius for outer perimeter

    return scholarships.map((sch, index) => {
      const match = evaluateScholarshipMatch(sch, profile, documents);
      const days = calculateDaysRemaining(sch.deadline);

      // Category angle: split circle into 6 slices (60 deg each)
      const catIndex = RADAR_CATEGORIES.indexOf(sch.category);
      const baseAngle = catIndex >= 0 ? catIndex * 60 + 30 : (index * 30) % 360;
      // Add slight jitter so multiple scholarships in same slice don't overlap completely
      const angleJitter = ((index % 5) - 2) * 8;
      const angleRad = ((baseAngle + angleJitter - 90) * Math.PI) / 180;

      // Radius from center depending on projection dimension
      let normalizedFactor = 0.5;
      if (projectionMode === 'match') {
        normalizedFactor = Math.max(10, match.matchPercentage) / 100;
      } else if (projectionMode === 'urgency') {
        // Closer to center = closing soonest (days <= 0 => 1.0, days >= 90 => 0.1)
        const d = Math.max(0, Math.min(90, days));
        normalizedFactor = 1 - (d / 90);
      } else if (projectionMode === 'amount') {
        // Closer to center = highest funding amount (max 250,000)
        normalizedFactor = Math.max(0.12, Math.min(1.0, sch.amount / 250000));
      }

      const radius = maxRadius - normalizedFactor * (maxRadius - 40);

      const x = center + radius * Math.cos(angleRad);
      const y = center + radius * Math.sin(angleRad);

      return {
        scholarship: sch,
        match,
        days,
        x,
        y,
        category: sch.category,
      };
    });
  }, [scholarships, profile, documents, projectionMode]);

  // Filtered blips based on sector selection
  const activePoints = useMemo(() => {
    if (activeCategoryFilter === 'All') return radarPoints;
    return radarPoints.filter((p) => p.category === activeCategoryFilter);
  }, [radarPoints, activeCategoryFilter]);

  // Inspected blip details
  const inspectedBlip = useMemo(() => {
    if (selectedBlipId) {
      return radarPoints.find((p) => p.scholarship.id === selectedBlipId) || radarPoints[0];
    }
    return radarPoints[0];
  }, [selectedBlipId, radarPoints]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
              Opportunity Radar
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EAF1FF] text-[#4169E1] border border-blue-200/60">
              Concentric Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#506184] mt-1">
            Multivariate map of higher-ed grants. Switch projection dimensions to discover opportunities by algorithmic match, closing urgency, or award scale.
          </p>
        </div>

        {/* View Toggle & Dimension Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dimension Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white border border-blue-100 rounded-full shadow-xs text-xs">
            <span className="text-[10px] uppercase font-bold text-[#506184] pl-2.5 pr-1 hidden sm:inline">Metric:</span>
            <button
              onClick={() => setProjectionMode('match')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                projectionMode === 'match'
                  ? 'bg-[#4169E1] text-white shadow-2xs font-bold'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
            >
              Match Score
            </button>
            <button
              onClick={() => setProjectionMode('urgency')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                projectionMode === 'urgency'
                  ? 'bg-[#4169E1] text-white shadow-2xs font-bold'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
            >
              Closing Urgency
            </button>
            <button
              onClick={() => setProjectionMode('amount')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                projectionMode === 'amount'
                  ? 'bg-[#4169E1] text-white shadow-2xs font-bold'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
            >
              Award Scale
            </button>
          </div>

          {/* Scope vs List Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white border border-blue-100 rounded-full shadow-xs">
            <button
              onClick={() => setViewMode('radar')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'radar'
                  ? 'bg-[#EAF1FF] text-[#4169E1] font-bold shadow-2xs'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Radar Scope</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-[#EAF1FF] text-[#4169E1] font-bold shadow-2xs'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Accessible List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Sector Filters */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-2xl border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.03)]">
        <span className="text-xs font-bold text-[#506184] px-3">Sectors:</span>
        {['All', ...RADAR_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategoryFilter === cat
                ? 'bg-[#4169E1] text-white shadow-xs'
                : 'bg-[#F4F7FF] text-[#506184] hover:bg-[#EAF1FF] hover:text-[#4169E1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* RADAR CANVAS & INSPECTION PANEL */}
      {viewMode === 'radar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SVG Radar Surface */}
          <div className="lg:col-span-7 bg-[#172554] rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-xl shadow-blue-950/20 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Ambient sweep effect in background */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full select-none"
                style={{ overflow: 'visible' }}
              >
                {/* Background glow circle */}
                <circle cx="250" cy="250" r="230" fill="#1E293B" stroke="#334155" strokeWidth="1" />

                {/* Concentric Projection Rings */}
                {ringLabels.map((ring, i) => (
                  <g key={i}>
                    <circle
                      cx="250"
                      cy="250"
                      r={ring.r}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="255"
                      y={250 - ring.r + 12}
                      fill="#94A3B8"
                      fontSize="9"
                      fontFamily="Space Grotesk"
                      fontWeight="600"
                    >
                      {ring.label}
                    </text>
                  </g>
                ))}

                {/* 6 Category Radial Dividing Lines */}
                {RADAR_CATEGORIES.map((cat, i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const x2 = 250 + 220 * Math.cos(angle);
                  const y2 = 250 + 220 * Math.sin(angle);

                  // Label position slightly outside
                  const labelAngle = (i * 60 + 30 - 90) * (Math.PI / 180);
                  const lx = 250 + 235 * Math.cos(labelAngle);
                  const ly = 250 + 235 * Math.sin(labelAngle);

                  return (
                    <g key={cat}>
                      <line x1="250" y1="250" x2={x2} y2={y2} stroke="#334155" strokeWidth="1" />
                      <text
                        x={lx}
                        y={ly}
                        fill="#E2E8F0"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="tracking-wider uppercase"
                      >
                        {cat}
                      </text>
                    </g>
                  );
                })}

                {/* Center Bullseye Pin */}
                <circle cx="250" cy="250" r="6" fill="#4169E1" />
                <circle cx="250" cy="250" r="14" fill="#4169E1" fillOpacity="0.25" className="animate-ping" />

                {/* Scholarship Blips */}
                {activePoints.map((p) => {
                  const isSelected = inspectedBlip?.scholarship.id === p.scholarship.id;
                  const isEligible = p.match.status === 'ELIGIBLE';
                  const isPotential = p.match.status === 'POTENTIALLY ELIGIBLE';

                  const fillColor = isEligible ? '#34D399' : isPotential ? '#FBBF24' : '#F87171';

                  return (
                    <g
                      key={p.scholarship.id}
                      onClick={() => setSelectedBlipId(p.scholarship.id)}
                      className="cursor-pointer group"
                    >
                      {/* Selection ring if active */}
                      {isSelected && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="16"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Blip Outer Glow */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isSelected ? '10' : '8'}
                        fill={fillColor}
                        fillOpacity={isSelected ? '0.9' : '0.75'}
                        className="transition-all hover:scale-125"
                      />

                      {/* Core Dot */}
                      <circle cx={p.x} cy={p.y} r="3" fill="#FFFFFF" />

                      {/* Floating Tooltip Label on Hover / Selection */}
                      <text
                        x={p.x}
                        y={p.y - 12}
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="700"
                        textAnchor="middle"
                        className={`pointer-events-none transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {p.scholarship.name.split(' ')[0]} ({p.match.matchPercentage}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Radar Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-blue-900/60 text-xs text-blue-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                <span>Eligible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                <span>Potentially Eligible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                <span>Ineligible</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-300">
                <Compass className="w-3.5 h-3.5 text-[#4169E1]" />
                <span>
                  {projectionMode === 'match'
                    ? 'Center = 100% Target Match'
                    : projectionMode === 'urgency'
                    ? 'Center = Closing Soonest (Urgent)'
                    : 'Center = Premier Grant (₹2.5L+)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Inspection Drawer for Selected Scholarship */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_6px_24px_rgb(65,105,225,0.05)] space-y-5">
            {inspectedBlip ? (
              <>
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-blue-50">
                  <div>
                    <span className="text-xs font-bold text-[#4169E1] uppercase tracking-wider">
                      {inspectedBlip.scholarship.provider}
                    </span>
                    <h3 className="text-lg font-bold text-[#172554] leading-snug mt-0.5 font-['Space_Grotesk']">
                      {inspectedBlip.scholarship.name}
                    </h3>
                    <p className="text-xs text-[#506184] mt-1">{inspectedBlip.scholarship.category}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      inspectedBlip.match.status === 'ELIGIBLE'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : inspectedBlip.match.status === 'POTENTIALLY ELIGIBLE'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                        : 'bg-red-50 text-red-800 border border-red-200/60'
                    }`}
                  >
                    {inspectedBlip.match.matchPercentage}% Match
                  </span>
                </div>

                {/* Value & Urgency */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F4F7FF] border border-blue-100">
                  <div>
                    <span className="text-[10px] text-[#506184] uppercase font-bold block">Grant Award</span>
                    <span className="text-base font-extrabold text-[#172554] font-['Space_Grotesk'] mt-0.5 block">
                      {inspectedBlip.scholarship.amountFormatted}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#506184] uppercase font-bold block">Deadline Window</span>
                    <span className="text-xs font-semibold text-[#172554] flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                      {formatCountdown(inspectedBlip.days)}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="text-xs font-bold text-[#172554] uppercase tracking-wider mb-1">
                    Algorithm Diagnostic
                  </h4>
                  <p className="text-xs text-[#506184] leading-relaxed bg-[#F4F7FF] p-3 rounded-2xl border border-blue-100">
                    {inspectedBlip.match.explanation}
                  </p>
                </div>

                {/* Required Documents Count */}
                <div className="text-xs text-[#506184] space-y-1">
                  <span className="font-semibold text-[#172554]">Required Documents: </span>
                  <p className="text-[11px] text-[#506184]">
                    {inspectedBlip.scholarship.requiredDocuments.join(', ')}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-blue-50 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSaveScholarship(inspectedBlip.scholarship.id)}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-full border flex items-center justify-center gap-1.5 transition-colors ${
                        savedScholarshipIds.includes(inspectedBlip.scholarship.id)
                          ? 'bg-[#4169E1] border-[#4169E1] text-white'
                          : 'border-blue-200 text-[#172554] hover:bg-[#EAF1FF]'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{savedScholarshipIds.includes(inspectedBlip.scholarship.id) ? 'Saved' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedScholarshipId(inspectedBlip.scholarship.id)}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-full bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-colors"
                    >
                      Truth Card
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setGapAnalyzerScholarshipId(inspectedBlip.scholarship.id);
                        setTab('analyzer');
                      }}
                      className="py-2.5 px-3 text-xs font-semibold rounded-full border border-blue-200 text-[#172554] hover:bg-[#F4F7FF] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-[#4169E1]" />
                      <span>Gap Analyzer</span>
                    </button>
                    <button
                      onClick={() => setTab('stacking')}
                      className="py-2.5 px-3 text-xs font-semibold rounded-full bg-[#F4F7FF] hover:bg-[#EAF1FF] text-[#172554] border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#4169E1]" />
                      <span>Stack Simulator</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-[#506184]">Click a blip on the radar to inspect details.</p>
            )}
          </div>
        </div>
      ) : (
        /* ACCESSIBLE LIST VIEW ALTERNATIVE */
        <div className="bg-white rounded-3xl border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] divide-y divide-blue-50">
          {activePoints.map((p) => (
            <div key={p.scholarship.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#506184] mb-1">
                  <span className="font-semibold text-[#4169E1]">{p.scholarship.provider}</span>
                  <span>·</span>
                  <span>{p.scholarship.category}</span>
                </div>
                <h3 className="text-base font-bold text-[#172554]">{p.scholarship.name}</h3>
                <p className="text-xs text-[#506184] mt-1 max-w-xl">{p.match.explanation}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk'] block">
                    {p.scholarship.amountFormatted}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">{p.match.matchPercentage}% Match</span>
                </div>
                <button
                  onClick={() => setSelectedScholarshipId(p.scholarship.id)}
                  className="py-2 px-3 text-xs font-semibold rounded-full bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-colors"
                >
                  Truth Card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
