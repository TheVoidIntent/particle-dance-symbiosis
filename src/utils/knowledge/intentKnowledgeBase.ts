
import { v4 as uuidv4 } from 'uuid';

// Define types for the knowledge system
interface KnowledgeConcept {
  id: string;
  name: string;
  description: string;
  connections: string[]; // IDs of connected concepts
  confidence: number; // 0-1 confidence level
  sourceType: 'simulation' | 'document' | 'user_interaction' | 'inference';
  created: number; // timestamp
  lastAccessed: number; // timestamp
  accessCount: number; // how often this concept has been accessed
  intentCircle: 'core' | 'protective' | 'explorative' | 'communicative' | 'reflective';
}

interface NexusDefender {
  id: string;
  role: 'guardian' | 'analyzer' | 'validator' | 'connector';
  active: boolean;
  lastTriggered: number;
  description: string;
}

// The main knowledge store
class IntentKnowledgeBase {
  private concepts: Map<string, KnowledgeConcept>;
  private defenders: NexusDefender[];
  private intentCircles: Record<string, string[]>; // Maps circle name to concept IDs
  private simulationInsights: any[]; // Store raw simulation data insights
  private documentContent: string[]; // Chunks of document content
  
  constructor() {
    this.concepts = new Map();
    this.defenders = [];
    this.intentCircles = {
      core: [],
      protective: [],
      explorative: [],
      communicative: [],
      reflective: []
    };
    this.simulationInsights = [];
    this.documentContent = [];
    
    // Initialize some defenders
    this.initializeDefenders();
  }
  
  private initializeDefenders(): void {
    this.defenders = [
      {
        id: uuidv4(),
        role: 'guardian',
        active: true,
        lastTriggered: Date.now(),
        description: 'Protects core knowledge from corruption or contradiction'
      },
      {
        id: uuidv4(),
        role: 'analyzer',
        active: true,
        lastTriggered: Date.now(),
        description: 'Analyzes new information for consistency with existing knowledge'
      },
      {
        id: uuidv4(),
        role: 'validator',
        active: true,
        lastTriggered: Date.now(),
        description: 'Validates external information against simulation results'
      },
      {
        id: uuidv4(),
        role: 'connector',
        active: true,
        lastTriggered: Date.now(),
        description: 'Forms connections between seemingly unrelated concepts'
      }
    ];
  }
  
  // Add a new concept to the knowledge base
  addConcept(
    name: string, 
    description: string, 
    sourceType: KnowledgeConcept['sourceType'],
    intentCircle: KnowledgeConcept['intentCircle'],
    confidence: number = 0.5,
    connections: string[] = []
  ): string {
    const id = uuidv4();
    const now = Date.now();
    
    const concept: KnowledgeConcept = {
      id,
      name,
      description,
      connections,
      confidence,
      sourceType,
      created: now,
      lastAccessed: now,
      accessCount: 0,
      intentCircle
    };
    
    this.concepts.set(id, concept);
    this.intentCircles[intentCircle].push(id);
    
    return id;
  }
  
  // Get a concept by ID
  getConcept(id: string): KnowledgeConcept | undefined {
    const concept = this.concepts.get(id);
    if (concept) {
      // Update access metrics
      concept.lastAccessed = Date.now();
      concept.accessCount += 1;
      this.concepts.set(id, concept);
    }
    return concept;
  }
  
  // Search for concepts by name or description
  searchConcepts(query: string): KnowledgeConcept[] {
    const results: KnowledgeConcept[] = [];
    const queryLower = query.toLowerCase();
    
    this.concepts.forEach(concept => {
      if (
        concept.name.toLowerCase().includes(queryLower) ||
        concept.description.toLowerCase().includes(queryLower)
      ) {
        // Update access metrics
        concept.lastAccessed = Date.now();
        concept.accessCount += 1;
        this.concepts.set(concept.id, concept);
        
        results.push(concept);
      }
    });
    
    return results;
  }
  
  // Connect two concepts
  connectConcepts(conceptId1: string, conceptId2: string): boolean {
    const concept1 = this.concepts.get(conceptId1);
    const concept2 = this.concepts.get(conceptId2);
    
    if (!concept1 || !concept2) return false;
    
    // Add connections if they don't already exist
    if (!concept1.connections.includes(conceptId2)) {
      concept1.connections.push(conceptId2);
      this.concepts.set(conceptId1, concept1);
    }
    
    if (!concept2.connections.includes(conceptId1)) {
      concept2.connections.push(conceptId1);
      this.concepts.set(conceptId2, concept2);
    }
    
    return true;
  }
  
  // Add simulation insight
  addSimulationInsight(insight: any): void {
    this.simulationInsights.push({
      ...insight,
      timestamp: Date.now()
    });
    
    // Process the insight to extract concepts
    if (insight.type && insight.description) {
      const conceptId = this.addConcept(
        insight.type,
        insight.description,
        'simulation',
        'explorative',
        0.7
      );
      
      // Connect to related concepts
      const relatedConcepts = this.searchConcepts(insight.type);
      relatedConcepts.forEach(related => {
        this.connectConcepts(conceptId, related.id);
      });
    }
  }
  
  // Import document content chunks
  importDocumentContent(contentChunks: string[]): void {
    this.documentContent = [...this.documentContent, ...contentChunks];
    
    // Process each chunk to extract potential concepts
    contentChunks.forEach(chunk => {
      // Simple keyword extraction (would be more sophisticated in a real implementation)
      const keywords = this.extractKeywords(chunk);
      
      keywords.forEach(keyword => {
        // For each significant keyword, create a concept
        if (keyword.length > 3) {
          const existingConcepts = this.searchConcepts(keyword);
          
          if (existingConcepts.length === 0) {
            // Create new concept
            const conceptId = this.addConcept(
              keyword,
              chunk.substring(0, 200) + "...",
              'document',
              'core',
              0.8
            );
          } else {
            // Enhance existing concept with new information
            const concept = existingConcepts[0];
            concept.confidence = Math.min(1.0, concept.confidence + 0.1);
            this.concepts.set(concept.id, concept);
          }
        }
      });
    });
  }
  
  // Extract keywords from text (simplified implementation)
  private extractKeywords(text: string): string[] {
    const stopWords = ['and', 'the', 'is', 'in', 'it', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by'];
    const words = text.toLowerCase().split(/\W+/);
    return words.filter(word => word.length > 3 && !stopWords.includes(word));
  }
  
  // Get all concepts from a specific intent circle
  getIntentCircleConcepts(circle: KnowledgeConcept['intentCircle']): KnowledgeConcept[] {
    const conceptIds = this.intentCircles[circle] || [];
    return conceptIds.map(id => this.getConcept(id)).filter(Boolean) as KnowledgeConcept[];
  }
  
  // Defend the nexus by validating new information
  defendNexus(information: string): { 
    valid: boolean; 
    confidence: number;
    defender?: NexusDefender;
    explanation: string; 
  } {
    // Activate a random defender
    const defender = this.defenders[Math.floor(Math.random() * this.defenders.length)];
    defender.lastTriggered = Date.now();
    
    // Search for relevant concepts
    const relevantConcepts = this.searchConcepts(information);
    
    // If we have no relevant information, we can't validate
    if (relevantConcepts.length === 0) {
      return {
        valid: true,
        confidence: 0.2,
        defender,
        explanation: "No existing knowledge to validate against. Accepting with low confidence."
      };
    }
    
    // Calculate average confidence of related concepts
    const avgConfidence = relevantConcepts.reduce((sum, concept) => sum + concept.confidence, 0) / relevantConcepts.length;
    
    // Simulate validation logic (would be more sophisticated in a real implementation)
    const valid = avgConfidence > 0.3;
    
    return {
      valid,
      confidence: avgConfidence,
      defender,
      explanation: valid 
        ? `Information is consistent with ${relevantConcepts.length} existing concepts.` 
        : `Information conflicts with existing knowledge base.`
    };
  }
  
  // Generate response to a question using the knowledge base
  generateResponse(question: string): {
    response: string;
    sourceConcepts: KnowledgeConcept[];
    confidence: number;
  } {
    // Search for relevant concepts
    const relevantConcepts = this.searchConcepts(question);
    
    if (relevantConcepts.length === 0) {
      return {
        response: "I don't have specific information about that in my knowledge base yet. As I learn more from the simulation and document data, I'll be able to provide better answers.",
        sourceConcepts: [],
        confidence: 0.1
      };
    }
    
    // Sort by confidence and recency
    const sortedConcepts = [...relevantConcepts].sort((a, b) => {
      // Weight by confidence and how recently it was accessed
      return (b.confidence * 0.7 + b.lastAccessed * 0.3) - (a.confidence * 0.7 + a.lastAccessed * 0.3);
    });
    
    // Take the top concepts
    const topConcepts = sortedConcepts.slice(0, 3);
    
    // Build a response from the concepts
    let responseText = topConcepts[0].description;
    
    // If we have more concepts, add supporting information
    if (topConcepts.length > 1) {
      responseText += " Additionally, " + topConcepts[1].description;
    }
    
    // Calculate confidence based on concept confidence and how many we found
    const confidence = Math.min(
      0.9,
      topConcepts.reduce((sum, concept) => sum + concept.confidence, 0) / topConcepts.length * 
      (Math.min(relevantConcepts.length, 5) / 5)
    );
    
    return {
      response: responseText,
      sourceConcepts: topConcepts,
      confidence
    };
  }
  
  // Seed the knowledge base with initial concepts about intent simulation
  seedInitialKnowledge(): void {
    // Core concepts
    const intentFieldId = this.addConcept(
      "Intent Field",
      "The foundational conceptual space of our universe model representing fluctuations that give rise to particles with varying charges.",
      'document',
      'core',
      0.9
    );
    
    const particleId = this.addConcept(
      "Particle",
      "Entities in our model that arise from intent field fluctuations, carrying properties including charge and an inherent 'intent to know'.",
      'document',
      'core',
      0.9
    );
    
    const chargeId = this.addConcept(
      "Charge",
      "A fundamental property of particles that determines interaction behavior. Positive particles have stronger desire to interact, negative less so.",
      'document',
      'core',
      0.9
    );
    
    const nexusId = this.addConcept(
      "Information-Intent Nexus",
      "The convergence point of intent density and information structure where the system reorganizes, leading to nexus events where physical-like laws emerge.",
      'document',
      'core',
      0.9
    );
    
    // Connect core concepts
    this.connectConcepts(intentFieldId, particleId);
    this.connectConcepts(particleId, chargeId);
    this.connectConcepts(intentFieldId, nexusId);
    
    // Add protective circle concepts
    const validationId = this.addConcept(
      "Knowledge Validation",
      "Process of verifying new information against existing knowledge to maintain integrity of the system.",
      'inference',
      'protective',
      0.8
    );
    
    const consistencyId = this.addConcept(
      "Conceptual Consistency",
      "Maintaining logical coherence between interrelated concepts within the knowledge structure.",
      'inference',
      'protective',
      0.8
    );
    
    // Add explorative circle concepts
    const complexityId = this.addConcept(
      "Emergent Complexity",
      "The development of intricate patterns and behaviors that arise from simple interactions between particles in the intent field.",
      'document',
      'explorative',
      0.85
    );
    
    const entropyId = this.addConcept(
      "Intent-Entropy Relationship",
      "The interplay between randomness and intentional organization that drives the evolution of the system.",
      'document',
      'explorative',
      0.85
    );
    
    // Make connections
    this.connectConcepts(validationId, consistencyId);
    this.connectConcepts(complexityId, entropyId);
    this.connectConcepts(nexusId, complexityId);
  }
  
  // Get statistics about the knowledge base
  getStats(): {
    totalConcepts: number;
    conceptsByCircle: Record<string, number>;
    conceptsBySource: Record<string, number>;
    simulationInsightsCount: number;
    documentContentChunks: number;
  } {
    const conceptsByCircle: Record<string, number> = {
      core: 0,
      protective: 0,
      explorative: 0,
      communicative: 0,
      reflective: 0
    };
    
    const conceptsBySource: Record<string, number> = {
      simulation: 0,
      document: 0,
      user_interaction: 0,
      inference: 0
    };
    
    this.concepts.forEach(concept => {
      conceptsByCircle[concept.intentCircle]++;
      conceptsBySource[concept.sourceType]++;
    });
    
    return {
      totalConcepts: this.concepts.size,
      conceptsByCircle,
      conceptsBySource,
      simulationInsightsCount: this.simulationInsights.length,
      documentContentChunks: this.documentContent.length
    };
  }
}

// Create and export a singleton instance
export const knowledgeBase = new IntentKnowledgeBase();

// Initialize with seed knowledge
knowledgeBase.seedInitialKnowledge();

// Export types for use elsewhere
export type { KnowledgeConcept, NexusDefender };
