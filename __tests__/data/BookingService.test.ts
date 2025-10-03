
import BookingService from '../../src/data/BookingService';
import bookingData from '../../src/data/booking.json';

// Use fake timers to control setTimeout
jest.useFakeTimers();

describe('BookingService', () => {
  it('should return a promise', () => {
    const promise = BookingService.fetchBooking();
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should resolve with booking data after a delay', async () => {
    const promise = BookingService.fetchBooking();

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    const data = await promise;

    expect(data).toEqual(bookingData);
  });
});
