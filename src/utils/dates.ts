import { PriorityLevel } from '../types/scholarship';

/**
 * Calculates days remaining from a given ISO date relative to current time.
 * Normalizes both target deadline and reference date to calendar date midnights
 * to prevent intra-day time-of-day skew and timezone shift issues.
 */
export function calculateDaysRemaining(deadlineIso?: string | null, referenceDate: Date = new Date()): number {
  if (!deadlineIso || typeof deadlineIso !== 'string' || deadlineIso.trim() === '') {
    return -9999;
  }

  // Parse YYYY-MM-DD or ISO string safely
  const parts = deadlineIso.split('T')[0].split('-');
  let targetYear: number;
  let targetMonth: number;
  let targetDay: number;

  if (parts.length === 3) {
    targetYear = parseInt(parts[0], 10);
    targetMonth = parseInt(parts[1], 10) - 1;
    targetDay = parseInt(parts[2], 10);
  } else {
    const parsed = new Date(deadlineIso);
    if (isNaN(parsed.getTime())) {
      return -9999;
    }
    targetYear = parsed.getFullYear();
    targetMonth = parsed.getMonth();
    targetDay = parsed.getDate();
  }

  // Use UTC midnight comparison to eliminate timezone day-shift bugs
  const deadlineMidnight = Date.UTC(targetYear, targetMonth, targetDay);
  const refMidnight = Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const diffMs = deadlineMidnight - refMidnight;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats countdown label (e.g., "12 days left", "Closing tomorrow", "Application closed")
 */
export function formatCountdown(daysRemaining: number): string {
  if (isNaN(daysRemaining) || daysRemaining <= -9000) {
    return 'Deadline TBD';
  }
  if (daysRemaining < 0) {
    return 'Application closed';
  }
  if (daysRemaining === 0) {
    return 'Closing today';
  }
  if (daysRemaining === 1) {
    return 'Closing tomorrow';
  }
  if (daysRemaining <= 30) {
    return `${daysRemaining} days left`;
  }
  const months = Math.floor(daysRemaining / 30);
  return `~${months} month${months > 1 ? 's' : ''} left`;
}

/**
 * Determines urgency priority level.
 * Explicitly distinguishes closed/expired scholarships from active high-priority deadlines.
 */
export function getPriorityLevel(daysRemaining: number): PriorityLevel {
  if (isNaN(daysRemaining) || daysRemaining < 0) {
    return 'EXPIRED';
  }
  if (daysRemaining <= 14) {
    return 'HIGH';
  }
  if (daysRemaining <= 45) {
    return 'MEDIUM';
  }
  return 'LOW';
}

/**
 * Formats a clean date string
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    // Add this to src/utils/dates.ts
export const getDaysUntil = (targetDate: string | Date): number => {
  const target = new Date(targetDate);
  const today = new Date();
  
  // Reset times to midnight to ensure accurate day counting
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
  } catch {
    return isoString;
  }
}
