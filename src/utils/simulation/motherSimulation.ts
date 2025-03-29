
import { simulationState, saveState, getSimulationStats } from './state';
import { initializeMotherSimulation } from './initialization';
import { updateSimulation, updateIntentFieldPeriodically, maybeCreateParticles } from './updater';

// Flag to track simulation status
let simulationActive = false;
let particleCreationInterval: number | null = null;
let intentUpdateInterval: number | null = null;
let autoRestartInterval: number | null = null;

// Start the mother simulation
export function startMotherSimulation() {
  if (simulationState.isRunning) return;
  
  console.log("▶️ Starting mother simulation...");
  
  if (!simulationState.particles.length || !simulationState.intentField.length) {
    initializeMotherSimulation();
  }
  
  // Create new particles occasionally
  particleCreationInterval = window.setInterval(() => {
    maybeCreateParticles();
  }, 2000);
  
  // Update intent field periodically
  intentUpdateInterval = window.setInterval(() => {
    updateIntentFieldPeriodically();
  }, 1000);
  
  // Main simulation loop
  simulationState.intervalId = window.setInterval(() => {
    updateSimulation();
  }, 100); // Run 10 times per second for better performance
  
  simulationState.isRunning = true;
  simulationActive = true;
  
  // Clean up on page unload
  window.addEventListener('beforeunload', saveState);
  
  // Set up auto-restart checks in case simulation stops
  setupAutoRestart();
  
  console.log("✅ Mother simulation is now running", {
    particles: simulationState.particles.length,
    intentField: simulationState.intentField.length > 0 ? 
      `${simulationState.intentField.length}x${simulationState.intentField[0].length}` : 'not initialized'
  });
  
  return {
    stop: stopMotherSimulation
  };
}

// Stop the mother simulation - BUT only temporarily for maintenance
export function stopMotherSimulation() {
  if (simulationState.intervalId !== null) {
    clearInterval(simulationState.intervalId);
    simulationState.intervalId = null;
    
    if (particleCreationInterval !== null) {
      clearInterval(particleCreationInterval);
      particleCreationInterval = null;
    }
    
    if (intentUpdateInterval !== null) {
      clearInterval(intentUpdateInterval);
      intentUpdateInterval = null;
    }
    
    simulationState.isRunning = false;
    saveState(); // Save state on stop
    console.log("⏸️ Mother simulation temporarily paused");
    
    // Auto-restart after 5 seconds
    setTimeout(() => {
      if (!simulationState.isRunning && simulationActive) {
        console.log("🔄 Auto-restarting mother simulation...");
        startMotherSimulation();
      }
    }, 5000);
  }
}

// Setup auto-restart to ensure the simulation never truly stops
function setupAutoRestart() {
  if (autoRestartInterval !== null) {
    clearInterval(autoRestartInterval);
  }
  
  // Check every 30 seconds if the simulation is still running
  autoRestartInterval = window.setInterval(() => {
    if (!simulationState.isRunning && simulationActive) {
      console.log("🔄 Auto-restarting mother simulation after detection of stoppage...");
      startMotherSimulation();
    }
  }, 30000);
}

// Get whether the simulation is running
export function isMotherSimulationRunning() {
  return simulationState.isRunning;
}

// Initialize when this module loads
if (typeof window !== 'undefined') {
  // Initialize automatically with a delay to ensure the DOM is ready
  setTimeout(() => {
    console.log("⚡ Auto-initializing mother simulation...");
    initializeMotherSimulation();
    startMotherSimulation();
    simulationActive = true;
  }, 1000);
  
  // Handle visibility changes to prevent simulation from stopping when tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && simulationActive && !simulationState.isRunning) {
      console.log("🔄 Resuming mother simulation after tab becomes visible...");
      startMotherSimulation();
    }
  });
}

// Re-export the necessary functions from other modules for backward compatibility
export { initializeMotherSimulation } from './initialization';
export { getSimulationStats } from './state';
