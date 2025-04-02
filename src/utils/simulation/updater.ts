
import { Particle, calculateParticleInteraction, updateParticlePosition } from '../particleUtils';
import { simulationState, saveState } from './state';
import { updateIntentField, createFieldFromParticles } from '../fields';
import { analyzeIntentField } from '../fields';
import { recordDataPoint } from '../dataExportUtils';
import { analyzeParticleClusters, calculateSystemEntropy } from '../particleUtils';
import { defaultConfig, simulationDimensions } from './config';
import { createNewParticle } from './initialization';

// Update particles (positions, interactions, etc.)
export function updateParticles() {
  if (simulationState.particles.length === 0 || simulationState.intentField.length === 0) {
    return simulationState.particles;
  }
  
  const newParticles = [...simulationState.particles];
  
  for (let i = 0; i < newParticles.length; i++) {
    newParticles[i] = updateParticlePosition(
      newParticles[i], 
      simulationDimensions, 
      simulationState.intentField, 
      defaultConfig.viewMode,
      newParticles
    );
    
    for (let j = i + 1; j < newParticles.length; j++) {
      const [updatedParticle1, updatedParticle2, interactionOccurred] = calculateParticleInteraction(
        newParticles[i],
        newParticles[j],
        defaultConfig.learningRate,
        defaultConfig.viewMode
      );
      
      newParticles[i] = updatedParticle1;
      newParticles[j] = updatedParticle2;
      
      if (interactionOccurred) {
        simulationState.interactionsCount += 1;
      }
    }
  }
  
  if (defaultConfig.energyConservation) {
    return newParticles.filter(p => p.energy > 0.1);
  }
  
  return newParticles;
}

// Update intent field and collect data
export function updateSimulation() {
  // Update frame count and time
  simulationState.frameCount++;
  simulationState.simulationTime++;
  
  // Update particles (positions, interactions, etc.)
  simulationState.particles = updateParticles();
  
  // Log info occasionally to check if simulation is running
  if (simulationState.frameCount % 1000 === 0) {
    console.log(`🔄 Simulation running: Frame ${simulationState.frameCount}, ${simulationState.particles.length} particles, ${simulationState.interactionsCount} interactions`);
  }
  
  // Collect data periodically
  if (simulationState.frameCount % 30 === 0) {
    // Calculate metrics for data recording
    const clusterAnalysis = analyzeParticleClusters(simulationState.particles);
    const entropyAnalysis = calculateSystemEntropy(simulationState.particles, simulationState.intentField);
    const fieldAnalysis = analyzeIntentField(simulationState.intentField);
    
    // Calculate complexity index
    const positiveParticles = simulationState.particles.filter(p => p.charge === 'positive').length;
    const negativeParticles = simulationState.particles.filter(p => p.charge === 'negative').length;
    const neutralParticles = simulationState.particles.filter(p => p.charge === 'neutral').length;
    const highEnergyParticles = simulationState.particles.filter(p => p.type === 'high-energy').length;
    const quantumParticles = simulationState.particles.filter(p => p.type === 'quantum').length;
    const compositeParticles = simulationState.particles.filter(p => p.type === 'composite').length;
    const adaptiveParticles = simulationState.particles.filter(p => p.type === 'adaptive').length;
    
    const totalKnowledge = simulationState.particles.reduce((sum, p) => sum + p.knowledge, 0);
    const maxComplexity = simulationState.particles.length > 0 
      ? simulationState.particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
      : 1;
    
    const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                         (highEnergyParticles + 1) * (quantumParticles + 1) *
                         (compositeParticles + 1) * (adaptiveParticles + 1)) / 
                         Math.max(1, simulationState.particles.length ** 2);
    
    const complexityIndex = (totalKnowledge * varietyFactor) + 
                           (simulationState.interactionsCount / 1000) + 
                           (compositeParticles * maxComplexity) +
                           (adaptiveParticles * 2);
    
    // Add data to the record
    const stats = {
      particleCount: simulationState.particles.length,
      positiveParticles,
      negativeParticles,
      neutralParticles,
      highEnergyParticles,
      quantumParticles,
      compositeParticles,
      adaptiveParticles,
      totalInteractions: simulationState.interactionsCount,
      complexityIndex,
      averageKnowledge: totalKnowledge / Math.max(1, simulationState.particles.length),
      maxComplexity,
      clusterCount: clusterAnalysis.clusterCount,
      averageClusterSize: clusterAnalysis.averageClusterSize,
      systemEntropy: entropyAnalysis.systemEntropy,
      intentFieldComplexity: fieldAnalysis.complexity
    };
    
    // Record data point if data collection is active
    if (simulationState.frameCount % 60 === 0) { // Record less frequently for efficiency
      recordDataPoint(stats, simulationState.particles);
    }
  }
  
  // Save state periodically
  if (simulationState.frameCount % 100 === 0) {
    saveState();
  }
}

// Periodically update the intent field
export function updateIntentFieldPeriodically() {
  simulationState.intentField = updateIntentField(
    simulationState.intentField, 
    defaultConfig.fluctuationRate, 
    defaultConfig.probabilisticIntent
  );
  
  if (simulationState.frameCount % 100 === 0) {
    // Only blend with particle field occasionally to prevent performance issues
    try {
      const particleField = createFieldFromParticles(
        simulationState.particles, 
        { 
          width: simulationDimensions.width, 
          height: simulationDimensions.height, 
          depth: 10 
        },
        simulationDimensions.width / simulationState.intentField[0][0].length
      );
      
      // Make sure we got a valid field back
      if (particleField && 
          particleField.length > 0 && 
          particleField[0].length > 0 && 
          particleField[0][0].length > 0) {
        
        const blendedField = simulationState.intentField.map((plane, z) => 
          plane.map((row, y) => 
            row.map((value, x) => {
              // Make sure coordinates are valid
              if (z < particleField.length && 
                  y < particleField[z].length && 
                  x < particleField[z][y].length) {
                return value * 0.7 + particleField[z][y][x] * 0.3;
              }
              return value;
            })
          )
        );
        
        simulationState.intentField = blendedField;
      }
    } catch (error) {
      console.error("Error blending fields:", error);
    }
  }
}

// Create new particles occasionally
export function maybeCreateParticles() {
  if (simulationState.particles.length >= defaultConfig.maxParticles) return;
  
  const numToCreate = Math.floor(Math.random() * 3) + 1;
  console.log(`🌱 Creating ${numToCreate} new particles`);
  
  for (let i = 0; i < numToCreate; i++) {
    if (simulationState.particles.length >= defaultConfig.maxParticles) break;
    
    const newParticle = createNewParticle(i);
    simulationState.particles.push(newParticle);
    
    // Occasionally log particle creation for debugging
    if (Math.random() < 0.1) {
      console.log(`Created particle ${newParticle.id}: ${newParticle.charge} charge`);
    }
  }
}
