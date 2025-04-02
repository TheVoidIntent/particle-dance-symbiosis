
import React, { useState, useEffect } from 'react';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from '@/hooks/useSimulationData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNeuralIntentSimulation } from '@/hooks/useNeuralIntentSimulation';

interface NeuralIntentSimulationProps {
  particles: Particle[];
  stats: SimulationStats;
  isRunning: boolean;
}

const NeuralIntentSimulation: React.FC<NeuralIntentSimulationProps> = ({
  particles,
  stats,
  isRunning
}) => {
  const {
    isTraining,
    trainingProgress,
    modelAccuracy,
    insightScore,
    predictedParticles,
    intentPredictions,
    neuralArchitecture,
    startTraining,
    generatePredictions,
    toggleNeuralArchitecture
  } = useNeuralIntentSimulation(particles, stats);

  // Generate predictions periodically when running
  useEffect(() => {
    if (isRunning && !isTraining && modelAccuracy > 0) {
      const interval = setInterval(() => {
        generatePredictions();
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [isRunning, isTraining, modelAccuracy, generatePredictions]);
  
  const handleStartTraining = () => {
    startTraining();
    toast.success("Neural Intent model training started", {
      description: "Training a model to understand particle intent patterns"
    });
  };
  
  const getArchitectureBadge = () => {
    switch (neuralArchitecture) {
      case 'cnn':
        return <Badge className="bg-blue-600">CNN</Badge>;
      case 'rnn':
        return <Badge className="bg-green-600">RNN</Badge>;
      case 'transformer':
        return <Badge className="bg-purple-600">Transformer</Badge>;
      case 'gan':
        return <Badge className="bg-amber-600">GAN</Badge>;
      default:
        return <Badge className="bg-slate-600">Feed-Forward</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center">
            <Brain className="mr-2 h-5 w-5 text-indigo-400" />
            Neural Intent Lab
          </CardTitle>
          {getArchitectureBadge()}
        </div>
        <CardDescription className="text-slate-300">
          Train neural networks on particle intent patterns
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {isTraining ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Training neural model...</span>
                <span>{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} className="h-2" />
            </div>
          ) : (
            <>
              {modelAccuracy > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700 p-2 rounded">
                      <div className="text-xs text-slate-300 mb-1">Model Accuracy</div>
                      <div className="text-xl font-semibold text-white">{modelAccuracy.toFixed(1)}%</div>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <div className="text-xs text-slate-300 mb-1">Insight Score</div>
                      <div className="text-xl font-semibold text-white">{insightScore.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 p-2 rounded">
                    <div className="text-xs text-slate-300 mb-1 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
                      Intent Predictions
                    </div>
                    <div className="text-sm text-white">
                      {intentPredictions.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {intentPredictions.slice(0, 3).map((pred, idx) => (
                            <li key={idx} className="text-xs">{pred}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 text-xs">No predictions available</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700/50 p-3 rounded text-center text-sm text-slate-300">
                  Train the model to generate intent predictions and insights
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleStartTraining}
          disabled={isTraining}
        >
          {isTraining ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Training Neural Network...
            </>
          ) : modelAccuracy > 0 ? (
            'Retrain Neural Network'
          ) : (
            'Train Neural Network'
          )}
        </Button>
        
        <Button 
          className="w-full bg-slate-700 hover:bg-slate-600 text-white"
          onClick={toggleNeuralArchitecture}
          disabled={isTraining}
          variant="outline"
        >
          <Zap className="mr-2 h-4 w-4" />
          Switch Architecture
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NeuralIntentSimulation;
