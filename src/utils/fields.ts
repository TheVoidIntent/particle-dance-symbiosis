
import { Particle } from './particleUtils';

/**
 * Analyzes an intent field and returns its key properties
 */
export function analyzeIntentField(field: number[][][]): {
  averageValue: number;
  positiveRegions: number;
  negativeRegions: number;
  neutralRegions: number;
  gradientStrength: number;
  fieldEnergy: number;
  complexity: number; // Add this property to fix the error
} {
  if (!field || field.length === 0 || field[0].length === 0 || field[0][0].length === 0) {
    return {
      averageValue: 0,
      positiveRegions: 0,
      negativeRegions: 0,
      neutralRegions: 0,
      gradientStrength: 0,
      fieldEnergy: 0,
      complexity: 0
    };
  }
  
  let sum = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let gradientSum = 0;
  let energySum = 0;
  let complexityScore = 0;
  
  // Sample one layer for efficiency
  const fieldLayer = field[0];
  const rows = fieldLayer.length;
  const cols = fieldLayer[0].length;
  
  // Calculate average value and region counts
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = fieldLayer[y][x];
      sum += value;
      
      if (value > 0.1) {
        positiveCount++;
      } else if (value < -0.1) {
        negativeCount++;
      } else {
        neutralCount++;
      }
      
      energySum += value * value;
      
      // Calculate local gradient (measure of change)
      if (y > 0 && x > 0 && y < rows - 1 && x < cols - 1) {
        const neighbors = [
          fieldLayer[y-1][x],
          fieldLayer[y+1][x],
          fieldLayer[y][x-1],
          fieldLayer[y][x+1]
        ];
        
        const localGradient = neighbors.reduce((acc, neighbor) => 
          acc + Math.abs(value - neighbor), 0) / 4;
        
        gradientSum += localGradient;
        
        // Local patterns contribute to complexity
        if (localGradient > 0.1) {
          complexityScore += localGradient * 2;
        }
      }
    }
  }
  
  const cellCount = rows * cols;
  const averageValue = sum / cellCount;
  const gradientStrength = gradientSum / ((rows - 2) * (cols - 2));
  const fieldEnergy = energySum / cellCount;
  
  // Calculate complexity based on distribution of values
  const valueVariance = fieldEnergy - (averageValue * averageValue);
  complexityScore += valueVariance * 10;
  
  // Presence of both positive and negative regions increases complexity
  const balanceFactor = (positiveCount * negativeCount) / (cellCount * cellCount);
  complexityScore += balanceFactor * 20;
  
  // Normalize complexity to 0-1 range
  const normalizedComplexity = Math.min(1, Math.max(0, complexityScore / 5));
  
  return {
    averageValue,
    positiveRegions: positiveCount,
    negativeRegions: negativeCount,
    neutralRegions: neutralCount,
    gradientStrength,
    fieldEnergy,
    complexity: normalizedComplexity
  };
}

/**
 * Creates a simple field from the current particles
 */
export function createFieldFromParticles(
  particles: Particle[],
  dimensions: { width: number; height: number; depth: number },
  resolution: number
): number[][][] {
  const width = Math.ceil(dimensions.width / resolution);
  const height = Math.ceil(dimensions.height / resolution);
  const depth = dimensions.depth;
  
  // Initialize empty field
  const field: number[][][] = Array(depth).fill(0).map(() => 
    Array(height).fill(0).map(() => 
      Array(width).fill(0)
    )
  );
  
  // Add particle influence to field
  particles.forEach(particle => {
    const x = Math.floor(particle.x / resolution);
    const y = Math.floor(particle.y / resolution);
    const z = Math.floor((particle.z || 0) / resolution) % depth;
    
    if (x >= 0 && x < width && y >= 0 && y < height && z >= 0 && z < depth) {
      // Add particle influence based on charge and intent
      const influence = particle.charge === 'positive' ? 0.1 :
                        particle.charge === 'negative' ? -0.1 : 0.05;
      
      field[z][y][x] += influence;
      
      // Add some influence to neighboring cells
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            const nz = (z + dz + depth) % depth;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
                !(dx === 0 && dy === 0 && dz === 0)) {
              field[nz][ny][nx] += influence * 0.3;
            }
          }
        }
      }
    }
  });
  
  return field;
}

/**
 * Updates the intent field based on fluctuation rate and current state
 */
export function updateIntentField(
  field: number[][][],
  fluctuationRate: number,
  probabilistic: boolean = false
): number[][][] {
  if (!field || field.length === 0) return field;
  
  const depth = field.length;
  const height = field[0].length;
  const width = field[0][0].length;
  
  // Create a copy of the field to update
  const newField = JSON.parse(JSON.stringify(field));
  
  // Update each cell in the field
  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Baseline fluctuation
        let fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
        
        // In probabilistic mode, some cells experience stronger fluctuations
        if (probabilistic && Math.random() < 0.1) {
          fluctuation *= 3;
        }
        
        // Apply fluctuation
        newField[z][y][x] += fluctuation;
        
        // Diffusion: each cell is influenced by its neighbors
        if (z > 0 && y > 0 && x > 0 && z < depth - 1 && y < height - 1 && x < width - 1) {
          const neighbors = [
            field[z-1][y][x],
            field[z+1][y][x],
            field[z][y-1][x],
            field[z][y+1][x],
            field[z][y][x-1],
            field[z][y][x+1]
          ];
          
          const avgNeighbor = neighbors.reduce((sum, val) => sum + val, 0) / neighbors.length;
          
          // Move slightly toward the average of neighbors
          newField[z][y][x] = newField[z][y][x] * 0.9 + avgNeighbor * 0.1;
        }
        
        // Apply decay to prevent unbounded growth
        newField[z][y][x] *= 0.99;
        
        // Clamp values to prevent extreme fluctuations
        newField[z][y][x] = Math.max(-1, Math.min(1, newField[z][y][x]));
      }
    }
  }
  
  return newField;
}

/**
 * Initialize a blank intent field with the given dimensions
 */
export function initializeIntentField(
  width: number,
  height: number,
  depth: number,
  resolution: number
): number[][][] {
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  
  // Create field with small random values
  const field = Array(depth).fill(0).map(() => 
    Array(rows).fill(0).map(() => 
      Array(cols).fill(0).map(() => (Math.random() * 0.2) - 0.1)
    )
  );
  
  return field;
}
