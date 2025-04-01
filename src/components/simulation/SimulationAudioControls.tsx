
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { 
  PlayCircle, 
  StopCircle, 
  Volume2, 
  VolumeX,
  Music,
  Bell,
  Waveform,
  InfoIcon
} from 'lucide-react';
import { 
  startSimulationAudioStream, 
  stopSimulationAudioStream, 
  isSimulationAudioPlaying,
  playSimulationAudio,
  playSimulationEvent,
  generateParticleSoundscape,
  initAudioContext
} from '@/utils/audio/simulationAudioUtils';
import { Particle, SimulationStats } from '@/types/simulation';
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimulationAudioControlsProps {
  particles: Particle[];
  stats: SimulationStats;
  isRunning: boolean;
}

const SimulationAudioControls: React.FC<SimulationAudioControlsProps> = ({
  particles,
  stats,
  isRunning
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const handleInitAudio = () => {
    if (!audioInitialized) {
      const initialized = initAudioContext();
      setAudioInitialized(initialized);
      if (initialized) {
        toast.success("Audio system initialized");
      }
    }
  };
  
  useEffect(() => {
    const checkAudioState = () => {
      setIsPlaying(isSimulationAudioPlaying());
    };
    
    const intervalId = setInterval(checkAudioState, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    if (!isRunning && isPlaying) {
      stopSimulationAudioStream();
      setIsPlaying(false);
    }
  }, [isRunning, isPlaying]);
  
  const toggleAudioStream = () => {
    handleInitAudio();
    
    if (!audioInitialized) {
      toast.error("Please wait for audio system to initialize");
      return;
    }
    
    if (isPlaying) {
      stopSimulationAudioStream();
      setIsPlaying(false);
    } else {
      if (!isRunning) {
        toast.error("Start the simulation to enable audio streaming");
        return;
      }
      
      startSimulationAudioStream(stats);
      setIsPlaying(true);
    }
  };
  
  const generateSoundscape = () => {
    handleInitAudio();
    
    if (!audioInitialized) {
      toast.error("Please wait for audio system to initialize");
      return;
    }
    
    if (particles.length === 0) {
      toast.error("No particles to generate audio from");
      return;
    }
    
    generateParticleSoundscape(particles);
    setIsPlaying(true);
  };
  
  const playTestAudio = (category: string, filename: string) => {
    handleInitAudio();
    
    if (!audioInitialized) {
      toast.error("Please wait for audio system to initialize");
      return;
    }
    
    playSimulationAudio(category, filename);
  };
  
  const playTestEvent = (eventType: string) => {
    handleInitAudio();
    
    if (!audioInitialized) {
      toast.error("Please wait for audio system to initialize");
      return;
    }
    
    const testData: any = {
      particle_creation: { charge: 'positive' },
      particle_interaction: { intensity: 0.7, charge1: 'positive', charge2: 'negative' },
      anomaly_detected: { severity: 0.8 },
      field_fluctuation: { intentStrength: 0.6 }
    };
    
    playSimulationEvent(eventType, testData[eventType] || {});
  };
  
  const toggleAudio = () => {
    handleInitAudio();
    
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      toast.success("Simulation audio enabled");
    } else {
      stopSimulationAudioStream();
      setIsPlaying(false);
      setIsAudioEnabled(false);
      toast.info("Simulation audio disabled");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Toggle 
            pressed={isAudioEnabled} 
            onPressedChange={toggleAudio}
            aria-label="Toggle audio"
            onClick={handleInitAudio}
            className="data-[state=on]:bg-primary"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="ml-2">Audio</span>
          </Toggle>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Hear your simulation through sonification</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {isAudioEnabled && (
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24"
            />
          </div>
        )}
      </div>
      
      {isAudioEnabled && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={isPlaying ? "destructive" : "default"}
              onClick={toggleAudioStream}
              disabled={!isRunning}
              className="flex items-center gap-1"
            >
              {isPlaying ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  <span>Stop Audio Stream</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Audio Stream</span>
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={generateSoundscape}
              className="flex items-center gap-1"
            >
              <Waveform className="w-4 h-4" />
              <span>Generate Soundscape</span>
            </Button>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-gray-400">Test Sounds:</div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => playTestEvent('particle_creation')}
              >
                <Bell className="w-4 h-4 mr-1" />
                Creation
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => playTestEvent('particle_interaction')}
              >
                <Bell className="w-4 h-4 mr-1" />
                Interaction
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => playTestEvent('anomaly_detected')}
              >
                <Bell className="w-4 h-4 mr-1" />
                Anomaly
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => playTestEvent('inflation_event')}
              >
                <Bell className="w-4 h-4 mr-1" />
                Inflation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationAudioControls;
