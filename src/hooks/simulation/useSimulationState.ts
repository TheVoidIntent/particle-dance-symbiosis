
import { useRef, useState } from 'react';
import { Particle } from '@/types/simulation';
import { SimulationState } from './types';

interface UseSimulationStateProps {
  initialParticles?: Particle[];
  initialIntentField?: number[][][];
  dimensions?: { width: number; height: number };
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function useSimulationState({
  initialParticles = [],
  initialIntentField = [],
  dimensions = { width: 800, height: 600 },
  canvasRef
} = {} as UseSimulationStateProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [particles, setParticles] = useState<Particle[]>(initialParticles);
  const [intentField, setIntentField] = useState<number[][][]>(initialIntentField);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [interactionsCount, setInteractionsCount] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  
  const particlesRef = useRef<Particle[]>(initialParticles);
  const intentFieldRef = useRef<number[][][]>(initialIntentField);
  const dimensionsRef = useRef<SimulationState['dimensions']>(dimensions);
  const originalDimensionsRef = useRef<SimulationState['originalDimensions']>(dimensions);
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const isInflatedRef = useRef<boolean>(false);
  const inflationTimeRef = useRef<number | null>(null);

  // Add state and setState for compatibility
  const state = {
    particles,
    intentField,
    isRunning,
    simulationTime,
    interactionsCount,
    frameCount,
    dimensions: dimensionsRef.current,
    originalDimensions: originalDimensionsRef.current,
  };
  
  const setState = (newState: Partial<typeof state>) => {
    if ('particles' in newState) setParticles(newState.particles || []);
    if ('intentField' in newState) setIntentField(newState.intentField || []);
    if ('isRunning' in newState && typeof newState.isRunning === 'boolean') setIsRunning(newState.isRunning);
    if ('simulationTime' in newState && typeof newState.simulationTime === 'number') setSimulationTime(newState.simulationTime);
    if ('interactionsCount' in newState && typeof newState.interactionsCount === 'number') setInteractionsCount(newState.interactionsCount);
    if ('frameCount' in newState && typeof newState.frameCount === 'number') setFrameCount(newState.frameCount);
  };

  return {
    isInitialized,
    setIsInitialized,
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
    originalDimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef,
    state,
    setState
  };
}
