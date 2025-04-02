
import React from 'react';
import { Helmet } from 'react-helmet';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>IntentSim | About</title>
        <meta name="description" content="About IntentSim - Information-Intent Nexus theory" />
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">About IntentSim</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-3">The Theoretical Framework</h2>
          <p className="mb-4">
            IntentSim models a universe born from a proto-universe and its inherent intent to know itself.
            The fundamental particles arise from conceptual intent field fluctuations, with their properties
            determined by the nature of these fluctuations.
          </p>
          <p>
            Negative fluctuations create particles with negative charge and less inclination to interact.
            Positive fluctuations create particles with positive charge and greater desire to engage.
            Neutral fluctuations create particles with balanced properties.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Research Goals</h2>
          <p>
            Our research aims to explore how intent fields can give rise to complex systems through
            self-organization and information exchange. By studying these dynamics, we hope to gain
            insights into the fundamental nature of reality and consciousness.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
