
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Music2, Volume2, VolumeX } from "lucide-react";

export interface SimulationAudioControlsProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  audioVolume: number;
  onVolumeChange: (value: number) => void;
  isRunning?: boolean;
}

const SimulationAudioControls: React.FC<SimulationAudioControlsProps> = ({
  audioEnabled,
  onToggleAudio,
  audioVolume,
  onVolumeChange,
  isRunning = true
}) => {
  return (
    <div className="space-y-3 pt-3 border-t border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Music2 className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-300">Simulation Audio</span>
        </div>
        <Switch checked={audioEnabled} onCheckedChange={onToggleAudio} />
      </div>
      
      {audioEnabled && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Volume</Label>
          <div className="flex items-center space-x-2">
            <VolumeX className="h-3 w-3 text-gray-500" />
            <Slider
              value={[audioVolume]}
              max={100}
              step={1}
              onValueChange={(values) => onVolumeChange(values[0])}
              disabled={!audioEnabled}
              className="flex-1"
            />
            <Volume2 className="h-3 w-3 text-gray-300" />
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        {audioEnabled 
          ? "Audio enabled: Particle interactions and events will produce sounds."
          : "Audio disabled: The simulation will run silently."}
      </div>
    </div>
  );
};

export default SimulationAudioControls;
