import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Atom, 
  Brain, 
  Share2, 
  ArrowRight, 
  Video, 
  BookOpen, 
  Headphones,
  Download
} from "lucide-react";
import AudioFileUploader from "@/components/AudioFileUploader";

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <Helmet>
        <title>IntentSim | Documentation</title>
        <meta name="description" content="Comprehensive documentation of the Intent Universe Framework" />
      </Helmet>

      <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" 
               style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
               style={{animationDuration: '20s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-1.5 mb-4 border border-gray-700">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">Documentation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
              Intent Universe Framework
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive guide to understanding the theoretical basis, implementation, and application
              of the intent-based universe simulation.
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600">
                  <Atom className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="theory" className="data-[state=active]:bg-indigo-600">
                  <Brain className="mr-2 h-4 w-4" />
                  Theoretical Basis
                </TabsTrigger>
                <TabsTrigger value="implementation" className="data-[state=active]:bg-indigo-600">
                  <Share2 className="mr-2 h-4 w-4" />
                  Implementation
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-indigo-600">
                  <Video className="mr-2 h-4 w-4" />
                  Audio/Visual
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="animate-fade-in">
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
                    <Button size="lg" onClick={() => setActiveTab("theory")} className="bg-indigo-600 hover:bg-indigo-700">
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
            </TabsContent>

            <TabsContent value="theory" className="animate-fade-in">
              <Card className="bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Theoretical Foundations</CardTitle>
                  <CardDescription className="text-gray-300">
                    The conceptual framework behind the intent-based universe model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg">
                    The Intent Universe Framework builds upon several theoretical concepts, extending them
                    to explore a universe where consciousness and intent are fundamental properties.
                  </p>

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
            </TabsContent>

            <TabsContent value="implementation" className="animate-fade-in">
              <Card className="bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Technical Implementation</CardTitle>
                  <CardDescription className="text-gray-300">
                    How the theoretical framework is implemented in code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg">
                    The Intent Universe Simulation translates the theoretical framework into a
                    computational model through several key components:
                  </p>

                  <div className="space-y-6 mt-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Intent Field Representation</h3>
                      <p className="text-gray-300">
                        The intent field is modeled as a three-dimensional array of numerical values representing
                        the strength of intent at each point in virtual space. This field fluctuates over time
                        according to both deterministic and random factors.
                      </p>
                      <div className="bg-gray-900/60 p-4 rounded-md mt-3 overflow-x-auto">
                        <pre className="text-green-400 font-mono text-sm">
{`// Intent field initialization
const intentField = Array(fieldSize.x).fill(0).map(() =>
  Array(fieldSize.y).fill(0).map(() =>
    Array(fieldSize.z).fill(0)
  )
);

// Field fluctuation
for (let x = 0; x < fieldSize.x; x++) {
  for (let y = 0; y < fieldSize.y; y++) {
    for (let z = 0; z < fieldSize.z; z++) {
      intentField[x][y][z] += 
        (Math.random() - 0.5) * 2 * intentFluctuationRate;
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Particle Creation</h3>
                      <p className="text-gray-300">
                        Particles are created from intent field fluctuations, with properties determined
                        by the nature of the fluctuation:
                      </p>
                      <div className="bg-gray-900/60 p-4 rounded-md mt-3 overflow-x-auto">
                        <pre className="text-green-400 font-mono text-sm">
{`// Determine particle charge based on intent fluctuation
let charge: 'positive' | 'negative' | 'neutral';
const intentValue = intentFieldRef.current[x][y][z];

if (intentValue > threshold) {
  charge = 'positive';
} else if (intentValue < -threshold) {
  charge = 'negative';
} else {
  charge = 'neutral';
}

// Create particle with appropriate properties
const newParticle = {
  id: nextId++,
  x, y, z,
  charge,
  intent: Math.abs(intentValue) * intentMultiplier,
  // ... other properties
};`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Interaction Dynamics</h3>
                      <p className="text-gray-300">
                        Particles interact based on proximity, charge, and intent values. During interactions,
                        knowledge is transferred, energy is exchanged, and the intent field is modified:
                      </p>
                      <div className="bg-gray-900/60 p-4 rounded-md mt-3 overflow-x-auto">
                        <pre className="text-green-400 font-mono text-sm">
{`// Simplified interaction logic
function handleParticleInteraction(p1, p2) {
  // Calculate interaction probability based on charge
  let interactionProb = baseProb;
  if (p1.charge === 'positive' && p2.charge === 'positive') {
    interactionProb *= 1.5;  // More likely to interact
  } else if (p1.charge === 'negative' && p2.charge === 'negative') {
    interactionProb *= 0.5;  // Less likely to interact
  }
  
  if (Math.random() < interactionProb) {
    // Knowledge transfer
    const knowledgeTransfer = calculateTransferAmount(p1, p2);
    p2.knowledge += knowledgeTransfer;
    p1.knowledge -= knowledgeTransfer * energyLossRate;
    
    // Update complexity
    p1.complexity = updateComplexity(p1);
    p2.complexity = updateComplexity(p2);
    
    // Record interaction
    p1.interactions++;
    p2.interactions++;
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Emergent Phenomena</h3>
                      <p className="text-gray-300">
                        The simulation monitors for emergent phenomena, such as:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
                        <li><span className="font-medium text-indigo-400">Inflation Events:</span> Triggered when accumulated knowledge exceeds thresholds</li>
                        <li><span className="font-medium text-indigo-400">Complexity Clusters:</span> Formation of groups of particles with high interaction rates</li>
                        <li><span className="font-medium text-indigo-400">Knowledge Gradients:</span> Spatial variations in knowledge accumulation</li>
                        <li><span className="font-medium text-indigo-400">Adaptive Behaviors:</span> Particles modifying behavior based on past interactions</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-2">Research Extensions</h3>
                      <p className="text-gray-300 mb-3">
                        The simulation framework enables exploration of various research questions:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li>How does varying the ratio of charge types affect system evolution?</li>
                        <li>What are the minimum conditions needed for complexity to emerge?</li>
                        <li>Can predictable structures form from purely random initial conditions?</li>
                        <li>How do information transfer rates impact overall system stability?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="animate-fade-in">
              <Card className="bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Audio/Visual Resources</CardTitle>
                  <CardDescription className="text-gray-300">
                    Multimedia resources explaining the Intent Universe Framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold flex items-center">
                        <Video className="mr-2 h-5 w-5 text-indigo-400" />
                        Video Explanations
                      </h3>
                      
                      <div className="bg-gray-900/60 rounded-lg overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          <div className="flex items-center justify-center h-full bg-gray-800 border border-gray-700">
                            <div className="text-center p-4">
                              <Video className="h-10 w-10 mx-auto text-indigo-400 mb-3" />
                              <p className="text-gray-300">Intent Universe Visualization</p>
                              <p className="text-sm text-gray-400 mt-1">Simulation of particle emergence and interaction</p>
                              <Button size="sm" className="mt-3 bg-indigo-600 hover:bg-indigo-700">
                                Watch Video
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                          <div className="aspect-w-16 aspect-h-9">
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <p className="text-gray-300 text-sm">Field Fluctuations</p>
                                <Button size="sm" variant="ghost" className="mt-2 text-indigo-400 hover:text-indigo-300">
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                          <div className="aspect-w-16 aspect-h-9">
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <p className="text-gray-300 text-sm">Inflation Events</p>
                                <Button size="sm" variant="ghost" className="mt-2 text-indigo-400 hover:text-indigo-300">
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold flex items-center">
                        <Headphones className="mr-2 h-5 w-5 text-indigo-400" />
                        Audio Resources
                      </h3>
                      
                      <AudioFileUploader />
                      
                      <div className="space-y-4 mt-6">
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center">
                            <div className="bg-indigo-600 rounded-full p-2 mr-3">
                              <Headphones className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">Introduction to Intent Theory</h4>
                              <p className="text-sm text-gray-400">45:12 • Conceptual overview</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                              Listen
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center">
                            <div className="bg-indigo-600 rounded-full p-2 mr-3">
                              <Headphones className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">Particle Interaction Dynamics</h4>
                              <p className="text-sm text-gray-400">32:05 • Technical explanation</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                              Listen
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center">
                            <div className="bg-indigo-600 rounded-full p-2 mr-3">
                              <Headphones className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">Emergent Complexity Patterns</h4>
                              <p className="text-sm text-gray-400">28:47 • Research findings</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                              Listen
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold flex items-center mt-8">
                        <BookOpen className="mr-2 h-5 w-5 text-indigo-400" />
                        Documentation
                      </h3>
                      
                      <div className="bg-gray-900/60 rounded-lg p-6 border border-gray-700">
                        <h4 className="text-xl font-medium mb-2">Research Papers & Documentation</h4>
                        <p className="text-gray-300 mb-4">Download technical documentation and research papers explaining the Intent Universe Framework in detail.</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                              <span className="text-gray-300">Intent Framework Whitepaper</span>
                            </div>
                            <Button size="sm" variant="ghost" className="text-indigo-400">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                              <span className="text-gray-300">Technical Implementation Guide</span>
                            </div>
                            <Button size="sm" variant="ghost" className="text-indigo-400">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                              <span className="text-gray-300">Research Findings Summary</span>
                            </div>
                            <Button size="sm" variant="ghost" className="text-indigo-400">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Documentation;
