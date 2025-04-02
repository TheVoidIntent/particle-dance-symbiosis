
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useAudioEvents, AudioEventType } from '@/hooks/useAudioEvents';

interface AudioOptionsSectionProps {
  onToggleAudio: () => void;
  audioEnabled: boolean;
}

const AudioOptionsSection: React.FC<AudioOptionsSectionProps> = ({
  onToggleAudio,
  audioEnabled,
}) => {
  const [particleVolume, setParticleVolume] = useState(50);
  const [interactionVolume, setInteractionVolume] = useState(70);
  const [fieldFluctuationVolume, setFieldFluctuationVolume] = useState(30);
  const [anomalyVolume, setAnomalyVolume] = useState(100);
  
  const { triggerAudioEvent } = useAudioEvents();
  
  const handleVolumeChange = (value: number, type: string) => {
    switch (type) {
      case 'particle':
        setParticleVolume(value);
        break;
      case 'interaction':
        setInteractionVolume(value);
        break;
      case 'fieldFluctuation':
        setFieldFluctuationVolume(value);
        break;
      case 'anomaly':
        setAnomalyVolume(value);
        break;
    }
    
    // Play a sample sound with the new volume
    playTestSound(type, value / 100);
  };
  
  const playTestSound = (type: string, intensity: number = 0.5) => {
    let eventType: AudioEventType;
    
    switch (type) {
      case 'particle':
        eventType = 'particle_creation';
        break;
      case 'interaction':
        eventType = 'interaction';
        break;
      case 'fieldFluctuation':
        eventType = 'field_fluctuation';
        break;
      case 'anomaly':
        eventType = 'anomaly_detected';
        break;
      default:
        eventType = 'particle_creation';
    }
    
    triggerAudioEvent(eventType, { intensity });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Audio</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control sound effects for simulation events
          </p>
        </div>
        <Switch 
          checked={audioEnabled} 
          onCheckedChange={onToggleAudio} 
          id="audio-toggle"
        />
      </div>
      
      {audioEnabled && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="particle-volume">Particle Creation</Label>
              <span className="text-sm text-gray-500">{particleVolume}%</span>
            </div>
            <Slider
              id="particle-volume"
              value={[particleVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(value[0], 'particle')}
              disabled={!audioEnabled}
            />
            <button 
              onClick={() => playTestSound('particle', particleVolume / 100)}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              disabled={!audioEnabled}
            >
              Test Sound
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interaction-volume">Particle Interactions</Label>
              <span className="text-sm text-gray-500">{interactionVolume}%</span>
            </div>
            <Slider
              id="interaction-volume"
              value={[interactionVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(value[0], 'interaction')}
              disabled={!audioEnabled}
            />
            <button 
              onClick={() => triggerAudioEvent('interaction', { intensity: interactionVolume / 100 })}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              disabled={!audioEnabled}
            >
              Test Sound
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="field-volume">Field Fluctuations</Label>
              <span className="text-sm text-gray-500">{fieldFluctuationVolume}%</span>
            </div>
            <Slider
              id="field-volume"
              value={[fieldFluctuationVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(value[0], 'fieldFluctuation')}
              disabled={!audioEnabled}
            />
            <button 
              onClick={() => triggerAudioEvent('field_fluctuation', { intensity: fieldFluctuationVolume / 100 })}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              disabled={!audioEnabled}
            >
              Test Sound
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="anomaly-volume">Anomaly Events</Label>
              <span className="text-sm text-gray-500">{anomalyVolume}%</span>
            </div>
            <Slider
              id="anomaly-volume"
              value={[anomalyVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(value[0], 'anomaly')}
              disabled={!audioEnabled}
            />
            <button 
              onClick={() => triggerAudioEvent('anomaly_detected', { intensity: anomalyVolume / 100 })}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              disabled={!audioEnabled}
            >
              Test Sound
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioOptionsSection;
