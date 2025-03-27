
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Atom, Brain, Infinity } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 text-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_65%)]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Universe Intent Simulation Explorer
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Explore how a universe evolves from proto-universe intent field fluctuations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/simulation">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium">
                  Launch Simulation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/analysis">
                <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-950 px-6 py-3 rounded-md text-lg font-medium">
                  View Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative particles */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Explore Intent-Based Universe Creation
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                <Atom className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Intent Field Fluctuations</h3>
              <p className="text-gray-400">
                Witness how particles emerge from intent field fluctuations and self-organize based on their charge and intrinsic desire to know.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-14 h-14 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Emergent Complexity</h3>
              <p className="text-gray-400">
                Study how simple interaction rules between particles lead to complex structures, clusters, and emergent behaviors.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg hover:shadow-pink-500/20">
              <div className="w-14 h-14 bg-pink-900/30 rounded-full flex items-center justify-center mb-6">
                <Infinity className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Data Analysis</h3>
              <p className="text-gray-400">
                Analyze real-time simulation data, detect anomalies, and understand the mathematical foundations of cosmic emergence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-black text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Explore the Universe?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Launch the interactive simulation and witness the birth of a universe driven by intent.
            </p>
            <Link to="/simulation">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-md text-lg font-medium">
                Start Simulation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
