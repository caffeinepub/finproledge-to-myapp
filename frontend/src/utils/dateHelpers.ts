import { Time } from '../backend';

export function calculateDaysRemaining(deadline: Time): number {
  const now = Date.now();
  const deadlineMs = Number(deadline) / 1_000_000;
  const diffMs = deadlineMs - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDeadline(timestamp: Time): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isDueSoon(deadline: Time): boolean {
  const daysRemaining = calculateDaysRemaining(deadline);
  return daysRemaining <= 5 && daysRemaining > 0;
}

/** Alias for isDueSoon — returns true when deadline is within 5 days (and not yet passed) */
export function isWithinFiveDays(deadline: Time): boolean {
  return isDueSoon(deadline);
}
