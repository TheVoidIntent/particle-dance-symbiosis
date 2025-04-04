import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music2, VolumeX, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { startAudioPlaylist, stopAudioPlaylist, setAudioPlaylistVolume, isAudioPlaylistPlaying, getCurrentTrackName } from '@/utils/audio/audioPlaylist';
import { Link } from 'react-router-dom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'positive' | 'negative' | 'neutral';
}

const VisitorSimulator: React.FC = () => {
  const [intentFluctuationRate, setIntentFluctuationRate] = useState(0.015);
  const [running, setRunning] = useState(true);
  const [audioActive, setAudioActive] = useState(true);
  const [audioVolume, setAudioVolume] = useState(30);
  const [currentTrack, setCurrentTrack] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][]>([]);

  // Initialize canvas and audio on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        const gridSize = 20;
        const cols = Math.ceil(canvas.width / gridSize);
        const rows = Math.ceil(canvas.height / gridSize);
        
        const newField: number[][] = [];
        for (let y = 0; y < rows; y++) {
          const row: number[] = [];
          for (let x = 0; x < cols; x++) {
            row.push(Math.random() * 2 - 1);
          }
          newField.push(row);
        }
        intentFieldRef.current = newField;
      }
    };
    
    // Initialize audio
    try {
      startAudioPlaylist(audioVolume / 100);
      setCurrentTrack(getCurrentTrackName());
    } catch (error) {
      console.error("Error starting audio playlist:", error);
    }
    
    const trackUpdateInterval = setInterval(() => {
      try {
        setCurrentTrack(getCurrentTrackName());
      } catch (error) {
        console.error("Error updating track name:", error);
      }
    }, 1000);
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    initializeParticles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopAudioPlaylist();
      clearInterval(trackUpdateInterval);
    };
  }, [audioVolume]);

  // Handle audio volume changes
  useEffect(() => {
    try {
      setAudioPlaylistVolume(audioVolume / 100);
    } catch (error) {
      console.error("Error setting audio volume:", error);
    }
  }, [audioVolume]);

  // Handle audio toggle
  useEffect(() => {
    try {
      if (audioActive) {
        startAudioPlaylist(audioVolume / 100);
      } else {
        stopAudioPlaylist();
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  }, [audioActive, audioVolume]);

  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const newParticles: Particle[] = [];
    const initialCount = 50;
    
    for (let i = 0; i < initialCount; i++) {
      const type = Math.random() < 0.33 
        ? 'positive' 
        : Math.random() < 0.5 
          ? 'negative' 
          : 'neutral';
      
      newParticles.push(createParticle(type, width, height));
    }
    
    particlesRef.current = newParticles;
  };

  const createParticle = (type: 'positive' | 'negative' | 'neutral', width: number, height: number): Particle => {
    const color = type === 'positive' 
      ? '#4ECDC4'
      : type === 'negative' 
        ? '#FF6B6B'
        : '#5E60CE';
    
    const speedMultiplier = type === 'positive' 
      ? 1.5 
      : type === 'negative' 
        ? 0.7 
        : 1.0;
    
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2 * speedMultiplier,
      vy: (Math.random() - 0.5) * 2 * speedMultiplier,
      radius: 3 + Math.random() * 3,
      color,
      type
    };
  };

  // Animation loop
  useEffect(() => {
    if (!running) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Use more transparent black for trail effect to keep particles visible longer
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, width, height);
      
      if (Math.random() < intentFluctuationRate) {
        updateIntentField();
      }
      
      updateParticles(width, height);
      
      // Draw network connections between particles (ALWAYS ENABLED)
      drawNetworkConnections(context);
      
      // Draw particles
      drawParticles(context);
      
      if (Math.random() < 0.05 && particlesRef.current.length < 150) {
        const positiveChance = 0.3 + intentFluctuationRate * 2;
        const negativeChance = 0.3 - intentFluctuationRate;
        
        const type = Math.random() < positiveChance 
          ? 'positive' 
          : Math.random() < negativeChance 
            ? 'negative' 
            : 'neutral';
        
        particlesRef.current.push(createParticle(type, width, height));
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [running, intentFluctuationRate]);

  // New function to draw network connections
  const drawNetworkConnections = (context: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    
    // Draw lines between particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        
        // Calculate distance
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw connections if particles are within a certain distance
        // Increased from 100 to 150 for more visible connections
        const maxDistance = 150;
        if (distance < maxDistance) {
          // Calculate opacity based on distance (closer = more opaque)
          const opacity = (1 - distance / maxDistance) * 0.5;
          
          // Determine connection color based on particle types
          let connectionColor;
          if (p1.type === p2.type) {
            // Same type connections
            if (p1.type === 'positive') {
              connectionColor = `rgba(180, 220, 255, ${opacity})`; // Blue for positive-positive
            } else if (p1.type === 'negative') {
              connectionColor = `rgba(255, 180, 180, ${opacity})`; // Red for negative-negative
            } else {
              connectionColor = `rgba(180, 255, 180, ${opacity})`; // Green for neutral-neutral
            }
          } else {
            // Different type connections
            connectionColor = `rgba(220, 220, 255, ${opacity})`; // White-ish for mixed
          }
          
          // Draw the connection line
          context.beginPath();
          context.moveTo(p1.x, p1.y);
          context.lineTo(p2.x, p2.y);
          context.strokeStyle = connectionColor;
          context.lineWidth = opacity * 2; // Thicker lines for closer particles
          context.stroke();
        }
      }
    }
  };

  const updateIntentField = () => {
    const newField = intentFieldRef.current.map(row => 
      row.map(value => {
        const fluctuation = (Math.random() - 0.5) * intentFluctuationRate * 2;
        return Math.max(-1, Math.min(1, value + fluctuation));
      })
    );
    intentFieldRef.current = newField;
  };

  const updateParticles = (width: number, height: number) => {
    const gridSize = 20;
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      
      if (gridX >= 0 && gridX < intentFieldRef.current[0]?.length && 
          gridY >= 0 && gridY < intentFieldRef.current.length) {
        
        const fieldValue = intentFieldRef.current[gridY][gridX];
        
        let fieldMultiplier = 0.02;
        if (particle.type === 'positive') fieldMultiplier = 0.03;
        if (particle.type === 'negative') fieldMultiplier = 0.01;
        
        particle.vx += fieldValue * fieldMultiplier;
        particle.vy += fieldValue * fieldMultiplier;
      }
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > width) {
        particle.vx = -particle.vx * 0.8;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      
      if (particle.y < 0 || particle.y > height) {
        particle.vy = -particle.vy * 0.8;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
      
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      particle.vx += (Math.random() - 0.5) * 0.05;
      particle.vy += (Math.random() - 0.5) * 0.05;
    });
  };

  const drawParticles = (context: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      // Draw the glow/aura
      const gradient = context.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, particle.color + '80');
      gradient.addColorStop(1, 'transparent');
      
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      
      // Draw the particle core
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.fill();
    });
  };

  const toggleAudio = () => {
    setAudioActive(!audioActive);
    toast.info(audioActive ? "Audio paused" : "Audio playing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Helmet>
        <title>IntentSim Universe | Experience The Intent Field</title>
        <meta name="description" content="Watch particles emerge from intent field fluctuations in an interactive simulation" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg flex-grow flex flex-col relative overflow-hidden">
          {/* Canvas fills the main area */}
          <div className="flex-grow w-full relative">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full"
            />
          </div>
          
          {/* Audio controls overlay */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-lg flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleAudio}
              className="text-white/80 hover:text-white"
            >
              {audioActive ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            
            <Slider
              value={[audioVolume]}
              max={100}
              step={1}
              onValueChange={(value) => setAudioVolume(value[0])}
              className="w-28"
            />
            
            <span className="text-xs text-white/70 max-w-40 truncate">
              {currentTrack.replace('.wav', '')}
            </span>
          </div>
          
          {/* Navigation Menu */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-lg">
            <div className="flex space-x-4">
              <Link to="/mascot" className="text-white/80 hover:text-white transition-colors px-3 py-1 rounded hover:bg-white/10">
                IntentSim Mascot
              </Link>
              <Link to="/simulator" className="text-white/80 hover:text-white transition-colors px-3 py-1 rounded hover:bg-white/10">
                Advanced Simulation
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer content */}
        <div className="py-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} IntentSim.org - Universe Intent Simulation
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitorSimulator;
