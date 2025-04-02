
import React from 'react';
import IntentAssistant from './IntentAssistant';

interface IntentSimonProps {
  className?: string;
}

const IntentSimon: React.FC<IntentSimonProps> = ({ className = "" }) => {
  return (
    <IntentAssistant 
      initialMessage="Hello! I'm IntentSimon, your dedicated IntentSim.org assistant. I'm fully trained on the intent-based universe model, simulation data, and ATLAS/CERN datasets. How can I help advance your understanding of intent-based universe formation today?"
      placeholder="Ask about intent fields, particles, research findings, or upload media for analysis..."
      className={className}
      voiceStyle="professor"
    />
  );
};

export default IntentSimon;
