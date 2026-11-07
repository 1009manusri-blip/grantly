import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScholarshipMatch, formatINR, getCgpaFormulaLabel, normalizeToPercentage } from './matching';
import { simulateScholarshipStacking } from './stacking';
import { calculateDaysRemaining, formatCountdown, getPriorityLevel } from './dates';
import { Scholarship, StudentProfile } from '../types/scholarship';

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
