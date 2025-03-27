
import React from "react";
import AnimatedText from "@/components/AnimatedText";
import SimulationData from "@/components/SimulationData";
import DataFileUploader from "@/components/DataFileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database, ChartLine, FileJson, Github, BookOpen, MessageSquare, Atom } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <AnimatedText 
            text="intentSim.org" 
            tag="h1" 
            className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" 
            animation="fade-in"
          />
          <AnimatedText 
            text="Universe Intent Simulation Explorer" 
            tag="p" 
            className="text-xl md:text-2xl text-gray-300 mb-6" 
            animation="slide-up"
            delay={300}
          />
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Explore an emergent universe model where particles arise from intent field fluctuations, creating complexity through interaction and purpose.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16">
          <Button asChild variant="default" size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg">
            <Link to="/simulation" className="flex items-center gap-2">
              <Atom className="h-5 w-5" />
              Launch Simulation
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg border-indigo-600 text-indigo-400 hover:text-indigo-300">
            <Link to="/analysis" className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" />
              Data Analysis
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
            <div className="bg-indigo-600/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Atom className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Intent Field Simulation</h3>
            <p className="text-gray-400">
              Witness particles born from intent field fluctuations, creating a universe that evolves with complexity.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="bg-purple-600/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Parameters</h3>
            <p className="text-gray-400">
              Adjust simulation parameters in real-time to test different factors in universe creation.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/20">
            <div className="bg-pink-600/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <ChartLine className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Data Analysis</h3>
            <p className="text-gray-400">
              Analyze simulation results with advanced metrics for entropy, complexity, and emergent behaviors.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800/30 rounded-xl p-8 mb-16 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore Existing Simulation Data</h2>
          <Tabs defaultValue="existing" className="w-full">
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
        
        <div className="text-center">
          <AnimatedText 
            text="Ready to explore the universe?" 
            tag="h2" 
            className="text-2xl md:text-3xl font-bold mb-6" 
            animation="fade-in"
          />
          <Button asChild variant="default" size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg">
            <Link to="/simulation">
              Start Your Journey
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
