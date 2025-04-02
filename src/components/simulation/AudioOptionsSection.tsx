
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, Music, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { getAvailableAudioFiles } from '@/utils/audio/audioFileUtils';
import { 
  initAudioContext, 
  playSimulationAudio,
  setSimulationAudioVolume,
  playSimulationEvent
} from '@/utils/audio/simulationAudioUtils';

const AudioOptionsSection: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(70);
  const [availableAudioFiles, setAvailableAudioFiles] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const initAudio = () => {
    try {
      initAudioContext();
      setAudioInitialized(true);
      return true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      return false;
    }
  };
  
  useEffect(() => {
    // Load audio files list
    const loadAudioFiles = async () => {
      try {
        const files = await getAvailableAudioFiles('/audio/intentsim_page');
        setAvailableAudioFiles(files);
        console.log("Available audio files:", files);
      } catch (error) {
        console.error("Error loading audio files:", error);
      }
    };
    
    loadAudioFiles();
  }, []);
  
  useEffect(() => {
    // Update volume whenever it changes
    if (audioEnabled) {
      setSimulationAudioVolume(volume);
    }
  }, [volume, audioEnabled]);
  
  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    
    if (newState) {
      const initialized = initAudio();
      if (initialized) {
        setSimulationAudioVolume(volume);
        toast.success("Audio enabled");
        
        // Play a short beep to confirm audio is working
        setTimeout(() => {
          playSimulationEvent('field_fluctuation', { intentStrength: 0.3 });
        }, 500);
      } else {
        toast.error("Could not initialize audio system");
      }
    } else {
      toast.info("Audio disabled");
    }
  };
  
  const playAudioFile = (fileName: string) => {
    if (!audioEnabled) {
      toggleAudio();
      setTimeout(() => attemptPlayAudio(fileName), 500);
      return;
    }
    
    attemptPlayAudio(fileName);
  };
  
  const attemptPlayAudio = (fileName: string) => {
    setCurrentAudioFile(fileName);
    setIsPlaying(true);
    
    // Extract category from filename
    let category = 'general';
    if (fileName.includes('particle')) category = 'particle';
    if (fileName.includes('interaction')) category = 'interaction';
    if (fileName.includes('anomaly')) category = 'anomaly';
    if (fileName.includes('inflation')) category = 'inflation';
    if (fileName.includes('field')) category = 'field';
    
    // Extract file basename without extension
    const baseName = fileName.split('.')[0];
    
    playSimulationAudio(category, baseName);
    
    // Automatically reset playing state after a reasonable time (5 seconds)
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentAudioFile(null);
    }, 5000);
  };
  
  if (!audioEnabled && availableAudioFiles.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-indigo-400" />
              <h3 className="font-medium">Simulation Audio</h3>
            </div>
            <Switch 
              checked={audioEnabled} 
              onCheckedChange={toggleAudio} 
            />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-indigo-400" />
            <h3 className="font-medium">Simulation Audio</h3>
          </div>
          <Switch 
            checked={audioEnabled} 
            onCheckedChange={toggleAudio} 
          />
        </div>
        
        {audioEnabled && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="w-full"
              />
              <span className="text-xs text-gray-400 min-w-[2rem] text-right">{volume}%</span>
            </div>
            
            {availableAudioFiles.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-400 mb-2">Test Audio:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => playSimulationEvent('particle_creation', { charge: 'positive' })}
                    className="justify-start text-xs"
                  >
                    <Play className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Positive Particle</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => playSimulationEvent('particle_creation', { charge: 'negative' })}
                    className="justify-start text-xs"
                  >
                    <Play className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Negative Particle</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => playSimulationEvent('particle_interaction', { intensity: 0.7 })}
                    className="justify-start text-xs"
                  >
                    <Play className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Interaction</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => playSimulationEvent('field_fluctuation', { intentStrength: 0.5 })}
                    className="justify-start text-xs"
                  >
                    <Play className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Field Fluctuation</span>
                  </Button>
                </div>
                
                <div className="text-sm text-gray-400 mt-4 mb-2">Available Audio Files:</div>
                <div className="grid grid-cols-2 gap-2">
                  {availableAudioFiles.map(file => (
                    <Button
                      key={file}
                      size="sm"
                      variant={currentAudioFile === file ? "default" : "outline"}
                      className="justify-start text-xs truncate"
                      onClick={() => playAudioFile(file)}
                      disabled={isPlaying && currentAudioFile !== file}
                    >
                      {isPlaying && currentAudioFile === file ? (
                        <Pause className="h-3 w-3 mr-1 flex-shrink-0" />
                      ) : (
                        <Play className="h-3 w-3 mr-1 flex-shrink-0" />
                      )}
                      <span className="truncate">{file.replace('.mp3', '')}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-2">
                No audio samples found. Try the test sounds above.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioOptionsSection;
