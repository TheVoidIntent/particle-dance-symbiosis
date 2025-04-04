import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Volume2, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSimpleAudio } from '@/hooks/useSimpleAudio';
import { startMotherSimulation, stopMotherSimulation, isMotherSimulationRunning, getParticles, getSimulationStats } from '@/utils/simulation/motherSimulation';

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
      // Fix: Pass only one argument to startMotherSimulation
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Helmet>
        <title>IntentSim - Universe Intent Simulation</title>
        <meta name="description" content="Explore intent-driven particle simulation" />
      </Helmet>
      
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-6">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300">
          IntentSim Mascot
        </h1>
        
        <h2 className="text-lg text-gray-300">
          Advanced Simulation
        </h2>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
        <button 
          onClick={toggleMetrics}
          className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <Info className="h-5 w-5 text-white/70" />
        </button>
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
      
      {showMetrics && (
        <div className="absolute top-16 right-4 z-10 bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-gray-700 text-xs space-y-2 w-64">
          <h3 className="text-sm font-medium text-amber-300">Intent Wave Metrics</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">Wave Frequency</div>
              <div className="text-white">{simpleAudio.intentWaveMetrics?.averageFrequency || 0} Hz</div>
            </div>
            
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">Energy Level</div>
              <div className="text-white">{Math.round((simpleAudio.intentWaveMetrics?.totalEnergy || 0) * 100)}%</div>
            </div>
            
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">Harmonic Ratio</div>
              <div className="text-white">{Math.round((simpleAudio.intentWaveMetrics?.harmonicRatio || 0) * 100)}%</div>
            </div>
            
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-gray-400">Resonance Score</div>
              <div className="text-white">{Math.round((simpleAudio.intentWaveMetrics?.resonanceScore || 0) * 100)}%</div>
            </div>
          </div>
          
          <div className="text-center mt-2 pt-2 border-t border-gray-700">
            <div className="text-amber-300/70">Simulation Stats</div>
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
      
      <div className="absolute bottom-4 w-full text-center text-sm text-white/50">
        © 2025 IntentSim.org - Universe Intent Simulation
      </div>
    </div>
  );
};

export default Simulator;
