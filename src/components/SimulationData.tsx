
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Download, Trash2 } from 'lucide-react';
import { exportDataAsCsv, getDataPoints } from '@/utils/dataExportUtils';

interface SimulationDataProps {
  data?: any;
  title?: string;
  onExport?: () => void;
  onClear?: () => void;
}

const SimulationData: React.FC<SimulationDataProps> = ({
  data,
  title = 'Simulation Data',
  onExport,
  onClear
}) => {
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  
  useEffect(() => {
    // If data is provided, use it, otherwise fetch data points
    if (data) {
      setDataPoints(Array.isArray(data) ? data : [data]);
    } else {
      setDataPoints(getDataPoints());
    }
  }, [data]);

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
      exportDataAsCsv(dataPoints, `simulation-data-${timestamp}.csv`);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (window.confirm('Are you sure you want to clear all data?')) {
      setDataPoints([]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <BarChart2 className="h-5 w-5 inline mr-2" />
          {title}
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {dataPoints.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {dataPoints.length} data points collected
            </p>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400">Data visualization would appear here</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No data available</p>
            <p className="text-sm text-gray-400 mt-1">Run the simulation to generate data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationData;
