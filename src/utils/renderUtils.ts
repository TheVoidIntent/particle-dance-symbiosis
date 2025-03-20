import { Particle } from './particleUtils';

/**
 * Renders particles on the canvas
 */
export function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dimensions: { width: number; height: number },
  viewMode: '2d' | '3d'
): void {
  // Clear canvas
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  
  // Draw each particle
  particles.forEach(particle => {
    const scaleFactor = viewMode === '3d' ? 5 / (particle.z + 5) : 1;
    const drawSize = particle.size * scaleFactor;
    const drawX = particle.x;
    const drawY = particle.y;
    
    // Draw the particle based on its type
    if (particle.type === 'standard') {
      drawStandardParticle(ctx, drawX, drawY, drawSize, particle);
    } else if (particle.type === 'high-energy') {
      drawHighEnergyParticle(ctx, drawX, drawY, drawSize, particle);
    } else if (particle.type === 'quantum') {
      drawQuantumParticle(ctx, drawX, drawY, drawSize, particle);
    } else if (particle.type === 'composite') {
      drawCompositeParticle(ctx, drawX, drawY, drawSize, particle);
    }
  });
}

/**
 * Draws a standard particle
 */
function drawStandardParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  particle: Particle
): void {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
  
  // Optional: Glow effect based on knowledge
  if (particle.knowledge > 1) {
    ctx.beginPath();
    ctx.arc(x, y, size + particle.knowledge * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.3, particle.knowledge * 0.01)})`;
    ctx.fill();
  }
}

/**
 * Draws a high-energy particle with an energy halo
 */
function drawHighEnergyParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  particle: Particle
): void {
  // Energy halo
  const glowRadius = size * (1 + particle.energy * 0.5);
  const gradient = ctx.createRadialGradient(x, y, size, x, y, glowRadius);
  gradient.addColorStop(0, particle.color);
  gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  
  ctx.beginPath();
  ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Core particle
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
  
  // Knowledge effect
  if (particle.knowledge > 1) {
    ctx.beginPath();
    ctx.arc(x, y, size + particle.knowledge * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.3, particle.knowledge * 0.01)})`;
    ctx.fill();
  }
}

/**
 * Draws a quantum particle with a flickering, blurry appearance
 */
function drawQuantumParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  particle: Particle
): void {
  // Quantum particles have a blurry, uncertain appearance
  const blurFactor = 0.7 + Math.random() * 0.3;
  const flickerSize = size * (0.8 + Math.random() * 0.4);
  
  // Create a slight blur effect
  ctx.shadowBlur = 5;
  ctx.shadowColor = particle.color;
  
  // Flickering core
  ctx.beginPath();
  ctx.arc(x, y, flickerSize, 0, Math.PI * 2);
  
  // Vary the opacity slightly
  const baseColor = particle.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/, 
    (match, r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${parseFloat(a) * blurFactor})`);
  
  ctx.fillStyle = baseColor;
  ctx.fill();
  
  // Quantum wave effect (probability cloud)
  ctx.beginPath();
  ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = particle.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/, 
    (match, r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${Math.min(0.2, parseFloat(a) * 0.3)})`);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowBlur = 0;
  
  // Knowledge effect (more subtle for quantum particles)
  if (particle.knowledge > 2) {
    ctx.beginPath();
    ctx.arc(x, y, size + particle.knowledge * 0.03, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.15, particle.knowledge * 0.005)})`;
    ctx.fill();
  }
}

/**
 * Draws a composite particle with a complex structure
 */
function drawCompositeParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  particle: Particle
): void {
  // Core glow
  const coreSize = size * 0.6;
  const outerSize = size * (1 + Math.min(0.5, particle.complexity * 0.05));
  
  // Outer aura representing complexity
  const gradient = ctx.createRadialGradient(x, y, coreSize, x, y, outerSize);
  gradient.addColorStop(0, particle.color);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.beginPath();
  ctx.arc(x, y, outerSize, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Inner core
  ctx.beginPath();
  ctx.arc(x, y, coreSize, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
  
  // Orbiting sub-particles representing connections
  const numOrbits = Math.min(5, Math.floor(particle.connections));
  for (let i = 0; i < numOrbits; i++) {
    const angle = (Math.PI * 2 * i / numOrbits) + (Date.now() * 0.001 * (i + 1) * 0.2);
    const orbitDistance = size * (0.7 + i * 0.2);
    const orbitX = x + Math.cos(angle) * orbitDistance;
    const orbitY = y + Math.sin(angle) * orbitDistance;
    const orbitSize = size * 0.2;
    
    ctx.beginPath();
    ctx.arc(orbitX, orbitY, orbitSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
    ctx.fill();
  }
  
  // Knowledge effect
  if (particle.knowledge > 5) {
    ctx.beginPath();
    ctx.arc(x, y, size + particle.knowledge * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.2, particle.knowledge * 0.005)})`;
    ctx.fill();
  }
  
  // Optional: draw complexity value
  if (particle.complexity > 3) {
    ctx.font = `${Math.floor(size * 0.8)}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.floor(particle.complexity).toString(), x, y);
  }
}
