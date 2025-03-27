
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, BarChart4, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSimulationStats } from "@/utils/simulation/motherSimulation";

const DataAnalysis: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const { toast } = useToast();
  
  // Get stats from the persistent mother simulation
  const simulationStats = getSimulationStats();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setUploadedData(data);
        
        toast({
          title: "Data Loaded Successfully",
          description: `Loaded simulation data with ${data.history?.length || 0} data points.`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error Loading Data",
          description: "The file could not be parsed as valid simulation data.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Data Analysis</h1>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Data Explorer</CardTitle>
              <CardDescription>
                Analyze simulation data to discover patterns and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                      Upload Saved Simulation Data
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Upload a previously exported JSON file from the simulation to analyze its data.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="relative"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                        <input
                          id="file-upload"
                          type="file"
                          accept=".json"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileUpload}
                        />
                      </Button>
                      <span className="text-sm text-gray-500">
                        {uploadedData 
                          ? `${uploadedData.history?.length || 0} data points loaded` 
                          : "No file selected"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BarChart4 className="mr-2 h-5 w-5 text-indigo-500" />
                      Current Simulation Status
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Statistics from the currently running persistent simulation.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Running: <span className="font-medium">{simulationStats.isRunning ? "Yes" : "No"}</span></div>
                      <div>Particles: <span className="font-medium">{simulationStats.particleCount}</span></div>
                      <div>Interactions: <span className="font-medium">{simulationStats.interactionsCount}</span></div>
                      <div>Frames: <span className="font-medium">{simulationStats.frameCount}</span></div>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="charts">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
                    <TabsTrigger value="raw">Raw Data</TabsTrigger>
                    <TabsTrigger value="export">Export Options</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="charts">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">Select data visualization type:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          {['Particle Population', 'Complexity Over Time', 'Entropy Analysis', 'Interaction Patterns'].map((chart) => (
                            <Button key={chart} variant="outline" className="h-20">
                              {chart}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="raw">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
                      {uploadedData ? (
                        <pre className="text-xs">{JSON.stringify(uploadedData, null, 2)}</pre>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <p>Upload a data file to view raw data</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="export">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Export Options</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Export your data in various formats for further analysis
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export as JSON
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export as CSV
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export Chart Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Notes</CardTitle>
              <CardDescription>
                Documentation and theoretical background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  The Intent Simulation Explorer models how a proto-universe can evolve through intent field fluctuations.
                  Key concepts include:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Intent fields as the primordial substrate of reality</li>
                  <li>Charge differentiation based on field fluctuation character</li>
                  <li>Knowledge acquisition through particle interactions</li>
                  <li>Emergent complexity from simple rules</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  Download Research Paper
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistical Analysis</CardTitle>
              <CardDescription>
                Advanced metrics and calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium uppercase text-muted-foreground">Entropy Patterns</h4>
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <p className="text-sm text-gray-500">Shannon entropy visualization</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium uppercase text-muted-foreground">Complexity Growth</h4>
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <p className="text-sm text-gray-500">Kolmogorov complexity chart</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Run Advanced Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
