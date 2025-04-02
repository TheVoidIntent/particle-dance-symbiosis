import { useState, useCallback, useEffect, useRef } from 'react';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from '@/hooks/useSimulationData';
import { startMotherSimulation, getSimulationStats } from '@/utils/motherSimulation';

// Neural network architecture types
type NeuralArchitecture = 'feedforward' | 'cnn' | 'rnn' | 'transformer' | 'gan';

// Simplified prediction result
interface IntentPrediction {
  type: string;
  confidence: number;
  description: string;
}

export function useNeuralIntentSimulation(
  particles: Particle[],
  stats: SimulationStats
) {
  // Neural network state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const [insightScore, setInsightScore] = useState(0);
  const [predictedParticles, setPredictedParticles] = useState<Particle[]>([]);
  const [intentPredictions, setIntentPredictions] = useState<string[]>([]);
  const [neuralArchitecture, setNeuralArchitecture] = useState<NeuralArchitecture>('feedforward');
  
  // Training history for tracking progress
  const trainingHistoryRef = useRef<any[]>([]);
  
  // Simulated neural network training
  const startTraining = useCallback(() => {
    if (isTraining) return;
    
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simple training data preparation from particles
    const trainingData = particles.map(p => ({
      features: [
        p.charge === 'positive' ? 1 : p.charge === 'negative' ? -1 : 0,
        p.knowledge || 0,
        p.complexity || 1,
        p.intent,
        p.energy || 0,
        (p.age || 0) / 100 // Normalized age with fallback
      ],
      label: p.intent > 0.5 ? 'high_intent' : 
             p.intent < -0.5 ? 'negative_intent' : 
             'neutral_intent'
    }));
    
    // Simulate training epochs
    let progress = 0;
    const trainingInterval = setInterval(() => {
      progress += Math.random() * 5 + 2; // Random progress between 2-7%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(trainingInterval);
        
        // Simulated training completion
        const finalAccuracy = 70 + Math.random() * 25; // 70-95% accuracy
        setModelAccuracy(finalAccuracy);
        
        // Calculate insight score based on multiple factors
        const complexityFactor = stats.complexityIndex / 10;
        const entropyFactor = stats.systemEntropy * 2;
        const architectureBonus = 
          neuralArchitecture === 'transformer' ? 1.5 : 
          neuralArchitecture === 'rnn' ? 1.3 :
          neuralArchitecture === 'cnn' ? 1.2 :
          neuralArchitecture === 'gan' ? 1.4 : 1.0;
        
        const newInsightScore = (
          (finalAccuracy / 100) * 3 + 
          complexityFactor + 
          entropyFactor
        ) * architectureBonus;
        
        setInsightScore(Math.min(10, newInsightScore));
        
        // Generate initial predictions
        generatePredictions();
        
        // Store training history
        trainingHistoryRef.current.push({
          timestamp: Date.now(),
          architecture: neuralArchitecture,
          accuracy: finalAccuracy,
          insightScore: newInsightScore,
          particleCount: particles.length,
          complexity: stats.complexityIndex
        });
        
        setIsTraining(false);
        
        // Start another simulation instance to collect more data
        startMotherSimulation();
      }
      
      setTrainingProgress(progress);
    }, 300);
    
    return () => clearInterval(trainingInterval);
  }, [isTraining, particles, stats, neuralArchitecture]);
  
  // Generate intent predictions
  const generatePredictions = useCallback(() => {
    if (modelAccuracy === 0) return;
    
    // Simulation stats from mother simulation
    const motherStats = getSimulationStats();
    
    // Generate predictions based on the current particles and neural architecture
    const predictions: string[] = [];
    
    // Different prediction styles based on architecture
    if (neuralArchitecture === 'transformer') {
      predictions.push(`Predicted emergence of ${3 + Math.floor(Math.random() * 5)} new composite particles within next 200 cycles`);
      predictions.push(`Intent field will develop ${Math.random() > 0.5 ? 'positive' : 'negative'} gradient in NW quadrant`);
      predictions.push(`${Math.floor(Math.random() * 10 + 5)}% probability of spontaneous knowledge transfer event`);
    } else if (neuralArchitecture === 'rnn') {
      predictions.push(`Temporal intent pattern detected: oscillation with period of ${Math.floor(Math.random() * 20 + 10)} cycles`);
      predictions.push(`Particle interaction network will reach critical complexity in ~${Math.floor(Math.random() * 300 + 100)} cycles`);
      predictions.push(`Projected system entropy decrease of ${(Math.random() * 0.2).toFixed(2)} in next observation window`);
    } else if (neuralArchitecture === 'cnn') {
      predictions.push(`Spatial cluster forming at coordinates [${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}]`);
      predictions.push(`Intent field gradient strength increasing in central region by ${(Math.random() * 0.3 + 0.1).toFixed(2)}`);
      predictions.push(`Detected ${Math.floor(Math.random() * 3 + 1)} stable topology formations with high knowledge retention`);
    } else if (neuralArchitecture === 'gan') {
      predictions.push(`Generated ${Math.floor(Math.random() * 10 + 5)} synthetic particle interactions with ${(Math.random() * 20 + 80).toFixed(1)}% realism`);
      predictions.push(`Identified ${Math.floor(Math.random() * 3 + 1)} novel intent transfer mechanisms not present in training data`);
      predictions.push(`Adversarial testing reveals ${Math.floor(Math.random() * 10 + 90)}% intent model coherence`);
    } else {
      // Feedforward default
      predictions.push(`Predicted average knowledge increase of ${(Math.random() * 0.3).toFixed(2)} per 100 cycles`);
      predictions.push(`${Math.floor(Math.random() * 20 + 60)}% probability of cluster formation in next 50 cycles`);
      predictions.push(`Expected energy distribution shift toward ${Math.random() > 0.5 ? 'higher' : 'lower'} energy states`);
    }
    
    // Add some common predictions
    if (Math.random() > 0.7) {
      predictions.push(`Anomaly prediction: ${Math.floor(Math.random() * 15 + 5)}% chance of intent field fluctuation spike`);
    }
    
    if (Math.random() > 0.8) {
      const chargeShift = Math.random() > 0.5 ? 'positive' : 'negative';
      predictions.push(`System bias projecting toward ${chargeShift} charge dominance within ${Math.floor(Math.random() * 500 + 100)} cycles`);
    }
    
    setIntentPredictions(predictions);
    
    // Sometimes simulate predicted particles
    if (Math.random() > 0.7) {
      const newPredictedParticles: Particle[] = [];
      const count = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < count; i++) {
        // Create predicted particle based on neural model
        const predictedParticle: Particle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 800,
          y: Math.random() * 600,
          z: Math.random() * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 2,
          radius: 5 + Math.random() * 3,
          mass: 1.0 + Math.random() * 0.5,
          charge: Math.random() > 0.6 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral',
          type: 'adaptive',
          color: '#8b5cf6' + Math.floor(Math.random() * 33).toString(16),
          knowledge: 0.5 + Math.random() * 0.5, // Higher starting knowledge
          complexity: 2 + Math.random() * 2, // Higher complexity
          intent: Math.random() * 2 - 1,
          interactionCount: 0,
          lastInteraction: 0,
          intentDecayRate: 0.001 + Math.random() * 0.001,
          energy: 1.0 + Math.random() * 0.5,
          energyCapacity: 1.5 + Math.random() * 0.5,
          created: Date.now(),
          isPostInflation: false,
          scale: 1,
          adaptiveScore: Math.random(),
          interactions: 0,
          age: 0
        };
        
        newPredictedParticles.push(predictedParticle);
      }
      
      setPredictedParticles(newPredictedParticles);
    }
  }, [modelAccuracy, neuralArchitecture]);
  
  // Switch between different neural architectures
  const toggleNeuralArchitecture = useCallback(() => {
    const architectures: NeuralArchitecture[] = ['feedforward', 'cnn', 'rnn', 'transformer', 'gan'];
    const currentIndex = architectures.indexOf(neuralArchitecture);
    const nextIndex = (currentIndex + 1) % architectures.length;
    setNeuralArchitecture(architectures[nextIndex]);
  }, [neuralArchitecture]);
  
  // Return the neural intent simulation API
  return {
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
  };
}
