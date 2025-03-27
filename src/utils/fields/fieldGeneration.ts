
// Field generation utilities

// Generate an initial random intent field
export function generateIntentField(
  width: number,
  height: number,
  depth: number,
  resolution: number
): number[][][] {
  const fieldWidth = Math.ceil(width / resolution);
  const fieldHeight = Math.ceil(height / resolution);
  const fieldDepth = depth;
  
  const field: number[][][] = [];
  
  for (let z = 0; z < fieldDepth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < fieldWidth; x++) {
        // Random values between -1 and 1
        row.push(Math.random() * 2 - 1);
      }
      plane.push(row);
    }
    field.push(plane);
  }
  
  return field;
}

// Generate a perlin noise-like field
export function generatePerlinField(
  width: number,
  height: number,
  depth: number,
  resolution: number,
  scale: number = 0.1
): number[][][] {
  const fieldWidth = Math.ceil(width / resolution);
  const fieldHeight = Math.ceil(height / resolution);
  const fieldDepth = depth;
  
  // Create field with pseudorandom noise (not true perlin but simpler)
  const field: number[][][] = [];
  
  for (let z = 0; z < fieldDepth; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < fieldHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < fieldWidth; x++) {
        // Simple wave functions with different frequencies
        const nx = x * scale;
        const ny = y * scale;
        const nz = z * scale;
        
        // Mix of sine waves as a simple noise approximation
        const value = 
          Math.sin(nx) * Math.cos(ny) * 0.3 +
          Math.sin(nx * 2.1) * Math.sin(ny * 1.7) * 0.2 +
          Math.cos(nx * 3.7 + nz) * Math.sin(ny * 2.9) * 0.15 +
          Math.sin(nx * 5.3 + ny * 4.7) * Math.cos(nz * 2.5) * 0.1 +
          Math.random() * 0.25; // Add some random noise
        
        // Normalize to -1 to 1 range
        row.push(Math.max(-1, Math.min(1, value)));
      }
      plane.push(row);
    }
    field.push(plane);
  }
  
  return field;
}
