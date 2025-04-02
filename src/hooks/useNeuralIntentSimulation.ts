
import { useState, useEffect, useCallback } from 'react';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from '@/hooks/useSimulationData';
import { toast } from 'sonner';
import { generateNeuralArchitecture, predictParticleEvolution } from '@/utils/neuralNetworkUtils';

// Type of neural network architecture
type ArchitectureType = 'feedforward' | 'cnn' | 'rnn' | 'transformer' | 'gan';

export function useNeuralIntentSimulation(particles: Particle[], stats: SimulationStats) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const [insightScore, setInsightScore] = useState(0);
  const [predictedParticles, setPredictedParticles] = useState<Particle[]>([]);
  const [intentPredictions, setIntentPredictions] = useState<string[]>([]);
  const [neuralArchitecture, setNeuralArchitecture] = useState<ArchitectureType>('feedforward');
  
  // Function to train the neural model
  const startTraining = useCallback(() => {
    if (isTraining) return;
    
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const trainingInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(trainingInterval);
          setIsTraining(false);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);
    
    // Simulate training completion
    setTimeout(() => {
      clearInterval(trainingInterval);
      setIsTraining(false);
      setTrainingProgress(100);
      
      // Calculate model "accuracy" based on particle data
      const particleCount = particles.length;
      const diversity = particles.reduce((acc, p) => {
        return acc + (p.type === 'standard' ? 1 : 2);
      }, 0) / (particleCount || 1);
      
      const interactionDepth = particles.reduce((acc, p) => {
        // Handle the case where age might be undefined
        const age = p.age || 0;
        return acc + ((age > 10 ? 1 : 0.5) * (p.interactionCount || 0));
      }, 0) / (particleCount || 1);
      
      const knowledgeAccumulation = particles.reduce((acc, p) => {
        return acc + p.knowledge;
      }, 0) / (particleCount || 1);
      
      const totalInteractions = particles.reduce((acc, p) => {
        // Handle the case where interactions might be undefined
        return acc + (p.interactions || 0);
      }, 0);
      
      // Calculate combined accuracy score (0-100)
      const accuracyBase = Math.min(85, 60 + Math.random() * 15);
      const diversityBonus = diversity * 10;
      const interactionBonus = interactionDepth * 5;
      const knowledgeBonus = knowledgeAccumulation * 20;
      
      const calculatedAccuracy = Math.min(
        99.5,
        accuracyBase + diversityBonus + interactionBonus + knowledgeBonus
      );
      
      setModelAccuracy(calculatedAccuracy);
      
      // Generate insight score (0-10)
      const baseInsight = 5 + Math.random() * 2;
      const complexityContribution = diversity * 0.8;
      const diversityContribution = (particles.length > 20 ? 1 : 0.5) * 0.7;
      const interactionDepthFactor = Math.min(1, totalInteractions / 100) * 1.2;
      
      // Architecture multiplier based on type
      let architectureMultiplier = 1.0;
      if (neuralArchitecture === 'cnn') architectureMultiplier = 1.05;
      if (neuralArchitecture === 'rnn') architectureMultiplier = 1.1;
      if (neuralArchitecture === 'transformer') architectureMultiplier = 1.2;
      if (neuralArchitecture === 'gan') architectureMultiplier = 1.15;
      
      const calculatedInsight = Math.min(
        10,
        (baseInsight + complexityContribution + diversityContribution + interactionDepthFactor) * 
        architectureMultiplier
      );
      
      setInsightScore(calculatedInsight);
      
      // Generate some predictions
      generatePredictions();
      
      toast.success(`Neural model training complete with ${calculatedAccuracy.toFixed(1)}% accuracy`);
    }, 3000);
  }, [isTraining, particles, neuralArchitecture]);
  
  // Generate predictions from the trained model
  const generatePredictions = useCallback(() => {
    if (modelAccuracy === 0 || particles.length === 0) return;
    
    // Generate predicted particles based on current ones
    const predicted = predictParticleEvolution(particles, neuralArchitecture);
    setPredictedParticles(predicted);
    
    // Generate textual predictions based on simulation state
    const predictions = [
      `Intent field will develop ${Math.random() > 0.5 ? 'positive' : 'negative'} polarity regions in the next ${2 + Math.floor(Math.random() * 5)} cycles.`,
      `${Math.floor(Math.random() * 10) + 5} new particle formations predicted in high density regions.`,
      `Knowledge transfer efficiency will increase by ${(Math.random() * 15).toFixed(1)}% with current interaction patterns.`,
      `Adaptive particles will develop ${Math.random() > 0.6 ? 'enhanced' : 'specialized'} intent sensing capabilities.`,
      `Particle clustering will intensify around ${Math.random() > 0.5 ? 'positive' : 'negative'} charge regions.`,
      `Energy conservation patterns suggest emergent ${Math.random() > 0.7 ? 'oscillation' : 'stabilization'} behaviors.`
    ];
    
    // Select a random subset of predictions
    const selectedPredictions = [];
    const indices = new Set<number>();
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * predictions.length));
    }
    
    indices.forEach(index => {
      selectedPredictions.push(predictions[index]);
    });
    
    setIntentPredictions(selectedPredictions);
  }, [modelAccuracy, particles, neuralArchitecture]);
  
  // Toggle between different neural architectures
  const toggleNeuralArchitecture = useCallback(() => {
    setNeuralArchitecture(prev => {
      switch (prev) {
        case 'feedforward': return 'cnn';
        case 'cnn': return 'rnn';
        case 'rnn': return 'transformer';
        case 'transformer': return 'gan';
        case 'gan': return 'feedforward';
        default: return 'feedforward';
      }
    });
    
    toast.info(`Switched to ${neuralArchitecture} neural architecture`);
  }, [neuralArchitecture]);
  
  // Create some initial predictions when particles change significantly
  useEffect(() => {
    if (particles.length > 10 && modelAccuracy > 0) {
      generatePredictions();
    }
  }, [particles.length, modelAccuracy, generatePredictions]);
  
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
