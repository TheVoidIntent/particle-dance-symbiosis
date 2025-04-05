
import { Particle } from '@/types/simulation';

/**
 * Extract audio-like features from particle behavior
 */
export function extractFeatures(particles: Particle[]): {
  peak_freq: number;
  avg_power: number;
  time: number;
} {
  const now = Date.now();
  
  // Calculate a frequency-like value based on average particle velocity
  const velocities = particles.map(p => Math.sqrt(p.vx * p.vx + p.vy * p.vy + (p.vz || 0) * (p.vz || 0)));
  const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / particles.length;
  const peakFreq = avgVelocity * 100; // Scale to something in audio frequency range
  
  // Calculate power-like value based on particle energy and knowledge
  const energyValues = particles.map(p => (p.energy || 0) + (p.knowledge || 0));
  const avgPower = energyValues.reduce((sum, e) => sum + e, 0) / particles.length;
  
  return {
    peak_freq: peakFreq,
    avg_power: avgPower,
    time: now
  };
}

/**
 * Infer intent field characteristics from particle distribution
 */
export function inferIntentField(particles: Particle[]): { 
  intentStrength: number;
  coherence: number;
  stability: number;
  complexity: number;
} {
  // Calculate intent strength based on charge distribution
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  
  const intentStrength = (positiveCount - negativeCount) / (particles.length || 1);
  
  // Calculate coherence based on how clustered particles are
  const xPositions = particles.map(p => p.x);
  const yPositions = particles.map(p => p.y);
  const xRange = Math.max(...xPositions) - Math.min(...xPositions);
  const yRange = Math.max(...yPositions) - Math.min(...yPositions);
  const area = xRange * yRange;
  const density = particles.length / area;
  const coherence = Math.min(1, density * 10); // Scale and cap
  
  // Calculate stability based on average velocity
  const velocities = particles.map(p => Math.sqrt(p.vx * p.vx + p.vy * p.vy));
  const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  const stability = Math.max(0, 1 - avgVelocity / 5); // Inverse of velocity
  
  // Calculate complexity based on knowledge and interactions
  const avgKnowledge = particles.reduce((sum, p) => sum + (p.knowledge || 0), 0) / particles.length;
  const avgInteractions = particles.reduce((sum, p) => sum + (p.interactions || 0), 0) / particles.length;
  const complexity = Math.min(1, (avgKnowledge * 2 + avgInteractions / 10));
  
  return {
    intentStrength,
    coherence,
    stability,
    complexity
  };
}

