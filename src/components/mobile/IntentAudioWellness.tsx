
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Volume2, Headphones, Download, Clock, Heart, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { useSimpleAudio } from '@/hooks/useSimpleAudio';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotebookLmIntegration } from '@/hooks/useNotebookLmIntegration';

// Predefined wellness sessions
const WELLNESS_SESSIONS = [
  {
    id: 'balance',
    name: 'Cognitive Balance',
    description: 'Harmonizes positive and negative intent fluctuations to promote mental clarity',
    duration: 5, // minutes
    intentSettings: {
      fluctuationRate: 0.02,
      positiveCharge: 0.65,
      negativeCharge: 0.45,
      neutralCharge: 0.55,
      complexity: 0.7
    },
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'creativity',
    name: 'Creative Field Expansion',
    description: 'Stimulates innovative thinking through positive intent field fluctuations',
    duration: 8, // minutes
    intentSettings: {
      fluctuationRate: 0.025,
      positiveCharge: 0.8,
      negativeCharge: 0.3,
      neutralCharge: 0.5,
      complexity: 0.8
    },
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'focus',
    name: 'Focus Intent',
    description: 'Channels neutral intent waves to enhance concentration and attention',
    duration: 10, // minutes
    intentSettings: {
      fluctuationRate: 0.015,
      positiveCharge: 0.6,
      negativeCharge: 0.4,
      neutralCharge: 0.75,
      complexity: 0.65
    },
    color: 'from-amber-500 to-red-500'
  },
  {
    id: 'relax',
    name: 'Calm Field Resonance',
    description: 'Slow, gentle field fluctuations promote relaxation and stress reduction',
    duration: 15, // minutes
    intentSettings: {
      fluctuationRate: 0.01,
      positiveCharge: 0.55,
      negativeCharge: 0.25,
      neutralCharge: 0.6,
      complexity: 0.5
    },
    color: 'from-indigo-500 to-purple-500'
  }
];

interface IntentAudioWellnessProps {
  onSessionSave?: (session: any) => void;
}

const IntentAudioWellness: React.FC<IntentAudioWellnessProps> = ({
  onSessionSave
}) => {
  const isMobile = useIsMobile();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [remainingTime, setRemainingTime] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize audio
  const simpleAudio = useSimpleAudio(true, volume / 100);
  
  // For NotebookLM integration
  const { exportSimulationData } = useNotebookLmIntegration();
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle session selection
  const selectSession = (sessionId: string) => {
    if (isPlaying) {
      stopSession();
    }
    
    setSelectedSession(sessionId);
    const session = WELLNESS_SESSIONS.find(s => s.id === sessionId);
    
    if (session) {
      setRemainingTime(session.duration * 60); // Convert to seconds
      
      toast({
        title: `${session.name} selected`,
        description: `${session.duration} minute session ready to begin`,
      });
    }
  };
  
  // Start the selected session
  const startSession = () => {
    if (!selectedSession) return;
    
    const session = WELLNESS_SESSIONS.find(s => s.id === selectedSession);
    if (!session) return;
    
    setIsPlaying(true);
    
    // Initialize with cosmic bell toll
    simpleAudio.playSound('cosmicBell', {
      informationDensity: session.intentSettings.complexity,
      weight: 0.7
    });
    
    // Start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set up periodic sounds based on the session type
    timerRef.current = setInterval(() => {
      // Play appropriate sounds based on session type
      if (Math.random() > 0.7) {
        simpleAudio.playSound('fluctuation', { 
          intensity: session.intentSettings.fluctuationRate * 50
        });
      }
      
      if (Math.random() > 0.85) {
        simpleAudio.playCelestialEvent(
          Math.random() > 0.5 ? 'inflation' : 'intent_field_collapse',
          { intensity: session.intentSettings.complexity }
        );
      }
      
      // Update the timer
      setRemainingTime(prev => {
        if (prev <= 1) {
          stopSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast.success(`${session.name} session started!`);
  };
  
  // Stop the current session
  const stopSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Play closing cosmic bell
    if (isPlaying) {
      simpleAudio.playSound('cosmicBell', { 
        informationDensity: 0.5,
        weight: 0.5
      });
      
      toast.info("Wellness session completed");
    }
    
    setIsPlaying(false);
  };
  
  // Save session to notebook
  const saveSession = async () => {
    if (!selectedSession) return;
    
    const session = WELLNESS_SESSIONS.find(s => s.id === selectedSession);
    if (!session) return;
    
    // Create session data
    const sessionData = {
      type: "wellness_session",
      session: session,
      notes: sessionNotes,
      timestamp: new Date().toISOString(),
      duration: session.duration * 60 - remainingTime,
      audioData: simpleAudio.exportAudioData()
    };
    
    // Export to NotebookLM
    await exportSimulationData(sessionData);
    
    if (onSessionSave) {
      onSessionSave(sessionData);
    }
    
    toast.success("Session saved to notebook");
  };
  
  // Format time for display
  const formatTimeDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Get current session
  const currentSession = selectedSession 
    ? WELLNESS_SESSIONS.find(s => s.id === selectedSession) 
    : null;
  
  return (
    <div className={`w-full ${isMobile ? 'px-2' : 'px-4'}`}>
      <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
            <Headphones className="h-5 w-5 text-indigo-400" />
            Intent Audio Wellness
          </CardTitle>
          <CardDescription>
            Experience the wellness benefits of intent field audio
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Session selection */}
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Select Wellness Program</h3>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
              {WELLNESS_SESSIONS.map(session => (
                <div 
                  key={session.id}
                  className={`rounded-lg p-4 cursor-pointer transition-all duration-300 
                    bg-gradient-to-br ${session.color} 
                    ${selectedSession === session.id ? 'ring-2 ring-white' : 'opacity-80 hover:opacity-100'}`}
                  onClick={() => selectSession(session.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">{session.name}</h4>
                    <div className="flex items-center text-xs text-white/90">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.duration}m
                    </div>
                  </div>
                  <p className="text-xs text-white/80 mt-1">{session.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Player controls - only show when a session is selected */}
          {selectedSession && (
            <div className="mt-8 space-y-6">
              {/* Time display */}
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-300 mb-1">
                  {formatTimeDisplay(remainingTime)}
                </div>
                <div className="text-sm text-gray-400">
                  {isPlaying ? 'Session in progress' : 'Ready to start'}
                </div>
              </div>
              
              {/* Main controls */}
              <div className="flex justify-center space-x-4">
                <Button 
                  size="lg"
                  onClick={isPlaying ? stopSession : startSession}
                  variant={isPlaying ? "destructive" : "default"}
                  className="w-32"
                >
                  {isPlaying ? 'Stop' : 'Start'}
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  disabled={isPlaying}
                  onClick={saveSession}
                  className="w-32"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              {/* Volume slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Volume</span>
                  <span className="text-sm text-gray-400">{volume}%</span>
                </div>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(vals) => {
                    setVolume(vals[0]);
                    simpleAudio.updateVolume(vals[0] / 100);
                  }}
                />
              </div>
              
              {/* Session notes */}
              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Session Notes
                </label>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="How do you feel during this session?"
                  className="w-full h-24 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white text-sm"
                ></textarea>
              </div>
              
              {/* Current session info */}
              {currentSession && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-start">
                    {isPlaying && (
                      <div className="mr-3 mt-1">
                        <div className="bg-green-500 h-2 w-2 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-indigo-300">{currentSession.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{currentSession.description}</p>
                    </div>
                  </div>
                  
                  {isPlaying && (
                    <div className="mt-3 flex items-center text-xs text-gray-400">
                      <Heart className="h-3 w-3 mr-1 text-pink-400" />
                      <span>
                        Intent waves are currently active. For best results, wear headphones and relax.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Informational footer */}
          <div className="mt-8 pt-4 border-t border-gray-700/50">
            <div className="flex items-start text-xs text-gray-400">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p>
                Intent waves are based on the Information-Intent Nexus framework. Audio patterns are calibrated to 
                stimulate cognitive processes through simulated fluctuations in the intent field. Results vary by individual.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntentAudioWellness;
