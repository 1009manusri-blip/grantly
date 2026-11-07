import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setTab, resetDemoData, setShowOnboardingModal } = useApp();

  return (
    <footer className="bg-[#172554] text-blue-200 border-t border-blue-900/50 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-blue-900/40">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4169E1] via-[#5B54E0] to-[#7664D8] flex items-center justify-center font-bold text-white font-['Space_Grotesk'] text-base shadow-md">
                G
              </div>
              <span className="font-bold text-xl tracking-tight text-white font-['Space_Grotesk']">GRANTLY</span>
            </div>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Your future deserves funding. Let's find it. Simplifying discovery, transparent eligibility matching, and application journeys for Indian students.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-blue-300">
              <ShieldCheck className="w-4 h-4 text-[#B9E8D4]" />
              <span>Transparent Deterministic Rules</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Discovery & Analysis</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setTab('discover')} className="hover:text-white transition-colors text-blue-200/80">
                  Scholarship Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setTab('radar')} className="hover:text-white transition-colors text-blue-200/80">
                  Opportunity Radar
                </button>
              </li>
              <li>
                <button onClick={() => setTab('analyzer')} className="hover:text-white transition-colors text-blue-200/80">
                  Eligibility Gap Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => setTab('whatif')} className="hover:text-white transition-colors text-blue-200/80">
                  What-If Scenario Sandbox
                </button>
              </li>
            </ul>
          </div>

          {/* Management Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Application Management</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setTab('stacking')} className="hover:text-white transition-colors text-blue-200/80">
                  Scholarship Stacking Simulator
                </button>
              </li>
              <li>
                <button onClick={() => setTab('journey')} className="hover:text-white transition-colors text-blue-200/80">
                  6-Stage Journey Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setTab('vault')} className="hover:text-white transition-colors text-blue-200/80">
                  Document Vault & Reuse Intel
                </button>
              </li>
              <li>
                <button onClick={() => setTab('deadlines')} className="hover:text-white transition-colors text-blue-200/80">
                  Deadline Intelligence
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Operations</h4>
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="w-full py-2.5 px-3.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-blue-100 border border-white/15 text-left transition-colors flex items-center justify-between"
            >
              <span>Retake Onboarding Profile</span>
              <Sparkles className="w-3.5 h-3.5 text-[#4169E1]" />
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all demo state to fresh default sample profile?')) {
                  resetDemoData();
                  setTab('dashboard');
                }
              }}
              className="w-full py-2.5 px-3.5 rounded-full text-xs font-medium text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-400/30 text-left transition-colors flex items-center justify-between"
            >
              <span>Reset Demo State</span>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-blue-300/80 leading-normal pt-1">
              Sample data shown in Indian Rupees (₹). Official guidelines must be verified directly with issuing government ministries and trusts before formal submission.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70">
          <p>© {new Date().getFullYear()} GRANTLY Technologies. Built for student educational equity.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>DISCOVER</span>
            <span aria-hidden="true">·</span>
            <span>MATCH</span>
            <span aria-hidden="true">·</span>
            <span>UNDERSTAND</span>
            <span aria-hidden="true">·</span>
            <span>PREPARE</span>
            <span aria-hidden="true">·</span>
            <span>APPLY</span>
            <span aria-hidden="true">·</span>
            <span>TRACK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
