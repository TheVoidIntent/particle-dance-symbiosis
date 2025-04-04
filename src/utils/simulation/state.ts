
// Change the import to get Particle from types instead of particleUtils
import { Particle } from '@/types/simulation';
import { fieldConfig } from './config';

// State for the mother simulation
export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  interactionsCount: number;
  frameCount: number;
  simulationTime: number;
  isRunning: boolean;
  intervalId: number | null;
  knowledgeAverage?: number;
}

// Create the initial simulation state
export const createInitialState = (): SimulationState => ({
  particles: [],
  intentField: [],
  interactionsCount: 0,
  frameCount: 0,
  simulationTime: 0,
  isRunning: false,
  intervalId: null,
  knowledgeAverage: 0
});

// Current simulation state (singleton)
export const simulationState = createInitialState();

// Save the current state to localStorage
export function saveState(): void {
  try {
    // We don't need to save the entire particles array, just a subset for efficiency
    // This prevents localStorage size issues
    const stateToPersist = {
      particles: simulationState.particles,
      intentField: simulationState.intentField,
      interactionsCount: simulationState.interactionsCount,
      frameCount: simulationState.frameCount,
      simulationTime: simulationState.simulationTime
    };
    
    localStorage.setItem('motherSimulationState', JSON.stringify(stateToPersist));
    localStorage.setItem('motherSimulationLastSaved', new Date().toISOString());
    
    // Log save only occasionally (not every time) to reduce console spam
    if (simulationState.frameCount % 1000 === 0) {
      console.log(`💾 Mother simulation state saved: ${simulationState.particles.length} particles, frame ${simulationState.frameCount}`);
    }
  } catch (error) {
    console.error("Failed to save mother simulation state:", error);
  }
}

// Load state from localStorage
export function loadState(): SimulationState | null {
  try {
    const savedState = localStorage.getItem('motherSimulationState');
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState);
    return {
      ...createInitialState(),
      ...parsedState,
      isRunning: false,
      intervalId: null
    };
  } catch (error) {
    console.error("Failed to load mother simulation state:", error);
    return null;
  }
}

// Get the current simulation statistics
export function getSimulationStats() {
  const stats = {
    particles: simulationState.particles,
    intentField: simulationState.intentField,
    interactionsCount: simulationState.interactionsCount,
    frameCount: simulationState.frameCount,
    emergenceIndex: 0, // Calculated in motherSimulation
    particleCount: simulationState.particles.length,
    positiveParticles: simulationState.particles.filter(p => p.charge === 'positive').length,
    negativeParticles: simulationState.particles.filter(p => p.charge === 'negative').length,
    neutralParticles: simulationState.particles.filter(p => p.charge === 'neutral').length,
    intentFieldComplexity: 0, // Calculated in motherSimulation
    knowledgeAverage: simulationState.particles.length > 0 
      ? simulationState.particles.reduce((sum, p) => sum + p.knowledge, 0) / simulationState.particles.length 
      : 0
  };
  
  return stats;
}

// Export loadState explicitly
export { loadState };
