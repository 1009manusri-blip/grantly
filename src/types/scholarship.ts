/**
 * Type definitions for GRANTLY Scholarship Discovery & Management Platform
 */

export type EducationLevel = 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma' | 'Secondary';

export type ProviderType = 'Government' | 'Private' | 'Institutional' | 'International' | 'Foundation';

export type ScholarshipCategory = 'Merit-based' | 'Need-based' | 'Government' | 'Private' | 'Institutional' | 'International';

export type VerificationStatus = 'Official Source Verified' | 'Demo Information' | 'Verification Pending';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'EXPIRED';

export type CgpaFormula = 'standard_9_5' | 'aicte_revised' | 'linear_10' | 'custom' | 'unknown';

export type JourneyStage = 'DISCOVER' | 'MATCH' | 'PREPARE' | 'APPLY' | 'SUBMITTED' | 'AWARDED';

export type EligibilityStatus = 'ELIGIBLE' | 'POTENTIALLY ELIGIBLE' | 'INELIGIBLE' | 'INSUFFICIENT INFORMATION';

export interface CriterionCheck {
  name: string;
  status: 'satisfied' | 'not_satisfied' | 'missing_info';
  requirement: string;
  studentValue: string;
  message: string;
}

export interface MatchResult {
  matchPercentage: number;
  status: EligibilityStatus;
  criteriaBreakdown: CriterionCheck[];
  explanation: string;
  missingDocuments: string[];
  unlockedFutureRequirements: string[];
}

export interface ApplicationStep {
  step: number;
  title: string;
  instruction: string;
}

export interface CombinationRestrictions {
  allowsStacking: boolean;
  stackingNotes: string;
  conflictsWith: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  category: ScholarshipCategory;
  amount: number; // in INR
  amountType: 'One-time' | 'Per Year' | 'Per Month' | 'Full Tuition + Stipend';
  amountFormatted: string;
  deadline: string; // ISO YYYY-MM-DD
  description: string;
  longDescription: string;
  minPercentage?: number; // e.g. 75
  maxFamilyIncome?: number; // e.g. 600000 (INR)
  eligibleLevels: EducationLevel[];
  eligibleDegrees: string[]; // e.g. ['B.Tech / B.E.', 'B.Sc', 'All']
  eligibleStates?: string[]; // e.g. ['All'] or specific states
  eligibleCategories?: string[]; // e.g. ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'All']
  eligibleGender?: 'All' | 'Female' | 'Male';
  requiredDocuments: string[];
  combinationRestrictions: CombinationRestrictions;
  applicationUrl: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
  verificationStatus: VerificationStatus;
  featured?: boolean;
  tags: string[];
  applicationSteps: ApplicationStep[];
  quotaOrDisbursals?: string;
  difficultyRating: 'Straightforward' | 'Moderate' | 'Extensive';
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  educationLevel: EducationLevel;
  degree: string;
  courseStream: string;
  currentYear: number;
  institution: string;
  academicScoreType: 'percentage' | 'cgpa';
  academicScore: number;
  cgpaFormula?: CgpaFormula;
  customCgpaMultiplier?: number;
  prevScore12th: number;
  prevScore10th: number;
  achievements: string[];
  annualFamilyIncome: number; // in INR
  financialAssistanceNeed: 'high' | 'medium' | 'low';
  stateDomicile: string;
  categories: string[];
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say';
  isOnboarded: boolean;
  savedScholarshipIds: string[];
}

export interface UserDocument {
  id: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Verified' | 'Under Review' | 'Needs Update';
}

export interface ApplicationTrack {
  scholarshipId: string;
  stage: JourneyStage;
  appliedDate?: string;
  notes?: string;
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
}

export interface QuestMission {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'Profile' | 'Discovery' | 'Preparation' | 'Application';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
  matchedScholarshipIds?: string[];
}
