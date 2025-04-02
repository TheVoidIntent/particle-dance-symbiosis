
import { Particle } from '@/types/simulation';

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
    type: options.type || 'standard'
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

// Make a type-safe version of Particle for export
export type { Particle };
