
import React from "react";
import SimulationData from "@/components/SimulationData";
import DataFileUploader from "@/components/DataFileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Universe Intent Simulation Explorer</h1>
      
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
