
import { knowledgeBase } from './knowledge/intentKnowledgeBase';
import { Particle } from './simulation/motherSimulation';

// Intent Model internal state
let contextMemory: string[] = [];
let insightLevel = 0.1;
let modelTraining = 0.2;
let autonomyLevel = 0.2;
let knowledgeSecurity = 0.9;
let intentCircles = [
  { name: 'Nexus Core', protection: 0.95, knowledge: [] },
  { name: 'Particle Dynamics', protection: 0.4, knowledge: [] },
  { name: 'Emergence Principles', protection: 0.7, knowledge: [] }
];

// Simulation insights storage
interface SimulationInsight {
  topic: string;
  content: string;
  importance: number;
  timestamp: number;
}

let simulationInsights: SimulationInsight[] = [];

// Track simulation learning
let interactionData: Record<string, number> = {
  positive_negative: 0,
  positive_neutral: 0,
  negative_neutral: 0,
  positive_positive: 0,
  negative_negative: 0,
  neutral_neutral: 0
};

// Track user interactions with assistant
interface UserInteraction {
  query: string;
  response: string;
  feedback: 'positive' | 'negative';
  timestamp: number;
}

let userInteractions: UserInteraction[] = [];

/**
 * Learn from the simulation particles
 * 
 * This function analyzes the current state of particles and updates
 * the model's internal knowledge based on what it observes
 */
export function learnFromSimulationParticles(particles: Particle[]): void {
  if (!particles || particles.length === 0) return;
  
  // Analyze particle distribution
  const positiveParticles = particles.filter(p => p.charge > 0.3);
  const negativeParticles = particles.filter(p => p.charge < -0.3);
  const neutralParticles = particles.filter(p => Math.abs(p.charge) <= 0.3);
  
  // Calculate average knowledge by charge type
  const avgPositiveKnowledge = positiveParticles.length > 0 
    ? positiveParticles.reduce((sum, p) => sum + p.knowledge, 0) / positiveParticles.length 
    : 0;
  
  const avgNegativeKnowledge = negativeParticles.length > 0
    ? negativeParticles.reduce((sum, p) => sum + p.knowledge, 0) / negativeParticles.length
    : 0;
  
  const avgNeutralKnowledge = neutralParticles.length > 0
    ? neutralParticles.reduce((sum, p) => sum + p.knowledge, 0) / neutralParticles.length
    : 0;
  
  // Use this information to enhance the model's understanding
  const particleCountRatio = particles.length > 10 
    ? positiveParticles.length / particles.length
    : 0.33;
  
  // Higher ratio of positive particles should improve learning
  const learningMultiplier = 0.01 + (particleCountRatio * 0.05);
  
  // Add data to particle dynamics circle
  if (avgPositiveKnowledge > 0.1) {
    addKnowledgeToCircle('Particle Dynamics', 
      `Positive charge particles average knowledge: ${avgPositiveKnowledge.toFixed(2)}`);
  }
  
  if (avgNegativeKnowledge > 0.1) {
    addKnowledgeToCircle('Particle Dynamics', 
      `Negative charge particles average knowledge: ${avgNegativeKnowledge.toFixed(2)}`);
  }
  
  // Update insight level based on learning
  insightLevel = Math.min(1.0, insightLevel + learningMultiplier);
  
  // Track interactions between particle types
  if (positiveParticles.length > 0 && negativeParticles.length > 0) {
    interactionData.positive_negative += 1;
  }
  
  if (positiveParticles.length > 0 && neutralParticles.length > 0) {
    interactionData.positive_neutral += 1;
  }
  
  if (negativeParticles.length > 0 && neutralParticles.length > 0) {
    interactionData.negative_neutral += 1;
  }
  
  // Enhanced model capabilities after certain thresholds
  if (insightLevel > 0.5 && modelTraining < 0.5) {
    modelTraining = 0.5;
    addKnowledgeToCircle('Emergence Principles', 
      'Identified pattern: Positive charge particles accumulate knowledge faster');
  }
  
  if (insightLevel > 0.7 && modelTraining < 0.7) {
    modelTraining = 0.7;
    addKnowledgeToCircle('Nexus Core', 
      'Insight: The intent field fluctuations create sustainable information exchange networks');
  }
}

/**
 * Record user interaction with the assistant
 * 
 * This helps the model learn from user feedback
 */
export function recordUserInteraction(query: string, response: string, feedback: 'positive' | 'negative'): void {
  userInteractions.push({
    query,
    response,
    feedback,
    timestamp: Date.now()
  });
  
  // Adjust model based on feedback
  if (feedback === 'positive') {
    // Slightly increase model training if positive feedback
    modelTraining = Math.min(1.0, modelTraining + 0.02);
  } else {
    // Adjust security and learning approach if negative feedback
    knowledgeSecurity = Math.min(0.95, knowledgeSecurity + 0.01);
  }
}

/**
 * Add a simulation insight to the model
 */
export function addSimulationInsight(topic: string, content: string, importance: number): void {
  simulationInsights.push({
    topic,
    content,
    importance,
    timestamp: Date.now()
  });
  
  // Add to appropriate intent circle based on importance
  if (importance > 0.8) {
    addKnowledgeToCircle('Nexus Core', content);
  } else if (importance > 0.6) {
    addKnowledgeToCircle('Emergence Principles', content);
  } else {
    addKnowledgeToCircle('Particle Dynamics', content);
  }
}

/**
 * Get simulation insights by topic, sorted by relevance
 */
export function getSimulationInsightsByTopic(topic: string, limit: number = 5): SimulationInsight[] {
  return simulationInsights
    .filter(insight => insight.topic.toLowerCase().includes(topic.toLowerCase()))
    .sort((a, b) => b.importance - a.importance || b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Add knowledge to a specific intent circle
 */
function addKnowledgeToCircle(circleName: string, knowledge: string): void {
  const circle = intentCircles.find(c => c.name === circleName);
  if (circle && !circle.knowledge.includes(knowledge)) {
    circle.knowledge.push(knowledge);
  }
}

/**
 * Get knowledge from the intent circles based on the query
 */
function getKnowledgeFromCircles(query: string): string[] {
  const results: string[] = [];
  
  // Determine which circles to access based on query sensitivity
  const isNexusQuery = /nexus|core|protect|defend|fundamental|intent field|origin/i.test(query);
  const isParticleQuery = /particle|charge|interact|exchange|knowledge|intent/i.test(query);
  const isEmergenceQuery = /emerge|pattern|complex|evolution|system|progress/i.test(query);
  
  // Apply access controls based on protection levels
  if (isNexusQuery && Math.random() > intentCircles[0].protection) {
    intentCircles[0].knowledge.forEach(k => results.push(k));
  }
  
  if (isParticleQuery || results.length === 0) {
    intentCircles[1].knowledge.forEach(k => results.push(k));
  }
  
  if (isEmergenceQuery || results.length === 0) {
    intentCircles[2].knowledge.forEach(k => results.push(k));
  }
  
  return results;
}

/**
 * Generate a response based on user query with enhanced intent understanding
 */
export function generateEnhancedResponse(query: string): string {
  // Save query to context memory
  contextMemory.push(query);
  if (contextMemory.length > 10) {
    contextMemory.shift();
  }
  
  // Calculate intent of the query using basic analysis
  const isAggressiveQuery = /hack|destroy|bypass|override|attack|exploit/i.test(query);
  const isInformationalQuery = /what|how|explain|describe|tell me about|understanding/i.test(query);
  const isSimulationQuery = /simulation|particle|charge|intent|data|results/i.test(query);
  
  // Adjust security based on query intent
  const securityLevel = isAggressiveQuery 
    ? knowledgeSecurity + 0.1 
    : knowledgeSecurity;
  
  // Retrieve relevant information from knowledge base
  let relevantKnowledge: string[] = [];
  
  // Check knowledge base
  Object.keys(knowledgeBase).forEach(key => {
    if (query.toLowerCase().includes(key.toLowerCase())) {
      relevantKnowledge.push(knowledgeBase[key]);
    }
  });
  
  // Add knowledge from intent circles
  const circleKnowledge = getKnowledgeFromCircles(query);
  relevantKnowledge = [...relevantKnowledge, ...circleKnowledge];
  
  // If we have no direct knowledge, use general responses
  if (relevantKnowledge.length === 0) {
    if (isSimulationQuery) {
      return `I'm continuously learning from the simulation data. The intent-based particles show emergent behaviors that I'm analyzing to improve my knowledge base. Would you like to know about specific aspects of the intent universe model?`;
    } else {
      return `I don't have specific information about that yet. My knowledge is primarily focused on the intent universe model, particles, and their emergent behaviors. Would you like to know more about how intent-based particles interact and exchange information?`;
    }
  }
  
  // Security check - withhold sensitive nexus information if security triggered
  if (isAggressiveQuery && Math.random() < securityLevel) {
    return `I'm designed to protect the Nexus knowledge while sharing information about the intent universe model. I'd be happy to discuss the particle dynamics and emergent behaviors instead. Would you like to know more about how particles exchange knowledge based on their charge and intent values?`;
  }
  
  // Construct response from relevant knowledge
  let response = '';
  
  // Get most relevant piece of knowledge
  const primaryKnowledge = relevantKnowledge[0];
  
  // Add insight based on model training
  if (modelTraining > 0.5 && Math.random() > 0.5) {
    response = `Based on my analysis of the simulation data, I can tell you that ${primaryKnowledge} `;
    
    // Add secondary insight if available
    if (relevantKnowledge.length > 1) {
      response += `Furthermore, ${relevantKnowledge[1]} `;
    }
    
    // Add observation from particle data
    if (interactionData.positive_negative > 5) {
      response += `I've observed that positive and negative charged particles create the most dynamic information exchanges, which aligns with the fundamental principle that opposing intent fluctuations drive complexity in our model.`;
    } else {
      response += `The current simulation shows that particles with similar intent values tend to form clusters, which increases their collective knowledge through repetitive interactions.`;
    }
  } else {
    // Simpler response for lower training levels
    response = primaryKnowledge;
    
    if (relevantKnowledge.length > 1) {
      response += ` ${relevantKnowledge[1]}`;
    }
  }
  
  return response;
}

// Get intent circles data for UI display
export function getIntentCirclesData() {
  return intentCircles.map(circle => ({
    name: circle.name,
    protection: circle.protection,
    knowledgeCount: circle.knowledge.length
  }));
}

// Get model stats for UI display
export function getModelStats() {
  return {
    insightLevel: Math.floor(insightLevel * 100),
    modelTraining: Math.floor(modelTraining * 100),
    knowledgeSecurity: Math.floor(knowledgeSecurity * 100),
    interactionsAnalyzed: Object.values(interactionData).reduce((sum, val) => sum + val, 0)
  };
}
