import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, BookOpen, Library } from 'lucide-react';
import NotebookInsights from '@/components/simulation/NotebookInsights';
import SharedAudioLibrary from '@/components/SharedAudioLibrary';

const SupplementaryContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Related Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Intent Theory</h3>
            <ul className="mt-2 text-sm text-gray-400">
              <li className="py-1 border-b border-gray-800/20">Information Field Fundamentals</li>
              <li className="py-1 border-b border-gray-800/20">Entropy & Complexity</li>
              <li className="py-1 border-b border-gray-800/20">Particle Charge Interactions</li>
              <li className="py-1">Emergence Patterns</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Key Concepts</h3>
            <ul className="mt-2 text-sm text-gray-400">
              <li className="py-1 border-b border-gray-800/20">Intent Field Fluctuations</li>
              <li className="py-1 border-b border-gray-800/20">Knowledge Transfer Dynamics</li>
              <li className="py-1 border-b border-gray-800/20">Complexity Emergence</li>
              <li className="py-1">Self-Organizing Systems</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <NotebookInsights />
      
      {/* Add the SharedAudioLibrary component */}
      <SharedAudioLibrary />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="h-5 w-5 text-green-400" />
            Open Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• How do intent field fluctuations produce emergent behaviors?</p>
          <p>• What is the relationship between particle charge and information transfer capacity?</p>
          <p>• Can we predict complexity patterns from initial field states?</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementaryContent;
