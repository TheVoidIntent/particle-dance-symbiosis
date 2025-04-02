
import React, { useRef, useEffect } from 'react';
import { Particle } from '@/utils/particleUtils';

interface ParticleCanvasProps {
  particles: Particle[];
  width?: number;
  height?: number;
  showIntentField?: boolean;
  intentField?: number[][][];
  className?: string;
  backgroundColor?: string;
  particleColors?: {
    positive: string;
    negative: string;
    neutral: string;
    [key: string]: string;
  };
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  particles,
  width = 800,
  height = 600,
  showIntentField = false,
  intentField,
  className = '',
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  particleColors = {
    positive: 'rgba(255, 100, 100, 0.8)',
    negative: 'rgba(100, 100, 255, 0.8)',
    neutral: 'rgba(180, 180, 180, 0.8)',
  },
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw intent field if enabled and available
    if (showIntentField && intentField && intentField.length > 0) {
      const fieldLayer = intentField[0]; // Just use the first layer for simplicity
      const cellWidth = canvas.width / fieldLayer[0].length;
      const cellHeight = canvas.height / fieldLayer.length;
      
      for (let y = 0; y < fieldLayer.length; y++) {
        for (let x = 0; x < fieldLayer[y].length; x++) {
          const intentValue = fieldLayer[y][x];
          
          // Map intent value from [-1, 1] to a color
          const intensity = Math.abs(intentValue) * 255;
          let color;
          
          if (intentValue > 0) {
            // Positive intent: reddish
            color = `rgba(${intensity}, 50, 50, 0.1)`;
          } else {
            // Negative intent: bluish
            color = `rgba(50, 50, ${intensity}, 0.1)`;
          }
          
          ctx.fillStyle = color;
          ctx.fillRect(
            x * cellWidth,
            y * cellHeight,
            cellWidth,
            cellHeight
          );
        }
      }
    }
    
    // Draw particles
    particles.forEach(particle => {
      // Skip particles outside the canvas
      if (
        particle.x < 0 ||
        particle.x > canvas.width ||
        particle.y < 0 ||
        particle.y > canvas.height
      ) {
        return;
      }
      
      // Determine particle color based on charge
      const baseColor = particleColors[particle.charge || 'neutral'];
      
      // Calculate particle size based on energy if available
      const particleSize = particle.energy 
        ? Math.min(Math.max(2 + (particle.energy / 20), 2), 12)
        : 5;
      
      // Adjust opacity based on intent if available
      const opacity = particle.intent !== undefined 
        ? 0.3 + (particle.intent * 0.7) 
        : 0.8;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
      
      // Apply glow effect for high-energy particles
      if (particle.energy && particle.energy > 50) {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particleSize * 2
        );
        
        // Create gradient with base color
        const baseColorRgb = baseColor.match(/\d+/g);
        if (baseColorRgb && baseColorRgb.length >= 3) {
          const [r, g, b] = baseColorRgb;
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = baseColor;
        }
      } else {
        ctx.fillStyle = baseColor;
      }
      
      ctx.fill();
      
      // Draw a directional indicator if velocity is available
      if (particle.vx !== undefined && particle.vy !== undefined) {
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const normalizedVx = particle.vx / speed;
        const normalizedVy = particle.vy / speed;
        
        // Only draw indicator if speed is significant
        if (speed > 0.5) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(
            particle.x + normalizedVx * particleSize * 1.5,
            particle.y + normalizedVy * particleSize * 1.5
          );
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });
    
  }, [particles, width, height, backgroundColor, particleColors, showIntentField, intentField]);
  
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleCanvas;
