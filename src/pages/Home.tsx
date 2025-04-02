
import React from 'react';
import { Helmet } from 'react-helmet';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>IntentSim | Home</title>
        <meta name="description" content="IntentSim - Exploring the Information-Intent Nexus" />
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to IntentSim</h1>
        <p className="text-lg mb-4">
          Explore the fascinating intersection of information and intent in our universe simulation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">The Information-Intent Nexus</h2>
            <p>
              Our model explores how proto-universe fluctuations and intent fields give rise to particles
              with varying charges, energies, and complexity levels.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Explore the Simulation</h2>
            <p>
              Witness particles arise from intent field fluctuations, interact, and evolve into complex systems.
              Adjust parameters to test different hypotheses.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
