
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface Particle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  type: string;
}

const SimulationPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const navigate = useNavigate();
  const animationRef = useRef<number | null>(null);
  const intentFieldRef = useRef<number[][][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Initialize intent field
    const width = canvas.width;
    const height = canvas.height;
    const depth = 20;
    
    const intentField = Array(depth).fill(0).map(() => 
      Array(height).fill(0).map(() => 
        Array(width).fill(0).map(() => Math.random() * 2 - 1)
      )
    );
    intentFieldRef.current = intentField;

    // Generate initial particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      const isPositive = Math.random() > 0.5;
      const isNeutral = Math.random() > 0.8;
      let color = '#FF6B6B'; // negative
      let type = 'negative';
      
      if (isNeutral) {
        color = '#5E60CE'; // neutral
        type = 'neutral';
      } else if (isPositive) {
        color = '#4ECDC4'; // positive
        type = 'positive';
      }
      
      initialParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * depth,
        radius: 3 + Math.random() * 3,
        color,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type
      });
    }
    
    setParticles(initialParticles);

    // Start animation loop
    const animate = () => {
      if (!canvas || !context) return;
      
      // Clear canvas
      context.fillStyle = 'rgba(10, 10, 35, 0.1)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update intent field slightly
      intentFieldRef.current = intentFieldRef.current.map(plane => 
        plane.map(row => 
          row.map(value => {
            const fluctuation = (Math.random() * 0.1) - 0.05;
            return Math.max(-1, Math.min(1, value + fluctuation));
          })
        )
      );
      
      // Update and draw particles
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Get intent field value at particle position
          const x = Math.floor(Math.min(particle.x, canvas.width - 1));
          const y = Math.floor(Math.min(particle.y, canvas.height - 1));
          const z = Math.floor(Math.min(particle.z, depth - 1));
          const intentValue = intentFieldRef.current[z][y][x];
          
          // Update velocity based on intent field and particle type
          let intentMultiplier = 0.05;
          if (particle.type === 'positive') intentMultiplier = 0.1;
          if (particle.type === 'negative') intentMultiplier = 0.03;
          
          const newVx = particle.vx + intentValue * intentMultiplier;
          const newVy = particle.vy + intentValue * intentMultiplier;
          
          // Update position
          let newX = particle.x + newVx;
          let newY = particle.y + newVy;
          
          // Bounce off walls
          if (newX < 0 || newX > canvas.width) {
            newX = Math.max(0, Math.min(newX, canvas.width));
            newVx = -newVx * 0.8;
          }
          
          if (newY < 0 || newY > canvas.height) {
            newY = Math.max(0, Math.min(newY, canvas.height));
            newVy = -newVy * 0.8;
          }
          
          // Draw the particle
          context.beginPath();
          context.arc(newX, newY, particle.radius, 0, Math.PI * 2);
          context.fillStyle = particle.color;
          context.fill();
          
          // Draw a subtle glow
          const gradient = context.createRadialGradient(
            newX, newY, 0,
            newX, newY, particle.radius * 3
          );
          gradient.addColorStop(0, `${particle.color}99`);
          gradient.addColorStop(1, 'transparent');
          
          context.beginPath();
          context.arc(newX, newY, particle.radius * 3, 0, Math.PI * 2);
          context.fillStyle = gradient;
          context.fill();
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });
      });
      
      // Occasionally add a new particle
      if (Math.random() < 0.01 && particles.length < 100) {
        const isPositive = Math.random() > 0.5;
        const isNeutral = Math.random() > 0.8;
        let color = '#FF6B6B'; // negative
        let type = 'negative';
        
        if (isNeutral) {
          color = '#5E60CE'; // neutral
          type = 'neutral';
        } else if (isPositive) {
          color = '#4ECDC4'; // positive
          type = 'positive';
        }
        
        setParticles(prev => [...prev, {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * depth,
          radius: 3 + Math.random() * 3,
          color,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          type
        }]);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const handleExploreClick = () => {
    navigate('/universe-simulator');
  };
  
  return (
    <div className="w-full relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">
          Experience the IntentSim Particle Universe
        </h2>
        <p className="text-white mb-6 max-w-lg drop-shadow-lg">
          A continuous simulation where particles evolve based on the intent field
        </p>
        <Button 
          onClick={handleExploreClick}
          size="lg" 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Explore Full Simulation
        </Button>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-[400px] rounded-lg bg-gray-900"
      />
      
      <div className="absolute bottom-4 left-4 text-white text-sm z-10">
        <div className="flex items-center mb-1">
          <span className="h-3 w-3 rounded-full bg-[#4ECDC4] inline-block mr-2"></span>
          <span>Positive charge - High intent to interact</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="h-3 w-3 rounded-full bg-[#FF6B6B] inline-block mr-2"></span>
          <span>Negative charge - Low intent to interact</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-[#5E60CE] inline-block mr-2"></span>
          <span>Neutral charge - Moderate intent</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationPreview;
