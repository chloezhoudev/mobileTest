import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import BookingDataManager, { BookingResult } from '../data/BookingDataManager';
import { getTimeRemaining } from '../utils/timeHelpers';

const BookingListScreen = () => {
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load booking when component mounts
  useEffect(() => {
    loadBooking();
  }, []);

  // Function to load booking data
  const loadBooking = async () => {
    try {
      setLoading(true);
      const result = await BookingDataManager.getBooking();

      // Print to console as required by test
      console.log('=== BOOKING DATA ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('===================');

      setBooking(result);
    } catch (error) {
      console.error('Failed to load booking:', error);
      Alert.alert('Error', 'Failed to load booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const result = await BookingDataManager.refreshBooking();
      setBooking(result);

      console.log('=== REFRESHED BOOKING DATA ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('==============================');
    } catch (error) {
      console.error('Failed to refresh:', error);
      Alert.alert('Error', 'Failed to refresh. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading booking...</Text>
      </View>
    );
  }

  // Show error if no data
  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No booking data available</Text>
      </View>
    );
  }

  // Main content
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <Text style={styles.dataSource}>Source: {booking.source}</Text>
      </View>

      {/* Booking Info Card */}
      <View style={styles.bookingInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reference:</Text>
          <Text style={styles.infoValue}>{booking.data.shipReference}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>
            {Math.floor(booking.data.duration / 60)} hours
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text
            style={[
              styles.infoValue,
              booking.isExpired ? styles.expired : styles.active,
            ]}
          >
            {booking.isExpired ? '❌ Expired' : '✅ Active'}
          </Text>
        </View>

        {!booking.isExpired && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time Remaining:</Text>
            <Text style={styles.infoValue}>
              {getTimeRemaining(booking.data.expiryTime)}
            </Text>
          </View>
        )}
      </View>

      {/* Segments Section */}
      <Text style={styles.sectionTitle}>Journey Segments</Text>

      <FlatList
        testID="booking-list"
        data={booking.data.segments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.segmentCard}>
            <Text style={styles.segmentTitle}>Segment {item.id}</Text>

            <View style={styles.routeContainer}>
              <View style={styles.locationBox}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationCode}>
                  {item.originAndDestinationPair.origin.code}
                </Text>
                <Text style={styles.locationName}>
                  {item.originAndDestinationPair.origin.displayName}
                </Text>
              </View>

              <Text style={styles.arrow}>→</Text>

              <View style={styles.locationBox}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationCode}>
                  {item.originAndDestinationPair.destination.code}
                </Text>
                <Text style={styles.locationName}>
                  {item.originAndDestinationPair.destination.displayName}
                </Text>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  dataSource: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  bookingInfo: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  active: {
    color: '#4CAF50',
  },
  expired: {
    color: '#F44336',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  segmentCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationBox: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  locationCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#007AFF',
    marginHorizontal: 10,
  },
});

export default BookingListScreen;
