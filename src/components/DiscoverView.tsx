import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Grid,
  List,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  FileCheck2,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';
import { calculateDaysRemaining, formatCountdown, getPriorityLevel } from '../utils/dates';
import { ScholarshipCategory } from '../types/scholarship';

const CATEGORIES: ('All' | ScholarshipCategory)[] = [
  'All',
  'Government',
  'Merit-based',
  'Need-based',
  'Private',
  'Institutional',
  'International',
];

export const DiscoverView: React.FC = () => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ScholarshipCategory>('All');
  const [selectedEligibility, setSelectedEligibility] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'amount' | 'deadline'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter and sort scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships
      .map((sch) => {
        const match = evaluateScholarshipMatch(sch, profile, documents);
        const daysRemaining = calculateDaysRemaining(sch.deadline);
        const priority = getPriorityLevel(daysRemaining);
        return { scholarship: sch, match, daysRemaining, priority };
      })
      .filter(({ scholarship, match }) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesText =
            scholarship.name.toLowerCase().includes(q) ||
            scholarship.provider.toLowerCase().includes(q) ||
            scholarship.tags.some((t) => t.toLowerCase().includes(q)) ||
            scholarship.description.toLowerCase().includes(q);
          if (!matchesText) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && scholarship.category !== selectedCategory) {
          return false;
        }

        // Eligibility filter
        if (selectedEligibility === 'eligible') {
          if (match.status !== 'ELIGIBLE' && match.status !== 'POTENTIALLY ELIGIBLE') return false;
        } else if (selectedEligibility === 'ineligible') {
          if (match.status !== 'INELIGIBLE') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.match.matchPercentage - a.match.matchPercentage;
        } else if (sortBy === 'amount') {
          return b.scholarship.amount - a.scholarship.amount;
        } else if (sortBy === 'deadline') {
          return a.daysRemaining - b.daysRemaining;
        }
        return 0;
      });
  }, [scholarships, profile, documents, searchQuery, selectedCategory, selectedEligibility, selectedLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk']">
            Scholarship Discovery Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#506184] mt-1">
            Browse verified opportunities with transparent match calculations and gap analysis.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 p-1 bg-white border border-blue-100 rounded-full shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#EAF1FF] text-[#4169E1] font-bold shadow-2xs'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-[#EAF1FF] text-[#4169E1] font-bold shadow-2xs'
                  : 'text-[#506184] hover:text-[#172554]'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] space-y-4">
        {/* Search input and sort dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by scholarship title, provider (e.g. Reliance, AICTE, Google), or stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-10 pr-9 py-2.5 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-[#F4F7FF]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <label className="text-xs font-semibold text-[#506184] shrink-0">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs font-medium py-2.5 px-3 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-[#F4F7FF]/50 text-[#172554]"
            >
              <option value="match">Highest Match %</option>
              <option value="amount">Funding Value (₹ High to Low)</option>
              <option value="deadline">Closing Soonest</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Status Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-blue-50">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#4169E1] text-white shadow-xs'
                    : 'bg-[#F4F7FF] text-[#506184] hover:bg-[#EAF1FF] hover:text-[#4169E1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Eligibility Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#506184] font-medium">Status:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#F4F7FF] border border-blue-100">
              <button
                onClick={() => setSelectedEligibility('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  selectedEligibility === 'all' ? 'bg-white text-[#172554] shadow-xs' : 'text-[#506184]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedEligibility('eligible')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  selectedEligibility === 'eligible'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#506184] hover:text-[#172554]'
                }`}
              >
                Eligible Only
              </button>
              <button
                onClick={() => setSelectedEligibility('ineligible')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  selectedEligibility === 'ineligible'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-[#506184] hover:text-[#172554]'
                }`}
              >
                Ineligible
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT & ACTIVE FILTER BADGES */}
      <div className="flex items-center justify-between text-xs text-[#506184] px-1">
        <span>
          Showing <strong className="text-[#172554]">{filteredScholarships.length}</strong> of {scholarships.length} scholarships
        </span>
        {(searchQuery || selectedCategory !== 'All' || selectedEligibility !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedEligibility('all');
            }}
            className="text-[#4169E1] font-semibold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* SCHOLARSHIP LISTING */}
      {filteredScholarships.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172554]">No matching scholarships found</h3>
          <p className="text-xs text-[#506184] max-w-sm mx-auto">
            Try adjusting your search keywords, clearing category filters, or tweaking your student profile criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedEligibility('all');
            }}
            className="py-2.5 px-5 rounded-full bg-[#4169E1] text-white text-xs font-bold hover:bg-[#3252BF] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map(({ scholarship, match, daysRemaining }) => {
            const isSaved = savedScholarshipIds.includes(scholarship.id);

            return (
              <div
                key={scholarship.id}
                className="bg-white rounded-3xl p-5 border border-blue-100 shadow-[0_6px_24px_rgb(65,105,225,0.04)] hover:shadow-lg hover:border-[#4169E1]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#4169E1] uppercase tracking-wider">
                      {scholarship.provider}
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
                      {match.status === 'INELIGIBLE' ? 'Ineligible' : `${match.matchPercentage}% Match`}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#172554] leading-snug line-clamp-2">
                    {scholarship.name}
                  </h3>
                  <p className="text-xs text-[#506184] mt-2 line-clamp-2 leading-relaxed">
                    {scholarship.description}
                  </p>

                  {/* Clean unboxed tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#506184] mt-3">
                    <span>{scholarship.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{scholarship.difficultyRating}</span>
                    <span aria-hidden="true">·</span>
                    <span>{scholarship.eligibleLevels.join(', ')}</span>
                  </div>

                  {/* Amount and Deadline strip */}
                  <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#506184] uppercase font-semibold block">Grant Value</span>
                      <span className="text-sm font-extrabold text-[#172554] font-['Space_Grotesk']">
                        {scholarship.amountFormatted}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#506184] uppercase font-semibold block">Deadline</span>
                      <span className="text-xs font-semibold text-[#172554] flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                        {formatCountdown(daysRemaining)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
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
                    className="py-2 px-3.5 rounded-full border border-blue-200 text-[#172554] font-semibold text-xs hover:bg-[#F4F7FF] transition-colors"
                  >
                    Analyze Gap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / COMPACT LIST VIEW */
        <div className="bg-white rounded-3xl border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#172554] text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Scholarship & Provider</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Award Amount</th>
                  <th className="py-3.5 px-4">Match Status</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredScholarships.map(({ scholarship, match, daysRemaining }) => {
                  const isSaved = savedScholarshipIds.includes(scholarship.id);
                  return (
                    <tr key={scholarship.id} className="hover:bg-[#F4F7FF]/80 transition-colors">
                      <td className="py-3.5 px-5 max-w-xs">
                        <button
                          onClick={() => setSelectedScholarshipId(scholarship.id)}
                          className="font-bold text-[#172554] hover:text-[#4169E1] text-left block truncate"
                        >
                          {scholarship.name}
                        </button>
                        <span className="text-[11px] text-[#506184]">{scholarship.provider}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#506184]">{scholarship.category}</td>
                      <td className="py-3.5 px-4 font-bold text-[#172554] font-['Space_Grotesk']">
                        {scholarship.amountFormatted}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            match.status === 'ELIGIBLE'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                              : match.status === 'POTENTIALLY ELIGIBLE'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                              : 'bg-red-50 text-red-800 border border-red-200/60'
                          }`}
                        >
                          {match.status === 'INELIGIBLE' ? 'Ineligible' : `${match.matchPercentage}% Match`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#506184]">
                        {formatCountdown(daysRemaining)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => setSelectedScholarshipId(scholarship.id)}
                          className="text-[#4169E1] font-semibold hover:underline"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setGapAnalyzerScholarshipId(scholarship.id);
                            setTab('analyzer');
                          }}
                          className="text-[#506184] hover:text-[#172554]"
                        >
                          Gap
                        </button>
                        <button
                          onClick={() => toggleSaveScholarship(scholarship.id)}
                          className={`p-1 rounded-full ${isSaved ? 'text-[#4169E1]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          <Bookmark className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
