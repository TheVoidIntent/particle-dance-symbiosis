
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Download, FileText, Upload, Filter, Database } from "lucide-react";
import { toast } from "sonner";
import { exportDataToCSV, exportDataToJSON, getSimulationData } from "@/utils/dataExportUtils";

const DataAnalysis = () => {
  const [activeTab, setActiveTab] = useState("particles");
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  
  useEffect(() => {
    // Get data from the simulation
    const data = getSimulationData();
    setSimulationData(data);
  }, []);
  
  const handleExportCSV = () => {
    const url = exportDataToCSV();
    if (url) {
      toast.success("Data exported to CSV successfully");
    } else {
      toast.error("No data to export");
    }
  };
  
  const handleExportJSON = () => {
    const url = exportDataToJSON();
    if (url) {
      toast.success("Data exported to JSON successfully");
    } else {
      toast.error("No data to export");
    }
  };
  
  const getFilteredData = () => {
    let filteredData = [...simulationData];
    
    // Apply time range filter
    if (timeRange === "recent") {
      filteredData = filteredData.slice(-50);
    } else if (timeRange === "mid") {
      const midPoint = Math.floor(filteredData.length / 2);
      filteredData = filteredData.slice(midPoint - 25, midPoint + 25);
    }
    
    // Apply particle type filter
    if (filterType !== "all") {
      filteredData = filteredData.filter(item => {
        if (filterType === "positive") return item.particle_counts.positive > 0;
        if (filterType === "negative") return item.particle_counts.negative > 0;
        if (filterType === "neutral") return item.particle_counts.neutral > 0;
        if (filterType === "composite") return item.particle_counts.composite > 0;
        return true;
      });
    }
    
    return filteredData;
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Intent Simulation Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{simulationData.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Max Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {simulationData.length > 0 
                ? Math.max(...simulationData.map(d => d.max_complexity)).toFixed(2) 
                : "0.00"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Total Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {simulationData.length > 0 
                ? simulationData[simulationData.length - 1]?.total_interactions.toLocaleString() 
                : "0"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Avg Knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {simulationData.length > 0 
                ? simulationData[simulationData.length - 1]?.avg_knowledge.toFixed(3) 
                : "0.000"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex-1 flex items-center gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter particles" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Particles</SelectItem>
              <SelectItem value="positive">Positive Charge</SelectItem>
              <SelectItem value="negative">Negative Charge</SelectItem>
              <SelectItem value="neutral">Neutral Charge</SelectItem>
              <SelectItem value="composite">Composite</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="recent">Recent (Last 50)</SelectItem>
              <SelectItem value="mid">Mid Simulation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="default" onClick={handleExportJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>
      
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>Simulation Data Analysis</CardTitle>
          <CardDescription>
            Visualization of particle behavior and universe complexity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="particles">Particle Types</TabsTrigger>
              <TabsTrigger value="complexity">Complexity</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge & Interactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="particles" className="h-[400px]">
              <ChartContainer
                config={{
                  positive: { label: "Positive", color: "#4CAF50" },
                  negative: { label: "Negative", color: "#F44336" },
                  neutral: { label: "Neutral", color: "#9E9E9E" },
                  composite: { label: "Composite", color: "#2196F3" }
                }}
              >
                <LineChart
                  data={getFilteredData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="particle_counts.positive" name="Positive" stroke="#4CAF50" />
                  <Line type="monotone" dataKey="particle_counts.negative" name="Negative" stroke="#F44336" />
                  <Line type="monotone" dataKey="particle_counts.neutral" name="Neutral" stroke="#9E9E9E" />
                  <Line type="monotone" dataKey="particle_counts.composite" name="Composite" stroke="#2196F3" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="complexity" className="h-[400px]">
              <ChartContainer
                config={{
                  complexity_index: { label: "Complexity Index", color: "#9C27B0" },
                  avg_complexity: { label: "Avg Complexity", color: "#FF9800" },
                  max_complexity: { label: "Max Complexity", color: "#E91E63" }
                }}
              >
                <LineChart
                  data={getFilteredData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="complexity_index" name="Complexity Index" stroke="#9C27B0" strokeWidth={2} />
                  <Line type="monotone" dataKey="avg_complexity" name="Avg Complexity" stroke="#FF9800" />
                  <Line type="monotone" dataKey="max_complexity" name="Max Complexity" stroke="#E91E63" />
                </LineChart>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="knowledge" className="h-[400px]">
              <ChartContainer
                config={{
                  avg_knowledge: { label: "Avg Knowledge", color: "#FF5722" },
                  total_interactions: { label: "Total Interactions", color: "#607D8B" }
                }}
              >
                <LineChart
                  data={getFilteredData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="avg_knowledge" name="Avg Knowledge" stroke="#FF5722" strokeWidth={2} />
                  <Line type="monotone" dataKey="total_interactions" name="Total Interactions" stroke="#607D8B" />
                </LineChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Advanced Particle Metrics</CardTitle>
          <CardDescription>
            In-depth analysis of particle behavior and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm">System Entropy</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ChartContainer
                  config={{
                    system_entropy: { label: "System Entropy", color: "#0288D1" }
                  }}
                >
                  <LineChart
                    data={getFilteredData()}
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="system_entropy" name="System Entropy" stroke="#0288D1" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm">Cluster Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ChartContainer
                  config={{
                    cluster_count: { label: "Cluster Count", color: "#7B1FA2" },
                    average_cluster_size: { label: "Avg Cluster Size", color: "#00796B" }
                  }}
                >
                  <LineChart
                    data={getFilteredData()}
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="cluster_analysis.cluster_count" 
                      name="Cluster Count" 
                      stroke="#7B1FA2" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cluster_analysis.average_cluster_size" 
                      name="Avg Cluster Size" 
                      stroke="#00796B" 
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAnalysis;
