import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Maximize, Play, Pause, RotateCw, ZapOff, Zap } from "lucide-react";
import { SimulationStats, Particle } from '@/types/simulation';
import SimulationAudioControls from './SimulationAudioControls';

interface ParticleControlsProps {
  running: boolean;
  setRunning: (running: boolean) => void;
  intentFluctuationRate: number;
  setIntentFluctuationRate: (rate: number) => void;
  maxParticles: number;
  setMaxParticles: (count: number) => void;
  resetSimulation?: () => void;
  onToggleInflation?: () => void;
  onToggleField?: () => void;
  inflationEnabled?: boolean;
  fieldEnabled?: boolean;
  showAdvancedControls?: boolean;
  particleCreationRate?: number;
  setParticleCreationRate?: (rate: number) => void;
  audioEnabled?: boolean;
  setAudioEnabled?: (enabled: boolean) => void;
  particles?: Particle[];
  stats?: SimulationStats;
}

const ParticleControls: React.FC<ParticleControlsProps> = ({
  running,
  setRunning,
  intentFluctuationRate,
  setIntentFluctuationRate,
  maxParticles,
  setMaxParticles,
  resetSimulation,
  onToggleInflation,
  onToggleField,
  inflationEnabled = true,
  fieldEnabled = true,
  showAdvancedControls = false,
  particleCreationRate = 1,
  setParticleCreationRate = () => {},
  audioEnabled = true,
  setAudioEnabled = () => {},
  particles = [],
  stats = { particleCount: 0, positiveParticles: 0, negativeParticles: 0, neutralParticles: 0, totalInteractions: 0 }
}) => {
  const [audioVolume, setAudioVolume] = useState(70);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <Button
          variant={running ? "default" : "outline"}
          size="sm"
          onClick={() => setRunning(!running)}
          className="w-24"
        >
          {running ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {running ? 'Pause' : 'Start'}
        </Button>
        
        {resetSimulation && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetSimulation}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm text-gray-300">Intent Fluctuation Rate</Label>
          <span className="text-sm text-gray-400">{intentFluctuationRate.toFixed(3)}</span>
        </div>
        <Slider 
          value={[intentFluctuationRate]}
          min={0.001}
          max={0.1}
          step={0.001}
          onValueChange={(values) => setIntentFluctuationRate(values[0])}
        />
        <p className="text-xs text-gray-500">Controls how often the intent field fluctuates to create particles</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm text-gray-300">Maximum Particles</Label>
          <span className="text-sm text-gray-400">{maxParticles}</span>
        </div>
        <Slider 
          value={[maxParticles]}
          min={10}
          max={500}
          step={10}
          onValueChange={(values) => setMaxParticles(values[0])}
        />
        <p className="text-xs text-gray-500">Limits the total number of particles in the simulation</p>
      </div>
      
      {showAdvancedControls && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm text-gray-300">Particle Creation Rate</Label>
            <span className="text-sm text-gray-400">{particleCreationRate.toFixed(1)} /s</span>
          </div>
          <Slider 
            value={[particleCreationRate]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={(values) => setParticleCreationRate(values[0])}
          />
          <p className="text-xs text-gray-500">How many new particles can be created per second</p>
        </div>
      )}
      
      <div className="space-y-3 pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-300">Auto-Simulation</span>
          </div>
          <Switch checked={running} onCheckedChange={setRunning} />
        </div>
        
        {onToggleInflation && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Maximize className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-300">Inflation Events</span>
            </div>
            <Switch checked={inflationEnabled} onCheckedChange={onToggleInflation} />
          </div>
        )}
        
        {onToggleField && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {fieldEnabled ? (
                <Zap className="h-4 w-4 text-yellow-400 mr-2" />
              ) : (
                <ZapOff className="h-4 w-4 text-gray-400 mr-2" />
              )}
              <span className="text-sm text-gray-300">Intent Field</span>
            </div>
            <Switch checked={fieldEnabled} onCheckedChange={onToggleField} />
          </div>
        )}
      </div>
      
      <SimulationAudioControls 
        audioEnabled={audioEnabled} 
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        audioVolume={audioVolume}
        onVolumeChange={setAudioVolume}
        isRunning={running}
      />
    </div>
  );
};

export default ParticleControls;
