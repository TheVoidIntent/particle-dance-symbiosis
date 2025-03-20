import React, { useRef, useEffect, useState, useCallback } from 'react';

type Particle = {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  charge: 'positive' | 'negative' | 'neutral';
  color: string;
  size: number;
  intent: number;
  knowledge: number;
};

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
        
        // Get the closest intent field value
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
        
        // Determine charge based on intent field value
        let charge: 'positive' | 'negative' | 'neutral';
        let color: string;
        
        if (fieldValue > 0.3) {
          charge = 'positive';
          color = 'rgba(52, 211, 153, 0.8)'; // Green for positive
        } else if (fieldValue < -0.3) {
          charge = 'negative';
          color = 'rgba(248, 113, 113, 0.8)'; // Red for negative
        } else {
          charge = 'neutral';
          color = 'rgba(209, 213, 219, 0.8)'; // Gray for neutral
        }
        
        // Create new particle
        newParticles.push({
          id: Date.now() + i,
          x,
          y,
          z,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 1,
          charge,
          color,
          size: Math.random() * 3 + 2,
          intent: fieldValue,
          knowledge: 0
        });
      }
      
      particlesRef.current = newParticles;
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, isInitialized, maxParticles, particleCreationRate]);
  
  // Update intent field with fluctuations
  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const updateIntentInterval = setInterval(() => {
      const newField = [...intentFieldRef.current];
      
      // Apply random fluctuations to the intent field
      for (let z = 0; z < newField.length; z++) {
        for (let y = 0; y < newField[z].length; y++) {
          for (let x = 0; x < newField[z][y].length; x++) {
            const fluctuation = (Math.random() * 2 - 1) * intentFluctuationRate;
            newField[z][y][x] += fluctuation;
            // Clamp values to [-1, 1]
            newField[z][y][x] = Math.max(-1, Math.min(1, newField[z][y][x]));
          }
        }
      }
      
      intentFieldRef.current = newField;
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
      const particle = newParticles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += viewMode === '3d' ? particle.vz : 0;
      
      // Boundary checks with bounce
      if (particle.x < 0 || particle.x > dimensions.width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
      }
      if (particle.y < 0 || particle.y > dimensions.height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(dimensions.height, particle.y));
      }
      if (particle.z < 0 || particle.z > 10) {
        particle.vz *= -1;
        particle.z = Math.max(0, Math.min(10, particle.z));
      }
      
      // Get intent field value at particle position
      const fieldX = Math.floor(particle.x / (dimensions.width / intentField[0][0].length));
      const fieldY = Math.floor(particle.y / (dimensions.height / intentField[0].length));
      const fieldZ = Math.floor(particle.z / (10 / intentField.length));
      
      try {
        const fieldValue = intentField[
          Math.min(fieldZ, intentField.length - 1)
        ][
          Math.min(fieldY, intentField[0].length - 1)
        ][
          Math.min(fieldX, intentField[0][0].length - 1)
        ];
        
        // Adjust velocity based on intent field and particle's own intent
        const influence = fieldValue * 0.01;
        particle.vx += influence * (Math.random() - 0.5);
        particle.vy += influence * (Math.random() - 0.5);
        if (viewMode === '3d') {
          particle.vz += influence * (Math.random() - 0.5) * 0.5;
        }
        
        // Limit velocity
        const maxSpeed = particle.charge === 'positive' ? 2 : 
                        particle.charge === 'negative' ? 1 : 1.5;
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2 + particle.vz ** 2);
        if (speed > maxSpeed) {
          const factor = maxSpeed / speed;
          particle.vx *= factor;
          particle.vy *= factor;
          particle.vz *= factor;
        }
      } catch (error) {
        // Handle potential out-of-bounds errors
        console.log("Field access error", error);
      }
      
      // Interaction with other particles
      for (let j = i + 1; j < newParticles.length; j++) {
        const other = newParticles[j];
        const dx = other.x - particle.x;
        const dy = other.y - particle.y;
        const dz = viewMode === '3d' ? other.z - particle.z : 0;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Interaction range
        const interactionRange = (particle.size + other.size) * 4;
        
        if (distance < interactionRange) {
          // Count interactions
          interactionsRef.current += 1;
          
          // Different interactions based on charge
          const interactionStrength = learningRate / (distance + 0.1);
          
          // Exchange knowledge based on charge
          if (particle.charge === 'positive' && other.charge === 'positive') {
            // Strong knowledge exchange for positive-positive
            newParticles[i].knowledge += other.knowledge * interactionStrength * 0.2;
            newParticles[j].knowledge += particle.knowledge * interactionStrength * 0.2;
            
            // Attraction
            const force = interactionStrength * 0.05;
            newParticles[i].vx += dx * force;
            newParticles[i].vy += dy * force;
            newParticles[j].vx -= dx * force;
            newParticles[j].vy -= dy * force;
          } 
          else if (particle.charge === 'negative' && other.charge === 'negative') {
            // Minimal knowledge exchange
            newParticles[i].knowledge += other.knowledge * interactionStrength * 0.01;
            newParticles[j].knowledge += particle.knowledge * interactionStrength * 0.01;
            
            // Repulsion
            const force = interactionStrength * 0.1;
            newParticles[i].vx -= dx * force;
            newParticles[i].vy -= dy * force;
            newParticles[j].vx += dx * force;
            newParticles[j].vy += dy * force;
          }
          else if (particle.charge === 'positive' && other.charge === 'negative') {
            // Moderate knowledge exchange
            newParticles[i].knowledge += other.knowledge * interactionStrength * 0.1;
            newParticles[j].knowledge += particle.knowledge * interactionStrength * 0.02;
            
            // Neutral effect
            const force = interactionStrength * 0.02;
            newParticles[i].vx += dx * force;
            newParticles[i].vy += dy * force;
            newParticles[j].vx -= dx * force;
            newParticles[j].vy -= dy * force;
          }
          else {
            // Other combinations (including neutral)
            newParticles[i].knowledge += other.knowledge * interactionStrength * 0.05;
            newParticles[j].knowledge += particle.knowledge * interactionStrength * 0.05;
            
            // Slight attraction
            const force = interactionStrength * 0.01;
            newParticles[i].vx += dx * force;
            newParticles[i].vy += dy * force;
            newParticles[j].vx -= dx * force;
            newParticles[j].vy -= dy * force;
          }
          
          // Visual indication of interaction (color blending)
          const colorBlend = (color1: string, color2: string, amount: number): string => {
            // Simple RGBA color blending
            const match1 = color1.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            const match2 = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            
            if (!match1 || !match2) return color1;
            
            const r1 = parseInt(match1[1]), g1 = parseInt(match1[2]), b1 = parseInt(match1[3]), a1 = parseFloat(match1[4]);
            const r2 = parseInt(match2[1]), g2 = parseInt(match2[2]), b2 = parseInt(match2[3]), a2 = parseFloat(match2[4]);
            
            const r = Math.round(r1 * (1 - amount) + r2 * amount);
            const g = Math.round(g1 * (1 - amount) + g2 * amount);
            const b = Math.round(b1 * (1 - amount) + b2 * amount);
            const a = a1 * (1 - amount) + a2 * amount;
            
            return `rgba(${r}, ${g}, ${b}, ${a})`;
          };
          
          const blendAmount = interactionStrength * 0.1;
          newParticles[i].color = colorBlend(particle.color, other.color, blendAmount);
          newParticles[j].color = colorBlend(other.color, particle.color, blendAmount);
          
          // Knowledge increases size slightly
          newParticles[i].size = Math.min(10, particle.size + particle.knowledge * 0.0001);
          newParticles[j].size = Math.min(10, other.size + other.knowledge * 0.0001);
        }
      }
    }
    
    return newParticles;
  }, [viewMode, learningRate]);

  // Draw particles
  const drawParticles = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const particles = particlesRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
    
    // Draw each particle
    particles.forEach(particle => {
      const scaleFactor = viewMode === '3d' ? 5 / (particle.z + 5) : 1;
      const drawSize = particle.size * scaleFactor;
      const drawX = particle.x;
      const drawY = particle.y;
      
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Optional: Glow effect based on knowledge
      if (particle.knowledge > 1) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize + particle.knowledge * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.3, particle.knowledge * 0.01)})`;
        ctx.fill();
      }
    });
  }, [viewMode]);
  
  // Animation loop with RAF
  useEffect(() => {
    if (!running || !isInitialized) return;
    
    const animate = () => {
      frameCountRef.current += 1;
      
      // Update particles
      particlesRef.current = updateParticles();
      
      // Draw particles
      drawParticles();
      
      // Update stats every 30 frames
      if (frameCountRef.current % 30 === 0) {
        const newParticles = particlesRef.current;
        const positiveParticles = newParticles.filter(p => p.charge === 'positive').length;
        const negativeParticles = newParticles.filter(p => p.charge === 'negative').length;
        const neutralParticles = newParticles.filter(p => p.charge === 'neutral').length;
        
        // Calculate complexity index (a sample metric)
        const totalKnowledge = newParticles.reduce((sum, p) => sum + p.knowledge, 0);
        const varietyFactor = (positiveParticles * negativeParticles * neutralParticles) / 
                            Math.max(1, newParticles.length ** 2);
        const complexityIndex = (totalKnowledge * varietyFactor) + (interactionsRef.current / 1000);
        
        onStatsUpdate({
          positiveParticles,
          negativeParticles,
          neutralParticles,
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
  }, [running, isInitialized, updateParticles, drawParticles, onStatsUpdate]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-black/90"
    />
  );
};
