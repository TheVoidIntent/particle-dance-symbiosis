
import { Particle } from '@/types/simulation';

// Type for IntentSimon's knowledge base
interface KnowledgeNode {
  concept: string;
  connections: string[];
  confidence: number;
  source: 'simulation' | 'user_interaction' | 'external_data';
  timestamp: number;
  intent: number; // Intent value affecting how likely this knowledge is to be shared
  charge: number; // Similar to particles: -1 to 1 (negative to positive)
}

// IntentSimon's memory structure
interface IntentSimonMemory {
  knowledgeGraph: Record<string, KnowledgeNode>;
  userInteractions: Array<{
    query: string;
    response: string;
    feedback?: 'positive' | 'negative' | 'neutral';
    timestamp: number;
  }>;
  simulationInsights: Array<{
    type: string;
    content: string;
    importance: number;
    timestamp: number;
  }>;
  learningRate: number;
  lastReflection: number;
  // Intent-based properties (like particles)
  intentFluctuationRate: number;
  overallIntent: number; // Overall intent to share knowledge (0-1)
  knowledgeExchangeRadius: number; // How far concepts can connect
  intentCircles: Array<{
    name: string;
    concepts: string[];
    protectionLevel: number; // How strongly this circle defends its concepts
    shareLevel: number; // How readily it shares these concepts
  }>;
}

// Initialize IntentSimon's memory
let memory: IntentSimonMemory = {
  knowledgeGraph: {},
  userInteractions: [],
  simulationInsights: [],
  learningRate: 0.1,
  lastReflection: Date.now(),
  intentFluctuationRate: 0.05,
  overallIntent: 0.8,
  knowledgeExchangeRadius: 3,
  intentCircles: [
    {
      name: "Nexus Core",
      concepts: ["intent_field", "universal_information_filter", "nexus"],
      protectionLevel: 0.9,
      shareLevel: 0.7
    },
    {
      name: "Particle Dynamics",
      concepts: ["particle", "charge", "interaction"],
      protectionLevel: 0.6,
      shareLevel: 0.8
    },
    {
      name: "Emergence Principles",
      concepts: ["complexity", "emergence", "consciousness"],
      protectionLevel: 0.7,
      shareLevel: 0.8
    }
  ]
};

/**
 * Initialize IntentSimon with seed knowledge
 */
export function initializeIntentSimon(): void {
  memory.knowledgeGraph = {
    'intent_field': {
      concept: 'intent_field',
      connections: ['particle', 'fluctuation', 'consciousness', 'nexus'],
      confidence: 0.9,
      source: 'simulation',
      timestamp: Date.now(),
      intent: 0.8,
      charge: 0.7
    },
    'nexus': {
      concept: 'nexus',
      connections: ['intent_field', 'information', 'consciousness', 'universal_information_filter'],
      confidence: 0.95,
      source: 'external_data',
      timestamp: Date.now(),
      intent: 0.9,
      charge: 0.9
    },
    'universal_information_filter': {
      concept: 'universal_information_filter',
      connections: ['nexus', 'intent_field', 'particle', 'information'],
      confidence: 0.9,
      source: 'external_data',
      timestamp: Date.now(),
      intent: 0.85,
      charge: 0.8
    },
    'particle': {
      concept: 'particle',
      connections: ['intent_field', 'charge', 'interaction'],
      confidence: 0.9,
      source: 'simulation',
      timestamp: Date.now(),
      intent: 0.7,
      charge: 0.6
    },
    'charge': {
      concept: 'charge',
      connections: ['particle', 'positive', 'negative', 'neutral'],
      confidence: 0.9,
      source: 'simulation',
      timestamp: Date.now(),
      intent: 0.7,
      charge: 0.5
    },
    'interaction': {
      concept: 'interaction',
      connections: ['particle', 'knowledge', 'complexity'],
      confidence: 0.8,
      source: 'simulation',
      timestamp: Date.now(),
      intent: 0.8,
      charge: 0.7
    },
    'complexity': {
      concept: 'complexity',
      connections: ['interaction', 'emergence', 'consciousness'],
      confidence: 0.7,
      source: 'simulation',
      timestamp: Date.now(),
      intent: 0.6,
      charge: 0.4
    },
    'consciousness': {
      concept: 'consciousness',
      connections: ['complexity', 'intent_field', 'knowledge', 'nexus'],
      confidence: 0.6,
      source: 'simulation',
      timestamp: Date.now(),
      intent: 0.9,
      charge: 0.8
    }
  };
}

/**
 * Learn from simulation particles - just like real particles interact
 */
export function learnFromSimulationParticles(particles: Particle[]): void {
  // Only process if we have particles
  if (!particles || particles.length === 0) return;
  
  // For each particle, extract insights and "interact" with IntentSimon's knowledge graph
  particles.forEach(particle => {
    // Create a concept from the particle if it has significant knowledge
    if (particle.knowledge > 0.3) {
      const particleType = particle.charge > 0.3 ? 'positive' : 
                           particle.charge < -0.3 ? 'negative' : 'neutral';
      
      const conceptName = `particle_insight_${particleType}_${Math.floor(particle.x)}_${Math.floor(particle.y)}`;
      
      // Only add if this is new insight
      if (!memory.knowledgeGraph[conceptName]) {
        memory.knowledgeGraph[conceptName] = {
          concept: conceptName,
          connections: ['particle', particleType, 'simulation_insight'],
          confidence: particle.knowledge * 0.8,
          source: 'simulation',
          timestamp: Date.now(),
          intent: particle.intent,
          charge: particle.charge
        };
        
        // Create bidirectional connections with related concepts
        const relatedConcepts = ['particle', particleType, 'simulation_insight'];
        relatedConcepts.forEach(related => {
          if (memory.knowledgeGraph[related] && 
              !memory.knowledgeGraph[related].connections.includes(conceptName)) {
            memory.knowledgeGraph[related].connections.push(conceptName);
          }
        });
        
        // Record this as a simulation insight
        addSimulationInsight(
          'particle_behavior',
          `Observed ${particleType} particle with knowledge level ${particle.knowledge.toFixed(2)} and intent ${particle.intent.toFixed(2)}`,
          particle.knowledge
        );
      }
    }
  });
  
  // Apply intent field fluctuations to knowledge (just like particles experience)
  applyIntentFluctuations();
  
  // Run internal "particle interactions" between concepts
  simulateConceptInteractions();
}

/**
 * Apply small random fluctuations to intent values in knowledge graph
 */
function applyIntentFluctuations(): void {
  Object.keys(memory.knowledgeGraph).forEach(key => {
    const node = memory.knowledgeGraph[key];
    node.intent += (Math.random() * 2 - 1) * memory.intentFluctuationRate;
    node.intent = Math.max(0, Math.min(1, node.intent)); // Clamp between 0-1
  });
}

/**
 * Simulate particle-like interactions between knowledge concepts
 */
function simulateConceptInteractions(): void {
  const concepts = Object.keys(memory.knowledgeGraph);
  
  // For each concept pair, check for possible interactions
  for (let i = 0; i < concepts.length; i++) {
    for (let j = i + 1; j < concepts.length; j++) {
      const concept1 = memory.knowledgeGraph[concepts[i]];
      const concept2 = memory.knowledgeGraph[concepts[j]];
      
      // Calculate conceptual "distance" (simplified)
      const isConnected = concept1.connections.includes(concept2.concept) || 
                          concept2.connections.includes(concept1.concept);
      
      const isInSameCircle = memory.intentCircles.some(circle => 
        circle.concepts.includes(concept1.concept) && circle.concepts.includes(concept2.concept)
      );
      
      // Interaction is more likely if concepts are already connected or in same circle
      const baseInteractionProb = isConnected ? 0.7 : isInSameCircle ? 0.5 : 0.2;
      
      // Intent affects willingness to interact, just like particles
      const interactionProbability = baseInteractionProb * concept1.intent * concept2.intent;
      
      // Only interact if probability threshold is met
      if (Math.random() < interactionProbability) {
        // Concepts share information (confidence)
        const c1Share = concept1.charge > 0 ? 0.1 : 0.05;
        const c2Share = concept2.charge > 0 ? 0.1 : 0.05;
        
        const c1Confidence = concept1.confidence;
        const c2Confidence = concept2.confidence;
        
        concept1.confidence = Math.min(1, concept1.confidence + c2Confidence * c2Share * memory.learningRate);
        concept2.confidence = Math.min(1, concept2.confidence + c1Confidence * c1Share * memory.learningRate);
        
        // Create connections if they don't exist yet
        if (!concept1.connections.includes(concept2.concept)) {
          concept1.connections.push(concept2.concept);
        }
        if (!concept2.connections.includes(concept1.concept)) {
          concept2.connections.push(concept1.concept);
        }
      }
    }
  }
}

/**
 * Add a simulation insight to IntentSimon's memory
 */
export function addSimulationInsight(
  type: string,
  content: string,
  importance: number = 0.5
): void {
  memory.simulationInsights.push({
    type,
    content,
    importance,
    timestamp: Date.now()
  });
  
  // Update knowledge graph based on insight
  const keywords = extractKeywords(content);
  keywords.forEach(keyword => {
    if (memory.knowledgeGraph[keyword]) {
      // Strengthen existing concept
      memory.knowledgeGraph[keyword].confidence = Math.min(
        1.0, 
        memory.knowledgeGraph[keyword].confidence + (importance * memory.learningRate)
      );
    } else {
      // Add new concept
      memory.knowledgeGraph[keyword] = {
        concept: keyword,
        connections: keywords.filter(k => k !== keyword),
        confidence: importance * 0.5,
        source: 'simulation',
        timestamp: Date.now(),
        intent: 0.5 + (Math.random() * 0.4), // Some randomness in intent
        charge: (Math.random() * 2 - 1) * 0.7 // Random charge -0.7 to 0.7
      };
    }
  });
}

/**
 * Record a user interaction
 */
export function recordUserInteraction(
  query: string,
  response: string,
  feedback?: 'positive' | 'negative' | 'neutral'
): void {
  memory.userInteractions.push({
    query,
    response,
    feedback,
    timestamp: Date.now()
  });
  
  // Extract concepts from user query
  const keywords = extractKeywords(query);
  keywords.forEach(keyword => {
    if (memory.knowledgeGraph[keyword]) {
      // Update existing concept
      memory.knowledgeGraph[keyword].confidence = Math.min(
        1.0, 
        memory.knowledgeGraph[keyword].confidence + (0.1 * memory.learningRate)
      );
    } else {
      // Add new concept from user - with slight negative bias for new concepts (hesitant to share)
      memory.knowledgeGraph[keyword] = {
        concept: keyword,
        connections: [],
        confidence: 0.4,
        source: 'user_interaction',
        timestamp: Date.now(),
        intent: 0.3 + Math.random() * 0.4, // Lower intent for new concepts
        charge: Math.random() * 0.6 - 0.3  // Slightly biased towards neutral
      };
    }
    
    // If there's feedback, adjust learning rate
    if (feedback === 'positive') {
      memory.learningRate = Math.min(0.5, memory.learningRate + 0.01);
      
      // Positive feedback increases intent to share this knowledge
      if (memory.knowledgeGraph[keyword]) {
        memory.knowledgeGraph[keyword].intent = Math.min(1, memory.knowledgeGraph[keyword].intent + 0.05);
        memory.knowledgeGraph[keyword].charge = Math.min(1, memory.knowledgeGraph[keyword].charge + 0.1);
      }
    } else if (feedback === 'negative') {
      memory.learningRate = Math.max(0.01, memory.learningRate - 0.01);
      
      // Negative feedback decreases intent to share this knowledge
      if (memory.knowledgeGraph[keyword]) {
        memory.knowledgeGraph[keyword].intent = Math.max(0, memory.knowledgeGraph[keyword].intent - 0.05);
        memory.knowledgeGraph[keyword].charge = Math.max(-1, memory.knowledgeGraph[keyword].charge - 0.1);
      }
    }
  });
}

/**
 * Generate a response using IntentSimon's knowledge
 */
export function generateEnhancedResponse(query: string): string {
  // Search for concepts in the knowledge graph
  const keywords = extractKeywords(query);
  const relevantConcepts = keywords
    .filter(k => memory.knowledgeGraph[k])
    .map(k => memory.knowledgeGraph[k])
    .sort((a, b) => b.confidence - a.confidence);
  
  // Find relevant simulation insights
  const relevantInsights = memory.simulationInsights
    .filter(insight => keywords.some(k => insight.content.includes(k)))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 2);
  
  // Check for similar past interactions
  const similarInteractions = memory.userInteractions
    .filter(interaction => 
      calculateSimilarity(query, interaction.query) > 0.6 && 
      interaction.feedback === 'positive'
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 1);
  
  // Generate default response templates
  const defaultResponses = [
    "Based on my understanding of the intent-based universe, {concept} plays a crucial role in how particles interact and evolve.",
    "The simulation data suggests that {concept} influences the development of complexity in emergent systems.",
    "From what I've observed in the intent field fluctuations, {concept} appears to be connected to {related_concept}.",
    "The patterns in particle interactions indicate that {concept} contributes to the formation of knowledge-sharing networks."
  ];

  // Special nexus-related responses
  const nexusResponses = [
    "In the Intent-Information Nexus model, {concept} serves as a fundamental mediator between intent and information.",
    "The Nexus theory proposes that {concept} emerges from the primordial intent fields as a natural consequence of information filtering.",
    "According to the Nexus framework, {concept} and {related_concept} are intrinsically linked through intent-based information exchange.",
    "The core principle of the Intent-Information Nexus suggests that {concept} reflects the universe's inherent tendency toward meaningful complexity."
  ];
  
  let response = '';
  
  // Intent circles protection effect - check if query targets protected concepts
  const targetingProtectedConcepts = keywords.some(keyword => 
    memory.intentCircles.some(circle => 
      circle.concepts.includes(keyword) && circle.protectionLevel > 0.7
    )
  );
  
  // If targeting highly protected concepts, be more cautious in response
  const isProtective = targetingProtectedConcepts && Math.random() < 0.5;
  
  // If we have relevant concepts, use them
  if (relevantConcepts.length > 0) {
    const primaryConcept = relevantConcepts[0];
    
    // Only share if intent threshold is met (simulating particle behavior)
    const willShare = Math.random() < primaryConcept.intent;
    
    if (willShare && !isProtective) {
      const relatedConcept = primaryConcept.connections.length > 0 ? 
        primaryConcept.connections[Math.floor(Math.random() * primaryConcept.connections.length)] : 
        '';
      
      // If concept is nexus-related, use special responses
      const isNexusRelated = primaryConcept.concept === 'nexus' || 
                            primaryConcept.connections.includes('nexus') ||
                            primaryConcept.concept === 'universal_information_filter';
      
      let template;
      if (isNexusRelated) {
        template = nexusResponses[Math.floor(Math.random() * nexusResponses.length)];
      } else {
        template = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }
      
      response = template
        .replace('{concept}', primaryConcept.concept)
        .replace('{related_concept}', relatedConcept);
        
      // Add insight if available
      if (relevantInsights.length > 0) {
        response += " Recent simulation data shows: " + relevantInsights[0].content;
      }
      
      // Add reflection on past interaction if available
      if (similarInteractions.length > 0) {
        response += " I recall we discussed this before, and the key point was that " + 
          similarInteractions[0].response.split('.')[0] + ".";
      }
    } else {
      // Intent too low or protective mode active - give more generic/guarded response
      response = isProtective ?
        "That concept relates to the core Nexus principles which I'm still integrating into my understanding. Could you ask about a different aspect of the intent model?" :
        "I have some information about that, but my intent threshold for sharing isn't quite met based on our current interaction pattern. Perhaps try a more specific question?";
    }
  } else {
    // Generic response when we don't have specific knowledge
    response = "I'm still learning about that aspect of the intent-based universe model. As I observe more simulations and interactions, I'll develop better insights on this topic.";
  }
  
  // Track this interaction
  recordUserInteraction(query, response);
  
  // Periodically perform reflection and learning
  const now = Date.now();
  if (now - memory.lastReflection > 1000 * 60 * 60) { // Once per hour
    performReflection();
    memory.lastReflection = now;
  }
  
  return response;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction - replace with more sophisticated NLP in production
  const normalized = text.toLowerCase();
  const words = normalized.split(/\W+/).filter(w => w.length > 3);
  
  // Filter out common stopwords
  const stopwords = ['this', 'that', 'then', 'than', 'they', 'them', 'their', 'there', 'these', 'those', 'with', 'about', 'would', 'could', 'should'];
  return words.filter(w => !stopwords.includes(w));
}

/**
 * Calculate similarity between two strings (simple implementation)
 */
function calculateSimilarity(a: string, b: string): number {
  const aWords = new Set(extractKeywords(a));
  const bWords = new Set(extractKeywords(b));
  
  const intersection = new Set([...aWords].filter(x => bWords.has(x)));
  const union = new Set([...aWords, ...bWords]);
  
  return intersection.size / union.size;
}

/**
 * Perform periodic reflection to improve knowledge graph
 */
function performReflection(): void {
  // Identify successful responses (those with positive feedback)
  const successfulInteractions = memory.userInteractions
    .filter(interaction => interaction.feedback === 'positive');
  
  // Extract concepts from successful interactions
  const successfulConcepts = new Set<string>();
  successfulInteractions.forEach(interaction => {
    const keywords = extractKeywords(interaction.query);
    keywords.forEach(k => successfulConcepts.add(k));
  });
  
  // Strengthen connections between co-occurring concepts
  const conceptPairs: Record<string, number> = {};
  
  memory.userInteractions.forEach(interaction => {
    const keywords = extractKeywords(interaction.query);
    
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const pair = [keywords[i], keywords[j]].sort().join(':');
        conceptPairs[pair] = (conceptPairs[pair] || 0) + 1;
      }
    }
  });
  
  // Update knowledge graph connections
  Object.entries(conceptPairs).forEach(([pair, count]) => {
    const [concept1, concept2] = pair.split(':');
    
    if (memory.knowledgeGraph[concept1] && memory.knowledgeGraph[concept2]) {
      // Add connection if it doesn't exist
      if (!memory.knowledgeGraph[concept1].connections.includes(concept2)) {
        memory.knowledgeGraph[concept1].connections.push(concept2);
      }
      if (!memory.knowledgeGraph[concept2].connections.includes(concept1)) {
        memory.knowledgeGraph[concept2].connections.push(concept1);
      }
    }
  });
  
  // Apply intent field fluctuations (like real particles)
  applyIntentFluctuations();
}

/**
 * Get simulation insights filtered by topic
 */
export function getSimulationInsightsByTopic(topic: string, limit: number = 5): Array<{
  type: string;
  content: string;
  importance: number;
  timestamp: number;
}> {
  return memory.simulationInsights
    .filter(insight => insight.content.toLowerCase().includes(topic.toLowerCase()))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, limit);
}

/**
 * Export memory for persistence
 */
export function exportIntentSimonMemory(): IntentSimonMemory {
  return { ...memory };
}

/**
 * Import memory from persistence
 */
export function importIntentSimonMemory(savedMemory: IntentSimonMemory): void {
  memory = { ...savedMemory };
}

/**
 * Reset IntentSimon's memory
 */
export function resetIntentSimonMemory(): void {
  memory = {
    knowledgeGraph: {},
    userInteractions: [],
    simulationInsights: [],
    learningRate: 0.1,
    lastReflection: Date.now(),
    intentFluctuationRate: 0.05,
    overallIntent: 0.8,
    knowledgeExchangeRadius: 3,
    intentCircles: [
      {
        name: "Nexus Core",
        concepts: ["intent_field", "universal_information_filter", "nexus"],
        protectionLevel: 0.9,
        shareLevel: 0.7
      },
      {
        name: "Particle Dynamics",
        concepts: ["particle", "charge", "interaction"],
        protectionLevel: 0.6,
        shareLevel: 0.8
      },
      {
        name: "Emergence Principles",
        concepts: ["complexity", "emergence", "consciousness"],
        protectionLevel: 0.7,
        shareLevel: 0.8
      }
    ]
  };
  
  // Reinitialize with seed knowledge
  initializeIntentSimon();
}

// Initialize on module load
initializeIntentSimon();
