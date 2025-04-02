
import { Particle } from './particleUtils';
import { SimulationStats } from '@/hooks/useSimulationData';

/**
 * Convert particles to feature vectors for neural network input
 */
export function particlesToFeatures(particles: Particle[]) {
  return particles.map(particle => {
    // Extract relevant features from the particle
    return [
      // Charge as numerical value
      particle.charge === 'positive' ? 1 : particle.charge === 'negative' ? -1 : 0,
      
      // Knowledge level
      particle.knowledge || 0,
      
      // Complexity
      particle.complexity || 1,
      
      // Intent
      particle.intent || 0,
      
      // Energy
      particle.energy || 1,
      
      // Age (normalized)
      (particle.age || 0) / 100,
      
      // Interaction count (normalized)
      (particle.interactions || 0) / 20,
      
      // Type as one-hot encoded values
      particle.type === 'standard' ? 1 : 0,
      particle.type === 'high-energy' ? 1 : 0,
      particle.type === 'quantum' ? 1 : 0,
      particle.type === 'composite' ? 1 : 0,
      particle.type === 'adaptive' ? 1 : 0
    ];
  });
}

/**
 * Create a simple representation of a neural network architecture
 * This is just for visualization purposes
 */
export function generateNetworkArchitecture(
  type: 'feedforward' | 'cnn' | 'rnn' | 'transformer' | 'gan', 
  inputFeatures: number
) {
  const architectures = {
    feedforward: {
      layers: [
        { type: 'input', neurons: inputFeatures },
        { type: 'dense', neurons: 16, activation: 'relu' },
        { type: 'dense', neurons: 8, activation: 'relu' },
        { type: 'output', neurons: 3, activation: 'softmax' }
      ],
      description: 'Standard feedforward neural network for classification'
    },
    cnn: {
      layers: [
        { type: 'input', shape: [inputFeatures, 1, 1] },
        { type: 'conv2d', filters: 16, kernelSize: 3, activation: 'relu' },
        { type: 'maxpool', poolSize: 2 },
        { type: 'conv2d', filters: 32, kernelSize: 3, activation: 'relu' },
        { type: 'flatten' },
        { type: 'dense', neurons: 16, activation: 'relu' },
        { type: 'output', neurons: 3, activation: 'softmax' }
      ],
      description: 'Convolutional neural network for spatial pattern recognition'
    },
    rnn: {
      layers: [
        { type: 'input', shape: [1, inputFeatures] },
        { type: 'lstm', units: 32, returnSequences: true },
        { type: 'lstm', units: 16, returnSequences: false },
        { type: 'dense', neurons: 8, activation: 'relu' },
        { type: 'output', neurons: 3, activation: 'softmax' }
      ],
      description: 'Recurrent neural network with LSTM cells for temporal patterns'
    },
    transformer: {
      layers: [
        { type: 'input', shape: [1, inputFeatures] },
        { type: 'embedding', outputDim: 32 },
        { type: 'transformer', heads: 4, dimModel: 32, dimFeedforward: 128 },
        { type: 'transformer', heads: 4, dimModel: 32, dimFeedforward: 128 },
        { type: 'flatten' },
        { type: 'dense', neurons: 16, activation: 'relu' },
        { type: 'output', neurons: 3, activation: 'softmax' }
      ],
      description: 'Transformer architecture with self-attention for complex relationships'
    },
    gan: {
      generator: [
        { type: 'input', shape: [100] }, // noise vector
        { type: 'dense', neurons: 128, activation: 'relu' },
        { type: 'dense', neurons: 256, activation: 'relu' },
        { type: 'output', neurons: inputFeatures, activation: 'tanh' }
      ],
      discriminator: [
        { type: 'input', shape: [inputFeatures] },
        { type: 'dense', neurons: 256, activation: 'relu' },
        { type: 'dense', neurons: 128, activation: 'relu' },
        { type: 'output', neurons: 1, activation: 'sigmoid' }
      ],
      description: 'Generative Adversarial Network for creating synthetic particles'
    }
  };
  
  return architectures[type];
}

/**
 * Calculate the theoretical complexity of a neural network architecture
 */
export function calculateArchitectureComplexity(architecture: any) {
  let complexity = 0;
  
  if (architecture.layers) {
    // For standard architectures
    for (let i = 1; i < architecture.layers.length; i++) {
      const prevLayer = architecture.layers[i-1];
      const currentLayer = architecture.layers[i];
      
      if (currentLayer.type === 'dense' || currentLayer.type === 'output') {
        // For dense layers, count parameters = inputs * outputs + bias
        const inputSize = prevLayer.neurons || prevLayer.units || prevLayer.filters || 
                        (prevLayer.shape ? prevLayer.shape[0] : 0);
        complexity += (inputSize * currentLayer.neurons) + currentLayer.neurons;
      } 
      else if (currentLayer.type === 'conv2d') {
        // For convolutional layers, approximate parameter count
        complexity += currentLayer.filters * currentLayer.kernelSize * 
                      currentLayer.kernelSize * (prevLayer.filters || 1) + 
                      currentLayer.filters;
      }
      else if (currentLayer.type === 'lstm') {
        // For LSTM, approximate parameter count (4 gates with weights and biases)
        const inputSize = prevLayer.units || 
                       (prevLayer.shape ? prevLayer.shape[1] : 0);
        complexity += 4 * ((inputSize + currentLayer.units) * currentLayer.units + 
                        currentLayer.units);
      }
      else if (currentLayer.type === 'transformer') {
        // For transformer layers, approximate parameter count
        complexity += 4 * currentLayer.dimModel * currentLayer.dimFeedforward + 
                   currentLayer.heads * currentLayer.dimModel * 3;
      }
    }
  } else if (architecture.generator && architecture.discriminator) {
    // For GAN, calculate both networks
    const genLayers = architecture.generator;
    const discLayers = architecture.discriminator;
    
    // Generator complexity
    for (let i = 1; i < genLayers.length; i++) {
      const prevLayer = genLayers[i-1];
      const currentLayer = genLayers[i];
      complexity += (prevLayer.neurons || prevLayer.shape[0]) * currentLayer.neurons + 
                 currentLayer.neurons;
    }
    
    // Discriminator complexity
    for (let i = 1; i < discLayers.length; i++) {
      const prevLayer = discLayers[i-1];
      const currentLayer = discLayers[i];
      complexity += (prevLayer.neurons || prevLayer.shape[0]) * currentLayer.neurons + 
                 currentLayer.neurons;
    }
  }
  
  return complexity;
}

/**
 * Analyze particles to determine the most appropriate neural architecture
 */
export function suggestBestArchitecture(particles: Particle[], stats: SimulationStats) {
  if (particles.length < 5) return 'feedforward'; // Default for small datasets
  
  const temporalPatterns = stats.particleCount > 50 && stats.complexityIndex > 5;
  const spatialClusters = stats.clusterCount > 3;
  const highComplexity = stats.complexityIndex > 10;
  const diverseParticles = 
    stats.highEnergyParticles > 0 && 
    stats.quantumParticles > 0 && 
    stats.compositeParticles > 0;
  
  // Decision logic
  if (highComplexity && diverseParticles) {
    return 'transformer'; // Best for complex relationships
  } else if (temporalPatterns) {
    return 'rnn'; // Best for temporal patterns
  } else if (spatialClusters) {
    return 'cnn'; // Best for spatial patterns
  } else if (stats.particleCount > 100) {
    return 'gan'; // Good for large datasets with potential for generation
  } else {
    return 'feedforward'; // Default
  }
}

/**
 * Generate hypothetical insight metrics based on neural network analysis
 */
export function generateInsights(particles: Particle[], stats: SimulationStats, architecture: string) {
  const baseInsightScore = 1 + Math.random() * 2;
  
  // Architecture-specific bonuses
  const architectureMultiplier = 
    architecture === 'transformer' ? 1.5 :
    architecture === 'rnn' ? 1.3 :
    architecture === 'cnn' ? 1.2 :
    architecture === 'gan' ? 1.4 : 1.0;
  
  // Complexity bonus
  const complexityBonus = Math.min(3, stats.complexityIndex / 5);
  
  // Diversity bonus
  const diversityBonus = 
    (stats.positiveParticles > 0 ? 0.2 : 0) +
    (stats.negativeParticles > 0 ? 0.2 : 0) +
    (stats.neutralParticles > 0 ? 0.2 : 0) +
    (stats.highEnergyParticles > 0 ? 0.3 : 0) +
    (stats.quantumParticles > 0 ? 0.3 : 0) +
    (stats.compositeParticles > 0 ? 0.4 : 0) +
    (stats.adaptiveParticles > 0 ? 0.5 : 0);
  
  // Interaction depth
  const interactionBonus = Math.min(2, stats.totalInteractions / 1000);
  
  // Calculate final insight score
  const insightScore = (baseInsightScore + complexityBonus + diversityBonus + interactionBonus) * 
                      architectureMultiplier;
  
  return {
    score: Math.min(10, insightScore),
    metrics: {
      baseInsight: baseInsightScore,
      complexityContribution: complexityBonus,
      diversityContribution: diversityBonus,
      interactionDepth: interactionBonus,
      architectureMultiplier: architectureMultiplier
    }
  };
}
