
// Field analysis utilities

// Analysis result type
export interface FieldAnalysisResult {
  positiveRegions: number;
  negativeRegions: number;
  neutralRegions: number;
  averageIntent: number;
  intentVariance: number;
  largestRegionSize: number;
  patternComplexity: number; // 0-1 scale
}

/**
 * Analyze the intent field for patterns and metrics
 */
export function analyzeIntentField(field: number[][][]): FieldAnalysisResult {
  // Basic metrics (first pass)
  const basicMetrics = calculateBasicMetrics(field);
  
  // Find largest connected region
  const largestRegionSize = findLargestRegion(field);
  
  // Calculate pattern complexity
  const patternComplexity = calculatePatternComplexity(
    basicMetrics.positiveCount,
    basicMetrics.negativeCount,
    basicMetrics.neutralCount,
    basicMetrics.totalCells,
    basicMetrics.intentVariance,
    field
  );
  
  return {
    positiveRegions: basicMetrics.positiveCount,
    negativeRegions: basicMetrics.negativeCount,
    neutralRegions: basicMetrics.neutralCount,
    averageIntent: basicMetrics.averageIntent,
    intentVariance: basicMetrics.intentVariance,
    largestRegionSize,
    patternComplexity
  };
}

/**
 * Calculate basic field metrics
 */
function calculateBasicMetrics(field: number[][][]) {
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let totalIntent = 0;
  let intentValues: number[] = [];
  
  // First pass - count cell types and collect values
  field.forEach(plane => {
    plane.forEach(row => {
      row.forEach(value => {
        if (value > 0.3) positiveCount++;
        else if (value < -0.3) negativeCount++;
        else neutralCount++;
        
        totalIntent += value;
        intentValues.push(value);
      });
    });
  });
  
  const totalCells = positiveCount + negativeCount + neutralCount;
  const averageIntent = totalIntent / totalCells;
  
  // Calculate variance
  let sumSquaredDifference = 0;
  intentValues.forEach(value => {
    sumSquaredDifference += Math.pow(value - averageIntent, 2);
  });
  const intentVariance = sumSquaredDifference / totalCells;
  
  return {
    positiveCount,
    negativeCount,
    neutralCount,
    totalCells,
    averageIntent,
    intentVariance,
    intentValues
  };
}

/**
 * Find the largest connected region in the field
 */
function findLargestRegion(field: number[][][]): number {
  const visited = new Set<string>();
  let largestRegionSize = 0;
  
  // Helper function to detect connected regions
  const floodFill = (z: number, y: number, x: number, regionType: 'positive' | 'negative' | 'neutral'): number => {
    const key = `${z},${y},${x}`;
    if (visited.has(key)) return 0;
    
    const value = field[z][y][x];
    const isType = 
      (regionType === 'positive' && value > 0.3) ||
      (regionType === 'negative' && value < -0.3) ||
      (regionType === 'neutral' && value >= -0.3 && value <= 0.3);
    
    if (!isType) return 0;
    
    visited.add(key);
    let size = 1;
    
    // Check 6 directly adjacent cells (north, south, east, west, up, down)
    const directions = [
      [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1], [-1, 0, 0], [1, 0, 0]
    ];
    
    for (const [dz, dy, dx] of directions) {
      const nz = z + dz;
      const ny = y + dy;
      const nx = x + dx;
      
      if (nz >= 0 && nz < field.length &&
          ny >= 0 && ny < field[0].length &&
          nx >= 0 && nx < field[0][0].length) {
        size += floodFill(nz, ny, nx, regionType);
      }
    }
    
    return size;
  };
  
  // Find the largest region of any type
  for (let z = 0; z < field.length; z++) {
    for (let y = 0; y < field[0].length; y++) {
      for (let x = 0; x < field[0][0].length; x++) {
        const value = field[z][y][x];
        
        if (!visited.has(`${z},${y},${x}`)) {
          let regionType: 'positive' | 'negative' | 'neutral';
          
          if (value > 0.3) regionType = 'positive';
          else if (value < -0.3) regionType = 'negative';
          else regionType = 'neutral';
          
          const regionSize = floodFill(z, y, x, regionType);
          largestRegionSize = Math.max(largestRegionSize, regionSize);
        }
      }
    }
  }
  
  return largestRegionSize;
}

/**
 * Calculate pattern complexity based on multiple factors
 */
function calculatePatternComplexity(
  positiveCount: number,
  negativeCount: number,
  neutralCount: number,
  totalCells: number,
  intentVariance: number,
  field: number[][][]
): number {
  // 1. Ratio of region types (more balanced = more complex)
  const typeBalance = 1 - (
    Math.abs(positiveCount - negativeCount) / totalCells + 
    Math.abs(positiveCount - neutralCount) / totalCells + 
    Math.abs(negativeCount - neutralCount) / totalCells
  ) / 3;
  
  // 2. Field variance (more variance = more complex)
  const normalizedVariance = Math.min(1, intentVariance * 5);
  
  // 3. Edge detection (more edges = more complex)
  let edgeCount = 0;
  
  for (let z = 0; z < field.length; z++) {
    for (let y = 0; y < field[0].length; y++) {
      for (let x = 0; x < field[0][0].length - 1; x++) {
        // Check for horizontal edges
        const current = field[z][y][x];
        const next = field[z][y][x + 1];
        
        if ((current > 0.3 && next < 0.3) || (current < -0.3 && next > -0.3) ||
            (current > 0.3 && next < -0.3) || (current < -0.3 && next > 0.3)) {
          edgeCount++;
        }
      }
    }
    
    for (let y = 0; y < field[0].length - 1; y++) {
      for (let x = 0; x < field[0][0].length; x++) {
        // Check for vertical edges
        const current = field[z][y][x];
        const next = field[z][y + 1][x];
        
        if ((current > 0.3 && next < 0.3) || (current < -0.3 && next > -0.3) ||
            (current > 0.3 && next < -0.3) || (current < -0.3 && next > 0.3)) {
          edgeCount++;
        }
      }
    }
  }
  
  // Normalize edge count
  const maxPossibleEdges = field.length * field[0].length * field[0][0].length * 2;
  const normalizedEdges = Math.min(1, edgeCount / (maxPossibleEdges * 0.2));
  
  // Combine factors for overall complexity score
  return (typeBalance * 0.3 + normalizedVariance * 0.4 + normalizedEdges * 0.3);
}
