
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAudioEvents, AudioEventType } from '@/hooks/useAudioEvents';

interface SimulationAudioControlsProps {
  className?: string;
}

const SimulationAudioControls: React.FC<SimulationAudioControlsProps> = ({ 
  className = ""
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentAudioEvent, setCurrentAudioEvent] = useState<string | null>(null);
  const [eventTimeout, setEventTimeout] = useState<number | null>(null);
  
  const { triggerAudioEvent, setAudioEnabled } = useAudioEvents();
  
  useEffect(() => {
    // Listen for simulation events that should trigger sounds
    const handleSimulationEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, data } = customEvent.detail || {};
      
      // Map event types to audio event types
      let audioEventType: AudioEventType;
      switch (type) {
        case 'particle-created':
          audioEventType = 'particle_creation';
          break;
        case 'inflation-event':
          audioEventType = 'inflation_event';
          break;
        case 'cluster-formed':
          audioEventType = 'cluster_formation';
          break;
        case 'anomaly-detected':
          audioEventType = 'anomaly_detected';
          break;
        default:
          audioEventType = 'particle_creation';
      }
      
      // Only play sound if audio is enabled
      if (isAudioEnabled) {
        triggerAudioEvent(audioEventType, { 
          intensity: data?.intensity || 0.5,
          count: data?.count || 1
        });
        
        // Show the event indicator briefly
        setCurrentAudioEvent(type);
        
        // Clear any existing timeout
        if (eventTimeout !== null) {
          window.clearTimeout(eventTimeout);
        }
        
        // Set a new timeout to clear the event indicator
        const timeoutId = window.setTimeout(() => {
          setCurrentAudioEvent(null);
        }, 2000);
        
        setEventTimeout(timeoutId as any);
      }
    };
    
    // Add event listener
    window.addEventListener('simulation-event', handleSimulationEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener('simulation-event', handleSimulationEvent);
      if (eventTimeout !== null) {
        window.clearTimeout(eventTimeout);
      }
    };
  }, [isAudioEnabled, eventTimeout, triggerAudioEvent]);
  
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    setAudioEnabled(!isAudioEnabled);
    
    // Show the event indicator briefly to confirm toggle
    setCurrentAudioEvent(isAudioEnabled ? 'audio-disabled' : 'audio-enabled');
    
    // Clear any existing timeout
    if (eventTimeout !== null) {
      window.clearTimeout(eventTimeout);
    }
    
    // Set a new timeout to clear the event indicator
    const timeoutId = window.setTimeout(() => {
      setCurrentAudioEvent(null);
    }, 2000);
    
    setEventTimeout(timeoutId as any);
  };
  
  return (
    <div className={`absolute top-4 right-4 flex items-center gap-2 ${className}`}>
      {currentAudioEvent && (
        <div className="bg-black/60 text-white text-xs py-1 px-2 rounded animate-fade-in">
          {currentAudioEvent.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </div>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className="bg-black/60 text-white hover:bg-black/80"
            >
              {isAudioEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isAudioEnabled ? 'Disable Audio' : 'Enable Audio'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SimulationAudioControls;
