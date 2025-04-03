
/**
 * Initialize an intent field with random values
 */
export function initializeIntentField(
  width: number, 
  height: number, 
  depth: number = 5, 
  resolution: number = 20
): number[][][] {
  const fieldWidth = Math.max(3, Math.floor(width / resolution));
  const fieldHeight = Math.max(3, Math.floor(height / resolution));
  const fieldDepth = Math.max(1, depth);
  
  const field: number[][][] = [];
  
  for (let z = 0; z < fieldDepth; z++) {
    const layer: number[][] = [];
    
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      
      for (let x = 0; x < fieldWidth; x++) {
        // Create random fluctuations between -1 and 1
        const intentValue = Math.random() * 2 - 1;
        row.push(intentValue);
      }
      
      layer.push(row);
    }
    
    field.push(layer);
  }
  
  return field;
}

/**
 * Update intent field based on particle positions
 */
export function updateIntentField(
  field: number[][][], 
  particles: any[], 
  dimensions: { width: number, height: number },
  fluctuationRate: number = 0.01
): number[][][] {
  if (!field.length || !field[0].length || !field[0][0].length) {
    return field;
  }
  
  const fieldWidth = field[0][0].length;
  const fieldHeight = field[0].length;
  const fieldDepth = field.length;
  
  // Create a copy of the field
  const newField = JSON.parse(JSON.stringify(field));
  
  // Apply random fluctuations
  for (let z = 0; z < fieldDepth; z++) {
    for (let y = 0; y < fieldHeight; y++) {
      for (let x = 0; x < fieldWidth; x++) {
        // Random fluctuation
        const fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
        newField[z][y][x] += fluctuation;
        
        // Clamp values to [-1, 1]
        newField[z][y][x] = Math.max(-1, Math.min(1, newField[z][y][x]));
      }
    }
  }
  
  // Apply particle influence
  if (particles.length > 0) {
    for (const particle of particles) {
      const fieldX = Math.floor((particle.x / dimensions.width) * fieldWidth);
      const fieldY = Math.floor((particle.y / dimensions.height) * fieldHeight);
      const fieldZ = Math.floor((particle.z / 10) * fieldDepth);
      
      // Skip if out of bounds
      if (fieldX < 0 || fieldX >= fieldWidth || 
          fieldY < 0 || fieldY >= fieldHeight || 
          fieldZ < 0 || fieldZ >= fieldDepth) {
        continue;
      }
      
      // Amount of influence based on charge
      let influence = 0;
      
      if (particle.charge === 'positive') {
        influence = 0.05;
      } else if (particle.charge === 'negative') {
        influence = -0.05;
      }
      
      // Apply influence
      newField[fieldZ][fieldY][fieldX] += influence;
      
      // Clamp values
      newField[fieldZ][fieldY][fieldX] = Math.max(-1, Math.min(1, newField[fieldZ][fieldY][fieldX]));
    }
  }
  
  return newField;
}

/**
 * Get intent value at specific position
 */
export function getIntentAtPosition(
  field: number[][][],
  x: number,
  y: number,
  z: number = 0,
  dimensions: { width: number, height: number }
): number {
  if (!field.length || !field[0].length || !field[0][0].length) {
    return 0;
  }
  
  const fieldWidth = field[0][0].length;
  const fieldHeight = field[0].length;
  const fieldDepth = field.length;
  
  const fieldX = Math.floor((x / dimensions.width) * fieldWidth);
  const fieldY = Math.floor((y / dimensions.height) * fieldHeight);
  const fieldZ = Math.floor((z / 10) * fieldDepth);
  
  // Check bounds
  if (fieldX < 0 || fieldX >= fieldWidth || 
      fieldY < 0 || fieldY >= fieldHeight || 
      fieldZ < 0 || fieldZ >= fieldDepth) {
    return 0;
  }
  
  return field[fieldZ][fieldY][fieldX];
}
