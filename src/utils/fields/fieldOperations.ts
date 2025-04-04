import { initializeIntentField } from '@/utils/intentFieldUtils';
import { Particle } from '@/types/simulation';

// Update the intent field with fluctuations
export function updateIntentField(
  intentField: number[][][],
  fluctuationRate: number,
  probabilistic: boolean = false
): number[][][] {
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) {
    return intentField;
  }
  
  const newField = intentField.map(plane => 
    plane.map(row => 
      row.map(value => {
        // Apply random fluctuations
        let fluctuation = (Math.random() * 2 - 1) * fluctuationRate;
        
        // Add quantum-like effects if enabled
        if (probabilistic && Math.random() < 0.05) {
          fluctuation *= 3;  // Occasional stronger fluctuations
        }
        
        // Apply fluctuation and constrain values
        let newValue = value + fluctuation;
        return Math.max(-1, Math.min(1, newValue));
      })
    )
  );
  
  return newField;
}

// Create an intent field based on current particle positions
export function createFieldFromParticles(
  particles: Particle[],
  dimensions: { width: number; height: number; depth: number },
  cellSize: number
): number[][][] {
  const fieldDepth = dimensions.depth;
  const fieldHeight = Math.ceil(dimensions.height / cellSize);
  const fieldWidth = Math.ceil(dimensions.width / cellSize);
  
  // Initialize empty field
  const field: number[][][] = Array(fieldDepth)
    .fill(0)
    .map(() => 
      Array(fieldHeight)
        .fill(0)
        .map(() => Array(fieldWidth).fill(0))
    );
  
  // Fill field based on particles
  particles.forEach(particle => {
    const gridX = Math.floor(particle.x / cellSize);
    const gridY = Math.floor(particle.y / cellSize);
    const gridZ = Math.floor(particle.z);
    
    // Skip if out of bounds
    if (
      gridX < 0 || gridX >= fieldWidth || 
      gridY < 0 || gridY >= fieldHeight || 
      gridZ < 0 || gridZ >= fieldDepth
    ) {
      return;
    }
    
    // Add particle's influence to the field
    const chargeValue = particle.charge === 'positive' ? 0.2 :
                       particle.charge === 'negative' ? -0.2 : 0;
    
    // Influence nearby cells (simple blur)
    for (let z = Math.max(0, gridZ - 1); z <= Math.min(fieldDepth - 1, gridZ + 1); z++) {
      for (let y = Math.max(0, gridY - 1); y <= Math.min(fieldHeight - 1, gridY + 1); y++) {
        for (let x = Math.max(0, gridX - 1); x <= Math.min(fieldWidth - 1, gridX + 1); x++) {
          // Calculate distance-based attenuation
          const distance = Math.sqrt(
            Math.pow(x - gridX, 2) + 
            Math.pow(y - gridY, 2) + 
            Math.pow(z - gridZ, 2)
          );
          
          // Influence decreases with distance
          const influence = chargeValue * (1 / (1 + distance));
          
          field[z][y][x] += influence;
          
          // Constrain field values
          field[z][y][x] = Math.max(-1, Math.min(1, field[z][y][x]));
        }
      }
    }
  });
  
  return field;
}
