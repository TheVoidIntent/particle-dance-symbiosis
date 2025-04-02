
/**
 * Initialize the intent field
 */
export function initializeIntentField(
  width: number, 
  height: number, 
  depth: number = 10, 
  resolution: number = 20
): number[][][] {
  const field: number[][][] = [];
  
  const cols = Math.max(3, Math.ceil(width / resolution));
  const rows = Math.max(3, Math.ceil(height / resolution));
  const layers = Math.max(1, depth);
  
  for (let z = 0; z < layers; z++) {
    const layer: number[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        // Random value between -1 and 1
        row.push(Math.random() * 2 - 1);
      }
      layer.push(row);
    }
    field.push(layer);
  }
  
  return field;
}

/**
 * Update intent field with random fluctuations
 */
export function updateIntentField(
  field: number[][][],
  fluctuationRate: number = 0.01,
  probabilistic: boolean = false
): number[][][] {
  const updatedField = JSON.parse(JSON.stringify(field));
  
  for (let z = 0; z < field.length; z++) {
    for (let y = 0; y < field[z].length; y++) {
      for (let x = 0; x < field[z][y].length; x++) {
        // Apply random fluctuation
        let fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
        
        // If probabilistic, sometimes have larger fluctuations
        if (probabilistic && Math.random() < 0.05) {
          fluctuation *= 5; // Occasional larger fluctuations
        }
        
        updatedField[z][y][x] += fluctuation;
        
        // Clamp to range [-1, 1]
        updatedField[z][y][x] = Math.max(-1, Math.min(1, updatedField[z][y][x]));
      }
    }
  }
  
  return updatedField;
}

/**
 * Get value from intent field at a specific position
 */
export function getIntentFieldValueAtPosition(
  field: number[][][],
  x: number, 
  y: number, 
  z: number = 0, 
  dimensions: { width: number, height: number, depth?: number } = { width: 800, height: 600 }
): number {
  if (!field || field.length === 0 || field[0].length === 0 || field[0][0].length === 0) {
    return 0;
  }
  
  const depth = field.length;
  const rows = field[0].length;
  const cols = field[0][0].length;
  
  // Scale coordinates to field dimensions
  const fieldX = Math.floor((x / dimensions.width) * cols);
  const fieldY = Math.floor((y / dimensions.height) * rows);
  const fieldZ = Math.floor((z / (dimensions.depth || 10)) * depth);
  
  // Clamp to valid indices
  const safeX = Math.max(0, Math.min(cols - 1, fieldX));
  const safeY = Math.max(0, Math.min(rows - 1, fieldY));
  const safeZ = Math.max(0, Math.min(depth - 1, fieldZ));
  
  return field[safeZ][safeY][safeX];
}

/**
 * Create a field visualization
 */
export function createFieldVisualization(
  field: number[][][],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layer: number = 0
): void {
  if (!field || field.length === 0 || !ctx) return;
  
  const safeLayer = Math.min(Math.max(0, layer), field.length - 1);
  const rows = field[safeLayer].length;
  const cols = field[safeLayer][0].length;
  
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = field[safeLayer][y][x];
      
      // Map value to color
      let color;
      if (value > 0) {
        // Positive values: red
        const intensity = Math.min(1, value);
        color = `rgba(255, ${Math.floor(255 * (1 - intensity))}, ${Math.floor(255 * (1 - intensity))}, 0.5)`;
      } else {
        // Negative values: blue
        const intensity = Math.min(1, Math.abs(value));
        color = `rgba(${Math.floor(255 * (1 - intensity))}, ${Math.floor(255 * (1 - intensity))}, 255, 0.5)`;
      }
      
      // Draw cell
      ctx.fillStyle = color;
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }
}
