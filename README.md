# GRANTLY — Unified Scholarship Discovery & Management Platform

> **"Your future deserves funding. Let's find it."**

---

## 1. Project Overview & Tagline

**GRANTLY** is an intelligent, high-fidelity EdTech web platform engineered to transform how Indian undergraduate, postgraduate, and diploma students discover financial aid opportunities, understand rigorous statutory eligibility requirements, prepare application dossiers, and track their funding journey from start to disbursal.

* **Tagline**: *Your future deserves funding. Let's find it.*
* **Core Philosophy**: Don't just show students scholarships. Help them discover opportunities, understand their eligibility, prepare applications, and manage their entire funding journey.
* **Target Audience**: Indian undergraduate and postgraduate scholars, polytechnic diploma students, economically disadvantaged learners (EWS), first-generation college students, and STEM aspirants navigating state and central grant ecosystems.

---

## 2. Introduction

Every academic year in India, thousands of crores in government scholarships (Central Sector Scheme, AICTE Pragati, Post-Matric) and corporate/foundation aid (Reliance Foundation, Tata Trusts, HDFC Parivartan, Google APAC) go uncollected or underutilized. Indian students face an intimidating maze of fragmented portals, ambiguous income ceilings, conflicting dual-funding regulations, and repetitive documentation demands.

GRANTLY bridges this gap with a modern, consumer-grade experience inspired by Linear, Stripe, and modern EdTech. By replacing opaque guidelines with deterministic criteria diagnostics, concentric visual radars, and statutory combination conflict engines, GRANTLY turns an intimidating bureaucratic marathon into a transparent, empowering digital journey.

---

## 3. The Problem Statement

Indian students face systemic friction when seeking financial aid:

1. **Extreme Portal Fragmentation**: Notices are dispersed across the National Scholarship Portal (NSP), State Scholarship Portals (SSP Karnataka, MahaDBT, Medhavi), private charitable trusts (Tata Trusts, S.N. Bose), and corporate CSR sites (Reliance, HDFC, Aditya Birla).
2. **Opaque Eligibility Cutoffs**: Guidelines conceal critical disqualifiers (e.g., family annual income ceilings of ₹2.5 LPA vs ₹8 LPA, domicile constraints, or 10th/12th percentile cutoffs) inside 40-page PDF notifications.
3. **Dual-Funding Regulatory Penalties**: Under central government rules, receiving multiple tuition-fee reimbursements simultaneously can result in immediate disqualification, cancellation of awards, or recovery notices. Students lack tools to simulate allowable combinations.
4. **Document Exhaustion**: High-stakes certificates (Bonafide Letters, Income Certificates, Domicile Certificates, Caste Validity) are repeatedly demanded across different formats with zero guidance on certificate validity or cross-scheme reuse.
5. **Sudden Deadline Cliffs**: Application windows open and close with minimal notice, causing students to rush through document verification during server outages.

---

## 4. GRANTLY's Solution: The 6-Stage Journey

GRANTLY re-architects financial aid around a structured, motivating framework:

$$\mathbf{DISCOVER} \longrightarrow \mathbf{MATCH} \longrightarrow \mathbf{UNDERSTAND} \longrightarrow \mathbf{PREPARE} \longrightarrow \mathbf{APPLY} \longrightarrow \mathbf{TRACK}$$

- **Stage 1: DISCOVER**: Explore a curated catalog spanning Government, Private CSR, Need-based, Merit, Institutional, and International scholarships.
- **Stage 2: MATCH**: Pure, deterministic algorithmic matching that evaluates academic cutoffs, income ceilings, degree levels, gender quotas, and domicile states without black-box guesswork.
- **Stage 3: UNDERSTAND**: The **Eligibility Gap Analyzer** provides a 3-color diagnostic breakdown (Green, Amber, Red) explaining exactly why a student qualifies, what is missing, and how to unlock future grants.
- **Stage 4: PREPARE**: The **Document Vault** with **Document Reuse Intelligence** catalogs verified proofs, while the **Scholarship Stacking Simulator** flags regulatory conflicts before submission.
- **Stage 5: APPLY**: Access official application links, step-by-step portal instructions, and pre-application checklists.
- **Stage 6: TRACK**: An interactive Kanban pipeline monitoring applications through verification, college nodal attestation, state approval, and DBT (Direct Benefit Transfer) disbursal.

---

## 5. Key Platform Features

- **Public Marketing Experience**: Clean, high-impact landing page featuring a live opportunity ecosystem preview, dynamic metrics, a 6-stage journey timeline, and transparent comparison matrix.
- **Authenticated SaaS Shell**: Clean application shell with collapsible desktop sidebar, quick breadcrumbs, profile badge, quest point counter, and responsive mobile navigation.
- **Deterministic Match Engine**: Pure mathematical rules calculating criteria match percentages and providing human-readable match explanations.
- **Truth Card Modals**: Comprehensive scholarship breakdown detailing financial aid values, renewal criteria, required proofs, selection processes, and official portals.
- **Dynamic Chronological Deadlines**: Priority-coded countdowns (High: <14 days, Medium: <45 days, Low: >45 days) that automatically recalculate based on real-time dates.
- **What-If Scenario Sandbox**: Interactive sliders allowing students to simulate academic score increases and income adjustments to project unlocked scholarships.
- **Funding Quest (Gamification)**: Subtle, milestone-based achievements awarding points for profile completion, shortlisting, and document readiness.
- **GRANTLY AI Advisor**: Context-aware assistant with quick prompts to answer specific eligibility, documentation, and policy questions.

---

## 6. Signature Innovations

### A. Eligibility Gap Analyzer
Rather than presenting a binary "Eligible / Not Eligible" verdict, the Gap Analyzer diagnoses every condition:
- **Green (Met)**: Confirmed criteria matched against student profile data.
- **Amber (Missing Information)**: Criteria requiring uploaded proof (e.g. Income Certificate or Bonafide letter).
- **Red (Not Met)**: Hard constraints not currently satisfied, paired with actionable advice (e.g., *"Requires minimum 80% in qualifying exam"*).

### B. Interactive Concentric Opportunity Radar
Built as a custom SVG data visualization, the radar maps grants across 6 sectors:
- Government
- Merit-based
- Need-based
- Private CSR
- Institutional
- International
Target distance from the center bullseye corresponds directly to algorithmic match percentage (100% center match), with interactive hover inspection and an accessible list-view fallback.

### C. Scholarship Stacking Simulator & Statutory Conflict Engine
Financial planning canvas that calculates total allowable funding in Indian Rupees ($\text{₹}$). The engine evaluates:
- **Dual-Funding Bans**: Automatically detects when two central government schemes prohibit concurrent receipt for tuition.
- **Regulatory Warning Matrix**: Flags combinations requiring institutional No Objection Certificates (NOC) (e.g. State-level fee concession combined with Central merit stipend).
- **Permitted Stacking**: Pairs tuition waivers (e.g. AICTE Pragati) with non-conflicting merit cash awards (e.g. Tata Trusts or Google APAC).
- **Calculation Assumptions Disclosure**: Explicitly discloses modeling assumptions (e.g., tuition coverage caps, verified fee receipts, institutional NOCs).

### D. Multi-Formula CGPA Normalization Engine
Unlike naive platforms that assume universal $\text{CGPA} \times 9.5$, GRANTLY supports diverse Indian higher education grade conversion standards:
- **CBSE & Standard AICTE**: $\text{Percentage} = \text{CGPA} \times 9.5$
- **Revised AICTE Formula**: $\text{Percentage} = (\text{CGPA} - 0.75) \times 10$
- **Linear 10-Point Scale**: $\text{Percentage} = \text{CGPA} \times 10$ (used by IITs, NITs, and autonomous universities)
- **Custom Institutional Multiplier**: For universities with idiosyncratic transcript backsheet conversion tables.
- **Transparent Disclosure**: Every scholarship card discloses the exact formula applied and reminds students to verify official grade-to-percentage conversion certificates.

### E. Timezone-Safe Deadline Intelligence & Urgency Categorization
- Timezone-safe UTC midnight calculation preventing intra-day day-shift bugs.
- Strict urgency stratification: **High Priority** (1–14 days remaining), **Medium Priority** (15–45 days remaining), **Low Priority** (>45 days remaining), and dedicated **Closed / Expired** classification (closed scholarships are never mistakenly flagged as urgent High priority).

### F. Document Vault & Reuse Intelligence
Analyzes uploaded certificates and highlights reuse opportunities across the student's saved list (e.g., *"Your Revenue Department Income Certificate is accepted by 4 saved schemes without re-issuance"*).

---

## 7. Screenshots & Interface Previews

> *The interface has been engineered with Tailwind CSS, Space Grotesk headings, and Plus Jakarta Sans body typography.*

```
+----------------------------------------------------------------------------------------------------+
|  GRANTLY  [Discover] [Gap Analyzer] [Radar] [Stacking] [Journey] [Vault]   [Aarav Sharma | 1,450 pts] |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [Student Overview]                                                                                |
|  YOUR FUTURE IS WORTH INVESTING IN.                                                               |
|  Welcome back, Aarav Sharma! Matched with 9 verified opportunities totaling ₹4,20,000.              |
|                                                                                                    |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|  | Matched Grants     |  | Potential Funding  |  | Saved Shortlist    |  | Closing Soon        |  |
|  | 9 Schemes          |  | ₹4,20,000          |  | 4 Opportunities    |  | 3 Deadlines         |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|                                                                                                    |
|  [Opportunity Radar]               [Scholarship Stacking Simulator]                                |
|  Concentric SVG Radar Slices       Real-Time Dual-Funding Policy Conflict Detection                |
|  (Government, Merit, CSR)          Max Allowable Funding Calculation & Warning Engine              |
+----------------------------------------------------------------------------------------------------+
```

---

## 8. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Bundler & Tooling** | Vite 8, `tsx` (TypeScript Execute) |
| **Styling & Design System** | Tailwind CSS v4, Plus Jakarta Sans, Space Grotesk |
| **Icons & Visuals** | Lucide React |
| **Animations & Confetti** | Motion (Framer Motion v12), Canvas Confetti |
| **Test Suite** | Node.js Built-in Test Runner (`node:test`, `node:assert/strict`) |
| **State & Persistence** | React Context API with automatic `localStorage` synchronization |

---

## 9. Application Architecture

```
+------------------------------------------------------------------------------------+
|                                     App.tsx                                        |
|             (Routes between Marketing Landing and Authenticated AppShell)          |
+-----------------------------------------+------------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                                                   |
        v                                                                   v
+-----------------------+                                         +-------------------+
|   PublicNavbar.tsx    |                                         |   AppShell.tsx    |
|   LandingPage.tsx     |                                         | (Sidebar, Header, |
|   Footer.tsx          |                                         |  Breadcrumbs)     |
+-----------------------+                                         +---------+---------+
                                                                            |
                   +--------------------------------------------------------+
                   |
                   v
+-------------------------------------------------------------------------------------+
| Views:                                                                              |
| - DashboardView.tsx               - OpportunityRadarView.tsx                       |
| - DiscoverView.tsx                - ScholarshipStackingSimulatorView.tsx            |
| - EligibilityGapAnalyzerView.tsx  - DocumentVaultView.tsx                          |
| - ScholarshipJourneyView.tsx      - DeadlineIntelligenceView.tsx                    |
| - WhatIfExplorerView.tsx          - ProfileSettingsView.tsx                         |
| - GrantlyAIAssistant.tsx          - FundingQuestModal.tsx                           |
+-----------------------------------------+-------------------------------------------+
                                          |
                                          v
+-------------------------------------------------------------------------------------+
| Context & Core Pure Utilities (Decoupled, Deterministic & Unit Tested):            |
| - AppContext.tsx (Global State, Sync & Reset)                                       |
| - utils/matching.ts (Deterministic Scoring, Criteria Diagnostics, INR Formatter)   |
| - utils/stacking.ts (Multi-Scholarship Conflict & Statutory Combination Engine)    |
| - utils/dates.ts (Dynamic Countdown Calculations & Urgency Priority Mapping)       |
+-------------------------------------------------------------------------------------+
```

---

## 10. Project Folder Structure

```
├── index.html                   # HTML entry point with web fonts & metadata
├── metadata.json                # Project capabilities & permissions
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration with Tailwind plugin
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root orchestrator & tab routing
│   ├── index.css                # Tailwind CSS v4 setup & custom tokens
│   ├── types/
│   │   └── scholarship.ts       # Full TypeScript schemas for grants, profiles, and tracks
│   ├── data/
│   │   └── scholarships.ts      # Curated dataset of 12 verified Indian scholarships
│   ├── context/
│   │   └── AppContext.tsx       # Global state management with localStorage synchronization
│   ├── utils/
│   │   ├── matching.ts          # Pure deterministic matching & criteria gap engine
│   │   ├── matching.test.ts     # Automated unit test suite (node:test)
│   │   ├── stacking.ts          # Statutory combination & dual-receipt conflict engine
│   │   └── dates.ts             # Dynamic date math & countdown formatter
│   └── components/
│       ├── PublicNavbar.tsx     # Public marketing header with anchors & CTA
│       ├── AppShell.tsx         # Dedicated authenticated SaaS layout with collapsible sidebar
│       ├── LandingPage.tsx      # Flagship marketing homepage & interactive ecosystem
│       ├── DashboardView.tsx    # Student overview, KPIs, and recent activity log
│       ├── DiscoverView.tsx     # Filterable scholarship catalog with grid/table toggle
│       ├── OpportunityRadarView.tsx # Concentric SVG Opportunity Radar
│       ├── EligibilityGapAnalyzerView.tsx # 3-color diagnostic & criteria breakdown
│       ├── ScholarshipStackingSimulatorView.tsx # Stacking simulator & conflict engine
│       ├── DocumentVaultView.tsx # Secure repository & Document Reuse Intelligence
│       ├── DeadlineIntelligenceView.tsx # Chronological countdowns & action checklist
│       ├── ScholarshipJourneyView.tsx # 6-stage kanban application tracker
│       ├── WhatIfExplorerView.tsx # Interactive sandbox with predictive sliders
│       ├── GrantlyAIAssistant.tsx # Rule-based / AI scholarship advisor
│       ├── ScholarshipDetailModal.tsx # Comprehensive Truth Card modal
│       ├── OnboardingModal.tsx  # 4-step progressive disclosure wizard
│       ├── FundingQuestModal.tsx # Gamification milestones & celebration
│       ├── ProfileSettingsView.tsx # Profile editor & demo data reset
│       └── Footer.tsx           # Platform footer with statutory notices
```

---

## 11. Installation Instructions

Ensure you have **Node.js (v20+ or v22+)** and **npm** installed.

```bash
# Clone the repository
git clone <repository-url>
cd grantly

# Install all required dependencies
npm install
```

---

## 12. Development Commands

To run the local development server:

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

---

## 13. Build Instructions

To compile and produce an optimized production bundle:

```bash
npm run build
```

This executes Vite's build pipeline and generates the static distribution assets in the `/dist` directory.

---

## 14. Testing Instructions

GRANTLY features pure, deterministic business logic for scholarship matching and conflict detection. All unit tests run using Node.js's built-in test runner (`node:test`) and assertion library (`node:assert/strict`) with zero external test runner overhead:

```bash
npx --yes tsx --test src/utils/matching.test.ts
```

### Test Coverage Highlights:
- **CGPA Conversion Normalization**: Verifies standard CBSE/AICTE 9.5, revised AICTE formula, linear 10-point scale (IIT/NIT), and custom factors with clamping and decimal rounding.
- **Strict Ineligibility Evaluation**: Confirms that hard requirement failures (e.g. low score, high income, gender mismatch) immediately trigger `INELIGIBLE` and cap match % to $\le 35\%$, never allowing high match percentages to mask a disqualification.
- **Statutory Stacking & Conflict Detection**: Confirms dual central tuition award blocks while preserving highest-paying award and disclosing modeling assumptions.
- **Timezone-Safe Date Math**: Verifies countdowns, midnight normalization, and strict `EXPIRED` status mapping for past/closed deadlines.
- **Indian Rupee Formatting**: Validates proper comma grouping and currency symbol placement ($\text{₹}$).

---

## 15. Deployment Instructions

GRANTLY is built as a standards-compliant Single Page Application (SPA). It can be deployed to any modern static hosting service:

- **Cloud Run / Container**: Dockerize with an `nginx:alpine` image serving the `/dist` directory.
- **Vercel / Netlify / Cloudflare Pages**: Set build command to `npm run build` and publish directory to `dist`.
- **Single Page Rewrite Rule**: Ensure all non-static paths rewrite to `/index.html` for client-side routing.

---

## 16. Demo Data Explanation

To enable immediate testing without requiring real bank details or government portal logins, GRANTLY ships with realistic seed data:

- **Curated Dataset (12 Indian Scholarships)**:
  1. *Reliance Foundation Undergraduate Scholarship* (₹2,00,000 / Merit-cum-Means)
  2. *AICTE Pragati Scholarship for Girls* (₹50,000 / AICTE Tech)
  3. *Tata Trusts Medical and Healthcare Grant* (₹1,50,000 / Healthcare)
  4. *Central Sector Scheme of Scholarships (CSSS)* (₹20,000 / Central Govt)
  5. *HDFC Bank Parivartan's ECSS Programme* (₹75,000 / CSR Need-based)
  6. *Google APAC Generation Google Scholarship* (₹2,10,000 / Women in Tech)
  7. *Foundation for Excellence (FFE) STEM Grant* (₹50,000 / Professional STEM)
  8. *Post-Matric Scholarship Scheme for SC/ST Students* (₹60,000 / State & Central)
  9. *S.N. Bose Scholars Program* (₹3,00,000 / International Exchange)
  10. *Aditya Birla Capital Scholarship* (₹60,000 / Higher Education)
  11. *Karnataka State Post-Matric Vidyasiri* (₹35,000 / State Domicile)
  12. *Vidyasaarathi ACC Vidyasaarathi Scholarship* (₹40,000 / Corporate CSR)

- **Default Student Profile**:
  - **Name**: Aarav Sharma
  - **Level**: Undergraduate (2nd Year B.Tech Computer Science)
  - **Institution**: National Institute of Technology Karnataka (NITK Surathkal)
  - **Academic Score**: 84.5% (CGPA 8.8)
  - **Annual Family Income**: ₹3,80,000
  - **Domicile**: Karnataka
  - **Categories**: General, First Generation Learner

---

## 17. Data Persistence Explanation

GRANTLY utilizes reactive `localStorage` persistence under the namespace key `grantly_app_state_v1`:
- **State Stored**: Student profile attributes, saved scholarship IDs, uploaded document metadata, and active application pipeline stages.
- **Privacy Assurance**: All student data remains entirely within the student's browser sandbox; no unencrypted personally identifiable information (PII) is transmitted to third-party tracking services.
- **Demo Reset**: A one-click **"Reset Demo Data"** button is embedded in the Sidebar, Navbar, and Profile Settings to restore the default sample student profile at any time.

---

## 18. Known Limitations

1. **Simulated Document Verification**: The Document Vault checks document types, file sizes, and names; it does not currently invoke government DigiLocker APIs for cryptographic certificate signatures.
2. **Statutory Portal Redirection**: Direct application submission redirects to official government portals (NSP, SSP, Tata Trusts) as external portal authentication requires student Aadhaar OTPs.
3. **Disbursal Timeline Variations**: Government DBT timelines are estimated based on previous fiscal cycles and may shift due to state treasury schedules.

---

## 19. Future Roadmap

- [ ] **DigiLocker 1-Click Verification**: Direct integration with National DigiLocker API to import tamper-proof Aadhaar-verified caste and income certificates.
- [ ] **WhatsApp & SMS Deadline Alerts**: Proactive reminders triggered 7 days and 48 hours prior to state portal closure.
- [ ] **Direct Institutional Attestation Bridge**: College Nodal Officer dashboard allowing college administrators to digitally stamp bonafide letters directly in the student's vault.
- [ ] **Multi-Language Regional Support**: Full localization in Hindi, Kannada, Tamil, Telugu, Marathi, and Bengali.

---

## 20. Accessibility & Responsiveness Notes

- **Color Contrast**: All primary text, labels, and badges comply with WCAG 2.1 AA contrast ratios (minimum 4.5:1 against light and dark backgrounds).
- **Semantic HTML & Focus**: Native buttons, form labels, dialog ARIA attributes, and visible focus rings on interactive elements.
- **Mobile Responsive**: Fully tested across mobile viewports (390px, 414px) and desktop displays (1080p, 1440p) with zero horizontal overflow and touch-friendly targets.
- **Alternative Text**: Screen-reader accessible alternative views provided for complex charts, including a toggleable list-view for the Concentric Opportunity Radar.

---

## 21. License Information

This project is licensed under the **Apache-2.0 License**. See the `LICENSE` file for details.
