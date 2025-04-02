import { useCallback, useEffect, useRef, useState } from 'react';
import { Particle } from '@/types/simulation';

interface UseNeuralIntentSimulationProps {
  initialParticles?: Particle[];
  width?: number;
  height?: number;
  intentLearningRate?: number;
  shouldAutostart?: boolean;
}

/**
 * Hook for running a neural intent-based simulation
 */
export function useNeuralIntentSimulation({
  initialParticles = [],
  width = 800,
  height = 600,
  intentLearningRate = 0.01,
  shouldAutostart = false
}: UseNeuralIntentSimulationProps) {
  const [particles, setParticles] = useState<Particle[]>(initialParticles);
  const [isRunning, setIsRunning] = useState<boolean>(shouldAutostart);
  const [emergenceIndex, setEmergenceIndex] = useState<number>(0);
  const [intentFieldComplexity, setIntentFieldComplexity] = useState<number>(0);
  
  // Track simulation metrics
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  
  // Update a particle's position and properties
  const updateParticle = useCallback((particle: Particle): Particle => {
    // Get all necessary properties, handling optional values
    const x = particle.x;
    const y = particle.y;
    const vx = particle.vx;
    const vy = particle.vy;
    const radius = particle.radius;
    const intent = particle.intent ?? 0;
    const age = particle.age ?? 0;
    const energy = particle.energy ?? 100;
    
    // Calculate new position with boundaries
    let newX = x + vx;
    let newY = y + vy;
    let newVx = vx;
    let newVy = vy;
    
    // Handle boundary collisions
    if (newX - radius < 0) {
      newX = radius;
      newVx = -vx * 0.8;
    } else if (newX + radius > width) {
      newX = width - radius;
      newVx = -vx * 0.8;
    }
    
    if (newY - radius < 0) {
      newY = radius;
      newVy = -vy * 0.8;
    } else if (newY + radius > height) {
      newY = height - radius;
      newVy = -vy * 0.8;
    }
    
    // Add small random movements to simulate brownian motion
    newVx += (Math.random() - 0.5) * 0.1;
    newVy += (Math.random() - 0.5) * 0.1;
    
    // Update particle interactions - simulating interactions with intent field
    const interactions = (particle.interactions ?? 0) + (Math.random() < 0.05 ? 1 : 0);
    
    // Adjust intent based on interactions and charge
    let newIntent = intent;
    if (particle.charge === 'positive') {
      newIntent += Math.random() * intentLearningRate;
    } else if (particle.charge === 'negative') {
      newIntent -= Math.random() * intentLearningRate;
    } else {
      newIntent += (Math.random() - 0.5) * intentLearningRate;
    }
    
    // Keep intent in reasonable bounds
    newIntent = Math.max(0, Math.min(10, newIntent));
    
    // Update energy - particles slowly lose energy over time
    const newEnergy = Math.max(0, energy - 0.01);
    
    // Return updated particle
    return {
      ...particle,
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy,
      intent: newIntent,
      energy: newEnergy,
      age: age + 1,
      interactions
    };
  }, [width, height, intentLearningRate]);
  
  // Update all particles and calculate interactions
  const updateSimulation = useCallback(() => {
    if (!isRunning || particles.length === 0) return;
    
    // Update each particle's position and properties
    const updatedParticles = particles.map(updateParticle);
    
    // Check for interactions between particles
    for (let i = 0; i < updatedParticles.length; i++) {
      for (let j = i + 1; j < updatedParticles.length; j++) {
        const p1 = updatedParticles[i];
        const p2 = updatedParticles[j];
        
        // Calculate distance between particles
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check for collision/interaction
        if (distance < p1.radius + p2.radius + 5) {
          // Calculate interaction probability based on charges
          let interactionProbability = 0.5;
          
          if (p1.charge === 'positive' && p2.charge === 'positive') {
            interactionProbability = 0.7; // Positive charges like to interact
          } else if (p1.charge === 'negative' && p2.charge === 'negative') {
            interactionProbability = 0.3; // Negative charges avoid interaction
          } else if (
            (p1.charge === 'positive' && p2.charge === 'negative') ||
            (p1.charge === 'negative' && p2.charge === 'positive')
          ) {
            interactionProbability = 0.8; // Opposite charges strongly attract
          }
          
          // Check if interaction occurs
          if (Math.random() < interactionProbability) {
            // Exchange knowledge/intent between particles
            const p1Intent = p1.intent ?? 0;
            const p2Intent = p2.intent ?? 0;
            
            const intentDiff = Math.abs(p1Intent - p2Intent);
            const exchangeAmount = intentDiff * 0.1; // 10% knowledge transfer
            
            // Update particles based on interaction
            if (p1Intent > p2Intent) {
              updatedParticles[i] = {
                ...updatedParticles[i],
                intent: p1Intent - exchangeAmount * 0.2,
                knowledge: (p1.knowledge ?? 0) + 0.1
              };
              
              updatedParticles[j] = {
                ...updatedParticles[j],
                intent: p2Intent + exchangeAmount,
                knowledge: (p2.knowledge ?? 0) + 0.2
              };
            } else {
              updatedParticles[i] = {
                ...updatedParticles[i],
                intent: p1Intent + exchangeAmount,
                knowledge: (p1.knowledge ?? 0) + 0.2
              };
              
              updatedParticles[j] = {
                ...updatedParticles[j],
                intent: p2Intent - exchangeAmount * 0.2,
                knowledge: (p2.knowledge ?? 0) + 0.1
              };
            }
            
            // Increment interaction counter
            interactionsRef.current++;
          }
        }
      }
    }
    
    // Update state with new particles
    setParticles(updatedParticles);
    
    // Update frame counter
    frameCountRef.current++;
    
    // Calculate emergence and complexity metrics occasionally
    if (frameCountRef.current % 60 === 0) {
      // Calculate emergence index based on particle properties
      const totalKnowledge = updatedParticles.reduce((sum, p) => sum + (p.knowledge ?? 0), 0);
      const averageKnowledge = totalKnowledge / updatedParticles.length;
      const complexityFactor = updatedParticles.reduce((sum, p) => sum + (p.complexity ?? 0), 0) / updatedParticles.length;
      
      const newEmergenceIndex = Math.min(1, (averageKnowledge / 100) * complexityFactor * (interactionsRef.current / 1000));
      setEmergenceIndex(newEmergenceIndex);
      
      // Calculate intent field complexity
      const chargeDistribution = {
        positive: updatedParticles.filter(p => p.charge === 'positive').length,
        negative: updatedParticles.filter(p => p.charge === 'negative').length,
        neutral: updatedParticles.filter(p => p.charge === 'neutral').length
      };
      
      const chargeRatio = Math.min(
        chargeDistribution.positive, 
        chargeDistribution.negative, 
        chargeDistribution.neutral
      ) / Math.max(1, updatedParticles.length);
      
      const newComplexity = (chargeRatio * 0.5) + (newEmergenceIndex * 0.5);
      setIntentFieldComplexity(newComplexity);
    }
  }, [isRunning, particles, updateParticle]);
  
  // Animation frame loop
  useEffect(() => {
    if (!isRunning) return;
    
    let animationFrameId: number;
    
    const animate = () => {
      updateSimulation();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, updateSimulation]);
  
  // Create a new particle
  const createParticle = useCallback((x?: number, y?: number): Particle => {
    const posX = x ?? Math.random() * width;
    const posY = y ?? Math.random() * height;
    
    // Determine charge randomly
    const chargeRand = Math.random();
    const charge = chargeRand < 0.33 ? 'positive' : chargeRand < 0.66 ? 'negative' : 'neutral';
    
    // Set color based on charge
    let color = '#FFFFFF';
    if (charge === 'positive') {
      color = '#FF5555';
    } else if (charge === 'negative') {
      color = '#5555FF';
    } else {
      color = '#55FF55';
    }
    
    return {
      id: Date.now() + Math.floor(Math.random() * 10000), // Convert to number
      x: posX,
      y: posY,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 3 + Math.random() * 3,
      mass: 1 + Math.random() * 4,
      charge,
      color,
      type: 'normal',
      intent: Math.random() * 5,
      energy: 100,
      knowledge: 0,
      complexity: Math.random() * 5,
      interactionTendency: Math.random(),
      lastInteraction: 0,
      interactionCount: 0,
      z: Math.random() * 10,
      age: 0,
      interactions: 0
    };
  }, [width, height]);
  
  // Add multiple particles
  const addParticles = useCallback((count: number) => {
    const newParticles = Array.from({ length: count }, () => createParticle());
    setParticles(currentParticles => [...currentParticles, ...newParticles]);
  }, [createParticle]);
  
  // Reset the simulation
  const resetSimulation = useCallback(() => {
    setParticles([]);
    interactionsRef.current = 0;
    frameCountRef.current = 0;
    setEmergenceIndex(0);
    setIntentFieldComplexity(0);
  }, []);
  
  // Start/stop the simulation
  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);
  
  return {
    particles,
    isRunning,
    toggleSimulation,
    resetSimulation,
    addParticles,
    createParticle,
    emergenceIndex,
    intentFieldComplexity,
    interactionCount: interactionsRef.current
  };
}

export default useNeuralIntentSimulation;
