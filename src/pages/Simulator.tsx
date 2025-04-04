
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Volume2, Info, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useSimpleAudio } from '@/hooks/useSimpleAudio';
import { startMotherSimulation, stopMotherSimulation, isMotherSimulationRunning, getParticles, getSimulationStats } from '@/utils/simulation/motherSimulation';
import { toast } from 'sonner';

const Simulator: React.FC = () => {
  const [volume, setVolume] = useState(50);
  const [showMetrics, setShowMetrics] = useState(false);
  const simpleAudio = useSimpleAudio(true, volume / 100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [simulationStats, setSimulationStats] = useState({
    intentWaveIntensity: 0,
    complexity: 0,
    particleCount: 0,
    interactionsCount: 0
  });

  useEffect(() => {
    if (!isMotherSimulationRunning()) {
      startMotherSimulation(canvasRef.current);
    }

    simpleAudio.initialize();
    simpleAudio.playAmbientSound({
      type: 'intent_field',
      intensity: 0.6,
      complexity: 0.7
    });

    const animate = () => {
      const particles = getParticles();
      const stats = getSimulationStats();
      
      setSimulationStats({
        intentWaveIntensity: Math.round(simpleAudio.intentWaveMetrics?.averageFrequency || 0),
        complexity: Math.round(stats.intentFieldComplexity * 100),
        particleCount: stats.particleCount,
        interactionsCount: stats.interactionsCount
      });
      
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
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopMotherSimulation();
      simpleAudio.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    simpleAudio.updateVolume(volume / 100);
  }, [volume, simpleAudio]);

  const toggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success("Simulation resumed");
    } else {
      toast.info("Simulation paused");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Helmet>
        <title>IntentSim - Universe Intent Simulation</title>
        <meta name="description" content="Explore intent-driven particle simulation" />
      </Helmet>
      
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-6">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300">
          IntentSim
        </h1>
        
        <h2 className="text-lg text-gray-300">
          Advanced Simulation
        </h2>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
        <Button 
          variant="ghost"
          size="icon"
          onClick={toggleSimulation}
          className="text-white/70 hover:text-white w-9 h-9 rounded-full bg-gray-800/60"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <button 
          onClick={toggleMetrics}
          className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
        >
          <Info className="h-5 w-5 text-white/70" />
        </button>
        
        <Volume2 className="h-5 w-5 text-white/70 ml-2" />
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
      
      {showMetrics && (
        <div className="absolute top-16 right-4 z-10 bg-black/70 backdrop-blur-lg p-4 rounded-lg border border-indigo-500/30 text-xs space-y-2 w-64 animate-fade-in shadow-lg">
          <h3 className="text-sm font-medium text-indigo-300">Intent Wave Metrics</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/70 p-2 rounded border border-gray-700/50">
              <div className="text-gray-400">Wave Frequency</div>
              <div className="text-white">{simulationStats.intentWaveIntensity} Hz</div>
            </div>
            
            <div className="bg-gray-800/70 p-2 rounded border border-gray-700/50">
              <div className="text-gray-400">Energy Level</div>
              <div className="text-white">{Math.round((simpleAudio.intentWaveMetrics?.totalEnergy || 0) * 100)}%</div>
            </div>
            
            <div className="bg-gray-800/70 p-2 rounded border border-gray-700/50">
              <div className="text-gray-400">Harmonic Ratio</div>
              <div className="text-white">{Math.round((simpleAudio.intentWaveMetrics?.harmonicRatio || 0) * 100)}%</div>
            </div>
            
            <div className="bg-gray-800/70 p-2 rounded border border-gray-700/50">
              <div className="text-gray-400">Resonance Score</div>
              <div className="text-white">{Math.round((simpleAudio.intentWaveMetrics?.resonanceScore || 0) * 100)}%</div>
            </div>
          </div>
          
          <div className="text-center mt-2 pt-2 border-t border-gray-700/50">
            <div className="text-indigo-300/80">Simulation Stats</div>
            <div className="flex justify-between mt-1 text-gray-300">
              <span>Particles: {simulationStats.particleCount}</span>
              <span>Interactions: {simulationStats.interactionsCount}</span>
            </div>
            <div className="flex justify-between mt-1 text-gray-300">
              <span>Intent Wave: {simulationStats.intentWaveIntensity}</span>
              <span>Complexity: {simulationStats.complexity}%</span>
            </div>
          </div>
        </div>
      )}
      
      <canvas
        id="simulation-canvas"
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="text-white/80 text-sm">
          Intent Wave Intensity: <span className="text-indigo-300">{simulationStats.intentWaveIntensity}</span>
        </div>
        <div className="text-center text-sm text-white/70">
          © 2025 IntentSim.org - Universe Intent Simulation
        </div>
        <div className="text-white/80 text-sm">
          Complexity: <span className="text-indigo-300">{simulationStats.complexity}</span>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
