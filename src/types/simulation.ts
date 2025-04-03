
// Define the basic particle interface
export interface Particle {
  id: string; // Changed from string | number to just string for compatibility
  x: number; // Changed from optional to required
  y: number; // Changed from optional to required
  z: number; // Changed from optional to required
  vx: number; // Changed from optional to required
  vy: number; // Changed from optional to required
  vz: number; // Changed from optional to required
  radius: number; // Changed from optional to required
  mass: number; // Added as required
  charge: 'positive' | 'negative' | 'neutral';
  color: string; // Changed from optional to required
  energy: number; // Changed from optional to required
  intent: number; // Changed from optional to required
  complexity: number; // Changed from optional to required
  interactionTendency: number; // Changed from optional to required
  lastInteraction: number; // Changed from optional to required
  interactionCount: number; // Changed from optional to required
  age: number; // Changed from optional to required
  interactions: number; // Changed from optional to required
  intentDecayRate: number; // Changed from optional to required
  created: number; // Changed from optional to required
  scale: number; // Changed from optional to required
  adaptiveScore: number; // Changed from optional to required
  energyCapacity: number; // Changed from optional to required
  creationTime: number; // Changed from optional to required
  isPostInflation: boolean; // Changed from optional to required
  
  // Optional properties
  position?: { x: number, y: number, z?: number };
  velocity?: { x: number, y: number, z?: number };
  knowledge?: number;
  knowledgeLevel?: number;
  lifetime?: number;
  neighbours?: Particle[];
  type?: string;
  lifespan?: number;
  
  // Advanced properties for intelligent clusters
  clusterAffinity?: number;
  knowledgeBase?: Record<string, any>;
  learningRate?: number;
  adaptiveIndex?: number;
  isInCluster?: boolean;
  clusterId?: number | null;
  insightScore?: number;
}

// Define the simulation state
export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  interactionsCount: number;
  frameCount: number;
  simulationTime: number;
  isRunning: boolean;
  intervalId: number | null;
  dimensions?: { width: number; height: number };
  originalDimensions?: { width: number; height: number };
}

// Add SimulationStats interface that was missing
export interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  highEnergyParticles?: number;
  quantumParticles?: number;
  compositeParticles?: number;
  adaptiveParticles?: number;
  totalInteractions: number;
  complexityIndex?: number;
  averageKnowledge?: number;
  maxComplexity?: number;
  clusterCount?: number;
  averageClusterSize?: number;
  systemEntropy?: number;
  intentFieldComplexity?: number;
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
  interactions?: number;
  frame?: number;
  time?: number;
  timestamp?: number; // Add timestamp to resolve errors
  
  // New properties for advanced simulation
  robotCount?: number;
  clusterCoherence?: number;
  intelligenceIndex?: number;
  knowledgeNetwork?: Record<string, number>;
}

// Define simulation configuration
export interface SimulationConfig {
  initialParticleCount: number;
  maxParticles: number;
  fieldResolution: number;
  intentFluctuationRate: number;
  interactionRadius: number;
  boundaryCondition: 'wrap' | 'bounce' | 'none' | 'disappear'; // Added 'disappear' to match hooks/simulation/types.ts
  particleLifetime: number | null;
  inflationEnabled: boolean;
  inflationThreshold: number;
  inflationMultiplier: number;
}

// Define inflation event interface
export interface InflationEvent {
  timestamp: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
  expansionFactor?: number;
  fieldEnergyBefore?: number;
  fieldEnergyAfter?: number;
  particleCountBefore?: number; // Added to match hooks/simulation/types.ts
}

// Define Neural Intent Simulation properties
export interface NeuralIntentProps {
  isTraining: boolean;
  trainingProgress: number;
  modelAccuracy: number;
  insightScore: number;
  predictedParticles: Particle[];
  intentPredictions: number[][][];
  neuralArchitecture: string;
  startTraining: () => void;
  generatePredictions: () => void;
  toggleNeuralArchitecture: () => void;
}
