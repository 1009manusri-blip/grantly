import React, { useState } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Compass,
  Radar,
  FileCheck2,
  Layers,
  Milestone,
  FolderArchive,
  CalendarClock,
  Sparkles,
  Bot,
  User,
  Menu,
  X,
  Trophy,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    tab,
    setTab,
    profile,
    savedScholarshipIds,
    totalQuestPoints,
    setShowAssistantDrawer,
    setShowQuestModal,
    setShowOnboardingModal,
    resetDemoData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'radar', label: 'Radar', icon: <Radar className="w-4 h-4" /> },
    { id: 'analyzer', label: 'Gap Analyzer', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'stacking', label: 'Stack Simulator', icon: <Layers className="w-4 h-4" /> },
    { id: 'journey', label: 'Journey', icon: <Milestone className="w-4 h-4" /> },
    { id: 'vault', label: 'Document Vault', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'deadlines', label: 'Deadlines', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'whatif', label: 'What-If Sandbox', icon: <SlidersHorizontal className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 text-[#172554] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTab('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1] rounded-lg p-1"
              aria-label="GRANTLY Homepage"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4169E1] to-[#7664D8] flex items-center justify-center shadow-md shadow-[#4169E1]/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-white text-lg tracking-wider font-['Space_Grotesk']">G</span>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight font-['Space_Grotesk'] text-[#172554]">GRANTLY</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF1FF] text-[#4169E1] border border-blue-200/60">
                  Scholarship OS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#EAF1FF] text-[#4169E1] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-[#172554] hover:bg-[#F4F7FF]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quest Points Button */}
            <button
              onClick={() => setShowQuestModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF1FF] hover:bg-blue-100/70 border border-blue-200/60 text-xs font-semibold text-[#4169E1] transition-all"
              title="Funding Quest Milestones"
              aria-label="View Funding Quest Milestones"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-[#172554]">{totalQuestPoints}</span>
              <span className="text-[11px] text-slate-500">pts</span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={() => setShowAssistantDrawer(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:from-[#3557c7] hover:to-[#6553c7] text-white text-xs font-semibold shadow-sm shadow-[#4169E1]/20 transition-all"
              aria-label="Open AI Scholarship Assistant"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Profile Avatar / Settings */}
            <button
              onClick={() => setTab('profile')}
              className={`p-1.5 rounded-xl border transition-all flex items-center gap-2 ${
                tab === 'profile'
                  ? 'bg-[#EAF1FF] border-[#4169E1] text-[#4169E1]'
                  : 'bg-white border-blue-100 text-slate-700 hover:bg-[#F4F7FF]'
              }`}
              title="Student Profile & Settings"
              aria-label="View Student Profile & Settings"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#4169E1] to-[#7664D8] flex items-center justify-center text-xs font-bold text-white shadow-2xs">
                {profile.fullName ? profile.fullName.charAt(0) : 'A'}
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#172554] hover:bg-[#F4F7FF] focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-blue-100">
            <button
              onClick={() => {
                setTab('landing');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-[#F4F7FF]"
            >
              Landing Overview
            </button>
            <button
              onClick={() => {
                setShowOnboardingModal(true);
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-xs font-medium rounded-xl text-[#4169E1] hover:bg-[#EAF1FF]"
            >
              Restart Onboarding
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                  tab === item.id
                    ? 'bg-[#EAF1FF] text-[#4169E1] font-bold'
                    : 'text-slate-600 hover:bg-[#F4F7FF] hover:text-[#172554]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-slate-500">
            <span>{profile.fullName}</span>
            <button
              onClick={() => {
                setShowResetConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="text-red-600 hover:underline"
            >
              Reset Demo
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-[#172554]">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              This will restore all default scholarships, sample student profile (Aarav Sharma), demo documents, and application tracks.
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
    </header>
  );
};
