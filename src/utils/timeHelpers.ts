// src/utils/timeHelpers.ts

/**
 * Check if a booking has expired
 */
export const isBookingExpired = (expiryTimestamp: string | number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const expiryTime =
    typeof expiryTimestamp === 'string'
      ? parseInt(expiryTimestamp, 10)
      : expiryTimestamp;

  return currentTime > expiryTime;
};

/**
 * Get human-readable time remaining
 */
export const getTimeRemaining = (expiryTimestamp: string | number): string => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expiryTime =
    typeof expiryTimestamp === 'string'
      ? parseInt(expiryTimestamp, 10)
      : expiryTimestamp;

  const remaining = expiryTime - currentTime;

  if (remaining <= 0) return 'Expired';

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s remaining`;
  } else {
    return `${seconds}s remaining`;
  }
};
