import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { isMotherSimulationRunning, getSimulationStats } from '@/utils/simulation/motherSimulation';
import { Progress } from '@/components/ui/progress';

interface DataPoint {
  name: string;
  value: number;
}

const DataAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('particles');
  const [chartDataType, setChartDataType] = useState('charge');
  const [particleData, setParticleData] = useState<DataPoint[]>([]);
  const [interactionData, setInteractionData] = useState<DataPoint[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    particleCount: 0,
    interactionCount: 0,
    knowledgeAverage: 0,
    isRunning: false,
    frameCount: 0
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF5733'];

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (isMotherSimulationRunning()) {
        const currentStats = getSimulationStats();
        
        setStats({
          particleCount: currentStats.particleCount,
          interactionCount: currentStats.interactionsCount || 0,
          knowledgeAverage: currentStats.knowledgeAverage || 0,
          isRunning: isMotherSimulationRunning(),
          frameCount: currentStats.frameCount || 0
        });
      }
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, []);

  const updateSimulationStats = () => {
    const stats = getSimulationStats();
    setStats({
      ...stats,
      isRunning: isMotherSimulationRunning(),
      frameCount: stats.interactionsCount
    });
  };

  const updateChartData = (dataType: string) => {
    if (dataType === 'charge') {
      setParticleData([
        { name: 'Positive', value: Math.floor(Math.random() * 50) + 30 },
        { name: 'Negative', value: Math.floor(Math.random() * 40) + 20 },
        { name: 'Neutral', value: Math.floor(Math.random() * 30) + 10 },
      ]);
    } else if (dataType === 'knowledge') {
      setParticleData([
        { name: 'High', value: Math.floor(Math.random() * 30) + 10 },
        { name: 'Medium', value: Math.floor(Math.random() * 40) + 30 },
        { name: 'Low', value: Math.floor(Math.random() * 30) + 20 },
      ]);
    } else if (dataType === 'type') {
      setParticleData([
        { name: 'Standard', value: Math.floor(Math.random() * 60) + 40 },
        { name: 'Quantum', value: Math.floor(Math.random() * 20) + 10 },
        { name: 'Hybrid', value: Math.floor(Math.random() * 15) + 5 },
      ]);
    }
    
    setInteractionData([
      { name: 'Knowledge Exchange', value: Math.floor(Math.random() * 100) + 200 },
      { name: 'Repulsion', value: Math.floor(Math.random() * 50) + 100 },
      { name: 'Attraction', value: Math.floor(Math.random() * 80) + 150 },
      { name: 'Neutral', value: Math.floor(Math.random() * 40) + 80 },
    ]);
    
    const newTimePoint = {
      time: new Date().toLocaleTimeString(),
      particles: Math.floor(Math.random() * 20) + 80,
      interactions: Math.floor(Math.random() * 50) + 200,
      knowledge: (Math.random() * 0.3) + 0.5,
    };
    
    setTimeSeriesData(prev => {
      const newData = [...prev, newTimePoint];
      if (newData.length > 20) {
        return newData.slice(newData.length - 20);
      }
      return newData;
    });
  };

  const handleDataTypeChange = (value: string) => {
    setChartDataType(value);
    updateChartData(value);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Simulation Data Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Particles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.particleCount}</div>
            <p className="text-gray-500 text-sm">Active in simulation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.interactionCount.toLocaleString()}</div>
            <p className="text-gray-500 text-sm">Total processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Knowledge Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold">{(stats.knowledgeAverage * 100).toFixed(1)}%</div>
            </div>
            <Progress value={stats.knowledgeAverage * 100} className="h-2 mt-2" />
            <p className="text-gray-500 text-sm">Average across particles</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Simulation Analytics</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Status: <span className={stats.isRunning ? "text-green-500" : "text-red-500"}>
                  {stats.isRunning ? "Running" : "Stopped"}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Frame: <span className="font-medium">{stats.frameCount.toLocaleString()}</span>
              </div>
              <Select value={chartDataType} onValueChange={handleDataTypeChange}>
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
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="particles">Particle Distribution</TabsTrigger>
              <TabsTrigger value="interactions">Interaction Types</TabsTrigger>
              <TabsTrigger value="timeseries">Time Series Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="particles" className="mt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={particleData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {particleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="interactions" className="mt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884D8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="timeseries" className="mt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="particles" stroke="#0088FE" />
                    <Line yAxisId="left" type="monotone" dataKey="interactions" stroke="#00C49F" />
                    <Line yAxisId="right" type="monotone" dataKey="knowledge" stroke="#FF8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-center mb-6">
        <Button variant="outline" onClick={() => updateChartData(chartDataType)}>
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default DataAnalysis;
