
import { defaultConfig } from './simulation/config';

// Create a 3D intent field
export function createIntentField(width: number, height: number, depth: number): number[][][] {
  const field: number[][][] = [];
  
  for (let z = 0; z < depth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Initial fluctuation between -1 and 1
        row.push(Math.random() * 2 - 1);
      }
      plane.push(row);
    }
    field.push(plane);
  }
  
  return field;
}

// Update the intent field with random fluctuations
export function updateIntentField(
  field: number[][][],
  fluctuationRate: number = 0.01,
  probabilistic: boolean = false
): number[][][] {
  // Create a copy to avoid modifying the original
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

// Create a field representation from particles
export function createFieldFromParticles(
  particles: any[],
  dimensions: { width: number, height: number, depth: number },
  cellSize: number
): number[][][] {
  const fieldWidth = Math.ceil(dimensions.width / cellSize);
  const fieldHeight = Math.ceil(dimensions.height / cellSize);
  const fieldDepth = dimensions.depth;
  
  // Initialize empty field
  const field: number[][][] = [];
  for (let z = 0; z < fieldDepth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < fieldHeight; y++) {
      plane.push(Array(fieldWidth).fill(0));
    }
    field.push(plane);
  }
  
  // Add particle influence to field
  for (const particle of particles) {
    if (!particle || isNaN(particle.x) || isNaN(particle.y)) continue;
    
    const x = Math.floor(particle.x / cellSize);
    const y = Math.floor(particle.y / cellSize);
    const z = Math.floor((particle.z || 0) / (dimensions.depth / fieldDepth));
    
    // Skip if out of bounds
    if (x < 0 || x >= fieldWidth || y < 0 || y >= fieldHeight || z < 0 || z >= fieldDepth) {
      continue;
    }
    
    // Influence depends on particle charge
    let influence = 0;
    switch (particle.charge) {
      case 'positive':
        influence = 0.1;
        break;
      case 'negative':
        influence = -0.1;
        break;
      case 'neutral':
        influence = 0;
        break;
      default:
        influence = 0;
    }
    
    // Adjust by intent if present
    if (particle.intent !== undefined) {
      influence *= (1 + Math.abs(particle.intent));
    }
    
    // Apply to field
    field[z][y][x] += influence;
    
    // Clamp to range [-1, 1]
    field[z][y][x] = Math.max(-1, Math.min(1, field[z][y][x]));
  }
  
  return field;
}

// Analyze the intent field for emerging patterns
export function analyzeIntentField(field: number[][][]): {
  complexity: number;
  averageIntent: number;
  gradientStrength: number;
  entropyLevel: number;
} {
  let totalIntent = 0;
  let totalCells = 0;
  let gradientSum = 0;
  let frequencies: Record<string, number> = {};
  
  // Analyze the middle z layer for simplicity
  const zLayer = Math.floor(field.length / 2);
  
  for (let y = 1; y < field[zLayer].length - 1; y++) {
    for (let x = 1; x < field[zLayer][y].length - 1; x++) {
      const value = field[zLayer][y][x];
      totalIntent += value;
      totalCells++;
      
      // Calculate local gradient (difference from neighbors)
      const neighbors = [
        field[zLayer][y-1][x],
        field[zLayer][y+1][x],
        field[zLayer][y][x-1],
        field[zLayer][y][x+1]
      ];
      
      const localGradient = neighbors.reduce((sum, neighbor) => 
        sum + Math.abs(value - neighbor), 0) / 4;
      
      gradientSum += localGradient;
      
      // Bin the value for entropy calculation
      const bin = Math.floor(value * 10) / 10;
      frequencies[bin] = (frequencies[bin] || 0) + 1;
    }
  }
  
  // Calculate average intent
  const averageIntent = totalIntent / totalCells;
  
  // Calculate gradient strength (measure of pattern complexity)
  const gradientStrength = gradientSum / totalCells;
  
  // Calculate entropy (measure of disorder)
  let entropy = 0;
  for (const bin in frequencies) {
    const probability = frequencies[bin] / totalCells;
    entropy -= probability * Math.log2(probability);
  }
  
  // Normalize entropy to [0, 1]
  const maxPossibleEntropy = Math.log2(Object.keys(frequencies).length);
  const normalizedEntropy = maxPossibleEntropy > 0 ? entropy / maxPossibleEntropy : 0;
  
  // Calculate complexity as a function of gradient and entropy
  const complexity = gradientStrength * (1 - normalizedEntropy/2);
  
  return {
    complexity,
    averageIntent,
    gradientStrength,
    entropyLevel: normalizedEntropy
  };
}
