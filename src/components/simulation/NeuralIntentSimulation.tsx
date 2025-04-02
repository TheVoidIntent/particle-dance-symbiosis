
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Particle } from '@/types/simulation';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Brain, Play, Pause, RefreshCw, Network, ZapIcon } from 'lucide-react';

// Props interface with optional neural training properties
interface NeuralIntentSimulationProps {
  particles: Particle[];
  isRunning: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  addParticles: (count: number) => void;
  createParticle: (x?: number, y?: number) => Particle;
  emergenceIndex: number;
  intentFieldComplexity: number;
  interactionCount: number;
  isTraining?: boolean;
  trainingProgress?: number;
  modelAccuracy?: number;
  insightScore?: number;
  predictedParticles?: Particle[];
  intentPredictions?: number[][][];
  neuralArchitecture?: string;
  startTraining?: () => void;
  generatePredictions?: () => void;
  toggleNeuralArchitecture?: () => void;
}

const NeuralIntentSimulation: React.FC<NeuralIntentSimulationProps> = ({
  particles,
  isRunning,
  toggleSimulation,
  resetSimulation,
  addParticles,
  createParticle,
  emergenceIndex,
  intentFieldComplexity,
  interactionCount,
  isTraining = false,
  trainingProgress = 0,
  modelAccuracy = 0,
  insightScore = 0,
  predictedParticles = [],
  intentPredictions = [],
  neuralArchitecture = "standard",
  startTraining = () => console.log("Training not implemented"),
  generatePredictions = () => console.log("Predictions not implemented"),
  toggleNeuralArchitecture = () => console.log("Architecture toggle not implemented")
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="bg-gray-900 rounded-lg flex-1 mb-4 overflow-hidden">
          <ParticleCanvas 
            particles={particles}
            showIntentField={true}
            className="w-full h-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Neural Training</h3>
              {isTraining && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  Training
                </span>
              )}
            </div>
            
            {isTraining && (
              <Progress value={trainingProgress} className="h-2 mb-2" />
            )}
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Model Accuracy: {modelAccuracy.toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Emergence Metrics</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Emergence Index:</div>
              <div className="text-right">{emergenceIndex.toFixed(2)}</div>
              
              <div>Field Complexity:</div>
              <div className="text-right">{intentFieldComplexity.toFixed(2)}</div>
              
              <div>Insight Score:</div>
              <div className="text-right">{insightScore.toFixed(2)}</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSimulation}
              className="flex items-center"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startTraining}
              disabled={isTraining}
              className="flex items-center"
            >
              <Brain className="h-4 w-4 mr-1" />
              Train
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={generatePredictions}
              className="flex items-center"
            >
              <ZapIcon className="h-4 w-4 mr-1" />
              Predict
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleNeuralArchitecture}
              className="flex items-center"
            >
              <Network className="h-4 w-4 mr-1" />
              Architecture
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          Neural Intent Architecture: {neuralArchitecture} | Interactions: {interactionCount}
        </div>
      </CardContent>
    </Card>
  );
};

export default NeuralIntentSimulation;
