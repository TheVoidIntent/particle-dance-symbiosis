
import React from 'react';
import { Card } from '@/components/ui/card';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Particle } from '@/types/simulation';

interface SimulationContainerProps {
  particles: Particle[];
  width?: number;
  height?: number;
  showControls?: boolean;
  showIntentField?: boolean;
}

const SimulationContainer: React.FC<SimulationContainerProps> = ({
  particles,
  width = 800,
  height = 600,
  showControls = true,
  showIntentField = true,
}) => {
  return (
    <Card className="bg-gray-900 overflow-hidden">
      <div className="aspect-video relative">
        <ParticleCanvas 
          particles={particles}
          width={width}
          height={height}
          showIntentField={showIntentField}
          className="w-full h-full"
        />
      </div>
    </Card>
  );
};

export default SimulationContainer;
