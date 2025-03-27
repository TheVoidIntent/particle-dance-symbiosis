
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Atom, Brain, ArrowRight, Video } from "lucide-react";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ setActiveTab }) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Universe Born from Intent</CardTitle>
        <CardDescription className="text-gray-300">
          Key concepts and framework overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg">
          The Universe Intent Simulation represents a theoretical framework for exploring
          how a universe might arise from a proto-universe's intent to know itself. This model
          proposes that consciousness and intent are fundamental properties, preceding
          the formation of physical particles.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700/70 transition-colors">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <Atom className="mr-2 h-5 w-5 text-indigo-400" />
              Intent Field Fluctuations
            </h3>
            <p className="text-gray-300">
              Particles arise from conceptual intent field fluctuations, where positive
              fluctuations create positively charged particles, negative fluctuations create
              negatively charged particles, and neutral fluctuations create neutral particles.
            </p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700/70 transition-colors">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Intrinsic Knowledge Desire
            </h3>
            <p className="text-gray-300">
              All particles are imprinted with an "intent to know," giving them an inherent
              desire to explore and interact. Positive particles show greater tendency for
              information exchange, while negative particles are more resistant.
            </p>
          </div>
        </div>

        <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold mb-2">Key Parameters</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><span className="font-medium text-indigo-400">Intent Fluctuation Rate:</span> Controls the strength and frequency of fluctuations in the intent field</li>
            <li><span className="font-medium text-indigo-400">Particle Creation Rate:</span> Determines how quickly particles emerge from intent fluctuations</li>
            <li><span className="font-medium text-indigo-400">Learning Rate:</span> Affects how rapidly particles accumulate knowledge through interactions</li>
            <li><span className="font-medium text-indigo-400">Energy Conservation:</span> When enabled, ensures energy is preserved throughout all interactions</li>
          </ul>
        </div>

        <Separator className="bg-gray-700 my-6" />

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => setActiveTab("hypothesis")} className="bg-indigo-600 hover:bg-indigo-700">
            Explore Theoretical Basis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" onClick={() => setActiveTab("media")} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
            View Audio/Visual Content
            <Video className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
