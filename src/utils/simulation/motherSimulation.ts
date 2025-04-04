
/**
 * Mother Simulation - The core simulation engine that runs in the background
 */

// Simulation state
let isRunning = false;
let simulationInterval: number | null = null;
let particleCount = 0;
let interactionCount = 0;

// Simple particle interface
export interface Particle {
  id: number;
  x: number;
  y: number;
  charge: number; // -1 to 1 (negative to positive)
  intent: number; // 0 to 1 (low to high intent to interact)
  knowledge: number; // 0 to 1 (amount of information gathered)
  color: string;
  size: number;
  velocity: { x: number; y: number };
  // Add missing properties required by simulation.ts Particle interface
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  radius?: number;
  mass?: number;
  interactionTendency?: number;
  lastInteraction?: number;
  interactionCount?: number;
  age?: number;
  interactions?: number;
  intentDecayRate?: number;
  created?: number;
  scale?: number;
  adaptiveScore?: number;
  energyCapacity?: number;
  creationTime?: number;
  isPostInflation?: boolean;
  energy?: number;
  complexity?: number;
  type?: string;
}

// Simulation data
const particles: Particle[] = [];
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Initialize the simulation
export function initializeMotherSimulation() {
  // Reset simulation data
  particles.length = 0;
  particleCount = 0;
  interactionCount = 0;
  
  // Create initial particles
  for (let i = 0; i < 50; i++) {
    createParticle();
  }
  
  console.log("Mother simulation initialized with 50 particles");
}

// Create a new particle
function createParticle(): Particle {
  // Determine charge from intent field fluctuations
  const intentFluctuation = Math.random() * 2 - 1; // -1 to 1
  const charge = intentFluctuation;
  
  // Particles with positive charge have higher intent to interact
  const intent = charge > 0 ? 0.5 + (charge * 0.5) : 0.5 - (Math.abs(charge) * 0.3);
  
  // Determine color based on charge (negative=red, neutral=green, positive=blue)
  let color;
  if (charge < -0.3) {
    color = `rgba(255, ${Math.floor(100 + (charge+1) * 155)}, ${Math.floor(100 + (charge+1) * 155)}, 0.8)`;
  } else if (charge > 0.3) {
    color = `rgba(${Math.floor(100 + (1-charge) * 155)}, ${Math.floor(100 + (1-charge) * 155)}, 255, 0.8)`;
  } else {
    color = `rgba(${Math.floor(150 + charge * 105)}, 255, ${Math.floor(150 + charge * 105)}, 0.8)`;
  }
  
  // Create the particle
  const particle: Particle = {
    id: particleCount++,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    charge,
    intent,
    knowledge: 0,
    color,
    size: 3 + Math.random() * 5,
    velocity: {
      x: (Math.random() * 2 - 1) * 2,
      y: (Math.random() * 2 - 1) * 2
    },
    // Add more properties required by the simulation.ts interface
    z: 0,
    vx: (Math.random() * 2 - 1) * 2,
    vy: (Math.random() * 2 - 1) * 2,
    vz: 0,
    radius: 3 + Math.random() * 5,
    mass: 1,
    interactionTendency: intent,
    lastInteraction: 0,
    interactionCount: 0,
    age: 0,
    interactions: 0,
    intentDecayRate: 0.001,
    created: Date.now(),
    scale: 1,
    adaptiveScore: 0,
    energy: 10,
    complexity: 1,
    creationTime: Date.now(),
    isPostInflation: false,
    type: charge > 0.3 ? 'positive' : charge < -0.3 ? 'negative' : 'neutral',
    energyCapacity: 15
  };
  
  particles.push(particle);
  return particle;
}

// Update the simulation for one step
function updateSimulation() {
  if (!isRunning) return;
  
  // Update canvas dimensions if needed
  const simulationCanvas = document.getElementById('simulation-canvas') as HTMLCanvasElement;
  if (simulationCanvas) {
    canvas.width = simulationCanvas.width;
    canvas.height = simulationCanvas.height;
  }
  
  // Move particles
  for (const particle of particles) {
    // Apply intent-based behavior
    
    // Update position
    particle.x += particle.velocity.x;
    particle.y += particle.velocity.y;
    
    // Bounce off edges
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.velocity.x *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.velocity.y *= -1;
    }
    
    // Update vx and vy to match velocity
    if (particle.vx !== undefined && particle.vy !== undefined) {
      particle.vx = particle.velocity.x;
      particle.vy = particle.velocity.y;
    }
  }
  
  // Process interactions
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      
      // Calculate distance
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If particles are close enough to interact
      if (distance < p1.size + p2.size + 10) {
        // Determine if interaction occurs based on intent
        const interactionProbability = p1.intent * p2.intent;
        
        if (Math.random() < interactionProbability) {
          // Interaction occurs
          interactionCount++;
          
          // Exchange knowledge (positive charge particles share more)
          const p1Share = p1.charge > 0 ? 0.1 : 0.05;
          const p2Share = p2.charge > 0 ? 0.1 : 0.05;
          
          const p1Knowledge = p1.knowledge;
          const p2Knowledge = p2.knowledge;
          
          p1.knowledge = Math.min(1, p1.knowledge + p2Knowledge * p2Share);
          p2.knowledge = Math.min(1, p2.knowledge + p1Knowledge * p1Share);
          
          // Knowledge affects size (growth)
          p1.size = 3 + (p1.knowledge * 5);
          p2.size = 3 + (p2.knowledge * 5);
          
          // Update interactions counters
          if (p1.interactions !== undefined) p1.interactions++;
          if (p2.interactions !== undefined) p2.interactions++;
          if (p1.interactionCount !== undefined) p1.interactionCount++;
          if (p2.interactionCount !== undefined) p2.interactionCount++;
        }
      }
    }
  }
  
  // Occasionally create new particles 
  if (Math.random() < 0.03 && particles.length < 100) {
    createParticle();
  }
  
  // Render to the actual canvas
  renderSimulation();
}

// Render the simulation to the canvas with enhanced network effect
function renderSimulation() {
  const simulationCanvas = document.getElementById('simulation-canvas') as HTMLCanvasElement;
  if (!simulationCanvas || !ctx) return;
  
  // Get the actual canvas context
  const actualCtx = simulationCanvas.getContext('2d');
  if (!actualCtx) return;
  
  // Adjust canvas size
  if (simulationCanvas.width !== window.innerWidth || simulationCanvas.height !== window.innerHeight) {
    simulationCanvas.width = window.innerWidth;
    simulationCanvas.height = window.innerHeight;
  }
  
  // Clear canvas with semi-transparent black for trail effect
  actualCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  actualCtx.fillRect(0, 0, simulationCanvas.width, simulationCanvas.height);
  
  // Draw network connections first (so they appear behind particles)
  for (const particle of particles) {
    // Draw connection lines between ALL particles within threshold distance
    for (const otherParticle of particles) {
      if (particle.id !== otherParticle.id) {
        const dx = otherParticle.x - particle.x;
        const dy = otherParticle.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Draw connection line if close enough (increased from 100 to 150 for more connections)
        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.5;
          
          // Choose connection color based on particle charges
          let connectionColor;
          if (particle.charge > 0 && otherParticle.charge > 0) {
            connectionColor = `rgba(180, 220, 255, ${opacity})`; // Blue for positive-positive
          } else if (particle.charge < 0 && otherParticle.charge < 0) {
            connectionColor = `rgba(255, 180, 180, ${opacity})`; // Red for negative-negative
          } else if (Math.abs(particle.charge) < 0.3 && Math.abs(otherParticle.charge) < 0.3) {
            connectionColor = `rgba(180, 255, 180, ${opacity})`; // Green for neutral-neutral
          } else {
            connectionColor = `rgba(220, 220, 255, ${opacity})`; // White-ish for mixed
          }
          
          actualCtx.beginPath();
          actualCtx.moveTo(particle.x, particle.y);
          actualCtx.lineTo(otherParticle.x, otherParticle.y);
          actualCtx.strokeStyle = connectionColor;
          actualCtx.lineWidth = opacity * 2; // Make lines thicker based on proximity
          actualCtx.stroke();
        }
      }
    }
  }
  
  // Now draw particles
  for (const particle of particles) {
    // Draw the particle glow
    const gradient = actualCtx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'transparent');
    
    actualCtx.beginPath();
    actualCtx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    actualCtx.fillStyle = gradient;
    actualCtx.fill();
    
    // Draw the particle core
    actualCtx.beginPath();
    actualCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    actualCtx.fillStyle = particle.color;
    actualCtx.fill();
    
    // Draw knowledge glow for particles with knowledge
    if (particle.knowledge > 0.2) {
      actualCtx.beginPath();
      actualCtx.arc(particle.x, particle.y, particle.size + 5, 0, Math.PI * 2);
      actualCtx.fillStyle = `rgba(255, 255, 255, ${particle.knowledge * 0.3})`;
      actualCtx.fill();
    }
  }
}

// Start the simulation
export function startMotherSimulation(): void {
  if (isRunning) return;
  
  console.log("Starting mother simulation");
  isRunning = true;
  
  // Initialize
  initializeMotherSimulation();
  
  // Start update loop
  simulationInterval = window.setInterval(updateSimulation, 1000 / 30); // 30 FPS
}

// Stop the simulation
export function stopMotherSimulation(): void {
  if (!isRunning) return;
  
  console.log("Stopping mother simulation");
  isRunning = false;
  
  // Clear interval
  if (simulationInterval !== null) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

// Check if the simulation is running
export function isMotherSimulationRunning(): boolean {
  return isRunning;
}

// Get simulation metrics
export function getSimulationStats(): {
  particleCount: number;
  interactionCount: number;
  knowledgeAverage: number;
} {
  let totalKnowledge = 0;
  
  for (const particle of particles) {
    totalKnowledge += particle.knowledge;
  }
  
  return {
    particleCount: particles.length,
    interactionCount,
    knowledgeAverage: particles.length > 0 ? totalKnowledge / particles.length : 0
  };
}

// Export the particles array for other components to use
export function getParticles(): Particle[] {
  return [...particles];
}
