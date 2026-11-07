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
  SlidersHorizontal,
  Bot,
  User,
  Menu,
  X,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  Sparkles,
  Search,
  Bell,
  ArrowUpRight,
  Scale,
  FileText,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    tab,
    setTab,
    profile,
    totalQuestPoints,
    savedScholarshipIds,
    setShowAssistantDrawer,
    setShowQuestModal,
    setShowOnboardingModal,
    resetDemoData,
    eligibleScholarshipsCount,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navGroups: {
    title: string;
    items: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      title: 'Discovery & Intelligence',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
        { id: 'discover', label: 'Discovery Catalog', icon: <Search className="w-4 h-4" />, badge: '13' },
        { id: 'compare', label: 'Comparison Studio', icon: <Scale className="w-4 h-4" />, badge: '5-Fit' },
        { id: 'translator', label: 'Notice Translator', icon: <FileText className="w-4 h-4" />, badge: 'Circulars' },
        { id: 'radar', label: 'Opportunity Radar', icon: <Radar className="w-4 h-4" /> },
        { id: 'analyzer', label: 'Gap Analyzer', icon: <FileCheck2 className="w-4 h-4" /> },
        { id: 'whatif', label: 'What-If Sandbox', icon: <SlidersHorizontal className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Planning & Execution',
      items: [
        { id: 'stacking', label: 'Stacking Simulator', icon: <Layers className="w-4 h-4" /> },
        { id: 'journey', label: 'Application Journey', icon: <Milestone className="w-4 h-4" /> },
        { id: 'vault', label: 'Document Vault', icon: <FolderArchive className="w-4 h-4" /> },
        { id: 'deadlines', label: 'Deadline Intel', icon: <CalendarClock className="w-4 h-4" />, badge: 'Urgent' },
      ],
    },
  ];

  const currentTabName = () => {
    switch (tab) {
      case 'dashboard':
        return 'Student Dashboard';
      case 'discover':
        return 'Discovery Catalog';
      case 'compare':
        return 'Scholarship Comparison Studio';
      case 'translator':
        return 'Scholarship Notice Translator';
      case 'radar':
        return 'Opportunity Radar';
      case 'analyzer':
        return 'Eligibility Gap Analyzer';
      case 'stacking':
        return 'Scholarship Stacking Simulator';
      case 'journey':
        return 'Application Journey Tracker';
      case 'vault':
        return 'Document Vault & Reuse Intel';
      case 'deadlines':
        return 'Deadline Intelligence';
      case 'whatif':
        return 'What-If Scenario Sandbox';
      case 'profile':
        return 'Profile & System Settings';
      case 'assistant':
        return 'AI Scholarship Advisor';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#F4F7FF] via-[#EAF1FF]/40 to-[#F4F7FF]">
      {/* DESKTOP COLLAPSIBLE SIDEBAR WITH DEEP NAVY AND ROYAL ACCENTS */}
      <aside
        className={`hidden lg:flex flex-col bg-[#172554] border-r border-blue-900/50 text-white transition-all duration-300 z-30 sticky top-0 h-screen shrink-0 select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header with Brand */}
        <div className="p-4 border-b border-blue-900/40 flex items-center justify-between">
          <button
            onClick={() => setTab('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1] rounded-full p-1 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            title="Return to Public Homepage"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4169E1] via-[#5B54E0] to-[#7664D8] flex items-center justify-center shadow-md shadow-[#4169E1]/30 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-extrabold text-white text-base tracking-wider font-['Space_Grotesk']">G</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-extrabold text-base tracking-tight font-['Space_Grotesk'] text-white">GRANTLY</span>
                <span className="block text-[10px] text-blue-200 font-medium leading-none">Scholarship OS</span>
              </div>
            )}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-full text-blue-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] uppercase font-bold text-blue-300/70 tracking-wider mb-2">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] group ${
                      active
                        ? 'bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white shadow-md shadow-[#4169E1]/35 font-bold'
                        : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!sidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          active
                            ? 'bg-white/20 text-white'
                            : item.badge === 'Urgent'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                            : 'bg-blue-900/60 text-blue-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quest & AI Widgets in Sidebar */}
        <div className="p-3 border-t border-blue-900/40 space-y-2">
          {/* Funding Quest Button */}
          <button
            onClick={() => setShowQuestModal(true)}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-blue-100 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Funding Quest Milestones"
          >
            <Trophy className="w-4 h-4 text-[#F97316] shrink-0" />
            {!sidebarCollapsed && (
              <div className="flex-1 text-left truncate">
                <span className="text-[11px] block text-blue-300">Funding Quest</span>
                <span className="text-white font-bold">{totalQuestPoints} pts cleared</span>
              </div>
            )}
          </button>

          {/* AI Advisor Button */}
          <button
            onClick={() => setShowAssistantDrawer(true)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#4169E1]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Open AI Scholarship Advisor"
          >
            <Bot className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Ask AI Advisor</span>}
          </button>

          {/* Student Profile Card */}
          <div
            onClick={() => setTab('profile')}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Student Profile & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#4169E1] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {profile.fullName ? profile.fullName.charAt(0) : 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{profile.fullName || 'Student'}</p>
                <p className="text-[10px] text-blue-200 truncate">{profile.degree || 'Undergraduate'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Accessible Skip Link for Keyboard Users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#4169E1] focus:text-white focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold"
        >
          Skip to main content
        </a>

        {/* Top App Bar: Floating Pill Navigation Container with White and Soft-Blue Tint */}
        <header className="sticky top-2 sm:top-3 z-20 mx-3 sm:mx-6 lg:mx-8 my-2 sm:my-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.05)] flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full text-[#172554] hover:text-[#4169E1] hover:bg-[#EAF1FF] transition-all duration-200 active:scale-95"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Path with Soft Blue Pill Styling */}
            <div className="flex items-center gap-1.5 text-xs text-[#506184] truncate">
              <button
                onClick={() => setTab('landing')}
                className="px-2.5 py-1 rounded-full text-[#506184] hover:text-[#4169E1] hover:bg-[#EAF1FF] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <span className="text-blue-300">/</span>
              <span className="font-bold text-[#172554] truncate px-2.5 py-0.5 rounded-full bg-[#EAF1FF] border border-blue-200/60">
                {currentTabName()}
              </span>
            </div>
          </div>

          {/* Right Action Icons in Top Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Catalog Search trigger */}
            <button
              onClick={() => setTab('discover')}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F7FF] hover:bg-[#EAF1FF] hover:text-[#4169E1] text-[#506184] text-xs font-medium border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Search scholarships...</span>
            </button>

            {/* Quest Points Pill */}
            <button
              onClick={() => setShowQuestModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF1FF] text-[#4169E1] hover:bg-[#4169E1] hover:text-white text-xs font-bold transition-all duration-200 shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Funding Quest Milestones"
            >
              <Trophy className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{totalQuestPoints}</span>
              <span className="text-[10px] opacity-80 hidden sm:inline">pts</span>
            </button>

            {/* AI Advisor Pill */}
            <button
              onClick={() => setShowAssistantDrawer(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#172554] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              <Bot className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Profile Avatar Pill Shortcut */}
            <button
              onClick={() => setTab('profile')}
              className="w-8 h-8 rounded-full bg-[#EAF1FF] border border-blue-200/60 text-[#4169E1] flex items-center justify-center font-bold text-xs hover:scale-105 active:scale-95 transition-all duration-200"
              title="Profile & Settings"
              aria-label="Profile & Settings"
            >
              {profile.fullName ? profile.fullName.charAt(0) : 'A'}
            </button>
          </div>
        </header>

        {/* Main Content View with Semantic ID */}
        <main id="main-content" tabIndex={-1} className="flex-1 pb-16 focus:outline-none">
          {children}
        </main>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#172554]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex flex-col w-72 max-w-xs bg-[#172554] text-white shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4169E1] to-[#7664D8] flex items-center justify-center font-bold text-white text-sm">
                  G
                </div>
                <span className="font-extrabold text-base tracking-tight font-['Space_Grotesk'] text-white">
                  GRANTLY
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links in drawer */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              <button
                onClick={() => {
                  setTab('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold text-blue-200 bg-white/10 hover:bg-white/15 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Public Homepage</span>
              </button>

              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="px-3 text-[10px] uppercase font-bold text-blue-300/70 tracking-wider mb-2">
                    {group.title}
                  </p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        tab === item.id
                          ? 'bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white font-bold shadow-md shadow-[#4169E1]/35'
                          : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-900/60 text-blue-200">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="p-4 border-t border-blue-900/40 space-y-2">
              <button
                onClick={() => {
                  setShowResetConfirm(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-full border border-red-400/30 text-xs font-semibold text-red-300 hover:bg-red-500/10 text-left flex items-center justify-between transition-colors"
              >
                <span>Reset Demo State</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172554]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-[#172554] border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#172554]">Reset Demo Data?</h3>
            <p className="text-xs text-[#506184] mt-1.5 leading-relaxed">
              This will restore all default scholarships, sample student profile (Aarav Sharma), demo documents, and application tracks.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-full border border-blue-200 text-[#172554] hover:bg-[#F4F7FF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                  setTab('dashboard');
                }}
                className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/25 transition-colors"
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
