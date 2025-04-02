
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { clearSimulationData, clearPersistedState } from '@/utils/dataExportUtils';
import { useToast } from "@/hooks/use-toast";

interface SimulationControlButtonsProps {
  dataCollectionActive: boolean;
  onExportData: () => void;
  onToggleDataCollection: () => void;
  onResetSimulation: () => any[]; // Updated to match expected return type
}

export const SimulationControlButtons: React.FC<SimulationControlButtonsProps> = ({
  dataCollectionActive,
  onExportData,
  onToggleDataCollection,
  onResetSimulation
}) => {
  const { toast } = useToast();

  const handleClearData = () => {
    clearSimulationData();
    
    toast({
      title: "Data Cleared",
      description: "All collected simulation data has been cleared.",
      variant: "default",
    });
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-70 hover:opacity-100 transition-opacity">
      <Button 
        onClick={onExportData}
        className="bg-indigo-600 text-white px-3 py-1 rounded text-xs"
        title="Export collected data"
      >
        <Download className="mr-2 h-4 w-4" />
        Export Data
      </Button>
      
      <Button 
        onClick={onToggleDataCollection}
        className={`${dataCollectionActive ? 'bg-green-600' : 'bg-red-600'} text-white px-3 py-1 rounded text-xs`}
        title={dataCollectionActive ? "Pause data collection" : "Resume data collection"}
      >
        {dataCollectionActive ? "Collecting" : "Paused"}
      </Button>
      
      <Button 
        onClick={handleClearData}
        className="bg-gray-600 text-white px-3 py-1 rounded text-xs"
        title="Clear all collected data"
      >
        Clear Data
      </Button>
      
      <Button 
        onClick={onResetSimulation}
        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
        title="Reset the entire simulation"
      >
        Reset
      </Button>
    </div>
  );
};
