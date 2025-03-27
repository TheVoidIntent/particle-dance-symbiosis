
import React from 'react';
import { Helmet } from 'react-helmet';
import DeploymentGuide from '@/components/DeploymentGuide';

const Deployment: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Deployment Guide | IntentSim</title>
        <meta name="description" content="How to deploy the IntentSim simulation to your own server" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Deployment Guide</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Follow these instructions to deploy IntentSim to your web server
            and make it available at intentSim.org
          </p>
        </div>
        
        <DeploymentGuide />
      </div>
    </div>
  );
};

export default Deployment;
