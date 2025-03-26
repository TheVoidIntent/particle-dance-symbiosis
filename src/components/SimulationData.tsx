
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type SimulationDataPoint = {
  timestamp: number;
  particle_counts: {
    positive: number;
    negative: number;
    neutral: number;
    high_energy: number;
    quantum: number;
    standard: number;
    composite: number;
  };
  total_particles: number;
  total_interactions: number;
  avg_knowledge: number | string;
  avg_complexity: number;
  max_complexity: number;
  complexity_index: number | string;
};

type SimulationResult = {
  config: {
    max_particles: number;
    learning_rate: number;
    fluctuation_rate: number;
    name: string;
  };
  data: SimulationDataPoint[];
  timestamp: string;
};

type SummaryData = {
  timestamp: string;
  simulations: string[];
  latest_run: string;
};

const SimulationData = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [simulations, setSimulations] = useState<string[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<string>("");
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load summary data
  const loadSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/data/summary.json');
      if (!response.ok) {
        throw new Error('No simulation data available. Run a simulation first.');
      }
      
      const data = await response.json();
      setSummaryData(data);
      setSimulations(data.simulations || []);
      
      if (data.simulations && data.simulations.length > 0) {
        setSelectedSimulation(data.simulations[0]);
      }
      
    } catch (err) {
      console.error('Error loading simulation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load simulation data');
    } finally {
      setLoading(false);
    }
  };

  // Load specific simulation data
  const loadSimulationData = async (simulationName: string) => {
    if (!summaryData || !simulationName) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/data/simulation_${simulationName}_${summaryData.latest_run}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load data for simulation: ${simulationName}`);
      }
      
      // Get the text and handle Infinity values before parsing
      const text = await response.text();
      const processedText = text
        .replace(/"avg_knowledge":\s*Infinity/g, '"avg_knowledge": "Infinity"')
        .replace(/"complexity_index":\s*Infinity/g, '"complexity_index": "Infinity"');
      
      const data = JSON.parse(processedText);
      setSimulationData(data);
      
    } catch (err) {
      console.error('Error loading simulation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load specific simulation data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadSummaryData();
  }, []);

  // Load simulation data when selection changes
  useEffect(() => {
    if (selectedSimulation) {
      loadSimulationData(selectedSimulation);
    }
  }, [selectedSimulation, summaryData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Simulation Data</CardTitle>
            <CardDescription>
              Analysis of particle behavior and universe complexity over time
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={loadSummaryData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center py-4">Loading simulation data...</p>}
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md my-2">
            {error}
          </div>
        )}
        
        {!loading && !error && summaryData && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
              <div>
                <p className="text-sm font-medium mb-1">Latest Run:</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(summaryData.latest_run.replace('_', 'T')).toLocaleString()}
                </p>
              </div>
              
              <div className="sm:ml-auto">
                <p className="text-sm font-medium mb-1">Select Simulation:</p>
                <Select value={selectedSimulation} onValueChange={setSelectedSimulation}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select simulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {simulations.map(sim => (
                      <SelectItem key={sim} value={sim}>
                        {sim.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {simulationData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Max Particles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{simulationData.config.max_particles}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Learning Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{simulationData.config.learning_rate}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Fluctuation Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{simulationData.config.fluctuation_rate}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="particles">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="particles">Particles</TabsTrigger>
                    <TabsTrigger value="complexity">Complexity</TabsTrigger>
                    <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="particles" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulationData.data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="particle_counts.positive" name="Positive" stroke="#4CAF50" />
                        <Line type="monotone" dataKey="particle_counts.negative" name="Negative" stroke="#F44336" />
                        <Line type="monotone" dataKey="particle_counts.neutral" name="Neutral" stroke="#9E9E9E" />
                        <Line type="monotone" dataKey="particle_counts.composite" name="Composite" stroke="#2196F3" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="complexity" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulationData.data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="complexity_index" name="Complexity Index" stroke="#9C27B0" strokeWidth={2} />
                        <Line type="monotone" dataKey="avg_complexity" name="Avg Complexity" stroke="#FF9800" />
                        <Line type="monotone" dataKey="max_complexity" name="Max Complexity" stroke="#E91E63" />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="knowledge" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulationData.data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avg_knowledge" name="Avg Knowledge" stroke="#FF5722" strokeWidth={2} />
                        <Line type="monotone" dataKey="total_interactions" name="Total Interactions" stroke="#607D8B" />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </>
        )}
        
        {!loading && !error && !summaryData && (
          <div className="text-center py-6">
            <p>No simulation data available.</p>
            <p className="text-sm text-muted-foreground mt-2">Data will be available after the GitHub workflow runs.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationData;
