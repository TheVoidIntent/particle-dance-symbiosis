
// Rendering utilities for particle visualization

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
    const { x, y, z, color, radius, charge, type, knowledge, complexity, isPostInflation, scale } = particle;
    
    // Skip particles outside the viewport (plus a small margin)
    if (x < -radius * 2 || x > dimensions.width + radius * 2 || 
        y < -radius * 2 || y > dimensions.height + radius * 2) {
      return;
    }
    
    // Calculate 3D perspective if in 3D mode
    let displayScale = 1;
    if (viewMode === '3d') {
      // Simple z-based scaling (farther = smaller)
      displayScale = 1 - (z / 15); // Adjust divisor for perspective strength
    }
    
    // Apply particle's own scale if it exists
    if (scale) {
      displayScale *= scale;
    }
    
    const scaledRadius = radius * displayScale;
    
    // Special effects for different particle types
    switch (type) {
      case 'high-energy':
        // Draw energy aura
        ctx.beginPath();
        ctx.arc(x, y, scaledRadius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[^,]+(?=\))/, '0.2'); // Lower opacity for glow
        ctx.fill();
        break;
        
      case 'quantum':
        // Draw quantum uncertainty effect (flickering position)
        const jitter = Math.sin(Date.now() * 0.01) * 2;
        ctx.beginPath();
        ctx.arc(x + jitter, y + jitter, scaledRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[^,]+(?=\))/, '0.3');
        ctx.fill();
        break;
        
      case 'adaptive':
        // Draw adaptation markers
        ctx.beginPath();
        ctx.arc(x, y, scaledRadius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(58, 191, 248, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        break;
        
      case 'composite':
        // Draw composite structure
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          const offsetX = Math.cos(angle) * scaledRadius * 0.5;
          const offsetY = Math.sin(angle) * scaledRadius * 0.5;
          
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, scaledRadius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(/[^,]+(?=\))/, '0.7');
          ctx.fill();
        }
        break;
    }

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
    
    // Knowledge/complexity visualization as ring thickness
    if (knowledge > 0.3 || complexity > 1) {
      const ringThickness = Math.min(scaledRadius * 0.4, Math.max(1, complexity));
      ctx.beginPath();
      ctx.arc(x, y, scaledRadius + ringThickness, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.7, knowledge)})`;
      ctx.lineWidth = ringThickness;
      ctx.stroke();
    }
    
    // Draw main particle body
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
    
    // Vary color based on charge and energy
    let particleColor = color;
    if (charge === 'positive') {
      particleColor = 'rgba(239, 68, 68, 0.8)'; // Red
    } else if (charge === 'negative') {
      particleColor = 'rgba(147, 51, 234, 0.8)'; // Purple
    } else {
      particleColor = 'rgba(74, 222, 128, 0.8)'; // Green
    }
    
    // If it's a post-inflation particle, add a pulsating effect
    if (isPostInflation) {
      const now = Date.now() * 0.003;
      const alpha = 0.7 + 0.3 * Math.sin(now); // Pulsating alpha
      particleColor = particleColor.replace(/[^,]+(?=\))/, alpha.toString());
    }
    
    ctx.fillStyle = particleColor;
    ctx.fill();
    
    // Draw particle details if needed
    if (showDetails && scaledRadius > 3) {
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
      
      if (chargeSymbol) {
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
      
      // Color based on value (positive = blue, negative = red, neutral = green)
      let color;
      if (value > 0.2) {
        const intensity = Math.min(255, Math.floor(value * 255));
        color = `rgba(59, 130, 246, ${opacity * Math.min(1, value * 2)})`; // Blue for positive
      } else if (value < -0.2) {
        const intensity = Math.min(255, Math.floor(-value * 255));
        color = `rgba(239, 68, 68, ${opacity * Math.min(1, -value * 2)})`; // Red for negative
      } else {
        // Near-neutral values get a green tint
        const absValue = Math.abs(value);
        const intensity = Math.min(255, Math.floor(absValue * 255));
        color = `rgba(74, 222, 128, ${opacity * Math.min(0.5, absValue * 4)})`; // Green for neutral
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(posX, posY, cellWidth, cellHeight);
    }
  }
  
  // Draw flow lines to show the field gradient
  const lineSpacing = Math.floor(fieldWidth / 8);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  
  for (let y = lineSpacing; y < fieldHeight; y += lineSpacing) {
    for (let x = lineSpacing; x < fieldWidth; x += lineSpacing) {
      // Calculate gradient direction from surrounding values
      const val = intentField[zLayer][y][x];
      const valRight = x < fieldWidth - 1 ? intentField[zLayer][y][x + 1] : val;
      const valLeft = x > 0 ? intentField[zLayer][y][x - 1] : val;
      const valDown = y < fieldHeight - 1 ? intentField[zLayer][y + 1][x] : val;
      const valUp = y > 0 ? intentField[zLayer][y - 1][x] : val;
      
      const dx = valRight - valLeft;
      const dy = valDown - valUp;
      
      // Normalize and scale the direction vector
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      if (magnitude > 0.1) {
        const lineLength = Math.min(cellWidth, cellHeight) * 1.5;
        const normalized_dx = dx / magnitude;
        const normalized_dy = dy / magnitude;
        
        const centerX = (x + 0.5) * cellWidth;
        const centerY = (y + 0.5) * cellHeight;
        
        ctx.beginPath();
        ctx.moveTo(centerX - normalized_dx * lineLength / 2, centerY - normalized_dy * lineLength / 2);
        ctx.lineTo(centerX + normalized_dx * lineLength / 2, centerY + normalized_dy * lineLength / 2);
        ctx.stroke();
      }
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
  
  // Draw contour lines for high density areas
  if (maxDensity > 3) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 0.5;
    
    const contourThreshold = maxDensity * 0.5;
    
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        if (densityGrid[y][x] > contourThreshold) {
          const above = densityGrid[y-1][x] > contourThreshold;
          const below = densityGrid[y+1][x] > contourThreshold;
          const left = densityGrid[y][x-1] > contourThreshold;
          const right = densityGrid[y][x+1] > contourThreshold;
          
          if (!above || !below || !left || !right) {
            // This is a boundary cell - draw contour
            ctx.beginPath();
            ctx.arc((x + 0.5) * resolution, (y + 0.5) * resolution, resolution * 0.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }
  }
  
  ctx.restore();
}

export function renderCombined(
  ctx: CanvasRenderingContext2D,
  particles: any[],
  intentField: number[][][],
  dimensions: { width: number; height: number },
  viewMode: '2d' | '3d'
) {
  // Render layers in order: intent field, density, particles
  
  // Render intent field with lower opacity
  renderIntentField(ctx, intentField, dimensions, 15, 0.15);
  
  // Render particle density with lower opacity
  renderParticleDensity(ctx, particles, dimensions, 25, 0.3);
  
  // Render particles on top
  renderParticles(ctx, particles, dimensions, viewMode, true);
  
  // Add a subtle glow effect over the entire canvas
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  ctx.restore();
}
