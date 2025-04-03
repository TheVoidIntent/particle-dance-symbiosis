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

  const [dimensions, setDimensions] = useState({ 
    width: canvasRef?.current?.width || window.innerWidth, 
    height: canvasRef?.current?.height || window.innerHeight 
  });

  const simulationState = useSimulationState({
    initialParticles: [],
    initialIntentField: initializeIntentField(
      dimensions.width, 
      dimensions.height, 
      10, 
      fullConfig.fieldResolution
    ),
    dimensions
  });

  const { 
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
    setFrameCount,
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef,
    isInitialized,
    setIsInitialized,
    state,
    setState
  } = simulationState;

  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  useEffect(() => {
    if (canvasRef?.current) {
      const updateDimensions = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const displayWidth = canvas.clientWidth;
          const displayHeight = canvas.clientHeight;
          
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

  const particleCreation = useParticleCreation(
    particlesRef,
    dimensions.width,
    dimensions.height
  );

  const particleUpdater = useParticleUpdater(
    particlesRef,
    intentFieldRef,
    interactionsRef,
    dimensions.width,
    dimensions.height
  );

  const inflationHandler = useInflationHandler({
    config: fullConfig,
    onInflationEvent
  });

  const animate = useCallback((timestamp: number) => {
    if (!isRunning) return;
    
    const deltaTime = lastTimestampRef.current ? (timestamp - lastTimestampRef.current) / 1000 : 0.016;
    lastTimestampRef.current = timestamp;
    
    setSimulationTime(prev => prev + deltaTime);
    setFrameCount(prev => prev + 1);
    
    let currentParticles = [...particlesRef.current] as Particle[];
    
    if (inflationHandler.checkForInflation(currentParticles)) {
      currentParticles = inflationHandler.handleInflation([...currentParticles]) as Particle[];
    }
    
    const result = particleUpdater.updateAllParticles();
    
    setInteractionsCount(prev => prev + result.interactionCount);
    setParticles(result.updatedParticles);
    
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [isRunning, particleUpdater, inflationHandler, setParticles, setSimulationTime, setFrameCount, setInteractionsCount]);

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

  useEffect(() => {
    const initialParticles = [];
    for (let i = 0; i < fullConfig.initialParticleCount; i++) {
      initialParticles.push(
        particleCreation.createParticle()
      );
    }
    setParticles(initialParticles);
  }, [fullConfig.initialParticleCount, particleCreation, setParticles]);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, [setIsRunning]);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
  }, [setIsRunning]);

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, [setIsRunning]);

  const resetSimulation = useCallback((): Particle[] => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    
    setIsRunning(false);
    setSimulationTime(0);
    setInteractionsCount(0);
    setFrameCount(0);
    
    const newParticles = [];
    for (let i = 0; i < fullConfig.initialParticleCount; i++) {
      newParticles.push(
        particleCreation.createParticle()
      );
    }
    
    const newIntentField = initializeIntentField(
      dimensions.width, 
      dimensions.height, 
      10, 
      fullConfig.fieldResolution
    );
    setIntentField(newIntentField);
    
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
    
    return newParticle as Particle;
  }, [setParticles, particleCreation, fullConfig.maxParticles]);

  const calculateEmergenceIndex = useCallback(() => {
    if (simulationTime === 0) return 0;
    
    const baseIndex = Math.log(interactionsCount + 1) / Math.log(simulationTime + 1);
    const normalizedIndex = Math.min(Math.max(baseIndex / 10, 0), 1);
    
    return normalizedIndex;
  }, [interactionsCount, simulationTime]);

  const calculateIntentFieldComplexity = useCallback(() => {
    if (!intentField || intentField.length === 0) return 0;
    
    let complexity = 0;
    const fieldLayer = intentField[0];
    
    for (let y = 1; y < fieldLayer.length - 1; y++) {
      for (let x = 1; x < fieldLayer[y].length - 1; x++) {
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
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef,
    isInitialized,
    initializeSimulation: (canvas: HTMLCanvasElement) => {
      if (canvas) {
        dimensionsRef.current = {
          width: canvas.width, 
          height: canvas.height
        };
        setIsInitialized(true);
      }
    },
    updateParticles: () => {
      // This would be called during the animation loop
    },
    createNewParticles: () => {
      const newParticle = particleCreation.createParticle();
      setParticles(prev => [...prev, newParticle]);
    },
    detectSimulationAnomalies: () => {
      return [];
    }
  };
}

export default useParticleSimulation;
