
import { createParticleFromField } from '../particleUtils';
import { simulationState, loadState } from './state';
import { defaultConfig, simulationDimensions, fieldConfig } from './config';

// Initialize the mother simulation
export function initializeMotherSimulation() {
  // Don't initialize if already running
  if (simulationState.isRunning) return;
  
  console.log("🔄 Initializing mother simulation...");
  
  // Try to load from local storage first
  if (loadState()) {
    return; // Successfully loaded from localStorage
  }
  
  // Create a new simulation if no saved state exists
  initializeNewSimulation();
}

// Initialize a fresh simulation if no saved state exists
export function initializeNewSimulation() {
  console.log("🆕 Creating new mother simulation...");
  
  // Create initial intent field
  const fieldWidth = fieldConfig.width;
  const fieldHeight = fieldConfig.height;
  const fieldDepth = fieldConfig.depth;
  
  simulationState.intentField = [];
  
  for (let z = 0; z < fieldDepth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < fieldWidth; x++) {
        row.push(Math.random() * 2 - 1);
      }
      plane.push(row);
    }
    simulationState.intentField.push(plane);
  }
  
  // Create initial particles
  simulationState.particles = [];
  for (let i = 0; i < defaultConfig.maxParticles / 2; i++) {
    createInitialParticle(i);
  }
  
  simulationState.interactionsCount = 0;
  simulationState.frameCount = 0;
  simulationState.simulationTime = 0;
  
  console.log(`✅ Created mother simulation with ${simulationState.particles.length} particles`);
}

// Helper function to create an initial particle
function createInitialParticle(index: number) {
  const { width, height } = simulationDimensions;
  
  const x = Math.random() * width;
  const y = Math.random() * height;
  const z = Math.random() * 10;
  
  const fieldX = Math.floor(x / (width / simulationState.intentField[0][0].length));
  const fieldY = Math.floor(y / (height / simulationState.intentField[0].length));
  const fieldZ = Math.floor(z / (10 / simulationState.intentField.length));
  
  const fieldValue = simulationState.intentField[
    Math.min(fieldZ, simulationState.intentField.length - 1)
  ][
    Math.min(fieldY, simulationState.intentField[0].length - 1)
  ][
    Math.min(fieldX, simulationState.intentField[0][0].length - 1)
  ];
  
  const newParticle = createParticleFromField(
    fieldValue, 
    x, y, z, 
    Date.now() + index
  );
  
  if (defaultConfig.useAdaptiveParticles && Math.random() < 0.1) {
    newParticle.type = 'adaptive';
    newParticle.color = 'rgba(236, 72, 153, 0.85)';
    newParticle.adaptiveScore = 1;
  }
  
  if (defaultConfig.energyConservation) {
    newParticle.energyCapacity = 1 + Math.random() * 0.5;
    newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
  } else {
    newParticle.energyCapacity = 100;
    newParticle.intentDecayRate = 0.00001;
  }
  
  simulationState.particles.push(newParticle);
}

// Create a new particle for ongoing simulation
export function createNewParticle(index: number = 0) {
  const { width, height } = simulationDimensions;
  
  const x = Math.random() * width;
  const y = Math.random() * height;
  const z = Math.random() * 10;
  
  const fieldX = Math.floor(x / (width / simulationState.intentField[0][0].length));
  const fieldY = Math.floor(y / (height / simulationState.intentField[0].length));
  const fieldZ = Math.floor(z / (10 / simulationState.intentField.length));
  
  const fieldValue = simulationState.intentField[
    Math.min(fieldZ, simulationState.intentField.length - 1)
  ][
    Math.min(fieldY, simulationState.intentField[0].length - 1)
  ][
    Math.min(fieldX, simulationState.intentField[0][0].length - 1)
  ];
  
  const newParticle = createParticleFromField(
    fieldValue, 
    x, y, z, 
    Date.now() + index
  );
  
  if (defaultConfig.useAdaptiveParticles && Math.random() < 0.1) {
    newParticle.type = 'adaptive';
    newParticle.color = 'rgba(236, 72, 153, 0.85)';
    newParticle.adaptiveScore = 1;
  }
  
  if (defaultConfig.energyConservation) {
    newParticle.energyCapacity = 1 + Math.random() * 0.5;
    newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
  } else {
    newParticle.energyCapacity = 100;
    newParticle.intentDecayRate = 0.00001;
  }
  
  return newParticle;
}

