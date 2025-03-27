
import { useCallback } from 'react';

export function useSimulationInitialization(
  setIsInitialized: (initialized: boolean) => void,
  intentFieldRef: React.MutableRefObject<number[][][]>,
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>,
  originalDimensionsRef: React.MutableRefObject<{ width: number; height: number }>
) {
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
  }, [setIsInitialized, intentFieldRef, dimensionsRef, originalDimensionsRef]);

  return { initializeSimulation };
}
