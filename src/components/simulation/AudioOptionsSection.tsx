
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
  setSimulationAudioVolume
} from '@/utils/audio/simulationAudioUtils';

const AudioOptionsSection: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(70);
  const [availableAudioFiles, setAvailableAudioFiles] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize audio and check for available files
    const loadAudioFiles = async () => {
      const initialized = initAudioContext();
      if (!initialized) return;
      
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
    setSimulationAudioVolume(volume);
  }, [volume]);
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast.success(audioEnabled ? "Audio disabled" : "Audio enabled");
    
    if (!audioEnabled) {
      initAudioContext();
    }
  };
  
  const playAudioFile = (fileName: string) => {
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
                <div className="text-sm text-gray-400">Available Audio Samples:</div>
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
                No audio samples found.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioOptionsSection;
