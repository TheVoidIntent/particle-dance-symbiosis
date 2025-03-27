
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HypothesisTab: React.FC = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Theoretical Foundations</CardTitle>
        <CardDescription className="text-gray-300">
          The conceptual framework behind the intent-based universe model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full h-[800px] rounded-lg overflow-hidden border border-gray-700">
          <iframe 
            src="https://docs.google.com/document/d/e/2PACX-1vSvP75WZNFmfVqZpus0jo_cpRLCZ-yrW4vNnL-Sw6dy1wPbSOIrge0V69KxtONSpQyPwqtH5UZhCWbA/pub?embedded=true" 
            className="w-full h-full"
            title="Intent Universe Hypothesis Document"
          ></iframe>
        </div>
        
        <div className="space-y-8 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-3">Proto-Universe Intent</h3>
            <p className="text-gray-300">
              This model posits that before physical matter existed, there was a proto-universe
              with the fundamental intent to know itself. This primordial intent created fluctuations
              in what can be understood as an "intent field" - the canvas upon which the universe
              would eventually be painted.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Charge as Intentional Orientation</h3>
            <p className="text-gray-300">
              In this framework, particle charge represents an orientation toward knowledge exchange:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
              <li><span className="font-medium text-blue-400">Positive Charge:</span> Represents an outward-oriented intent, with particles more likely to engage in knowledge exchange</li>
              <li><span className="font-medium text-red-400">Negative Charge:</span> Represents an inward-oriented intent, with particles more reluctant to share information</li>
              <li><span className="font-medium text-gray-400">Neutral Charge:</span> Represents a balanced intent, with particles that may or may not engage depending on context</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Complexification Mechanisms</h3>
            <p className="text-gray-300">
              The universe evolves toward greater complexity through several mechanisms:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
              <li><span className="font-medium text-indigo-400">Knowledge Accumulation:</span> Particles gain and store knowledge through interactions</li>
              <li><span className="font-medium text-indigo-400">Interaction History:</span> Past interactions shape future behavior</li>
              <li><span className="font-medium text-indigo-400">Energy Exchange:</span> Knowledge transfer requires energy investment</li>
              <li><span className="font-medium text-indigo-400">Inflation Events:</span> Periods where accumulated knowledge triggers rapid expansion</li>
            </ul>
          </div>

          <div className="bg-purple-900/30 border border-purple-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Mathematical Representation</h3>
            <p className="text-gray-300 mb-4">
              The intent field fluctuations can be mathematically represented as:
            </p>
            <div className="bg-gray-900/60 p-4 rounded-md overflow-x-auto">
              <pre className="text-indigo-300 font-mono">
                I(x,y,z,t) = I₀ + A·sin(ωt) + ξ(t)
              </pre>
              <p className="text-sm text-gray-400 mt-2">
                Where I(x,y,z,t) is the intent value at position (x,y,z) and time t,
                I₀ is the baseline intent, A is the amplitude of periodic fluctuations,
                ω is the frequency, and ξ(t) represents random quantum fluctuations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HypothesisTab;
