
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
export function loadState(): boolean {
  const savedState = localStorage.getItem('motherSimulationState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      simulationState.particles = state.particles;
      simulationState.intentField = state.intentField;
      simulationState.interactionsCount = state.interactionsCount;
      simulationState.frameCount = state.frameCount;
      simulationState.simulationTime = state.simulationTime;
      
      console.log(`✅ Loaded mother simulation with ${simulationState.particles.length} particles and ${simulationState.interactionsCount} interactions`);
      return true;
    } catch (error) {
      console.error("Failed to restore mother simulation state:", error);
      return false;
    }
  }
  return false;
}

// Get current simulation stats
export function getSimulationStats() {
  if (simulationState.particles.length === 0) {
    return {
      isRunning: simulationState.isRunning,
      particleCount: 0,
      interactionsCount: 0,
      frameCount: 0,
      simulationTime: 0,
      lastSaved: localStorage.getItem('motherSimulationLastSaved') || 'Never'
    };
  }
  
  // Get basic stats
  const positiveParticles = simulationState.particles.filter(p => p.charge === 'positive').length;
  const negativeParticles = simulationState.particles.filter(p => p.charge === 'negative').length;
  const neutralParticles = simulationState.particles.filter(p => p.charge === 'neutral').length;
  const highEnergyParticles = simulationState.particles.filter(p => p.type === 'high-energy').length;
  const quantumParticles = simulationState.particles.filter(p => p.type === 'quantum').length;
  const compositeParticles = simulationState.particles.filter(p => p.type === 'composite').length;
  const adaptiveParticles = simulationState.particles.filter(p => p.type === 'adaptive').length;
  
  return {
    isRunning: simulationState.isRunning,
    particleCount: simulationState.particles.length,
    particleTypes: {
      positive: positiveParticles,
      negative: negativeParticles,
      neutral: neutralParticles,
      highEnergy: highEnergyParticles,
      quantum: quantumParticles,
      composite: compositeParticles,
      adaptive: adaptiveParticles
    },
    interactionsCount: simulationState.interactionsCount,
    frameCount: simulationState.frameCount,
    simulationTime: simulationState.simulationTime,
    lastSaved: localStorage.getItem('motherSimulationLastSaved') || 'Never'
  };
}

