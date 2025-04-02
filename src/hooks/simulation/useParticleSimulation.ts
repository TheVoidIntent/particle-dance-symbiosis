
import { useState, useEffect, useRef, useCallback } from 'react';
import { Particle } from '@/utils/particleUtils';
import { useParticleCreation } from './useParticleCreation';
import { useParticleUpdater } from './useParticleUpdater';
import { useInflationHandler } from './useInflationHandler';
import { useSimulationState } from './useSimulationState';
import { SimulationConfig, InflationEvent, ParticleCreationOptions } from './types';
import { initializeIntentField } from '@/utils/intentFieldUtils';

interface UseParticleSimulationProps {
  initialParticleCount?: number;
  config?: Partial<SimulationConfig>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onInflationEvent?: (event: InflationEvent) => void;
}

export function useParticleSimulation({
  initialParticleCount = 50,
  config = {},
  canvasRef,
  onInflationEvent
}: UseParticleSimulationProps) {
  // Default configuration merged with passed config
  const fullConfig: SimulationConfig = {
    initialParticleCount,
    maxParticles: 500,
    fieldResolution: 20,
    intentFluctuationRate: 0.05,
    interactionRadius: 50,
    boundaryCondition: 'wrap',
    particleLifetime: null,
    inflationEnabled: true,
    inflationThreshold: 200,
    inflationMultiplier: 1.5,
    ...config
  };

  // Get canvas dimensions for simulation boundaries
  const [dimensions, setDimensions] = useState({ 
    width: canvasRef?.current?.width || window.innerWidth, 
    height: canvasRef?.current?.height || window.innerHeight 
  });

  // Initialize state management
  const { 
    state, 
    setState,
    particles,
    setParticles,
    intentField,
    setIntentField,
    isRunning,
    setIsRunning,
    simulationTime,
    setSimulationTime,
    interactionsCount,
    setInteractionsCount,
    frameCount,
    setFrameCount
  } = useSimulationState({
    initialParticles: [],
    initialIntentField: initializeIntentField(dimensions.width, dimensions.height, 10, fullConfig.fieldResolution),
    dimensions
  });

  // Set up refs for animation frame
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  
  // Update particles ref when particles change
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  // Set up particle creation utilities
  const particleCreation = useParticleCreation({ 
    dimensions, 
    maxParticles: fullConfig.maxParticles
  });

  // Set up particle updater utilities
  const particleUpdater = useParticleUpdater({
    dimensions,
    intentField,
    boundaryCondition: fullConfig.boundaryCondition,
    interactionRadius: fullConfig.interactionRadius,
    particleLifetime: fullConfig.particleLifetime
  });

  // Set up inflation handler
  const inflationHandler = useInflationHandler({
    config: fullConfig,
    onInflationEvent
  });

  // Update canvas dimensions when canvas ref changes
  useEffect(() => {
    if (canvasRef?.current) {
      const updateDimensions = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          // Get actual displayed dimensions
          const displayWidth = canvas.clientWidth;
          const displayHeight = canvas.clientHeight;
          
          // Update canvas internal size to match display size
          if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            
            setDimensions({ width: displayWidth, height: displayHeight });
          }
        }
      };
      
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [canvasRef]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!isRunning) return;
    
    // Calculate delta time in seconds
    const deltaTime = lastTimestampRef.current ? (timestamp - lastTimestampRef.current) / 1000 : 0.016;
    lastTimestampRef.current = timestamp;
    
    // Update simulation time
    setSimulationTime(prev => prev + deltaTime);
    setFrameCount(prev => prev + 1);
    
    // Get particles from ref to avoid stale closures
    let currentParticles = [...particlesRef.current];
    
    // Check for inflation event
    if (inflationHandler.checkForInflation(currentParticles)) {
      currentParticles = inflationHandler.handleInflation(currentParticles);
    }
    
    // Update all particles
    const { updatedParticles, interactionCount } = particleUpdater.updateAllParticles(currentParticles);
    
    // Update interaction count
    setInteractionsCount(prev => prev + interactionCount);
    
    // Update particles state
    setParticles(updatedParticles);
    
    // Request next frame
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [isRunning, particleUpdater, inflationHandler, setParticles, setSimulationTime, setFrameCount, setInteractionsCount]);

  // Start and stop simulation
  useEffect(() => {
    if (isRunning) {
      lastTimestampRef.current = 0;
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRunning, animate]);

  // Initialize particles on first render
  useEffect(() => {
    const initialParticles = [];
    for (let i = 0; i < fullConfig.initialParticleCount; i++) {
      initialParticles.push(
        particleCreation.createParticle()
      );
    }
    setParticles(initialParticles);
  }, [fullConfig.initialParticleCount, particleCreation, setParticles]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, [setIsRunning]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setIsRunning(false);
  }, [setIsRunning]);

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, [setIsRunning]);

  // Reset simulation
  const resetSimulation = useCallback((): Particle[] => {
    // Cancel animation frame
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    
    // Reset state
    setIsRunning(false);
    setSimulationTime(0);
    setInteractionsCount(0);
    setFrameCount(0);
    
    // Create new particles
    const newParticles = [];
    for (let i = 0; i < fullConfig.initialParticleCount; i++) {
      newParticles.push(
        particleCreation.createParticle()
      );
    }
    
    // Reset intent field
    const newIntentField = initializeIntentField(
      dimensions.width, 
      dimensions.height, 
      10, 
      fullConfig.fieldResolution
    );
    setIntentField(newIntentField);
    
    // Set new particles
    setParticles(newParticles);
    
    return newParticles;
  }, [
    setIsRunning, 
    setSimulationTime, 
    setInteractionsCount, 
    setFrameCount, 
    particleCreation, 
    fullConfig.initialParticleCount, 
    dimensions, 
    fullConfig.fieldResolution,
    setIntentField,
    setParticles
  ]);

  // Add a specific number of new particles
  const addParticles = useCallback((count: number, options?: ParticleCreationOptions): void => {
    setParticles(prev => {
      if (prev.length >= fullConfig.maxParticles) {
        return prev;
      }
      
      const newCount = Math.min(count, fullConfig.maxParticles - prev.length);
      const newParticles = [];
      
      for (let i = 0; i < newCount; i++) {
        newParticles.push(particleCreation.createParticle(options));
      }
      
      return [...prev, ...newParticles];
    });
  }, [setParticles, particleCreation, fullConfig.maxParticles]);

  // Create a single particle at a specific location
  const createParticle = useCallback((x?: number, y?: number): Particle => {
    const newParticle = particleCreation.createParticle({ 
      x, 
      y 
    } as ParticleCreationOptions);
    
    setParticles(prev => {
      if (prev.length >= fullConfig.maxParticles) {
        return prev;
      }
      return [...prev, newParticle];
    });
    
    return newParticle;
  }, [setParticles, particleCreation, fullConfig.maxParticles]);

  // Calculate emergence index based on particle interactions and distribution
  const calculateEmergenceIndex = useCallback(() => {
    // A simple metric for emergence based on interaction count and simulation time
    // In a real implementation, this would be more sophisticated
    if (simulationTime === 0) return 0;
    
    const baseIndex = Math.log(interactionsCount + 1) / Math.log(simulationTime + 1);
    const normalizedIndex = Math.min(Math.max(baseIndex / 10, 0), 1);
    
    return normalizedIndex;
  }, [interactionsCount, simulationTime]);

  // Calculate intent field complexity
  const calculateIntentFieldComplexity = useCallback(() => {
    // A simple metric for intent field complexity
    // In a real implementation, this would analyze the field patterns
    if (!intentField || intentField.length === 0) return 0;
    
    let complexity = 0;
    const fieldLayer = intentField[0]; // Just analyze the first layer for simplicity
    
    for (let y = 1; y < fieldLayer.length - 1; y++) {
      for (let x = 1; x < fieldLayer[y].length - 1; x++) {
        // Calculate local gradient as a measure of complexity
        const center = fieldLayer[y][x];
        const neighbors = [
          fieldLayer[y-1][x],
          fieldLayer[y+1][x],
          fieldLayer[y][x-1],
          fieldLayer[y][x+1]
        ];
        
        const gradient = neighbors.reduce((sum, val) => sum + Math.abs(center - val), 0) / 4;
        complexity += gradient;
      }
    }
    
    // Normalize complexity
    const cellCount = (fieldLayer.length - 2) * (fieldLayer[0].length - 2);
    return complexity / cellCount;
  }, [intentField]);

  return {
    particles,
    intentField,
    isRunning,
    simulationTime,
    interactionsCount,
    frameCount,
    startSimulation,
    stopSimulation,
    toggleSimulation,
    resetSimulation,
    addParticles,
    createParticle,
    emergenceIndex: calculateEmergenceIndex(),
    intentFieldComplexity: calculateIntentFieldComplexity(),
  };
}

export default useParticleSimulation;
