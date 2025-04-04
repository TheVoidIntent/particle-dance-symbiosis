
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import ChartControls from './ChartControls';
import ChartTabs from './ChartTabs';
import { SimulationStatsData } from '@/hooks/useSimulationData';

interface DataPoint {
  name: string;
  value: number;
}

interface SimulationChartProps {
  stats: SimulationStatsData;
  chartDataType: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
  particleData: DataPoint[];
  interactionData: DataPoint[];
  timeSeriesData: any[];
  onDataTypeChange: (value: string) => void;
}

const SimulationChart: React.FC<SimulationChartProps> = ({
  stats,
  chartDataType,
  activeTab,
  setActiveTab,
  particleData,
  interactionData,
  timeSeriesData,
  onDataTypeChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <ChartControls 
          chartDataType={chartDataType}
          isRunning={stats.isRunning}
          frameCount={stats.frameCount}
          onDataTypeChange={onDataTypeChange}
          onRefreshData={() => {}}
        />
      </CardHeader>
      <CardContent>
        <ChartTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          particleData={particleData}
          interactionData={interactionData}
          timeSeriesData={timeSeriesData}
        />
      </CardContent>
    </Card>
  );
};

export default SimulationChart;
