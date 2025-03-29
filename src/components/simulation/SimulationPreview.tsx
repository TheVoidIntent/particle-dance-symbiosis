import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { startMotherSimulation, isMotherSimulationRunning } from '@/utils/simulation/motherSimulation';

const SimulationPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Start the mother simulation if not already running
    if (!isMotherSimulationRunning()) {
      startMotherSimulation();
    }
    
    // Simple animation to show particles in motion
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      charge: 'positive' | 'negative' | 'neutral';
    }> = [];
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
      const charge = Math.random() < 0.33 ? 'positive' : 
                     Math.random() < 0.5 ? 'negative' : 'neutral';
      
      const color = charge === 'positive' ? 'rgba(239, 68, 68, 0.8)' : // Red
                    charge === 'negative' ? 'rgba(147, 51, 234, 0.8)' : // Purple
                    'rgba(74, 222, 128, 0.8)'; // Green
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 3 + Math.random() * 3,
        color,
        charge
      });
    }
    
    // Intent field grid - simplified for preview
    const gridSize = 20;
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    const intentField: number[][] = Array(rows).fill(0).map(() => 
      Array(cols).fill(0).map(() => Math.random() * 2 - 1)
    );
    
    const animate = () => {
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw intent field (simplified)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const value = intentField[y][x];
          
          // Only draw significant field values
          if (Math.abs(value) > 0.3) {
            const posX = x * gridSize;
            const posY = y * gridSize;
            
            const alpha = Math.min(0.3, Math.abs(value) * 0.3);
            const color = value > 0 ? `rgba(239, 68, 68, ${alpha})` : // Red
                          value < 0 ? `rgba(147, 51, 234, ${alpha})` : // Purple
                          `rgba(74, 222, 128, ${alpha})`; // Green
            
            ctx.fillStyle = color;
            ctx.fillRect(posX, posY, gridSize, gridSize);
          }
          
          // Add some random fluctuation
          intentField[y][x] += (Math.random() * 2 - 1) * 0.01;
          intentField[y][x] = Math.max(-1, Math.min(1, intentField[y][x]));
        }
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        // Get field value at particle position
        const gridX = Math.floor(particle.x / gridSize);
        const gridY = Math.floor(particle.y / gridSize);
        
        if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
          // Particles affected by intent field
          particle.vx += intentField[gridY][gridX] * 0.01;
          particle.vy += intentField[gridY][gridX] * 0.01;
        }
        
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        // Apply damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw glow based on charge
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/[^,]+(?=\))/, '0.2');
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <CardContent className="p-0 relative h-full">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full bg-black"
          aria-label="Intent Simulation Preview"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Universe Intent Simulation</h3>
          <Link to="/simulation">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Launch Full Simulation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationPreview;
