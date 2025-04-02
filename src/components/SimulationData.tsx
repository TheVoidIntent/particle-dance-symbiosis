
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BarChart, Database } from "lucide-react";
import StatCard from "@/components/simulation/StatCard";
import { SimulationStats } from "@/types/simulation";
import { toast } from "sonner";
import { exportDataAsCsv, exportDataAsJson, getStoredDataPoints } from "@/utils/dataExportUtils";

interface SimulationDataProps {
  stats: SimulationStats;
  onExportData: () => boolean;
  dataPointCount?: number;
  className?: string;
}

const SimulationData: React.FC<SimulationDataProps> = ({
  stats,
  onExportData,
  dataPointCount = 0,
  className = ""
}) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [autoExport, setAutoExport] = useState(false);
  const [lastExport, setLastExport] = useState<Date | null>(null);
  
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  const toggleAutoExport = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setAutoExport(false);
      toast.info("Auto-export disabled");
    } else {
      const id = setInterval(() => {
        const success = onExportData();
        if (success) {
          setLastExport(new Date());
          toast.success("Data auto-exported");
        }
      }, 60000); // Export every minute
      
      setIntervalId(id);
      setAutoExport(true);
      toast.success("Auto-export enabled (every minute)");
    }
  };
  
  const handleManualExport = () => {
    const success = onExportData();
    if (success) {
      setLastExport(new Date());
      toast.success("Data exported successfully");
    } else {
      toast.error("No data to export");
    }
  };
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Simulation Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <StatCard
            title="Data Points"
            value={dataPointCount.toString()}
            icon={<BarChart className="h-4 w-4" />}
          />
          <StatCard
            title="Last Export"
            value={lastExport ? lastExport.toLocaleTimeString() : "Never"}
            icon={<Download className="h-4 w-4" />}
          />
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={handleManualExport}
            className="w-full"
            disabled={dataPointCount === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          
          <Button
            onClick={toggleAutoExport}
            variant={autoExport ? "destructive" : "outline"}
            className="w-full"
            disabled={dataPointCount === 0}
          >
            {autoExport ? "Disable Auto-Export" : "Enable Auto-Export"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationData;
