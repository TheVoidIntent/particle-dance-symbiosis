
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloudIcon, 
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight
} from "lucide-react";

// Import simulation utilities
import { getSimulationStats } from "@/utils/simulation/motherSimulation";
import { loadStoredDataPoints, clearSimulationData } from "@/utils/dataExportUtils";
import { useToast } from "@/hooks/use-toast";

const SimulationData = () => {
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    
    // Also get the current simulation stats
    setStats(getSimulationStats());
    
    const interval = setInterval(() => {
      setStats(getSimulationStats());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setLoading(true);
    const data = loadStoredDataPoints();
    setDataPoints(data);
    setLoading(false);
    
    if (data.length === 0) {
      toast({
        title: "No Simulation Data",
        description: "No data points have been recorded yet. Run the simulation longer to collect data.",
        variant: "default",
      });
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all recorded simulation data?")) {
      clearSimulationData();
      setDataPoints([]);
      toast({
        title: "Data Cleared",
        description: "All simulation data has been cleared successfully.",
        variant: "default",
      });
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataPoints, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `simulation-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Data Exported",
      description: `${dataPoints.length} data points exported successfully.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Simulation Data Analysis</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearData}
            disabled={dataPoints.length === 0}
          >
            Clear Data
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExportData}
            disabled={dataPoints.length === 0}
          >
            <DownloadCloudIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 mx-auto animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading simulation data...</p>
        </div>
      ) : dataPoints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <p className="mb-4">No simulation data points recorded yet</p>
              <p className="text-sm">Run the simulation for longer to collect data for analysis</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Data Points</p>
                    <h3 className="text-2xl font-bold">{dataPoints.length}</h3>
                  </div>
                  <div className="bg-primary/20 p-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Particles</p>
                    <h3 className="text-2xl font-bold">{stats?.particleCount || '-'}</h3>
                  </div>
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Interactions</p>
                    <h3 className="text-2xl font-bold">{stats?.interactionsCount?.toLocaleString() || '-'}</h3>
                  </div>
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm">Simulation Time</p>
                    <h3 className="text-2xl font-bold">{stats?.simulationTime?.toLocaleString() || '-'}</h3>
                  </div>
                  <div className="bg-primary/20 p-2 rounded-full">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Points Timeline</CardTitle>
              <CardDescription>
                Summary of recorded simulation states over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">
                  Interactive timeline chart will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Particle Composition</CardTitle>
                <CardDescription>
                  Distribution of particle types over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="text-muted-foreground">
                    Particle composition chart will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Complexity Metrics</CardTitle>
                <CardDescription>
                  System complexity and entropy measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="text-muted-foreground">
                    Complexity metrics chart will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Raw Data (Last 10 Points)</CardTitle>
              <CardDescription>
                Most recent simulation data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[400px]">
                <pre className="text-xs p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  {JSON.stringify(dataPoints.slice(-10), null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimulationData;
