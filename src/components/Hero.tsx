
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Share2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 right-[10%] w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl" />
      </div>

      <div className="section-container flex flex-col items-center text-center pt-16 md:pt-24 gap-12">
        <div className="mb-8">
          <img src="/logo.svg" alt="IntentSim Logo" className="h-40 w-auto mx-auto" />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Universe Through Intent
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mb-10">
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
            <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-6 h-auto">
              View Data Analysis
            </Button>
          </Link>
        </div>

        {/* Cosmic Universe Image */}
        <div className="flex justify-center my-16 animate-float">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <img 
                src="/lovable-uploads/be1b6633-26f7-4b05-83a6-6a1c4d0b90ad.png" 
                alt="Cosmic Universe Diagram" 
                className="rounded-2xl shadow-2xl max-w-full md:max-w-xl mx-auto transform transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-medium px-6 text-center">
                  Universe Intent Model: The fundamental structure of particle creation from intent field fluctuations
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-200/50 dark:hover:bg-gray-800/70">
            <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Intent Field Fluctuations</h3>
            <p className="text-gray-600 dark:text-gray-400">Watch as random quantum fluctuations in the intent field give rise to particles with varying charges and behaviors.</p>
          </div>
          
          <div className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-200/50 dark:hover:bg-gray-800/70">
            <div className="w-12 h-12 mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Emergent Complexity</h3>
            <p className="text-gray-600 dark:text-gray-400">Observe how simple particles with intent develop complex behaviors through interactions and knowledge sharing.</p>
          </div>
          
          <div className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-200/50 dark:hover:bg-gray-800/70">
            <div className="w-12 h-12 mb-4 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Universal Evolution</h3>
            <p className="text-gray-600 dark:text-gray-400">Study how charge, color, and intent affect particle behavior and drive universe evolution over time.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
