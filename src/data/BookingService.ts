import bookingData from './booking.json';

export interface Segment {
  id: number;
  originAndDestinationPair: {
    destination: {
      code: string;
      displayName: string;
      url: string;
    };
    destinationCity: string;
    origin: {
      code: string;
      displayName: string;
      url: string;
    };
    originCity: string;
  };
}

export interface BookingData {
  shipReference: string;
  shipToken: string;
  canIssueTicketChecking: boolean;
  expiryTime: string;
  duration: number;
  segments: Segment[];
}

class BookingService {
  async fetchBooking(): Promise<BookingData> {
    // Simulate network delay (real API would have latency)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(bookingData as BookingData);
      }, 1000);
    });
  }
}

export default new BookingService();
