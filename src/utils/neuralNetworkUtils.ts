
import { Particle } from '@/utils/particleUtils';

type ArchitectureType = 'feedforward' | 'cnn' | 'rnn' | 'transformer' | 'gan';

/**
 * Generate a neural architecture description based on the architecture type
 */
export function generateNeuralArchitecture(architecture: ArchitectureType) {
  switch (architecture) {
    case 'feedforward':
      return {
        description: 'Standard feed-forward neural network',
        layers: [
          { type: 'input', shape: [10] },
          { type: 'dense', neurons: 32, activation: 'relu' },
          { type: 'dense', neurons: 16, activation: 'relu' },
          { type: 'dense', neurons: 8, activation: 'softmax' }
        ]
      };
    case 'cnn':
      return {
        description: 'Convolutional neural network for spatial patterns',
        layers: [
          { type: 'input', shape: [20, 20, 3] },
          { type: 'conv2d', filters: 32, kernelSize: 3 },
          { type: 'maxpooling2d', poolSize: 2 },
          { type: 'conv2d', filters: 64, kernelSize: 3 },
          { type: 'flatten' },
          { type: 'dense', neurons: 128, activation: 'relu' },
          { type: 'dense', neurons: 10, activation: 'softmax' }
        ]
      };
    case 'rnn':
      return {
        description: 'Recurrent neural network for temporal particle behavior',
        layers: [
          { type: 'input', shape: [10, 5] },
          { type: 'lstm', units: 64, returnSequences: true },
          { type: 'lstm', units: 32 },
          { type: 'dense', neurons: 16, activation: 'relu' },
          { type: 'dense', neurons: 8, activation: 'softmax' }
        ]
      };
    case 'transformer':
      return {
        description: 'Transformer-based architecture for intent modeling',
        layers: [
          { type: 'input', shape: [20, 768] },
          { type: 'transformer', heads: 8, dimModel: 512, dimFeedforward: 2048 },
          { type: 'transformer', heads: 8, dimModel: 512, dimFeedforward: 2048 },
          { type: 'global_avg_pooling' },
          { type: 'dense', neurons: 256, activation: 'relu' },
          { type: 'dense', neurons: 10, activation: 'softmax' }
        ]
      };
    case 'gan':
      return {
        description: 'Generative adversarial network for particle simulation',
        generator: [
          { type: 'input', shape: [100] },
          { type: 'dense', neurons: 256, activation: 'relu' },
          { type: 'dense', neurons: 512, activation: 'relu' },
          { type: 'dense', neurons: 1024, activation: 'tanh' }
        ],
        discriminator: [
          { type: 'input', shape: [1024] },
          { type: 'dense', neurons: 512, activation: 'leaky_relu' },
          { type: 'dense', neurons: 256, activation: 'leaky_relu' },
          { type: 'dense', neurons: 1, activation: 'sigmoid' }
        ]
      };
    default:
      return {
        description: 'Basic neural network architecture',
        layers: [
          { type: 'input', shape: [10] },
          { type: 'dense', neurons: 16, activation: 'relu' },
          { type: 'dense', neurons: 8, activation: 'softmax' }
        ]
      };
  }
}

/**
 * Predict the evolution of particles based on the current state and network architecture
 */
export function predictParticleEvolution(particles: Particle[], architecture: ArchitectureType): Particle[] {
  // Clone particles and apply predicted changes
  return particles.slice(0, 5).map(p => {
    // Handle the case where age might be undefined
    const age = p.age || 0;
    const newKnowledge = Math.min(1, p.knowledge + Math.random() * 0.1);
    
    // Handle the case where interactions might be undefined
    const interactions = p.interactions || 0;
    const newInteractions = interactions + Math.floor(Math.random() * 5);
    
    // Create a new particle with predicted changes
    return {
      ...p,
      x: p.x + (Math.random() - 0.5) * 10,
      y: p.y + (Math.random() - 0.5) * 10,
      knowledge: newKnowledge,
      interactions: newInteractions,
      // Age might be undefined in the original Particle type
      age: age + 1,
      interactionCount: (p.interactionCount || 0) + Math.floor(Math.random() * 3)
    };
  });
}
