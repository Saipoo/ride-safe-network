
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ride, Location, VehicleType, User } from '../types';
import { addRide } from '../services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Select } from '@/components/ui/select';

interface RideFormProps {
  currentUser: User;
  onRideCreated: (newRide: Ride) => void;
}

const RideForm: React.FC<RideFormProps> = ({ currentUser, onRideCreated }) => {
  const { toast } = useToast();
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [availableSeats, setAvailableSeats] = useState(1);
  const [pricePerPassenger, setPricePerPassenger] = useState(100);

  // This would normally come from a geocoding API
  const geocodeAddress = (address: string): Promise<Location> => {
    // Simulate geocoding with random coordinates
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address,
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lng: 77.2090 + (Math.random() - 0.5) * 0.1
        });
      }, 500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startAddress || !endAddress || !departureTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Geocode the addresses
      const startLocation = await geocodeAddress(startAddress);
      const endLocation = await geocodeAddress(endAddress);

      const newRide: Ride = {
        id: `ride-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        riderId: currentUser.id,
        riderName: currentUser.name,
        riderRating: currentUser.rating,
        startLocation,
        endLocation,
        departureTime: new Date(departureTime).toISOString(),
        vehicleType,
        vehicleImage: 'https://via.placeholder.com/150',
        availableSeats,
        pricePerPassenger,
        status: 'scheduled',
        passengers: [],
        createdAt: new Date().toISOString()
      };

      // Add to localStorage
      addRide(newRide);
      onRideCreated(newRide);

      toast({
        title: "Ride Created",
        description: "Your ride has been published successfully!",
      });

      // Reset form
      setStartAddress('');
      setEndAddress('');
      setDepartureTime('');
      setVehicleType('Car');
      setAvailableSeats(1);
      setPricePerPassenger(100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ride. Please try again.",
        variant: "destructive"
      });
    }
  };

  const maxPrice = 300; // This would normally be calculated based on distance and government regulations

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Post a New Ride</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="startAddress">Start Location</Label>
          <Input
            id="startAddress"
            placeholder="Enter pickup location"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endAddress">End Location</Label>
          <Input
            id="endAddress"
            placeholder="Enter drop-off location"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="departureTime">Departure Time</Label>
          <Input
            id="departureTime"
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <select
            id="vehicleType"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
          >
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
            <option value="SUV">SUV</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="availableSeats">Available Seats</Label>
          <Input
            id="availableSeats"
            type="number"
            min="1"
            max="10"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pricePerPassenger">
            Price Per Passenger (Max: ₹{maxPrice})
          </Label>
          <Input
            id="pricePerPassenger"
            type="number"
            min="1"
            max={maxPrice}
            value={pricePerPassenger}
            onChange={(e) => setPricePerPassenger(parseInt(e.target.value))}
          />
          {pricePerPassenger > maxPrice && (
            <p className="text-destructive text-sm">
              Price exceeds the maximum allowed rate
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={pricePerPassenger > maxPrice}
        >
          Post Ride
        </Button>
      </form>
    </div>
  );
};

export default RideForm;
