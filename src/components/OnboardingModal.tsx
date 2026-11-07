import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CgpaFormula, EducationLevel, StudentProfile } from '../types/scholarship';
import {
  GraduationCap,
  Award,
  Wallet,
  UserCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import { evaluateScholarshipMatch, getCgpaFormulaLabel, normalizeToPercentage } from '../utils/matching';

const EDUCATION_LEVELS: EducationLevel[] = ['Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma', 'Secondary'];

const COMMON_DEGREES = [
  'B.Tech / B.E.',
  'B.Sc',
  'MBBS',
  'B.Com',
  'B.A.',
  'BBA',
  'M.Tech',
  'M.Sc',
  'MBA',
  'Diploma',
];

const COMMON_STATES = [
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Delhi',
  'Uttar Pradesh',
  'Telangana',
  'Andhra Pradesh',
  'West Bengal',
  'Kerala',
  'Gujarat',
  'Rajasthan',
  'Madhya Pradesh',
  'Bihar',
  'Other State / Union Territory',
];

const CATEGORY_OPTIONS = [
  'General',
  'OBC (Non-Creamy Layer)',
  'SC (Scheduled Caste)',
  'ST (Scheduled Tribe)',
  'EWS (Economically Weaker Section)',
  'Minority (Religious / Linguistic)',
  'Single Girl Child',
  'Differently Abled (PwD)',
  'First-Generation College Student',
  'Ward of Armed Forces / Ex-Servicemen',
];

export const OnboardingModal: React.FC = () => {
  const { profile, updateProfile, showOnboardingModal, setShowOnboardingModal, scholarships, documents, completeQuestMission, setTab } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!showOnboardingModal) return null;

  // Calculate live matching preview
  const liveMatches = scholarships.filter((s) => {
    const res = evaluateScholarshipMatch(s, formData, documents);
    return res.status === 'ELIGIBLE' || res.status === 'POTENTIALLY ELIGIBLE';
  }).length;

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.educationLevel) newErrors.educationLevel = 'Please select your education level';
      if (!formData.degree) newErrors.degree = 'Please select or enter your degree';
      if (!formData.institution) newErrors.institution = 'Please provide your university or college name';
    } else if (s === 2) {
      if (formData.academicScore === undefined || isNaN(formData.academicScore) || formData.academicScore <= 0) {
        newErrors.academicScore = 'Enter a valid academic score';
      } else if (formData.academicScoreType === 'cgpa' && formData.academicScore > 10) {
        newErrors.academicScore = 'CGPA cannot exceed 10.0';
      } else if (formData.academicScoreType === 'percentage' && formData.academicScore > 100) {
        newErrors.academicScore = 'Percentage cannot exceed 100%';
      }
    } else if (s === 3) {
      if (formData.annualFamilyIncome === undefined || isNaN(formData.annualFamilyIncome) || formData.annualFamilyIncome < 0) {
        newErrors.annualFamilyIncome = 'Enter a valid non-negative family income';
      }
    } else if (s === 4) {
      if (!formData.stateDomicile) newErrors.stateDomicile = 'Please select your home domicile state';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        // Complete onboarding
        const updated = { ...formData, isOnboarded: true };
        updateProfile(updated);
        completeQuestMission('quest-profile');
        setShowOnboardingModal(false);
        setTab('dashboard');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const toggleCategory = (cat: string) => {
    const cleanCat = cat.split(' ')[0]; // match short keyword e.g. OBC, SC, ST, EWS
    const current = formData.categories || [];
    if (current.includes(cleanCat)) {
      setFormData({ ...formData, categories: current.filter((c) => c !== cleanCat) });
    } else {
      setFormData({ ...formData, categories: [...current, cleanCat] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-blue-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Step Progress */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white p-6 relative">
          <button
            onClick={() => setShowOnboardingModal(false)}
            className="absolute top-5 right-5 text-blue-200 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close Onboarding"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-cyan-200 font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Personalized Eligibility Setup</span>
          </div>

          <h2 className="text-xl font-bold font-['Space_Grotesk'] mt-1">
            Build Your Scholarship Profile
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Provide accurate details to unlock verified matching across 12+ national and private funding programs.
          </p>

          {/* 4 Steps Indicator */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { num: 1, label: 'Education' },
              { num: 2, label: 'Academics' },
              { num: 3, label: 'Financial' },
              { num: 4, label: 'Eligibility' },
            ].map((st) => (
              <div key={st.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    st.num <= step ? 'bg-cyan-300' : 'bg-white/20'
                  }`}
                />
                <p className="text-[10px] text-center font-medium text-blue-100">
                  {st.num}. {st.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* STEP 1: EDUCATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#172554]">
                <GraduationCap className="w-4 h-4 text-[#4169E1]" />
                <span>Step 1: Your Education Level & Institution</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1">
                  Current Education Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EDUCATION_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, educationLevel: level })}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                        formData.educationLevel === level
                          ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] shadow-xs'
                          : 'border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {errors.educationLevel && <p className="text-xs text-red-500 mt-1">{errors.educationLevel}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172554] mb-1">
                    Degree Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554]"
                  >
                    <option value="">Select Degree...</option>
                    {COMMON_DEGREES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.degree && <p className="text-xs text-red-500 mt-1">{errors.degree}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172554] mb-1">
                    Course / Specialization Stream
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, Electrical, Commerce"
                    value={formData.courseStream}
                    onChange={(e) => setFormData({ ...formData, courseStream: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172554] mb-1">Current Year</label>
                  <select
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: Number(e.target.value) })}
                    className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554]"
                  >
                    {[1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>
                        Year {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172554] mb-1">
                    College / University Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NIT Karnataka, IIT Delhi, Anna University"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                  />
                  {errors.institution && <p className="text-xs text-red-500 mt-1">{errors.institution}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMICS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#172554]">
                <Award className="w-4 h-4 text-[#4169E1]" />
                <span>Step 2: Academic Performance & Achievements</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F7FF] border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#172554]">
                    Latest Semester / Qualifying Score <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-blue-100 text-xs">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, academicScoreType: 'percentage' })}
                      className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all ${
                        formData.academicScoreType === 'percentage'
                          ? 'bg-white text-[#172554] shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, academicScoreType: 'cgpa' })}
                      className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all ${
                        formData.academicScoreType === 'cgpa' ? 'bg-white text-[#172554] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      CGPA (10 pt)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.academicScoreType === 'cgpa' ? '10' : '100'}
                    placeholder={formData.academicScoreType === 'cgpa' ? 'e.g. 8.5' : 'e.g. 84.5'}
                    value={formData.academicScore || ''}
                    onChange={(e) => setFormData({ ...formData, academicScore: parseFloat(e.target.value) || 0 })}
                    className="w-full text-sm font-bold py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554]"
                  />
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {formData.academicScoreType === 'cgpa' ? '/ 10.0 CGPA' : '%'}
                  </span>
                </div>
                {errors.academicScore && <p className="text-xs text-red-500">{errors.academicScore}</p>}

                {formData.academicScoreType === 'cgpa' && (
                  <div className="space-y-2 pt-2 border-t border-blue-100">
                    <label className="block text-[11px] font-semibold text-[#172554]">
                      CGPA-to-Percentage Conversion Rule
                    </label>
                    <select
                      value={formData.cgpaFormula || 'standard_9_5'}
                      onChange={(e) => setFormData({ ...formData, cgpaFormula: e.target.value as CgpaFormula })}
                      className="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-blue-200 bg-white text-[#172554]"
                    >
                      <option value="standard_9_5">CBSE / AICTE Standard (CGPA × 9.5)</option>
                      <option value="aicte_revised">AICTE Revised ((CGPA - 0.75) × 10)</option>
                      <option value="linear_10">10-Point Linear Scale (CGPA × 10 - IIT/NIT)</option>
                      <option value="custom">Custom University Factor</option>
                    </select>

                    {formData.academicScore > 0 && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-blue-100">
                        Converts to:{' '}
                        <strong className="text-[#4169E1]">
                          {normalizeToPercentage(
                            formData.academicScore,
                            'cgpa',
                            formData.cgpaFormula || 'standard_9_5',
                            formData.customCgpaMultiplier
                          )}%
                        </strong>{' '}
                        <span>({getCgpaFormulaLabel(formData.cgpaFormula, formData.customCgpaMultiplier)})</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172554] mb-1">
                    Class 12th Board Marks (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 88.0"
                    value={formData.prevScore12th || ''}
                    onChange={(e) => setFormData({ ...formData, prevScore12th: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172554] mb-1">
                    Class 10th Board Marks (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 91.5"
                    value={formData.prevScore10th || ''}
                    onChange={(e) => setFormData({ ...formData, prevScore10th: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1">
                  Key Achievements / Honors (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart India Hackathon Finalist, State Talent Search, Olympiad Medal"
                  value={formData.achievements.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      achievements: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                />
                <p className="text-[11px] text-slate-500 mt-1">Separate multiple achievements with commas.</p>
              </div>
            </div>
          )}

          {/* STEP 3: FINANCIAL */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#172554]">
                <Wallet className="w-4 h-4 text-[#4169E1]" />
                <span>Step 3: Annual Family Income & Need Bracket</span>
              </div>

              {/* Transparent Data Policy Note */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex gap-2.5 items-start">
                <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold">Why is financial information requested?</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Most Indian government schemes (such as NSP, CSSS, Post-Matric) and corporate CSR grants enforce strict statutory family income limits (typically under ₹2,50,000, ₹4,50,000, or ₹8,00,000/year). Providing an accurate estimate ensures you are only evaluated against schemes where you meet certificate requirements.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1">
                  Annual Gross Family Income (INR ₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    step="10000"
                    placeholder="e.g. 350000"
                    value={formData.annualFamilyIncome || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, annualFamilyIncome: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-sm font-bold pl-7 pr-3 py-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
                  />
                </div>
                {errors.annualFamilyIncome && <p className="text-xs text-red-500 mt-1">{errors.annualFamilyIncome}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1">
                  Financial Assistance Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'high', label: 'High Need', desc: 'Tuition + Living aid critical' },
                    { id: 'medium', label: 'Moderate', desc: 'Assistance for fee ease' },
                    { id: 'low', label: 'Merit Focus', desc: 'Primarily seeking honor grants' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, financialAssistanceNeed: lvl.id as 'high' | 'medium' | 'low' })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.financialAssistanceNeed === lvl.id
                          ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] shadow-xs'
                          : 'border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
                      }`}
                    >
                      <p className="text-xs font-bold">{lvl.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ELIGIBILITY & CATEGORY */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#172554]">
                <UserCheck className="w-4 h-4 text-[#4169E1]" />
                <span>Step 4: Domicile State & Reservation Categories</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1">
                  Home Domicile State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.stateDomicile}
                  onChange={(e) => setFormData({ ...formData, stateDomicile: e.target.value })}
                  className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554]"
                >
                  <option value="">Select State...</option>
                  {COMMON_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.stateDomicile && <p className="text-xs text-red-500 mt-1">{errors.stateDomicile}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1">
                  Gender Identity (Used for exclusive women & diversity schemes)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Female', 'Male', 'Non-Binary', 'Prefer not to say'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g as any })}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        formData.gender === g
                          ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] shadow-xs'
                          : 'border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172554] mb-1.5">
                  Applicable Quota / Special Categories (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const short = cat.split(' ')[0];
                    const selected = formData.categories?.includes(short);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                          selected
                            ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] font-semibold shadow-xs'
                            : 'border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-[#4169E1] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 bg-[#F4F7FF] border-t border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-200">
              {liveMatches} Matches Detected
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Updating in real time</span>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-3.5 text-xs font-semibold rounded-xl border border-blue-200 text-slate-700 hover:bg-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:from-[#3557c7] hover:to-[#6553c7] text-white flex items-center gap-1.5 shadow-sm shadow-[#4169E1]/25 transition-all"
            >
              <span>{step === 4 ? 'Save & View Matches' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
