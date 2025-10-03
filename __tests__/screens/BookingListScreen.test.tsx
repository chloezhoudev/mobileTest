import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import BookingListScreen from '../../src/screens/BookingListScreen';
import BookingDataManager from '../../src/data/BookingDataManager';
import { BookingResult } from '../../src/data/BookingDataManager';

// Mock the BookingDataManager
jest.mock('../../src/data/BookingDataManager');

describe('BookingListScreen', () => {
  const mockBookingResult: BookingResult = {
    data: {
      shipReference: '123',
      shipToken: 'abc',
      canIssueTicketChecking: false,
      expiryTime: (Math.floor(Date.now() / 1000) + 3600).toString(),
      duration: 3600,
      segments: [
        {
          id: 1,
          originAndDestinationPair: {
            origin: { code: 'JFK', displayName: 'New York', url: '' },
            destination: { code: 'LAX', displayName: 'Los Angeles', url: '' },
            originCity: 'New York',
            destinationCity: 'Los Angeles',
          },
        },
      ],
    },
    source: 'service',
    isExpired: false,
  };

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.log and console.error
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('should show a loading indicator initially', () => {
    (BookingDataManager.getBooking as jest.Mock).mockResolvedValue(mockBookingResult);
    const { getByText } = render(<BookingListScreen />);
    expect(getByText('Loading booking...')).toBeTruthy();
  });

  it('should display booking data after a successful fetch', async () => {
    (BookingDataManager.getBooking as jest.Mock).mockResolvedValue(mockBookingResult);
    const { getByText } = render(<BookingListScreen />);

    await waitFor(() => {
      expect(getByText('Booking Details')).toBeTruthy();
      expect(getByText('Reference:')).toBeTruthy();
      expect(getByText('123')).toBeTruthy();
      expect(getByText('Journey Segments')).toBeTruthy();
      expect(getByText('Segment 1')).toBeTruthy();
    });
  });

  it('should show an error message if the fetch fails', async () => {
    (BookingDataManager.getBooking as jest.Mock).mockRejectedValue(new Error('Fetch error'));
    const { getByText } = render(<BookingListScreen />);

    await waitFor(() => {
      expect(getByText('No booking data available')).toBeTruthy();
    });
  });

  it('should refresh the data on pull-to-refresh', async () => {
    (BookingDataManager.getBooking as jest.Mock).mockResolvedValue(mockBookingResult);
    const { getByText, getByTestId } = render(<BookingListScreen />);

    await waitFor(() => {
      expect(getByText('Booking Details')).toBeTruthy();
    });

    const refreshedResult = { ...mockBookingResult, source: 'cache' as 'cache' };
    (BookingDataManager.refreshBooking as jest.Mock).mockResolvedValue(refreshedResult);

    const flatList = getByTestId('booking-list');
    await act(async () => {
      flatList.props.refreshControl.props.onRefresh();
    });

    await waitFor(() => {
      expect(getByText('Source: cache')).toBeTruthy();
    });
  });
});