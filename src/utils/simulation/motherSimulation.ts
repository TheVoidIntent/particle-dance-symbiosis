
/**
 * Mother Simulation - The core simulation engine that runs in the background
 */

// Simulation state
let isRunning = false;
let simulationInterval: number | null = null;
let particleCount = 0;
let interactionCount = 0;

// Simple particle interface
interface Particle {
  id: number;
  x: number;
  y: number;
  charge: number; // -1 to 1 (negative to positive)
  intent: number; // 0 to 1 (low to high intent to interact)
  knowledge: number; // 0 to 1 (amount of information gathered)
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

// Simulation data
const particles: Particle[] = [];
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Initialize the simulation
function initSimulation() {
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
    }
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

// Render the simulation to the canvas
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
  
  // Clear canvas
  actualCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  actualCtx.fillRect(0, 0, simulationCanvas.width, simulationCanvas.height);
  
  // Draw particles
  for (const particle of particles) {
    actualCtx.beginPath();
    actualCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    actualCtx.fillStyle = particle.color;
    actualCtx.fill();
    
    // Draw knowledge glow
    if (particle.knowledge > 0.2) {
      actualCtx.beginPath();
      actualCtx.arc(particle.x, particle.y, particle.size + 5, 0, Math.PI * 2);
      actualCtx.fillStyle = `rgba(255, 255, 255, ${particle.knowledge * 0.3})`;
      actualCtx.fill();
    }
    
    // Draw connection lines between interacting particles
    for (const otherParticle of particles) {
      if (particle.id !== otherParticle.id) {
        const dx = otherParticle.x - particle.x;
        const dy = otherParticle.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Draw connection line if close enough
        if (distance < 100) {
          const opacity = (1 - distance / 100) * 0.5;
          actualCtx.beginPath();
          actualCtx.moveTo(particle.x, particle.y);
          actualCtx.lineTo(otherParticle.x, otherParticle.y);
          actualCtx.strokeStyle = `rgba(200, 200, 255, ${opacity})`;
          actualCtx.lineWidth = 1;
          actualCtx.stroke();
        }
      }
    }
  }
}

// Start the simulation
export function startMotherSimulation(): void {
  if (isRunning) return;
  
  console.log("Starting mother simulation");
  isRunning = true;
  
  // Initialize
  initSimulation();
  
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
export function getSimulationMetrics(): {
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
