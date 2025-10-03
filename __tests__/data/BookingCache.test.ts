
import BookingCache from '../../src/data/BookingCache';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingData } from '../../src/data/BookingService';



describe('BookingCache', () => {
  const mockBookingData: BookingData = {
    shipReference: '123',
    shipToken: 'abc',
    canIssueTicketChecking: false,
    expiryTime: '1678886400',
    duration: 3600,
    segments: [],
  };

  beforeEach(async () => {
    // Clear the mock cache before each test
    await AsyncStorage.clear();
  });

  describe('saveBooking', () => {
    it('should stringify and save the booking data', async () => {
      await BookingCache.saveBooking(mockBookingData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@booking_cache',
        JSON.stringify(mockBookingData)
      );
    });
  });

  describe('getBooking', () => {
    it('should return null if no booking is cached', async () => {
      const result = await BookingCache.getBooking();
      expect(result).toBeNull();
    });

    it('should parse and return the cached booking data', async () => {
      // First, save some data
      await BookingCache.saveBooking(mockBookingData);

      // Then, try to get it
      const result = await BookingCache.getBooking();
      expect(result).toEqual(mockBookingData);
    });
  });

  describe('clearBooking', () => {
    it('should remove the booking from the cache', async () => {
      // First, save some data
      await BookingCache.saveBooking(mockBookingData);

      // Then, clear it
      await BookingCache.clearBooking();

      // Finally, check that it's gone
      const result = await BookingCache.getBooking();
      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@booking_cache');
    });
  });
});
