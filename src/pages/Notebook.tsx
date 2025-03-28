
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pause, Play, FileText, BookOpen, HelpCircle, BarChart, Plus, ThumbsUp, ThumbsDown, Share, MoreVertical, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import AudioNotePlayer from "@/components/notebook/AudioNotePlayer";
import NotesList from "@/components/notebook/NotesList";
import NoteTaking from "@/components/notebook/NoteTaking";

const Notebook: React.FC = () => {
  const [currentAudio, setCurrentAudio] = useState({
    title: "Intent as a Universal Information Framework",
    progress: 597, // in seconds (9:57)
    duration: 753, // in seconds (12:33)
    url: "/audio/sample-placeholder.mp3"
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("sources");
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? "Audio paused" : "Audio playing");
  };
  
  const handleAddNote = () => {
    toast.success("Note taking mode activated");
  };
  
  return (
    <>
      <Helmet>
        <title>IntentSim | Intent Notebook</title>
        <meta name="description" content="Explore notes and audio discussions about intent field simulations and information theory" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <div className="bg-black py-4 px-4 border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.svg" alt="IntentSim Logo" className="h-8 w-auto" />
              <h1 className="text-xl font-medium text-white">Intent Notebook</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Share className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 p-2 hidden group-hover:block">
                  <p className="text-sm text-gray-300 mb-2">Share this notebook:</p>
                  <Button variant="outline" size="sm" className="w-full mb-1">Copy Link</Button>
                  <Button variant="outline" size="sm" className="w-full">Export as PDF</Button>
                </div>
              </div>
              <BookOpen className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Audio and notes container */}
            <div className="md:col-span-2 space-y-6">
              {/* Tabs navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="studio">Studio</TabsTrigger>
                </TabsList>
                
                {/* Tab content */}
                <TabsContent value="sources" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Audio Overview</h2>
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <AudioNotePlayer 
                    title={currentAudio.title}
                    progress={currentAudio.progress}
                    duration={currentAudio.duration}
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    audioUrl={currentAudio.url}
                  />
                  
                  <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50 text-center">
                    <p className="text-gray-300 flex items-center justify-center gap-2">
                      Interactive mode <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">BETA</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8">
                    <h2 className="text-xl font-semibold text-white">Notes</h2>
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <Button onClick={handleAddNote} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700">
                    <Plus className="h-4 w-4" />
                    Add note
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Study guide
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      Briefing doc
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      FAQ
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <BarChart className="h-4 w-4" />
                      Timeline
                    </Button>
                  </div>
                  
                  <NotesList />
                </TabsContent>
                
                <TabsContent value="chat" className="space-y-6 mt-6">
                  <div className="bg-gray-800/40 rounded-lg p-8 border border-gray-700/50 text-center h-64 flex items-center justify-center">
                    <div>
                      <p className="text-gray-300 mb-3">Chat with your audio content</p>
                      <Button>Start a conversation</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="studio" className="space-y-6 mt-6">
                  <NoteTaking />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right column - Supplementary information */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Related Simulations</CardTitle>
                  <CardDescription>Experiments connected to these concepts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                    <h3 className="font-medium text-white mb-1">Positive Charge Dominance</h3>
                    <p className="text-sm text-gray-400">Simulation showing how positive charge particles tend to form more complex structures</p>
                    <Button variant="link" className="p-0 h-auto mt-1 text-indigo-400">Run simulation</Button>
                  </div>
                  
                  <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                    <h3 className="font-medium text-white mb-1">Color Field Interactions</h3>
                    <p className="text-sm text-gray-400">Explore how particle color affects information exchange</p>
                    <Button variant="link" className="p-0 h-auto mt-1 text-indigo-400">Run simulation</Button>
                  </div>
                  
                  <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                    <h3 className="font-medium text-white mb-1">Intent Field Fluctuations</h3>
                    <p className="text-sm text-gray-400">Visualize the birth of particles from intent field fluctuations</p>
                    <Button variant="link" className="p-0 h-auto mt-1 text-indigo-400">Run simulation</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Audio Resources</CardTitle>
                  <CardDescription>Listen to explanations about intent theory</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                        <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-white">Introduction to Intent Theory</p>
                          <p className="text-xs text-gray-400">08:42</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                        <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-white">Particle Interaction Dynamics</p>
                          <p className="text-xs text-gray-400">14:53</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                        <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-white">Emergent Complexity Patterns</p>
                          <p className="text-xs text-gray-400">11:27</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                        <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-white">Charge & Knowledge Transfer</p>
                          <p className="text-xs text-gray-400">09:18</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                        <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-white">Simulation Parameters Explained</p>
                          <p className="text-xs text-gray-400">16:45</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-500 pb-4">
          <p>NotebookLM integration for research purposes only.</p>
          <p>Double check all information with verified sources.</p>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Notebook;
