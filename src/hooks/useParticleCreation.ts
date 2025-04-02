
import { useState, useCallback } from 'react';
import { Particle } from '@/types/simulation';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

interface UseParticleCreationOptions {
  maxParticles?: number;
  playAudio?: boolean;
  intentFieldStrength?: number;
  positiveChargeWeight?: number;
  negativeChargeWeight?: number;
  neutralChargeWeight?: number;
}

export function useParticleCreation(options: UseParticleCreationOptions = {}) {
  const { 
    maxParticles = 100, 
    playAudio = true, 
    intentFieldStrength = 0.5,
    positiveChargeWeight = 0.33,
    negativeChargeWeight = 0.33,
    neutralChargeWeight = 0.34
  } = options;
  
  const [particles, setParticles] = useState<Particle[]>([]);

  /**
   * Create a particle with the specified charge type and optional position
   */
  const createParticle = useCallback((
    type?: 'positive' | 'negative' | 'neutral', 
    position?: { x: number, y: number }
  ) => {
    if (particles.length >= maxParticles) {
      // Optional: remove oldest particle
      setParticles(prev => prev.slice(1));
    }

    // If no type is specified, determine based on intent field fluctuations
    // and the charge weights
    const particleType = type || determineParticleType(
      intentFieldStrength, 
      positiveChargeWeight, 
      negativeChargeWeight, 
      neutralChargeWeight
    );

    // Create a new particle with properties based on its charge type
    const newParticle: Particle = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      position: position || { x: Math.random() * 100, y: Math.random() * 100 },
      velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
      charge: particleType,
      
      // Properties influenced by charge type
      mass: particleType === 'positive' ? 1.2 : particleType === 'negative' ? 0.8 : 1.0,
      energy: particleType === 'positive' ? 1.2 : particleType === 'negative' ? 0.8 : 1.0,
      
      // Intent-based properties
      interactionTendency: particleType === 'positive' ? 0.8 : 
                          particleType === 'negative' ? 0.3 : 0.5,
      intentDecayRate: particleType === 'positive' ? 0.01 : 
                       particleType === 'negative' ? 0.05 : 0.03,
      
      // Common properties
      age: 0,
      lifespan: 100 + Math.random() * 900,
      creationTime: Date.now(),
      clusterAffinity: particleType === 'positive' ? 0.7 : 
                      particleType === 'negative' ? 0.2 : 0.4,
      knowledgeBase: {},
      learningRate: particleType === 'positive' ? 0.1 : 
                    particleType === 'negative' ? 0.03 : 0.06,
      adaptiveIndex: 0,
      isInCluster: false,
      clusterId: null,
      insightScore: 0
    };
    
    setParticles(prev => [...prev, newParticle]);
    
    // Play audio feedback based on particle type
    if (playAudio) {
      playSimulationEvent('particle_creation', { eventType: particleType });
    }
    
    return newParticle;
  }, [particles.length, maxParticles, playAudio, intentFieldStrength, positiveChargeWeight, negativeChargeWeight, neutralChargeWeight]);

  /**
   * Create multiple particles at once
   */
  const createParticles = useCallback((count: number) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      // Avoid hitting maxParticles limit
      if (particles.length + newParticles.length >= maxParticles) break;
      
      const newParticle = createParticle();
      newParticles.push(newParticle);
    }
    
    return newParticles;
  }, [createParticle, particles.length, maxParticles]);

  /**
   * Determine particle type based on intent field fluctuations
   */
  const determineParticleType = (
    fieldStrength: number, 
    posWeight: number, 
    negWeight: number, 
    neuWeight: number
  ): 'positive' | 'negative' | 'neutral' => {
    // Base decision on field strength and randomness
    const fluctuation = (Math.random() * 2 - 1) * fieldStrength;
    
    if (fluctuation > 0.2) {
      // Positive fluctuation - more likely to be positive
      const r = Math.random();
      if (r < posWeight * 1.5) return 'positive';
      if (r < posWeight * 1.5 + negWeight * 0.5) return 'negative';
      return 'neutral';
    } else if (fluctuation < -0.2) {
      // Negative fluctuation - more likely to be negative
      const r = Math.random();
      if (r < negWeight * 1.5) return 'negative';
      if (r < negWeight * 1.5 + posWeight * 0.5) return 'positive';
      return 'neutral';
    } else {
      // Neutral fluctuation - more likely to be neutral
      const r = Math.random();
      if (r < neuWeight * 1.5) return 'neutral';
      if (r < neuWeight * 1.5 + posWeight * 0.75) return 'positive';
      return 'negative';
    }
  };

  /**
   * Remove particles from the simulation
   */
  const removeParticles = useCallback((count: number) => {
    setParticles(prev => prev.slice(0, Math.max(0, prev.length - count)));
  }, []);

  /**
   * Clear all particles
   */
  const clearParticles = useCallback(() => {
    setParticles([]);
  }, []);

  return {
    particles,
    setParticles,
    createParticle,
    createParticles,
    removeParticles,
    clearParticles
  };
}
