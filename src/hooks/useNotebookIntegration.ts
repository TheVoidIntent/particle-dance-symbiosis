
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { SimulationStats } from '@/types/simulation';
import { convertAnyDataToPDF } from '@/utils/pdfExportUtils';

export interface NotebookAnnotation {
  id: string;
  text: string;
  timestamp: string;
  source: string;
  relatedStats?: Partial<SimulationStats>;
  audioUrl?: string;
}

export function useNotebookIntegration() {
  const [annotations, setAnnotations] = useState<NotebookAnnotation[]>(() => {
    // Load annotations from localStorage on init
    try {
      const stored = localStorage.getItem('notebookAnnotations');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load annotations from localStorage:', error);
      return [];
    }
  });

  // Save annotations to localStorage whenever they change
  const saveAnnotations = useCallback((newAnnotations: NotebookAnnotation[]) => {
    setAnnotations(newAnnotations);
    try {
      localStorage.setItem('notebookAnnotations', JSON.stringify(newAnnotations));
    } catch (error) {
      console.error('Failed to save annotations to localStorage:', error);
      toast.error("Failed to save annotations");
    }
  }, []);

  // Add a new annotation
  const addAnnotation = useCallback((text: string, currentStats?: Partial<SimulationStats>) => {
    const newAnnotation: NotebookAnnotation = {
      id: `annotation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text,
      timestamp: new Date().toISOString(),
      source: "manual",
      relatedStats: currentStats
    };
    
    const updatedAnnotations = [newAnnotation, ...annotations];
    saveAnnotations(updatedAnnotations);
    toast.success("Annotation added");
    return newAnnotation;
  }, [annotations, saveAnnotations]);

  // Import annotations from file
  const importAnnotations = useCallback(async (fileData: string) => {
    try {
      const data = JSON.parse(fileData);
      let importedAnnotations: NotebookAnnotation[] = [];
      
      // Handle different JSON formats
      if (data.annotations && Array.isArray(data.annotations)) {
        importedAnnotations = data.annotations.map((anno: any) => ({
          id: `imported-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text: anno.text || anno.content || "",
          timestamp: anno.timestamp || new Date().toISOString(),
          source: "notebook_lm",
          audioUrl: anno.audioUrl || anno.audio_url,
          relatedStats: anno.relatedStats || anno.metadata?.simulationStats
        }));
      } else if (Array.isArray(data)) {
        importedAnnotations = data.map((anno: any) => ({
          id: `imported-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text: anno.text || anno.content || "",
          timestamp: anno.timestamp || new Date().toISOString(),
          source: "notebook_lm",
          audioUrl: anno.audioUrl || anno.audio_url
        }));
      }
      
      if (importedAnnotations.length === 0) {
        toast.error("No valid annotations found in the imported file");
        return false;
      }
      
      // Add imported annotations to existing ones
      const updatedAnnotations = [...importedAnnotations, ...annotations];
      saveAnnotations(updatedAnnotations);
      
      toast.success(`Imported ${importedAnnotations.length} annotations`);
      return true;
    } catch (error) {
      console.error('Error importing annotations:', error);
      toast.error("Failed to parse imported annotations");
      return false;
    }
  }, [annotations, saveAnnotations]);

  // Export annotations as PDF
  const exportAnnotations = useCallback(async () => {
    if (annotations.length === 0) {
      toast.warning("No annotations to export");
      return null;
    }
    
    const exportData = {
      annotations,
      exportTimestamp: new Date().toISOString(),
      source: "intentSim.org"
    };
    
    const filename = await convertAnyDataToPDF(exportData, "IntentSim_Annotations");
    
    if (filename) {
      toast.success("Annotations exported as PDF");
    }
    
    return exportData;
  }, [annotations]);

  // Export simulation data with annotations for Notebook LM as PDF
  const exportForNotebookLM = useCallback(async (simulationData: any) => {
    const exportData = {
      simulationData,
      annotations,
      exportTimestamp: new Date().toISOString(),
      source: "intentSim.org",
      format: "notebook_lm_compatible"
    };
    
    const filename = await convertAnyDataToPDF(exportData, "IntentSim_Notebook_Data");
    
    if (filename) {
      toast.success("Notebook LM export completed as PDF");
    }
    
    return exportData;
  }, [annotations]);

  // Clear all annotations
  const clearAnnotations = useCallback(() => {
    if (annotations.length === 0) return;
    
    if (confirm("Are you sure you want to clear all annotations?")) {
      saveAnnotations([]);
      toast.success("All annotations cleared");
    }
  }, [annotations, saveAnnotations]);

  return {
    annotations,
    addAnnotation,
    importAnnotations,
    exportAnnotations,
    exportForNotebookLM,
    clearAnnotations
  };
}
