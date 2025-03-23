
import { 
  Particle, 
  calculateParticleInteraction,
  updateParticlePosition,
  createParticleFromField,
  analyzeParticleClusters,
  calculateSystemEntropy,
  detectAnomalies
} from './particleUtils';
import { 
  updateIntentField, 
  createFieldFromParticles,
  analyzeIntentField
} from './fieldUtils';
import { recordDataPoint } from './dataExportUtils';

// State for the mother simulation
let particles: Particle[] = [];
let intentField: number[][][] = [];
let interactionsCount = 0;
let frameCount = 0;
let simulationTime = 0;
let dimensions = { width: 800, height: 600 };
let isRunning = false;
let intervalId: number | null = null;

// Configuration
const config = {
  maxParticles: 150,
  learningRate: 0.15,
  fluctuationRate: 0.02,
  useAdaptiveParticles: true,
  energyConservation: true,
  probabilisticIntent: true,
  viewMode: '2d' as '2d' | '3d',
};

// Initialize the mother simulation
export function initializeMotherSimulation() {
  // Don't initialize if already running
  if (isRunning) return;
  
  console.log("🔄 Initializing mother simulation...");
  
  // Try to load from local storage first
  const savedState = localStorage.getItem('motherSimulationState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      particles = state.particles;
      intentField = state.intentField;
      interactionsCount = state.interactionsCount;
      frameCount = state.frameCount;
      simulationTime = state.simulationTime;
      
      console.log(`✅ Loaded mother simulation with ${particles.length} particles and ${interactionsCount} interactions`);
    } catch (error) {
      console.error("Failed to restore mother simulation state:", error);
      initializeNewSimulation();
    }
  } else {
    initializeNewSimulation();
  }
}

// Initialize a fresh simulation if no saved state exists
function initializeNewSimulation() {
  console.log("🆕 Creating new mother simulation...");
  
  // Create initial intent field
  const fieldResolution = 10;
  const fieldWidth = Math.ceil(dimensions.width / fieldResolution);
  const fieldHeight = Math.ceil(dimensions.height / fieldResolution);
  const fieldDepth = 10;
  
  intentField = [];
  
  for (let z = 0; z < fieldDepth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < fieldWidth; x++) {
        row.push(Math.random() * 2 - 1);
      }
      plane.push(row);
    }
    intentField.push(plane);
  }
  
  // Create initial particles
  particles = [];
  for (let i = 0; i < config.maxParticles / 2; i++) {
    const x = Math.random() * dimensions.width;
    const y = Math.random() * dimensions.height;
    const z = Math.random() * 10;
    
    const fieldX = Math.floor(x / (dimensions.width / intentField[0][0].length));
    const fieldY = Math.floor(y / (dimensions.height / intentField[0].length));
    const fieldZ = Math.floor(z / (10 / intentField.length));
    
    const fieldValue = intentField[
      Math.min(fieldZ, intentField.length - 1)
    ][
      Math.min(fieldY, intentField[0].length - 1)
    ][
      Math.min(fieldX, intentField[0][0].length - 1)
    ];
    
    const newParticle = createParticleFromField(
      fieldValue, 
      x, y, z, 
      Date.now() + i
    );
    
    if (config.useAdaptiveParticles && Math.random() < 0.1) {
      newParticle.type = 'adaptive';
      newParticle.color = 'rgba(236, 72, 153, 0.85)';
      newParticle.adaptiveScore = 1;
    }
    
    if (config.energyConservation) {
      newParticle.energyCapacity = 1 + Math.random() * 0.5;
      newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
    } else {
      newParticle.energyCapacity = 100;
      newParticle.intentDecayRate = 0.00001;
    }
    
    particles.push(newParticle);
  }
  
  interactionsCount = 0;
  frameCount = 0;
  simulationTime = 0;
  
  console.log(`✅ Created mother simulation with ${particles.length} particles`);
}

// Start the mother simulation
export function startMotherSimulation() {
  if (isRunning) return;
  
  console.log("▶️ Starting mother simulation...");
  
  if (!particles.length || !intentField.length) {
    initializeMotherSimulation();
  }
  
  // Create new particles occasionally
  const particleCreationInterval = setInterval(() => {
    if (particles.length >= config.maxParticles) return;
    
    const numToCreate = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numToCreate; i++) {
      if (particles.length >= config.maxParticles) break;
      
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const z = Math.random() * 10;
      
      const fieldX = Math.floor(x / (dimensions.width / intentField[0][0].length));
      const fieldY = Math.floor(y / (dimensions.height / intentField[0].length));
      const fieldZ = Math.floor(z / (10 / intentField.length));
      
      const fieldValue = intentField[
        Math.min(fieldZ, intentField.length - 1)
      ][
        Math.min(fieldY, intentField[0].length - 1)
      ][
        Math.min(fieldX, intentField[0][0].length - 1)
      ];
      
      const newParticle = createParticleFromField(
        fieldValue, 
        x, y, z, 
        Date.now() + i
      );
      
      if (config.useAdaptiveParticles && Math.random() < 0.1) {
        newParticle.type = 'adaptive';
        newParticle.color = 'rgba(236, 72, 153, 0.85)';
        newParticle.adaptiveScore = 1;
      }
      
      if (config.energyConservation) {
        newParticle.energyCapacity = 1 + Math.random() * 0.5;
        newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
      } else {
        newParticle.energyCapacity = 100;
        newParticle.intentDecayRate = 0.00001;
      }
      
      particles.push(newParticle);
    }
  }, 2000);
  
  // Update intent field periodically
  const intentUpdateInterval = setInterval(() => {
    intentField = updateIntentField(
      intentField, 
      config.fluctuationRate, 
      config.probabilisticIntent
    );
    
    if (frameCount % 100 === 0) {
      const particleField = createFieldFromParticles(
        particles, 
        { 
          width: dimensions.width, 
          height: dimensions.height, 
          depth: 10 
        },
        dimensions.width / intentField[0][0].length
      );
      
      const blendedField = intentField.map((plane, z) => 
        plane.map((row, y) => 
          row.map((value, x) => 
            value * 0.7 + particleField[z][y][x] * 0.3
          )
        )
      );
      
      intentField = blendedField;
    }
  }, 1000);
  
  // Main simulation loop
  intervalId = window.setInterval(() => {
    // Update frame count and time
    frameCount++;
    simulationTime++;
    
    // Update particles (positions, interactions, etc.)
    particles = updateParticles();
    
    // Collect data periodically
    if (frameCount % 30 === 0) {
      const clusterAnalysis = analyzeParticleClusters(particles);
      const entropyAnalysis = calculateSystemEntropy(particles, intentField);
      const fieldAnalysis = analyzeIntentField(intentField);
      
      // Calculate complexity index
      const positiveParticles = particles.filter(p => p.charge === 'positive').length;
      const negativeParticles = particles.filter(p => p.charge === 'negative').length;
      const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
      const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
      const quantumParticles = particles.filter(p => p.type === 'quantum').length;
      const compositeParticles = particles.filter(p => p.type === 'composite').length;
      const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
      
      const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
      const maxComplexity = particles.length > 0 
        ? particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
        : 1;
      
      const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                           (highEnergyParticles + 1) * (quantumParticles + 1) *
                           (compositeParticles + 1) * (adaptiveParticles + 1)) / 
                           Math.max(1, particles.length ** 2);
      
      const complexityIndex = (totalKnowledge * varietyFactor) + 
                             (interactionsCount / 1000) + 
                             (compositeParticles * maxComplexity) +
                             (adaptiveParticles * 2);
      
      // Record data point
      if (frameCount % 60 === 0) { // Record less frequently for efficiency
        recordDataPoint(
          simulationTime,
          particles,
          intentField,
          interactionsCount,
          clusterAnalysis,
          entropyAnalysis.systemEntropy,
          complexityIndex,
          {
            shannonEntropy: entropyAnalysis.shannonEntropy,
            spatialEntropy: entropyAnalysis.spatialEntropy,
            fieldOrderParameter: entropyAnalysis.fieldOrderParameter,
            temporalEntropy: entropyAnalysis.temporalEntropy,
            informationDensity: clusterAnalysis.informationDensity,
            kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity
          }
        );
      }
    }
    
    // Save state periodically
    if (frameCount % 100 === 0) {
      saveState();
    }
  }, 100); // Run 10 times per second for better performance
  
  isRunning = true;
  
  // Clean up on page unload
  window.addEventListener('beforeunload', saveState);
  
  // Clean up the intervals if the window is closed
  window.addEventListener('beforeunload', () => {
    if (intervalId !== null) clearInterval(intervalId);
    clearInterval(particleCreationInterval);
    clearInterval(intentUpdateInterval);
  });
  
  console.log("✅ Mother simulation is now running");
  
  return {
    stop: () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        clearInterval(particleCreationInterval);
        clearInterval(intentUpdateInterval);
        isRunning = false;
        console.log("⏹️ Mother simulation stopped");
      }
    }
  };
}

// Update particles (positions, interactions, etc.)
function updateParticles() {
  if (particles.length === 0 || intentField.length === 0) return particles;
  
  const newParticles = [...particles];
  
  for (let i = 0; i < newParticles.length; i++) {
    newParticles[i] = updateParticlePosition(
      newParticles[i], 
      dimensions, 
      intentField, 
      config.viewMode,
      newParticles
    );
    
    for (let j = i + 1; j < newParticles.length; j++) {
      const [updatedParticle1, updatedParticle2, interactionOccurred] = calculateParticleInteraction(
        newParticles[i],
        newParticles[j],
        config.learningRate,
        config.viewMode
      );
      
      newParticles[i] = updatedParticle1;
      newParticles[j] = updatedParticle2;
      
      if (interactionOccurred) {
        interactionsCount += 1;
      }
    }
  }
  
  if (config.energyConservation) {
    return newParticles.filter(p => p.energy > 0.1);
  }
  
  return newParticles;
}

// Save the current state to localStorage
function saveState() {
  try {
    // We don't need to save the entire particles array, just a subset for efficiency
    // This prevents localStorage size issues
    const stateToPersist = {
      particles: particles,
      intentField: intentField,
      interactionsCount: interactionsCount,
      frameCount: frameCount,
      simulationTime: simulationTime
    };
    
    localStorage.setItem('motherSimulationState', JSON.stringify(stateToPersist));
    localStorage.setItem('motherSimulationLastSaved', new Date().toISOString());
    
    // Log save only occasionally (not every time) to reduce console spam
    if (frameCount % 1000 === 0) {
      console.log(`💾 Mother simulation state saved: ${particles.length} particles, frame ${frameCount}`);
    }
  } catch (error) {
    console.error("Failed to save mother simulation state:", error);
  }
}

// Get current simulation stats
export function getMotherSimulationStats() {
  if (particles.length === 0) {
    return {
      isRunning: isRunning,
      particleCount: 0,
      interactionsCount: 0,
      frameCount: 0,
      simulationTime: 0,
      lastSaved: localStorage.getItem('motherSimulationLastSaved') || 'Never'
    };
  }
  
  // Get basic stats
  const positiveParticles = particles.filter(p => p.charge === 'positive').length;
  const negativeParticles = particles.filter(p => p.charge === 'negative').length;
  const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
  const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
  const quantumParticles = particles.filter(p => p.type === 'quantum').length;
  const compositeParticles = particles.filter(p => p.type === 'composite').length;
  const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
  
  return {
    isRunning,
    particleCount: particles.length,
    particleTypes: {
      positive: positiveParticles,
      negative: negativeParticles,
      neutral: neutralParticles,
      highEnergy: highEnergyParticles,
      quantum: quantumParticles,
      composite: compositeParticles,
      adaptive: adaptiveParticles
    },
    interactionsCount,
    frameCount,
    simulationTime,
    lastSaved: localStorage.getItem('motherSimulationLastSaved') || 'Never'
  };
}

// Get whether the simulation is running
export function isMotherSimulationRunning() {
  return isRunning;
}

// Stop the mother simulation
export function stopMotherSimulation() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
    saveState(); // Save state on stop
    console.log("⏹️ Mother simulation stopped");
  }
}

// Initialize when this module loads
if (typeof window !== 'undefined') {
  // Initialize but don't start automatically
  setTimeout(() => {
    initializeMotherSimulation();
  }, 1000);
}
