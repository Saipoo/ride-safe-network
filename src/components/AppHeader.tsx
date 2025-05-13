
import React from 'react';
import { UserMode } from '../types';
import { Button } from '@/components/ui/button';
import { setUserMode } from '../services/localStorage';
import { useToast } from '@/hooks/use-toast';

interface AppHeaderProps {
  currentMode: UserMode | null;
  onModeChange: (mode: UserMode | null) => void;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentMode, onModeChange, onLogout }) => {
  const { toast } = useToast();
  
  const handleModeChange = (mode: UserMode) => {
    if (currentMode === mode) {
      // Toggle mode off
      onModeChange(null);
      setUserMode(null);
    } else {
      // Set new mode
      onModeChange(mode);
      setUserMode(mode);
      toast({
        title: `Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`,
        description: `You are now in ${mode} mode.`
      });
    }
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <h1 className="text-xl font-bold text-primary">ride with us</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg overflow-hidden">
            <Button
              onClick={() => handleModeChange('rider')}
              variant={currentMode === 'rider' ? 'default' : 'outline'}
              className={`rounded-r-none ${currentMode === 'rider' ? 'bg-primary' : ''}`}
            >
              Rider
            </Button>
            <Button
              onClick={() => handleModeChange('passenger')}
              variant={currentMode === 'passenger' ? 'default' : 'outline'}
              className={`rounded-l-none ${currentMode === 'passenger' ? 'bg-secondary' : ''}`}
            >
              Passenger
            </Button>
          </div>
          <Button variant="ghost" onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
