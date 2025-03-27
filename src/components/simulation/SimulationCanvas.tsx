import React, { useRef, useEffect } from 'react';
import { Particle } from '@/types/simulation';

interface SimulationCanvasProps {
  intentFluctuationRate: number;
  maxParticles: number;
  particleCreationRate: number;
  positiveChargeBehavior: number;
  negativeChargeBehavior: number;
  neutralChargeBehavior: number;
  probabilisticIntent: boolean;
  visualizationMode: 'particles' | 'field' | 'both';
  running: boolean;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  intentFluctuationRate,
  maxParticles,
  particleCreationRate,
  positiveChargeBehavior,
  negativeChargeBehavior,
  neutralChargeBehavior,
  probabilisticIntent,
  visualizationMode,
  running
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize the simulation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Initialize intent field grid
      const gridSize = 20; // Size of each grid cell
      const cols = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);
      
      // Create or reset intent field
      const newField: number[][] = [];
      for (let y = 0; y < rows; y++) {
        const row: number[] = [];
        for (let x = 0; x < cols; x++) {
          // Initialize with random values between -1 and 1
          row.push(Math.random() * 2 - 1);
        }
        newField.push(row);
      }
      intentFieldRef.current = newField;
    };
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Main simulation loop
  useEffect(() => {
    if (!canvasRef.current || !running) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const gridSize = 20;
    
    // Create a new particle
    const createParticle = () => {
      if (particlesRef.current.length >= maxParticles) return;
      
      const x = Math.random() * width;
      const y = Math.random() * height;
      const gridX = Math.floor(x / gridSize);
      const gridY = Math.floor(y / gridSize);
      
      if (gridX >= 0 && gridX < intentFieldRef.current[0].length && 
          gridY >= 0 && gridY < intentFieldRef.current.length) {
        const fieldValue = intentFieldRef.current[gridY][gridX];
        
        // Determine charge based on field value
        let charge: 'positive' | 'negative' | 'neutral';
        if (fieldValue > 0.3) charge = 'positive';
        else if (fieldValue < -0.3) charge = 'negative';
        else charge = 'neutral';
        
        // Set color based on charge
        const color = charge === 'positive' ? 'rgba(239, 68, 68, 0.8)' : // Red
                      charge === 'negative' ? 'rgba(147, 51, 234, 0.8)' : // Purple
                      'rgba(74, 222, 128, 0.8)'; // Green
        
        // Set interaction tendency based on charge and user parameters
        const interactionTendency = charge === 'positive' ? positiveChargeBehavior :
                                    charge === 'negative' ? negativeChargeBehavior :
                                    neutralChargeBehavior;
        
        const newParticle: Particle = {
          id: Date.now() + Math.random(),
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 5 + Math.random() * 3,
          mass: 1 + Math.random() * 0.5,
          charge,
          color,
          intent: fieldValue,
          knowledge: Math.random() * 0.2,
          interactionTendency,
          lastInteraction: 0,
          interactionCount: 0
        };
        
        particlesRef.current.push(newParticle);
      }
    };
    
    // Update intent field with fluctuations
    const updateIntentField = () => {
      const rows = intentFieldRef.current.length;
      const cols = intentFieldRef.current[0].length;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Apply random fluctuations
          const fluctuation = (Math.random() * 2 - 1) * intentFluctuationRate;
          intentFieldRef.current[y][x] += fluctuation;
          
          // Constrain values to prevent extreme values
          intentFieldRef.current[y][x] = Math.max(-1, Math.min(1, intentFieldRef.current[y][x]));
          
          // Add some probabilistic elements if enabled
          if (probabilisticIntent && Math.random() < 0.01) {
            // Occasionally introduce stronger fluctuations to simulate quantum effects
            intentFieldRef.current[y][x] += (Math.random() * 2 - 1) * 0.2;
          }
        }
      }
    };
    
    // Calculate particle interactions
    const handleParticleInteractions = () => {
      const particles = particlesRef.current;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          // Calculate distance between particles
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if particles are close enough to interact
          const interactionRadius = p1.radius + p2.radius + 10;
          if (distance < interactionRadius) {
            // Basic collision response
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Consider masses and interaction tendencies in collision
            const v1 = { x: p1.vx, y: p1.vy };
            const v2 = { x: p2.vx, y: p2.vy };
            
            // Apply interaction tendencies - higher means more likely to exchange knowledge
            if (Math.random() < (p1.interactionTendency + p2.interactionTendency) / 2) {
              // Exchange knowledge during interaction
              const knowledgeExchange = 0.01;
              const p1Knowledge = p1.knowledge;
              const p2Knowledge = p2.knowledge;
              
              p1.knowledge = p1Knowledge * 0.95 + p2Knowledge * 0.05;
              p2.knowledge = p2Knowledge * 0.95 + p1Knowledge * 0.05;
              
              // Record interaction
              p1.lastInteraction = Date.now();
              p2.lastInteraction = Date.now();
              p1.interactionCount++;
              p2.interactionCount++;
            }
            
            // Update velocity based on collision (simplified physics)
            const damping = 0.85; // Energy loss in collision
            
            // Final velocities after collision
            p1.vx = v1.x * cos + v1.y * sin * damping;
            p1.vy = v1.y * cos - v1.x * sin * damping;
            p2.vx = v2.x * cos + v2.y * sin * damping;
            p2.vy = v2.y * cos - v2.x * sin * damping;
          }
        }
      }
    };
    
    // Update particle positions
    const updateParticles = () => {
      const particles = particlesRef.current;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Get intent field value at particle location
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);
        
        if (gridX >= 0 && gridX < intentFieldRef.current[0].length && 
            gridY >= 0 && gridY < intentFieldRef.current.length) {
          const fieldValue = intentFieldRef.current[gridY][gridX];
          
          // Particles are influenced by the intent field
          p.vx += fieldValue * 0.01;
          p.vy += fieldValue * 0.01;
        }
        
        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        
        // Boundary checking
        if (p.x < 0 || p.x > width) p.vx = -p.vx * 0.8;
        if (p.y < 0 || p.y > height) p.vy = -p.vy * 0.8;
        
        // Keep particles in bounds
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
        
        // Add small random movement to simulate quantum uncertainty
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        
        // Apply damping
        p.vx *= 0.99;
        p.vy *= 0.99;
      }
    };
    
    // Draw the intent field
    const drawIntentField = () => {
      if (visualizationMode === 'particles') return;
      
      const rows = intentFieldRef.current.length;
      const cols = intentFieldRef.current[0].length;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const value = intentFieldRef.current[y][x];
          
          // Only draw significant field values
          if (Math.abs(value) > 0.1) {
            const posX = x * gridSize;
            const posY = y * gridSize;
            
            // Color based on field value
            const alpha = Math.min(0.6, Math.abs(value) * 0.6);
            const color = value > 0 ? `rgba(239, 68, 68, ${alpha})` : // Red for positive
                          value < 0 ? `rgba(147, 51, 234, ${alpha})` : // Purple for negative
                          `rgba(74, 222, 128, ${alpha})`; // Green for neutral
            
            context.fillStyle = color;
            context.fillRect(posX, posY, gridSize, gridSize);
          }
        }
      }
    };
    
    // Draw the particles
    const drawParticles = () => {
      if (visualizationMode === 'field') return;
      
      const particles = particlesRef.current;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fillStyle = p.color;
        context.fill();
        
        // Draw a knowledge aura around the particle
        if (p.knowledge > 0.1) {
          context.beginPath();
          context.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          context.strokeStyle = `rgba(255, 255, 255, ${p.knowledge * 0.5})`;
          context.lineWidth = p.knowledge * 3;
          context.stroke();
        }
        
        // Mark particles that have interacted recently
        const timeSinceInteraction = Date.now() - p.lastInteraction;
        if (timeSinceInteraction < 1000) {
          context.beginPath();
          context.arc(p.x, p.y, p.radius + 5, 0, Math.PI * 2);
          context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          context.stroke();
        }
      }
    };
    
    // Main animation loop
    const animate = () => {
      // Clear canvas
      context.fillStyle = 'rgba(0, 0, 0, 0.2)';
      context.fillRect(0, 0, width, height);
      
      // Create new particles based on creation rate
      if (Math.random() < particleCreationRate / 60 && particlesRef.current.length < maxParticles) {
        createParticle();
      }
      
      // Update simulation
      updateIntentField();
      handleParticleInteractions();
      updateParticles();
      
      // Draw simulation elements
      drawIntentField();
      drawParticles();
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup animation frame on unmount or when running changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    running, 
    maxParticles, 
    intentFluctuationRate, 
    particleCreationRate, 
    positiveChargeBehavior, 
    negativeChargeBehavior, 
    neutralChargeBehavior, 
    probabilisticIntent, 
    visualizationMode
  ]);
  
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full bg-black"
      />
      {!running && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 p-4 rounded-lg text-white">
            <h3 className="text-lg font-medium">Simulation Paused</h3>
            <p className="text-sm text-gray-300 mt-1">Adjust parameters or resume to continue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationCanvas;
