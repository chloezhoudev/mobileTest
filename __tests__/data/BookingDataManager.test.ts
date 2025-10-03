
import BookingDataManager from '../../src/data/BookingDataManager';
import BookingCache from '../../src/data/BookingCache';
import BookingService, { BookingData } from '../../src/data/BookingService';
import { isBookingExpired } from '../../src/utils/timeHelpers';

// Mock the dependencies
jest.mock('../../src/data/BookingCache');
jest.mock('../../src/data/BookingService');
jest.mock('../../src/utils/timeHelpers');

describe('BookingDataManager', () => {
  const mockBookingData: BookingData = {
    shipReference: '123',
    shipToken: 'abc',
    canIssueTicketChecking: false,
    expiryTime: (Math.floor(Date.now() / 1000) + 3600).toString(), // Expires in 1 hour
    duration: 3600,
    segments: [],
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('getBooking', () => {
    it('should return fresh data from cache if available and not expired', async () => {
      (BookingCache.getBooking as jest.Mock).mockResolvedValue(mockBookingData);
      (isBookingExpired as jest.Mock).mockReturnValue(false);

      const result = await BookingDataManager.getBooking();

      expect(result.source).toBe('cache');
      expect(result.data).toEqual(mockBookingData);
      expect(result.isExpired).toBe(false);
      expect(BookingCache.getBooking).toHaveBeenCalledTimes(1);
      expect(BookingService.fetchBooking).not.toHaveBeenCalled();
    });

    it('should fetch from service if cache is expired', async () => {
      const expiredData = { ...mockBookingData, expiryTime: (Math.floor(Date.now() / 1000) - 100).toString() };
      (BookingCache.getBooking as jest.Mock).mockResolvedValue(expiredData);
      (isBookingExpired as jest.Mock).mockReturnValueOnce(true); // First check is for cached data
      (isBookingExpired as jest.Mock).mockReturnValueOnce(false); // Second check is for fresh data
      (BookingService.fetchBooking as jest.Mock).mockResolvedValue(mockBookingData);

      const result = await BookingDataManager.getBooking();

      expect(result.source).toBe('service');
      expect(result.data).toEqual(mockBookingData);
      expect(BookingCache.getBooking).toHaveBeenCalledTimes(1);
      expect(BookingService.fetchBooking).toHaveBeenCalledTimes(1);
      expect(BookingCache.saveBooking).toHaveBeenCalledWith(mockBookingData);
    });

    it('should fetch from service if cache is empty', async () => {
      (BookingCache.getBooking as jest.Mock).mockResolvedValue(null);
      (isBookingExpired as jest.Mock).mockReturnValue(false);
      (BookingService.fetchBooking as jest.Mock).mockResolvedValue(mockBookingData);

      const result = await BookingDataManager.getBooking();

      expect(result.source).toBe('service');
      expect(result.data).toEqual(mockBookingData);
      expect(BookingCache.getBooking).toHaveBeenCalledTimes(1);
      expect(BookingService.fetchBooking).toHaveBeenCalledTimes(1);
      expect(BookingCache.saveBooking).toHaveBeenCalledWith(mockBookingData);
    });

    it('should fetch from service when forceRefresh is true', async () => {
      (isBookingExpired as jest.Mock).mockReturnValue(false);
      (BookingService.fetchBooking as jest.Mock).mockResolvedValue(mockBookingData);

      const result = await BookingDataManager.getBooking(true);

      expect(result.source).toBe('service');
      expect(result.data).toEqual(mockBookingData);
      expect(BookingCache.getBooking).not.toHaveBeenCalled();
      expect(BookingService.fetchBooking).toHaveBeenCalledTimes(1);
      expect(BookingCache.saveBooking).toHaveBeenCalledWith(mockBookingData);
    });
  });

  describe('refreshBooking', () => {
    it('should call getBooking with forceRefresh = true', async () => {
      const getBookingSpy = jest.spyOn(BookingDataManager, 'getBooking');
      await BookingDataManager.refreshBooking();
      expect(getBookingSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('clearCache', () => {
    it('should call BookingCache.clearBooking', async () => {
      await BookingDataManager.clearCache();
      expect(BookingCache.clearBooking).toHaveBeenCalledTimes(1);
    });
  });
});
