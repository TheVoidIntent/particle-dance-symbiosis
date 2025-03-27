
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlayCircle, PauseCircle, RefreshCw } from 'lucide-react';

interface SimulationControlsProps {
  intentFluctuationRate: number;
  setIntentFluctuationRate: (value: number) => void;
  maxParticles: number;
  setMaxParticles: (value: number) => void;
  particleCreationRate: number;
  setParticleCreationRate: (value: number) => void;
  probabilisticIntent: boolean;
  setProbabilisticIntent: (value: boolean) => void;
  visualizationMode: 'particles' | 'field' | 'both';
  setVisualizationMode: (value: 'particles' | 'field' | 'both') => void;
  running: boolean;
  setRunning: (value: boolean) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  intentFluctuationRate,
  setIntentFluctuationRate,
  maxParticles,
  setMaxParticles,
  particleCreationRate,
  setParticleCreationRate,
  probabilisticIntent,
  setProbabilisticIntent,
  visualizationMode,
  setVisualizationMode,
  running,
  setRunning
}) => {
  // Reset simulation parameters to defaults
  const resetSimulation = () => {
    setIntentFluctuationRate(0.01);
    setMaxParticles(100);
    setParticleCreationRate(1);
    setProbabilisticIntent(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Simulation Controls</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRunning(!running)}
            className="border-gray-600"
          >
            {running ? 
              <><PauseCircle className="mr-1 h-4 w-4" /> Pause</> : 
              <><PlayCircle className="mr-1 h-4 w-4" /> Resume</>
            }
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetSimulation}
            className="border-gray-600"
          >
            <RefreshCw className="mr-1 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="fluctuation-rate" className="text-sm">Intent Fluctuation Rate</Label>
            <span className="text-xs text-gray-400">{intentFluctuationRate.toFixed(3)}</span>
          </div>
          <Slider 
            id="fluctuation-rate"
            value={[intentFluctuationRate]} 
            min={0.001} 
            max={0.05} 
            step={0.001} 
            onValueChange={(values) => setIntentFluctuationRate(values[0])}
            className="my-2" 
          />
          <div className="text-xs text-gray-400">
            Controls how quickly the intent field changes, affecting particle emergence and behavior.
          </div>
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label htmlFor="max-particles" className="text-sm">Maximum Particles</Label>
            <span className="text-xs text-gray-400">{maxParticles}</span>
          </div>
          <Slider 
            id="max-particles"
            value={[maxParticles]} 
            min={10} 
            max={300} 
            step={10} 
            onValueChange={(values) => setMaxParticles(values[0])}
            className="my-2" 
          />
          <div className="text-xs text-gray-400">
            Limits the total number of particles in the simulation.
          </div>
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label htmlFor="creation-rate" className="text-sm">Particle Creation Rate</Label>
            <span className="text-xs text-gray-400">{particleCreationRate.toFixed(1)}/sec</span>
          </div>
          <Slider 
            id="creation-rate"
            value={[particleCreationRate]} 
            min={0.1} 
            max={5} 
            step={0.1} 
            onValueChange={(values) => setParticleCreationRate(values[0])}
            className="my-2" 
          />
          <div className="text-xs text-gray-400">
            How quickly new particles emerge from the intent field.
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="probabilistic-intent" className="text-sm">Probabilistic Intent Field</Label>
            <div className="text-xs text-gray-400">
              Adds quantum-like randomness to the field
            </div>
          </div>
          <Switch 
            id="probabilistic-intent"
            checked={probabilisticIntent} 
            onCheckedChange={setProbabilisticIntent} 
          />
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <Label className="text-sm mb-2 block">Visualization Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={visualizationMode === 'particles' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizationMode('particles')}
              className={visualizationMode !== 'particles' ? 'border-gray-600' : ''}
            >
              Particles
            </Button>
            <Button 
              variant={visualizationMode === 'field' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizationMode('field')}
              className={visualizationMode !== 'field' ? 'border-gray-600' : ''}
            >
              Intent Field
            </Button>
            <Button 
              variant={visualizationMode === 'both' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizationMode('both')}
              className={visualizationMode !== 'both' ? 'border-gray-600' : ''}
            >
              Combined
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
