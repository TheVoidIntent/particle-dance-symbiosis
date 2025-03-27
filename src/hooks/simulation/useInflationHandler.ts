
import { useCallback } from 'react';
import { InflationEvent, SimulationConfig } from './types';

export function useInflationHandler(
  config: SimulationConfig,
  running: boolean,
  isInitialized: boolean,
  isInflatedRef: React.MutableRefObject<boolean>,
  inflationTimeRef: React.MutableRefObject<number | null>,
  particlesRef: React.MutableRefObject<any[]>,
  interactionsRef: React.MutableRefObject<number>,
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>,
  originalDimensionsRef: React.MutableRefObject<{ width: number; height: number }>,
  createNewParticles: (count: number, postInflation: boolean) => void,
  onInflationDetected?: (event: InflationEvent) => void
) {
  // Define inflation threshold
  const inflationThreshold = 1000000; // 10^6 threshold for inflation
  
  // Check for inflation conditions
  const checkInflationConditions = useCallback(() => {
    if (!running || !isInitialized || isInflatedRef.current) {
      return;
    }

    // Calculate the intentInformation value
    const avgKnowledge = particlesRef.current.length > 0 
      ? particlesRef.current.reduce((sum, p) => sum + p.knowledge, 0) / particlesRef.current.length 
      : 0;
    
    const intentLevels = particlesRef.current.reduce((sum, p) => sum + Math.abs(p.intent), 0);
    const avgIntentLevel = particlesRef.current.length > 0 ? intentLevels / particlesRef.current.length : 0;
    
    // Calculate complexity index (similar to SimulationData.tsx)
    const positiveParticles = particlesRef.current.filter(p => p.charge === 'positive').length;
    const negativeParticles = particlesRef.current.filter(p => p.charge === 'negative').length;
    const neutralParticles = particlesRef.current.filter(p => p.charge === 'neutral').length;
    const highEnergyParticles = particlesRef.current.filter(p => p.type === 'high-energy').length;
    const quantumParticles = particlesRef.current.filter(p => p.type === 'quantum').length;
    const compositeParticles = particlesRef.current.filter(p => p.type === 'composite').length;
    const adaptiveParticles = particlesRef.current.filter(p => p.type === 'adaptive').length;
    
    const maxComplexity = particlesRef.current.length > 0 
      ? particlesRef.current.reduce((max, p) => Math.max(max, p.complexity), 1) 
      : 1;
    
    const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                         (highEnergyParticles + 1) * (quantumParticles + 1) *
                         (compositeParticles + 1) * (adaptiveParticles + 1)) / 
                         Math.max(1, particlesRef.current.length ** 2);
    
    const complexityIndex = (avgKnowledge * varietyFactor) + 
                           (interactionsRef.current / 1000) + 
                           (compositeParticles * maxComplexity) +
                           (adaptiveParticles * 2);
    
    // Calculate the intentInformation
    const intentInformation = avgIntentLevel * avgKnowledge * complexityIndex;
    
    // Check if we reached the inflation threshold
    if (intentInformation > inflationThreshold || 
        (particlesRef.current.length > 50 && Math.random() < 0.0005)) { // Small random chance for demo purposes
      inflateSimulation(intentInformation);
    }
  }, [running, isInitialized, inflationThreshold, particlesRef, interactionsRef, isInflatedRef]);

  // Function to trigger inflation
  const inflateSimulation = useCallback((intentInformation: number) => {
    console.log(`🌌 UNIVERSE INFLATION EVENT! intentInformation: ${intentInformation}`);
    
    // Mark as inflated
    isInflatedRef.current = true;
    inflationTimeRef.current = Date.now();
    
    // Double dimensions temporarily
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Store particles count before inflation
      const particlesBeforeInflation = particlesRef.current.length;
      
      // Double the canvas size
      dimensionsRef.current = {
        width: originalDimensionsRef.current.width * 2,
        height: originalDimensionsRef.current.height * 2
      };
      
      canvas.style.width = `${dimensionsRef.current.width}px`;
      canvas.style.height = `${dimensionsRef.current.height}px`;
      canvas.width = dimensionsRef.current.width;
      canvas.height = dimensionsRef.current.height;
      
      // Create a burst of new particles
      const newParticleCount = Math.min(100, config.maxParticles * 2); 
      createNewParticles(newParticleCount, true);
      
      // Create inflation event
      const inflationEvent: InflationEvent = {
        timestamp: Date.now(),
        intentInformation,
        particlesBeforeInflation,
        particlesAfterInflation: particlesRef.current.length
      };
      
      // Notify about inflation
      if (onInflationDetected) {
        onInflationDetected(inflationEvent);
      }
      
      // Log the event
      console.log(`📊 Inflation details:`, {
        timestamp: new Date(inflationEvent.timestamp).toISOString(),
        intentInformation: inflationEvent.intentInformation,
        particlesBeforeInflation: inflationEvent.particlesBeforeInflation,
        particlesAfterInflation: inflationEvent.particlesAfterInflation,
        newParticlesAdded: inflationEvent.particlesAfterInflation - inflationEvent.particlesBeforeInflation
      });
      
      // Store inflation event in localStorage for later analysis
      try {
        const existingEvents = JSON.parse(localStorage.getItem('inflationEvents') || '[]');
        existingEvents.push(inflationEvent);
        localStorage.setItem('inflationEvents', JSON.stringify(existingEvents));
      } catch (e) {
        console.error('Error storing inflation event:', e);
      }
    }
  }, [config.maxParticles, createNewParticles, onInflationDetected, isInflatedRef, inflationTimeRef, particlesRef, dimensionsRef, originalDimensionsRef]);

  // Reset after inflation
  const resetInflation = useCallback(() => {
    if (!isInflatedRef.current) return;
    
    console.log('🔄 Resetting from inflation state');
    
    // Reset to original dimensions
    const canvas = document.querySelector('canvas');
    if (canvas) {
      dimensionsRef.current = { ...originalDimensionsRef.current };
      
      canvas.style.width = `${dimensionsRef.current.width}px`;
      canvas.style.height = `${dimensionsRef.current.height}px`;
      canvas.width = dimensionsRef.current.width;
      canvas.height = dimensionsRef.current.height;
    }
    
    // Reset inflation flag
    isInflatedRef.current = false;
    inflationTimeRef.current = null;
  }, [isInflatedRef, inflationTimeRef, dimensionsRef, originalDimensionsRef]);

  return { 
    checkInflationConditions,
    inflateSimulation,
    resetInflation
  };
}
