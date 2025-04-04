
// Core simulation engine for the IntentSim universe model
import { v4 as uuidv4 } from 'uuid';
import { createParticleFromField, updateParticlePosition, calculateParticleInteraction } from '../particleUtils';

// Simulation state
let simulationRunning = false;
let particles = [];
let intentField = [];
let canvas = null;
let ctx = null;
let animationFrameId = null;
let lastTimestamp = 0;
let dimensions = { width: 800, height: 600 };
let interactionsCount = 0;
let intentFieldComplexity = 0.1;
let lastParticleCreationTime = 0;
let particleCreationInterval = 500; // ms
let inflationEvents = [];

// Constants
const MAX_PARTICLES = 200;
const INTERACTION_RADIUS = 100;
const FIELD_RESOLUTION = 20;

// Initialize the simulation with a canvas element
export function initializeMotherSimulation(canvasElement) {
  if (!canvasElement) {
    console.error("Cannot initialize simulation: No canvas element provided");
    return false;
  }
  
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  
  dimensions = {
    width: canvas.width,
    height: canvas.height
  };
  
  // Initialize intent field
  intentField = [];
  const zLayers = 3;
  
  for (let z = 0; z < zLayers; z++) {
    const layer = [];
    const yResolution = Math.floor(dimensions.height / FIELD_RESOLUTION);
    const xResolution = Math.floor(dimensions.width / FIELD_RESOLUTION);
    
    for (let y = 0; y < yResolution; y++) {
      const row = [];
      for (let x = 0; x < xResolution; x++) {
        // Initialize with small random fluctuations
        row.push((Math.random() * 2 - 1) * 0.1);
      }
      layer.push(row);
    }
    intentField.push(layer);
  }
  
  // Start with a few particles
  createInitialParticles(30);
  
  return true;
}

// Start the simulation
export function startMotherSimulation(canvasElement) {
  if (!canvas && canvasElement) {
    initializeMotherSimulation(canvasElement);
  } else if (!canvas) {
    console.error("Cannot start simulation: Canvas not initialized");
    return false;
  }
  
  if (simulationRunning) {
    return true; // Already running
  }
  
  simulationRunning = true;
  lastTimestamp = performance.now();
  
  // Start animation loop
  animationFrameId = requestAnimationFrame(simulationLoop);
  return true;
}

// Stop the simulation
export function stopMotherSimulation() {
  simulationRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Check if simulation is running
export function isMotherSimulationRunning() {
  return simulationRunning;
}

// Get the current particles
export function getParticles() {
  return particles;
}

// Get intent field data
export function getIntentField() {
  return intentField;
}

// Get simulation statistics
export function getSimulationStats() {
  return {
    particleCount: particles.length,
    interactionsCount,
    intentFieldComplexity,
    dimensions,
    inflationEvents: inflationEvents.length
  };
}

// Get intent wave values for audio visualization
export function getIntentWaveValues() {
  // Calculate wave values based on intent field
  let totalIntensity = 0;
  let maxIntensity = 0;
  let waveFrequency = 0;
  
  // Sample the middle z-layer
  const midLayer = Math.floor(intentField.length / 2);
  
  if (intentField[midLayer]) {
    let fieldSum = 0;
    let fieldCount = 0;
    
    for (const row of intentField[midLayer]) {
      for (const value of row) {
        fieldSum += Math.abs(value);
        fieldCount++;
        maxIntensity = Math.max(maxIntensity, Math.abs(value));
      }
    }
    
    if (fieldCount > 0) {
      totalIntensity = fieldSum / fieldCount;
    }
    
    // Calculate a "frequency" based on field gradients
    let gradientSum = 0;
    for (let y = 1; y < intentField[midLayer].length - 1; y++) {
      for (let x = 1; x < intentField[midLayer][y].length - 1; x++) {
        const current = intentField[midLayer][y][x];
        const neighbors = [
          intentField[midLayer][y-1][x],
          intentField[midLayer][y+1][x],
          intentField[midLayer][y][x-1],
          intentField[midLayer][y][x+1]
        ];
        
        for (const neighbor of neighbors) {
          gradientSum += Math.abs(current - neighbor);
        }
      }
    }
    
    waveFrequency = gradientSum * 100; // Scale to a reasonable frequency range
  }
  
  return {
    intensity: totalIntensity,
    maxIntensity,
    frequency: waveFrequency,
    complexity: intentFieldComplexity
  };
}

// Main simulation loop
function simulationLoop(timestamp) {
  if (!simulationRunning) return;
  
  const deltaTime = (timestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = timestamp;
  
  // Update the intent field
  updateIntentField(deltaTime);
  
  // Process interactions
  const interactions = processParticleInteractions();
  interactionsCount += interactions;
  
  // Update particle positions
  updateParticles(deltaTime);
  
  // Periodically create new particles from intent field fluctuations
  const now = Date.now();
  if (now - lastParticleCreationTime > particleCreationInterval && particles.length < MAX_PARTICLES) {
    createParticleFromIntentFieldFluctuation();
    lastParticleCreationTime = now;
  }
  
  // Calculate complexity
  intentFieldComplexity = calculateFieldComplexity();
  
  // Check for inflation event
  if (Math.random() < 0.001) {
    checkForInflationEvent();
  }
  
  // Render the simulation
  renderSimulation();
  
  // Continue the loop
  animationFrameId = requestAnimationFrame(simulationLoop);
}

// Create initial set of particles
function createInitialParticles(count) {
  for (let i = 0; i < count; i++) {
    const chargeTypes = ['positive', 'negative', 'neutral'];
    const charge = chargeTypes[Math.floor(Math.random() * 3)];
    
    const particle = {
      id: uuidv4(),
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      z: Math.random() * 10, // z-depth for 3D
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: (Math.random() - 0.5) * 0.5,
      charge,
      radius: 3 + Math.random() * 3,
      color: charge === 'positive' ? '#4ECDC4' : 
             charge === 'negative' ? '#FF6B6B' : '#5E60CE',
      intent: Math.random() * 2 - 1,
      energy: 1 + Math.random(),
      knowledge: 0.1,
      interactionTendency: charge === 'positive' ? 0.7 : 
                         charge === 'negative' ? 0.3 : 0.5,
      age: 0,
      interactions: 0,
      created: Date.now()
    };
    
    particles.push(particle);
  }
}

// Create a new particle from intent field fluctuations
function createParticleFromIntentFieldFluctuation() {
  if (particles.length >= MAX_PARTICLES) return;
  
  // Find a "hot spot" in the intent field
  const midLayer = Math.floor(intentField.length / 2);
  let highestFluctuation = 0;
  let fluctuationX = 0;
  let fluctuationY = 0;
  
  // Sample the field to find high fluctuation areas
  for (let attempt = 0; attempt < 10; attempt++) {
    const y = Math.floor(Math.random() * intentField[midLayer].length);
    const x = Math.floor(Math.random() * intentField[midLayer][y].length);
    
    const fluctuation = Math.abs(intentField[midLayer][y][x]);
    if (fluctuation > highestFluctuation) {
      highestFluctuation = fluctuation;
      fluctuationX = x;
      fluctuationY = y;
    }
  }
  
  // Only create particle if fluctuation is strong enough
  if (highestFluctuation > 0.3) {
    const fieldValue = intentField[midLayer][fluctuationY][fluctuationX];
    
    // Convert grid coordinates to canvas coordinates
    const pixelX = fluctuationX * FIELD_RESOLUTION + (Math.random() - 0.5) * FIELD_RESOLUTION;
    const pixelY = fluctuationY * FIELD_RESOLUTION + (Math.random() - 0.5) * FIELD_RESOLUTION;
    
    const particle = createParticleFromField(
      fieldValue,
      pixelX,
      pixelY,
      Math.random() * 10, // z coordinate
      Date.now()
    );
    
    particles.push(particle);
  }
}

// Update the intent field
function updateIntentField(deltaTime) {
  const fluctuationRate = 0.05 * deltaTime;
  
  for (let z = 0; z < intentField.length; z++) {
    for (let y = 0; y < intentField[z].length; y++) {
      for (let x = 0; x < intentField[z][y].length; x++) {
        // Apply small random fluctuations
        if (Math.random() < 0.1) {
          intentField[z][y][x] += (Math.random() * 2 - 1) * fluctuationRate;
          // Clamp values
          intentField[z][y][x] = Math.max(-1, Math.min(1, intentField[z][y][x]));
        }
        
        // Apply decay toward equilibrium
        intentField[z][y][x] *= 0.999;
      }
    }
  }
  
  // Apply particle influences on the field
  applyParticleInfluencesToField();
}

// Let particles influence the intent field
function applyParticleInfluencesToField() {
  const cellWidth = dimensions.width / intentField[0][0].length;
  const cellHeight = dimensions.height / intentField[0].length;
  const cellDepth = 10 / intentField.length;
  
  for (const particle of particles) {
    // Calculate grid coordinates
    const gridX = Math.floor(particle.x / cellWidth);
    const gridY = Math.floor(particle.y / cellHeight);
    const gridZ = Math.floor(particle.z / cellDepth);
    
    // Skip if outside grid bounds
    if (gridZ < 0 || gridZ >= intentField.length ||
        gridY < 0 || gridY >= intentField[gridZ].length ||
        gridX < 0 || gridX >= intentField[gridZ][gridY].length) {
      continue;
    }
    
    // Apply influence based on charge
    const influenceValue = particle.charge === 'positive' ? 0.02 :
                          particle.charge === 'negative' ? -0.02 : 0;
    
    intentField[gridZ][gridY][gridX] += influenceValue;
    
    // Clamp values
    intentField[gridZ][gridY][gridX] = Math.max(-1, Math.min(1, intentField[gridZ][gridY][gridX]));
  }
}

// Update particle positions
function updateParticles(deltaTime) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const updated = updateParticlePosition(
      particles[i],
      dimensions,
      intentField,
      '2d' // Force 2D mode for now
    );
    
    // Update particle with new position and properties
    particles[i] = updated;
    
    // Age particles and remove old ones
    particles[i].age += deltaTime;
    
    // Remove very old particles with low energy
    if (particles[i].age > 60 && particles[i].energy < 0.2) {
      particles.splice(i, 1);
    }
  }
}

// Process interactions between particles
function processParticleInteractions() {
  let interactionCount = 0;
  
  // Process all possible particle pairs
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      
      // Calculate distance
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distanceSquared = dx * dx + dy * dy;
      
      // Check if particles are close enough to interact
      if (distanceSquared <= INTERACTION_RADIUS * INTERACTION_RADIUS) {
        // Calculate interaction
        const [updatedP1, updatedP2, interacted] = calculateParticleInteraction(
          p1, p2, 0.1, '2d'
        );
        
        if (interacted) {
          // Update particles with interaction results
          particles[i] = updatedP1;
          particles[j] = updatedP2;
          interactionCount++;
        }
      }
    }
  }
  
  return interactionCount;
}

// Calculate field complexity
function calculateFieldComplexity() {
  // Calculate complexity based on field gradients and patterns
  let complexitySum = 0;
  let gradientSum = 0;
  let cellCount = 0;
  
  const midLayer = Math.floor(intentField.length / 2);
  
  if (intentField[midLayer]) {
    for (let y = 1; y < intentField[midLayer].length - 1; y++) {
      for (let x = 1; x < intentField[midLayer][y].length - 1; x++) {
        const center = intentField[midLayer][y][x];
        const neighbors = [
          intentField[midLayer][y-1][x],
          intentField[midLayer][y+1][x],
          intentField[midLayer][y][x-1],
          intentField[midLayer][y][x+1]
        ];
        
        // Calculate local gradient
        let localGradient = 0;
        for (const neighbor of neighbors) {
          localGradient += Math.abs(center - neighbor);
        }
        
        gradientSum += localGradient;
        cellCount++;
      }
    }
  }
  
  // Normalize and scale complexity
  if (cellCount > 0) {
    complexitySum = gradientSum / cellCount;
    // Scale to [0, 1] range
    return Math.min(1, complexitySum * 5);
  }
  
  return 0.1; // Default complexity
}

// Check for inflation events
function checkForInflationEvent() {
  // Requirements for inflation: high complexity and sufficient particles
  if (intentFieldComplexity > 0.7 && particles.length > MAX_PARTICLES * 0.7) {
    console.log("Inflation event triggered!");
    
    // Record the event
    inflationEvents.push({
      timestamp: Date.now(),
      particleCount: particles.length,
      complexity: intentFieldComplexity
    });
    
    // Double the intent fluctuations briefly
    for (let z = 0; z < intentField.length; z++) {
      for (let y = 0; y < intentField[z].length; y++) {
        for (let x = 0; x < intentField[z][y].length; x++) {
          intentField[z][y][x] *= 2;
          // Clamp values
          intentField[z][y][x] = Math.max(-1, Math.min(1, intentField[z][y][x]));
        }
      }
    }
    
    // Create a burst of new particles
    const burstCount = Math.floor(MAX_PARTICLES * 0.2);
    for (let i = 0; i < burstCount; i++) {
      if (particles.length < MAX_PARTICLES) {
        createParticleFromIntentFieldFluctuation();
      }
    }
  }
}

// Render the simulation
function renderSimulation() {
  if (!ctx || !canvas) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Render connections between particles
  renderParticleConnections();
  
  // Render particles
  for (const particle of particles) {
    renderParticle(particle);
  }
}

// Render connections between particles that are close to each other
function renderParticleConnections() {
  if (!ctx) return;
  
  const connectDistance = INTERACTION_RADIUS * 1.5;
  const connectDistanceSquared = connectDistance * connectDistance;
  
  ctx.lineWidth = 1;
  
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared < connectDistanceSquared) {
        // Calculate opacity based on distance (closer = more opaque)
        const distance = Math.sqrt(distanceSquared);
        const opacity = Math.max(0, 0.8 * (1 - distance / connectDistance));
        
        // Different color for same vs. different charges
        let connectionColor;
        if (p1.charge === p2.charge) {
          if (p1.charge === 'positive') {
            connectionColor = `rgba(77, 206, 196, ${opacity})`; // Teal for positive-positive
          } else if (p1.charge === 'negative') {
            connectionColor = `rgba(255, 107, 107, ${opacity})`; // Red for negative-negative
          } else {
            connectionColor = `rgba(94, 96, 206, ${opacity})`; // Purple for neutral-neutral
          }
        } else {
          connectionColor = `rgba(180, 180, 255, ${opacity})`; // Light blue for mixed
        }
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        ctx.strokeStyle = connectionColor;
        ctx.stroke();
        
        // Add small "energy pulse" along the connection line
        if (Math.random() < 0.05) {
          const pulsePosition = Math.random(); // Position along the line (0-1)
          const pulseX = p1.x + dx * pulsePosition;
          const pulseY = p1.y + dy * pulsePosition;
          
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = connectionColor.replace(/[^,]+(?=\))/, '1'); // Full opacity
          ctx.fill();
        }
      }
    }
  }
}

// Render a single particle
function renderParticle(particle) {
  if (!ctx) return;
  
  // Draw glow
  const glowRadius = particle.radius * 2.5;
  const gradient = ctx.createRadialGradient(
    particle.x, particle.y, particle.radius * 0.8,
    particle.x, particle.y, glowRadius
  );
  
  gradient.addColorStop(0, particle.color);
  gradient.addColorStop(1, 'transparent');
  
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw main particle
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
}
