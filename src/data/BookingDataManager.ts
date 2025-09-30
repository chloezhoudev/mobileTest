import BookingService, { BookingData } from './BookingService';
import BookingCache from './BookingCache';
import { isBookingExpired } from '../utils/timeHelpers';

export interface BookingResult {
  data: BookingData;
  source: 'cache' | 'service';
  isExpired: boolean;
}

class BookingDataManager {
  async getBooking(forceRefresh: boolean = false): Promise<BookingResult> {
    // Step 1: Try cache first (unless force refresh)
    if (!forceRefresh) {
      try {
        const cachedData = await BookingCache.getBooking();

        if (cachedData) {
          const expired = isBookingExpired(cachedData.expiryTime);

          // If not expired, return immediately (fast!)
          if (!expired) {
            console.log('✅ [DataManager] Returning valid cached booking');
            return {
              data: cachedData,
              source: 'cache',
              isExpired: false,
            };
          }

          console.log('⚠️ [DataManager] Cached booking has expired');
        }
      } catch (error) {
        // Cache failed - not critical, continue to service
        console.warn('⚠️ [DataManager] Cache failed, using service:', error);
      }
    }

    // Step 2: Fetch fresh data from service
    console.log('🔄 [DataManager] Fetching fresh booking data...');
    const freshData = await BookingService.fetchBooking();

    // Step 3: Try to save to cache (failure is not critical)
    try {
      await BookingCache.saveBooking(freshData);
    } catch (error) {
      console.warn('⚠️ [DataManager] Failed to save to cache:', error);
      // Continue - we still have the data!
    }

    // Step 4: Check if fresh data is already expired
    const expired = isBookingExpired(freshData.expiryTime);

    // Step 5: Return result
    return {
      data: freshData,
      source: 'service',
      isExpired: expired,
    };
  }

  async refreshBooking(): Promise<BookingResult> {
    console.log('🔄 [DataManager] Forcing refresh...');
    return this.getBooking(true);
  }

  async clearCache(): Promise<void> {
    await BookingCache.clearBooking();
    console.log('🗑️ [DataManager] Cache cleared');
  }
}

export default new BookingDataManager();
