import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  Wallet,
  UserCheck,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileDown,
} from 'lucide-react';
import { EducationLevel, StudentProfile } from '../types/scholarship';
import { formatINR } from '../utils/matching';

const EDUCATION_LEVELS: EducationLevel[] = ['Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma', 'Secondary'];

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

export const ProfileSettingsView: React.FC = () => {
  const { profile, updateProfile, resetDemoData, setShowOnboardingModal, setTab } = useApp();

  const [form, setForm] = useState<StudentProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleCategory = (cat: string) => {
    const short = cat.split(' ')[0];
    const current = form.categories || [];
    if (current.includes(short)) {
      setForm({ ...form, categories: current.filter((c) => c !== short) });
    } else {
      setForm({ ...form, categories: [...current, short] });
    }
  };

  const handleExportProfile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `grantly_profile_${form.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] tracking-tight">
            Student Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your verified academic records, financial thresholds, and eligibility categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportProfile}
            className="py-2 px-3.5 rounded-xl border border-blue-200 bg-white hover:bg-[#F4F7FF] text-[#172554] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Export Profile</span>
          </button>
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="py-2 px-3.5 rounded-xl bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wizard Setup</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes successfully saved and re-indexed across matching algorithms!</span>
        </div>
      )}

      {/* Main Profile Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#4169E1]" />
            <span>Personal & Contact Info</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="space-y-4 pt-4 border-t border-blue-100">
          <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#4169E1]" />
            <span>Education & Academics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Education Level</label>
              <select
                value={form.educationLevel}
                onChange={(e) => setForm({ ...form, educationLevel: e.target.value as EducationLevel })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554]"
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Degree Program</label>
              <input
                type="text"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Current Year</label>
              <input
                type="number"
                min="1"
                max="5"
                value={form.currentYear}
                onChange={(e) => setForm({ ...form, currentYear: parseInt(e.target.value) || 1 })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Institution Name</label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">
                Latest Academic Score ({form.academicScoreType === 'cgpa' ? 'CGPA / 10' : '%'})
              </label>
              <input
                type="number"
                step="0.1"
                value={form.academicScore}
                onChange={(e) => setForm({ ...form, academicScore: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>
          </div>
        </div>

        {/* Financial & Category */}
        <div className="space-y-4 pt-4 border-t border-blue-100">
          <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#4169E1]" />
            <span>Financial & Category Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">
                Annual Family Income (INR ₹)
              </label>
              <input
                type="number"
                step="10000"
                value={form.annualFamilyIncome}
                onChange={(e) => setForm({ ...form, annualFamilyIncome: parseInt(e.target.value) || 0 })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Home State Domicile</label>
              <input
                type="text"
                value={form.stateDomicile}
                onChange={(e) => setForm({ ...form, stateDomicile: e.target.value })}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172554] mb-2">
              Social Categories / Reservations
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const short = cat.split(' ')[0];
                const active = form.categories?.includes(short);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      active
                        ? 'border-[#4169E1] bg-[#EAF1FF] text-[#4169E1] font-semibold'
                        : 'border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:from-[#3557c7] hover:to-[#6553c7] text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-[#4169E1]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-[#172554]">
            <h3 className="text-lg font-bold">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              This will restore all default scholarships, default student profile (Aarav Sharma), demo documents, and application tracks.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-blue-200 text-slate-700 hover:bg-[#F4F7FF]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                  setTab('dashboard');
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
