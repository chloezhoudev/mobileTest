import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingData } from './BookingService';

// Cache key constant - prefixed with @ as convention for AsyncStorage keys
const CACHE_KEY = '@booking_cache';

class BookingCache {
  async saveBooking(bookingData: BookingData): Promise<void> {
    const jsonString = JSON.stringify(bookingData);
    await AsyncStorage.setItem(CACHE_KEY, jsonString);
  }

  async getBooking(): Promise<BookingData | null> {
    const cached = await AsyncStorage.getItem(CACHE_KEY);

    if (cached === null) {
      return null;
    }

    return JSON.parse(cached) as BookingData;
  }

  async clearBooking(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
  }
}

export default new BookingCache();
