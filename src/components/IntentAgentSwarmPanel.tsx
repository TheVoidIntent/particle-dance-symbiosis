
import React, { useState, useEffect } from 'react';
import { useIntentAgentSwarm } from '@/hooks/useIntentAgentSwarm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractFeatures, inferIntentField } from '@/utils/intentAgent/intentSignalUtils';
import { Sparkles, Brain, Network, PanelTop, FileJson } from "lucide-react";

interface IntentAgentSwarmPanelProps {
  particles: any[];
  onConsensusChange?: (consensus: string) => void;
}

const IntentAgentSwarmPanel: React.FC<IntentAgentSwarmPanelProps> = ({ 
  particles, 
  onConsensusChange 
}) => {
  const {
    agentData,
    consensus,
    addAudioData,
    addSimulationData,
    runCycle,
    cycleCount,
    getReflections
  } = useIntentAgentSwarm(3); // Start with 3 agents
  
  const [activeTab, setActiveTab] = useState("overview");
  const [intentFieldData, setIntentFieldData] = useState({
    intentStrength: 0,
    coherence: 0,
    stability: 0,
    complexity: 0
  });
  
  // Process particles to extract features and update swarm
  useEffect(() => {
    if (particles && particles.length > 0) {
      const features = extractFeatures(particles);
      addAudioData(features.peak_freq, features.avg_power);
      addSimulationData(particles);
      
      const fieldData = inferIntentField(particles);
      setIntentFieldData(fieldData);
    }
  }, [particles]);
  
  // Auto-run cycles periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      runCycle();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [runCycle]);
  
  // Notify parent when consensus changes
  useEffect(() => {
    if (consensus && onConsensusChange) {
      onConsensusChange(consensus);
    }
  }, [consensus, onConsensusChange]);
  
  const handleExportData = () => {
    const reflections = getReflections();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reflections));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "agent_reflections.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Network className="h-5 w-5 mr-2" />
            Intent Agent Swarm
          </span>
          <Button onClick={runCycle} variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Run Cycle
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="field">Intent Field</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Cycle Count</p>
                <p className="text-2xl font-bold">{cycleCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Field Consensus</p>
                <p className="text-2xl font-bold">{consensus || "Pending"}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Active Agents</p>
              <div className="flex flex-wrap gap-2">
                {agentData.map(agent => (
                  <div key={agent.id} className="bg-muted p-3 rounded-lg">
                    <div className="text-xs font-medium mb-1">{agent.id}</div>
                    <div className="flex gap-2 text-xs">
                      <span>E: {agent.energy.toFixed(2)}</span>
                      <span>M: {agent.memory.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={handleExportData} variant="outline" size="sm" className="w-full">
              <FileJson className="h-4 w-4 mr-2" />
              Export Agent Reflections
            </Button>
          </TabsContent>
          
          <TabsContent value="agents">
            <div className="space-y-4">
              {agentData.map(agent => (
                <div key={agent.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold">{agent.id}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.lastAction === "Stabilize" ? "bg-green-100 text-green-800" :
                      agent.lastAction === "SignalNearbyAgents" ? "bg-yellow-100 text-yellow-800" :
                      agent.lastAction === "TradeKnowledge" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {agent.lastAction}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Energy</p>
                      <Progress value={agent.energy * 100 / 1.5} className="h-2" />
                      <p className="text-xs text-right mt-1">{agent.energy.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Memory</p>
                      <Progress value={Math.min(agent.memory, 10) * 10} className="h-2" />
                      <p className="text-xs text-right mt-1">{agent.memory.toFixed(1)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-muted p-2 rounded">
                    <div>
                      <p className="font-medium">Pass</p>
                      <p>{agent.testResults.Pass || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium">Neutral</p>
                      <p>{agent.testResults.Neutral || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium">Fail</p>
                      <p>{agent.testResults.Fail || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="field">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Intent Strength</p>
                <Progress value={Math.abs(intentFieldData.intentStrength) * 100} className="h-2" />
                <p className="flex justify-between text-xs mt-1">
                  <span>{intentFieldData.intentStrength < 0 ? "Negative" : "Positive"}</span>
                  <span>{Math.abs(intentFieldData.intentStrength).toFixed(2)}</span>
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Coherence</p>
                <Progress value={intentFieldData.coherence * 100} className="h-2" />
                <p className="text-xs text-right mt-1">{intentFieldData.coherence.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Stability</p>
                <Progress value={intentFieldData.stability * 100} className="h-2" />
                <p className="text-xs text-right mt-1">{intentFieldData.stability.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Complexity</p>
                <Progress value={intentFieldData.complexity * 100} className="h-2" />
                <p className="text-xs text-right mt-1">{intentFieldData.complexity.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">Field Interpretation</p>
              <p className="text-xs text-gray-600">
                {intentFieldData.stability > 0.7 && intentFieldData.complexity > 0.5 
                  ? "The intent field shows high stability with emerging complex patterns."
                  : intentFieldData.coherence > 0.7
                    ? "The intent field demonstrates strong coherence with aligned particle movements."
                    : intentFieldData.intentStrength > 0.5
                      ? "The intent field shows a strong positive bias with high energy particles."
                      : intentFieldData.intentStrength < -0.5
                        ? "The intent field shows strong negative characteristics with resistant particles."
                        : "The intent field is currently in a transitional state."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntentAgentSwarmPanel;
