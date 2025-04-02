
import React from 'react';
import { Helmet } from 'react-helmet';

const Research: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>IntentSim | Research</title>
        <meta name="description" content="IntentSim Research and Findings" />
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Research</h1>
        <p className="text-lg mb-8">
          Explore our research findings and publications related to the Information-Intent Nexus theory.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Key Findings</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Intent field fluctuations show patterns similar to quantum vacuum fluctuations</li>
              <li>Particles with higher intent values form more stable clusters</li>
              <li>System complexity increases logarithmically with interaction count</li>
              <li>Entropy decreases in areas of high information exchange</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Ongoing Research</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Relationship between intent fields and established physical forces</li>
              <li>Mathematical models of information transfer between particles</li>
              <li>Emergence of higher-order structures in complex systems</li>
              <li>Integration with ATLAS/CERN datasets</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Research;
