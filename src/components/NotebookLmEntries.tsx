
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Play, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { importNotebookAnnotations } from '@/utils/dataExportUtils';
import { useToast } from "@/hooks/use-toast";

interface NotebookEntry {
  id: string;
  text: string;
  timestamp: string;
  source: string;
  audioUrl?: string;
}

const NotebookLmEntries = () => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load entries from localStorage if available
    loadEntriesFromStorage();
  }, []);

  const loadEntriesFromStorage = () => {
    setLoading(true);
    try {
      const storedEntries = localStorage.getItem('notebookLmEntries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Error loading notebook entries:', error);
      toast({
        title: "Error Loading Entries",
        description: "Failed to load Notebook LM entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportEntries = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target?.result) return;
        
        const result = e.target.result.toString();
        const importedAnnotations = importNotebookAnnotations(result);
        
        if (importedAnnotations && importedAnnotations.length > 0) {
          // Convert to our entry format and save
          const newEntries = importedAnnotations.map((anno, index) => ({
            id: `imported-${Date.now()}-${index}`,
            text: anno.text,
            timestamp: anno.timestamp || new Date().toISOString(),
            source: "notebook_lm",
            audioUrl: anno.audioUrl
          }));
          
          const updatedEntries = [...newEntries, ...entries].slice(0, 20); // Keep most recent 20
          setEntries(updatedEntries);
          
          // Save to localStorage
          localStorage.setItem('notebookLmEntries', JSON.stringify(updatedEntries));
          
          toast({
            title: "Entries Imported",
            description: `${newEntries.length} entries imported from Notebook LM.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Import Error",
            description: "No valid entries found in the imported file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error parsing imported entries:', error);
        toast({
          title: "Import Failed",
          description: "Could not process the imported file.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
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
        ) : entries.length === 0 ? (
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
              {entries.slice(0, 5).map((entry) => (
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
                    <Button variant="outline" size="sm" className="w-full mt-1">
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
