
import React from 'react';
import { Helmet } from 'react-helmet';
import IntentSimon from '@/components/IntentSimon';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const IntentSimonPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <Helmet>
        <title>Meet IntentSim(on) | Universe Intent Simulation</title>
        <meta name="description" content="Meet IntentSim(on), the friendly mascot of our universe simulation project" />
      </Helmet>
      
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Meet IntentSim(on)!
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12">
          Your friendly guide to the universe of intent-based particle simulations
        </p>
        
        <div className="flex justify-center mb-16">
          <IntentSimon size="lg" className="animate-float" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Friendly Interface</h3>
            <p className="text-gray-400">IntentSim(on) helps make complex simulation concepts accessible and engaging for everyone.</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Evolving Intelligence</h3>
            <p className="text-gray-400">Just like our simulation particles, IntentSim(on) represents evolving knowledge and emergent complexity.</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Your Guide</h3>
            <p className="text-gray-400">Let IntentSim(on) guide you through the fascinating world of universal intent simulation.</p>
          </div>
        </div>
        
        <Link to="/visitor">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 h-auto">
            Explore the Simulation with IntentSim(on)
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IntentSimonPage;
