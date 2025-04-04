// Export the Particle interface for use in other modules
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: 'positive' | 'negative' | 'neutral';
  size: number;
  color: string;
  knowledge: number;
  intent: number;
  age: number;
  type: string;
  interactions?: number;
  z?: number;
  radius?: number;
}

// Simulation state
let particles: Particle[] = [];
let isRunning = false;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
const maxParticles = 150;
const fieldSize = 500;
let animationFrameId: number | null = null;
let intentField: number[][] = [];
let interactionsCount = 0;
let frameCount = 0;
let emergenceIndex = 0;
let intentFieldComplexity = 0;
let lastAudioUpdate = 0;
let intentWaveValues: number[] = [];

// Create and initialize a particle with random properties
function createParticle(): Particle {
  // Determine the charge based on intent field fluctuations
  const fluctuationValue = Math.random() - 0.5;
  let charge: 'positive' | 'negative' | 'neutral';
  
  if (fluctuationValue > 0.2) {
    charge = 'positive';
  } else if (fluctuationValue < -0.2) {
    charge = 'negative';
  } else {
    charge = 'neutral';
  }
  
  // Determine color based on charge
  const color = 
    charge === 'positive' ? 'rgba(64, 196, 255, 0.8)' : 
    charge === 'negative' ? 'rgba(255, 64, 129, 0.8)' :
    'rgba(241, 196, 15, 0.8)';
  
  // Set initial velocity based on charge (more active particles have higher values)
  const speedFactor = 
    charge === 'positive' ? 0.4 : 
    charge === 'negative' ? 0.2 :
    0.3;
  
  // Create the particle object with properties determined by charge and intent
  return {
    id: Math.random().toString(36).substring(2, 9),
    x: Math.random() * fieldSize,
    y: Math.random() * fieldSize,
    vx: (Math.random() - 0.5) * speedFactor,
    vy: (Math.random() - 0.5) * speedFactor,
    charge: charge,
    size: 3 + Math.random() * 2,
    color: color,
    knowledge: 0.1 + Math.random() * 0.2,
    intent: 
      charge === 'positive' ? 0.7 + Math.random() * 0.3 : 
      charge === 'negative' ? 0.1 + Math.random() * 0.2 :
      0.4 + Math.random() * 0.3,
    age: 0,
    type: 'standard',
    interactions: 0
  };
}

// Initialize the intent field with random fluctuations
function initializeIntentField() {
  intentField = Array(Math.ceil(fieldSize / 10))
    .fill(0)
    .map(() => Array(Math.ceil(fieldSize / 10)).fill(0));
  
  // Create some initial random fluctuations in the field
  for (let i = 0; i < intentField.length; i++) {
    for (let j = 0; j < intentField[i].length; j++) {
      intentField[i][j] = Math.random() * 0.2 - 0.1;
    }
  }
  
  // Initialize the intent wave values array
  intentWaveValues = Array(10).fill(0);
}

// Initialize the simulation
export function initializeMotherSimulation(canvasElement?: HTMLCanvasElement) {
  if (canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
  } else if (typeof document !== 'undefined') {
    canvas = document.getElementById('simulation-canvas') as HTMLCanvasElement;
    ctx = canvas?.getContext('2d');
  }
  
  if (canvas) {
    canvas.width = window.innerWidth || fieldSize;
    canvas.height = window.innerHeight || fieldSize;
  }
  
  // Initialize with some particles
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push(createParticle());
  }
  
  // Initialize the intent field
  initializeIntentField();
  
  console.info("Mother simulation initialized with", particles.length, "particles");
}

// Add a new particle to the simulation if below maximum
function addParticle() {
  if (particles.length < maxParticles) {
    particles.push(createParticle());
  }
}

// Update a single particle's position and properties
function updateParticle(particle: Particle) {
  // Update position based on velocity
  particle.x += particle.vx;
  particle.y += particle.vy;
  
  // Wrap around screen boundaries
  if (particle.x < 0) particle.x = canvas?.width || fieldSize;
  if (particle.x > (canvas?.width || fieldSize)) particle.x = 0;
  if (particle.y < 0) particle.y = canvas?.height || fieldSize;
  if (particle.y > (canvas?.height || fieldSize)) particle.y = 0;
  
  // Field influence - get the field cell this particle is in
  const fieldX = Math.floor(particle.x / 10);
  const fieldY = Math.floor(particle.y / 10);
  
  // Apply field influence if within bounds
  if (fieldX >= 0 && fieldX < intentField.length && fieldY >= 0 && fieldY < intentField[0].length) {
    // Field influences velocity slightly
    particle.vx += intentField[fieldX][fieldY] * 0.01;
    particle.vy += intentField[fieldX][fieldY] * 0.01;
    
    // Limit maximum velocity
    const maxSpeed = 0.7;
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (speed > maxSpeed) {
      particle.vx = (particle.vx / speed) * maxSpeed;
      particle.vy = (particle.vy / speed) * maxSpeed;
    }
    
    // Particle also affects the field slightly based on its charge and intent
    const fieldInfluence = 
      particle.charge === 'positive' ? 0.005 : 
      particle.charge === 'negative' ? -0.005 :
      0.002;
    intentField[fieldX][fieldY] += fieldInfluence * particle.intent;
  }
  
  // Increase age
  particle.age += 1;
  
  // Check for interactions with other particles
  particles.forEach(other => {
    if (other.id !== particle.id) {
      const dx = other.x - particle.x;
      const dy = other.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If particles are close enough, they interact
      if (distance < 15) {
        // Count this interaction
        interactionsCount++;
        
        // Update individual particle interaction count
        if (particle.interactions !== undefined) {
          particle.interactions++;
        } else {
          particle.interactions = 1;
        }
        
        // Knowledge/information exchange based on particle properties
        const knowledgeTransferRate = 
          particle.charge === 'positive' ? 0.05 : 
          particle.charge === 'negative' ? 0.01 :
          0.03;
        
        // Bidirectional knowledge transfer
        if (particle.knowledge > other.knowledge) {
          const transferAmount = (particle.knowledge - other.knowledge) * knowledgeTransferRate;
          particle.knowledge -= transferAmount * 0.5;
          other.knowledge += transferAmount;
        } else {
          const transferAmount = (other.knowledge - particle.knowledge) * knowledgeTransferRate;
          other.knowledge -= transferAmount * 0.5;
          particle.knowledge += transferAmount;
        }
        
        // Slight repulsion/attraction based on charges
        const forceFactor = 
          (particle.charge === 'positive' && other.charge === 'positive') ? -0.002 :
          (particle.charge === 'negative' && other.charge === 'negative') ? -0.003 :
          (particle.charge === 'positive' && other.charge === 'negative') ? 0.002 :
          0.001;
        
        particle.vx += dx * forceFactor;
        particle.vy += dy * forceFactor;
      }
    }
  });
}

// Update the intent field
function updateIntentField() {
  // Field naturally decays/stabilizes slightly each frame
  for (let i = 0; i < intentField.length; i++) {
    for (let j = 0; j < intentField[i].length; j++) {
      // Decay factor - field tends toward equilibrium
      intentField[i][j] *= 0.99;
      
      // Occasionally add random fluctuations
      if (Math.random() < 0.01) {
        intentField[i][j] += (Math.random() - 0.5) * 0.05;
      }
    }
  }
  
  // Calculate field complexity (a simple measure based on gradients)
  let complexitySum = 0;
  let gradientCount = 0;
  
  for (let i = 1; i < intentField.length - 1; i++) {
    for (let j = 1; j < intentField[i].length - 1; j++) {
      const gradX = Math.abs(intentField[i+1][j] - intentField[i-1][j]);
      const gradY = Math.abs(intentField[i][j+1] - intentField[i][j-1]);
      complexitySum += gradX + gradY;
      gradientCount += 2;
    }
  }
  
  intentFieldComplexity = gradientCount > 0 ? complexitySum / gradientCount : 0;
  
  // Update intent wave values for audio visualization
  if (frameCount % 10 === 0) {
    // Shift values to make room for new one
    intentWaveValues.shift();
    // Add new value based on current field complexity
    intentWaveValues.push(intentFieldComplexity * 10);
  }
}

// Calculate emergence index (a measure of system complexity)
function calculateEmergenceIndex() {
  // Simple measure based on particle diversity and interaction rate
  const knowledgeVariance = calculateVariance(particles.map(p => p.knowledge));
  const intentVariance = calculateVariance(particles.map(p => p.intent));
  
  // More variance and more interactions indicate higher emergence
  emergenceIndex = (knowledgeVariance + intentVariance) * interactionsCount / 1000;
  
  // Limit to a reasonable range
  emergenceIndex = Math.min(1, emergenceIndex);
}

// Helper function to calculate variance of an array
function calculateVariance(array: number[]): number {
  if (array.length === 0) return 0;
  
  const mean = array.reduce((sum, val) => sum + val, 0) / array.length;
  const squareDiffs = array.map(val => {
    const diff = val - mean;
    return diff * diff;
  });
  
  return squareDiffs.reduce((sum, val) => sum + val, 0) / array.length;
}

// Calculate average knowledge of all particles
function calculateAverageKnowledge(): number {
  if (particles.length === 0) return 0;
  return particles.reduce((sum, p) => sum + p.knowledge, 0) / particles.length;
}

// Draw connections between interacting particles
function drawConnections() {
  if (!ctx) return;
  
  particles.forEach((particle, i) => {
    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = other.x - particle.x;
      const dy = other.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only draw connections for particles that are close enough
      if (distance < 80) {
        // Opacity based on distance (closer = more opaque)
        const opacity = Math.max(0, 0.3 - distance / 300);
        
        // Color based on particle charges
        let connectionColor;
        if (particle.charge === other.charge) {
          // Same charge: blue for positive, red for negative, yellow for neutral
          connectionColor = particle.charge === 'positive' ? 'rgba(64, 196, 255, ' + opacity + ')' :
                           particle.charge === 'negative' ? 'rgba(255, 64, 129, ' + opacity + ')' :
                           'rgba(241, 196, 15, ' + opacity + ')';
        } else {
          // Different charges: purple
          connectionColor = 'rgba(186, 104, 200, ' + opacity + ')';
        }
        
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });
}

// Draw intent field visualization
function drawIntentField() {
  if (!ctx || !canvas) return;
  
  // Draw intent field as subtle background gradient
  for (let i = 0; i < intentField.length; i++) {
    for (let j = 0; j < intentField[0].length; j++) {
      const fieldValue = intentField[i][j];
      // Only draw significant field values
      if (Math.abs(fieldValue) > 0.05) {
        const x = i * 10;
        const y = j * 10;
        
        // Field color based on value
        const fieldColor = 
          fieldValue > 0 ? `rgba(64, 196, 255, ${Math.min(0.1, Math.abs(fieldValue))})` :
          fieldValue < 0 ? `rgba(255, 64, 129, ${Math.min(0.1, Math.abs(fieldValue))})` :
          'rgba(241, 196, 15, 0.05)';
        
        ctx.fillStyle = fieldColor;
        ctx.fillRect(x, y, 10, 10);
      }
    }
  }
}

// Draw intent wave visualization
function drawIntentWaves() {
  if (!ctx || !canvas) return;
  
  const height = canvas.height;
  const width = canvas.width;
  
  // Draw the intent wave values at the bottom of the screen
  ctx.beginPath();
  
  // Start at the bottom-left
  ctx.moveTo(0, height - 30);
  
  // Draw the wave
  const segmentWidth = width / (intentWaveValues.length - 1);
  intentWaveValues.forEach((value, index) => {
    // Map the value to a height (higher value = higher wave)
    const waveHeight = Math.min(100, value * 50);
    ctx.lineTo(index * segmentWidth, height - 30 - waveHeight);
  });
  
  // Close the path to the bottom-right
  ctx.lineTo(width, height - 30);
  ctx.lineTo(0, height - 30);
  
  // Fill with a gradient
  const gradient = ctx.createLinearGradient(0, height - 130, 0, height - 30);
  gradient.addColorStop(0, 'rgba(64, 196, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(64, 196, 255, 0.1)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw a line on top of the wave
  ctx.beginPath();
  ctx.moveTo(0, height - 30);
  intentWaveValues.forEach((value, index) => {
    const waveHeight = Math.min(100, value * 50);
    ctx.lineTo(index * segmentWidth, height - 30 - waveHeight);
  });
  ctx.strokeStyle = 'rgba(64, 196, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw metrics text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '12px Arial';
  ctx.fillText(`Intent Wave Intensity: ${Math.round(intentWaveValues[intentWaveValues.length - 1] * 100)}`, 10, height - 40);
  ctx.fillText(`Complexity: ${Math.round(intentFieldComplexity * 100)}`, width - 150, height - 40);
}

// Main animation/simulation loop
function animateMotherSimulation() {
  if (!isRunning) return;
  
  // Clear the canvas
  if (ctx && canvas) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw intent field as background
    drawIntentField();
    
    // Draw connections between particles
    drawConnections();
    
    // Update and draw particles
    particles.forEach(particle => {
      updateParticle(particle);
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Optional - draw a glow effect for particles with high knowledge
      if (particle.knowledge > 0.5) {
        const glowSize = particle.size * (1 + particle.knowledge);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, particle.size,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    });
    
    // Draw the intent wave visualization
    drawIntentWaves();
  }
  
  // Occasionally add new particles (about 1 every 2 seconds)
  if (Math.random() < 0.01 && particles.length < maxParticles) {
    addParticle();
  }
  
  // Update intent field
  updateIntentField();
  
  // Increment frame counter
  frameCount++;
  
  // Calculate emergence metrics occasionally
  if (frameCount % 30 === 0) {
    calculateEmergenceIndex();
  }
  
  // Schedule next frame
  animationFrameId = requestAnimationFrame(animateMotherSimulation);
}

// Start the simulation
export function startMotherSimulation(canvasElement?: HTMLCanvasElement) {
  if (!isRunning) {
    console.info("Starting mother simulation");
    initializeMotherSimulation(canvasElement);
    isRunning = true;
    animateMotherSimulation();
  }
}

// Stop the simulation
export function stopMotherSimulation() {
  isRunning = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Check if simulation is running
export function isMotherSimulationRunning() {
  return isRunning;
}

// Get array of particles (for external use)
export function getParticles() {
  return [...particles]; // Return a copy to avoid external modifications
}

// Get current simulation statistics
export function getSimulationStats() {
  const knowledgeAverage = calculateAverageKnowledge();
  
  return {
    particles: [...particles],
    intentField: [...intentField],
    interactionsCount,
    frameCount,
    emergenceIndex,
    particleCount: particles.length,
    positiveParticles: particles.filter(p => p.charge === 'positive').length,
    negativeParticles: particles.filter(p => p.charge === 'negative').length,
    neutralParticles: particles.filter(p => p.charge === 'neutral').length,
    intentFieldComplexity,
    knowledgeAverage,
    intentWaveValues: [...intentWaveValues]
  };
}

// Get intent wave values for audio visualization
export function getIntentWaveValues() {
  return [...intentWaveValues];
}
