import { CgpaFormula, CriterionCheck, MatchResult, Scholarship, StudentProfile } from '../types/scholarship';

/**
 * Returns a human-readable description of the CGPA conversion formula applied.
 */
export function getCgpaFormulaLabel(formula?: CgpaFormula, customMultiplier?: number): string {
  switch (formula) {
    case 'aicte_revised':
      return 'AICTE Revised ((CGPA - 0.75) × 10)';
    case 'linear_10':
      return '10-Point Linear Scale (CGPA × 10)';
    case 'custom':
      return `Custom Multiplier (CGPA × ${customMultiplier && customMultiplier > 0 ? customMultiplier : 9.5})`;
    case 'unknown':
      return 'Unknown / Unverified with Institution';
    case 'standard_9_5':
    default:
      return 'CBSE / AICTE Standard (CGPA × 9.5)';
  }
}

/**
 * Normalizes academic score to percentage.
 * Supports institution-specific CGPA conversion formulas:
 * - standard_9_5: CBSE & traditional AICTE formula (CGPA * 9.5)
 * - aicte_revised: Revised AICTE formula ((CGPA - 0.75) * 10)
 * - linear_10: 10-point linear scale (CGPA * 10) used by IITs, NITs, and autonomous universities
 * - custom: Custom institutional factor specified on official transcripts
 */
export function normalizeToPercentage(
  score: number,
  type: 'percentage' | 'cgpa',
  formula: CgpaFormula = 'standard_9_5',
  customMultiplier?: number
): number {
  if (type === 'cgpa') {
    let pct = 0;
    switch (formula) {
      case 'aicte_revised':
        pct = (score - 0.75) * 10;
        break;
      case 'linear_10':
        pct = score * 10;
        break;
      case 'custom':
        const mult = customMultiplier && customMultiplier > 0 ? customMultiplier : 9.5;
        pct = score * mult;
        break;
      case 'standard_9_5':
      default:
        pct = score * 9.5;
        break;
    }
    return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
  }
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Format Indian Rupee Currency cleanly
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Pure deterministic evaluation of scholarship eligibility and match score
 */
export function evaluateScholarshipMatch(
  scholarship: Scholarship,
  profile: Partial<StudentProfile> | null,
  userDocuments: { type: string }[] = []
): MatchResult {
  // If profile is empty or not onboarded, return Insufficient Information
  if (!profile || !profile.educationLevel) {
    return {
      matchPercentage: 0,
      status: 'INSUFFICIENT INFORMATION',
      criteriaBreakdown: [
        {
          name: 'Profile Incomplete',
          status: 'missing_info',
          requirement: 'Student educational and academic profile required',
          studentValue: 'Not provided',
          message: 'Complete your student onboarding to see accurate eligibility and requirements breakdown.',
        },
      ],
      explanation: 'Please complete your student profile to evaluate specific criteria.',
      missingDocuments: scholarship.requiredDocuments,
      unlockedFutureRequirements: [],
    };
  }

  const checks: CriterionCheck[] = [];
  let hardFailures = 0;
  let missingCount = 0;
  let totalScoreWeight = 0;
  let earnedScoreWeight = 0;

  // 1. Education Level
  const levelWeight = 20;
  totalScoreWeight += levelWeight;
  const levelMatches = scholarship.eligibleLevels.includes(profile.educationLevel);
  if (levelMatches) {
    earnedScoreWeight += levelWeight;
    checks.push({
      name: 'Education Level',
      status: 'satisfied',
      requirement: scholarship.eligibleLevels.join(', '),
      studentValue: profile.educationLevel,
      message: `Enrolled in ${profile.educationLevel}, which meets the requirement.`,
    });
  } else {
    hardFailures++;
    checks.push({
      name: 'Education Level',
      status: 'not_satisfied',
      requirement: scholarship.eligibleLevels.join(', '),
      studentValue: profile.educationLevel,
      message: `Open to ${scholarship.eligibleLevels.join(', ')}. Your current level is ${profile.educationLevel}.`,
    });
  }

  // 2. Degree & Course
  const degreeWeight = 15;
  totalScoreWeight += degreeWeight;
  if (!scholarship.eligibleDegrees || scholarship.eligibleDegrees.includes('All')) {
    earnedScoreWeight += degreeWeight;
    checks.push({
      name: 'Degree / Course Stream',
      status: 'satisfied',
      requirement: 'Open to all degrees & streams',
      studentValue: profile.degree || 'Not specified',
      message: 'All accredited degree programs are eligible.',
    });
  } else if (profile.degree && scholarship.eligibleDegrees.includes(profile.degree)) {
    earnedScoreWeight += degreeWeight;
    checks.push({
      name: 'Degree / Course Stream',
      status: 'satisfied',
      requirement: scholarship.eligibleDegrees.join(', '),
      studentValue: profile.degree,
      message: `Degree (${profile.degree}) aligns with eligible programs.`,
    });
  } else if (!profile.degree) {
    missingCount++;
    checks.push({
      name: 'Degree / Course Stream',
      status: 'missing_info',
      requirement: scholarship.eligibleDegrees.join(', '),
      studentValue: 'Not specified',
      message: 'Specify your degree in profile to verify course alignment.',
    });
  } else {
    hardFailures++;
    checks.push({
      name: 'Degree / Course Stream',
      status: 'not_satisfied',
      requirement: scholarship.eligibleDegrees.join(', '),
      studentValue: profile.degree,
      message: `Eligible for: ${scholarship.eligibleDegrees.join(', ')}.`,
    });
  }

  // 3. Academic Score / Percentage with Institutional CGPA Normalization
  const academicWeight = 25;
  totalScoreWeight += academicWeight;
  const isCgpa = profile.academicScoreType === 'cgpa';
  const formula = profile.cgpaFormula || 'standard_9_5';
  const customMult = profile.customCgpaMultiplier;
  const formulaLabel = isCgpa ? getCgpaFormulaLabel(formula, customMult) : 'Direct Percentage';

  const isFormulaUnknown = isCgpa && formula === 'unknown';

  const studentPct = profile.academicScore !== undefined && profile.academicScore !== null && !isFormulaUnknown
    ? normalizeToPercentage(profile.academicScore, profile.academicScoreType || 'percentage', formula, customMult)
    : 0;

  if (scholarship.minPercentage === undefined || scholarship.minPercentage === 0) {
    earnedScoreWeight += academicWeight;
    checks.push({
      name: 'Academic Threshold',
      status: 'satisfied',
      requirement: 'No minimum score cutoff specified',
      studentValue: isCgpa ? `${profile.academicScore} CGPA` : `${studentPct}%`,
      message: 'No minimum score cutoff required for this scheme.',
    });
  } else if (profile.academicScore === undefined || profile.academicScore === null) {
    missingCount++;
    checks.push({
      name: 'Academic Threshold',
      status: 'missing_info',
      requirement: `Minimum ${scholarship.minPercentage}% marks required`,
      studentValue: 'Not provided',
      message: 'Add your latest academic percentage/CGPA in profile.',
    });
  } else if (isFormulaUnknown) {
    // Official conversion rule is unverified - cannot guarantee eligibility
    missingCount++;
    checks.push({
      name: 'Academic Threshold',
      status: 'missing_info',
      requirement: `Minimum ${scholarship.minPercentage}% marks required`,
      studentValue: `${profile.academicScore} CGPA (Conversion unverified)`,
      message: `Your score is recorded as ${profile.academicScore} CGPA, but your university conversion formula is unverified. Cannot confirm if you meet the ${scholarship.minPercentage}% cutoff without verified grade conversion rules.`,
    });
  } else if (studentPct >= scholarship.minPercentage) {
    earnedScoreWeight += academicWeight;
    checks.push({
      name: 'Academic Threshold',
      status: 'satisfied',
      requirement: `Minimum ${scholarship.minPercentage}% marks`,
      studentValue: isCgpa
        ? `${profile.academicScore} CGPA (~${studentPct}%)`
        : `${studentPct}%`,
      message: isCgpa
        ? `Your score of ${profile.academicScore} CGPA converts to ${studentPct}% using ${formulaLabel}, meeting the ${scholarship.minPercentage}% cutoff. (Verify with university grade certificate).`
        : `Your score of ${studentPct}% comfortably exceeds the ${scholarship.minPercentage}% cutoff.`,
    });
  } else {
    hardFailures++;
    checks.push({
      name: 'Academic Threshold',
      status: 'not_satisfied',
      requirement: `Minimum ${scholarship.minPercentage}% marks`,
      studentValue: isCgpa
        ? `${profile.academicScore} CGPA (~${studentPct}%)`
        : `${studentPct}%`,
      message: isCgpa
        ? `Current score of ${profile.academicScore} CGPA converts to ${studentPct}% via ${formulaLabel}, which is below the mandatory ${scholarship.minPercentage}% threshold.`
        : `Current academic score (${studentPct}%) is below the mandatory ${scholarship.minPercentage}% threshold.`,
    });
  }

  // 4. Family Income (Need-based check)
  const incomeWeight = 20;
  totalScoreWeight += incomeWeight;
  if (scholarship.maxFamilyIncome === undefined || scholarship.maxFamilyIncome === 0) {
    earnedScoreWeight += incomeWeight;
    checks.push({
      name: 'Family Income Ceiling',
      status: 'satisfied',
      requirement: 'No maximum income limit (Merit open)',
      studentValue: profile.annualFamilyIncome ? formatINR(profile.annualFamilyIncome) : 'Not specified',
      message: 'Open to all income brackets.',
    });
  } else if (profile.annualFamilyIncome === undefined || profile.annualFamilyIncome === null) {
    missingCount++;
    checks.push({
      name: 'Family Income Ceiling',
      status: 'missing_info',
      requirement: `Family income below ${formatINR(scholarship.maxFamilyIncome)}/yr`,
      studentValue: 'Not provided',
      message: 'Provide your family income bracket in profile.',
    });
  } else if (profile.annualFamilyIncome <= scholarship.maxFamilyIncome) {
    earnedScoreWeight += incomeWeight;
    checks.push({
      name: 'Family Income Ceiling',
      status: 'satisfied',
      requirement: `Max annual income ${formatINR(scholarship.maxFamilyIncome)}`,
      studentValue: formatINR(profile.annualFamilyIncome),
      message: `Family income (${formatINR(profile.annualFamilyIncome)}) is within the ${formatINR(scholarship.maxFamilyIncome)} limit.`,
    });
  } else {
    hardFailures++;
    checks.push({
      name: 'Family Income Ceiling',
      status: 'not_satisfied',
      requirement: `Max annual income ${formatINR(scholarship.maxFamilyIncome)}`,
      studentValue: formatINR(profile.annualFamilyIncome),
      message: `Family income (${formatINR(profile.annualFamilyIncome)}) exceeds the ${formatINR(scholarship.maxFamilyIncome)} ceiling.`,
    });
  }

  // 5. State / Domicile Eligibility
  const domicileWeight = 15;
  totalScoreWeight += domicileWeight;
  const requiresSpecificState =
    scholarship.eligibleStates &&
    !scholarship.eligibleStates.includes('All') &&
    scholarship.eligibleStates.length > 0;

  if (!requiresSpecificState) {
    earnedScoreWeight += domicileWeight;
    checks.push({
      name: 'State / Domicile Eligibility',
      status: 'satisfied',
      requirement: 'Open to all Indian States & UTs',
      studentValue: profile.stateDomicile || 'Not specified',
      message: 'National open scheme with no single-state domicile restriction.',
    });
  } else if (profile.stateDomicile && scholarship.eligibleStates!.includes(profile.stateDomicile)) {
    earnedScoreWeight += domicileWeight;
    checks.push({
      name: 'State / Domicile Eligibility',
      status: 'satisfied',
      requirement: `Domicile of: ${scholarship.eligibleStates!.join(', ')}`,
      studentValue: profile.stateDomicile,
      message: `Your home state domicile (${profile.stateDomicile}) qualifies for this regional scheme.`,
    });
  } else if (!profile.stateDomicile) {
    missingCount++;
    checks.push({
      name: 'State / Domicile Eligibility',
      status: 'missing_info',
      requirement: `Domicile of: ${scholarship.eligibleStates!.join(', ')}`,
      studentValue: 'Not specified',
      message: 'Home state domicile information required in profile.',
    });
  } else {
    hardFailures++;
    checks.push({
      name: 'State / Domicile Eligibility',
      status: 'not_satisfied',
      requirement: `Domicile of: ${scholarship.eligibleStates!.join(', ')}`,
      studentValue: profile.stateDomicile,
      message: `Restricted to residents of ${scholarship.eligibleStates!.join(', ')}. Your registered domicile is ${profile.stateDomicile}.`,
    });
  }

  // 6. Gender Eligibility
  const genderWeight = 10;
  totalScoreWeight += genderWeight;
  if (!scholarship.eligibleGender || scholarship.eligibleGender === 'All') {
    earnedScoreWeight += genderWeight;
    checks.push({
      name: 'Gender Eligibility',
      status: 'satisfied',
      requirement: 'Open to all genders',
      studentValue: profile.gender || 'All',
      message: 'Open to all applicants regardless of gender.',
    });
  } else if (profile.gender && profile.gender === scholarship.eligibleGender) {
    earnedScoreWeight += genderWeight;
    checks.push({
      name: 'Gender Eligibility',
      status: 'satisfied',
      requirement: `Reserved for ${scholarship.eligibleGender} applicants`,
      studentValue: profile.gender,
      message: `Meets gender criterion (${scholarship.eligibleGender}).`,
    });
  } else if (!profile.gender) {
    missingCount++;
    checks.push({
      name: 'Gender Eligibility',
      status: 'missing_info',
      requirement: `Reserved for ${scholarship.eligibleGender} applicants`,
      studentValue: 'Not specified',
      message: 'Gender information needed to evaluate this criterion.',
    });
  } else {
    hardFailures++;
    checks.push({
      name: 'Gender Eligibility',
      status: 'not_satisfied',
      requirement: `Reserved for ${scholarship.eligibleGender} applicants`,
      studentValue: profile.gender,
      message: `This scholarship is exclusively reserved for ${scholarship.eligibleGender} applicants.`,
    });
  }

  // 7. Social Category / Quota
  const categoryWeight = 10;
  totalScoreWeight += categoryWeight;
  const requiresSpecialCategory =
    scholarship.eligibleCategories &&
    !scholarship.eligibleCategories.includes('All') &&
    scholarship.eligibleCategories.length > 0;

  if (!requiresSpecialCategory) {
    earnedScoreWeight += categoryWeight;
    checks.push({
      name: 'Social Category / Quota',
      status: 'satisfied',
      requirement: 'Open to all categories',
      studentValue: profile.categories?.join(', ') || 'General',
      message: 'All categories are eligible to apply.',
    });
  } else {
    const studentCategories = profile.categories || [];
    const hasCategoryMatch = scholarship.eligibleCategories?.some((cat) =>
      studentCategories.includes(cat)
    );
    if (hasCategoryMatch) {
      earnedScoreWeight += categoryWeight;
      checks.push({
        name: 'Social Category / Quota',
        status: 'satisfied',
        requirement: scholarship.eligibleCategories!.join(' or '),
        studentValue: studentCategories.join(', '),
        message: `Your category (${studentCategories.join(', ')}) qualifies.`,
      });
    } else if (studentCategories.length === 0) {
      missingCount++;
      checks.push({
        name: 'Social Category / Quota',
        status: 'missing_info',
        requirement: scholarship.eligibleCategories!.join(' or '),
        studentValue: 'Not specified',
        message: 'Category not specified in profile.',
      });
    } else {
      hardFailures++;
      checks.push({
        name: 'Social Category / Quota',
        status: 'not_satisfied',
        requirement: scholarship.eligibleCategories!.join(' or '),
        studentValue: studentCategories.join(', '),
        message: `Requires category: ${scholarship.eligibleCategories!.join(', ')}.`,
      });
    }
  }

  // Missing Documents Analysis
  const userDocTypes = new Set(userDocuments.map((d) => d.type.toLowerCase().trim()));
  const missingDocs: string[] = [];
  for (const doc of scholarship.requiredDocuments) {
    const lower = doc.toLowerCase().trim();
    const hasDoc = Array.from(userDocTypes).some(
      (ud) => ud.includes(lower) || lower.includes(ud) || (lower.includes('income') && ud.includes('income')) || (lower.includes('marksheet') && ud.includes('transcript'))
    );
    if (!hasDoc) {
      missingDocs.push(doc);
    }
  }

  // Calculate percentage and status
  const rawPercentage = Math.round((earnedScoreWeight / totalScoreWeight) * 100);

  let status: MatchResult['status'];
  let explanation = '';

  if (hardFailures > 0) {
    status = 'INELIGIBLE';
    const failedItems = checks.filter((c) => c.status === 'not_satisfied').map((c) => c.name);
    explanation = `Currently ineligible due to ${failedItems.length} requirement(s): ${failedItems.join(', ')}.`;
  } else if (missingCount > 0) {
    status = 'POTENTIALLY ELIGIBLE';
    const missingItems = checks.filter((c) => c.status === 'missing_info').map((c) => c.name);
    explanation = `Likely eligible pending verification of ${missingItems.join(', ')}.`;
  } else {
    status = 'ELIGIBLE';
    explanation = 'You meet all specified eligibility criteria for this scholarship.';
  }

  // Future unlocks
  const unlockedFutureRequirements: string[] = [];
  if (checks.some((c) => c.name === 'Academic Threshold' && c.status === 'not_satisfied')) {
    unlockedFutureRequirements.push(`Improving semester score to ${scholarship.minPercentage}% will satisfy this threshold.`);
  }

  return {
    matchPercentage: hardFailures > 0 ? Math.min(rawPercentage, 35) : rawPercentage,
    status,
    criteriaBreakdown: checks,
    explanation,
    missingDocuments: missingDocs,
    unlockedFutureRequirements,
  };
}
