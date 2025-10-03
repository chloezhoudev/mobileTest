
import { isBookingExpired, getTimeRemaining } from '../../src/utils/timeHelpers';

describe('timeHelpers', () => {
  describe('isBookingExpired', () => {
    it('should return true for an expired timestamp', () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 1000;
      expect(isBookingExpired(expiredTimestamp)).toBe(true);
    });

    it('should return false for a future timestamp', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 1000;
      expect(isBookingExpired(futureTimestamp)).toBe(false);
    });

    it('should return false for the current timestamp', () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      expect(isBookingExpired(currentTimestamp)).toBe(false);
    });

    it('should handle string timestamps', () => {
      const expiredTimestamp = (Math.floor(Date.now() / 1000) - 1000).toString();
      expect(isBookingExpired(expiredTimestamp)).toBe(true);
    });
  });

  describe('getTimeRemaining', () => {
    it('should return hours and minutes remaining', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3700; // 1 hour and ~1 minute
      const remaining = getTimeRemaining(futureTimestamp);
      expect(remaining).toMatch(/1h 1m remaining/);
    });

    it('should return minutes and seconds remaining', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 70; // 1 minute and 10 seconds
      const remaining = getTimeRemaining(futureTimestamp);
      expect(remaining).toMatch(/1m 10s remaining/);
    });

    it('should return seconds remaining', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 30; // 30 seconds
      const remaining = getTimeRemaining(futureTimestamp);
      expect(remaining).toBe('30s remaining');
    });

    it('should return "Expired" for a past timestamp', () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 100;
      expect(getTimeRemaining(expiredTimestamp)).toBe('Expired');
    });
  });
});
