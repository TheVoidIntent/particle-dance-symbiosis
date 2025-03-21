
// Render utilities for the universal simulation

import { Particle } from './particleUtils';

// Render particles on a canvas
export function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dimensions: { width: number; height: number },
  viewMode: '2d' | '3d',
  renderClusters: boolean = true
): void {
  // Clear canvas
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  
  // Depth sorting for 3D mode
  let sortedParticles = [...particles];
  if (viewMode === '3d') {
    sortedParticles.sort((a, b) => a.z - b.z);
  }
  
  // Find clusters for visualization
  const clusters = new Map<number, Particle[]>();
  if (renderClusters) {
    sortedParticles.forEach(particle => {
      if (particle.clusterAffiliation !== -1) {
        if (!clusters.has(particle.clusterAffiliation)) {
          clusters.set(particle.clusterAffiliation, []);
        }
        clusters.get(particle.clusterAffiliation)?.push(particle);
      }
    });
  }
  
  // Render cluster connections first (behind particles)
  if (renderClusters) {
    clusters.forEach((clusterParticles, clusterId) => {
      if (clusterParticles.length > 1) {
        // Calculate cluster center
        let centerX = 0, centerY = 0;
        clusterParticles.forEach(p => {
          centerX += p.x;
          centerY += p.y;
        });
        centerX /= clusterParticles.length;
        centerY /= clusterParticles.length;
        
        // Draw lines connecting particles to center
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        
        clusterParticles.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
        });
        
        // Optional: Draw cluster boundary
        if (clusterParticles.length > 3) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
          ctx.beginPath();
          
          // Find the farthest particle from center to determine radius
          let maxDist = 0;
          clusterParticles.forEach(p => {
            const dist = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
            maxDist = Math.max(maxDist, dist);
          });
          
          ctx.arc(centerX, centerY, maxDist * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });
  }
  
  // Render memory connections (for particles with strong memories)
  sortedParticles.forEach(particle => {
    if (particle.interactionMemory && particle.interactionMemory.size > 0) {
      // Get strongest memory
      let strongestId = -1;
      let strongestStrength = 0;
      
      particle.interactionMemory.forEach((strength, id) => {
        if (strength > strongestStrength) {
          strongestId = id;
          strongestStrength = strength;
        }
      });
      
      // Only draw connection if strong enough
      if (strongestStrength > 0.5) {
        const partner = sortedParticles.find(p => p.id === strongestId);
        if (partner) {
          // Draw connection line with strength-based opacity
          const opacity = Math.min(0.2, strongestStrength * 0.2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(partner.x, partner.y);
          ctx.stroke();
        }
      }
    }
  });
  
  // Render each particle
  sortedParticles.forEach(particle => {
    renderParticle(ctx, particle, viewMode);
  });
  
  // Render anomaly indicators (if included in particles)
  const anomalyParticles = sortedParticles.filter(p => p.type === 'adaptive' && p.adaptiveScore > 5);
  if (anomalyParticles.length > 0) {
    // Draw attention ring around highly adapted particles
    anomalyParticles.forEach(p => {
      const pulseSize = 10 + Math.sin(Date.now() / 200) * 3;
      ctx.strokeStyle = 'rgba(255, 255, 150, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

// Render a single particle
function renderParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  viewMode: '2d' | '3d'
): void {
  const { x, y, z, size, color, type, knowledge, complexity } = particle;
  
  // Calculate depth-based scaling for 3D mode
  let scale = 1;
  let depthOpacity = 1;
  
  if (viewMode === '3d') {
    scale = 0.5 + (z / 10) * 0.8; // Smaller in back, larger in front
    depthOpacity = 0.4 + (z / 10) * 0.6; // More transparent in back
  }
  
  // Parse the base color
  let baseColor = color;
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    let a = parseFloat(rgbaMatch[4]) * depthOpacity;
    
    // Knowledge affects opacity
    a = Math.min(0.95, a + knowledge * 0.05);
    
    // Type-specific rendering
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    
    if (type === 'standard') {
      // Simple circle for standard particles
      ctx.beginPath();
      ctx.arc(x, y, size * scale, 0, Math.PI * 2);
      ctx.fill();
    } 
    else if (type === 'high-energy') {
      // Star shape for high energy
      const outerRadius = size * scale;
      const innerRadius = outerRadius * 0.5;
      const spikes = 5;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i / (spikes * 2)) * Math.PI * 2;
        const pX = x + Math.cos(angle) * radius;
        const pY = y + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(pX, pY);
        } else {
          ctx.lineTo(pX, pY);
        }
      }
      ctx.closePath();
      ctx.fill();
      
      // Glow effect
      const glow = ctx.createRadialGradient(x, y, 0, x, y, outerRadius * 1.5);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * 0.3})`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } 
    else if (type === 'quantum') {
      // Phase-influenced quantum particle
      const phase = particle.phase || 0;
      
      // Size pulsates based on phase
      const pulseSize = size * (1 + 0.3 * Math.sin(phase)) * scale;
      
      // Draw quantum particle with phase-based visual effect
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Quantum blur effect
      const blurSize = pulseSize * 1.5;
      const blur = ctx.createRadialGradient(x, y, 0, x, y, blurSize);
      blur.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * 0.2})`);
      blur.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = blur;
      ctx.beginPath();
      ctx.arc(x, y, blurSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Quantum position uncertainty visual effect
      if (Math.random() < 0.3) {
        const uncertaintyOffset = (Math.random() - 0.5) * 5;
        const uncertaintySize = pulseSize * 0.5;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.2})`;
        ctx.beginPath();
        ctx.arc(x + uncertaintyOffset, y + uncertaintyOffset, uncertaintySize, 0, Math.PI * 2);
        ctx.fill();
      }
    } 
    else if (type === 'composite') {
      // Complexity-based composite rendering
      const baseSize = size * scale;
      const segments = Math.min(8, Math.max(3, Math.round(complexity)));
      
      // Outer glow based on complexity
      const glowSize = baseSize * (1 + complexity * 0.1);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * 0.3})`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw composite with knowledge-enhancing layers
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y, baseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw inner rings based on complexity
      for (let i = 1; i <= Math.min(3, Math.floor(complexity / 2)); i++) {
        const ringSize = baseSize * (0.8 - i * 0.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.7, 0.2 + knowledge * 0.05)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, ringSize, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    else if (type === 'adaptive') {
      // New adaptive particle rendering
      const adaptiveScore = particle.adaptiveScore || 0;
      const baseSize = size * scale;
      
      // Draw base shape
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y, baseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw intelligence indicators based on adaptive score
      if (adaptiveScore > 0) {
        // More patterns emerge as adaptive score increases
        const indicatorCount = Math.min(6, Math.max(1, Math.floor(adaptiveScore)));
        const indicatorSize = baseSize * 0.3;
        
        for (let i = 0; i < indicatorCount; i++) {
          const angle = (i / indicatorCount) * Math.PI * 2;
          const indicatorX = x + Math.cos(angle) * baseSize * 0.6;
          const indicatorY = y + Math.sin(angle) * baseSize * 0.6;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(indicatorX, indicatorY, indicatorSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Adaptive glow that pulses
        const pulseRate = Date.now() / 1000 * (1 + adaptiveScore * 0.1);
        const pulseIntensity = (Math.sin(pulseRate) + 1) / 2 * 0.3;
        
        const adaptiveGlow = ctx.createRadialGradient(x, y, 0, x, y, baseSize * 1.5);
        adaptiveGlow.addColorStop(0, `rgba(255, 150, 255, ${pulseIntensity})`);
        adaptiveGlow.addColorStop(1, `rgba(255, 150, 255, 0)`);
        
        ctx.fillStyle = adaptiveGlow;
        ctx.beginPath();
        ctx.arc(x, y, baseSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    else {
      // Fallback for any other types
      ctx.beginPath();
      ctx.arc(x, y, size * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add knowledge indicator (subtle glow for knowledgeable particles)
    if (knowledge > 2) {
      const knowledgeGlow = ctx.createRadialGradient(x, y, 0, x, y, size * scale * 1.5);
      knowledgeGlow.addColorStop(0, `rgba(255, 255, 255, ${0.1 * Math.min(1, knowledge / 10)})`);
      knowledgeGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = knowledgeGlow;
      ctx.beginPath();
      ctx.arc(x, y, size * scale * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Render intent field visualization
export function renderIntentField(
  ctx: CanvasRenderingContext2D,
  intentField: number[][][],
  dimensions: { width: number; height: number },
  layer: number = 0,
  opacity: number = 0.1
): void {
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) return;
  
  const cellWidth = dimensions.width / intentField[0][0].length;
  const cellHeight = dimensions.height / intentField[0].length;
  
  // Ensure layer is valid
  const safeLayer = Math.min(intentField.length - 1, Math.max(0, layer));
  
  // Draw each cell
  for (let y = 0; y < intentField[safeLayer].length; y++) {
    for (let x = 0; x < intentField[safeLayer][y].length; x++) {
      const value = intentField[safeLayer][y][x];
      
      // Map value (-1 to 1) to color
      let color;
      if (value > 0) {
        // Positive: green gradient
        const intensity = Math.floor(value * 255);
        color = `rgba(0, ${intensity}, 100, ${opacity})`;
      } else if (value < 0) {
        // Negative: red gradient
        const intensity = Math.floor(-value * 255);
        color = `rgba(${intensity}, 0, 50, ${opacity})`;
      } else {
        // Neutral: gray
        color = `rgba(100, 100, 100, ${opacity / 2})`;
      }
      
      // Draw cell
      ctx.fillStyle = color;
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      
      // Draw cell border
      ctx.strokeStyle = `rgba(0, 0, 0, ${opacity / 2})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }
}

// Render a heatmap of particle density
export function renderParticleDensity(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dimensions: { width: number; height: number },
  resolution: number = 20, // Size of each density cell
  opacity: number = 0.2
): void {
  const gridWidth = Math.ceil(dimensions.width / resolution);
  const gridHeight = Math.ceil(dimensions.height / resolution);
  
  // Initialize density grid
  const densityGrid: number[][] = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill(0));
  
  // Count particles in each grid cell
  particles.forEach(particle => {
    const gridX = Math.floor(particle.x / resolution);
    const gridY = Math.floor(particle.y / resolution);
    
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
      densityGrid[gridY][gridX]++;
    }
  });
  
  // Find maximum density for normalization
  let maxDensity = 1; // Avoid division by zero
  densityGrid.forEach(row => {
    row.forEach(density => {
      maxDensity = Math.max(maxDensity, density);
    });
  });
  
  // Draw density cells
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const density = densityGrid[y][x];
      if (density > 0) {
        // Normalize density to 0-1 range
        const normalizedDensity = density / maxDensity;
        
        // Create color gradient based on density
        let color;
        if (normalizedDensity < 0.3) {
          // Low density: blue
          color = `rgba(0, 0, 255, ${normalizedDensity * opacity})`;
        } else if (normalizedDensity < 0.7) {
          // Medium density: purple
          color = `rgba(128, 0, 255, ${normalizedDensity * opacity})`;
        } else {
          // High density: red
          color = `rgba(255, 0, 0, ${normalizedDensity * opacity})`;
        }
        
        // Draw density cell
        ctx.fillStyle = color;
        ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
      }
    }
  }
}
