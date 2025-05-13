
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, Ride, EmergencyVehicle } from '../types';

interface MapProps {
  ride?: Ride;
  emergencyVehicle?: EmergencyVehicle;
  startLocation?: Location;
  endLocation?: Location;
  waypoints?: Location[];
  currentLocation?: Location | null;
  isEmergency?: boolean;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  ride,
  emergencyVehicle,
  startLocation,
  endLocation,
  waypoints = [],
  currentLocation = null,
  isEmergency = false,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylinesRef = useRef<L.Polyline[]>([]);
  
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it hasn't been initialized yet
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([28.6139, 77.2090], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMap.current);
    }

    const map = leafletMap.current;

    // Clean up old markers and polylines
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    
    polylinesRef.current.forEach(polyline => map.removeLayer(polyline));
    polylinesRef.current = [];

    // Set start and end locations
    const start = ride?.startLocation || startLocation;
    const end = ride?.endLocation || endLocation;

    // Create icons
    const startIcon = L.divIcon({
      className: 'bg-primary text-white rounded-full flex items-center justify-center',
      html: '<div class="w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center text-xs">A</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const endIcon = L.divIcon({
      className: 'bg-secondary text-white rounded-full flex items-center justify-center',
      html: '<div class="w-6 h-6 bg-secondary rounded-full border-2 border-white flex items-center justify-center text-xs">B</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const emergencyIcon = L.divIcon({
      className: 'bg-warning text-white rounded-full flex items-center justify-center emergency-pulse',
      html: '<div class="w-6 h-6 bg-warning rounded-full border-2 border-white flex items-center justify-center text-xs">🚑</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    
    const currentLocationIcon = L.divIcon({
      className: 'bg-blue-500 text-white rounded-full flex items-center justify-center',
      html: '<div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center pulse-animation">🚗</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add markers
    const markers = [];
    
    if (start) {
      const startMarker = L.marker([start.lat, start.lng], { icon: startIcon }).addTo(map)
        .bindPopup(start.address);
      markers.push(startMarker);
      markersRef.current.push(startMarker);
    }
    
    if (end) {
      const endMarker = L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map)
        .bindPopup(end.address);
      markers.push(endMarker);
      markersRef.current.push(endMarker);
    }
    
    // Add waypoint markers
    waypoints.forEach((wp, index) => {
      const waypointIcon = L.divIcon({
        className: 'bg-amber-500 text-white rounded-full flex items-center justify-center',
        html: `<div class="w-6 h-6 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-xs">${index + 1}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      
      const waypointMarker = L.marker([wp.lat, wp.lng], { icon: waypointIcon }).addTo(map)
        .bindPopup(wp.address);
      markers.push(waypointMarker);
      markersRef.current.push(waypointMarker);
    });

    // Add emergency vehicle marker if provided
    if (emergencyVehicle && emergencyVehicle.status === 'active') {
      const emergencyMarker = L.marker(
        [emergencyVehicle.currentLocation.lat, emergencyVehicle.currentLocation.lng],
        { icon: emergencyIcon }
      )
        .addTo(map)
        .bindPopup('Emergency Vehicle');
      markers.push(emergencyMarker);
      markersRef.current.push(emergencyMarker);

      // Add destination marker for emergency vehicle
      const emergencyDestMarker = L.marker(
        [emergencyVehicle.destination.lat, emergencyVehicle.destination.lng],
        { icon: endIcon }
      )
        .addTo(map)
        .bindPopup('Emergency Destination');
      markers.push(emergencyDestMarker);
      markersRef.current.push(emergencyDestMarker);

      // Add route line for emergency
      const emergencyRoute = [
        [emergencyVehicle.currentLocation.lat, emergencyVehicle.currentLocation.lng],
        [emergencyVehicle.destination.lat, emergencyVehicle.destination.lng]
      ];
      
      const emergencyPolyline = L.polyline(emergencyRoute as L.LatLngExpression[], {
        color: isEmergency ? '#F44336' : '#3366FF',
        weight: 4,
        opacity: 0.7,
        dashArray: isEmergency ? '10, 10' : '',
      }).addTo(map);
      polylinesRef.current.push(emergencyPolyline);
    }

    // Add current location marker if provided (for live tracking)
    if (currentLocation) {
      const currentLocationMarker = L.marker(
        [currentLocation.lat, currentLocation.lng],
        { icon: currentLocationIcon }
      )
        .addTo(map);
      markers.push(currentLocationMarker);
      markersRef.current.push(currentLocationMarker);
    }

    // Draw route if both start and end are available
    if (start && end) {
      const routePoints = [
        [start.lat, start.lng],
        ...waypoints.map(wp => [wp.lat, wp.lng]),
        [end.lat, end.lng],
      ];
      
      const routePolyline = L.polyline(routePoints as L.LatLngExpression[], {
        color: isEmergency ? '#F44336' : '#3366FF',
        weight: 4,
        opacity: 0.7,
        dashArray: isEmergency ? '10, 10' : '',
      }).addTo(map);
      polylinesRef.current.push(routePolyline);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    return () => {
      // No need to destroy the map, just clean up markers in the next render
    };
  }, [ride, emergencyVehicle, startLocation, endLocation, waypoints, currentLocation, isEmergency]);

  return <div ref={mapRef} className={`h-[400px] rounded-lg ${className}`}></div>;
};

export default Map;
