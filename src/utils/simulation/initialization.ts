// Import loadState from state.ts
import { simulationState } from './state';
import { loadState } from './state'; // Ensure state.ts exports loadState
import { fieldConfig } from './config';

// Initialize the intent field
export function initializeIntentField(width: number, height: number, depth: number = 1, resolution: number = 20): number[][][] {
  const fieldWidth = Math.ceil(width / resolution);
  const fieldHeight = Math.ceil(height / resolution);
  
  const field: number[][][] = [];
  for (let z = 0; z < depth; z++) {
    const layer: number[][] = [];
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < fieldWidth; x++) {
        row.push(Math.random() * 2 - 1); // Random values between -1 and 1
      }
      layer.push(row);
    }
    field.push(layer);
  }
  
  return field;
}

// Initialize the mother simulation
export function initializeMotherSimulation(): void {
  // Load saved state if available
  const savedState = loadState();
  
  if (savedState) {
    simulationState.particles = savedState.particles;
    simulationState.intentField = savedState.intentField;
    simulationState.interactionsCount = savedState.interactionsCount;
    simulationState.frameCount = savedState.frameCount;
    simulationState.simulationTime = savedState.simulationTime;
    
    console.log(`✨ Mother simulation state loaded: ${simulationState.particles.length} particles, frame ${simulationState.frameCount}`);
  } else {
    // Initialize with a basic intent field
    simulationState.intentField = initializeIntentField(
      fieldConfig.width,
      fieldConfig.height,
      fieldConfig.depth,
      fieldConfig.resolution
    );
    
    console.log("🌱 Mother simulation initialized with a new intent field.");
  }
}
