
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Map from './Map';
import { Location } from '../types';
import { MapPin, User, CheckCircle, Clock } from 'lucide-react';

const RideSimulation: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<Location | null>(null);
  
  const startLocation: Location = {
    address: 'Tech Park',
    lat: 28.5355,
    lng: 77.3910
  };
  
  const endLocation: Location = {
    address: 'City Center',
    lat: 28.6329,
    lng: 77.2195
  };
  
  const waypoints: Location[] = [
    {
      address: 'Pickup Point 1 - Passenger A',
      lat: 28.5562,
      lng: 77.3500
    },
    {
      address: 'Pickup Point 2 - Passenger B',
      lat: 28.5950,
      lng: 77.2800
    }
  ];

  // Calculate intermediate positions for smooth animation
  useEffect(() => {
    if (isSimulating) {
      // Set initial position
      setCurrentPosition(startLocation);
      
      let pathPoints: Location[] = [];
      // Create a detailed path with interpolated points
      const buildDetailedPath = () => {
        // Add start location
        pathPoints.push(startLocation);
        
        // Add interpolated points between start and first waypoint
        const pointsBetweenStartAndWP1 = interpolatePoints(
          startLocation, 
          waypoints[0], 
          5
        );
        pathPoints = [...pathPoints, ...pointsBetweenStartAndWP1];
        
        // Add first waypoint
        pathPoints.push(waypoints[0]);
        
        // Add interpolated points between first and second waypoints
        const pointsBetweenWP1AndWP2 = interpolatePoints(
          waypoints[0], 
          waypoints[1], 
          5
        );
        pathPoints = [...pathPoints, ...pointsBetweenWP1AndWP2];
        
        // Add second waypoint
        pathPoints.push(waypoints[1]);
        
        // Add interpolated points between second waypoint and end
        const pointsBetweenWP2AndEnd = interpolatePoints(
          waypoints[1], 
          endLocation, 
          5
        );
        pathPoints = [...pathPoints, ...pointsBetweenWP2AndEnd];
        
        // Add end location
        pathPoints.push(endLocation);
      };
      
      buildDetailedPath();
      
      // Create animation frames
      let currentStep = 0;
      const animationInterval = setInterval(() => {
        if (currentStep < pathPoints.length) {
          setCurrentPosition(pathPoints[currentStep]);
          
          // Set simulation narrative steps at key points
          if (currentStep === 0) {
            setSimulationStep(0); // Starting ride
          } else if (currentStep === 6) {
            setSimulationStep(1); // Approaching first pickup
          } else if (currentStep === 7) {
            setSimulationStep(2); // Picked up first passenger
          } else if (currentStep === 13) {
            setSimulationStep(3); // Approaching second pickup
          } else if (currentStep === 14) {
            setSimulationStep(4); // Picked up second passenger
          } else if (currentStep === pathPoints.length - 5) {
            setSimulationStep(5); // Near destination
          } else if (currentStep === pathPoints.length - 1) {
            setSimulationStep(6); // Arrived at destination
            
            // End simulation after a delay
            setTimeout(() => {
              setIsSimulating(false);
              setCurrentPosition(null);
              setSimulationStep(0);
            }, 2000);
          }
          
          currentStep++;
        } else {
          clearInterval(animationInterval);
        }
      }, 1000); // Update every second for smooth animation
      
      return () => {
        clearInterval(animationInterval);
      };
    }
  }, [isSimulating]);

  // Helper function to create points between two locations
  const interpolatePoints = (start: Location, end: Location, numPoints: number): Location[] => {
    const points: Location[] = [];
    for (let i = 1; i < numPoints; i++) {
      const fraction = i / numPoints;
      points.push({
        address: `Intermediate point`,
        lat: start.lat + (end.lat - start.lat) * fraction,
        lng: start.lng + (end.lng - start.lng) * fraction,
      });
    }
    return points;
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
  };

  const renderSimulationStatus = () => {
    switch (simulationStep) {
      case 0:
        return "Starting ride from Tech Park";
      case 1:
        return "Approaching Passenger A";
      case 2:
        return "Picked up Passenger A";
      case 3:
        return "Approaching Passenger B";
      case 4:
        return "Picked up Passenger B";
      case 5:
        return "Approaching destination";
      case 6:
        return "Arrived at City Center";
      default:
        return "Ready to simulate";
    }
  };

  const renderPassengerStatus = () => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
        <div className="flex items-center p-2 rounded-md bg-muted">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-2">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Passenger A</p>
            <div className="flex items-center text-xs text-muted-foreground">
              {simulationStep >= 2 ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Picked up
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Waiting
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center p-2 rounded-md bg-muted">
          <div className="w-8 h-8 rounded-full bg-secondary-light flex items-center justify-center mr-2">
            <User className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium">Passenger B</p>
            <div className="flex items-center text-xs text-muted-foreground">
              {simulationStep >= 4 ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Picked up
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Waiting
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ride Simulation</h2>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          See how a typical carpooling journey works. This simulation shows a ride from Tech Park
          to City Center with two passenger pickups along the way.
        </p>
      </div>
      
      <Map 
        startLocation={startLocation}
        endLocation={endLocation}
        waypoints={waypoints}
        currentLocation={currentPosition}
      />
      
      <div className="mt-4 flex flex-col items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(simulationStep / 6) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-center font-medium mb-2">
          {renderSimulationStatus()}
        </p>
        
        {isSimulating && renderPassengerStatus()}
        
        <Button 
          onClick={startSimulation}
          disabled={isSimulating}
          className="mt-2"
        >
          {isSimulating ? "Simulating..." : "Start Simulation"}
        </Button>
      </div>
    </div>
  );
};

export default RideSimulation;
