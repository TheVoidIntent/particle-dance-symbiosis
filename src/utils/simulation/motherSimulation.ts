
import { simulationState, saveState, getSimulationStats } from './state';
import { initializeMotherSimulation } from './initialization';
import { updateSimulation, updateIntentFieldPeriodically, maybeCreateParticles } from './updater';

// Start the mother simulation
export function startMotherSimulation() {
  if (simulationState.isRunning) return;
  
  console.log("▶️ Starting mother simulation...");
  
  if (!simulationState.particles.length || !simulationState.intentField.length) {
    initializeMotherSimulation();
  }
  
  // Create new particles occasionally
  const particleCreationInterval = setInterval(() => {
    maybeCreateParticles();
  }, 2000);
  
  // Update intent field periodically
  const intentUpdateInterval = setInterval(() => {
    updateIntentFieldPeriodically();
  }, 1000);
  
  // Main simulation loop
  simulationState.intervalId = window.setInterval(() => {
    updateSimulation();
  }, 100); // Run 10 times per second for better performance
  
  simulationState.isRunning = true;
  
  // Clean up on page unload
  window.addEventListener('beforeunload', saveState);
  
  // Clean up the intervals if the window is closed
  window.addEventListener('beforeunload', () => {
    if (simulationState.intervalId !== null) clearInterval(simulationState.intervalId);
    clearInterval(particleCreationInterval);
    clearInterval(intentUpdateInterval);
  });
  
  console.log("✅ Mother simulation is now running");
  
  return {
    stop: () => {
      if (simulationState.intervalId !== null) {
        clearInterval(simulationState.intervalId);
        clearInterval(particleCreationInterval);
        clearInterval(intentUpdateInterval);
        simulationState.isRunning = false;
        console.log("⏹️ Mother simulation stopped");
      }
    }
  };
}

// Stop the mother simulation
export function stopMotherSimulation() {
  if (simulationState.intervalId !== null) {
    clearInterval(simulationState.intervalId);
    simulationState.intervalId = null;
    simulationState.isRunning = false;
    saveState(); // Save state on stop
    console.log("⏹️ Mother simulation stopped");
  }
}

// Get whether the simulation is running
export function isMotherSimulationRunning() {
  return simulationState.isRunning;
}

// Initialize when this module loads
if (typeof window !== 'undefined') {
  // Initialize but don't start automatically
  setTimeout(() => {
    initializeMotherSimulation();
  }, 1000);
}

// Re-export the necessary functions from other modules for backward compatibility
export { initializeMotherSimulation } from './initialization';
export { getSimulationStats } from './state';

