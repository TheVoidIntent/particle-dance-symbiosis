
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface SimulationControlsProps {
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
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
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
  handleDownloadData
}) => {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-xl">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="intentFluctuation">Intent Fluctuation Rate</Label>
            <span className="text-sm text-muted-foreground">{intentFluctuationRate}</span>
          </div>
          <Slider 
            id="intentFluctuation"
            min={0.001} 
            max={0.05} 
            step={0.001} 
            value={[intentFluctuationRate]} 
            onValueChange={(value) => setIntentFluctuationRate(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="maxParticles">Maximum Particles</Label>
            <span className="text-sm text-muted-foreground">{maxParticles}</span>
          </div>
          <Slider 
            id="maxParticles"
            min={10} 
            max={300} 
            step={10} 
            value={[maxParticles]} 
            onValueChange={(value) => setMaxParticles(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="learningRate">Learning Rate</Label>
            <span className="text-sm text-muted-foreground">{learningRate}</span>
          </div>
          <Slider 
            id="learningRate"
            min={0.01} 
            max={0.5} 
            step={0.01} 
            value={[learningRate]} 
            onValueChange={(value) => setLearningRate(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="particleCreationRate">Particle Creation Rate</Label>
            <span className="text-sm text-muted-foreground">{particleCreationRate}</span>
          </div>
          <Slider 
            id="particleCreationRate"
            min={0.1} 
            max={5} 
            step={0.1} 
            value={[particleCreationRate]} 
            onValueChange={(value) => setParticleCreationRate(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>View Mode</Label>
          <RadioGroup 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as '2d' | '3d')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2d" id="2d" />
              <Label htmlFor="2d">2D</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3d" id="3d" />
              <Label htmlFor="3d">3D</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Render Mode</Label>
          <RadioGroup 
            value={renderMode} 
            onValueChange={(value) => setRenderMode(value as 'particles' | 'field' | 'density' | 'combined')}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="particles" id="particles" />
              <Label htmlFor="particles">Particles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="field" id="field" />
              <Label htmlFor="field">Intent Field</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="density" id="density" />
              <Label htmlFor="density">Density</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="combined" id="combined" />
              <Label htmlFor="combined">Combined</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="adaptiveParticles" 
              checked={useAdaptiveParticles} 
              onCheckedChange={setUseAdaptiveParticles} 
            />
            <Label htmlFor="adaptiveParticles">Enable Adaptive Particles</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="energyConservation" 
              checked={energyConservation} 
              onCheckedChange={setEnergyConservation} 
            />
            <Label htmlFor="energyConservation">Energy Conservation</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="probabilisticIntent" 
              checked={probabilisticIntent} 
              onCheckedChange={setProbabilisticIntent} 
            />
            <Label htmlFor="probabilisticIntent">Probabilistic Intent Fields</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={running ? "destructive" : "default"} 
            onClick={() => setRunning(!running)}
          >
            {running ? "Pause Simulation" : "Resume Simulation"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadData}
          >
            <Download className="mr-2 h-4 w-4" />
            Save Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
