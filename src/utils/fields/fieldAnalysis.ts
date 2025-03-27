
// Field analysis utilities

export function analyzeIntentField(intentField: number[][][]) {
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) {
    return {
      averageValue: 0,
      positiveRegions: 0,
      negativeRegions: 0,
      neutralRegions: 0,
      gradientStrength: 0,
      fieldEnergy: 0
    };
  }
  
  const depth = intentField.length;
  const height = intentField[0].length;
  const width = intentField[0][0].length;
  
  let sum = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let energySum = 0;
  let gradientSum = 0;
  let totalCells = 0;
  
  // Analyze field values
  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = intentField[z][y][x];
        totalCells++;
        
        // Sum for average
        sum += value;
        
        // Count by type
        if (value > 0.2) positiveCount++;
        else if (value < -0.2) negativeCount++;
        else neutralCount++;
        
        // Calculate field energy (squared values)
        energySum += value * value;
        
        // Calculate local gradients (for neighboring cells)
        if (x < width - 1) {
          gradientSum += Math.abs(intentField[z][y][x+1] - value);
        }
        if (y < height - 1) {
          gradientSum += Math.abs(intentField[z][y+1][x] - value);
        }
        if (z < depth - 1) {
          gradientSum += Math.abs(intentField[z+1][y][x] - value);
        }
      }
    }
  }
  
  const averageValue = sum / totalCells;
  const positiveRegions = positiveCount / totalCells;
  const negativeRegions = negativeCount / totalCells;
  const neutralRegions = neutralCount / totalCells;
  const fieldEnergy = energySum / totalCells;
  
  // Average gradient (normalized by total possible gradients)
  const totalPossibleGradients = 3 * totalCells - width * height - width * depth - height * depth;
  const gradientStrength = gradientSum / totalPossibleGradients;
  
  return {
    averageValue,
    positiveRegions,
    negativeRegions,
    neutralRegions,
    gradientStrength,
    fieldEnergy
  };
}
