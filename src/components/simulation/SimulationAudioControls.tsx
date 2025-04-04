
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX } from "lucide-react";

export interface SimulationAudioControlsProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  audioVolume: number;
  onVolumeChange: (value: number) => void;
  isRunning: boolean;
  onTestSound?: (type: string) => void;
}

const SimulationAudioControls: React.FC<SimulationAudioControlsProps> = ({
  audioEnabled,
  onToggleAudio,
  audioVolume,
  onVolumeChange,
  isRunning,
  onTestSound
}) => {
  return (
    <div className="space-y-4 py-2 border-t border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {audioEnabled ? (
            <Volume2 className="h-4 w-4 text-blue-400 mr-2" />
          ) : (
            <VolumeX className="h-4 w-4 text-gray-400 mr-2" />
          )}
          <span className="text-sm text-gray-300">Audio</span>
        </div>
        <Switch checked={audioEnabled} onCheckedChange={onToggleAudio} />
      </div>
      
      {audioEnabled && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">Volume</span>
            <span className="text-sm text-gray-400">{audioVolume}%</span>
          </div>
          <Slider 
            value={[audioVolume]} 
            min={0} 
            max={100} 
            step={5} 
            disabled={!audioEnabled}
            onValueChange={(values) => onVolumeChange(values[0])}
          />
        </div>
      )}
      
      {onTestSound && (
        <div className="space-y-2 pt-2">
          <span className="text-sm text-gray-300">Test Sounds</span>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTestSound('creation')}
              disabled={!audioEnabled}
              className="text-xs"
            >
              Creation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTestSound('interaction')}
              disabled={!audioEnabled}
              className="text-xs"
            >
              Interaction
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationAudioControls;
