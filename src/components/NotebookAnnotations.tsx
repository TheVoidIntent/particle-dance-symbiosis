
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Save, Upload, Brain, Trash2, Play } from "lucide-react";
import AudioFileUploader from './AudioFileUploader';
import { useNotebookIntegration } from '@/hooks/useNotebookIntegration';
import { SimulationStats } from '@/types/simulation';

interface NotebookAnnotationsProps {
  currentStats?: Partial<SimulationStats>;
}

const NotebookAnnotations: React.FC<NotebookAnnotationsProps> = ({ currentStats }) => {
  const [newAnnotation, setNewAnnotation] = useState('');
  const { 
    annotations, 
    addAnnotation, 
    importAnnotations, 
    exportAnnotations, 
    clearAnnotations 
  } = useNotebookIntegration();

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return;
    
    addAnnotation(newAnnotation, currentStats);
    setNewAnnotation('');
  };

  const handleImportAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        importAnnotations(e.target.result as string);
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportAnnotations = () => {
    exportAnnotations();
  };

  const playAudio = (audioUrl?: string) => {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-400" />
            Notebook LM Integration
          </CardTitle>
          <CardDescription>
            Import annotations from your Notebook LM or add new observations manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a new observation or insight about the simulation..."
              value={newAnnotation}
              onChange={(e) => setNewAnnotation(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddAnnotation} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Annotation
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => document.getElementById('import-annotations')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import from Notebook LM
            </Button>
            <input 
              id="import-annotations" 
              type="file" 
              accept=".json" 
              onChange={handleImportAnnotations} 
              className="hidden" 
            />
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleExportAnnotations}
              disabled={annotations.length === 0}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Export Annotations
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={clearAnnotations}
              disabled={annotations.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Current Annotations</h3>
            {annotations.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No annotations yet. Add your observations or import from Notebook LM.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {annotations.map((annotation) => (
                  <div 
                    key={annotation.id} 
                    className={`p-3 rounded-md border ${
                      annotation.source === 'notebook_lm' 
                        ? 'bg-purple-900/10 border-purple-800/20' 
                        : 'bg-gray-800/10 border-gray-700/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(annotation.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/30">
                        {annotation.source === 'notebook_lm' ? 'Notebook LM' : 'Manual Entry'}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{annotation.text}</p>
                    {annotation.audioUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-1"
                        onClick={() => playAudio(annotation.audioUrl)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play Audio
                      </Button>
                    )}
                    {annotation.relatedStats && (
                      <div className="mt-2 p-2 bg-gray-800/5 rounded border border-gray-700/10 text-xs">
                        <div className="font-medium mb-1">Related Simulation Stats:</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(annotation.relatedStats).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span className="font-mono">
                                {typeof value === 'number' 
                                  ? value.toFixed(2) 
                                  : typeof value === 'string' 
                                    ? value
                                    : JSON.stringify(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AudioFileUploader />
    </div>
  );
};

export default NotebookAnnotations;
