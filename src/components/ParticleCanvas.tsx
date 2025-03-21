
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Particle, 
  calculateParticleInteraction,
  updateParticlePosition,
  createParticleFromField,
  analyzeParticleClusters,
  calculateSystemEntropy,
  detectAnomalies,
  AnomalyEvent
} from '@/utils/particleUtils';
import { 
  updateIntentField, 
  createFieldFromParticles,
  analyzeIntentField
} from '@/utils/fieldUtils';
import { 
  renderParticles, 
  renderIntentField,
  renderParticleDensity
} from '@/utils/renderUtils';
import { useToast } from "@/hooks/use-toast";

type ParticleCanvasProps = {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  running: boolean;
  renderMode: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles: boolean;
  energyConservation: boolean;
  probabilisticIntent: boolean;
  onStatsUpdate: (stats: {
    positiveParticles: number;
    negativeParticles: number;
    neutralParticles: number;
    highEnergyParticles: number;
    quantumParticles: number;
    compositeParticles: number;
    adaptiveParticles: number;
    totalInteractions: number;
    complexityIndex: number;
    averageKnowledge: number;
    maxComplexity: number;
    clusterCount: number;
    averageClusterSize: number;
    systemEntropy: number;
    intentFieldComplexity: number;
  }) => void;
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void;
};

export const ParticleCanvas = ({
  intentFluctuationRate,
  maxParticles,
  learningRate,
  particleCreationRate,
  viewMode,
  running,
  renderMode,
  useAdaptiveParticles,
  energyConservation,
  probabilisticIntent,
  onStatsUpdate,
  onAnomalyDetected
}: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][][]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const previousStateRef = useRef({
    entropy: 0,
    clusterCount: 0,
    adaptiveCount: 0,
    compositeCount: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  // Initialize the simulation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };
    
    const fieldResolution = 10;
    const fieldWidth = Math.ceil(width / fieldResolution);
    const fieldHeight = Math.ceil(height / fieldResolution);
    const fieldDepth = 10;
    
    const newField: number[][][] = [];
    
    for (let z = 0; z < fieldDepth; z++) {
      const plane: number[][] = [];
      for (let y = 0; y < fieldHeight; y++) {
        const row: number[] = [];
        for (let x = 0; x < fieldWidth; x++) {
          row.push(Math.random() * 2 - 1);
        }
        plane.push(row);
      }
      newField.push(plane);
    }
    
    intentFieldRef.current = newField;
    setIsInitialized(true);
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Create new particles
  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const createParticlesInterval = setInterval(() => {
      if (particlesRef.current.length >= maxParticles) return;
      
      const numToCreate = Math.floor(Math.random() * particleCreationRate) + 1;
      const newParticles = [...particlesRef.current];
      
      for (let i = 0; i < numToCreate; i++) {
        if (newParticles.length >= maxParticles) break;
        
        const x = Math.random() * dimensionsRef.current.width;
        const y = Math.random() * dimensionsRef.current.height;
        const z = Math.random() * 10;
        
        const fieldX = Math.floor(x / (dimensionsRef.current.width / intentFieldRef.current[0][0].length));
        const fieldY = Math.floor(y / (dimensionsRef.current.height / intentFieldRef.current[0].length));
        const fieldZ = Math.floor(z / (10 / intentFieldRef.current.length));
        
        const fieldValue = intentFieldRef.current[
          Math.min(fieldZ, intentFieldRef.current.length - 1)
        ][
          Math.min(fieldY, intentFieldRef.current[0].length - 1)
        ][
          Math.min(fieldX, intentFieldRef.current[0][0].length - 1)
        ];
        
        const newParticle = createParticleFromField(
          fieldValue, 
          x, y, z, 
          Date.now() + i
        );
        
        // Create adaptive particles if enabled
        if (useAdaptiveParticles && Math.random() < 0.1) { // 10% chance for adaptive particles
          newParticle.type = 'adaptive';
          newParticle.color = 'rgba(236, 72, 153, 0.85)'; // Pink color for adaptive
          newParticle.adaptiveScore = 1; // Initial score
        }
        
        // Apply energy conservation settings if enabled
        if (energyConservation) {
          newParticle.energyCapacity = 1 + Math.random() * 0.5;
          newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
        } else {
          newParticle.energyCapacity = 100; // Effectively unlimited
          newParticle.intentDecayRate = 0.00001; // Negligible decay
        }
        
        newParticles.push(newParticle);
      }
      
      particlesRef.current = newParticles;
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, isInitialized, maxParticles, particleCreationRate, useAdaptiveParticles, energyConservation]);
  
  // Update intent field periodically
  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const updateIntentInterval = setInterval(() => {
      // Probabilistic or standard intent updates
      intentFieldRef.current = updateIntentField(
        intentFieldRef.current, 
        intentFluctuationRate, 
        probabilisticIntent
      );
      
      // Periodically apply particle influence to intent field (feedback loop)
      if (frameCountRef.current % 100 === 0) {
        const particleField = createFieldFromParticles(
          particlesRef.current, 
          { 
            width: dimensionsRef.current.width, 
            height: dimensionsRef.current.height, 
            depth: 10 
          },
          dimensionsRef.current.width / intentFieldRef.current[0][0].length
        );
        
        // Blend particle-created field with existing field (30% particle influence)
        const blendedField = intentFieldRef.current.map((plane, z) => 
          plane.map((row, y) => 
            row.map((value, x) => 
              value * 0.7 + particleField[z][y][x] * 0.3
            )
          )
        );
        
        intentFieldRef.current = blendedField;
      }
    }, 1000);
    
    return () => clearInterval(updateIntentInterval);
  }, [running, isInitialized, intentFluctuationRate, probabilisticIntent]);
  
  // Update particles' positions and interactions
  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    const dimensions = dimensionsRef.current;
    const intentField = intentFieldRef.current;
    
    if (particles.length === 0 || intentField.length === 0) return particles;
    
    const newParticles = [...particles];
    
    // Update each particle's position
    for (let i = 0; i < newParticles.length; i++) {
      newParticles[i] = updateParticlePosition(
        newParticles[i], 
        dimensions, 
        intentField, 
        viewMode,
        newParticles // Pass all particles for long-range interactions
      );
      
      // Handle particle interactions
      for (let j = i + 1; j < newParticles.length; j++) {
        const [updatedParticle1, updatedParticle2, interactionOccurred] = calculateParticleInteraction(
          newParticles[i],
          newParticles[j],
          learningRate,
          viewMode
        );
        
        newParticles[i] = updatedParticle1;
        newParticles[j] = updatedParticle2;
        
        if (interactionOccurred) {
          interactionsRef.current += 1;
        }
      }
    }
    
    // Remove particles with very low energy if energy conservation is enabled
    if (energyConservation) {
      return newParticles.filter(p => p.energy > 0.1);
    }
    
    return newParticles;
  }, [viewMode, learningRate, energyConservation]);
  
  // Main animation loop
  useEffect(() => {
    if (!running || !isInitialized) return;
    
    const animate = () => {
      frameCountRef.current += 1;
      simulationTimeRef.current += 1;
      
      // Update particles
      particlesRef.current = updateParticles();
      
      // Render based on selected mode
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          if (renderMode === 'particles' || renderMode === 'combined') {
            renderParticles(ctx, particlesRef.current, dimensionsRef.current, viewMode, true);
          }
          
          if (renderMode === 'field') {
            ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
            renderIntentField(ctx, intentFieldRef.current, dimensionsRef.current, 5, 0.3);
          }
          
          if (renderMode === 'density') {
            ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
            renderParticleDensity(ctx, particlesRef.current, dimensionsRef.current, 15, 0.4);
          }
          
          if (renderMode === 'combined') {
            // Add the intent field overlay with low opacity
            renderIntentField(ctx, intentFieldRef.current, dimensionsRef.current, 5, 0.1);
          }
        }
      }
      
      // Calculate and update statistics every 30 frames (about 0.5 seconds)
      if (frameCountRef.current % 30 === 0) {
        const particles = particlesRef.current;
        
        // Basic particle counts
        const positiveParticles = particles.filter(p => p.charge === 'positive').length;
        const negativeParticles = particles.filter(p => p.charge === 'negative').length;
        const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
        const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
        const quantumParticles = particles.filter(p => p.type === 'quantum').length;
        const compositeParticles = particles.filter(p => p.type === 'composite').length;
        const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
        
        // Calculate knowledge metrics
        const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
        const averageKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
        
        // Find maximum complexity
        const maxComplexity = particles.length > 0 
          ? particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
          : 1;
        
        // Calculate variety factor for complexity index
        const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                             (highEnergyParticles + 1) * (quantumParticles + 1) *
                             (compositeParticles + 1) * (adaptiveParticles + 1)) / 
                             Math.max(1, particles.length ** 2);
        
        // Enhanced complexity index with adaptive influence
        const complexityIndex = (totalKnowledge * varietyFactor) + 
                               (interactionsRef.current / 1000) + 
                               (compositeParticles * maxComplexity) +
                               (adaptiveParticles * 2);
        
        // Analyze clusters
        const clusterAnalysis = analyzeParticleClusters(particles);
        
        // Calculate system entropy
        const systemEntropy = calculateSystemEntropy(particles, intentFieldRef.current);
        
        // Calculate intent field complexity
        const fieldAnalysis = analyzeIntentField(intentFieldRef.current);
        
        // Update previous state for anomaly detection
        const currentState = {
          entropy: systemEntropy,
          clusterCount: clusterAnalysis.clusterCount,
          adaptiveCount: adaptiveParticles,
          compositeCount: compositeParticles,
        };
        
        // Detect anomalies
        if (simulationTimeRef.current > 100) { // Allow system to stabilize first
          const anomalies = detectAnomalies(
            particles,
            previousStateRef.current,
            currentState,
            simulationTimeRef.current
          );
          
          // Notify about significant anomalies
          anomalies.forEach(anomaly => {
            if (anomaly.severity > 0.6 && onAnomalyDetected) {
              onAnomalyDetected(anomaly);
              
              // Show toast notification for major anomalies
              toast({
                title: `Anomaly Detected: ${anomaly.type.replace('_', ' ')}`,
                description: anomaly.description,
                variant: "default",
              });
            }
          });
        }
        
        // Save current state for next comparison
        previousStateRef.current = currentState;
        
        // Update stats
        onStatsUpdate({
          positiveParticles,
          negativeParticles,
          neutralParticles,
          highEnergyParticles,
          quantumParticles,
          compositeParticles,
          adaptiveParticles,
          totalInteractions: interactionsRef.current,
          complexityIndex,
          averageKnowledge,
          maxComplexity,
          clusterCount: clusterAnalysis.clusterCount,
          averageClusterSize: clusterAnalysis.averageClusterSize,
          systemEntropy,
          intentFieldComplexity: fieldAnalysis.patternComplexity
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [running, isInitialized, updateParticles, renderMode, onStatsUpdate, onAnomalyDetected, viewMode, toast]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-black/90"
    />
  );
};

// Set default props
ParticleCanvas.defaultProps = {
  renderMode: 'particles',
  useAdaptiveParticles: false,
  energyConservation: false,
  probabilisticIntent: false
};
