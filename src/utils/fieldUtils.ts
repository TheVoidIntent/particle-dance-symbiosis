
/**
 * Updates the intent field with random fluctuations.
 * 
 * @param currentField The current intent field array
 * @param fluctuationRate The rate at which fluctuations occur
 * @returns The updated intent field
 */
export function updateIntentField(
  currentField: number[][][],
  fluctuationRate: number
): number[][][] {
  const newField = JSON.parse(JSON.stringify(currentField));
  
  // Apply random fluctuations to the intent field
  for (let z = 0; z < newField.length; z++) {
    for (let y = 0; y < newField[z].length; y++) {
      for (let x = 0; x < newField[z][y].length; x++) {
        const fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
        newField[z][y][x] += fluctuation;
        
        // Clamp values to [-1, 1]
        newField[z][y][x] = Math.max(-1, Math.min(1, newField[z][y][x]));
      }
    }
  }
  
  return newField;
}

/**
 * Gets the intent value at a specified position in the field
 */
export function getIntentAtPosition(
  field: number[][][],
  x: number,
  y: number,
  z: number,
  dimensions: { width: number; height: number }
): number {
  try {
    const fieldWidth = field[0][0].length;
    const fieldHeight = field[0].length;
    const fieldDepth = field.length;
    
    const fieldX = Math.floor(x / (dimensions.width / fieldWidth));
    const fieldY = Math.floor(y / (dimensions.height / fieldHeight));
    const fieldZ = Math.floor(z / (10 / fieldDepth));
    
    return field[
      Math.min(fieldZ, fieldDepth - 1)
    ][
      Math.min(fieldY, fieldHeight - 1)
    ][
      Math.min(fieldX, fieldWidth - 1)
    ];
  } catch (error) {
    console.error("Error accessing field", error);
    return 0;
  }
}
