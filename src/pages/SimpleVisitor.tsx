
import React, { useEffect, useRef, useState } from 'react';
import { startMotherSimulation, isMotherSimulationRunning } from '@/utils/simulation/motherSimulation';
import { startAudioPlaylist, stopAudioPlaylist } from '@/utils/audio/audioPlaylist';

/**
 * SimpleVisitor - A simplified simulation page with continuous background audio
 * All internal data processing happens in the background
 */
const SimpleVisitor: React.FC = () => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [simulationStarted, setSimulationStarted] = useState(false);
  
  // Start the simulation on load
  useEffect(() => {
    if (!simulationStarted) {
      // Start the mother simulation which will continuously run and export data
      startMotherSimulation();
      setSimulationStarted(true);
      
      // Set up auto-restart mechanism for the simulation
      const checkInterval = setInterval(() => {
        if (!isMotherSimulationRunning()) {
          console.log("Simulation stopped, restarting...");
          startMotherSimulation();
        }
      }, 10000);
      
      return () => clearInterval(checkInterval);
    }
  }, [simulationStarted]);
  
  // Set up audio
  useEffect(() => {
    if (!audioLoaded) {
      // Start playing background audio playlist at 40% volume
      startAudioPlaylist(0.4);
      setAudioLoaded(true);
      
      return () => {
        // Clean up audio when component unmounts
        stopAudioPlaylist();
      };
    }
  }, [audioLoaded]);
  
  // Render a minimal UI that's just a canvas for the simulation visualization
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas 
        id="simulation-canvas" 
        className="w-full h-full"
      />
      <div className="fixed bottom-4 right-4 text-xs text-gray-600">
        Universe Simulation
      </div>
    </div>
  );
};

export default SimpleVisitor;
