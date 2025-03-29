
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const SupplementaryContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Related Simulations</CardTitle>
          <CardDescription>Experiments connected to these concepts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
            <h3 className="font-medium text-white mb-1">Positive Charge Dominance</h3>
            <p className="text-sm text-gray-400">Simulation showing how positive charge particles tend to form more complex structures</p>
            <Button variant="link" className="p-0 h-auto mt-1 text-indigo-400">Run simulation</Button>
          </div>
          
          <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
            <h3 className="font-medium text-white mb-1">Color Field Interactions</h3>
            <p className="text-sm text-gray-400">Explore how particle color affects information exchange</p>
            <Button variant="link" className="p-0 h-auto mt-1 text-indigo-400">Run simulation</Button>
          </div>
          
          <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
            <h3 className="font-medium text-white mb-1">Intent Field Fluctuations</h3>
            <p className="text-sm text-gray-400">Visualize the birth of particles from intent field fluctuations</p>
            <Button variant="link" className="p-0 h-auto mt-1 text-indigo-400">Run simulation</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Audio Resources</CardTitle>
          <CardDescription>Listen to explanations about intent theory</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-white">Introduction to Intent Theory</p>
                  <p className="text-xs text-gray-400">08:42</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-white">Particle Interaction Dynamics</p>
                  <p className="text-xs text-gray-400">14:53</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-white">Emergent Complexity Patterns</p>
                  <p className="text-xs text-gray-400">11:27</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-white">Charge & Knowledge Transfer</p>
                  <p className="text-xs text-gray-400">09:18</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 hover:bg-gray-800/40 rounded-lg cursor-pointer">
                <Play className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-white">Simulation Parameters Explained</p>
                  <p className="text-xs text-gray-400">16:45</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementaryContent;
