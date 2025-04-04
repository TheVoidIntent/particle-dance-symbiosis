
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSimulationData } from '@/hooks/useSimulationData';
import StatsCards from '@/components/data-analysis/StatsCards';
import SimulationChart from '@/components/data-analysis/SimulationChart';
import { 
  generateParticleData, 
  generateInteractionData, 
  generateTimeSeriesData 
} from '@/utils/dataChartUtils';

interface DataPoint {
  name: string;
  value: number;
}

const DataAnalysis: React.FC = () => {
  const { stats, updateSimulationStats } = useSimulationData();
  const [activeTab, setActiveTab] = useState('particles');
  const [chartDataType, setChartDataType] = useState('charge');
  const [particleData, setParticleData] = useState<DataPoint[]>([]);
  const [interactionData, setInteractionData] = useState<DataPoint[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);

  useEffect(() => {
    // Initialize with some data
    updateChartData(chartDataType);
  }, []);

  const handleDataTypeChange = (value: string) => {
    setChartDataType(value);
    updateChartData(value);
  };

  const updateChartData = (dataType: string) => {
    setParticleData(generateParticleData(dataType));
    setInteractionData(generateInteractionData());
    setTimeSeriesData(generateTimeSeriesData(timeSeriesData));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Simulation Data Analysis</h1>
      
      <StatsCards stats={stats} />
      
      <SimulationChart 
        stats={stats}
        chartDataType={chartDataType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        particleData={particleData}
        interactionData={interactionData}
        timeSeriesData={timeSeriesData}
        onDataTypeChange={handleDataTypeChange}
      />
      
      <div className="text-center mb-6">
        <Button variant="outline" onClick={() => updateChartData(chartDataType)}>
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default DataAnalysis;
