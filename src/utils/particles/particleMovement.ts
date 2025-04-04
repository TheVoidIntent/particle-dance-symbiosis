
import { Particle } from '@/types/simulation';

/**
 * Updates particle position based on its velocity and intent field
 */
export function updateParticlePosition(
  particle: Particle,
  dimensions: { width: number, height: number },
  intentField: number[][][],
  viewMode: '2d' | '3d' = '2d',
  nearbyParticles: Particle[] = []
): Particle {
  let fieldInfluence = { x: 0, y: 0 };
  
  if (intentField && intentField.length > 0) {
    const fieldWidth = intentField[0][0].length;
    const fieldHeight = intentField[0].length;
    const fieldDepth = intentField.length;
    
    const fieldX = Math.floor(particle.x / (dimensions.width / fieldWidth));
    const fieldY = Math.floor(particle.y / (dimensions.height / fieldHeight));
    const fieldZ = Math.floor(particle.z / (10 / fieldDepth));
    
    let fieldValue = 0;
    try {
      fieldValue = intentField[
        Math.min(Math.max(0, fieldZ), fieldDepth - 1)
      ][
        Math.min(Math.max(0, fieldY), fieldHeight - 1)
      ][
        Math.min(Math.max(0, fieldX), fieldWidth - 1)
      ];
    } catch (e) {
      console.error("Field access error:", e);
    }
    
    const intentFactor = 0.02;
    if (particle.charge === 'positive') {
      fieldInfluence.x = fieldValue * intentFactor;
      fieldInfluence.y = fieldValue * intentFactor;
    } else if (particle.charge === 'negative') {
      fieldInfluence.x = -fieldValue * intentFactor;
      fieldInfluence.y = -fieldValue * intentFactor;
    } else {
      fieldInfluence.x = (Math.random() - 0.5) * 0.02;
      fieldInfluence.y = (Math.random() - 0.5) * 0.02;
    }
  }
  
  let vx = particle.vx + fieldInfluence.x;
  let vy = particle.vy + fieldInfluence.y;
  let vz = particle.vz;
  
  vx *= 0.98;
  vy *= 0.98;
  vz *= 0.98;
  
  let x = particle.x + vx;
  let y = particle.y + vy;
  let z = particle.z + vz;
  
  if (x < 0) x = dimensions.width;
  if (x > dimensions.width) x = 0;
  if (y < 0) y = dimensions.height;
  if (y > dimensions.height) y = 0;
  
  if (viewMode === '3d') {
    if (z < 0) z = 10;
    if (z > 10) z = 0;
  } else {
    z = 0;
  }
  
  let energy = Math.max(0, (particle.energy || 1) - (particle.intentDecayRate || 0.001));
  let knowledge = particle.knowledge || 0;
  let complexity = particle.complexity || 1;
  
  if (Math.random() < 0.01) {
    knowledge += 0.001;
  }
  
  return {
    ...particle,
    x,
    y,
    z,
    vx,
    vy,
    vz,
    energy,
    knowledge,
    complexity,
    age: (particle.age || 0) + 1
  };
}
