
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Save, Upload, Brain } from "lucide-react";
import { toast } from "sonner";
import AudioFileUploader from './AudioFileUploader';

interface NotebookAnnotation {
  id: string;
  text: string;
  timestamp: string;
  source: string;
}

const NotebookAnnotations: React.FC = () => {
  const [annotations, setAnnotations] = useState<NotebookAnnotation[]>([]);
  const [newAnnotation, setNewAnnotation] = useState('');

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) {
      toast.error("Please enter an annotation");
      return;
    }

    const annotation: NotebookAnnotation = {
      id: `annotation-${Date.now()}`,
      text: newAnnotation,
      timestamp: new Date().toISOString(),
      source: "manual"
    };

    setAnnotations([...annotations, annotation]);
    setNewAnnotation('');
    toast.success("Annotation added successfully");
  };

  const handleImportAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (Array.isArray(importedData.annotations)) {
          // Add imported annotations to existing ones
          const newAnnotations = importedData.annotations.map((anno: any) => ({
            ...anno,
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            source: "notebook_lm"
          }));
          
          setAnnotations([...annotations, ...newAnnotations]);
          toast.success(`Imported ${newAnnotations.length} annotations from Notebook LM`);
        } else {
          toast.error("Invalid annotation format in imported file");
        }
      } catch (error) {
        console.error("Error parsing annotations:", error);
        toast.error("Failed to parse imported annotations");
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleExportAnnotations = () => {
    if (annotations.length === 0) {
      toast.warning("No annotations to export");
      return;
    }

    const exportData = {
      annotations,
      exportTimestamp: new Date().toISOString(),
      source: "intentSim.org"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `intentSim-annotations-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Annotations exported successfully");
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
              placeholder="Add a new observation or insight..."
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
                    <p className="text-sm">{annotation.text}</p>
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
