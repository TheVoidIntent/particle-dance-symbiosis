
import React from 'react';
import { Helmet } from "react-helmet";
import GeminiChat from '@/components/GeminiChat';

const GeminiChatPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Gemini Gem Intentional | IntentSim.org</title>
        <meta name="description" content="Chat with Gemini Gem Intentional AI about intent-based universe simulation and particle interactions" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
            Gemini Gem Intentional
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore the intent-based universe model with our AI assistant. Ask questions about particle interactions, intent fields, and universe formation.
          </p>
          
          <div className="h-[600px] mb-8">
            <GeminiChat />
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-3">About Gemini Gem Intentional</h2>
            <p className="mb-4">
              Gemini Gem Intentional is an AI assistant designed to help explain the theoretical framework behind IntentSim.org's universe simulation. It can discuss concepts like:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Intent field fluctuations and their role in particle creation</li>
              <li>How particle charge and color affect interactions</li>
              <li>The "intent to know" as a fundamental property</li>
              <li>Emergent complexity in the simulation</li>
              <li>How to interpret simulation results</li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Note: This is a simulated AI assistant for educational purposes about the IntentSim universe model.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeminiChatPage;
