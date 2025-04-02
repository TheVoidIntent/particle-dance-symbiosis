
import React from 'react';
import { Helmet } from "react-helmet";
import IntentSimon from '@/components/IntentSimon';

const IntentSimonPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>IntentSimon | Intent-Based Universe Assistant | IntentSim.org</title>
        <meta name="description" content="IntentSimon is your dedicated assistant for intent-based universe theory, simulation data, and research" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
            IntentSimon Assistant
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your dedicated assistant for the intent-based universe model. Ask questions, upload media for analysis, or request deep research on any aspect of IntentSim.
          </p>
          
          <div className="h-[600px] mb-8">
            <IntentSimon />
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-3">About IntentSimon</h2>
            <p className="mb-4">
              IntentSimon is a specialized assistant designed to help you explore and understand the theoretical framework behind IntentSim.org's universe simulation. Key features include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Full knowledge of intent field dynamics and particle interactions</li>
              <li>Integration with ATLAS/CERN public datasets for research correlation</li>
              <li>Media analysis capabilities for images, audio, and video</li>
              <li>Deep research functionality across scientific literature</li>
              <li>Oxford professor voice synthesis for clear explanations</li>
              <li>Neural network insights from simulation results</li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              IntentSimon continuously learns from new simulation data and research findings to provide the most accurate and up-to-date information about intent-based universe formation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntentSimonPage;
