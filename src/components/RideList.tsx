
import React, { useState } from 'react';
import { Ride, User, Booking } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { addBooking, updateRide } from '../services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Clock, Star, CarFront } from 'lucide-react';

interface RideListProps {
  rides: Ride[];
  currentUser: User;
  onBookingCreated: (newBooking: Booking) => void;
}

const RideList: React.FC<RideListProps> = ({ rides, currentUser, onBookingCreated }) => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'rating'>('time');
  const [bookedRideId, setBookedRideId] = useState<string | null>(null);

  if (!rides.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-muted-foreground">No rides available at the moment.</p>
      </div>
    );
  }

  const sortedRides = [...rides]
    .filter(ride => ride.status === 'scheduled' && ride.availableSeats > 0)
    .sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      } else if (sortBy === 'price') {
        return a.pricePerPassenger - b.pricePerPassenger;
      } else if (sortBy === 'rating') {
        return b.riderRating - a.riderRating;
      }
      return 0;
    });

  const handleBookRide = (ride: Ride) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      rideId: ride.id,
      passengerId: currentUser.id,
      passengerName: currentUser.name,
      pickupLocation: ride.startLocation,
      dropoffLocation: ride.endLocation,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Update ride with new passenger
    const updatedRide: Ride = {
      ...ride,
      availableSeats: ride.availableSeats - 1,
      passengers: [...ride.passengers, currentUser.id]
    };

    // Save to localStorage
    updateRide(updatedRide);
    addBooking(newBooking);
    onBookingCreated(newBooking);
    setBookedRideId(ride.id);

    toast({
      title: "Booking Confirmed",
      description: `You have successfully booked a ride with ${ride.riderName}.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + 
      ' on ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Rides</h2>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={sortBy === 'time' ? 'default' : 'outline'}
              onClick={() => setSortBy('time')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Time
            </Button>
            <Button 
              size="sm" 
              variant={sortBy === 'price' ? 'default' : 'outline'}
              onClick={() => setSortBy('price')}
            >
              ₹ Price
            </Button>
            <Button 
              size="sm" 
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              onClick={() => setSortBy('rating')}
            >
              <Star className="h-4 w-4 mr-1" />
              Rating
            </Button>
          </div>
        </div>
      </div>
      
      <div className="divide-y">
        {sortedRides.map(ride => (
          <div key={ride.id} className={`p-4 transition-colors ${bookedRideId === ride.id ? 'bg-primary-light' : 'hover:bg-muted'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{ride.startLocation.address} → {ride.endLocation.address}</h3>
                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(ride.departureTime)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-primary-light flex items-center">
                    <CarFront className="h-3 w-3 mr-1" />
                    {ride.vehicleType}
                  </Badge>
                  <Badge variant="outline" className="bg-primary-light">
                    {ride.availableSeats} seats available
                  </Badge>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 mr-0.5 fill-amber-500" />
                    {ride.riderRating.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-lg font-semibold text-primary">₹{ride.pricePerPassenger}</div>
                {bookedRideId === ride.id ? (
                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                    Booked
                  </Badge>
                ) : (
                  <Button 
                    className="mt-2"
                    onClick={() => handleBookRide(ride)}
                  >
                    Book Seat
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                {ride.riderName.charAt(0)}
              </div>
              <div>{ride.riderName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideList;
