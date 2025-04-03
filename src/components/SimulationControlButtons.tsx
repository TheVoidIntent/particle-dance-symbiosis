
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCw, Download } from 'lucide-react';
import { exportDataAsPDF } from '@/utils/dataExportUtils';

interface SimulationControlButtonsProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onExport?: () => void;
}

const SimulationControlButtons: React.FC<SimulationControlButtonsProps> = ({
  isRunning,
  onToggleRunning,
  onReset,
  onExport
}) => {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all simulation data?')) {
      // Implementation for clearing data
      console.log('Clearing simulation data');
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant={isRunning ? "outline" : "default"}
        size="sm"
        onClick={onToggleRunning}
      >
        {isRunning ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
        {isRunning ? 'Pause' : 'Start'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onReset}
      >
        <RotateCw className="mr-1 h-4 w-4" />
        Reset
      </Button>
      
      {onExport && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
        >
          <Download className="mr-1 h-4 w-4" />
          Export
        </Button>
      )}
    </div>
  );
};

export default SimulationControlButtons;
