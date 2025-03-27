
import { useState, useRef, useCallback, useEffect } from 'react';
import { Particle, createParticleFromField, detectAnomalies } from '@/utils/particleUtils';
import { updateIntentField } from '@/utils/fields';
import { AnomalyEvent } from '@/utils/particleUtils';

interface SimulationConfig {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  useAdaptiveParticles?: boolean;
  energyConservation?: boolean;
  probabilisticIntent?: boolean;
}

export interface InflationEvent {
  timestamp: number;
  intentInformation: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
}

export function useParticleSimulation(
  config: SimulationConfig,
  running: boolean,
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void,
  onInflationDetected?: (event: InflationEvent) => void
) {
  // State and refs for simulation
  const [isInitialized, setIsInitialized] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][][]>([]);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const originalDimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const isInflatedRef = useRef<boolean>(false);
  const inflationTimeRef = useRef<number | null>(null);
  const inflationThreshold = 1000000; // 10^6 threshold for inflation

  // Initialize the simulation
  const initializeSimulation = useCallback((canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };
    originalDimensionsRef.current = { width, height };

    // Set up intent field
    const fieldResolution = 10;
    const fieldWidth = Math.ceil(width / fieldResolution);
    const fieldHeight = Math.ceil(height / fieldResolution);
    const fieldDepth = 10; // For 3D simulations

    // Create intent field with random fluctuations
    const newField: number[][][] = [];
    for (let z = 0; z < fieldDepth; z++) {
      const plane: number[][] = [];
      for (let y = 0; y < fieldHeight; y++) {
        const row: number[] = [];
        for (let x = 0; x < fieldWidth; x++) {
          // Initial fluctuation between -1 and 1
          row.push(Math.random() * 2 - 1);
        }
        plane.push(row);
      }
      newField.push(plane);
    }
    
    intentFieldRef.current = newField;
    
    // Set as initialized
    setIsInitialized(true);
  }, []);

  // Update particles positions, interactions, etc.
  const updateParticles = useCallback(() => {
    if (!running || !isInitialized || particlesRef.current.length === 0) {
      return particlesRef.current;
    }

    // Update intent field with fluctuations
    intentFieldRef.current = updateIntentField(
      intentFieldRef.current, 
      config.intentFluctuationRate,
      config.probabilisticIntent
    );

    // Apply particle physics and interactions here
    // This is a placeholder for actual particle simulation logic
    const updatedParticles = particlesRef.current.map(particle => {
      // Basic particle movement and field interaction logic
      const newX = particle.x + particle.vx;
      const newY = particle.y + particle.vy;
      const newZ = particle.z + particle.vz;
      
      // Boundary checks
      const boundedX = Math.max(0, Math.min(dimensionsRef.current.width, newX));
      const boundedY = Math.max(0, Math.min(dimensionsRef.current.height, newY));
      const boundedZ = Math.max(0, Math.min(10, newZ));
      
      // Update velocity based on bounds
      const newVx = boundedX !== newX ? -particle.vx * 0.8 : particle.vx;
      const newVy = boundedY !== newY ? -particle.vy * 0.8 : particle.vy;
      const newVz = boundedZ !== newZ ? -particle.vz * 0.8 : particle.vz;
      
      return {
        ...particle,
        x: boundedX,
        y: boundedY,
        z: boundedZ,
        vx: newVx,
        vy: newVy,
        vz: newVz,
        // Apply intent decay if energy conservation is on
        intent: config.energyConservation 
          ? Math.max(0, particle.intent - particle.intentDecayRate)
          : particle.intent
      };
    });

    // Filter out particles with no energy if using energy conservation
    const filteredParticles = config.energyConservation
      ? updatedParticles.filter(p => p.energy > 0.1)
      : updatedParticles;
    
    particlesRef.current = filteredParticles;
    frameCountRef.current += 1;
    simulationTimeRef.current += 1;
    
    // Check for inflation conditions
    checkInflationConditions();

    // Gradually return to original dimensions if inflated (after 5 seconds)
    if (isInflatedRef.current && inflationTimeRef.current && 
        (Date.now() - inflationTimeRef.current > 5000)) {
      resetInflation();
    }

    return filteredParticles;
  }, [config, running, isInitialized]);

  // Create new particles
  const createNewParticles = useCallback((count = 3, postInflation = false) => {
    if (!running || !isInitialized || 
       (!postInflation && particlesRef.current.length >= config.maxParticles)) {
      return;
    }

    const { width, height } = dimensionsRef.current;
    
    // Maximum number of particles to add per call
    const maxNewParticles = postInflation 
      ? count 
      : Math.min(count, config.maxParticles - particlesRef.current.length);
    
    // Random number of new particles, at least 1
    const numNewParticles = postInflation 
      ? maxNewParticles 
      : Math.max(1, Math.floor(Math.random() * maxNewParticles));
    
    for (let i = 0; i < numNewParticles; i++) {
      // Random position
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * 10; // For 3D simulations
      
      // Get field value at position
      const fieldX = Math.floor(x / (width / intentFieldRef.current[0][0].length));
      const fieldY = Math.floor(y / (height / intentFieldRef.current[0].length));
      const fieldZ = Math.floor(z / (10 / intentFieldRef.current.length));
      
      // Get the intent field value at this location (with boundary checks)
      const fieldValue = intentFieldRef.current[
        Math.min(fieldZ, intentFieldRef.current.length - 1)
      ][
        Math.min(fieldY, intentFieldRef.current[0].length - 1)
      ][
        Math.min(fieldX, intentFieldRef.current[0][0].length - 1)
      ];
      
      // Create particle based on field value
      const newParticle = createParticleFromField(fieldValue, x, y, z, Date.now() + i);

      // Mark as post-inflation particle
      if (postInflation) {
        newParticle.isPostInflation = true;
        newParticle.color = getPostInflationColor(newParticle.charge);
        newParticle.scale = 1.2; // Slightly larger
      }

      // Maybe make it adaptive
      if (config.useAdaptiveParticles && Math.random() < 0.1) {
        newParticle.type = 'adaptive';
        newParticle.color = postInflation 
          ? 'rgba(236, 72, 253, 0.9)' // Brighter pink for post-inflation adaptive particles
          : 'rgba(236, 72, 153, 0.85)'; // Regular pink for adaptive particles
        newParticle.adaptiveScore = 1;
      }
      
      // Configure energy properties
      if (config.energyConservation) {
        newParticle.energyCapacity = 1 + Math.random() * 0.5;
        newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
      } else {
        newParticle.energyCapacity = 100;
        newParticle.intentDecayRate = 0.00001;
      }
      
      particlesRef.current.push(newParticle);
    }
  }, [config, running, isInitialized]);

  // Helper function to get post-inflation particle color
  const getPostInflationColor = (charge: 'positive' | 'negative' | 'neutral'): string => {
    switch (charge) {
      case 'positive':
        return 'rgba(209, 70, 239, 0.95)'; // Bright magenta
      case 'negative':
        return 'rgba(139, 92, 246, 0.95)'; // Bright purple
      case 'neutral':
        return 'rgba(14, 165, 233, 0.95)'; // Bright blue
      default:
        return 'rgba(209, 70, 239, 0.95)';
    }
  };

  // Detect simulation anomalies
  const detectSimulationAnomalies = useCallback(() => {
    if (!running || !isInitialized || frameCountRef.current % 30 !== 0) {
      return null;
    }
    
    // Create placeholder objects for anomaly detection
    const previousState = {
      entropy: Math.random(),  // Placeholder values
      clusterCount: particlesRef.current.length > 0 ? Math.floor(particlesRef.current.length / 10) : 0,
      adaptiveCount: particlesRef.current.filter(p => p.type === 'adaptive').length,
      compositeCount: particlesRef.current.filter(p => p.type === 'composite').length,
      orderParameter: 0.5,
      informationDensity: 1.0,
      kolmogorovComplexity: 0.3
    };
    
    const currentState = {
      entropy: Math.random(),  // Update with actual entropy calculation
      clusterCount: particlesRef.current.length > 0 ? Math.floor(particlesRef.current.length / 8) : 0,
      adaptiveCount: particlesRef.current.filter(p => p.type === 'adaptive').length,
      compositeCount: particlesRef.current.filter(p => p.type === 'composite').length,
      orderParameter: 0.6,
      informationDensity: 1.2,
      kolmogorovComplexity: 0.4
    };
    
    const anomalies = detectAnomalies(
      particlesRef.current, 
      previousState,
      currentState,
      frameCountRef.current
    );
    
    if (anomalies.length > 0 && onAnomalyDetected) {
      // Only report the most significant anomaly
      onAnomalyDetected(anomalies[0]);
      return anomalies[0];
    }
    
    return null;
  }, [running, isInitialized, onAnomalyDetected, frameCountRef]);

  // New function to check and trigger inflation if needed
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
  }, [running, isInitialized]);

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
  }, [config.maxParticles, createNewParticles, onInflationDetected]);

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
  }, []);

  return {
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isInitialized,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef,
    initializeSimulation,
    updateParticles,
    createNewParticles,
    detectSimulationAnomalies
  };
}
