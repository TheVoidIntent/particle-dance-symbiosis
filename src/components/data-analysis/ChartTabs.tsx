
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParticleChart from './ParticleChart';
import InteractionChart from './InteractionChart';
import TimeSeriesChart from './TimeSeriesChart';

interface ChartTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  particleData: Array<{ name: string; value: number }>;
  interactionData: Array<{ name: string; value: number }>;
  timeSeriesData: any[];
}

const ChartTabs: React.FC<ChartTabsProps> = ({
  activeTab,
  setActiveTab,
  particleData,
  interactionData,
  timeSeriesData
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="particles">Particle Distribution</TabsTrigger>
        <TabsTrigger value="interactions">Interaction Types</TabsTrigger>
        <TabsTrigger value="timeseries">Time Series Analysis</TabsTrigger>
      </TabsList>
      
      <TabsContent value="particles" className="mt-0">
        <ParticleChart data={particleData} />
      </TabsContent>
      
      <TabsContent value="interactions" className="mt-0">
        <InteractionChart data={interactionData} />
      </TabsContent>
      
      <TabsContent value="timeseries" className="mt-0">
        <TimeSeriesChart data={timeSeriesData} />
      </TabsContent>
    </Tabs>
  );
};

export default ChartTabs;
