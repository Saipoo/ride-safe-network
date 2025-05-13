
import { AppState, User, Ride, Booking, EmergencyVehicle } from '../types';

const APP_STATE_KEY = 'ride_with_us_app_state';
const DEFAULT_STATE: AppState = {
  currentUser: null,
  currentMode: null,
  rides: [],
  bookings: [],
  emergencyVehicles: []
};

// Initialize app state from localStorage or with default values
export const initializeAppState = (): AppState => {
  const storedState = localStorage.getItem(APP_STATE_KEY);
  if (storedState) {
    try {
      return JSON.parse(storedState);
    } catch (error) {
      console.error('Error parsing stored app state:', error);
      return DEFAULT_STATE;
    }
  }
  return DEFAULT_STATE;
};

// Save current app state to localStorage
export const saveAppState = (state: AppState): void => {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
};

// User related functions
export const setCurrentUser = (user: User | null): AppState => {
  const state = initializeAppState();
  const newState = { ...state, currentUser: user };
  saveAppState(newState);
  return newState;
};

export const setUserMode = (mode: 'rider' | 'passenger' | null): AppState => {
  const state = initializeAppState();
  const newState = { ...state, currentMode: mode };
  saveAppState(newState);
  return newState;
};

// Ride related functions
export const addRide = (ride: Ride): AppState => {
  const state = initializeAppState();
  const newState = { ...state, rides: [...state.rides, ride] };
  saveAppState(newState);
  return newState;
};

export const updateRide = (updatedRide: Ride): AppState => {
  const state = initializeAppState();
  const newState = {
    ...state,
    rides: state.rides.map(ride => 
      ride.id === updatedRide.id ? updatedRide : ride
    )
  };
  saveAppState(newState);
  return newState;
};

export const deleteRide = (rideId: string): AppState => {
  const state = initializeAppState();
  const newState = {
    ...state,
    rides: state.rides.filter(ride => ride.id !== rideId)
  };
  saveAppState(newState);
  return newState;
};

// Booking related functions
export const addBooking = (booking: Booking): AppState => {
  const state = initializeAppState();
  const newState = { ...state, bookings: [...state.bookings, booking] };
  saveAppState(newState);
  return newState;
};

export const updateBooking = (updatedBooking: Booking): AppState => {
  const state = initializeAppState();
  const newState = {
    ...state,
    bookings: state.bookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    )
  };
  saveAppState(newState);
  return newState;
};

// Emergency vehicle related functions
export const addEmergencyVehicle = (vehicle: EmergencyVehicle): AppState => {
  const state = initializeAppState();
  const newState = { 
    ...state, 
    emergencyVehicles: [...state.emergencyVehicles, vehicle] 
  };
  saveAppState(newState);
  return newState;
};

export const updateEmergencyVehicle = (updatedVehicle: EmergencyVehicle): AppState => {
  const state = initializeAppState();
  const newState = {
    ...state,
    emergencyVehicles: state.emergencyVehicles.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    )
  };
  saveAppState(newState);
  return newState;
};

// Mock data generation
export const generateMockData = (): void => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    rating: 4.8,
    mode: 'rider'
  };

  const mockRides: Ride[] = [
    {
      id: '1',
      riderId: '2',
      riderName: 'Alice Smith',
      riderRating: 4.9,
      startLocation: {
        address: 'Downtown',
        lat: 28.6139,
        lng: 77.2090
      },
      endLocation: {
        address: 'Tech Park',
        lat: 28.5355,
        lng: 77.3910
      },
      departureTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now
      vehicleType: 'Car',
      vehicleImage: 'https://via.placeholder.com/150',
      availableSeats: 3,
      pricePerPassenger: 120,
      status: 'scheduled',
      passengers: [],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      riderId: '3',
      riderName: 'Bob Johnson',
      riderRating: 4.7,
      startLocation: {
        address: 'City Center',
        lat: 28.6329,
        lng: 77.2195
      },
      endLocation: {
        address: 'Airport',
        lat: 28.5562,
        lng: 77.1000
      },
      departureTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
      vehicleType: 'SUV',
      vehicleImage: 'https://via.placeholder.com/150',
      availableSeats: 5,
      pricePerPassenger: 200,
      status: 'scheduled',
      passengers: [],
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      riderId: '4',
      riderName: 'Charlie Brown',
      riderRating: 4.5,
      startLocation: {
        address: 'Mall',
        lat: 28.5374,
        lng: 77.2410
      },
      endLocation: {
        address: 'Stadium',
        lat: 28.6127,
        lng: 77.2772
      },
      departureTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutes from now
      vehicleType: 'Bike',
      vehicleImage: 'https://via.placeholder.com/150',
      availableSeats: 1,
      pricePerPassenger: 80,
      status: 'scheduled',
      passengers: [],
      createdAt: new Date().toISOString()
    }
  ];

  const mockEmergencyVehicle: EmergencyVehicle = {
    id: 'e1',
    type: 'ambulance',
    currentLocation: {
      address: 'Hospital',
      lat: 28.6127,
      lng: 77.2090
    },
    destination: {
      address: 'Accident Site',
      lat: 28.5955,
      lng: 77.2211
    },
    status: 'active'
  };

  const initialState: AppState = {
    currentUser: mockUser,
    currentMode: null,
    rides: mockRides,
    bookings: [],
    emergencyVehicles: [mockEmergencyVehicle]
  };

  saveAppState(initialState);
};
