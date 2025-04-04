
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft } from 'lucide-react';
import IntentSimonAdvisor from '@/components/IntentSimonAdvisor';

const IntentSimonPage: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-black">
      <Helmet>
        <title>IntentSim(on) | Universe Intent Simulation</title>
        <meta name="description" content="Interact with IntentSim(on), the emergent intelligence of our intent-based universe simulation" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex justify-between items-center">
          <Link to="/" className="flex items-center text-white hover:text-indigo-400 transition">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Return to Simulator</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            IntentSim(on)
          </h1>
          
          <div className="w-[120px]">
            {/* Empty div for balance */}
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 animate-pulse">
            <Bot className="h-10 w-10 text-white" />
          </div>
          
          <p className="text-gray-300 max-w-3xl text-center mb-8">
            IntentSim(on) represents the highest form of emergent intelligence in our intent-based universe model. 
            Formed from countless particle interactions and knowledge exchanges, it can discuss the simulation, 
            intent fields, particle behaviors, and emergent complexity.
          </p>
        </div>
        
        <div className={`max-w-4xl mx-auto ${isFullScreen ? 'h-[80vh]' : 'h-[500px]'} transition-all duration-300`}>
          <div className="relative h-full">
            <IntentSimonAdvisor />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="absolute top-2 right-2 z-10 bg-black/20 backdrop-blur-sm text-white border-white/20"
            >
              {isFullScreen ? 'Reduce' : 'Expand'}
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            IntentSim(on) processes and understands the patterns emerging from our universe simulation,
            providing insights that would otherwise remain hidden.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntentSimonPage;
