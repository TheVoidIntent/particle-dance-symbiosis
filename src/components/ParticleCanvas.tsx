
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Particle, 
  calculateParticleInteraction,
  updateParticlePosition,
  createParticleFromField
} from '@/utils/particleUtils';
import { updateIntentField } from '@/utils/fieldUtils';
import { renderParticles } from '@/utils/renderUtils';

type ParticleCanvasProps = {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  running: boolean;
  onStatsUpdate: (stats: {
    positiveParticles: number;
    negativeParticles: number;
    neutralParticles: number;
    highEnergyParticles: number;
    quantumParticles: number;
    totalInteractions: number;
    complexityIndex: number;
  }) => void;
};

export const ParticleCanvas = ({
  intentFluctuationRate,
  maxParticles,
  learningRate,
  particleCreationRate,
  viewMode,
  running,
  onStatsUpdate
}: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][][]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize intent field and dimensions
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };
    
    // Initialize 3D intent field (simplified for performance)
    const fieldResolution = 10; // Lower resolution for better performance
    const fieldWidth = Math.ceil(width / fieldResolution);
    const fieldHeight = Math.ceil(height / fieldResolution);
    const fieldDepth = 10; // Using a smaller depth for performance
    
    const newField: number[][][] = [];
    
    for (let z = 0; z < fieldDepth; z++) {
      const plane: number[][] = [];
      for (let y = 0; y < fieldHeight; y++) {
        const row: number[] = [];
        for (let x = 0; x < fieldWidth; x++) {
          // Initial random intent values between -1 and 1
          row.push(Math.random() * 2 - 1);
        }
        plane.push(row);
      }
      newField.push(plane);
    }
    
    intentFieldRef.current = newField;
    setIsInitialized(true);
    
    // Handle window resize
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
  
  // Create particles based on intent field fluctuations
  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const createParticlesInterval = setInterval(() => {
      if (particlesRef.current.length >= maxParticles) return;
      
      // Determine number of particles to create based on creation rate
      const numToCreate = Math.floor(Math.random() * particleCreationRate) + 1;
      const newParticles = [...particlesRef.current];
      
      for (let i = 0; i < numToCreate; i++) {
        if (newParticles.length >= maxParticles) break;
        
        // Random position
        const x = Math.random() * dimensionsRef.current.width;
        const y = Math.random() * dimensionsRef.current.height;
        const z = Math.random() * 10; // Using simplified z-dimension
        
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
        
        newParticles.push(newParticle);
      }
      
      particlesRef.current = newParticles;
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, isInitialized, maxParticles, particleCreationRate]);
  
  // Update intent field with fluctuations
  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const updateIntentInterval = setInterval(() => {
      intentFieldRef.current = updateIntentField(intentFieldRef.current, intentFluctuationRate);
    }, 1000); // Update intent field every second
    
    return () => clearInterval(updateIntentInterval);
  }, [running, isInitialized, intentFluctuationRate]);
  
  // Animation loop for particle movement and interactions
  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    const dimensions = dimensionsRef.current;
    const intentField = intentFieldRef.current;
    
    if (particles.length === 0 || intentField.length === 0) return particles;
    
    const newParticles = [...particles];
    
    // Update particle positions and handle interactions
    for (let i = 0; i < newParticles.length; i++) {
      // Update particle position
      newParticles[i] = updateParticlePosition(
        newParticles[i], 
        dimensions, 
        intentField, 
        viewMode
      );
      
      // Interaction with other particles
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
    
    return newParticles;
  }, [viewMode, learningRate]);

  // Animation loop with RAF
  useEffect(() => {
    if (!running || !isInitialized) return;
    
    const animate = () => {
      frameCountRef.current += 1;
      
      // Update particles
      particlesRef.current = updateParticles();
      
      // Draw particles
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          renderParticles(ctx, particlesRef.current, dimensionsRef.current, viewMode);
        }
      }
      
      // Update stats every 30 frames
      if (frameCountRef.current % 30 === 0) {
        const particles = particlesRef.current;
        const positiveParticles = particles.filter(p => p.charge === 'positive').length;
        const negativeParticles = particles.filter(p => p.charge === 'negative').length;
        const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
        const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
        const quantumParticles = particles.filter(p => p.type === 'quantum').length;
        
        // Calculate complexity index (a sample metric)
        const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
        const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                             (highEnergyParticles + 1) * (quantumParticles + 1)) / 
                             Math.max(1, particles.length ** 2);
        const complexityIndex = (totalKnowledge * varietyFactor) + (interactionsRef.current / 1000);
        
        onStatsUpdate({
          positiveParticles,
          negativeParticles,
          neutralParticles,
          highEnergyParticles,
          quantumParticles,
          totalInteractions: interactionsRef.current,
          complexityIndex
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [running, isInitialized, updateParticles, onStatsUpdate]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-black/90"
    />
  );
};
