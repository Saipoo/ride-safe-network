
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Map from './Map';
import { EmergencyVehicle } from '../types';
import { updateEmergencyVehicle } from '../services/localStorage';
import { useToast } from '@/hooks/use-toast';

interface EmergencySimulationProps {
  emergencyVehicles: EmergencyVehicle[];
  onEmergencyUpdate: (updated: EmergencyVehicle) => void;
}

const EmergencySimulation: React.FC<EmergencySimulationProps> = ({
  emergencyVehicles,
  onEmergencyUpdate
}) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyVehicle | null>(null);

  const handleActivateEmergency = (vehicle: EmergencyVehicle) => {
    const updatedVehicle: EmergencyVehicle = {
      ...vehicle,
      status: vehicle.status === 'active' ? 'inactive' : 'active'
    };

    updateEmergencyVehicle(updatedVehicle);
    onEmergencyUpdate(updatedVehicle);
    setSelectedEmergency(updatedVehicle);

    if (updatedVehicle.status === 'active') {
      toast({
        title: "Emergency Route Activated",
        description: `Emergency vehicle is now active. Nearby riders will be notified.`,
        variant: "destructive"
      });
      setIsSimulating(true);
    } else {
      toast({
        title: "Emergency Route Deactivated",
        description: `Emergency vehicle is now inactive.`,
      });
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Emergency Routing Simulation</h2>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          This simulation demonstrates how emergency vehicles can notify nearby riders and
          create a clear path through traffic.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-4">
          {emergencyVehicles.map(vehicle => (
            <div key={vehicle.id} className="border rounded-lg p-4 flex-1 min-w-[250px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                </h3>
                <Badge status={vehicle.status} />
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                <div>From: {vehicle.currentLocation.address}</div>
                <div>To: {vehicle.destination.address}</div>
              </div>
              
              <Button
                variant={vehicle.status === 'active' ? "destructive" : "default"}
                className="w-full"
                onClick={() => handleActivateEmergency(vehicle)}
              >
                {vehicle.status === 'active' ? 'Deactivate' : 'Activate'} Emergency
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {selectedEmergency && (
        <div>
          <Map 
            emergencyVehicle={selectedEmergency}
            isEmergency={selectedEmergency.status === 'active'}
          />
          
          {isSimulating && selectedEmergency.status === 'active' && (
            <div className="mt-4 p-4 bg-warning-foreground text-white rounded-lg">
              <h3 className="font-medium">Emergency Alert</h3>
              <p className="text-sm mt-1">
                All riders near {selectedEmergency.currentLocation.address} to {selectedEmergency.destination.address} have been notified to clear the route.
              </p>
              <div className="flex items-center justify-center mt-4">
                <div className="w-12 h-6 relative">
                  <div className="absolute inset-0 flex items-center justify-center car-animation">
                    🚑
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Badge = ({ status }: { status: 'active' | 'inactive' }) => {
  if (status === 'active') {
    return (
      <div className="bg-warning text-white text-xs px-2 py-1 rounded-full">
        Active
      </div>
    );
  }
  
  return (
    <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
      Inactive
    </div>
  );
};

export default EmergencySimulation;
