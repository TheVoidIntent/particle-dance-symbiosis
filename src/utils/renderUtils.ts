// Update this file to include the rendering of post-inflation particles with special visual effects
// This is assuming the file already exists with a renderParticles function

export function renderParticles(
  ctx: CanvasRenderingContext2D, 
  particles: any[], 
  dimensions: { width: number; height: number },
  viewMode: '2d' | '3d',
  showDetails: boolean = false
) {
  // Set up rendering context
  ctx.save();
  
  // For each particle, draw a circle
  particles.forEach(particle => {
    const { x, y, z, color, radius, charge, isPostInflation } = particle;
    
    // Skip particles outside the viewport
    if (x < -radius || x > dimensions.width + radius || 
        y < -radius || y > dimensions.height + radius) {
      return;
    }
    
    // Calculate 3D perspective if in 3D mode
    let scale = 1;
    if (viewMode === '3d') {
      // Simple z-based scaling (farther = smaller)
      scale = 1 - (z / 15); // Adjust divisor for perspective strength
    }
    
    // Apply particle's own scale if it exists
    if (particle.scale) {
      scale *= particle.scale;
    }
    
    const scaledRadius = radius * scale;

    // Draw outer glow for post-inflation particles
    if (isPostInflation) {
      const glowColor = color.replace(/[^,]+(?=\))/, '0.3'); // Lower opacity for glow
      const pulseTime = Date.now() * 0.001; // Time-based pulsing
      const pulseScale = 1 + 0.2 * Math.sin(pulseTime * 3); // Pulsing effect
      
      // Draw glow
      ctx.beginPath();
      ctx.arc(x, y, scaledRadius * 2 * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = glowColor;
      ctx.fill();
      
      // Draw aura
      ctx.beginPath();
      ctx.arc(x, y, scaledRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = glowColor.replace(/[^,]+(?=\))/, '0.5');
      ctx.fill();
    }
    
    // Draw main particle body
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    
    // If it's a post-inflation particle, add a pulsating effect
    if (isPostInflation) {
      const now = Date.now() * 0.003;
      const alpha = 0.7 + 0.3 * Math.sin(now); // Pulsating alpha
      ctx.fillStyle = color.replace(/[^,]+(?=\))/, alpha.toString());
    }
    
    ctx.fill();
    
    // Draw particle details if needed
    if (showDetails) {
      // Draw charge indicator
      let chargeSymbol = '';
      switch (charge) {
        case 'positive':
          chargeSymbol = '+';
          ctx.fillStyle = 'white';
          break;
        case 'negative':
          chargeSymbol = '-';
          ctx.fillStyle = 'white';
          break;
        case 'neutral':
          chargeSymbol = '○';
          ctx.fillStyle = 'white';
          break;
      }
      
      if (chargeSymbol && scaledRadius > 3) {
        ctx.font = `${Math.max(8, scaledRadius * 0.8)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(chargeSymbol, x, y);
      }
    }
  });
  
  ctx.restore();
}

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
      
      // Color based on value (positive = blue, negative = red)
      let color;
      if (value > 0) {
        const intensity = Math.min(255, Math.floor(value * 255));
        color = `rgba(0, ${intensity}, 255, ${opacity})`;
      } else {
        const intensity = Math.min(255, Math.floor(-value * 255));
        color = `rgba(255, ${intensity}, 0, ${opacity})`;
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(posX, posY, cellWidth, cellHeight);
    }
  }
  
  ctx.restore();
}

export function renderParticleDensity(
  ctx: CanvasRenderingContext2D,
  particles: any[],
  dimensions: { width: number; height: number },
  resolution: number = 20,
  opacity: number = 0.5
) {
  const gridWidth = Math.ceil(dimensions.width / resolution);
  const gridHeight = Math.ceil(dimensions.height / resolution);
  
  // Create density grid
  const densityGrid: number[][] = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(0));
  
  // Calculate density
  particles.forEach(particle => {
    const gridX = Math.floor(particle.x / resolution);
    const gridY = Math.floor(particle.y / resolution);
    
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
      densityGrid[gridY][gridX] += 1;
    }
  });
  
  // Find max density for normalization
  let maxDensity = 1;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      maxDensity = Math.max(maxDensity, densityGrid[y][x]);
    }
  }
  
  // Render density
  ctx.save();
  
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const density = densityGrid[y][x];
      
      if (density === 0) continue;
      
      const normalizedDensity = density / maxDensity;
      const posX = x * resolution;
      const posY = y * resolution;
      
      // Use a heat map color scheme
      const hue = 240 - normalizedDensity * 240; // 240 (blue) to 0 (red)
      const saturation = 100;
      const lightness = 50;
      
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${normalizedDensity * opacity})`;
      ctx.fillRect(posX, posY, resolution, resolution);
    }
  }
  
  ctx.restore();
}
