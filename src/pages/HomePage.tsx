
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Atom, Brain, Share2, Zap } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>IntentSim | Universe Intent Simulation</title>
        <meta name="description" content="Explore universe creation through intent field fluctuations - a theoretical laboratory for emergent complexity" />
      </Helmet>
      
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" 
               style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
               style={{animationDuration: '20s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
               style={{animationDuration: '12s'}}></div>
        </div>
        
        {/* Hero section */}
        <section className="relative pt-20 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-1.5 mb-8 border border-gray-700">
              <Atom className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">intentSim.org</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Universe Through Intent
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10">
              A theoretical laboratory exploring universe creation through intent field fluctuations. 
              Watch as particles emerge from quantum fields, develop intent, and build complexity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/simulation">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 h-auto">
                  Launch Simulation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/analysis">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-6 h-auto">
                  View Data Analysis
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-800/70">
              <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Brain className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intent Field Fluctuations</h3>
              <p className="text-gray-400">Watch as random quantum fluctuations in the intent field give rise to particles with varying charges and behaviors.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-800/70">
              <div className="w-12 h-12 mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergent Complexity</h3>
              <p className="text-gray-400">Observe how simple particles with intent develop complex behaviors through interactions and knowledge sharing.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-800/70">
              <div className="w-12 h-12 mb-4 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Universal Evolution</h3>
              <p className="text-gray-400">Study how charge, color, and intent affect particle behavior and drive universe evolution over time.</p>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-20 mb-28 text-center">
            <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 border border-gray-700/50 rounded-xl p-10 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to explore the universe?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Launch the simulation and adjust parameters to watch how different initial conditions lead to unique universe formations.
              </p>
              <Link to="/simulation">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-6">
                  Begin Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
