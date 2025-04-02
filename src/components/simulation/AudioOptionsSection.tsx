
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Music2, Volume2, VolumeX } from "lucide-react";

export interface AudioOptionsSectionProps {
  onToggleAudio?: () => void;
  audioEnabled?: boolean;
  audioVolume?: number;
  onVolumeChange?: (value: number) => void;
}

const AudioOptionsSection: React.FC<AudioOptionsSectionProps> = ({
  onToggleAudio = () => {},
  audioEnabled = true,
  audioVolume = 70,
  onVolumeChange = () => {}
}) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music2 className="h-4 w-4 text-indigo-400" />
          Audio Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {audioEnabled ? (
                <Volume2 className="h-4 w-4 text-gray-300" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-500" />
              )}
              <Label htmlFor="audio-toggle" className="text-sm">
                Simulation Audio
              </Label>
            </div>
            <Switch 
              id="audio-toggle" 
              checked={audioEnabled} 
              onCheckedChange={onToggleAudio}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="volume-slider" className="text-sm">
              Volume
            </Label>
            <div className="flex items-center space-x-2">
              <VolumeX className="h-3 w-3 text-gray-500" />
              <Slider
                id="volume-slider"
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
          
          <div className="pt-2 text-xs text-gray-500">
            Sound effects enhance the visualization of particle interactions and field fluctuations.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioOptionsSection;
