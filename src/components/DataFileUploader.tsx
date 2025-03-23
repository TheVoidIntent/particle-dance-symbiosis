
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SimulationDataPoint = {
  timestamp: number;
  particle_counts: {
    positive: number;
    negative: number;
    neutral: number;
    high_energy?: number;
    quantum?: number;
    standard?: number;
    composite?: number;
    adaptive?: number;
  };
  total_particles: number;
  total_interactions: number;
  avg_knowledge: number;
  avg_complexity: number;
  max_complexity: number;
  complexity_index: number;
  system_entropy?: number;
  cluster_analysis?: {
    cluster_count: number;
    average_cluster_size: number;
    largest_cluster_size: number;
    cluster_stability: number;
  };
};

type SimulationResult = {
  config: {
    max_particles: number;
    learning_rate: number;
    fluctuation_rate: number;
    name: string;
    use_adaptive?: boolean;
    energy_conservation?: boolean;
    probabilistic_intent?: boolean;
  };
  data: SimulationDataPoint[];
  timestamp: string;
  anomalies?: any[];
};

const DataFileUploader = () => {
  const [uploadedData, setUploadedData] = useState<SimulationResult | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Basic validation to ensure the file has the expected structure
        if (!parsedData.config || !parsedData.data || !Array.isArray(parsedData.data)) {
          throw new Error("Invalid simulation data file format");
        }
        
        setUploadedData(parsedData);
        toast.success("Data file loaded successfully");
      } catch (err) {
        console.error("Error parsing file:", err);
        setError(err instanceof Error ? err.message : "Failed to parse data file");
        toast.error("Failed to load data file");
      }
    };
    
    reader.readAsText(file);
  };

  const clearData = () => {
    setUploadedData(null);
    setFileName("");
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Simulation Data File</CardTitle>
        <CardDescription>
          Upload a JSON file containing simulation data to visualize
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
            <Upload className="h-10 w-10 text-gray-500 mb-2" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              JSON files only
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Select File
            </Button>
          </div>
          
          {fileName && (
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">{fileName}</span>
              <Button variant="ghost" size="sm" onClick={clearData}>
                Clear
              </Button>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          
          {uploadedData && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Max Particles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{uploadedData.config.max_particles}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Learning Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{uploadedData.config.learning_rate}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Fluctuation Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{uploadedData.config.fluctuation_rate}</p>
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
                      data={uploadedData.data}
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
                      data={uploadedData.data}
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
                      data={uploadedData.data}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DataFileUploader;
