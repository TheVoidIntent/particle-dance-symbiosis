
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AtlasDataset, AtlasParticle } from '@/utils/atlasDataIntegration';

interface AtlasDataDisplayProps {
  dataset: AtlasDataset;
}

const AtlasDataDisplay: React.FC<AtlasDataDisplayProps> = ({ dataset }) => {
  // Calculate particle type distribution
  const particleTypeCounts: Record<string, number> = {};
  
  dataset.particles.forEach((particle: AtlasParticle) => {
    const type = particle.particleType || 'unknown';
    particleTypeCounts[type] = (particleTypeCounts[type] || 0) + 1;
  });
  
  // Calculate charge distribution
  const chargeCounts = {
    positive: dataset.particles.filter(p => p.charge === 'positive').length,
    negative: dataset.particles.filter(p => p.charge === 'negative').length,
    neutral: dataset.particles.filter(p => p.charge === 'neutral').length
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          {dataset.name}
          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
            {dataset.collisionEnergy} GeV
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-500">
          {dataset.description}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dataset Info</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="text-gray-500">Date:</span>
              <span>{dataset.date} ({dataset.year})</span>
              
              <span className="text-gray-500">Run Number:</span>
              <span>{dataset.runNumber}</span>
              
              <span className="text-gray-500">DOI:</span>
              <span className="truncate">{dataset.DOI}</span>
              
              <span className="text-gray-500">Format:</span>
              <span>{dataset.format}</span>
              
              <span className="text-gray-500">Size:</span>
              <span>{dataset.dataSize}</span>
              
              <span className="text-gray-500">Experiment:</span>
              <span>{dataset.experimentType}</span>
              
              <span className="text-gray-500">Events:</span>
              <span>{dataset.eventCount}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Particle Distribution</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(particleTypeCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span>{type}:</span>
                  <span>{count} particles</span>
                </div>
              ))}
              
              <div className="border-t border-gray-200 my-1 pt-1">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{dataset.particles.length} particles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
          Data from ATLAS experiment at CERN, {dataset.year}. Reference: {dataset.DOI}
        </div>
      </CardContent>
    </Card>
  );
};

export default AtlasDataDisplay;
