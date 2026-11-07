import { PriorityLevel } from '../types/scholarship';

/**
 * Calculates days remaining from a given ISO date relative to current time.
 */
export function calculateDaysRemaining(deadlineIso: string, referenceDate: Date = new Date()): number {
  const deadline = new Date(deadlineIso);
  const diffTime = deadline.getTime() - referenceDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats countdown label (e.g., "12 days left", "Closing tomorrow", "Passed")
 */
export function formatCountdown(daysRemaining: number): string {
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
 * Determines urgency priority level
 */
export function getPriorityLevel(daysRemaining: number): PriorityLevel {
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
  } catch {
    return isoString;
  }
}
