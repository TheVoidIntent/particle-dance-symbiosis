
import React, { useState } from 'react';
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
        <NotebookHeader />
        
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
          <p>NotebookLM integration for research purposes only.</p>
          <p>Double check all information with verified sources.</p>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Notebook;
