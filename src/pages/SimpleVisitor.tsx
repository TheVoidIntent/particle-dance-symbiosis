
import React, { useEffect, useState } from 'react';
import { startMotherSimulation, isMotherSimulationRunning } from '@/utils/simulation/motherSimulation';
import { startAudioPlaylist, stopAudioPlaylist } from '@/utils/audio/audioPlaylist';
import { Github, Twitter, Brain } from 'lucide-react';
import IntentSimonAdvisor from '@/components/IntentSimonAdvisor';

/**
 * SimpleVisitor - A simplified simulation page with continuous background audio
 * All internal data processing happens in the background
 */
const SimpleVisitor: React.FC = () => {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);
  
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
  
  // Set up audio to play the entire playlist continuously
  useEffect(() => {
    // Start playing background audio playlist
    startAudioPlaylist(0.5);
    
    return () => {
      // Clean up audio when component unmounts
      stopAudioPlaylist();
    };
  }, []);
  
  // Toggle advisor panel
  const toggleAdvisor = () => {
    setShowAdvisor(prev => !prev);
  };
  
  // Render a minimal UI that's just a canvas for the simulation visualization
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas 
        id="simulation-canvas" 
        className="w-full h-full"
      />
      
      {/* Social links */}
      <div className="fixed bottom-4 left-4 flex space-x-4 items-center">
        <a 
          href="https://github.com/your-github/intentsim" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors duration-200"
        >
          <Github size={20} />
        </a>
        <a 
          href="https://twitter.com/your-twitter" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors duration-200"
        >
          <Twitter size={20} />
        </a>
      </div>
      
      {/* IntentSim(on) button */}
      <button 
        onClick={toggleAdvisor}
        className="fixed bottom-4 right-4 bg-indigo-900/50 hover:bg-indigo-800/70 text-indigo-300 hover:text-white transition-colors duration-200 p-2 rounded-full border border-indigo-700/30 shadow-lg"
        title="Ask IntentSim(on)"
      >
        <Brain size={24} />
      </button>
      
      {/* Advisor panel (when active) */}
      {showAdvisor && (
        <div className="fixed inset-4 sm:inset-auto sm:right-4 sm:bottom-16 sm:top-4 sm:w-[600px] z-10">
          <IntentSimonAdvisor onClose={toggleAdvisor} />
        </div>
      )}
      
      <div className="fixed bottom-4 right-24 text-xs text-gray-600">
        Universe Simulation
      </div>
    </div>
  );
};

export default SimpleVisitor;
