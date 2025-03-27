
import { useRef, useState } from 'react';
import { SimulationState } from './types';

export function useSimulationState() {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const particlesRef = useRef<SimulationState['particles']>([]);
  const intentFieldRef = useRef<SimulationState['intentField']>([]);
  const dimensionsRef = useRef<SimulationState['dimensions']>({ width: 0, height: 0 });
  const originalDimensionsRef = useRef<SimulationState['originalDimensions']>({ width: 0, height: 0 });
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const isInflatedRef = useRef<boolean>(false);
  const inflationTimeRef = useRef<number | null>(null);

  return {
    isInitialized,
    setIsInitialized,
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    originalDimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef
  };
}
