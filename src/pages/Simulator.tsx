
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSimpleAudio } from '@/hooks/useSimpleAudio';
import { startMotherSimulation, stopMotherSimulation, isMotherSimulationRunning, getParticles } from '@/utils/simulation/motherSimulation';

const Simulator: React.FC = () => {
  const [volume, setVolume] = useState(50);
  const simpleAudio = useSimpleAudio(true, volume / 100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  // Initialize simulation
  useEffect(() => {
    // Start the simulation
    if (!isMotherSimulationRunning()) {
      startMotherSimulation();
    }
    
    // Start ambient audio
    simpleAudio.playAmbientSound({
      type: 'intent_field',
      intensity: 0.6,
      complexity: 0.7
    });

    // Set up animation loop
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const particles = getParticles();
      
      // The actual drawing is handled by the motherSimulation
      // but we use this loop to occasionally trigger ambient sounds
      if (Math.random() < 0.05) {
        simpleAudio.playSound('fluctuation', { intensity: 0.3 });
      }
      
      if (Math.random() < 0.01) {
        simpleAudio.playCelestialEvent(
          Math.random() > 0.5 ? 'inflation' : 'intent_field_collapse',
          { intensity: 0.4 }
        );
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopMotherSimulation();
      simpleAudio.stopAllSounds();
    };
  }, []);
  
  // Update volume when changed
  useEffect(() => {
    simpleAudio.updateVolume(volume / 100);
  }, [volume, simpleAudio]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Helmet>
        <title>IntentSim - Universe Intent Simulation</title>
        <meta name="description" content="Explore intent-driven particle simulation" />
      </Helmet>
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-6">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300">
          IntentSim Mascot
        </h1>
        
        <h2 className="text-lg text-gray-300">
          Advanced Simulation
        </h2>
      </div>
      
      {/* Audio controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
        <Volume2 className="h-5 w-5 text-white/70" />
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          className="w-32"
          onValueChange={(vals) => setVolume(vals[0])}
        />
        <span className="text-sm text-white/70">Gentle Ambience</span>
      </div>
      
      {/* Full-screen canvas */}
      <canvas
        id="simulation-canvas"
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-sm text-white/50">
        © 2025 IntentSim.org - Universe Intent Simulation
      </div>
    </div>
  );
};

export default Simulator;
