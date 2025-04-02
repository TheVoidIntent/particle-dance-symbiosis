
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Particle } from '@/types/simulation';

interface SimulationTabProps {
  particles: Particle[];
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({
  particles,
  isRunning,
  onTogglePlay,
  onReset,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="bg-gray-900 rounded-lg flex-1 mb-4 overflow-hidden">
          <ParticleCanvas 
            particles={particles}
            showIntentField={true}
            className="w-full h-full"
          />
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onTogglePlay}
            className="flex items-center"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationTab;
