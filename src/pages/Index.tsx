
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Share2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import SimulationPreview from '@/components/simulation/SimulationPreview';

const Index = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Helmet>
        <title>IntentSim | Universe Intent Simulation</title>
        <meta name="description" content="Explore universe creation through intent field fluctuations - a theoretical laboratory for emergent complexity" />
      </Helmet>
      
      {/* Hero section */}
      <section className="relative pt-20 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <img src="/logo.svg" alt="IntentSim Logo" className="h-40 w-auto mx-auto" />
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
          </div>
        </div>
        
        {/* Simulation Preview */}
        <div className="my-16">
          <SimulationPreview />
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
      </section>
      
      {/* About the Simulation */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            About the Simulation
          </h2>
          
          <div className="mt-8 max-w-4xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              This simulation explores the emergence of particles from fluctuations in an intent field - a theoretical construct representing the universe's inherent drive to know itself.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-700/50 p-3 rounded-md">
                <h3 className="font-medium text-indigo-400 mb-1">Positive Charge</h3>
                <p className="text-gray-300">
                  Particles with positive charge have a higher tendency to interact and exchange information, representing the "inquisitive" aspect of the intent.
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-md">
                <h3 className="font-medium text-purple-400 mb-1">Negative Charge</h3>
                <p className="text-gray-300">
                  Particles with negative charge are less inclined to interact, representing the "withdrawn" aspect of the intent field.
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-md">
                <h3 className="font-medium text-green-400 mb-1">Neutral Charge</h3>
                <p className="text-gray-300">
                  Neutral particles have moderate interaction behaviors, balancing between exploration and preservation of information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Links */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com/intentuniverse" target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com/thevoidintent" target="_blank" rel="noopener noreferrer" className="p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://threads.net/@thevoidintent" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M17.7 16.5c-.6.9-1.4 1.5-2.2 1.5-1.3 0-1.7-1.2-1.7-3.3v-5.2h4.3c.3 0 .5-.2.5-.5V6.5c0-.3-.2-.5-.5-.5h-4.3V1.6c0-.2-.1-.3-.3-.3h-3c-.2 0-.3.1-.3.3V6H7.6c-.3 0-.5.2-.5.5v2.5c0 .3.2.5.5.5h2.6v5.6c0 4.1 2.4 5 4.7 5 1.9 0 3.4-.8 4.2-1.4.1-.1.1-.3 0-.4l-1.4-2.3z" />
              </svg>
            </a>
            <a href="https://discord.gg/intentuniverse" target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a href="https://github.com/intent-universe" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
