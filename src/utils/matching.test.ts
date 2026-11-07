import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScholarshipMatch, formatINR, getCgpaFormulaLabel, normalizeToPercentage } from './matching';
import { simulateScholarshipStacking } from './stacking';
import { calculateDaysRemaining, formatCountdown, getPriorityLevel } from './dates';
import { computeComparisonHighlights } from './comparison';
import { parseScholarshipNotice, SAMPLE_SCHOLARSHIP_NOTICES } from './translator';
import { Scholarship, StudentProfile, UserDocument } from '../types/scholarship';

const mockProfile: StudentProfile = {
  id: 'student-1',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@example.edu.in',
  phone: '+91 98765 43210',
  educationLevel: 'Undergraduate',
  degree: 'B.Tech / B.E.',
  courseStream: 'Computer Science and Engineering',
  currentYear: 2,
  institution: 'National Institute of Technology',
  academicScoreType: 'percentage',
  academicScore: 84.5,
  cgpaFormula: 'standard_9_5',
  customCgpaMultiplier: 9.5,
  prevScore12th: 89.0,
  prevScore10th: 92.4,
  achievements: ['Smart India Hackathon Finalist', 'State Science Olympiad Silver'],
  annualFamilyIncome: 450000,
  financialAssistanceNeed: 'medium',
  stateDomicile: 'Karnataka',
  categories: ['General', 'EWS'],
  gender: 'Male',
  isOnboarded: true,
  savedScholarshipIds: [],
};

const mockScholarship: Scholarship = {
  id: 'sch-1',
  name: 'National Merit STEM Opportunity',
  provider: 'Ministry of Education',
  providerType: 'Government',
  category: 'Merit-based',
  amount: 50000,
  amountType: 'Per Year',
  amountFormatted: '₹50,000 / year',
  deadline: '2026-12-15',
  description: 'National award for top STEM undergraduate students.',
  longDescription: 'Comprehensive financial support for engineering and scientific research.',
  minPercentage: 80,
  maxFamilyIncome: 600000,
  eligibleLevels: ['Undergraduate'],
  eligibleDegrees: ['B.Tech / B.E.', 'B.Sc'],
  eligibleStates: ['All'],
  eligibleCategories: ['All'],
  eligibleGender: 'All',
  requiredDocuments: ['Income Certificate', 'Academic Transcript / Marksheet', 'Bonafide Student Certificate'],
  combinationRestrictions: {
    allowsStacking: true,
    stackingNotes: 'Can be combined with institutional waivers, but not other Central government scholarships.',
    conflictsWith: ['Central Sector Scheme', 'Post-Matric Scholarship Scheme'],
  },
  applicationUrl: 'https://scholarships.gov.in',
  officialSourceUrl: 'https://scholarships.gov.in/guidelines',
  lastVerifiedDate: '2026-10-15',
  verificationStatus: 'Official Source Verified',
  tags: ['Engineering', 'Merit', 'Government'],
  applicationSteps: [
    { step: 1, title: 'Portal Registration', instruction: 'Register using Aadhaar on National Scholarship Portal.' },
  ],
  difficultyRating: 'Moderate',
};

test('normalizeToPercentage converts CGPA across institutional conversion formulas', () => {
  // CBSE / AICTE Standard: CGPA * 9.5
  assert.equal(normalizeToPercentage(9.0, 'cgpa', 'standard_9_5'), 85.5);

  // AICTE Revised: (CGPA - 0.75) * 10
  assert.equal(normalizeToPercentage(9.0, 'cgpa', 'aicte_revised'), 82.5);

  // 10-Point Linear: CGPA * 10 (IIT/NIT)
  assert.equal(normalizeToPercentage(9.0, 'cgpa', 'linear_10'), 90.0);

  // Custom multiplier: CGPA * customMultiplier
  assert.equal(normalizeToPercentage(8.5, 'cgpa', 'custom', 9.0), 76.5);

  // Direct percentage handles clamping and rounding
  assert.equal(normalizeToPercentage(88.54, 'percentage'), 88.5);
  assert.equal(normalizeToPercentage(110, 'percentage'), 100);
  assert.equal(normalizeToPercentage(-5, 'percentage'), 0);
});

test('getCgpaFormulaLabel returns descriptive labels', () => {
  assert.match(getCgpaFormulaLabel('standard_9_5'), /CBSE \/ AICTE Standard/);
  assert.match(getCgpaFormulaLabel('aicte_revised'), /AICTE Revised/);
  assert.match(getCgpaFormulaLabel('linear_10'), /10-Point Linear Scale/);
  assert.match(getCgpaFormulaLabel('custom', 9.2), /Custom Multiplier/);
});

test('formatINR formats currency in Indian numbering system', () => {
  const formatted = formatINR(50000);
  assert.match(formatted, /50,000/);
});

test('evaluateScholarshipMatch returns ELIGIBLE when all criteria are met', () => {
  const result = evaluateScholarshipMatch(mockScholarship, mockProfile);
  assert.equal(result.status, 'ELIGIBLE');
  assert.equal(result.matchPercentage, 100);
  assert.equal(result.criteriaBreakdown.every((c) => c.status === 'satisfied'), true);
});

test('evaluateScholarshipMatch strictly flags INELIGIBLE and caps match % when hard criteria fail', () => {
  const lowScoreProfile = { ...mockProfile, academicScore: 72.0 };
  const result = evaluateScholarshipMatch(mockScholarship, lowScoreProfile);
  assert.equal(result.status, 'INELIGIBLE');
  // Strict rule: match % cannot be high when ineligible
  assert.ok(result.matchPercentage <= 35);
  const academicCheck = result.criteriaBreakdown.find((c) => c.name === 'Academic Threshold');
  assert.equal(academicCheck?.status, 'not_satisfied');
  assert.ok(result.unlockedFutureRequirements.length > 0);
});

test('evaluateScholarshipMatch flags INELIGIBLE when income exceeds limit', () => {
  const highIncomeProfile = { ...mockProfile, annualFamilyIncome: 800000 };
  const result = evaluateScholarshipMatch(mockScholarship, highIncomeProfile);
  assert.equal(result.status, 'INELIGIBLE');
  const incomeCheck = result.criteriaBreakdown.find((c) => c.name === 'Family Income Ceiling');
  assert.equal(incomeCheck?.status, 'not_satisfied');
});

test('evaluateScholarshipMatch respects gender restriction', () => {
  const womenScholarship: Scholarship = {
    ...mockScholarship,
    id: 'sch-women',
    eligibleGender: 'Female',
  };
  const result = evaluateScholarshipMatch(womenScholarship, mockProfile);
  assert.equal(result.status, 'INELIGIBLE');
  const genderCheck = result.criteriaBreakdown.find((c) => c.name === 'Gender Eligibility');
  assert.equal(genderCheck?.status, 'not_satisfied');
});

test('evaluateScholarshipMatch handles CGPA evaluation using profile formula', () => {
  // 8.5 CGPA with standard 9.5 formula = 80.8% >= 80% (ELIGIBLE)
  const cgpaProfile: StudentProfile = {
    ...mockProfile,
    academicScoreType: 'cgpa',
    academicScore: 8.5,
    cgpaFormula: 'standard_9_5',
  };
  const result = evaluateScholarshipMatch(mockScholarship, cgpaProfile);
  assert.equal(result.status, 'ELIGIBLE');

  // With aicte_revised ((8.5 - 0.75) * 10 = 77.5%), it fails 80% cutoff -> INELIGIBLE
  const aicteProfile: StudentProfile = {
    ...mockProfile,
    academicScoreType: 'cgpa',
    academicScore: 8.5,
    cgpaFormula: 'aicte_revised',
  };
  const aicteResult = evaluateScholarshipMatch(mockScholarship, aicteProfile);
  assert.equal(aicteResult.status, 'INELIGIBLE');
});

test('simulateScholarshipStacking detects conflicts and exposes assumptions', () => {
  const govtSch2: Scholarship = {
    ...mockScholarship,
    id: 'sch-2',
    name: 'Central Sector Scheme of Scholarships',
    amount: 20000,
  };
  const result = simulateScholarshipStacking([mockScholarship, govtSch2]);
  assert.equal(result.hasBlockingConflicts, true);
  assert.ok(result.conflicts.length > 0);
  assert.equal(result.grossPotentialFunding, 70000);
  // Allowable keeps highest government award
  assert.equal(result.allowableStackedFunding, 50000);
  // Assumptions are disclosed
  assert.ok(result.assumptions.length >= 3);
});

test('calculateDaysRemaining and getPriorityLevel handle deadlines and expired dates safely', () => {
  const reference = new Date('2026-11-06T12:00:00Z');

  // 10 days in future: HIGH
  const days10 = calculateDaysRemaining('2026-11-16', reference);
  assert.equal(days10, 10);
  assert.equal(getPriorityLevel(days10), 'HIGH');

  // 30 days in future: MEDIUM
  const days30 = calculateDaysRemaining('2026-12-06', reference);
  assert.equal(days30, 30);
  assert.equal(getPriorityLevel(days30), 'MEDIUM');

  // 60 days in future: LOW
  const days60 = calculateDaysRemaining('2027-01-05', reference);
  assert.equal(getPriorityLevel(days60), 'LOW');

  // Past date: MUST BE EXPIRED, NEVER HIGH
  const pastDays = calculateDaysRemaining('2026-08-31', reference);
  assert.ok(pastDays < 0);
  assert.equal(getPriorityLevel(pastDays), 'EXPIRED');

  // Invalid / missing string safety
  assert.equal(getPriorityLevel(calculateDaysRemaining('')), 'EXPIRED');
  assert.equal(getPriorityLevel(calculateDaysRemaining(undefined)), 'EXPIRED');
});

test('formatCountdown outputs accurate human-readable status', () => {
  assert.equal(formatCountdown(-5), 'Application closed');
  assert.equal(formatCountdown(0), 'Closing today');
  assert.equal(formatCountdown(1), 'Closing tomorrow');
  assert.equal(formatCountdown(12), '12 days left');
  assert.equal(formatCountdown(65), '~2 months left');
  assert.equal(formatCountdown(-9999), 'Deadline TBD');
});

test('evaluateScholarshipMatch respects state domicile requirements', () => {
  const karnatakaScholarship: Scholarship = {
    ...mockScholarship,
    id: 'sch-karnataka-scheme',
    name: 'Karnataka State Post-Matric Fee Waiver',
    eligibleStates: ['Karnataka'],
  };

  // Profile with matching domicile 'Karnataka'
  const matchingResult = evaluateScholarshipMatch(karnatakaScholarship, mockProfile);
  assert.equal(matchingResult.status, 'ELIGIBLE');
  const domicileCheck = matchingResult.criteriaBreakdown.find((c) => c.name === 'State / Domicile Eligibility');
  assert.equal(domicileCheck?.status, 'satisfied');

  // Profile with mismatched domicile 'Maharashtra'
  const nonMatchingResult = evaluateScholarshipMatch(karnatakaScholarship, {
    ...mockProfile,
    stateDomicile: 'Maharashtra',
  });
  assert.equal(nonMatchingResult.status, 'INELIGIBLE');
  assert.ok(nonMatchingResult.matchPercentage <= 35);
  const failedDomicileCheck = nonMatchingResult.criteriaBreakdown.find((c) => c.name === 'State / Domicile Eligibility');
  assert.equal(failedDomicileCheck?.status, 'not_satisfied');

  // Profile with missing domicile
  const missingDomicileResult = evaluateScholarshipMatch(karnatakaScholarship, {
    ...mockProfile,
    stateDomicile: undefined,
  });
  assert.equal(missingDomicileResult.status, 'POTENTIALLY ELIGIBLE');
  const missingDomicileCheck = missingDomicileResult.criteriaBreakdown.find((c) => c.name === 'State / Domicile Eligibility');
  assert.equal(missingDomicileCheck?.status, 'missing_info');
});

test('evaluateScholarshipMatch flags unverified CGPA formula as missing_info to prevent false eligibility', () => {
  const unknownFormulaProfile: StudentProfile = {
    ...mockProfile,
    academicScoreType: 'cgpa',
    academicScore: 9.2,
    cgpaFormula: 'unknown',
  };

  const result = evaluateScholarshipMatch(mockScholarship, unknownFormulaProfile);
  // Even with 9.2 CGPA, unknown formula cannot be guaranteed as meeting 80% cutoff without verification
  assert.notEqual(result.status, 'ELIGIBLE');
  assert.equal(result.status, 'POTENTIALLY ELIGIBLE');
  const academicCheck = result.criteriaBreakdown.find((c) => c.name === 'Academic Threshold');
  assert.equal(academicCheck?.status, 'missing_info');
  assert.match(academicCheck?.message || '', /university conversion formula is unverified/);
});

test('evaluateScholarshipMatch handles empty or null profile safely without crashing', () => {
  const emptyResult = evaluateScholarshipMatch(mockScholarship, null);
  assert.equal(emptyResult.status, 'INSUFFICIENT INFORMATION');
  assert.equal(emptyResult.matchPercentage, 0);
  assert.equal(emptyResult.criteriaBreakdown[0].name, 'Profile Incomplete');

  const partialResult = evaluateScholarshipMatch(mockScholarship, { fullName: 'Incomplete User' });
  assert.equal(partialResult.status, 'INSUFFICIENT INFORMATION');
  assert.equal(partialResult.matchPercentage, 0);
});

test('simulateScholarshipStacking correctly categorizes 4 severity levels', () => {
  const centralGovt1: Scholarship = {
    ...mockScholarship,
    id: 'g1',
    name: 'AICTE Pragati Scheme',
    providerType: 'Government',
    tags: ['National', 'AICTE'],
    combinationRestrictions: { allowsStacking: false, stackingNotes: 'No other central scheme', conflictsWith: [] },
  };

  const centralGovt2: Scholarship = {
    ...mockScholarship,
    id: 'g2',
    name: 'Central Sector Scholarship Scheme',
    providerType: 'Government',
    tags: ['National', 'Ministry'],
    combinationRestrictions: { allowsStacking: false, stackingNotes: 'No other central scheme', conflictsWith: [] },
  };

  const privateA: Scholarship = {
    ...mockScholarship,
    id: 'p1',
    name: 'Reliance Foundation Grant',
    providerType: 'Private',
    combinationRestrictions: { allowsStacking: true, stackingNotes: 'Can be held concurrently with government tuition waivers', conflictsWith: [] },
    verificationStatus: 'Official Source Verified',
  };

  const privateB: Scholarship = {
    ...mockScholarship,
    id: 'p2',
    name: 'Tata Healthcare Fellowship',
    providerType: 'Foundation',
    combinationRestrictions: { allowsStacking: true, stackingNotes: 'Stacks concurrently with college concessions', conflictsWith: [] },
    verificationStatus: 'Official Source Verified',
  };

  const demoScholarship: Scholarship = {
    ...mockScholarship,
    id: 'd1',
    name: 'Corporate Demo Aid',
    providerType: 'Private',
    combinationRestrictions: { allowsStacking: true, stackingNotes: '', conflictsWith: [] },
    verificationStatus: 'Demo Information',
  };

  // 1. Confirmed conflict between dual central govt schemes
  const conflictResult = simulateScholarshipStacking([centralGovt1, centralGovt2]);
  assert.equal(conflictResult.hasBlockingConflicts, true);
  assert.equal(conflictResult.conflicts[0].severity, 'conflict');
  assert.equal(conflictResult.conflicts[0].statusLabel, 'Confirmed Conflict');

  // 2. No known conflict between complementary private foundation grants with explicit concurrent rules
  const infoResult = simulateScholarshipStacking([privateA, privateB]);
  assert.equal(infoResult.hasBlockingConflicts, false);
  assert.equal(infoResult.conflicts[0].severity, 'info');
  assert.equal(infoResult.conflicts[0].statusLabel, 'No Known Conflict');

  // 3. Insufficient info when pairing with Demo Information
  const demoResult = simulateScholarshipStacking([privateA, demoScholarship]);
  assert.ok(demoResult.conflicts.some((c) => c.severity === 'insufficient_info' && c.statusLabel === 'Insufficient Information'));
});

test('simulateScholarshipStacking provides optimizationStrategy recommendation on conflicting schemes', () => {
  const higherGovt: Scholarship = {
    ...mockScholarship,
    id: 'g-high',
    name: 'National Merit High Scheme',
    providerType: 'Government',
    amount: 80000,
    tags: ['National'],
    combinationRestrictions: { allowsStacking: false, stackingNotes: 'No other central scheme', conflictsWith: [] },
  };

  const lowerGovt: Scholarship = {
    ...mockScholarship,
    id: 'g-low',
    name: 'State Central Subsidiary Scheme',
    providerType: 'Government',
    amount: 25000,
    tags: ['National'],
    combinationRestrictions: { allowsStacking: false, stackingNotes: 'No other central scheme', conflictsWith: [] },
  };

  const result = simulateScholarshipStacking([higherGovt, lowerGovt]);
  assert.equal(result.hasBlockingConflicts, true);
  assert.ok(result.optimizationStrategy);
  assert.match(result.optimizationStrategy, /National Merit High Scheme/);
  assert.match(result.optimizationStrategy, /80,000/);
});

test('computeComparisonHighlights identifies correct highlight badges across compared scholarships', () => {
  const schLow: Scholarship = {
    ...mockScholarship,
    id: 'c-low',
    name: 'Small Fellowship',
    amount: 15000,
    difficultyRating: 'Straightforward',
    deadline: '2026-11-20',
  };

  const schHigh: Scholarship = {
    ...mockScholarship,
    id: 'c-high',
    name: 'Mega Industry Grant',
    amount: 250000,
    difficultyRating: 'Extensive',
    deadline: '2026-12-28',
  };

  const schMid: Scholarship = {
    ...mockScholarship,
    id: 'c-mid',
    name: 'Balanced Award',
    amount: 75000,
    difficultyRating: 'Moderate',
    deadline: '2026-11-25',
  };

  const highlights = computeComparisonHighlights([schLow, schHigh, schMid], mockProfile, []);

  // 1. Best financial should be highest amount (schHigh: 250000)
  assert.equal(highlights.bestFinancial?.id, 'c-high');

  // 2. Least complicated should be easiest rating ('Straightforward' -> schLow)
  assert.equal(highlights.leastComplicated?.id, 'c-low');

  // 3. Nearest deadline should be nearest date ('2026-11-20' -> schLow)
  assert.equal(highlights.nearestDeadline?.id, 'c-low');

  // 4. Best match and Best overall should be defined
  assert.ok(highlights.bestMatch);
  assert.ok(highlights.bestOverall);
});

test('parseScholarshipNotice accurately extracts parameters from official notices', () => {
  const sampleNotice = SAMPLE_SCHOLARSHIP_NOTICES[0].text; // CSSS notice
  const extracted = parseScholarshipNotice(sampleNotice);

  assert.ok(extracted.schemeTitle);
  assert.match(extracted.schemeTitle, /Central Sector Scheme|CSSS/i);
  assert.equal(extracted.minPercentage, 60);
  assert.equal(extracted.maxIncome, 450000);
  assert.ok(extracted.deadline);
  assert.match(extracted.deadline, /2026-11-25/);
  assert.ok(extracted.amountFormatted);
  assert.ok(extracted.requiredDocuments.length > 0);
  assert.ok(extracted.confidence >= 50);
});

test('parseScholarshipNotice returns safe fallback on empty or unintelligible notice', () => {
  const extracted = parseScholarshipNotice('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  assert.equal(extracted.confidence, 0);
  assert.equal(extracted.minPercentage, null);
  assert.equal(extracted.maxIncome, null);
  assert.equal(extracted.requiredDocuments.length, 0);
});


