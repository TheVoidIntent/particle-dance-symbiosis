
import { Particle } from '@/types/simulation';

/**
 * Renders particles on the canvas
 */
export function renderParticles(
  ctx: CanvasRenderingContext2D, 
  particles: Particle[], 
  dimensions: { width: number; height: number },
  viewMode: '2d' | '3d',
  showDetails: boolean = false
) {
  // Set up rendering context
  ctx.save();
  
  // For each particle, draw a circle with glow effect
  particles.forEach(particle => {
    const { x, y, color, radius, charge } = particle;
    
    // Skip particles outside the viewport (plus a margin)
    if (x < -radius * 2 || x > dimensions.width + radius * 2 || 
        y < -radius * 2 || y > dimensions.height + radius * 2) {
      return;
    }
    
    // Draw glow/aura around particle
    const glowRadius = radius * 2.5;
    const gradient = ctx.createRadialGradient(
      x, y, radius * 0.8,
      x, y, glowRadius
    );
    
    // Get particle color based on charge
    let particleColor = getParticleColorByCharge(charge, color);
    let glowColor = particleColor.replace(/[^,]+(?=\))/, '0.3'); // Lower opacity for glow
    
    gradient.addColorStop(0, particleColor);
    gradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw main particle body
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = particleColor;
    ctx.fill();
  });
  
  ctx.restore();
}

/**
 * Renders intent field as a grid with varying colors
 */
export function renderIntentField(
  ctx: CanvasRenderingContext2D,
  intentField: number[][][],
  dimensions: { width: number; height: number },
  cellSize: number = 10,
  opacity: number = 0.3
) {
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) return;
  
  const fieldWidth = intentField[0][0].length;
  const fieldHeight = intentField[0].length;
  
  const cellWidth = dimensions.width / fieldWidth;
  const cellHeight = dimensions.height / fieldHeight;
  
  // Use the middle z-layer for 2D visualization
  const zLayer = Math.floor(intentField.length / 2);
  
  ctx.save();
  
  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      const value = intentField[zLayer][y][x];
      
      // Skip rendering near-zero values
      if (Math.abs(value) < 0.05) continue;
      
      const posX = x * cellWidth;
      const posY = y * cellHeight;
      
      // Color based on value (positive = teal, negative = red, neutral = purple)
      let color;
      if (value > 0.2) {
        color = `rgba(77, 206, 196, ${opacity * Math.min(1, value * 2)})`; // Teal for positive
      } else if (value < -0.2) {
        color = `rgba(255, 107, 107, ${opacity * Math.min(1, -value * 2)})`; // Red for negative
      } else {
        // Near-neutral values get a purple tint
        const absValue = Math.abs(value);
        color = `rgba(94, 96, 206, ${opacity * Math.min(0.5, absValue * 4)})`; // Purple for neutral
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(posX, posY, cellWidth, cellHeight);
    }
  }
  
  ctx.restore();
}

/**
 * Renders a heatmap of particle density
 */
export function renderParticleDensity(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dimensions: { width: number; height: number },
  gridSize: number = 20,
  opacity: number = 0.5
) {
  ctx.save();
  
  const cols = Math.ceil(dimensions.width / gridSize);
  const rows = Math.ceil(dimensions.height / gridSize);
  
  // Create density grid
  const grid: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  // Calculate density
  particles.forEach(particle => {
    const x = Math.floor(particle.x / gridSize);
    const y = Math.floor(particle.y / gridSize);
    
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      grid[y][x] += 1;
    }
  });
  
  // Find max density for normalization
  let maxDensity = 1;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      maxDensity = Math.max(maxDensity, grid[y][x]);
    }
  }
  
  // Render density grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const density = grid[y][x] / maxDensity;
      if (density > 0) {
        const colorIntensity = Math.min(1, density * 2);
        ctx.fillStyle = `rgba(100, 149, 237, ${colorIntensity * opacity})`;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }
  
  ctx.restore();
}

/**
 * Renders all visualization elements together for a rich visual display
 */
export function renderCombined(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  intentField: number[][][],
  dimensions: { width: number; height: number },
  viewMode: '2d' | '3d'
) {
  // First render a faded version of the intent field
  renderIntentField(ctx, intentField, dimensions, 10, 0.15);
  
  // Draw connections between particles
  drawParticleConnections(ctx, particles, dimensions, 150);
  
  // Finally draw particles on top
  renderParticles(ctx, particles, dimensions, viewMode, true);
}

/**
 * Helper function to draw connections between nearby particles
 */
function drawParticleConnections(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dimensions: { width: number; height: number },
  maxDistance: number = 120
) {
  ctx.save();
  
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      // Calculate distance between particles
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only draw connections if particles are within range
      if (distance < maxDistance) {
        // Calculate opacity based on distance (closer = more opaque)
        const opacity = (1 - distance / maxDistance) * 0.6;
        
        // Determine connection color based on particle charges
        let connectionColor;
        const p1Charge = String(p1.charge);
        const p2Charge = String(p2.charge);
        
        if (p1Charge === p2Charge) {
          // Same charge connections
          if (p1Charge === 'positive') {
            connectionColor = `rgba(77, 206, 196, ${opacity})`; // Teal for positive-positive
          } else if (p1Charge === 'negative') {
            connectionColor = `rgba(255, 107, 107, ${opacity})`; // Red for negative-negative
          } else {
            connectionColor = `rgba(94, 96, 206, ${opacity})`; // Purple for neutral-neutral
          }
        } else {
          // Mixed charge connections
          connectionColor = `rgba(180, 180, 255, ${opacity * 0.7})`; // Light blue for mixed
        }
        
        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = Math.max(0.5, opacity * 1.5); // Thicker lines for closer particles
        ctx.stroke();
        
        // Add small "energy pulse" along the connection line
        if (distance < maxDistance * 0.5 && Math.random() < 0.05) {
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
  
  ctx.restore();
}

/**
 * Helper function to get vibrant colors based on particle charge
 */
function getParticleColorByCharge(charge: any, defaultColor: string = '#FFFFFF'): string {
  if (typeof charge !== 'string') {
    charge = String(charge);
  }
  
  switch (charge) {
    case 'positive':
      return 'rgba(77, 206, 196, 0.9)'; // Vibrant teal
    case 'negative':
      return 'rgba(255, 107, 107, 0.9)'; // Vibrant red
    case 'neutral':
      return 'rgba(94, 96, 206, 0.9)'; // Vibrant purple
    default:
      return defaultColor;
  }
}
