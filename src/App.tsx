/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicNavbar } from './components/PublicNavbar';
import { AppShell } from './components/AppShell';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { DiscoverView } from './components/DiscoverView';
import { OpportunityRadarView } from './components/OpportunityRadarView';
import { EligibilityGapAnalyzerView } from './components/EligibilityGapAnalyzerView';
import { ScholarshipStackingSimulatorView } from './components/ScholarshipStackingSimulatorView';
import { ScholarshipJourneyView } from './components/ScholarshipJourneyView';
import { DocumentVaultView } from './components/DocumentVaultView';
import { DeadlineIntelligenceView } from './components/DeadlineIntelligenceView';
import { WhatIfExplorerView } from './components/WhatIfExplorerView';
import { GrantlyAIAssistant } from './components/GrantlyAIAssistant';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { OnboardingModal } from './components/OnboardingModal';
import { FundingQuestModal } from './components/FundingQuestModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { tab } = useApp();

  if (tab === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4F7FF] via-[#EAF1FF]/40 to-[#F4F7FF] text-[#172554] font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#4169E1] focus:text-white focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold"
        >
          Skip to main content
        </a>

        {/* Dedicated Public Marketing Header */}
        <PublicNavbar />

        {/* High-Converting Marketing Landing Page */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <LandingPage />
        </main>

        {/* Global Editorial Footer */}
        <Footer />

        {/* Modals & Ambient Drawer */}
        <ScholarshipDetailModal />
        <OnboardingModal />
        <FundingQuestModal />
        <GrantlyAIAssistant isDrawer={true} />
      </div>
    );
  }

  return (
    <AppShell>
      {tab === 'dashboard' && <DashboardView />}
      {tab === 'discover' && <DiscoverView />}
      {tab === 'radar' && <OpportunityRadarView />}
      {tab === 'analyzer' && <EligibilityGapAnalyzerView />}
      {tab === 'stacking' && <ScholarshipStackingSimulatorView />}
      {tab === 'journey' && <ScholarshipJourneyView />}
      {tab === 'vault' && <DocumentVaultView />}
      {tab === 'deadlines' && <DeadlineIntelligenceView />}
      {tab === 'whatif' && <WhatIfExplorerView />}
      {tab === 'assistant' && <GrantlyAIAssistant isDrawer={false} />}
      {tab === 'profile' && <ProfileSettingsView />}

      {/* Modals & Ambient Drawer */}
      <ScholarshipDetailModal />
      <OnboardingModal />
      <FundingQuestModal />
      <GrantlyAIAssistant isDrawer={true} />
    </AppShell>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
