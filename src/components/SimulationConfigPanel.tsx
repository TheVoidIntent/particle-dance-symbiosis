import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Download, 
  RefreshCw,
  BarChart3, 
  CloudRain, 
  Zap,
  Layers,
  Eye,
  Fuel
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimulationConfigPanelProps {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  renderMode: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles: boolean;
  energyConservation: boolean;
  probabilisticIntent: boolean;
  running: boolean;
  setIntentFluctuationRate: (value: number) => void;
  setMaxParticles: (value: number) => void;
  setLearningRate: (value: number) => void;
  setParticleCreationRate: (value: number) => void;
  setViewMode: (value: '2d' | '3d') => void;
  setRenderMode: (value: 'particles' | 'field' | 'density' | 'combined') => void;
  setUseAdaptiveParticles: (value: boolean) => void;
  setEnergyConservation: (value: boolean) => void;
  setProbabilisticIntent: (value: boolean) => void;
  setRunning: (value: boolean) => void;
  handleDownloadData: () => void;
  handleResetSimulation: () => void;
}

const SimulationConfigPanel: React.FC<SimulationConfigPanelProps> = ({
  intentFluctuationRate,
  maxParticles,
  learningRate,
  particleCreationRate,
  viewMode,
  renderMode,
  useAdaptiveParticles,
  energyConservation,
  probabilisticIntent,
  running,
  setIntentFluctuationRate,
  setMaxParticles,
  setLearningRate,
  setParticleCreationRate,
  setViewMode,
  setRenderMode,
  setUseAdaptiveParticles,
  setEnergyConservation,
  setProbabilisticIntent,
  setRunning,
  handleDownloadData,
  handleResetSimulation
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Simulation Controls</h3>
        <div className="flex gap-2">
          <Button 
            variant={running ? "outline" : "default"} 
            size="sm" 
            onClick={() => setRunning(!running)}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            <span className="ml-1">{running ? 'Pause' : 'Run'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetSimulation}
          >
            <RefreshCw size={16} />
            <span className="ml-1">Reset</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="intent-fluctuation">
              <CloudRain size={14} className="inline mr-1" />
              Intent Fluctuation
            </Label>
            <span className="text-xs text-muted-foreground">{intentFluctuationRate.toFixed(2)}</span>
          </div>
          <Slider 
            id="intent-fluctuation"
            min={0}
            max={0.1}
            step={0.001}
            value={[intentFluctuationRate]}
            onValueChange={(values) => setIntentFluctuationRate(values[0])}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-particles">
              <Layers size={14} className="inline mr-1" />
              Max Particles
            </Label>
            <span className="text-xs text-muted-foreground">{maxParticles}</span>
          </div>
          <Slider 
            id="max-particles"
            min={10}
            max={500}
            step={10}
            value={[maxParticles]}
            onValueChange={(values) => setMaxParticles(values[0])}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="learning-rate">
              <BarChart3 size={14} className="inline mr-1" />
              Learning Rate
            </Label>
            <span className="text-xs text-muted-foreground">{learningRate.toFixed(2)}</span>
          </div>
          <Slider 
            id="learning-rate"
            min={0.01}
            max={0.5}
            step={0.01}
            value={[learningRate]}
            onValueChange={(values) => setLearningRate(values[0])}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="creation-rate">
              <Zap size={14} className="inline mr-1" />
              Particle Creation Rate
            </Label>
            <span className="text-xs text-muted-foreground">{particleCreationRate.toFixed(1)}/s</span>
          </div>
          <Slider 
            id="creation-rate"
            min={0.1}
            max={5}
            step={0.1}
            value={[particleCreationRate]}
            onValueChange={(values) => setParticleCreationRate(values[0])}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="view-mode">
              <Eye size={14} className="inline mr-1" />
              View Mode
            </Label>
            <Select 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as '2d' | '3d')}
            >
              <SelectTrigger id="view-mode">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2d">2D</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="render-mode">
              <Fuel size={14} className="inline mr-1" />
              Render Mode
            </Label>
            <Select 
              value={renderMode} 
              onValueChange={(value) => setRenderMode(value as 'particles' | 'field' | 'density' | 'combined')}
            >
              <SelectTrigger id="render-mode">
                <SelectValue placeholder="Render Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="particles">Particles</SelectItem>
                <SelectItem value="field">Intent Field</SelectItem>
                <SelectItem value="density">Density</SelectItem>
                <SelectItem value="combined">Combined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="adaptive"
                checked={useAdaptiveParticles}
                onCheckedChange={setUseAdaptiveParticles}
              />
              <Label htmlFor="adaptive" className="cursor-pointer">Adaptive Particles</Label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="energy"
                checked={energyConservation}
                onCheckedChange={setEnergyConservation}
              />
              <Label htmlFor="energy" className="cursor-pointer">Energy Conservation</Label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="probabilistic"
                checked={probabilisticIntent}
                onCheckedChange={setProbabilisticIntent}
              />
              <Label htmlFor="probabilistic" className="cursor-pointer">Probabilistic Intent</Label>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleDownloadData}
        >
          <Download size={16} />
          <span className="ml-1">Download Data</span>
        </Button>
      </div>
    </div>
  );
};

export default SimulationConfigPanel;
