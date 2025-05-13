
import React, { useState, useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import Login from '../components/Login';
import RideForm from '../components/RideForm';
import RideList from '../components/RideList';
import RideTracker from '../components/RideTracker';
import EmergencySimulation from '../components/EmergencySimulation';
import RideSimulation from '../components/RideSimulation';
import { User, Ride, UserMode, Booking, EmergencyVehicle } from '../types';
import { initializeAppState, setUserMode, generateMockData } from '../services/localStorage';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMode, setCurrentMode] = useState<UserMode | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  
  // Initialize app from localStorage
  useEffect(() => {
    // Generate mock data if none exists
    const appState = initializeAppState();
    if (!appState.rides.length) {
      generateMockData();
      const updatedState = initializeAppState();
      setCurrentUser(updatedState.currentUser);
      setCurrentMode(updatedState.currentMode);
      setRides(updatedState.rides);
      setBookings(updatedState.bookings);
      setEmergencyVehicles(updatedState.emergencyVehicles);
    } else {
      setCurrentUser(appState.currentUser);
      setCurrentMode(appState.currentMode);
      setRides(appState.rides);
      setBookings(appState.bookings);
      setEmergencyVehicles(updatedState.emergencyVehicles);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentMode(null);
  };

  const handleModeChange = (mode: UserMode | null) => {
    setCurrentMode(mode);
  };

  const handleRideCreated = (newRide: Ride) => {
    setRides(prevRides => [...prevRides, newRide]);
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(prevBookings => [...prevBookings, newBooking]);
    
    // Update ride in the UI
    setRides(prevRides => prevRides.map(ride => 
      ride.id === newBooking.rideId 
        ? { 
            ...ride, 
            availableSeats: ride.availableSeats - 1,
            passengers: [...ride.passengers, newBooking.passengerId]
          }
        : ride
    ));
  };

  const handleEmergencyUpdate = (updatedVehicle: EmergencyVehicle) => {
    setEmergencyVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader 
        currentMode={currentMode} 
        onModeChange={handleModeChange}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto py-6 px-4">
        {/* Active Rides Tracker - shown regardless of mode if there are active bookings */}
        <div className="mb-6">
          <RideTracker 
            bookings={bookings} 
            rides={rides} 
            currentUser={currentUser} 
          />
        </div>
        
        {/* Mode-specific content */}
        {currentMode === 'rider' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RideForm currentUser={currentUser} onRideCreated={handleRideCreated} />
            </div>
            <div>
              <EmergencySimulation 
                emergencyVehicles={emergencyVehicles}
                onEmergencyUpdate={handleEmergencyUpdate}
              />
            </div>
          </div>
        )}
        
        {currentMode === 'passenger' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RideList 
                rides={rides} 
                currentUser={currentUser}
                onBookingCreated={handleBookingCreated}
              />
            </div>
            <div>
              <RideSimulation />
            </div>
          </div>
        )}
        
        {/* Welcome content when no mode is selected */}
        {!currentMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Welcome to carpooling</h2>
              <p className="text-muted-foreground mb-4">
                Choose a mode to get started:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-primary rounded-lg p-4 hover:bg-primary-light cursor-pointer transition-colors" onClick={() => handleModeChange('rider')}>
                  <h3 className="font-semibold text-primary mb-2">Rider Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Offer rides to passengers and share your journey.
                  </p>
                </div>
                
                <div className="border border-secondary rounded-lg p-4 hover:bg-secondary-light cursor-pointer transition-colors" onClick={() => handleModeChange('passenger')}>
                  <h3 className="font-semibold text-secondary mb-2">Passenger Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Find rides going your way at affordable prices.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Emergency Routing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our platform helps emergency vehicles navigate through traffic by
                  notifying nearby drivers to clear the route.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Choose Your Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch between rider and passenger modes anytime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Post or Find Rides</h3>
                  <p className="text-sm text-muted-foreground">
                    As a rider, post your journey. As a passenger, find rides that match your route.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Travel Together</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect, save costs, and reduce carbon footprint while traveling.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4 relative">
                <div className="h-4 bg-muted rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 car-animation">
                    🚗
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
