
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

export function useParticleSimulation(
  config: SimulationConfig,
  running: boolean,
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void
) {
  // State and refs for simulation
  const [isInitialized, setIsInitialized] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][][]>([]);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  // Initialize the simulation
  const initializeSimulation = useCallback((canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };

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
    
    return filteredParticles;
  }, [config, running, isInitialized]);

  // Create new particles
  const createNewParticles = useCallback(() => {
    if (!running || !isInitialized || particlesRef.current.length >= config.maxParticles) {
      return;
    }

    const { width, height } = dimensionsRef.current;
    
    // Maximum number of particles to add per call
    const maxNewParticles = Math.min(
      3, // Max 3 particles per call
      config.maxParticles - particlesRef.current.length
    );
    
    // Random number of new particles, at least 1
    const numNewParticles = Math.max(1, Math.floor(Math.random() * maxNewParticles));
    
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

      // Maybe make it adaptive
      if (config.useAdaptiveParticles && Math.random() < 0.1) {
        newParticle.type = 'adaptive';
        newParticle.color = 'rgba(236, 72, 153, 0.85)'; // Pink for adaptive particles
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

  // Detect simulation anomalies
  const detectSimulationAnomalies = useCallback(() => {
    if (!running || !isInitialized || frameCountRef.current % 30 !== 0) {
      return null;
    }
    
    const anomalies = detectAnomalies(
      particlesRef.current, 
      intentFieldRef.current, 
      frameCountRef.current
    );
    
    if (anomalies.length > 0 && onAnomalyDetected) {
      // Only report the most significant anomaly
      onAnomalyDetected(anomalies[0]);
      return anomalies[0];
    }
    
    return null;
  }, [running, isInitialized, onAnomalyDetected, frameCountRef]);

  return {
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isInitialized,
    isAnimatingRef,
    initializeSimulation,
    updateParticles,
    createNewParticles,
    detectSimulationAnomalies
  };
}
