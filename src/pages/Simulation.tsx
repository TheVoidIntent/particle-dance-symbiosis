import React, { useState, useEffect } from 'react';
import { useParticleSimulation } from '@/hooks/simulation';
import { useInflationEvents } from '@/hooks/useInflationEvents';

export default function Simulation() {
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [isRunning, setIsRunning] = useState(true);
  
  const { inflationEvents, handleInflationEvent } = useInflationEvents();
  
  // Initialize the simulation
  const simulation = useParticleSimulation({
    initialParticleCount: 50,
    config: {
      maxParticles: 200,
      inflationEnabled: true,
      inflationThreshold: 100
    },
    onInflationEvent: handleInflationEvent
  });
  
  // Update canvas dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 40, 1200);
      const height = Math.min(window.innerHeight - 200, 800);
      setCanvasWidth(width);
      setCanvasHeight(height);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Toggle simulation running state
  const toggleSimulation = () => {
    if (isRunning) {
      simulation.stopSimulation();
    } else {
      simulation.startSimulation();
    }
    setIsRunning(!isRunning);
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    simulation.resetSimulation();
    setIsRunning(true);
  };
  
  // Add a new particle at the center of the canvas
  const addParticle = () => {
    simulation.createParticle(canvasWidth / 2, canvasHeight / 2);
  };
  
  // Add multiple particles
  const addParticles = (count: number) => {
    simulation.addParticles(count);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Particle Simulation</h1>
      
      <div className="flex gap-2 mb-4">
        <button 
          className={`px-4 py-2 rounded ${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white`}
          onClick={toggleSimulation}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button 
          className="px-4 py-2 rounded bg-blue-500 text-white"
          onClick={resetSimulation}
        >
          Reset
        </button>
        
        <button 
          className="px-4 py-2 rounded bg-purple-500 text-white"
          onClick={addParticle}
        >
          Add Particle
        </button>
        
        <button 
          className="px-4 py-2 rounded bg-indigo-500 text-white"
          onClick={() => addParticles(10)}
        >
          Add 10 Particles
        </button>
      </div>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Simulation Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-500">Particles</div>
            <div className="text-xl">{simulation.particles.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Interactions</div>
            <div className="text-xl">{simulation.interactionsCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Simulation Time</div>
            <div className="text-xl">{simulation.simulationTime.toFixed(1)}s</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Frame Count</div>
            <div className="text-xl">{simulation.frameCount}</div>
          </div>
        </div>
      </div>
      
      {inflationEvents.length > 0 && (
        <div className="mb-4 p-4 border rounded bg-yellow-50">
          <h2 className="text-lg font-semibold mb-2">Inflation Events</h2>
          <div className="space-y-2">
            {inflationEvents.map(event => (
              <div key={event.id} className="p-2 bg-white rounded shadow-sm">
                <div className="text-sm font-medium">
                  Inflation at {new Date(event.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600">
                  Particles: {event.particlesBefore} → {event.particlesAfter}
                </div>
                <div className="text-sm text-gray-600">
                  Factor: {event.inflationFactor.toFixed(2)}x
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div 
        className="border rounded bg-black"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          position: 'relative'
        }}
      >
        {/* Canvas visualization would go here in a real implementation */}
        <div className="absolute inset-0 flex items-center justify-center text-white opacity-30">
          Simulation Canvas
        </div>
      </div>
    </div>
  );
}
