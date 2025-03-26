
// Functions for manipulating and analyzing intent fields

/**
 * Update an intent field with fluctuations
 */
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
  
  // Add wave patterns and hotspots
  applyWavePatterns(updatedField, fluctuationRate);
  applyIntentHotspots(updatedField);
  
  return updatedField;
}

/**
 * Apply wave-like patterns to intent field
 */
function applyWavePatterns(field: number[][][], fluctuationRate: number): void {
  // 5% chance of a wave pattern forming
  if (Math.random() < 0.05) {
    const waveOriginZ = Math.floor(Math.random() * field.length);
    const waveOriginY = Math.floor(Math.random() * field[0].length);
    const waveOriginX = Math.floor(Math.random() * field[0][0].length);
    
    const waveStrength = Math.random() * 0.5 * fluctuationRate; // Scale wave by fluctuation rate
    const wavelength = Math.random() * 5 + 5; // Random wavelength between 5-10 cells
    
    // Apply wave pattern
    for (let z = 0; z < field.length; z++) {
      for (let y = 0; y < field[z].length; y++) {
        for (let x = 0; x < field[z][y].length; x++) {
          const distance = Math.sqrt(
            Math.pow(x - waveOriginX, 2) + 
            Math.pow(y - waveOriginY, 2) + 
            Math.pow(z - waveOriginZ, 2)
          );
          
          // Create wave pattern with dampening based on distance
          const waveEffect = Math.sin(distance / wavelength * Math.PI * 2) * 
                             waveStrength * Math.exp(-distance / (wavelength * 2));
          
          field[z][y][x] += waveEffect;
          field[z][y][x] = Math.max(-1, Math.min(1, field[z][y][x]));
        }
      }
    }
  }
}

/**
 * Apply hotspot formations to intent field
 */
function applyIntentHotspots(field: number[][][]): void {
  // 2% chance of hotspot formation
  if (Math.random() < 0.02) {
    const hotspotType = Math.random() > 0.5 ? 'positive' : 'negative';
    const hotspotZ = Math.floor(Math.random() * field.length);
    const hotspotY = Math.floor(Math.random() * field[0].length);
    const hotspotX = Math.floor(Math.random() * field[0][0].length);
    const radius = Math.floor(Math.random() * 3) + 2; // Radius 2-4 cells
    
    // Apply hotspot
    for (let z = Math.max(0, hotspotZ - radius); z < Math.min(field.length, hotspotZ + radius); z++) {
      for (let y = Math.max(0, hotspotY - radius); y < Math.min(field[0].length, hotspotY + radius); y++) {
        for (let x = Math.max(0, hotspotX - radius); x < Math.min(field[0][0].length, hotspotX + radius); x++) {
          const distance = Math.sqrt(
            Math.pow(x - hotspotX, 2) + 
            Math.pow(y - hotspotY, 2) + 
            Math.pow(z - hotspotZ, 2)
          );
          
          if (distance <= radius) {
            const intensity = (1 - distance / radius) * 0.7; // Stronger at center, weaker at edges
            
            if (hotspotType === 'positive') {
              field[z][y][x] += intensity;
            } else {
              field[z][y][x] -= intensity;
            }
            
            field[z][y][x] = Math.max(-1, Math.min(1, field[z][y][x]));
          }
        }
      }
    }
  }
}

/**
 * Create a field based on existing particles (feedback loop)
 */
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
  
  // Apply particle influences to field
  particles.forEach(particle => {
    applyParticleInfluence(field, particle, dimensions, cellSize, fieldWidth, fieldHeight, fieldDepth);
  });
  
  return field;
}

/**
 * Apply a single particle's influence to the field
 */
function applyParticleInfluence(
  field: number[][][],
  particle: any,
  dimensions: { width: number; height: number; depth: number },
  cellSize: number,
  fieldWidth: number,
  fieldHeight: number,
  fieldDepth: number
): void {
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
}
