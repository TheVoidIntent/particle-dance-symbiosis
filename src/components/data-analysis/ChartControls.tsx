
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChartControlsProps {
  chartDataType: string;
  isRunning: boolean;
  frameCount: number;
  onDataTypeChange: (value: string) => void;
  onRefreshData: () => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartDataType,
  isRunning,
  frameCount,
  onDataTypeChange,
  onRefreshData
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-lg font-bold">Simulation Analytics</div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          Status: <span className={isRunning ? "text-green-500" : "text-red-500"}>
            {isRunning ? "Running" : "Stopped"}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Frame: <span className="font-medium">{frameCount.toLocaleString()}</span>
        </div>
        <Select value={chartDataType} onValueChange={onDataTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Data Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="charge">Charge Distribution</SelectItem>
            <SelectItem value="knowledge">Knowledge Levels</SelectItem>
            <SelectItem value="type">Particle Types</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChartControls;
