
/**
 * Initialize an intent field with random fluctuations
 */
export function initializeIntentField(
  width: number, 
  height: number, 
  depth: number = 10, 
  resolution: number = 20
): number[][][] {
  const fieldWidth = Math.ceil(width / resolution);
  const fieldHeight = Math.ceil(height / resolution);
  const fieldDepth = depth;
  
  // Create 3D array with initial random fluctuations
  const field: number[][][] = Array(fieldDepth)
    .fill(null)
    .map(() => Array(fieldHeight)
      .fill(null)
      .map(() => Array(fieldWidth)
        .fill(0)
        .map(() => (Math.random() * 2 - 1) * 0.1) // Small initial fluctuations
      )
    );
  
  return field;
}

/**
 * Update an intent field with new fluctuations
 */
export function updateIntentField(
  field: number[][][],
  fluctuationRate: number = 0.01
): number[][][] {
  const updatedField = JSON.parse(JSON.stringify(field)) as number[][][];
  
  // Apply random fluctuations to each cell
  for (let z = 0; z < updatedField.length; z++) {
    for (let y = 0; y < updatedField[z].length; y++) {
      for (let x = 0; x < updatedField[z][y].length; x++) {
        // Random fluctuation
        const fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
        updatedField[z][y][x] += fluctuation;
        
        // Clamp to range [-1, 1]
        updatedField[z][y][x] = Math.max(-1, Math.min(1, updatedField[z][y][x]));
      }
    }
  }
  
  return updatedField;
}

/**
 * Calculate intent field complexity
 */
export function calculateIntentFieldComplexity(field: number[][][]): number {
  if (!field || field.length === 0) return 0;
  
  let complexity = 0;
  const fieldLayer = field[0];
  
  for (let y = 1; y < fieldLayer.length - 1; y++) {
    for (let x = 1; x < fieldLayer[y].length - 1; x++) {
      const center = fieldLayer[y][x];
      const neighbors = [
        fieldLayer[y-1][x],
        fieldLayer[y+1][x],
        fieldLayer[y][x-1],
        fieldLayer[y][x+1]
      ];
      
      const gradient = neighbors.reduce((sum, val) => sum + Math.abs(center - val), 0) / 4;
      complexity += gradient;
    }
  }
  
  const cellCount = Math.max(1, (fieldLayer.length - 2) * (fieldLayer[0].length - 2));
  return complexity / cellCount;
}
