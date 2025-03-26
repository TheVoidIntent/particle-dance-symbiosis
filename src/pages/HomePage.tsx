
import React from "react";
import SimulationData from "@/components/SimulationData";
import DataFileUploader from "@/components/DataFileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database, ChartLine } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Universe Intent Simulation Explorer</h1>
      
      <div className="flex justify-center gap-4 mb-8">
        <Button asChild variant="outline">
          <Link to="/simulation" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Run Simulation
          </Link>
        </Button>
        <Button asChild>
          <Link to="/analysis" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            Data Analysis
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="existing" className="mb-10">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="existing">System Data</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="existing">
          <SimulationData />
        </TabsContent>
        
        <TabsContent value="upload">
          <DataFileUploader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
