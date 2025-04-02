
import React from 'react';
import { Helmet } from 'react-helmet';

const Simulation: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>IntentSim | Simulation</title>
        <meta name="description" content="IntentSim Universe Simulation" />
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Universe Simulation</h1>
        <p className="text-lg mb-8">
          Explore our interactive simulation of the Information-Intent Nexus model.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg text-center mb-8">
          <p className="text-white">Simulation canvas will appear here</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Particle Controls</h3>
            <p className="text-sm text-gray-600">Adjust particle properties</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Field Controls</h3>
            <p className="text-sm text-gray-600">Modify intent field parameters</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Simulation Stats</h3>
            <p className="text-sm text-gray-600">View real-time simulation metrics</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulation;
