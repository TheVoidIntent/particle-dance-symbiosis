
// Field utilities for the universal simulation

// Update an intent field with fluctuations
export function updateIntentField(
  currentField: number[][][],
  fluctuationRate: number,
  probabilisticShift: boolean = true
): number[][][] {
  const updatedField = JSON.parse(JSON.stringify(currentField)) as number[][][];
  
  // Apply standard fluctuations with probabilistic elements
  for (let z = 0; z < updatedField.length; z++) {
    for (let y = 0; y < updatedField[z].length; y++) {
      for (let x = 0; x < updatedField[z][y].length; x++) {
        // Probabilistic fluctuation - not every cell changes every time
        if (Math.random() < 0.3) { // Only 30% of cells change per update
          let fluctuation: number;
          
          if (probabilisticShift) {
            // Use probabilistic distribution for fluctuations
            // Gaussian-like distribution around zero
            const u1 = Math.random();
            const u2 = Math.random();
            const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
            fluctuation = randStdNormal * fluctuationRate * 0.3; // Scale to desired fluctuation rate
          } else {
            // Standard uniform random fluctuation
            fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
          }
          
          updatedField[z][y][x] += fluctuation;
          updatedField[z][y][x] = Math.max(-1, Math.min(1, updatedField[z][y][x]));
        }
      }
    }
  }
  
  // Add wave-like patterns of intent change
  if (Math.random() < 0.05) { // 5% chance of a wave pattern forming
    const waveOriginZ = Math.floor(Math.random() * updatedField.length);
    const waveOriginY = Math.floor(Math.random() * updatedField[0].length);
    const waveOriginX = Math.floor(Math.random() * updatedField[0][0].length);
    
    const waveStrength = Math.random() * 0.5 * fluctuationRate; // Scale wave by fluctuation rate
    const wavelength = Math.random() * 5 + 5; // Random wavelength between 5-10 cells
    
    // Apply wave pattern
    for (let z = 0; z < updatedField.length; z++) {
      for (let y = 0; y < updatedField[z].length; y++) {
        for (let x = 0; x < updatedField[z][y].length; x++) {
          const distance = Math.sqrt(
            Math.pow(x - waveOriginX, 2) + 
            Math.pow(y - waveOriginY, 2) + 
            Math.pow(z - waveOriginZ, 2)
          );
          
          // Create wave pattern with dampening based on distance
          const waveEffect = Math.sin(distance / wavelength * Math.PI * 2) * 
                             waveStrength * Math.exp(-distance / (wavelength * 2));
          
          updatedField[z][y][x] += waveEffect;
          updatedField[z][y][x] = Math.max(-1, Math.min(1, updatedField[z][y][x]));
        }
      }
    }
  }
  
  // Occasionally create intent field "hotspots" - areas of strong positive or negative intent
  if (Math.random() < 0.02) { // 2% chance
    const hotspotType = Math.random() > 0.5 ? 'positive' : 'negative';
    const hotspotZ = Math.floor(Math.random() * updatedField.length);
    const hotspotY = Math.floor(Math.random() * updatedField[0].length);
    const hotspotX = Math.floor(Math.random() * updatedField[0][0].length);
    const radius = Math.floor(Math.random() * 3) + 2; // Radius 2-4 cells
    
    // Apply hotspot
    for (let z = Math.max(0, hotspotZ - radius); z < Math.min(updatedField.length, hotspotZ + radius); z++) {
      for (let y = Math.max(0, hotspotY - radius); y < Math.min(updatedField[0].length, hotspotY + radius); y++) {
        for (let x = Math.max(0, hotspotX - radius); x < Math.min(updatedField[0][0].length, hotspotX + radius); x++) {
          const distance = Math.sqrt(
            Math.pow(x - hotspotX, 2) + 
            Math.pow(y - hotspotY, 2) + 
            Math.pow(z - hotspotZ, 2)
          );
          
          if (distance <= radius) {
            const intensity = (1 - distance / radius) * 0.7; // Stronger at center, weaker at edges
            
            if (hotspotType === 'positive') {
              updatedField[z][y][x] += intensity;
            } else {
              updatedField[z][y][x] -= intensity;
            }
            
            updatedField[z][y][x] = Math.max(-1, Math.min(1, updatedField[z][y][x]));
          }
        }
      }
    }
  }
  
  return updatedField;
}

// Create a field based on existing particles (feedback loop)
export function createFieldFromParticles(
  particles: any[], 
  dimensions: { width: number; height: number; depth: number },
  cellSize: number
): number[][][] {
  const fieldWidth = Math.ceil(dimensions.width / cellSize);
  const fieldHeight = Math.ceil(dimensions.height / cellSize);
  const fieldDepth = dimensions.depth;
  
  // Initialize empty field
  const field: number[][][] = Array(fieldDepth)
    .fill(null)
    .map(() => Array(fieldHeight)
      .fill(null)
      .map(() => Array(fieldWidth).fill(0)));
  
  // Each particle influences the field around it
  particles.forEach(particle => {
    const fieldX = Math.floor(particle.x / cellSize);
    const fieldY = Math.floor(particle.y / cellSize);
    const fieldZ = Math.floor(particle.z / (dimensions.depth / fieldDepth));
    
    // Check if field coordinates are valid
    if (fieldX >= 0 && fieldX < fieldWidth && 
        fieldY >= 0 && fieldY < fieldHeight && 
        fieldZ >= 0 && fieldZ < fieldDepth) {
      
      // Different particle types influence the field differently
      let influenceRadius = 2; // Default radius
      let influenceStrength = 0.02; // Default strength
      
      if (particle.type === 'high-energy') {
        influenceRadius = 3;
        influenceStrength = 0.05;
      } else if (particle.type === 'quantum') {
        influenceRadius = 4;
        influenceStrength = Math.sin(particle.phase || 0) * 0.04;
      } else if (particle.type === 'composite') {
        influenceRadius = 2 + Math.min(3, Math.floor(particle.complexity / 2));
        influenceStrength = 0.03 * Math.min(5, particle.complexity);
      } else if (particle.type === 'adaptive') {
        influenceRadius = 3;
        influenceStrength = 0.04 * (1 + (particle.adaptiveScore || 0) * 0.1);
      }
      
      // Apply influence based on charge
      const intentValue = particle.charge === 'positive' ? influenceStrength : 
                          particle.charge === 'negative' ? -influenceStrength : 0;
      
      // Apply influence in a radius around the particle
      for (let z = Math.max(0, fieldZ - influenceRadius); z < Math.min(fieldDepth, fieldZ + influenceRadius + 1); z++) {
        for (let y = Math.max(0, fieldY - influenceRadius); y < Math.min(fieldHeight, fieldY + influenceRadius + 1); y++) {
          for (let x = Math.max(0, fieldX - influenceRadius); x < Math.min(fieldWidth, fieldX + influenceRadius + 1); x++) {
            const distance = Math.sqrt(
              Math.pow(x - fieldX, 2) + 
              Math.pow(y - fieldY, 2) + 
              Math.pow(z - fieldZ, 2)
            );
            
            if (distance <= influenceRadius) {
              // Influence falls off with distance (inverse square law)
              const influenceFactor = (1 - distance / influenceRadius) ** 2;
              field[z][y][x] += intentValue * influenceFactor;
              field[z][y][x] = Math.max(-1, Math.min(1, field[z][y][x]));
            }
          }
        }
      }
    }
  });
  
  return field;
}

// Analyze the intent field for patterns and metrics
export function analyzeIntentField(field: number[][][]): {
  positiveRegions: number;
  negativeRegions: number;
  neutralRegions: number;
  averageIntent: number;
  intentVariance: number;
  largestRegionSize: number;
  patternComplexity: number; // 0-1 scale
} {
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let totalIntent = 0;
  let intentValues: number[] = [];
  
  // First pass - count cell types and collect values
  field.forEach(plane => {
    plane.forEach(row => {
      row.forEach(value => {
        if (value > 0.3) positiveCount++;
        else if (value < -0.3) negativeCount++;
        else neutralCount++;
        
        totalIntent += value;
        intentValues.push(value);
      });
    });
  });
  
  const totalCells = positiveCount + negativeCount + neutralCount;
  const averageIntent = totalIntent / totalCells;
  
  // Calculate variance
  let sumSquaredDifference = 0;
  intentValues.forEach(value => {
    sumSquaredDifference += Math.pow(value - averageIntent, 2);
  });
  const intentVariance = sumSquaredDifference / totalCells;
  
  // Find largest connected region (simplified approximation)
  const visited = new Set<string>();
  let largestRegionSize = 0;
  
  // Helper function to detect connected regions
  const floodFill = (z: number, y: number, x: number, regionType: 'positive' | 'negative' | 'neutral'): number => {
    const key = `${z},${y},${x}`;
    if (visited.has(key)) return 0;
    
    const value = field[z][y][x];
    const isType = 
      (regionType === 'positive' && value > 0.3) ||
      (regionType === 'negative' && value < -0.3) ||
      (regionType === 'neutral' && value >= -0.3 && value <= 0.3);
    
    if (!isType) return 0;
    
    visited.add(key);
    let size = 1;
    
    // Check 6 directly adjacent cells (north, south, east, west, up, down)
    const directions = [
      [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1], [-1, 0, 0], [1, 0, 0]
    ];
    
    for (const [dz, dy, dx] of directions) {
      const nz = z + dz;
      const ny = y + dy;
      const nx = x + dx;
      
      if (nz >= 0 && nz < field.length &&
          ny >= 0 && ny < field[0].length &&
          nx >= 0 && nx < field[0][0].length) {
        size += floodFill(nz, ny, nx, regionType);
      }
    }
    
    return size;
  };
  
  // Find the largest region of any type
  for (let z = 0; z < field.length; z++) {
    for (let y = 0; y < field[0].length; y++) {
      for (let x = 0; x < field[0][0].length; x++) {
        const value = field[z][y][x];
        
        if (!visited.has(`${z},${y},${x}`)) {
          let regionType: 'positive' | 'negative' | 'neutral';
          
          if (value > 0.3) regionType = 'positive';
          else if (value < -0.3) regionType = 'negative';
          else regionType = 'neutral';
          
          const regionSize = floodFill(z, y, x, regionType);
          largestRegionSize = Math.max(largestRegionSize, regionSize);
        }
      }
    }
  }
  
  // Calculate pattern complexity (based on several factors)
  // 1. Ratio of region types (more balanced = more complex)
  const typeBalance = 1 - (
    Math.abs(positiveCount - negativeCount) / totalCells + 
    Math.abs(positiveCount - neutralCount) / totalCells + 
    Math.abs(negativeCount - neutralCount) / totalCells
  ) / 3;
  
  // 2. Field variance (more variance = more complex)
  const normalizedVariance = Math.min(1, intentVariance * 5);
  
  // 3. Edge detection (more edges = more complex)
  let edgeCount = 0;
  
  for (let z = 0; z < field.length; z++) {
    for (let y = 0; y < field[0].length; y++) {
      for (let x = 0; x < field[0][0].length - 1; x++) {
        // Check for horizontal edges
        const current = field[z][y][x];
        const next = field[z][y][x + 1];
        
        if ((current > 0.3 && next < 0.3) || (current < -0.3 && next > -0.3) ||
            (current > 0.3 && next < -0.3) || (current < -0.3 && next > 0.3)) {
          edgeCount++;
        }
      }
    }
    
    for (let y = 0; y < field[0].length - 1; y++) {
      for (let x = 0; x < field[0][0].length; x++) {
        // Check for vertical edges
        const current = field[z][y][x];
        const next = field[z][y + 1][x];
        
        if ((current > 0.3 && next < 0.3) || (current < -0.3 && next > -0.3) ||
            (current > 0.3 && next < -0.3) || (current < -0.3 && next > 0.3)) {
          edgeCount++;
        }
      }
    }
  }
  
  // Normalize edge count
  const maxPossibleEdges = field.length * field[0].length * field[0][0].length * 2;
  const normalizedEdges = Math.min(1, edgeCount / (maxPossibleEdges * 0.2));
  
  // Combine factors for overall complexity score
  const patternComplexity = (typeBalance * 0.3 + normalizedVariance * 0.4 + normalizedEdges * 0.3);
  
  return {
    positiveRegions: positiveCount,
    negativeRegions: negativeCount,
    neutralRegions: neutralCount,
    averageIntent: averageIntent,
    intentVariance: intentVariance,
    largestRegionSize: largestRegionSize,
    patternComplexity: patternComplexity
  };
}
