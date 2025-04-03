
/**
 * Initialize an intent field with random values
 */
export function initializeIntentField(
  width: number, 
  height: number, 
  depth: number = 1, 
  resolution: number = 10
): number[][][] {
  const fieldWidth = Math.ceil(width / resolution);
  const fieldHeight = Math.ceil(height / resolution);
  
  const field: number[][][] = [];
  
  for (let z = 0; z < depth; z++) {
    const layer: number[][] = [];
    
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      
      for (let x = 0; x < fieldWidth; x++) {
        // Initialize with small random fluctuations
        row.push((Math.random() * 2 - 1) * 0.1);
      }
      
      layer.push(row);
    }
    
    field.push(layer);
  }
  
  return field;
}

/**
 * Update intent field based on particles
 */
export function updateIntentField(
  intentField: number[][][],
  particles: any[],
  width: number,
  height: number,
  fieldResolution: number = 10,
  decayRate: number = 0.01
): number[][][] {
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) {
    return intentField;
  }
  
  const fieldDepth = intentField.length;
  const fieldHeight = intentField[0].length;
  const fieldWidth = intentField[0][0].length;
  
  // Create a copy of the field
  const newField = intentField.map(layer => 
    layer.map(row => 
      row.map(value => value * (1 - decayRate)) // Apply decay
    )
  );
  
  // Update field based on particles
  particles.forEach(particle => {
    const fieldX = Math.floor(particle.x / (width / fieldWidth));
    const fieldY = Math.floor(particle.y / (height / fieldHeight));
    const fieldZ = fieldDepth > 1 ? Math.floor(particle.z / (10 / fieldDepth)) : 0;
    
    // Skip if particle is outside field bounds
    if (
      fieldX < 0 || fieldX >= fieldWidth ||
      fieldY < 0 || fieldY >= fieldHeight ||
      fieldZ < 0 || fieldZ >= fieldDepth
    ) {
      return;
    }
    
    // Update field value based on particle charge and intent
    const intent = particle.intent || 0;
    const influenceFactor = 0.05;
    
    if (particle.charge === 'positive') {
      newField[fieldZ][fieldY][fieldX] += intent * influenceFactor;
    } else if (particle.charge === 'negative') {
      newField[fieldZ][fieldY][fieldX] -= Math.abs(intent) * influenceFactor;
    }
    // Neutral particles don't influence the field much
  });
  
  // Apply small random fluctuations
  for (let z = 0; z < fieldDepth; z++) {
    for (let y = 0; y < fieldHeight; y++) {
      for (let x = 0; x < fieldWidth; x++) {
        // Add small random fluctuations
        newField[z][y][x] += (Math.random() * 2 - 1) * 0.01;
        
        // Ensure values stay within reasonable bounds
        newField[z][y][x] = Math.max(-1, Math.min(1, newField[z][y][x]));
      }
    }
  }
  
  return newField;
}

/**
 * Calculate the complexity of an intent field
 */
export function calculateFieldComplexity(intentField: number[][][]): number {
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) {
    return 0;
  }
  
  let complexity = 0;
  const fieldDepth = intentField.length;
  const fieldHeight = intentField[0].length;
  const fieldWidth = intentField[0][0].length;
  
  // Calculate gradient magnitude at each point
  for (let z = 1; z < fieldDepth - 1; z++) {
    for (let y = 1; y < fieldHeight - 1; y++) {
      for (let x = 1; x < fieldWidth - 1; x++) {
        const center = intentField[z][y][x];
        
        // Calculate gradients in all directions
        const gradX = (intentField[z][y][x+1] - intentField[z][y][x-1]) / 2;
        const gradY = (intentField[z][y+1][x] - intentField[z][y-1][x]) / 2;
        const gradZ = fieldDepth > 2 ? (intentField[z+1][y][x] - intentField[z-1][y][x]) / 2 : 0;
        
        // Calculate magnitude of gradient
        const gradMagnitude = Math.sqrt(gradX*gradX + gradY*gradY + gradZ*gradZ);
        
        // Add to total complexity
        complexity += gradMagnitude;
      }
    }
  }
  
  // Normalize by the number of points
  const totalPoints = (fieldDepth - 2) * (fieldHeight - 2) * (fieldWidth - 2);
  if (totalPoints > 0) {
    complexity /= totalPoints;
  }
  
  return complexity;
}
