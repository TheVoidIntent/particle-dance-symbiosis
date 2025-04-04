
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import IntentSimonAdvisor from '@/components/IntentSimonAdvisor';
import { initializeDocumentContent } from '@/utils/knowledge/docContentFetcher';

const IntentAdvisorPage: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initialize = async () => {
      // Initialize the document content
      await initializeDocumentContent();
      setIsInitialized(true);
    };
    
    initialize();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-black">
      <Helmet>
        <title>IntentSim(on) Advisor | Universe Intent Simulation</title>
        <meta name="description" content="Consult with IntentSim(on), your advanced intent-based universe advisor" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
          IntentSim(on) Knowledge Nexus
        </h1>
        
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
          Consult with IntentSim(on), a simulation-trained advisor that learns from the intent-based universe model. Ask questions about intent fields, particle interactions, and emergent complexity.
        </p>
        
        <div className="max-w-6xl mx-auto h-[600px] mb-8">
          <IntentSimonAdvisor />
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          IntentSim(on) continually learns from both simulation data and the Intent-Information Nexus textbook.
        </div>
      </div>
    </div>
  );
};

export default IntentAdvisorPage;
