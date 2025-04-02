
/**
 * Initialize an intent field with the specified dimensions
 * @param width Canvas width
 * @param height Canvas height 
 * @param depth Optional depth for 3D fields (default 10)
 * @param resolution Cell size in pixels (default 20)
 * @returns A 3D array representing the intent field
 */
export function initializeIntentField(width: number, height: number, depth: number = 10, resolution: number = 20): number[][][] {
  const field: number[][][] = [];
  
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  const layers = depth;
  
  for (let z = 0; z < layers; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        // Initialize with small random fluctuations around zero
        const value = (Math.random() * 0.4) - 0.2;
        row.push(value);
      }
      plane.push(row);
    }
    field.push(plane);
  }
  
  return field;
}

/**
 * Get the intent value at a specific position in the field
 * @param field The intent field 
 * @param x X position
 * @param y Y position
 * @param z Z position (default 0)
 * @returns The intent value at the specified position
 */
export function getIntentAtPosition(field: number[][][], x: number, y: number, z: number = 0): number {
  if (!field || field.length === 0 || field[0].length === 0 || field[0][0].length === 0) {
    return 0;
  }
  
  const layerCount = field.length;
  const rowCount = field[0].length;
  const colCount = field[0][0].length;
  
  // Make sure z is within bounds
  z = Math.max(0, Math.min(layerCount - 1, Math.floor(z)));
  
  // Calculate grid cell coordinates
  const gridX = Math.max(0, Math.min(colCount - 1, Math.floor(x)));
  const gridY = Math.max(0, Math.min(rowCount - 1, Math.floor(y)));
  
  return field[z][gridY][gridX];
}

/**
 * Set the intent value at a specific position in the field
 * @param field The intent field to modify
 * @param x X position 
 * @param y Y position
 * @param z Z position (default 0)
 * @param value The new intent value
 * @returns The updated field
 */
export function setIntentAtPosition(field: number[][][], x: number, y: number, z: number = 0, value: number): number[][][] {
  if (!field || field.length === 0 || field[0].length === 0 || field[0][0].length === 0) {
    return field;
  }
  
  const layerCount = field.length;
  const rowCount = field[0].length;
  const colCount = field[0][0].length;
  
  // Make sure z is within bounds
  z = Math.max(0, Math.min(layerCount - 1, Math.floor(z)));
  
  // Calculate grid cell coordinates
  const gridX = Math.max(0, Math.min(colCount - 1, Math.floor(x)));
  const gridY = Math.max(0, Math.min(rowCount - 1, Math.floor(y)));
  
  // Create a deep copy of the field
  const newField = JSON.parse(JSON.stringify(field));
  newField[z][gridY][gridX] = value;
  
  return newField;
}

export default {
  initializeIntentField,
  getIntentAtPosition,
  setIntentAtPosition,
};
