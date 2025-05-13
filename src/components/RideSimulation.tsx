
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Map from './Map';
import { Location } from '../types';

const RideSimulation: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  
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
      address: 'Pickup Point 1',
      lat: 28.5562,
      lng: 77.3500
    },
    {
      address: 'Pickup Point 2',
      lat: 28.5950,
      lng: 77.2800
    }
  ];

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    
    // Simulate ride progression
    const interval = setInterval(() => {
      setSimulationStep(step => {
        const nextStep = step + 1;
        if (nextStep >= 5) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulating(false);
            setSimulationStep(0);
          }, 2000);
        }
        return nextStep;
      });
    }, 2000);
  };

  const renderSimulationStatus = () => {
    switch (simulationStep) {
      case 0:
        return "Starting ride from Tech Park";
      case 1:
        return "Picking up passenger 1";
      case 2:
        return "Picking up passenger 2";
      case 3:
        return "On the highway";
      case 4:
        return "Approaching destination";
      case 5:
        return "Arrived at City Center";
      default:
        return "Ready to simulate";
    }
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
      />
      
      <div className="mt-4 flex flex-col items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(simulationStep / 5) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-center font-medium mb-4">
          {renderSimulationStatus()}
        </p>
        
        <Button 
          onClick={startSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? "Simulating..." : "Start Simulation"}
        </Button>
      </div>
    </div>
  );
};

export default RideSimulation;
