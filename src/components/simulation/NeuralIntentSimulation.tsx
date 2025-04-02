
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Particle, SimulationStats } from '@/types/simulation';
import ParticleCanvas from '@/components/simulation/ParticleCanvas';
import { Brain, Activity, Cpu } from 'lucide-react';

interface NeuralIntentSimulationProps {
  particles: Particle[];
  stats?: SimulationStats; // Make stats prop optional
  isRunning: boolean;
  trainingProgress?: number;
  modelAccuracy?: number;
  insightScore?: number;
}

const NeuralIntentSimulation: React.FC<NeuralIntentSimulationProps> = ({
  particles,
  stats,
  isRunning,
  trainingProgress = 0,
  modelAccuracy = 0,
  insightScore = 0
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [architecture, setArchitecture] = useState<'feedforward' | 'recurrent'>('feedforward');
  
  const startTraining = () => {
    setIsTraining(true);
    // Training logic would go here
    setTimeout(() => setIsTraining(false), 3000);
  };
  
  const toggleArchitecture = () => {
    setArchitecture(arch => arch === 'feedforward' ? 'recurrent' : 'feedforward');
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center">
          <Brain className="h-4 w-4 mr-1" />
          Neural Intent Simulation
        </h3>
        
        <Button 
          size="sm" 
          variant={architecture === 'feedforward' ? 'default' : 'outline'}
          onClick={toggleArchitecture}
          className="h-7 text-xs py-0"
        >
          <Cpu className="h-3 w-3 mr-1" />
          {architecture === 'feedforward' ? 'Feedforward' : 'Recurrent'}
        </Button>
      </div>
      
      {isTraining ? (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Training neural model...</span>
            <span>{Math.round(trainingProgress)}%</span>
          </div>
          <Progress value={trainingProgress} className="h-1" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button size="sm" disabled={!isRunning} onClick={startTraining} className="text-xs h-8">
            Train Model
          </Button>
          <Button size="sm" variant="outline" disabled={!isRunning} className="text-xs h-8">
            Generate Predictions
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800 rounded p-2">
          <div className="text-gray-400 mb-1">Model Accuracy</div>
          <div className="flex items-center">
            <Activity className="h-3 w-3 text-blue-400 mr-1" />
            <span className="font-mono">{modelAccuracy.toFixed(2)}</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-2">
          <div className="text-gray-400 mb-1">Insight Score</div>
          <div className="flex items-center">
            <Brain className="h-3 w-3 text-purple-400 mr-1" />
            <span className="font-mono">{insightScore.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <ParticleCanvas
        particles={particles}
        showIntentField={true}
        className="mt-3 h-40 w-full rounded border border-gray-700"
      />
    </div>
  );
};

export default NeuralIntentSimulation;
