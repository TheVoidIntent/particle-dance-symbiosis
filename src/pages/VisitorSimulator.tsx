
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Info } from "lucide-react";
import { toast } from "sonner";

const VisitorSimulator: React.FC = () => {
  // Basic simulation parameters
  const [intentFluctuationRate, setIntentFluctuationRate] = useState(0.015);
  const [maxParticles, setMaxParticles] = useState(80);
  const [running, setRunning] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [positiveParticles, setPositiveParticles] = useState(0);
  const [negativeParticles, setNegativeParticles] = useState(0);
  const [neutralParticles, setNeutralParticles] = useState(0);
  
  // Simulate changing particle counts
  useEffect(() => {
    if (!running) return;
    
    const interval = setInterval(() => {
      setPositiveParticles(prev => Math.min(maxParticles * 0.4, prev + Math.random() * 2 - 0.5));
      setNegativeParticles(prev => Math.min(maxParticles * 0.35, prev + Math.random() * 2 - 0.7));
      setNeutralParticles(prev => Math.min(maxParticles * 0.25, prev + Math.random() * 2 - 0.8));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [running, maxParticles]);
  
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <Helmet>
        <title>Simulation Explorer | IntentSim</title>
        <meta name="description" content="Explore how particles emerge from intent field fluctuations in this simplified simulation." />
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
            <Button onClick={dismissIntro}>Got it</Button>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0 relative">
              {/* Simulation canvas placeholder - in a real implementation, this would be the actual visualization */}
              <div className="aspect-video bg-black rounded-t-lg overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0">
                  {/* We'll create a simple particle visualization with CSS */}
                  {Array.from({ length: Math.floor(positiveParticles) }).map((_, i) => (
                    <div 
                      key={`pos-${i}`} 
                      className="absolute w-3 h-3 rounded-full bg-blue-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${2 + Math.random() * 3}s infinite ease-in-out`,
                        opacity: 0.7 + Math.random() * 0.3
                      }}
                    />
                  ))}
                  {Array.from({ length: Math.floor(negativeParticles) }).map((_, i) => (
                    <div 
                      key={`neg-${i}`} 
                      className="absolute w-3 h-3 rounded-full bg-red-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${2 + Math.random() * 3}s infinite ease-in-out`,
                        opacity: 0.7 + Math.random() * 0.3
                      }}
                    />
                  ))}
                  {Array.from({ length: Math.floor(neutralParticles) }).map((_, i) => (
                    <div 
                      key={`neu-${i}`} 
                      className="absolute w-3 h-3 rounded-full bg-green-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${2 + Math.random() * 3}s infinite ease-in-out`,
                        opacity: 0.7 + Math.random() * 0.3
                      }}
                    />
                  ))}
                </div>
                
                <style jsx>{`
                  @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
                  }
                `}</style>
                
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
                
                <div className="flex items-center space-x-4">
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
              <h3 className="font-medium mb-2">Learn More</h3>
              <p className="text-sm text-gray-400 mb-4">
                This is a simplified version of the IntentSim universe simulator. For full features:
              </p>
              <Button className="w-full" onClick={() => toast.info("This would play an audio introduction to IntentSim.")}>
                Listen to Audio Intro
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
