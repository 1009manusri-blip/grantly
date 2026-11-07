import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Radar,
  FileCheck2,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FolderArchive,
  GraduationCap,
  Award,
  ChevronRight,
  Bookmark,
  Check,
  X,
  AlertTriangle,
  Building2,
  Globe2,
  Zap,
} from 'lucide-react';
import { formatINR } from '../utils/matching';

export const LandingPage: React.FC = () => {
  const { setTab, scholarships, setSelectedScholarshipId, setGapAnalyzerScholarshipId, setShowOnboardingModal } = useApp();

  const featuredList = scholarships.filter((s) => s.featured).slice(0, 3);

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. HERO SECTION WITH WHITE-TO-SOFT-BLUE BLENDED AMBIENCE */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Soft-blue & lavender radial glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-r from-[#4169E1]/15 via-[#7664D8]/10 to-[#EAF1FF] blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 shadow-xs text-xs font-semibold text-[#172554]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1] animate-pulse" />
              <span>Unified Higher Education Funding OS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172554] font-['Space_Grotesk'] leading-[1.12]">
              Your future deserves funding. <br />
              <span className="bg-gradient-to-r from-[#4169E1] via-[#5B54E0] to-[#7664D8] bg-clip-text text-transparent">
                Let's find it.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#506184] leading-relaxed max-w-2xl font-normal">
              Discover scholarships that match your ambitions, understand your exact eligibility requirements with transparent gap analysis, and manage every application — all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setTab('dashboard')}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-[#4169E1]/25 hover:shadow-xl hover:shadow-[#4169E1]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2 group transition-all duration-200"
              >
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setTab('discover')}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#EAF1FF] text-[#172554] hover:text-[#4169E1] font-bold text-sm border border-blue-200/80 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Explore Opportunities
              </button>
            </div>

            {/* Quick Guarantees with Clean Typographic Separators */}
            <div className="pt-6 border-t border-blue-100 flex flex-wrap items-center gap-6 text-xs text-[#506184] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Deterministic matching rules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dual-funding conflict detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Document reuse intelligence</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Opportunity Ecosystem Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full">
              {/* Outer decorative card frame with soft blue shadow */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgb(65,105,225,0.08)] border border-blue-100 space-y-4">
                {/* Header of Preview Card */}
                <div className="flex items-center justify-between pb-3.5 border-b border-blue-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4169E1] to-[#7664D8] flex items-center justify-center font-bold text-white text-xs">
                      G
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172554]">Live Match Engine</p>
                      <p className="text-[10px] text-[#506184]">Aarav Sharma · NITK B.Tech 2nd Year</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    6 High Matches
                  </span>
                </div>

                {/* Layered Card 1: Reliance Foundation */}
                <div className="p-4 rounded-2xl bg-[#F4F7FF] border border-blue-100 hover:border-[#4169E1]/50 transition-all shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#4169E1] tracking-wide">
                        Merit-cum-Means · Private CSR
                      </span>
                      <h4 className="text-sm font-bold text-[#172554] mt-0.5">
                        Reliance Foundation UG Grant
                      </h4>
                      <p className="text-sm font-extrabold text-[#172554] mt-1 font-['Space_Grotesk']">
                        ₹2,00,000 grant
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        100% Eligible
                      </span>
                      <p className="text-[10px] text-[#F97316] font-semibold mt-1 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> 21 days left
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-100/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#506184]">5 documents verified in vault</span>
                    <button
                      onClick={() => setSelectedScholarshipId('sch-reliance-ug')}
                      className="text-[#4169E1] font-bold hover:underline flex items-center gap-1"
                    >
                      Truth Card <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Layered Card 2: Central Sector Scheme */}
                <div className="p-4 rounded-2xl bg-[#F4F7FF] border border-blue-100 hover:border-[#4169E1]/50 transition-all shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wide">
                        Government of India (MoE)
                      </span>
                      <h4 className="text-sm font-bold text-[#172554] mt-0.5">
                        Central Sector Scheme for College
                      </h4>
                      <p className="text-sm font-extrabold text-[#172554] mt-1 font-['Space_Grotesk']">
                        ₹20,000 / year
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        100% Eligible
                      </span>
                      <p className="text-[10px] text-[#506184] mt-1 font-medium">NSP Portal Open</p>
                    </div>
                  </div>
                </div>

                {/* Layered Card 3: Interactive Stacking & Gap Teaser */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EAF1FF] via-[#F0EDFF] to-white border border-blue-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#4169E1] text-white flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172554]">Allowable Stack Total</p>
                      <p className="text-[11px] text-[#4169E1] font-extrabold font-['Space_Grotesk']">₹2,70,000 / year</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTab('stacking')}
                    className="text-xs font-bold text-[#4169E1] hover:text-[#3252BF] flex items-center gap-1"
                  >
                    <span>Simulate Stacks →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A — TRUST AND CLARITY (CRISP WHITE SECTION) */}
      <section id="trust-clarity" className="bg-white py-20 border-y border-blue-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">The Indian Scholarship Crisis</span>
              <h2 className="text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] leading-tight">
                Over ₹10,000 Crore in higher education aid goes unutilized every year.
              </h2>
              <p className="text-sm text-[#506184] leading-relaxed">
                Indian students face a fragmented maze: government portals like NSP and State SSP crash before deadlines; private CSR trusts conceal criteria in obscure PDF circulars; and honest applicants risk disqualification by unknowingly applying for dual-funding central grants.
              </p>
              <p className="text-sm text-[#506184] leading-relaxed">
                GRANTLY replaces uncertainty with deterministic algorithms, direct portal links, and automated certificate reuse.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F4F7FF] border border-blue-100">
                <p className="text-3xl font-black text-[#172554] font-['Space_Grotesk']">₹12.5L+</p>
                <p className="text-xs font-bold text-[#172554] mt-1">Verified Funding Pool</p>
                <p className="text-[11px] text-[#506184] mt-0.5">Spanning Central, State, and Corporate CSR initiatives</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F7FF] border border-blue-100">
                <p className="text-3xl font-black text-[#4169E1] font-['Space_Grotesk']">100%</p>
                <p className="text-xs font-bold text-[#172554] mt-1">Deterministic Rules</p>
                <p className="text-[11px] text-[#506184] mt-0.5">Transparent cutoffs with zero fabricated random percentages</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F7FF] border border-blue-100">
                <p className="text-3xl font-black text-emerald-700 font-['Space_Grotesk']">6 Stages</p>
                <p className="text-xs font-bold text-[#172554] mt-1">End-to-End Pipeline</p>
                <p className="text-[11px] text-[#506184] mt-0.5">From initial discovery to college verification and DBT credit</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F7FF] border border-blue-100">
                <p className="text-3xl font-black text-[#7664D8] font-['Space_Grotesk']">3.2x</p>
                <p className="text-xs font-bold text-[#172554] mt-1">Certificate Reuse Rate</p>
                <p className="text-[11px] text-[#506184] mt-0.5">One verified upload serves multiple state and trust applications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — HOW IT WORKS: THE 5/6-STEP CONNECTED JOURNEY (PALE BLUE TO WHITE BLEND) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">Methodical Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1.5 font-['Space_Grotesk']">
            How GRANTLY powers your entire funding journey
          </h2>
          <p className="text-sm text-[#506184] mt-2">
            No more scattered bookmarks or missed deadlines. Follow a systematic, stress-free methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] flex flex-col justify-between relative group hover:border-[#4169E1]/50 transition-all">
            <div className="space-y-3">
              <span className="text-2xl font-black text-[#4169E1] font-['Space_Grotesk'] block">01</span>
              <h3 className="text-base font-bold text-[#172554]">DISCOVER</h3>
              <p className="text-xs text-[#506184] leading-relaxed">
                Browse verified opportunities filtered precisely by your education level, degree, and state domicile.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-50 text-[11px] font-semibold text-[#4169E1]">
              12+ Schemes Ready
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] flex flex-col justify-between relative group hover:border-[#4169E1]/50 transition-all">
            <div className="space-y-3">
              <span className="text-2xl font-black text-[#7664D8] font-['Space_Grotesk'] block">02</span>
              <h3 className="text-base font-bold text-[#172554]">MATCH</h3>
              <p className="text-xs text-[#506184] leading-relaxed">
                Deterministic algorithms evaluate marks, family income ceilings, and category quotas against official statutory gazettes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-50 text-[11px] font-semibold text-[#7664D8]">
              Deterministic Match %
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] flex flex-col justify-between relative group hover:border-[#4169E1]/50 transition-all">
            <div className="space-y-3">
              <span className="text-2xl font-black text-emerald-700 font-['Space_Grotesk'] block">03</span>
              <h3 className="text-base font-bold text-[#172554]">PREPARE</h3>
              <p className="text-xs text-[#506184] leading-relaxed">
                Upload required certificates in the Document Vault with reuse intelligence and simulate multi-grant stacking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-50 text-[11px] font-semibold text-emerald-700">
              Conflict-Free Dossiers
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] flex flex-col justify-between relative group hover:border-[#4169E1]/50 transition-all">
            <div className="space-y-3">
              <span className="text-2xl font-black text-[#F97316] font-['Space_Grotesk'] block">04</span>
              <h3 className="text-base font-bold text-[#172554]">APPLY</h3>
              <p className="text-xs text-[#506184] leading-relaxed">
                Submit directly to official government portals (NSP, SSP) and corporate grant portals with step-by-step guidance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-50 text-[11px] font-semibold text-[#F97316]">
              Official Links Verified
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_4px_20px_rgb(65,105,225,0.04)] flex flex-col justify-between relative group hover:border-[#4169E1]/50 transition-all">
            <div className="space-y-3">
              <span className="text-2xl font-black text-sky-700 font-['Space_Grotesk'] block">05</span>
              <h3 className="text-base font-bold text-[#172554]">TRACK</h3>
              <p className="text-xs text-[#506184] leading-relaxed">
                Monitor institutional nodal approval, biometric verification, and Direct Benefit Transfer (DBT) disbursals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-50 text-[11px] font-semibold text-sky-700">
              Disbursal Pipeline
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — SIGNATURE INNOVATIONS (CRISP WHITE SECTION) */}
      <section id="signature-features" className="bg-white py-20 border-y border-blue-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">Signature Innovations</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1.5 font-['Space_Grotesk']">
              Four breakthroughs engineered for applicants
            </h2>
            <p className="text-sm text-[#506184] mt-2">
              Features built specifically to address Indian student pain points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Innovation 1: Gap Analyzer */}
            <div className="bg-gradient-to-br from-white to-[#F4F7FF] rounded-3xl p-8 border border-blue-100 shadow-[0_8px_30px_rgb(65,105,225,0.04)] flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#172554] font-['Space_Grotesk']">
                  Eligibility Gap Analyzer
                </h3>
                <p className="text-xs sm:text-sm text-[#506184] leading-relaxed">
                  Instead of vague rejections, get a transparent 3-color breakdown: Green for satisfied rules, Amber for missing certificates, and Red for score/income thresholds. See exactly which documents to upload and what future academic gains unlock.
                </p>

                {/* Micro preview mock */}
                <div className="p-4 rounded-2xl bg-white border border-blue-100/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">✓ Education Level (Undergraduate B.Tech)</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Satisfied</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">⚠ Family Income Certificate</span>
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Upload Needed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">✓ Academic Cutoff (82.5% vs 60% minimum)</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Satisfied</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setTab('analyzer')}
                className="w-full py-3 rounded-full bg-[#EAF1FF] hover:bg-[#4169E1] text-[#4169E1] hover:text-white font-bold text-xs transition-colors text-center"
              >
                Launch Eligibility Gap Analyzer
              </button>
            </div>

            {/* Innovation 2: Opportunity Radar */}
            <div className="bg-gradient-to-br from-white to-[#F4F7FF] rounded-3xl p-8 border border-blue-100 shadow-[0_8px_30px_rgb(65,105,225,0.04)] flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center">
                  <Radar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#172554] font-['Space_Grotesk']">
                  Interactive Opportunity Radar
                </h3>
                <p className="text-xs sm:text-sm text-[#506184] leading-relaxed">
                  Replace generic grids with an interactive concentric radar. Opportunities are arranged by category sectors (Government, Merit, Need, Private, Institutional, International), with proximity to the center bullseye indicating higher algorithmic match.
                </p>

                {/* Concentric visual rings diagram preview */}
                <div className="p-4 rounded-2xl bg-white border border-blue-100/80 flex items-center justify-around text-center">
                  <div>
                    <span className="w-3 h-3 rounded-full bg-[#4169E1] inline-block mb-1" />
                    <p className="text-[11px] font-bold text-[#172554]">Central Ring</p>
                    <p className="text-[10px] text-[#506184]">100% Target Match</p>
                  </div>
                  <div>
                    <span className="w-3 h-3 rounded-full bg-[#7664D8] inline-block mb-1" />
                    <p className="text-[11px] font-bold text-[#172554]">Mid Ring</p>
                    <p className="text-[10px] text-[#506184]">75% Potential</p>
                  </div>
                  <div>
                    <span className="w-3 h-3 rounded-full bg-blue-300 inline-block mb-1" />
                    <p className="text-[11px] font-bold text-[#172554]">6 Sectors</p>
                    <p className="text-[10px] text-[#506184]">Categorized Scope</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setTab('radar')}
                className="w-full py-3 rounded-full bg-[#EAF1FF] hover:bg-[#4169E1] text-[#4169E1] hover:text-white font-bold text-xs transition-colors text-center"
              >
                Explore Opportunity Radar
              </button>
            </div>

            {/* Innovation 3: Stacking Simulator */}
            <div className="bg-gradient-to-br from-white to-[#F4F7FF] rounded-3xl p-8 border border-blue-100 shadow-[0_8px_30px_rgb(65,105,225,0.04)] flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#7664D8] flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#172554] font-['Space_Grotesk']">
                  Scholarship Stacking Simulator
                </h3>
                <p className="text-xs sm:text-sm text-[#506184] leading-relaxed">
                  Plan your multi-scholarship financial future with confidence. Our statutory conflict detection engine flags combinations that violate government dual-receipt rules (e.g., holding two Central Sector grants simultaneously) before you apply.
                </p>

                {/* Stacking mock preview */}
                <div className="p-4 rounded-2xl bg-white border border-blue-100/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Selected Total:</span>
                    <span className="font-bold text-[#172554]">₹3,20,000</span>
                  </div>
                  <div className="flex justify-between text-[#4169E1] font-bold">
                    <span>Allowable Stack Ceiling:</span>
                    <span>₹3,00,000</span>
                  </div>
                  <p className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg font-medium mt-1">
                    ⚠ Alert: Dual-funding block between Central Sector and State Fee Waiver
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTab('stacking')}
                className="w-full py-3 rounded-full bg-[#F0EDFF] hover:bg-[#7664D8] text-[#7664D8] hover:text-white font-bold text-xs transition-colors text-center"
              >
                Simulate Multi-Grant Stacks
              </button>
            </div>

            {/* Innovation 4: Document Vault & Reuse */}
            <div className="bg-gradient-to-br from-white to-[#F4F7FF] rounded-3xl p-8 border border-blue-100 shadow-[0_8px_30px_rgb(65,105,225,0.04)] flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FolderArchive className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#172554] font-['Space_Grotesk']">
                  Document Vault & Reuse Intel
                </h3>
                <p className="text-xs sm:text-sm text-[#506184] leading-relaxed">
                  Upload income certificates, bonafide letters, transcripts, and caste affidavits once. GRANTLY tracks certificate reuse across multiple application portals, calculating how many schemes unlock with each upload.
                </p>

                {/* Document reuse mock preview */}
                <div className="p-4 rounded-2xl bg-white border border-blue-100/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Family Income Certificate</span>
                    <span className="text-[#4169E1] font-bold bg-[#EAF1FF] px-2 py-0.5 rounded-full text-[10px]">Reused in 4 Portals</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">College Bonafide Letter</span>
                    <span className="text-[#4169E1] font-bold bg-[#EAF1FF] px-2 py-0.5 rounded-full text-[10px]">Reused in 5 Portals</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 font-medium">Automated validity & expiry monitoring included</p>
                </div>
              </div>

              <button
                onClick={() => setTab('vault')}
                className="w-full py-3 rounded-full bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white font-bold text-xs transition-colors text-center"
              >
                Open Document Vault
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D — FEATURED OPPORTUNITIES (PALE BLUE BACKGROUND) */}
      <section id="featured-opportunities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">Curated Catalog</span>
            <h2 className="text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] mt-1">
              Featured High-Impact Scholarships
            </h2>
            <p className="text-xs sm:text-sm text-[#506184] mt-1">
              Verified opportunities from national ministries, global technology leaders, and private foundations.
            </p>
          </div>
          <button
            onClick={() => setTab('discover')}
            className="text-xs font-bold text-[#4169E1] hover:text-[#3252BF] flex items-center gap-1.5 shrink-0"
          >
            <span>View all {scholarships.length} scholarships</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredList.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_6px_24px_rgb(65,105,225,0.04)] hover:shadow-lg hover:border-[#4169E1]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#506184] mb-2">
                  <span className="font-bold text-[#4169E1]">{scholarship.provider}</span>
                  <span className="text-[11px] font-semibold text-slate-600">{scholarship.category}</span>
                </div>
                <h3 className="text-base font-bold text-[#172554] leading-snug">{scholarship.name}</h3>
                <p className="text-xs text-[#506184] mt-2 line-clamp-2 leading-relaxed">{scholarship.description}</p>

                <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#506184] uppercase font-bold block">Grant Value</span>
                    <span className="text-base font-black text-[#172554] font-['Space_Grotesk']">
                      {scholarship.amountFormatted}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#506184] uppercase font-bold block">Deadline</span>
                    <span className="text-xs font-semibold text-[#172554]">{scholarship.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-blue-50 flex items-center gap-2">
                <button
                  onClick={() => setSelectedScholarshipId(scholarship.id)}
                  className="flex-1 py-2.5 px-3 text-xs font-bold rounded-full bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-colors text-center"
                >
                  Truth Card
                </button>
                <button
                  onClick={() => {
                    setGapAnalyzerScholarshipId(scholarship.id);
                    setTab('analyzer');
                  }}
                  className="py-2.5 px-3.5 text-xs font-bold rounded-full border border-blue-200/80 text-[#172554] hover:bg-[#F4F7FF] transition-colors"
                >
                  Analyze Gap
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION E — WHY GRANTLY (CRISP WHITE SECTION) */}
      <section id="why-grantly" className="bg-white py-20 border-y border-blue-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1]">Engineered for Student Success</span>
            <h2 className="text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] mt-1">
              Why students choose GRANTLY over scattered portals
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-blue-100 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#172554] text-white">
                <tr>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider">Evaluation Dimension</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider text-blue-200">Traditional Portals</th>
                  <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider text-[#B9E8D4]">GRANTLY Unified OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                <tr className="hover:bg-[#F4F7FF]/80">
                  <td className="py-4 px-6 font-bold text-[#172554]">Eligibility Matching</td>
                  <td className="py-4 px-6 text-[#506184]">Manual search through 40-page PDF guidelines; vague cutoff announcements.</td>
                  <td className="py-4 px-6 font-semibold text-blue-900 bg-[#EAF1FF]/70">
                    Deterministic rule evaluation with real-time match % and criteria breakdown.
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F7FF]/80">
                  <td className="py-4 px-6 font-bold text-[#172554]">Multi-Award Stacking</td>
                  <td className="py-4 px-6 text-[#506184]">No warning; risk of cancellation due to statutory dual-funding bans.</td>
                  <td className="py-4 px-6 font-semibold text-blue-900 bg-[#EAF1FF]/70">
                    Automated conflict engine flags duplicate government awards instantly.
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F7FF]/80">
                  <td className="py-4 px-6 font-bold text-[#172554]">Document Management</td>
                  <td className="py-4 px-6 text-[#506184]">Repeated certificate requests for every application; repeated tahsildar visits.</td>
                  <td className="py-4 px-6 font-semibold text-blue-900 bg-[#EAF1FF]/70">
                    Central Vault with Document Reuse Intelligence (upload once, use across multiple portals).
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F7FF]/80">
                  <td className="py-4 px-6 font-bold text-[#172554]">Deadline Urgency</td>
                  <td className="py-4 px-6 text-[#506184]">Static dates; portals crash in the final 48 hours without notice.</td>
                  <td className="py-4 px-6 font-semibold text-blue-900 bg-[#EAF1FF]/70">
                    Dynamic daily countdowns with priority level badges and daily action checklists.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION F — FINAL CALL TO ACTION (RICH DEEP NAVY CONTAINER WITH ROYAL BLUE ACCENTS) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2E1065] p-8 sm:p-14 text-white text-center shadow-2xl shadow-blue-950/20 space-y-6 relative overflow-hidden border border-blue-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#4169E1]/30 to-transparent pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] leading-tight relative z-10">
            Your next opportunity could be closer than you think.
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto font-normal relative z-10">
            Join students across India securing financial freedom for their degrees. Start matching in under 60 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={() => setTab('dashboard')}
              className="px-8 py-4 rounded-full bg-white text-[#172554] font-bold text-sm hover:bg-[#EAF1FF] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="px-8 py-4 rounded-full bg-[#4169E1] text-white font-bold text-sm hover:bg-[#3657C7] border border-blue-400/40 shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              Complete Student Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
