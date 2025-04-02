
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AtlasDataset } from '@/utils/atlasDataIntegration';

interface AtlasDataDisplayProps {
  dataset: AtlasDataset | null;
}

const AtlasDataDisplay: React.FC<AtlasDataDisplayProps> = ({ dataset }) => {
  if (!dataset) {
    return null;
  }

  // Count particle types
  const particleTypeCounts: Record<string, number> = {};
  const chargeCount = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  dataset.particles.forEach(particle => {
    particleTypeCounts[particle.particleType] = (particleTypeCounts[particle.particleType] || 0) + 1;
    chargeCount[particle.charge]++;
  });

  // Calculate average energy
  const averageEnergy = dataset.particles.reduce((sum, p) => sum + p.energy, 0) / dataset.particles.length;

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-white">{dataset.name}</CardTitle>
            <CardDescription className="text-slate-300">
              {dataset.description}
            </CardDescription>
          </div>
          <Badge className="bg-indigo-600 hover:bg-indigo-700">
            {dataset.collisionEnergy}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Dataset Information</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-400">Source:</div>
              <div className="text-white">ATLAS Experiment at CERN</div>
              
              <div className="text-slate-400">Year:</div>
              <div className="text-white">{dataset.year}</div>
              
              <div className="text-slate-400">DOI:</div>
              <div className="text-white break-all">{dataset.metadata.DOI || "10.7483/OPENDATA.ATLAS.IKCT.HH28"}</div>
              
              <div className="text-slate-400">Format:</div>
              <div className="text-white">{dataset.metadata.format || "DAOD"}</div>
              
              {dataset.metadata.dataSize && (
                <>
                  <div className="text-slate-400">Data Size:</div>
                  <div className="text-white">{dataset.metadata.dataSize}</div>
                </>
              )}
              
              {dataset.metadata.eventCount && (
                <>
                  <div className="text-slate-400">Events:</div>
                  <div className="text-white">{dataset.metadata.eventCount}</div>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Particle Distribution</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-400">Total Particles:</div>
              <div className="text-white">{dataset.particles.length}</div>
              
              <div className="text-slate-400">Positive Charge:</div>
              <div className="text-white">{chargeCount.positive} ({Math.round(chargeCount.positive / dataset.particles.length * 100)}%)</div>
              
              <div className="text-slate-400">Negative Charge:</div>
              <div className="text-white">{chargeCount.negative} ({Math.round(chargeCount.negative / dataset.particles.length * 100)}%)</div>
              
              <div className="text-slate-400">Neutral Charge:</div>
              <div className="text-white">{chargeCount.neutral} ({Math.round(chargeCount.neutral / dataset.particles.length * 100)}%)</div>
              
              <div className="text-slate-400">Avg. Energy:</div>
              <div className="text-white">{averageEnergy.toFixed(2)} GeV</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Particle Types</h4>
            <ScrollArea className="h-24 rounded border border-slate-700 bg-slate-900/50 p-2">
              <div className="flex flex-wrap gap-1">
                {Object.entries(particleTypeCounts).map(([type, count]) => (
                  <Badge 
                    key={type}
                    variant="outline" 
                    className="bg-slate-800 text-slate-300 border-slate-600"
                  >
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="text-xs text-slate-400 italic mt-2">
            <p>Citation: ATLAS collaboration ({dataset.year}). {dataset.name}. CERN Open Data Portal.</p>
            <p>DOI: {dataset.metadata.DOI || "10.7483/OPENDATA.ATLAS.IKCT.HH28"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AtlasDataDisplay;
