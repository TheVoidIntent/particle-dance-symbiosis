
import { Particle } from '@/types/simulation';

/**
 * Calculates a neural network-based affinity between two particles
 * @param p1 First particle
 * @param p2 Second particle
 * @returns Affinity score between 0 and 1
 */
export function calculateParticleAffinity(p1: Particle, p2: Particle): number {
  // Get all necessary properties with fallbacks for optional properties
  const p1Intent = p1.intent ?? 0;
  const p2Intent = p2.intent ?? 0;
  const p1Knowledge = p1.knowledge ?? 0;
  const p2Knowledge = p2.knowledge ?? 0;
  const p1Complexity = p1.complexity ?? 0;
  const p2Complexity = p2.complexity ?? 0;
  const p1Age = p1.age ?? 0;
  const p2Age = p2.age ?? 0;
  
  // Calculate feature similarity
  const intentSimilarity = 1 - Math.abs(p1Intent - p2Intent) / Math.max(p1Intent, p2Intent, 1);
  const knowledgeDiff = Math.abs(p1Knowledge - p2Knowledge);
  const knowledgeComplement = knowledgeDiff / Math.max(p1Knowledge + p2Knowledge, 1);
  const complexitySynergy = Math.min(p1Complexity, p2Complexity) / Math.max(p1Complexity, p2Complexity, 1);
  
  // Consider interaction history
  const p1Interactions = p1.interactions ?? 0;
  const p2Interactions = p2.interactions ?? 0;
  const experienceFactor = Math.min(1, (p1Interactions + p2Interactions) / 100);
  
  // Calculate charge compatibility
  let chargeCompatibility = 0.5; // Neutral default value
  
  if (p1.charge === 'positive' && p2.charge === 'negative') {
    chargeCompatibility = 0.9; // Opposites attract strongly
  } else if (p1.charge === 'negative' && p2.charge === 'positive') {
    chargeCompatibility = 0.9;
  } else if (p1.charge === p2.charge) {
    if (p1.charge === 'positive') {
      chargeCompatibility = 0.6; // Positive charges still somewhat interact
    } else if (p1.charge === 'negative') {
      chargeCompatibility = 0.2; // Negative charges repel each other
    } else {
      chargeCompatibility = 0.5; // Neutral with neutral is mid-range
    }
  } else if (p1.charge === 'neutral' || p2.charge === 'neutral') {
    chargeCompatibility = 0.5; // One neutral means medium compatibility
  }
  
  // Age compatibility - particles with similar age might interact differently
  const ageRatio = Math.min(p1Age, p2Age) / (Math.max(p1Age, p2Age) || 1);
  const ageFactor = 0.3 + (0.7 * ageRatio); // Age similarity contributes up to 70%
  
  // Calculate weighted affinity score
  const affinity = (
    intentSimilarity * 0.3 +
    knowledgeComplement * 0.2 +
    complexitySynergy * 0.15 +
    chargeCompatibility * 0.25 +
    experienceFactor * 0.05 +
    ageFactor * 0.05
  );
  
  // Ensure the result is between 0 and 1
  return Math.max(0, Math.min(1, affinity));
}

/**
 * Predicts the emergence of complex behavior based on particle properties
 * @param particles Array of particles
 * @returns Probability of emergence (0-1)
 */
export function predictEmergence(particles: Particle[]): number {
  if (!particles.length) return 0;
  
  // Calculate key statistical properties
  const totalParticles = particles.length;
  const knowledgeSum = particles.reduce((sum, p) => sum + (p.knowledge ?? 0), 0);
  const averageKnowledge = knowledgeSum / totalParticles;
  const complexitySum = particles.reduce((sum, p) => sum + (p.complexity ?? 0), 0);
  const averageComplexity = complexitySum / totalParticles;
  const totalInteractions = particles.reduce((sum, p) => sum + (p.interactions ?? 0), 0);
  
  // Distribution of charges
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  
  const chargeDiversity = (positiveCount * negativeCount * neutralCount) / Math.pow(totalParticles, 2);
  
  // Age distribution factor
  const ages = particles.map(p => p.age ?? 0);
  const maxAge = Math.max(...ages);
  const ageDistribution = ages.reduce((sum, age) => sum + (age / maxAge), 0) / totalParticles;
  
  // Calculate emergence probability using a neural network-inspired formula
  const emergenceProbability = 
    (0.3 * averageKnowledge / 100) +
    (0.2 * averageComplexity / 10) +
    (0.15 * (totalInteractions / (totalParticles * 10))) +
    (0.25 * chargeDiversity) +
    (0.1 * ageDistribution);
  
  return Math.max(0, Math.min(1, emergenceProbability));
}

/**
 * Analyzes patterns in particle interactions to detect potential self-organization
 * @param interactionHistory Array of interaction events
 * @returns Self-organization index between 0 and 1
 */
export function analyzeInteractionPatterns(interactionHistory: any[]): number {
  // Placeholder for a more complex analysis
  // In a real implementation, this would use actual neural network techniques
  return Math.random(); // Placeholder return value
}

export default {
  calculateParticleAffinity,
  predictEmergence,
  analyzeInteractionPatterns
};
