
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
  isEmergency?: boolean;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  ride,
  emergencyVehicle,
  startLocation,
  endLocation,
  waypoints = [],
  isEmergency = false,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

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

    // Clean up markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

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

    // Add markers
    const markers = [];
    
    if (start) {
      markers.push(L.marker([start.lat, start.lng], { icon: startIcon }).addTo(map)
        .bindPopup(start.address));
    }
    
    if (end) {
      markers.push(L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map)
        .bindPopup(end.address));
    }

    // Add emergency vehicle marker if provided
    if (emergencyVehicle && emergencyVehicle.status === 'active') {
      markers.push(
        L.marker(
          [emergencyVehicle.currentLocation.lat, emergencyVehicle.currentLocation.lng],
          { icon: emergencyIcon }
        )
          .addTo(map)
          .bindPopup('Emergency Vehicle')
      );

      // Add destination marker for emergency vehicle
      markers.push(
        L.marker([emergencyVehicle.destination.lat, emergencyVehicle.destination.lng], { icon: endIcon })
          .addTo(map)
          .bindPopup('Emergency Destination')
      );

      // Add route line for emergency
      const emergencyRoute = [
        [emergencyVehicle.currentLocation.lat, emergencyVehicle.currentLocation.lng],
        [emergencyVehicle.destination.lat, emergencyVehicle.destination.lng]
      ];
      
      L.polyline(emergencyRoute as L.LatLngExpression[], {
        color: isEmergency ? '#F44336' : '#3366FF',
        weight: 4,
        opacity: 0.7,
        dashArray: isEmergency ? '10, 10' : '',
      }).addTo(map);
    }

    // Draw route if both start and end are available
    if (start && end) {
      const routePoints = [
        [start.lat, start.lng],
        ...waypoints.map(wp => [wp.lat, wp.lng]),
        [end.lat, end.lng],
      ];
      
      L.polyline(routePoints as L.LatLngExpression[], {
        color: isEmergency ? '#F44336' : '#3366FF',
        weight: 4,
        opacity: 0.7,
        dashArray: isEmergency ? '10, 10' : '',
      }).addTo(map);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    return () => {
      // No need to destroy the map, just clean up markers
    };
  }, [ride, emergencyVehicle, startLocation, endLocation, waypoints, isEmergency]);

  return <div ref={mapRef} className={`h-[400px] rounded-lg ${className}`}></div>;
};

export default Map;
