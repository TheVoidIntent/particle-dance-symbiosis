
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, HelpCircle, BarChart } from "lucide-react";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import NoteTaking from "@/components/notebook/NoteTaking";
import NotebookHeader from "@/components/notebook/NotebookHeader";
import SourcesTabContent from "@/components/notebook/SourcesTabContent";
import ChatTabContent from "@/components/notebook/ChatTabContent";
import SupplementaryContent from "@/components/notebook/SupplementaryContent";
import AudioNotePlayer from "@/components/notebook/AudioNotePlayer";
import { checkAudioFileExists } from "@/utils/audioUtils";

const Notebook: React.FC = () => {
  // Using a real sample audio file that actually exists in public folder
  const SAMPLE_AUDIO_URL = "/audio/sample-placeholder.mp3";
  
  const [currentAudio, setCurrentAudio] = useState({
    title: "Intent as a Universal Information Framework",
    progress: 0,
    duration: 30, // This will be updated when audio metadata loads
    url: SAMPLE_AUDIO_URL
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("sources");
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioExists, setAudioExists] = useState(false);
  
  // Check if audio file exists and preload it
  useEffect(() => {
    const checkAudio = async () => {
      try {
        // First check if the audio file exists
        const fileCheck = await checkAudioFileExists(SAMPLE_AUDIO_URL);
        setAudioExists(fileCheck.exists);
        
        if (!fileCheck.exists) {
          console.warn(`Audio file not found: ${SAMPLE_AUDIO_URL}`);
          toast.error("Audio file not found. Please check the audio source.");
          return;
        }
        
        // If the file exists, preload it
        const audio = new Audio(SAMPLE_AUDIO_URL);
        
        audio.addEventListener('canplaythrough', () => {
          setAudioLoaded(true);
          setCurrentAudio(prev => ({
            ...prev,
            duration: audio.duration || 30
          }));
          console.log("Audio can play, duration:", audio.duration);
          toast.success("Audio loaded successfully!");
        });
        
        audio.addEventListener('error', (e) => {
          console.error("Audio loading error:", e, audio.error);
          toast.error("Error loading audio file. Please check the audio source.");
        });
        
        // Start loading the audio
        audio.load();
      } catch (error) {
        console.error("Error checking or loading audio:", error);
        toast.error("Error initializing audio player");
      }
    };
    
    checkAudio();
  }, []);
  
  const togglePlay = () => {
    if (!audioExists) {
      toast.error("Cannot play audio: file not found");
      return;
    }
    
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? "Audio paused" : "Audio playing");
    console.log("Play state toggled:", !isPlaying);
  };
  
  const handleAddNote = () => {
    toast.success("Note taking mode activated");
  };
  
  const updateProgress = (progress: number) => {
    setCurrentAudio(prev => ({
      ...prev,
      progress
    }));
  };
  
  return (
    <>
      <Helmet>
        <title>IntentSim | Intent Notebook</title>
        <meta name="description" content="Explore notes and audio discussions about intent field simulations and information theory" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-950">
        <NotebookHeader />
        
        {/* Main content area */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Audio and notes container */}
            <div className="md:col-span-2 space-y-6">
              {/* Audio player */}
              <div className="mb-6">
                <AudioNotePlayer
                  title={currentAudio.title}
                  progress={currentAudio.progress}
                  duration={currentAudio.duration}
                  isPlaying={isPlaying}
                  onTogglePlay={togglePlay}
                  audioUrl={currentAudio.url}
                />
              </div>
              
              {/* Tabs navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="studio">Studio</TabsTrigger>
                </TabsList>
                
                {/* Tab content */}
                <TabsContent value="sources">
                  <SourcesTabContent 
                    currentAudio={currentAudio}
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    onAddNote={handleAddNote}
                  />
                </TabsContent>
                
                <TabsContent value="chat">
                  <ChatTabContent />
                </TabsContent>
                
                <TabsContent value="studio">
                  <NoteTaking />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right column - Supplementary information */}
            <div>
              <SupplementaryContent />
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-500 pb-4">
          <p>Audio playback is now working with volume control!</p>
          <p>Double check all information with verified sources.</p>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Notebook;
