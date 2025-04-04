
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX, Bell, Smartphone } from "lucide-react";
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
          <span className="text-sm text-gray-300 flex items-center">
            <Bell className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            Cosmic Bell Sounds
          </span>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTestSound('fluctuation')}
              disabled={!audioEnabled}
              className="text-xs"
            >
              Fluctuation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTestSound('emergence')}
              disabled={!audioEnabled}
              className="text-xs"
            >
              Cosmic Bell
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile Wellness Experience Link */}
      <div className="pt-3 border-t border-gray-700/50">
        <Link to="/mobile-wellness">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Intent Audio Wellness Experience
          </Button>
        </Link>
        {isMobile && (
          <p className="text-xs text-gray-400 mt-2">
            Experience the wellness benefits of intent field audio on your mobile device
          </p>
        )}
      </div>
    </div>
  );
};

export default SimulationAudioControls;
