
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Play, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useNotebookIntegration } from '@/hooks/useNotebookIntegration';

const NotebookLmEntries = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { annotations, importAnnotations } = useNotebookIntegration();

  useEffect(() => {
    // Simulate loading state for UI smoothness
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleImportEntries = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        importAnnotations(e.target.result.toString());
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const playAudio = (audioUrl?: string) => {
    if (!audioUrl) {
      toast.error("No audio available for this entry");
      return;
    }
    
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
      toast.error("Failed to play audio");
    });
  };

  const goToSimulation = () => {
    navigate('/simulation');
  };

  return (
    <Card className="shadow-lg border-purple-200/40 dark:border-purple-800/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-500" />
          Latest Notebook LM Entries
        </CardTitle>
        <CardDescription>
          View and interact with your most recent Notebook LM entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading entries...</p>
          </div>
        ) : annotations.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">No Notebook LM entries found</p>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('import-notebook-entries')?.click()}
              className="bg-purple-900/10 hover:bg-purple-900/20 border-purple-300/30"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import from Notebook LM
            </Button>
            <input 
              id="import-notebook-entries" 
              type="file" 
              accept=".json" 
              onChange={handleImportEntries} 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {annotations.filter(entry => entry.source === "notebook_lm").slice(0, 5).map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-3 rounded-md bg-purple-900/10 border border-purple-800/20"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-700/30">
                      Notebook LM
                    </span>
                  </div>
                  <p className="text-sm mb-2">{entry.text}</p>
                  {entry.audioUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-1"
                      onClick={() => playAudio(entry.audioUrl)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Play Audio
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <Button 
                variant="outline" 
                className="flex-1 bg-purple-900/10 hover:bg-purple-900/20 border-purple-300/30"
                onClick={() => document.getElementById('import-notebook-entries')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import More
              </Button>
              <input 
                id="import-notebook-entries" 
                type="file" 
                accept=".json" 
                onChange={handleImportEntries} 
                className="hidden" 
              />
              
              <Button 
                className="flex-1"
                onClick={goToSimulation}
              >
                Continue to Simulation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotebookLmEntries;
