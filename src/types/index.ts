
export type UserMode = 'rider' | 'passenger';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export type VehicleType = 'Bike' | 'Car' | 'SUV';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  mode: UserMode;
}

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  riderRating: number;
  startLocation: Location;
  endLocation: Location;
  waypoints?: Location[];
  departureTime: string;
  vehicleType: VehicleType;
  vehicleImage?: string;
  availableSeats: number;
  pricePerPassenger: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  passengers: string[]; // passenger IDs
  createdAt: string;
  currentLocation?: Location; // For live tracking
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: 'pending' | 'confirmed' | 'in-progress' | 'cancelled' | 'completed';
  createdAt: string;
  otp?: string; // For ride verification
}

export interface EmergencyVehicle {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  currentLocation: Location;
  destination: Location;
  status: 'active' | 'inactive';
}

export interface AppState {
  currentUser: User | null;
  currentMode: UserMode | null;
  rides: Ride[];
  bookings: Booking[];
  emergencyVehicles: EmergencyVehicle[];
}
