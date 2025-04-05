
import { Particle } from '@/types/simulation';

/**
 * Updates particle position based on velocity and handles collisions with boundaries
 */
export function updateParticlePosition(
  particle: Particle,
  width: number,
  height: number,
  mode: 'wrap' | 'bounce' | 'disappear' = 'wrap'
): Particle {
  const updatedParticle = { ...particle };
  
  // Apply velocity to position
  updatedParticle.x += updatedParticle.vx;
  updatedParticle.y += updatedParticle.vy;
  if (updatedParticle.z !== undefined && updatedParticle.vz !== undefined) {
    updatedParticle.z += updatedParticle.vz;
  }
  
  // Handle boundary conditions
  if (mode === 'wrap') {
    // Wrap around if outside boundaries
    updatedParticle.x = (updatedParticle.x + width) % width;
    updatedParticle.y = (updatedParticle.y + height) % height;
  } else if (mode === 'bounce') {
    // Bounce off boundaries
    if (updatedParticle.x <= 0 || updatedParticle.x >= width) {
      updatedParticle.vx *= -0.8;
      updatedParticle.x = Math.max(0, Math.min(updatedParticle.x, width));
    }
    
    if (updatedParticle.y <= 0 || updatedParticle.y >= height) {
      updatedParticle.vy *= -0.8;
      updatedParticle.y = Math.max(0, Math.min(updatedParticle.y, height));
    }
  }
  
  // Age particle
  updatedParticle.age = (updatedParticle.age || 0) + 1;
  
  return updatedParticle;
}

