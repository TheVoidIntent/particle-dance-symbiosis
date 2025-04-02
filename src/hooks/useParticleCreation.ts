import { useState, useCallback } from 'react';
import { Particle } from '@/types/simulation';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

interface UseParticleCreationOptions {
  maxParticles?: number;
  playAudio?: boolean;
  intentFieldStrength?: number;
}

export function useParticleCreation(options: UseParticleCreationOptions = {}) {
  const { maxParticles = 100, playAudio = true, intentFieldStrength = 0.5 } = options;
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticle = useCallback((type: 'positive' | 'negative' | 'neutral', position?: { x: number, y: number }) => {
    if (particles.length >= maxParticles) {
      // Optional: remove oldest particle
      setParticles(prev => prev.slice(1));
    }

    const newParticle: Particle = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      position: position || { x: Math.random() * 100, y: Math.random() * 100 },
      velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
      charge: type,
      mass: type === 'positive' ? 1.2 : type === 'negative' ? 0.8 : 1.0,
      energy: 1.0,
      age: 0,
      lifespan: 100 + Math.random() * 900,
      creationTime: Date.now(),
      clusterAffinity: Math.random(),
      knowledgeBase: {},
      learningRate: 0.05 + Math.random() * 0.1,
      adaptiveIndex: 0,
      isInCluster: false,
      clusterId: null,
      insightScore: 0
    };
    
    setParticles(prev => [...prev, newParticle]);
    
    if (playAudio) {
      playSimulationEvent('particle_creation', { eventType: type });
    }
    
    return newParticle;
  }, [particles.length, maxParticles, playAudio]);

  // Other functions for particle management...

  return {
    particles,
    setParticles,
    createParticle,
    // Add other functions as needed
  };
}
