
import { Particle } from '@/types/simulation';

// Type for IntentSimon's knowledge base
interface KnowledgeNode {
  concept: string;
  connections: string[];
  confidence: number;
  source: 'simulation' | 'user_interaction' | 'external_data';
  timestamp: number;
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
}

// Initialize IntentSimon's memory
let memory: IntentSimonMemory = {
  knowledgeGraph: {},
  userInteractions: [],
  simulationInsights: [],
  learningRate: 0.1,
  lastReflection: Date.now()
};

/**
 * Initialize IntentSimon with seed knowledge
 */
export function initializeIntentSimon(): void {
  memory.knowledgeGraph = {
    'intent_field': {
      concept: 'intent_field',
      connections: ['particle', 'fluctuation', 'consciousness'],
      confidence: 0.9,
      source: 'simulation',
      timestamp: Date.now()
    },
    'particle': {
      concept: 'particle',
      connections: ['intent_field', 'charge', 'interaction'],
      confidence: 0.9,
      source: 'simulation',
      timestamp: Date.now()
    },
    'charge': {
      concept: 'charge',
      connections: ['particle', 'positive', 'negative', 'neutral'],
      confidence: 0.9,
      source: 'simulation',
      timestamp: Date.now()
    },
    'interaction': {
      concept: 'interaction',
      connections: ['particle', 'knowledge', 'complexity'],
      confidence: 0.8,
      source: 'simulation',
      timestamp: Date.now()
    },
    'complexity': {
      concept: 'complexity',
      connections: ['interaction', 'emergence', 'consciousness'],
      confidence: 0.7,
      source: 'simulation',
      timestamp: Date.now()
    },
    'consciousness': {
      concept: 'consciousness',
      connections: ['complexity', 'intent_field', 'knowledge'],
      confidence: 0.6,
      source: 'simulation',
      timestamp: Date.now()
    }
  };
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
        timestamp: Date.now()
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
      // Add new concept from user
      memory.knowledgeGraph[keyword] = {
        concept: keyword,
        connections: [],
        confidence: 0.4,
        source: 'user_interaction',
        timestamp: Date.now()
      };
    }
    
    // If there's feedback, adjust learning rate
    if (feedback === 'positive') {
      memory.learningRate = Math.min(0.5, memory.learningRate + 0.01);
    } else if (feedback === 'negative') {
      memory.learningRate = Math.max(0.01, memory.learningRate - 0.01);
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
  
  let response = '';
  
  // If we have relevant concepts, use them
  if (relevantConcepts.length > 0) {
    const primaryConcept = relevantConcepts[0];
    const relatedConcept = primaryConcept.connections.length > 0 ? 
      primaryConcept.connections[Math.floor(Math.random() * primaryConcept.connections.length)] : 
      '';
    
    let template = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
    lastReflection: Date.now()
  };
  
  // Reinitialize with seed knowledge
  initializeIntentSimon();
}

// Initialize on module load
initializeIntentSimon();
