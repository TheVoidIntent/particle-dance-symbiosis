
import { useState, useRef, useCallback } from 'react';
import { Particle } from '@/utils/particleUtils';

export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  isRunning: boolean;
  simulationTime: number;
  interactionsCount: number;
  frameCount: number;
  isInflated: boolean;
  inflationTime: number | null;
  dimensions: { width: number; height: number };
}

interface UseSimulationStateProps {
  initialParticles?: Particle[];
  initialIntentField?: number[][][];
  dimensions?: { width: number; height: number };
}

export function useSimulationState({
  initialParticles = [],
  initialIntentField = [],
  dimensions = { width: 800, height: 600 }
}: UseSimulationStateProps) {
  // Main state
  const [particles, setParticles] = useState<Particle[]>(initialParticles);
  const [intentField, setIntentField] = useState<number[][][]>(initialIntentField);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationTime, setSimulationTime] = useState<number>(0);
  const [interactionsCount, setInteractionsCount] = useState<number>(0);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [isInflated, setIsInflated] = useState<boolean>(false);
  const [inflationTime, setInflationTime] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // State for full simulation state
  const [state, setState] = useState<SimulationState>({
    particles: initialParticles,
    intentField: initialIntentField,
    isRunning: false,
    simulationTime: 0,
    interactionsCount: 0,
    frameCount: 0,
    isInflated: false,
    inflationTime: null,
    dimensions
  });
  
  // Refs for fast access without re-renders
  const particlesRef = useRef<Particle[]>(initialParticles);
  const intentFieldRef = useRef<number[][][]>(initialIntentField);
  const dimensionsRef = useRef<{ width: number; height: number }>(dimensions);
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const isInflatedRef = useRef<boolean>(false);
  const inflationTimeRef = useRef<number | null>(null);
  
  // Update refs when state changes
  useCallback(() => {
    particlesRef.current = particles;
  }, [particles]);
  
  useCallback(() => {
    intentFieldRef.current = intentField;
  }, [intentField]);
  
  useCallback(() => {
    interactionsRef.current = interactionsCount;
  }, [interactionsCount]);
  
  useCallback(() => {
    frameCountRef.current = frameCount;
  }, [frameCount]);
  
  useCallback(() => {
    simulationTimeRef.current = simulationTime;
  }, [simulationTime]);
  
  useCallback(() => {
    isAnimatingRef.current = isRunning;
  }, [isRunning]);
  
  return {
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
  };
}
