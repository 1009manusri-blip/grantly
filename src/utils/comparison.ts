import { ComparisonHighlights, Scholarship, StudentProfile, UserDocument } from '../types/scholarship';
import { evaluateScholarshipMatch } from './matching';
import { calculateDaysRemaining, formatDate } from './dates';

/**
 * Computes comparative intelligence across 2-5 scholarships.
 * Highlights:
 * 1. Best Financial Benefit: Highest total grant funding
 * 2. Best Eligibility Match: Highest compatibility with verified profile
 * 3. Least Complicated: Lowest difficulty rating & fewest document requirements
 * 4. Nearest Deadline: Urgently closing active opportunity
 * 5. Best Overall: Algorithmic composite score balancing financial aid, match %, and application friction
 */
export function computeComparisonHighlights(
  scholarships: Scholarship[],
  profile: StudentProfile,
  documents: UserDocument[] = []
): ComparisonHighlights {
  if (scholarships.length === 0) {
    const empty = { id: '', name: 'N/A', amountFormatted: 'N/A' };
    return {
      bestFinancial: empty,
      bestMatch: { id: '', name: 'N/A', matchPercentage: 0 },
      leastComplicated: { id: '', name: 'N/A', difficulty: 'N/A', docCount: 0 },
      nearestDeadline: { id: '', name: 'N/A', deadlineFormatted: 'N/A', daysRemaining: 0 },
      bestOverall: { id: '', name: 'N/A', scoreReason: 'N/A' },
    };
  }

  // 1. Best Financial Benefit
  const sortedByAmount = [...scholarships].sort((a, b) => b.amount - a.amount);
  const bestFinancial = {
    id: sortedByAmount[0].id,
    name: sortedByAmount[0].name,
    amountFormatted: sortedByAmount[0].amountFormatted,
  };

  // 2. Best Eligibility Match
  const evaluated = scholarships.map((s) => ({
    s,
    match: evaluateScholarshipMatch(s, profile, documents),
    daysRemaining: calculateDaysRemaining(s.deadline),
  }));

  const sortedByMatch = [...evaluated].sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);
  const bestMatch = {
    id: sortedByMatch[0].s.id,
    name: sortedByMatch[0].s.name,
    matchPercentage: sortedByMatch[0].match.matchPercentage,
  };

  // 3. Least Complicated Application
  const difficultyWeight = { Straightforward: 1, Moderate: 2, Extensive: 3 };
  const sortedByComplexity = [...scholarships].sort((a, b) => {
    const diffA = (difficultyWeight[a.difficultyRating] || 2) * 5 + a.requiredDocuments.length;
    const diffB = (difficultyWeight[b.difficultyRating] || 2) * 5 + b.requiredDocuments.length;
    return diffA - diffB;
  });
  const leastComplicated = {
    id: sortedByComplexity[0].id,
    name: sortedByComplexity[0].name,
    difficulty: sortedByComplexity[0].difficultyRating,
    docCount: sortedByComplexity[0].requiredDocuments.length,
  };

  // 4. Nearest Deadline (strictly active, > 0 days)
  const activeDeadlines = evaluated.filter((e) => e.daysRemaining >= 0);
  const sortedByDeadline = [...(activeDeadlines.length > 0 ? activeDeadlines : evaluated)].sort(
    (a, b) => a.daysRemaining - b.daysRemaining
  );
  const nearestDeadline = {
    id: sortedByDeadline[0].s.id,
    name: sortedByDeadline[0].s.name,
    deadlineFormatted: formatDate(sortedByDeadline[0].s.deadline),
    daysRemaining: sortedByDeadline[0].daysRemaining,
  };

  // 5. Best Overall Composite Score
  // Composite = (amount / 10000) * (matchPercentage / 100) / (difficultyScore)
  const sortedByOverall = [...evaluated].sort((a, b) => {
    const scoreA = ((a.s.amount / 10000) * (a.match.matchPercentage || 1)) / (difficultyWeight[a.s.difficultyRating] || 2);
    const scoreB = ((b.s.amount / 10000) * (b.match.matchPercentage || 1)) / (difficultyWeight[b.s.difficultyRating] || 2);
    return scoreB - scoreA;
  });

  const topOverall = sortedByOverall[0];
  const bestOverall = {
    id: topOverall.s.id,
    name: topOverall.s.name,
    scoreReason: `${topOverall.s.amountFormatted} · ${topOverall.match.matchPercentage}% Profile Fit · ${topOverall.s.difficultyRating}`,
  };

  return {
    bestFinancial,
    bestMatch,
    leastComplicated,
    nearestDeadline,
    bestOverall,
  };
}
