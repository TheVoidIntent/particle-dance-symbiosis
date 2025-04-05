
import { Particle } from '@/types/simulation';

/**
 * Updates a particle's position based on its velocity
 * 
 * @param particle The particle to update
 * @param maxWidth Canvas width
 * @param maxHeight Canvas height
 * @param boundaryCondition How to handle particles that go out of bounds
 */
export function updateParticlePosition(
  particle: Particle,
  maxWidth: number,
  maxHeight: number,
  boundaryCondition: 'wrap' | 'bounce' | 'none' = 'wrap'
): void {
  // Update position based on velocity
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.z += particle.vz || 0;
  
  // Handle boundary conditions
  if (boundaryCondition === 'wrap') {
    // Wrap around the edges
    particle.x = (particle.x + maxWidth) % maxWidth;
    particle.y = (particle.y + maxHeight) % maxHeight;
  } else if (boundaryCondition === 'bounce') {
    // Bounce off the edges
    if (particle.x < 0 || particle.x > maxWidth) {
      particle.vx = -particle.vx;
      particle.x = Math.max(0, Math.min(particle.x, maxWidth));
    }
    if (particle.y < 0 || particle.y > maxHeight) {
      particle.vy = -particle.vy;
      particle.y = Math.max(0, Math.min(particle.y, maxHeight));
    }
  }
  // 'none' does nothing - particles can go out of bounds
}
