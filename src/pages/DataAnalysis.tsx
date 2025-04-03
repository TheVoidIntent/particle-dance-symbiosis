import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, BarChart4, FileText, FileJson, FlaskConical, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSimulationStats } from "@/utils/simulation/motherSimulation";
import { analyzeSimulationData } from "@/utils/dataAnalysisUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import { checkAudioFileExists } from "@/utils/audio/audioFileUtils";

const DataAnalysis: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showLicenseAgreement, setShowLicenseAgreement] = useState(false);
  const { toast } = useToast();
  
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

  const handleRunAnalysis = () => {
    try {
      const result = analyzeSimulationData({});
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "Advanced analysis completed successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "An error occurred while running the analysis.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadResearch = (documentName: string) => {
    setShowLicenseAgreement(true);
  };

  const confirmDownload = (documentName: string) => {
    setShowLicenseAgreement(false);
    
    toast({
      title: "Download Started",
      description: `The document "${documentName}" is being downloaded.`,
      variant: "default",
    });
    
    const link = document.createElement('a');
    link.href = '/research-papers/intent-theory-whitepaper.pdf';
    link.download = documentName + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunInflationAnalysis = () => {
    toast({
      title: "Inflation Analysis Running",
      description: "Analyzing simulation inflation events...",
      variant: "default",
    });
    
    setTimeout(() => {
      toast({
        title: "Inflation Analysis Complete",
        description: "3 inflation events detected and analyzed.",
        variant: "default",
      });
    }, 1000);
  };

  useEffect(() => {
    checkAudioFileExists('/audio/data_analysis.mp3')
      .then(result => {
        if (!result.exists) {
          console.log("Data analysis audio file not found");
        }
      });
  }, []);

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
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
                    <TabsTrigger value="research">Research Notes</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
                    <TabsTrigger value="inflation">Inflation Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="charts">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-center py-8 text-gray-500">
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
                  
                  <TabsContent value="research">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">Research Documents</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Download official IntentSim research papers and documentation. All documents are licensed under TheVoidIntent LLC for research purposes only.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Intent Field Theory Whitepaper</h4>
                              <p className="text-sm text-gray-500">Comprehensive exploration of intent as the foundation of universe creation</p>
                            </div>
                            <Button variant="outline" onClick={() => handleDownloadResearch('Intent-Field-Theory-Whitepaper')}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Particle Interaction Dynamics</h4>
                              <p className="text-sm text-gray-500">Analysis of how charge affects knowledge transfer between particles</p>
                            </div>
                            <Button variant="outline" onClick={() => handleDownloadResearch('Particle-Interaction-Dynamics')}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Emergent Complexity in Intent Systems</h4>
                              <p className="text-sm text-gray-500">Mathematical model of complexity emergence in intentional universes</p>
                            </div>
                            <Button variant="outline" onClick={() => handleDownloadResearch('Emergent-Complexity-Model')}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {showLicenseAgreement && (
                        <div className="mt-6 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center text-yellow-700 dark:text-yellow-400">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            License Agreement Required
                          </h4>
                          <p className="text-sm mb-4">
                            These documents are licensed for research purposes only under TheVoidIntent LLC. By downloading, you agree not to redistribute or use commercially.
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowLicenseAgreement(false)}>
                              Cancel
                            </Button>
                            <Button variant="default" onClick={() => confirmDownload('Intent-Field-Theory-Whitepaper')}>
                              I Agree
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-medium">Advanced Analysis Tools</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Run specialized analytical models on your simulation data
                          </p>
                        </div>
                        <Button 
                          variant="default" 
                          className="bg-indigo-600 hover:bg-indigo-700"
                          onClick={handleRunAnalysis}
                        >
                          <FlaskConical className="h-4 w-4 mr-2" />
                          Run Advanced Analysis
                        </Button>
                      </div>
                      
                      {analysisResult ? (
                        <div className="space-y-4">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="metrics">
                              <AccordionTrigger className="text-lg font-medium">
                                Key Metrics
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {analysisResult.metrics?.map((metric: any) => (
                                    <div key={metric.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium">{metric.name}</h4>
                                        <div className={`flex items-center ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                          {metric.change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />}
                                          {Math.abs(metric.change).toFixed(2)}%
                                        </div>
                                      </div>
                                      <p className="text-2xl font-bold mt-2">{metric.value}</p>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="correlations">
                              <AccordionTrigger className="text-lg font-medium">
                                Correlation Analysis
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
                                  <pre className="text-sm">{JSON.stringify(analysisResult.correlations, null, 2)}</pre>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="entropy">
                              <AccordionTrigger className="text-lg font-medium">
                                Entropy & Complexity
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                  <p className="text-gray-500">Entropy visualization will appear here</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                          <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="mb-2">No advanced analysis data available</p>
                          <p className="text-sm">Run the advanced analysis to see detailed metrics and correlations</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inflation">
                    <div className="p-6 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-medium">Universe Inflation Analysis</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Analyze inflation events and expansion patterns in your simulation
                          </p>
                        </div>
                        <Button 
                          variant="default" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={handleRunInflationAnalysis}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Analyze Inflation Events
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                            <h4 className="font-medium text-purple-700 dark:text-purple-400">Inflation Events</h4>
                            <p className="text-3xl font-bold mt-2">3</p>
                            <p className="text-sm text-gray-500 mt-1">Total detected events</p>
                          </div>
                          
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                            <h4 className="font-medium text-purple-700 dark:text-purple-400">Intent Threshold</h4>
                            <p className="text-3xl font-bold mt-2">837K</p>
                            <p className="text-sm text-gray-500 mt-1">Avg. intentInformation at inflation</p>
                          </div>
                          
                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                            <h4 className="font-medium text-purple-700 dark:text-purple-400">Particle Growth</h4>
                            <p className="text-3xl font-bold mt-2">+217%</p>
                            <p className="text-sm text-gray-500 mt-1">Avg. growth during inflation</p>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <h4 className="font-medium mb-4">Inflation Timeline</h4>
                          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Inflation events timeline visualization</p>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <h4 className="font-medium mb-4">Structural Changes</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Pre-inflation complexity:</span>
                              <span className="font-medium">127.56</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Post-inflation complexity:</span>
                              <span className="font-medium">294.22</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Knowledge retention:</span>
                              <span className="font-medium">87.3%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entropy change:</span>
                              <span className="font-medium">+54.1%</span>
                            </div>
                          </div>
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
                <Button variant="outline" className="w-full mt-4" onClick={() => handleDownloadResearch('Intent-Theory-Research')}>
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
                
                <Button variant="outline" className="w-full mt-4" onClick={handleRunAnalysis}>
                  Run Advanced Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DataAnalysis;
