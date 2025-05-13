
import React, { useState, useEffect } from 'react';
import { Booking, Ride, User, Location } from '../types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Map from './Map';
import { Badge } from '@/components/ui/badge';
import { Clock, Navigation, CheckCircle, MapPin } from 'lucide-react';

interface BookingDetailsProps {
  booking: Booking;
  ride: Ride;
  currentUser: User;
  onStatusUpdate?: (status: string) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, ride, currentUser, onStatusUpdate }) => {
  const { toast } = useToast();
  const [rideStatus, setRideStatus] = useState(booking.status);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const isRider = currentUser.id === ride.riderId;

  useEffect(() => {
    // Generate a 4-digit OTP for ride verification
    if (!otp) {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setOtp(generatedOtp);
    }
    
    // Simulate time to arrival
    const estimatedArrivalTime = new Date(ride.departureTime).getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const timeDiff = Math.max(0, estimatedArrivalTime - now);
      setTimeRemaining(Math.floor(timeDiff / (1000 * 60)));
    };
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 30000); // Update every 30 seconds
    
    return () => clearInterval(timerInterval);
  }, [ride.departureTime, otp]);

  const updateRideStatus = (newStatus: string) => {
    setRideStatus(newStatus as any);
    toast({
      title: `Ride ${newStatus}`,
      description: `Your ride has been ${newStatus}.`,
    });
    
    if (onStatusUpdate) {
      onStatusUpdate(newStatus);
    }
  };

  const handleConfirmPickup = () => {
    updateRideStatus('in-progress');
    toast({
      title: "Passenger Picked Up",
      description: `Passenger ${booking.passengerName} has been picked up.`,
    });
  };

  const handleCompleteRide = () => {
    updateRideStatus('completed');
    toast({
      title: "Ride Completed",
      description: "Thank you for using carpooling!",
    });
  };

  const getStatusBadgeColor = () => {
    switch(rideStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Booking Details</h2>
        <Badge className={getStatusBadgeColor()}>
          {rideStatus.charAt(0).toUpperCase() + rideStatus.slice(1)}
        </Badge>
      </div>
      
      <div className="mb-4">
        <Map 
          startLocation={booking.pickupLocation}
          endLocation={booking.dropoffLocation}
          className="h-[250px] mb-4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm text-muted-foreground">From</h3>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <p>{booking.pickupLocation.address}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">To</h3>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-secondary" />
            <p>{booking.dropoffLocation.address}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-b py-4 my-4">
        {isRider ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Passenger</h3>
              <p>{booking.passengerName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Verification Code</p>
              <p className="font-semibold">{otp}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Driver</h3>
              <p>{ride.riderName}</p>
            </div>
            <div className="flex items-center">
              <div className="mr-2">
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p>{ride.vehicleType}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Verification Code</p>
                <p className="font-semibold">{otp}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {rideStatus === 'confirmed' && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            {timeRemaining > 0 ? (
              <span>Arriving in approximately {timeRemaining} minutes</span>
            ) : (
              <span className="text-primary font-medium">Arriving now</span>
            )}
          </div>
          
          {isRider && (
            <Button onClick={handleConfirmPickup}>Confirm Pickup</Button>
          )}
        </div>
      )}
      
      {rideStatus === 'in-progress' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Navigation className="w-5 h-5 mr-2 text-primary" />
            <span>Ride in progress</span>
          </div>
          
          {isRider && (
            <Button onClick={handleCompleteRide}>Complete Ride</Button>
          )}
        </div>
      )}
      
      {rideStatus === 'completed' && (
        <div className="flex items-center justify-center p-4">
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Ride Completed</h3>
            <p className="text-muted-foreground">Thank you for using carpooling!</p>
          </div>
        </div>
      )}
      
      {/* Payment details would go here */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex justify-between">
          <span>Total fare</span>
          <span className="font-semibold">₹{ride.pricePerPassenger}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Paid via wallet
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
