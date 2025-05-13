
import React, { useState, useEffect } from 'react';
import { Booking, Ride, User } from '../types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BookingDetails from './BookingDetails';

interface RideTrackerProps {
  bookings: Booking[];
  rides: Ride[];
  currentUser: User;
}

const RideTracker: React.FC<RideTrackerProps> = ({ bookings, rides, currentUser }) => {
  const { toast } = useToast();
  
  // Get active bookings for the current user
  const activeBookings = bookings.filter(booking => 
    (booking.passengerId === currentUser.id || rides.find(ride => ride.riderId === currentUser.id && ride.id === booking.rideId)) &&
    (booking.status === 'confirmed' || booking.status === 'in-progress')
  );

  // Get completed bookings for the current user
  const completedBookings = bookings.filter(booking => 
    (booking.passengerId === currentUser.id || rides.find(ride => ride.riderId === currentUser.id && ride.id === booking.rideId)) &&
    booking.status === 'completed'
  ).slice(0, 3); // Show only the 3 most recent completed bookings
  
  // If no active or completed bookings, return null
  if (activeBookings.length === 0 && completedBookings.length === 0) {
    return null;
  }

  // Find the ride associated with a booking
  const findRideForBooking = (booking: Booking) => {
    return rides.find(ride => ride.id === booking.rideId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Your Rides</h2>
      </div>
      
      <div className="p-4 space-y-6">
        {activeBookings.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Active Rides</h3>
            {activeBookings.map(booking => {
              const ride = findRideForBooking(booking);
              if (!ride) return null;
              
              return (
                <div key={booking.id} className="mb-4">
                  <BookingDetails 
                    booking={booking} 
                    ride={ride} 
                    currentUser={currentUser} 
                  />
                </div>
              );
            })}
          </div>
        )}
        
        {completedBookings.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Completed Rides</h3>
            <div className="space-y-3">
              {completedBookings.map(booking => {
                const ride = findRideForBooking(booking);
                if (!ride) return null;
                
                return (
                  <div key={booking.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{booking.pickupLocation.address} → {booking.dropoffLocation.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.createdAt).toLocaleDateString()} with {currentUser.id === ride.riderId ? booking.passengerName : ride.riderName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{ride.pricePerPassenger}</p>
                        <Button variant="outline" size="sm" className="mt-1">View Details</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideTracker;
