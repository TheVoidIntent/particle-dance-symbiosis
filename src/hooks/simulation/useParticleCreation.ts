
import { useState, useEffect, useCallback } from 'react';
import { Particle } from './types';
import { useSimulationStore } from '@/stores/simulationStore';
import { generateUniqueId } from '@/utils/idGenerator';
import { calculateComplexity } from '@/utils/complexityCalculator';

interface UseParticleCreationProps {
  maxParticles: number;
  particleCreationRate: number;
  intentFluctuationRate: number;
  probabilisticIntent: boolean;
  running: boolean;
}

export const useParticleCreation = ({
  maxParticles,
  particleCreationRate,
  intentFluctuationRate,
  probabilisticIntent,
  running,
}: UseParticleCreationProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lastCreationTime, setLastCreationTime] = useState(Date.now());
  const { incrementInteractionCount } = useSimulationStore();

  const getRandomPosition = useCallback(() => {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 100 - 50,
    };
  }, []);

  const getRandomVelocity = useCallback(() => {
    const speed = 0.5 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
      z: (Math.random() - 0.5) * speed,
    };
  }, []);

  const getRandomParticleType = useCallback((): 'positive' | 'negative' | 'neutral' => {
    const types: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
  }, []);

  const createParticle = useCallback(() => {
    if (particles.length >= maxParticles) return;

    const position = getRandomPosition();
    const velocity = getRandomVelocity();
    const chargeType = getRandomParticleType();
    
    const newParticle: Particle = {
      id: parseInt(generateUniqueId().split('-')[1]),
      x: position.x,
      y: position.y,
      z: position.z,
      vx: velocity.x,
      vy: velocity.y,
      vz: velocity.z,
      type: 'standard',
      charge: chargeType,
      radius: 3 + Math.random() * 5,
      mass: 1 + Math.random() * 2,
      energy: 50 + Math.random() * 50,
      knowledge: 0,
      complexity: 1,
      intent: Math.random() * 2 - 1,
      age: 0,
      interactions: 0,
      lastInteraction: Date.now(),
      color: chargeType === 'positive' ? 'rgba(255, 0, 0, 0.8)' : 
             chargeType === 'negative' ? 'rgba(0, 0, 255, 0.8)' : 
             'rgba(0, 255, 0, 0.8)',
      created: Date.now(),
      interactionCount: 0,
      intentDecayRate: 0.001,
      energyCapacity: 100,
    };

    setParticles((prevParticles) => [...prevParticles, newParticle]);
  }, [
    particles.length,
    maxParticles,
    getRandomPosition,
    getRandomVelocity,
    getRandomParticleType,
    intentFluctuationRate,
  ]);

  const updateParticles = useCallback(() => {
    if (!running) return;

    const now = Date.now();
    const timeSinceLastCreation = now - lastCreationTime;
    const creationInterval = 1000 / particleCreationRate;

    if (timeSinceLastCreation >= creationInterval && particles.length < maxParticles) {
      createParticle();
      setLastCreationTime(now);
    }

    setParticles((prevParticles) => {
      return prevParticles.map((particle) => {
        // Update position based on velocity
        const newPosition = {
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          z: particle.z + particle.vz,
        };

        // Boundary checks and bounce
        const bounds = {
          x: window.innerWidth,
          y: window.innerHeight,
          z: 100, // Arbitrary depth for 3D
        };

        let newVelocity = { 
          x: particle.vx,
          y: particle.vy,
          z: particle.vz
        };

        if (newPosition.x <= 0 || newPosition.x >= bounds.x) {
          newVelocity.x = -newVelocity.x;
        }
        if (newPosition.y <= 0 || newPosition.y >= bounds.y) {
          newVelocity.y = -newVelocity.y;
        }
        if (newPosition.z <= -bounds.z / 2 || newPosition.z >= bounds.z / 2) {
          newVelocity.z = -newVelocity.z;
        }

        // Apply intent vector (with probabilistic variation if enabled)
        let intentEffect = { 
          x: particle.intent * 0.01,
          y: particle.intent * 0.01,
          z: particle.intent * 0.01
        };
        
        if (probabilisticIntent) {
          // Add random fluctuations to intent
          intentEffect = {
            x: intentEffect.x + (Math.random() - 0.5) * intentFluctuationRate * 0.5,
            y: intentEffect.y + (Math.random() - 0.5) * intentFluctuationRate * 0.5,
            z: intentEffect.z + (Math.random() - 0.5) * intentFluctuationRate * 0.5,
          };
        }

        newVelocity = {
          x: newVelocity.x + intentEffect.x,
          y: newVelocity.y + intentEffect.y,
          z: newVelocity.z + intentEffect.z,
        };

        // Ensure position is within bounds
        const boundedPosition = {
          x: Math.max(0, Math.min(bounds.x, newPosition.x)),
          y: Math.max(0, Math.min(bounds.y, newPosition.y)),
          z: Math.max(-bounds.z / 2, Math.min(bounds.z / 2, newPosition.z)),
        };

        // Increment age
        const newAge = particle.age + 1;
        
        // Update complexity based on age and interactions
        const newComplexity = calculateComplexity(particle.complexity, particle.interactions, newAge);

        return {
          ...particle,
          x: boundedPosition.x,
          y: boundedPosition.y,
          z: boundedPosition.z,
          vx: newVelocity.x,
          vy: newVelocity.y,
          vz: newVelocity.z,
          age: newAge,
          complexity: newComplexity,
        };
      });
    });
  }, [
    running,
    lastCreationTime,
    particles.length,
    maxParticles,
    particleCreationRate,
    createParticle,
    probabilisticIntent,
    intentFluctuationRate,
  ]);

  // Handle particle interactions
  const handleInteractions = useCallback(() => {
    if (!running) return;

    setParticles((prevParticles) => {
      const interactionRadius = 15; // Distance threshold for interaction
      const newParticles = [...prevParticles];
      
      // Check each pair of particles for potential interactions
      for (let i = 0; i < newParticles.length; i++) {
        for (let j = i + 1; j < newParticles.length; j++) {
          const p1 = newParticles[i];
          const p2 = newParticles[j];
          
          // Calculate distance between particles
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dz = p2.z - p1.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < interactionRadius) {
            // Particles are close enough to interact
            incrementInteractionCount();
            
            // Update interaction counts
            newParticles[i] = {
              ...p1,
              interactions: p1.interactions + 1,
              lastInteraction: Date.now(),
              // Knowledge increases with each interaction
              knowledge: Math.min(1, p1.knowledge + 0.01),
            };
            
            newParticles[j] = {
              ...p2,
              interactions: p2.interactions + 1,
              lastInteraction: Date.now(),
              // Knowledge increases with each interaction
              knowledge: Math.min(1, p2.knowledge + 0.01),
            };
            
            // Simple repulsion/attraction based on charge
            const chargeValue1 = p1.charge === 'positive' ? 1 : p1.charge === 'negative' ? -1 : 0;
            const chargeValue2 = p2.charge === 'positive' ? 1 : p2.charge === 'negative' ? -1 : 0;
            const forceMagnitude = 0.2 * (chargeValue1 * chargeValue2) / Math.max(1, distance);
            
            const forceX = (dx / distance) * forceMagnitude;
            const forceY = (dy / distance) * forceMagnitude;
            const forceZ = (dz / distance) * forceMagnitude;
            
            // Apply forces to velocities
            newParticles[i].vx -= forceX;
            newParticles[i].vy -= forceY;
            newParticles[i].vz -= forceZ;
            
            newParticles[j].vx += forceX;
            newParticles[j].vy += forceY;
            newParticles[j].vz += forceZ;
          }
        }
      }
      
      return newParticles;
    });
  }, [running, incrementInteractionCount]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateParticles();
      handleInteractions();
    }, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [updateParticles, handleInteractions]);

  // Add a function to create new particles that can be exported
  const createNewParticles = useCallback(() => {
    if (particles.length >= maxParticles) return;
    createParticle();
  }, [particles.length, maxParticles, createParticle]);

  return { 
    particles, 
    setParticles,
    createNewParticles 
  };
};
