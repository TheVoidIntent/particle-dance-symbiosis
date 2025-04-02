
/**
 * Initializes a 3D intent field with random values
 */
export function initializeIntentField(
  width: number,
  height: number, 
  depth: number = 10,
  resolution: number = 20
): number[][][] {
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  const layers = Math.max(1, depth);
  
  const field: number[][][] = [];
  
  // Create a 3D field with random intent values between -1 and 1
  for (let z = 0; z < layers; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        // Random value between -1 and 1
        row.push(Math.random() * 2 - 1);
      }
      plane.push(row);
    }
    field.push(plane);
  }
  
  return field;
}

/**
 * Updates the intent field with small random fluctuations
 */
export function updateIntentField(
  field: number[][][],
  fluctuationRate: number = 0.01
): number[][][] {
  if (!field || field.length === 0) return field;
  
  const updatedField = field.map(plane =>
    plane.map(row =>
      row.map(value => {
        // Apply random fluctuation based on rate
        const fluctuation = (Math.random() - 0.5) * fluctuationRate * 2;
        // Ensure value stays between -1 and 1
        return Math.max(-1, Math.min(1, value + fluctuation));
      })
    )
  );
  
  return updatedField;
}

/**
 * Gets the intent value at a specific position in the field
 */
export function getIntentAt(
  field: number[][][],
  x: number, 
  y: number, 
  z: number = 0,
  dimensions: { width: number, height: number, depth?: number } = { width: 100, height: 100 }
): number {
  if (!field || field.length === 0) return 0;
  
  const depth = field.length;
  const height = field[0].length;
  const width = field[0][0].length;
  
  // Calculate grid positions
  const gridX = Math.floor(x / (dimensions.width / width));
  const gridY = Math.floor(y / (dimensions.height / height));
  const gridZ = Math.floor(z / ((dimensions.depth || 10) / depth));
  
  // Ensure we stay within bounds
  const safeX = Math.min(Math.max(0, gridX), width - 1);
  const safeY = Math.min(Math.max(0, gridY), height - 1);
  const safeZ = Math.min(Math.max(0, gridZ), depth - 1);
  
  return field[safeZ][safeY][safeX];
}

/**
 * Calculate the complexity of the intent field
 */
export function calculateFieldComplexity(field: number[][][]): number {
  if (!field || field.length === 0) return 0;
  
  let complexity = 0;
  let count = 0;
  
  // For simplicity, just look at the middle layer
  const z = Math.floor(field.length / 2);
  const plane = field[z];
  
  for (let y = 1; y < plane.length - 1; y++) {
    for (let x = 1; x < plane[y].length - 1; x++) {
      const center = plane[y][x];
      const neighbors = [
        plane[y-1][x],
        plane[y+1][x],
        plane[y][x-1],
        plane[y][x+1]
      ];
      
      // Calculate gradient - how different this point is from neighbors
      const gradient = neighbors.reduce((sum, val) => sum + Math.abs(center - val), 0) / 4;
      complexity += gradient;
      count++;
    }
  }
  
  return count > 0 ? complexity / count : 0;
}

export default {
  initializeIntentField,
  updateIntentField,
  getIntentAt,
  calculateFieldComplexity
};
