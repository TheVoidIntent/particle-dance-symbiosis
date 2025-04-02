
import { Particle as ParticleUtil } from '@/utils/particleUtils';

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
  interactions?: number;
  robotCount?: number;
  timestamp?: number; // Added timestamp
}

export interface Particle extends ParticleUtil {
  id: string; // Changed to string only to match particleUtils
  mass?: number;
  scale?: number;
  created?: number;
  // All other properties from ParticleUtil
}

export interface IntentField {
  width: number;
  height: number;
  depth: number;
  data: number[][][];
}

export interface SimulationConfig {
  initialParticleCount: number;
  maxParticles: number;
  fieldResolution: number;
  intentFluctuationRate: number;
  interactionRadius: number;
  boundaryCondition: 'wrap' | 'bounce' | 'disappear';
  particleLifetime: number | null;
  inflationEnabled: boolean;
  inflationThreshold: number;
  inflationMultiplier: number;
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  particles: string[];
  severity: number;
}
