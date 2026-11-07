import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScholarshipMatch, formatINR, normalizeToPercentage } from './matching';
import { simulateScholarshipStacking } from './stacking';
import { calculateDaysRemaining, getPriorityLevel } from './dates';
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

test('normalizeToPercentage converts CGPA accurately', () => {
  const pct = normalizeToPercentage(9.0, 'cgpa');
  assert.equal(pct, 85.5);
  const directPct = normalizeToPercentage(88.5, 'percentage');
  assert.equal(directPct, 88.5);
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

test('evaluateScholarshipMatch flags INELIGIBLE when academic score is below cutoff', () => {
  const lowScoreProfile = { ...mockProfile, academicScore: 72.0 };
  const result = evaluateScholarshipMatch(mockScholarship, lowScoreProfile);
  assert.equal(result.status, 'INELIGIBLE');
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

test('simulateScholarshipStacking detects conflicts between multiple government awards', () => {
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
  // Allowable should keep highest govt (50,000)
  assert.equal(result.allowableStackedFunding, 50000);
});

test('calculateDaysRemaining and getPriorityLevel calculate urgency thresholds', () => {
  const today = new Date('2026-11-06T00:00:00Z');
  const days = calculateDaysRemaining('2026-11-16T00:00:00Z', today);
  assert.equal(days, 10);
  assert.equal(getPriorityLevel(days), 'HIGH');

  const days30 = calculateDaysRemaining('2026-12-06T00:00:00Z', today);
  assert.equal(days30, 30);
  assert.equal(getPriorityLevel(days30), 'MEDIUM');

  const days60 = calculateDaysRemaining('2027-01-06T00:00:00Z', today);
  assert.equal(getPriorityLevel(days60), 'LOW');
});
