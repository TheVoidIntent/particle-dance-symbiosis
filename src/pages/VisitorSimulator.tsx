import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Info, Music2 } from "lucide-react";
import { toast } from "sonner";
import AudioOptionsSection from '@/components/simulation/AudioOptionsSection';
import { playAudioWithErrorHandling } from '@/utils/audio/audioPlaybackUtils';
import { getAvailableAudioFiles } from '@/utils/audio/audioFileUtils';

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
  // Basic simulation parameters
  const [intentFluctuationRate, setIntentFluctuationRate] = useState(0.015);
  const [maxParticles, setMaxParticles] = useState(80);
  const [running, setRunning] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [positiveParticles, setPositiveParticles] = useState(0);
  const [negativeParticles, setNegativeParticles] = useState(0);
  const [neutralParticles, setNeutralParticles] = useState(0);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [backgroundAudioActive, setBackgroundAudioActive] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Canvas and animation references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intentFieldRef = useRef<number[][]>([]);
  
  // Initialize simulation and load audio files
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Initialize intent field grid (simplified for performance)
        const gridSize = 20; // Size of grid cells
        const cols = Math.ceil(canvas.width / gridSize);
        const rows = Math.ceil(canvas.height / gridSize);
        
        const newField: number[][] = [];
        for (let y = 0; y < rows; y++) {
          const row: number[] = [];
          for (let x = 0; x < cols; x++) {
            // Random values between -1 and 1 (negative to positive intent)
            row.push(Math.random() * 2 - 1);
          }
          newField.push(row);
        }
        intentFieldRef.current = newField;
      }
    };
    
    // Load available audio files
    const loadAudioFiles = async () => {
      try {
        // Get all audio files from the public/audio directory
        const files = await getAvailableAudioFiles('/audio');
        setAudioFiles(files);
        console.log("Loaded audio files:", files);
        
        // Initialize audio element for background audio
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new Audio();
          audioPlayerRef.current.volume = 0.2;
          audioPlayerRef.current.onended = () => {
            // Play next random audio when current one ends
            if (backgroundAudioActive) {
              playRandomBackgroundAudio();
            }
          };
        }
      } catch (error) {
        console.error("Error loading audio files:", error);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Initial particles
    initializeParticles();
    
    // Load audio files
    loadAudioFiles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Stop audio when component unmounts
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);
  
  // Play random background audio
  const playRandomBackgroundAudio = () => {
    if (!audioFiles.length || !audioPlayerRef.current) return;
    
    // Select a random audio file
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudioFile = audioFiles[randomIndex];
    
    // Set the audio source and play
    audioPlayerRef.current.src = `/audio/${randomAudioFile}`;
    audioPlayerRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
      // Try next file if this one fails
      if (backgroundAudioActive) {
        setTimeout(playRandomBackgroundAudio, 1000);
      }
    });
    
    console.log("Now playing:", randomAudioFile);
  };
  
  // Toggle background audio
  const toggleBackgroundAudio = () => {
    const newState = !backgroundAudioActive;
    setBackgroundAudioActive(newState);
    
    if (newState) {
      // Start playing random audio
      playRandomBackgroundAudio();
      toast.success("Background audio enabled");
    } else {
      // Stop the audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      toast.info("Background audio disabled");
    }
  };
  
  // Initialize particles
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Create initial particles
    const newParticles: Particle[] = [];
    const initialCount = Math.min(maxParticles, 30); // Start with fewer particles
    
    for (let i = 0; i < initialCount; i++) {
      const type = Math.random() < 0.33 
        ? 'positive' 
        : Math.random() < 0.5 
          ? 'negative' 
          : 'neutral';
      
      newParticles.push(createParticle(type, width, height));
    }
    
    particlesRef.current = newParticles;
    
    // Update counters
    updateParticleCounts();
  };
  
  // Create a new particle
  const createParticle = (type: 'positive' | 'negative' | 'neutral', width: number, height: number): Particle => {
    // Different colors for different types
    const color = type === 'positive' 
      ? '#4ECDC4' // Blue for positive
      : type === 'negative' 
        ? '#FF6B6B' // Red for negative
        : '#5E60CE'; // Purple for neutral
    
    // Different velocities based on type (positive = more active)
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
      
      // Clear canvas with a fade effect for trails
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, width, height);
      
      // Update intent field (occasionally)
      if (Math.random() < intentFluctuationRate) {
        updateIntentField();
        
        // Occasionally play a random field fluctuation sound
        if (Math.random() < 0.05 && backgroundAudioActive) {
          // Play a short audio clip for field fluctuation
          const shortClip = new Audio('/audio/intentsim_page/field_fluctuation.mp3');
          shortClip.volume = 0.1;
          shortClip.play().catch(e => console.error("Error playing fluctuation sound:", e));
        }
      }
      
      // Update particles
      updateParticles(width, height);
      
      // Draw particles
      drawParticles(context);
      
      // Maybe create a new particle
      if (Math.random() < 0.05 && particlesRef.current.length < maxParticles) {
        // Bias towards types based on intent field
        const positiveChance = 0.3 + intentFluctuationRate * 2;
        const negativeChance = 0.3 - intentFluctuationRate;
        
        const type = Math.random() < positiveChance 
          ? 'positive' 
          : Math.random() < negativeChance 
            ? 'negative' 
            : 'neutral';
        
        particlesRef.current.push(createParticle(type, width, height));
        updateParticleCounts();
        
        // Play particle creation sound occasionally
        if (Math.random() < 0.2 && backgroundAudioActive) {
          // Different sounds for different particle types
          const soundFile = type === 'positive' 
            ? '/audio/intentsim_page/positive_particle_birth.mp3'
            : type === 'negative'
            ? '/audio/intentsim_page/negative_particle_birth.mp3'
            : '/audio/intentsim_page/neutral_particle_birth.mp3';
            
          const particleSound = new Audio(soundFile);
          particleSound.volume = 0.15;
          particleSound.play().catch(e => console.error("Error playing particle sound:", e));
        }
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [running, intentFluctuationRate, maxParticles, backgroundAudioActive]);
  
  // Update intent field with fluctuations
  const updateIntentField = () => {
    const newField = intentFieldRef.current.map(row => 
      row.map(value => {
        // Apply small random fluctuations
        const fluctuation = (Math.random() - 0.5) * intentFluctuationRate * 2;
        // Constrain field values to [-1, 1]
        return Math.max(-1, Math.min(1, value + fluctuation));
      })
    );
    intentFieldRef.current = newField;
  };
  
  // Update particle positions and velocities
  const updateParticles = (width: number, height: number) => {
    const gridSize = 20;
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      // Get intent field influence at particle position
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      
      if (gridX >= 0 && gridX < intentFieldRef.current[0]?.length && 
          gridY >= 0 && gridY < intentFieldRef.current.length) {
        
        const fieldValue = intentFieldRef.current[gridY][gridX];
        
        // Adjust velocity based on field value and particle type
        let fieldMultiplier = 0.02;
        if (particle.type === 'positive') fieldMultiplier = 0.03;
        if (particle.type === 'negative') fieldMultiplier = 0.01;
        
        // Field affects velocity - positive particles are more responsive
        particle.vx += fieldValue * fieldMultiplier;
        particle.vy += fieldValue * fieldMultiplier;
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary checks - bounce off edges
      if (particle.x < 0 || particle.x > width) {
        particle.vx = -particle.vx * 0.8;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      
      if (particle.y < 0 || particle.y > height) {
        particle.vy = -particle.vy * 0.8;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
      
      // Apply damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Add small random movement
      particle.vx += (Math.random() - 0.5) * 0.05;
      particle.vy += (Math.random() - 0.5) * 0.05;
    });
  };
  
  // Draw particles on the canvas
  const drawParticles = (context: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      // Draw glow effect
      const gradient = context.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, particle.color + '80'); // Semi-transparent
      gradient.addColorStop(1, 'transparent');
      
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      
      // Draw particle core
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.fill();
    });
  };
  
  // Update particle counts for the UI
  const updateParticleCounts = () => {
    const particles = particlesRef.current;
    setPositiveParticles(particles.filter(p => p.type === 'positive').length);
    setNegativeParticles(particles.filter(p => p.type === 'negative').length);
    setNeutralParticles(particles.filter(p => p.type === 'neutral').length);
  };
  
  const toggleRunning = () => {
    setRunning(!running);
    toast.info(running ? "Simulation paused" : "Simulation resumed");
  };
  
  const handleDownloadInfo = () => {
    toast.info("This is a simplified version. For full data exports, log in to the creator version.");
  };
  
  const dismissIntro = () => {
    setShowIntro(false);
  };

  // Define floating animation styles
  const floatKeyframes = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <Helmet>
        <title>Simulation Explorer | IntentSim</title>
        <meta name="description" content="Explore how particles emerge from intent field fluctuations in this simplified simulation." />
        <style>{floatKeyframes}</style>
      </Helmet>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        IntentSim Explorer
      </h1>
      
      {showIntro && (
        <Card className="bg-gray-800/50 border-gray-700 mb-8 max-w-3xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Welcome to IntentSim Explorer</h2>
            <p className="mb-4 text-gray-300">
              This is a simplified version of the IntentSim universe simulator. Adjust the parameters to see how particles emerge from intent field fluctuations and interact based on their charge characteristics.
            </p>
            <p className="mb-4 text-gray-300">
              In this model, positive charges seek interaction, negative charges avoid it, and neutral particles follow their own path - all born from the universe's intent to know itself.
            </p>
            <div className="flex justify-between items-center">
              <Button onClick={dismissIntro}>Got it</Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Enable Audio Experience</span>
                <Switch 
                  checked={backgroundAudioActive} 
                  onCheckedChange={toggleBackgroundAudio} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0 relative">
              {/* Simulation canvas */}
              <div className="aspect-video bg-black rounded-t-lg overflow-hidden flex items-center justify-center relative">
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full"
                />
                
                {!running && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-xl font-semibold">Simulation Paused</span>
                  </div>
                )}
              </div>
              
              {/* Current Particle Count Display */}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-2 rounded-md text-sm">
                Particles: {Math.floor(positiveParticles + negativeParticles + neutralParticles)}
              </div>
              
              {/* Audio Status Display */}
              {backgroundAudioActive && (
                <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <span>Audio On</span>
                </div>
              )}
              
              {/* Simulation controls bar */}
              <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleRunning}
                  className="bg-gray-700/50"
                >
                  {running ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                  {running ? 'Pause' : 'Resume'}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleBackgroundAudio}
                    className={`bg-gray-700/50 ${backgroundAudioActive ? 'border-indigo-400' : ''}`}
                  >
                    <Music2 className={`h-4 w-4 mr-1 ${backgroundAudioActive ? 'text-indigo-400' : ''}`} />
                    {backgroundAudioActive ? 'Audio On' : 'Audio Off'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadInfo}
                    className="bg-gray-700/50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Data
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("For detailed information, visit the documentation or log in to the creator version.")}
                    className="bg-gray-700/50"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2 text-blue-400">Positive Intent</h3>
                <div className="text-3xl font-bold mb-1">{Math.floor(positiveParticles)}</div>
                <p className="text-sm text-gray-400">Particles actively seeking interaction and knowledge-sharing</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2 text-red-400">Negative Intent</h3>
                <div className="text-3xl font-bold mb-1">{Math.floor(negativeParticles)}</div>
                <p className="text-sm text-gray-400">Particles avoiding interaction, conserving information</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2 text-green-400">Neutral Intent</h3>
                <div className="text-3xl font-bold mb-1">{Math.floor(neutralParticles)}</div>
                <p className="text-sm text-gray-400">Particles with balanced tendencies</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <AudioOptionsSection />
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Simulation Controls</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Intent Fluctuation Rate</label>
                    <span className="text-sm text-gray-400">{intentFluctuationRate.toFixed(3)}</span>
                  </div>
                  <Slider 
                    value={[intentFluctuationRate]}
                    min={0.001}
                    max={0.05}
                    step={0.001}
                    onValueChange={(value) => setIntentFluctuationRate(value[0])}
                  />
                  <p className="text-xs text-gray-500">Controls how often the intent field fluctuates to create particles</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Maximum Particles</label>
                    <span className="text-sm text-gray-400">{maxParticles}</span>
                  </div>
                  <Slider 
                    value={[maxParticles]}
                    min={10}
                    max={150}
                    step={5}
                    onValueChange={(value) => setMaxParticles(value[0])}
                  />
                  <p className="text-xs text-gray-500">Limits the total number of particles in the simulation</p>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Running</span>
                    <Switch checked={running} onCheckedChange={setRunning} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Music2 className="h-4 w-4 text-indigo-400" />
                Audio Explanations
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Listen to curated audio explanations about the IntentSim universe:
              </p>
              <Button 
                className="w-full" 
                onClick={() => toast.success("Audio library is now available in the main section!")}
              >
                Browse Audio Library
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-3">Want to access the full version with all features?</p>
        <Button variant="outline" onClick={() => window.location.href = '/auth'}>
          Log in as Creator
        </Button>
      </div>
    </div>
  );
};

export default VisitorSimulator;
