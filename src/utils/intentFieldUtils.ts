
/**
 * Initialize an intent field with the given dimensions
 * 
 * @param width - The width of the field
 * @param height - The height of the field
 * @returns A 3D array representing the intent field
 */
export function initializeIntentField(width: number, height: number): number[][][] {
  const depth = 10;
  const field: number[][][] = [];
  
  for (let z = 0; z < depth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Initialize with slight random fluctuations
        row.push((Math.random() * 2 - 1) * 0.1);
      }
      plane.push(row);
    }
    field.push(plane);
  }
  
  return field;
}

/**
 * Analyze the intent field to get insights
 * 
 * @param field - The intent field to analyze
 * @returns Statistical analysis of the field
 */
export function analyzeIntentField(field: number[][][]): any {
  // Calculate basic statistics
  let sum = 0;
  let count = 0;
  let min = Infinity;
  let max = -Infinity;
  
  field.forEach(plane => {
    plane.forEach(row => {
      row.forEach(value => {
        sum += value;
        count++;
        min = Math.min(min, value);
        max = Math.max(max, value);
      });
    });
  });
  
  return {
    average: sum / count,
    min,
    max,
    range: max - min,
    totalFluctuation: sum,
    size: {
      depth: field.length,
      height: field[0]?.length || 0,
      width: field[0]?.[0]?.length || 0
    }
  };
}
