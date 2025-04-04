
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Beaker, Bot, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { startAudioPlaylist, stopAudioPlaylist, setAudioPlaylistVolume, getCurrentTrackName } from '@/utils/audio/audioPlaylist';

const SimpleVisitor: React.FC = () => {
  const [audioActive, setAudioActive] = useState(true);
  const [audioVolume, setAudioVolume] = useState(30);
  const [currentTrack, setCurrentTrack] = useState("");

  useEffect(() => {
    // Initialize audio
    try {
      startAudioPlaylist(audioVolume / 100);
      setCurrentTrack(getCurrentTrackName());
    } catch (error) {
      console.error("Error starting audio:", error);
    }
    
    const trackUpdateInterval = setInterval(() => {
      try {
        setCurrentTrack(getCurrentTrackName());
      } catch (error) {
        console.error("Error updating track name:", error);
      }
    }, 1000);
    
    return () => {
      stopAudioPlaylist();
      clearInterval(trackUpdateInterval);
    };
  }, []);

  useEffect(() => {
    try {
      setAudioPlaylistVolume(audioVolume / 100);
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  }, [audioVolume]);

  const toggleAudio = () => {
    setAudioActive(!audioActive);
    
    try {
      if (audioActive) {
        stopAudioPlaylist();
      } else {
        startAudioPlaylist(audioVolume / 100);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <header className="p-4 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Beaker className="text-indigo-400 h-6 w-6" />
            <h1 className="text-white text-xl font-bold">IntentSim</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleAudio}
                className="text-white/80 hover:text-white h-8 w-8 rounded-full"
              >
                {audioActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Slider
                value={[audioVolume]}
                max={100}
                step={1}
                onValueChange={(value) => setAudioVolume(value[0])}
                className="w-24"
              />
              
              <span className="text-xs text-white/70 max-w-32 truncate">
                {currentTrack.replace('.wav', '')}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Intent Universe Simulation
          </span>
        </h1>
        
        <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
          Explore an emergent universe born from intent field fluctuations, where particles gain knowledge through interaction.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link to="/simulator" className="group">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/50">
              <Beaker className="h-12 w-12 text-indigo-400 mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-white mb-2">Particle Simulation</h2>
              <p className="text-gray-400">
                Observe particles arising from intent field fluctuations based on charge, color, and knowledge exchange.
              </p>
              <Button variant="outline" className="mt-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Open Simulation
              </Button>
            </div>
          </Link>
          
          <Link to="/mascot" className="group">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50">
              <Bot className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
              <h2 className="text-xl font-bold text-white mb-2">IntentSim Mascot</h2>
              <p className="text-gray-400">
                Meet the embodiment of our simulation - a knowledge-gathering mascot that learns from particle interactions.
              </p>
              <Button variant="outline" className="mt-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                Meet IntentSim
              </Button>
            </div>
          </Link>
        </div>
      </main>
      
      <footer className="p-4 bg-black/30 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} IntentSim.org - Universe Intent Simulation</p>
      </footer>
    </div>
  );
};

export default SimpleVisitor;
