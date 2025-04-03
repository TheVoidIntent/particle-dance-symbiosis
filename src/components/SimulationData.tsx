
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart2, RefreshCw } from 'lucide-react';
import { SimulationStats } from '@/types/simulation';
import { exportSimulationData, exportDataAsCsv, getStoredDataPoints } from '@/utils/dataExportUtils';

interface SimulationDataProps {
  stats: SimulationStats;
  running: boolean;
}

const SimulationData: React.FC<SimulationDataProps> = ({ stats, running }) => {
  const [dataPoints, setDataPoints] = useState<number>(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(getStoredDataPoints().length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-blue-400" />
          Data Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Collected Data Points</p>
              <p className="text-2xl font-semibold">{dataPoints}</p>
            </div>
            <div className="h-10 w-10 bg-blue-900/30 rounded-full flex items-center justify-center">
              {running && (
                <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportSimulationData}
              className="flex-1"
              disabled={dataPoints === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportDataAsCsv}
              className="flex-1"
              disabled={dataPoints === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Data is collected while the simulation is running. Export anytime to analyze results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationData;
