
// Define the basic particle interface
export interface Particle {
  id: string; // Changed from string | number to just string for compatibility
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  position?: { x: number, y: number, z?: number };
  velocity?: { x: number, y: number, z?: number };
  radius?: number;
  mass?: number;
  charge: 'positive' | 'negative' | 'neutral';
  color?: string;
  energy?: number;
  intent?: number;
  complexity?: number;
  isPostInflation?: boolean;
  knowledgeLevel?: number;
  lifetime?: number;
  interactionCount?: number;
  neighbours?: Particle[];
  type?: string;
  
  // Properties needed based on errors
  knowledge?: number;
  lastInteraction?: number;
  age?: number;
  interactions?: number;
  interactionTendency?: number;
  intentDecayRate?: number;
  created?: number;
  scale?: number;
  adaptiveScore?: number;
  energyCapacity?: number;
  lifespan?: number;
  creationTime?: number;
  
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
