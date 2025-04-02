
import { Particle } from '@/types/simulation';

// Define AnomalyEvent interface
export interface AnomalyEvent {
  type: string;
  timestamp: number;
  description: string;
  severity: number;
  affectedParticles: number;
  data?: any;
}

// Generate a unique ID for particles
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 10000);
};

// Create a new particle with default properties
export const createParticle = (
  x: number = Math.random() * window.innerWidth,
  y: number = Math.random() * window.innerHeight,
  options: {
    charge?: 'positive' | 'negative' | 'neutral';
    energy?: number;
    intent?: number;
    complexity?: number;
    type?: string;
  } = {}
): Particle => {
  const charge = options.charge || 
    (Math.random() < 0.33 ? 'positive' : Math.random() < 0.5 ? 'negative' : 'neutral');
  
  // Set velocity based on charge - positive particles move more
  const velocityMultiplier = charge === 'positive' ? 2 : charge === 'negative' ? 0.5 : 1;
  
  return {
    id: generateId(),
    x,
    y,
    vx: (Math.random() - 0.5) * velocityMultiplier,
    vy: (Math.random() - 0.5) * velocityMultiplier,
    radius: 3 + Math.random() * 2,
    mass: 1 + Math.random() * 4,
    charge,
    color: getParticleColor(charge),
    energy: options.energy !== undefined ? options.energy : Math.random() * 100,
    intent: options.intent !== undefined ? options.intent : Math.random(),
    complexity: options.complexity !== undefined ? options.complexity : 0,
    isPostInflation: false,
    knowledgeLevel: 0,
    lifetime: 0,
    interactionCount: 0,
    type: options.type || 'standard',
    
    // Add missing properties that are used in the code
    knowledge: 0,
    lastInteraction: 0,
    age: 0,
    interactions: 0,
    interactionTendency: Math.random()
  };
};

// Get a color based on the particle's charge
export const getParticleColor = (charge: 'positive' | 'negative' | 'neutral'): string => {
  switch (charge) {
    case 'positive':
      return '#4ECDC4'; // Teal
    case 'negative':
      return '#FF6B6B'; // Red
    case 'neutral':
      return '#5E60CE'; // Purple
    default:
      return '#FFFFFF'; // White
  }
};

// Calculate distance between two particles
export const calculateDistance = (p1: Particle, p2: Particle): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Check if two particles are interacting based on distance
export const areParticlesInteracting = (
  p1: Particle,
  p2: Particle,
  interactionRadius: number
): boolean => {
  return calculateDistance(p1, p2) < interactionRadius;
};

// Calculate the knowledge exchange between two particles
export const calculateKnowledgeExchange = (p1: Particle, p2: Particle): number => {
  // Higher intent means more knowledge exchange
  const baseExchange = (p1.intent || 0) * (p2.intent || 0) * 0.1;
  
  // Positive particles are better at exchanging knowledge
  const chargeMultiplier = 
    p1.charge === 'positive' && p2.charge === 'positive' ? 2 :
    p1.charge === 'negative' && p2.charge === 'negative' ? 0.5 :
    1;
  
  return baseExchange * chargeMultiplier;
};

// Update particle's knowledge based on interactions
export const updateParticleKnowledge = (
  particle: Particle, 
  knowledgeGain: number
): Particle => {
  return {
    ...particle,
    knowledgeLevel: (particle.knowledgeLevel || 0) + knowledgeGain,
    complexity: (particle.complexity || 0) + (knowledgeGain * 0.01)
  };
};

// Add the missing functions required by other files
export const updateParticlePosition = (
  particle: Particle,
  dimensions: { width: number; height: number },
  intentField?: number[][][],
  viewMode: '2d' | '3d' = '2d',
  nearbyParticles?: Particle[]
): Particle => {
  // Implementation
  const newParticle = { ...particle };
  
  // Basic position update
  newParticle.x += particle.vx;
  newParticle.y += particle.vy;
  
  // Boundary checks
  if (newParticle.x < 0 || newParticle.x > dimensions.width) {
    newParticle.vx = -newParticle.vx;
  }
  if (newParticle.y < 0 || newParticle.y > dimensions.height) {
    newParticle.vy = -newParticle.vy;
  }
  
  // Ensure within bounds
  newParticle.x = Math.max(0, Math.min(dimensions.width, newParticle.x));
  newParticle.y = Math.max(0, Math.min(dimensions.height, newParticle.y));
  
  return newParticle;
};

export const calculateParticleInteraction = (
  p1: Particle,
  p2: Particle,
  learningRate: number = 0.1,
  viewMode: '2d' | '3d' = '2d'
): [Particle, Particle, boolean] => {
  const distance = calculateDistance(p1, p2);
  const interactionRadius = (p1.radius || 5) + (p2.radius || 5) + 10;
  
  if (distance > interactionRadius) {
    return [p1, p2, false];
  }
  
  // Create copies to modify
  const newP1 = { ...p1 };
  const newP2 = { ...p2 };
  
  // Update interaction counts
  newP1.interactionCount = (newP1.interactionCount || 0) + 1;
  newP2.interactionCount = (newP2.interactionCount || 0) + 1;
  
  // Update last interaction time
  newP1.lastInteraction = Date.now();
  newP2.lastInteraction = Date.now();
  
  // Update interactions count
  newP1.interactions = (newP1.interactions || 0) + 1;
  newP2.interactions = (newP2.interactions || 0) + 1;
  
  return [newP1, newP2, true];
};

export const analyzeParticleClusters = (particles: Particle[]) => {
  // Simple implementation for now
  return {
    clusterCount: Math.max(1, Math.floor(particles.length / 10)),
    averageClusterSize: particles.length / Math.max(1, Math.floor(particles.length / 10)),
    clusterLifetime: 0,
    informationDensity: 0.5,
    kolmogorovComplexity: 0.3
  };
};

export const calculateSystemEntropy = (particles: Particle[], intentField: number[][][]) => {
  // Simple implementation
  return {
    systemEntropy: 0.5,
    shannonEntropy: 0.4,
    spatialEntropy: 0.6,
    fieldOrderParameter: 0.7,
    temporalEntropy: 0.3
  };
};

export const detectAnomalies = (
  particles: Particle[],
  previousState: any,
  currentState: any,
  frameCount: number
): AnomalyEvent[] => {
  const anomalies: AnomalyEvent[] = [];
  
  // Simple detection logic
  if (particles.length > 50 && Math.random() < 0.01) {
    anomalies.push({
      type: 'particle_cluster_formation',
      timestamp: frameCount,
      description: 'A cluster of particles has formed, showing emergent behavior.',
      severity: Math.random(),
      affectedParticles: Math.floor(particles.length * 0.2)
    });
  }
  
  return anomalies;
};

// Properly export Particle type
export type { Particle };
