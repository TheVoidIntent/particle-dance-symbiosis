import { useState, useEffect, useCallback, useRef } from 'react';
import { getIntentWaveValues } from '@/utils/simulation/motherSimulation';

export interface SoundOptions {
  intensity?: number;
  complexity?: number;
  informationDensity?: number;
  weight?: number;
  // Add all the properties that caused TypeScript errors
  strength?: number;
  charge?: string;
  particle1?: any;
  particle2?: any;
}

export interface AmbientSoundOptions {
  type: string;
  intensity?: number;
  complexity?: number;
}

export function useSimpleAudio(initialEnabled = true, initialVolume = 0.5) {
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [volume, setVolume] = useState(initialVolume);
  const audioContext = useRef<AudioContext | null>(null);
  const oscillators = useRef<OscillatorNode[]>([]);
  const gains = useRef<GainNode[]>([]);
  const ambientOscillator = useRef<OscillatorNode | null>(null);
  const ambientGain = useRef<GainNode | null>(null);
  const intentWaveOscillators = useRef<OscillatorNode[]>([]);
  const intentWaveGains = useRef<GainNode[]>([]);

  // Quantifiable intent wave metrics
  const [intentWaveMetrics, setIntentWaveMetrics] = useState({
    averageFrequency: 0,
    totalEnergy: 0,
    harmonicRatio: 0,
    resonanceScore: 0
  });

  // Initialize the audio context and oscillators
  const initialize = useCallback(() => {
    if (initialized) return;
    
    try {
      // Create audio context
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillators for various sound types
      for (let i = 0; i < 5; i++) {
        const oscillator = audioContext.current.createOscillator();
        const gainNode = audioContext.current.createGain();
        
        oscillator.type = i % 2 === 0 ? 'sine' : 'triangle';
        oscillator.frequency.value = 220 + (i * 110); // Different base frequencies
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.current.destination);
        
        gainNode.gain.value = 0; // Start silent
        
        oscillator.start();
        
        oscillators.current.push(oscillator);
        gains.current.push(gainNode);
      }
      
      // Create ambient oscillator
      ambientOscillator.current = audioContext.current.createOscillator();
      ambientGain.current = audioContext.current.createGain();
      
      ambientOscillator.current.type = 'sine';
      ambientOscillator.current.frequency.value = 55; // Low base frequency
      
      ambientOscillator.current.connect(ambientGain.current);
      ambientGain.current.connect(audioContext.current.destination);
      
      ambientGain.current.gain.value = 0; // Start silent
      ambientOscillator.current.start();
      
      // Create intent wave oscillators for audio representation
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.current.createOscillator();
        const gainNode = audioContext.current.createGain();
        
        // Different waveform types for richer sound
        oscillator.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sawtooth';
        oscillator.frequency.value = 110 + (i * 55); // Different base frequencies
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.current.destination);
        
        gainNode.gain.value = 0; // Start silent
        
        oscillator.start();
        
        intentWaveOscillators.current.push(oscillator);
        intentWaveGains.current.push(gainNode);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }, [initialized]);

  // Update the audio based on the simulation state
  const updateIntentWaveAudio = useCallback(() => {
    if (!initialized || !enabled || !audioContext.current) return;
    
    try {
      // Get the intent wave values from the simulation
      const waveValues = getIntentWaveValues();
      
      if (waveValues.length === 0) return;
      
      // Use the last few values for audio representation
      const recentValues = waveValues.slice(-3);
      
      // Calculate metrics for quantifiable intent data
      const avgValue = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
      const variance = recentValues.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / recentValues.length;
      const maxValue = Math.max(...recentValues);
      
      const averageFrequency = 220 + (avgValue * 880); // Map to 220-1100Hz range
      const totalEnergy = Math.min(1, avgValue * 2) * volume;
      const harmonicRatio = Math.min(1, variance * 10);
      const resonanceScore = Math.min(1, maxValue * 0.8);
      
      // Update metrics for external use
      setIntentWaveMetrics({
        averageFrequency: Math.round(averageFrequency),
        totalEnergy: Math.round(totalEnergy * 100) / 100,
        harmonicRatio: Math.round(harmonicRatio * 100) / 100,
        resonanceScore: Math.round(resonanceScore * 100) / 100
      });
      
      // Update audio oscillators with these values
      intentWaveOscillators.current.forEach((osc, index) => {
        const value = recentValues[index % recentValues.length];
        
        // Adjust frequency based on the intent wave value
        const baseFreq = 110 + (index * 55);
        const targetFreq = baseFreq * (1 + value);
        
        // Smooth transition to new frequency
        osc.frequency.setTargetAtTime(targetFreq, audioContext.current!.currentTime, 0.1);
        
        // Adjust volume based on intent value and master volume
        const targetGain = Math.min(0.2, value * 0.4) * volume;
        intentWaveGains.current[index].gain.setTargetAtTime(
          enabled ? targetGain : 0,
          audioContext.current!.currentTime,
          0.1
        );
      });
    } catch (error) {
      console.error("Error updating intent wave audio:", error);
    }
  }, [initialized, enabled, volume]);

  // Update volume for all gains
  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    
    if (!initialized) return;
    
    // Update all gain nodes
    gains.current.forEach(gain => {
      gain.gain.setTargetAtTime(0, audioContext.current!.currentTime, 0.1);
    });
    
    if (ambientGain.current) {
      // Keep ambient sound going at the new volume if it was already playing
      const currentAmbientVolume = ambientGain.current.gain.value;
      if (currentAmbientVolume > 0) {
        ambientGain.current.gain.setTargetAtTime(
          newVolume * 0.15, // Keep ambient sound subtle
          audioContext.current!.currentTime,
          0.2
        );
      }
    }
    
    // Update intent wave gains
    intentWaveGains.current.forEach(gain => {
      const currentValue = gain.gain.value;
      if (currentValue > 0) {
        gain.gain.setTargetAtTime(
          currentValue * (newVolume / volume), // Scale by ratio of new to old volume
          audioContext.current!.currentTime,
          0.1
        );
      }
    });
  }, [initialized, volume]);

  // Play a specific sound effect
  const playSound = useCallback((soundType: string, options: SoundOptions = {}) => {
    if (!initialized || !enabled) return;
    
    const { intensity = 0.5, complexity = 0.5 } = options;
    
    try {
      // Select oscillator based on sound type
      let oscillatorIndex = 0;
      let frequency = 440;
      let duration = 0.3;
      let maxGain = 0.3 * volume;
      
      switch (soundType) {
        case 'creation':
          oscillatorIndex = 0;
          frequency = 880 + (Math.random() * 220);
          duration = 0.2;
          maxGain = 0.2 * volume;
          break;
          
        case 'interaction':
          oscillatorIndex = 1;
          frequency = 330 + (intensity * 220);
          duration = 0.3;
          maxGain = 0.15 * volume;
          break;
          
        case 'fluctuation':
          oscillatorIndex = 2;
          frequency = 220 + (intensity * 110);
          duration = 0.5;
          maxGain = 0.1 * volume;
          break;
          
        case 'emergence':
          oscillatorIndex = 3;
          frequency = 165 + (complexity * 440);
          duration = 0.8;
          maxGain = 0.25 * volume;
          break;
          
        case 'cosmicBell':
          oscillatorIndex = 4;
          frequency = 220 + (intensity * 440);
          duration = 1.2;
          maxGain = 0.3 * volume;
          break;
          
        case 'gravitationalWave':
          oscillatorIndex = 0;
          frequency = 110 + (intensity * 110);
          duration = 2.0;
          maxGain = 0.2 * volume;
          break;
      }
      
      // Apply the sound
      const oscillator = oscillators.current[oscillatorIndex];
      const gain = gains.current[oscillatorIndex];
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.current!.currentTime);
      
      // Attack
      gain.gain.setValueAtTime(0, audioContext.current!.currentTime);
      gain.gain.linearRampToValueAtTime(maxGain, audioContext.current!.currentTime + 0.01);
      
      // Decay
      gain.gain.setTargetAtTime(0, audioContext.current!.currentTime + duration, 0.1);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [initialized, enabled, volume]);

  // Play ambient sounds (continuous)
  const playAmbientSound = useCallback((options: AmbientSoundOptions) => {
    if (!initialized || !enabled || !ambientOscillator.current || !ambientGain.current) return;
    
    const { type, intensity = 0.5, complexity = 0.5 } = options;
    
    try {
      let frequency = 55;
      let gainValue = 0.15 * volume;
      
      switch (type) {
        case 'intent_field':
          frequency = 55 + (complexity * 15);
          gainValue = 0.1 * volume;
          break;
        case 'cosmic_background':
          frequency = 65 + (intensity * 20);
          gainValue = 0.12 * volume;
          break;
        default:
          frequency = 55;
          gainValue = 0.1 * volume;
      }
      
      // Gradually transition to new frequency and volume
      ambientOscillator.current.frequency.setTargetAtTime(
        frequency,
        audioContext.current!.currentTime,
        0.5
      );
      
      ambientGain.current.gain.setTargetAtTime(
        gainValue,
        audioContext.current!.currentTime,
        0.5
      );
    } catch (error) {
      console.error("Error playing ambient sound:", error);
    }
  }, [initialized, enabled, volume]);

  // Play special celestial events
  const playCelestialEvent = useCallback((eventType: string, options: SoundOptions = {}) => {
    if (!initialized || !enabled) return;
    
    const { intensity = 0.5 } = options;
    
    try {
      switch (eventType) {
        case 'inflation':
          // Use multiple oscillators for a complex sound
          oscillators.current.forEach((osc, index) => {
            osc.frequency.setValueAtTime(
              220 * (index + 1) * (1 + Math.random() * 0.1),
              audioContext.current!.currentTime
            );
            
            const gain = gains.current[index];
            gain.gain.setValueAtTime(0, audioContext.current!.currentTime);
            gain.gain.linearRampToValueAtTime(
              0.1 * volume * (1 - index * 0.15),
              audioContext.current!.currentTime + 0.05
            );
            
            // Stagger the decay
            gain.gain.setTargetAtTime(
              0,
              audioContext.current!.currentTime + 0.2 + (index * 0.1),
              0.3
            );
          });
          break;
          
        case 'intent_field_collapse':
          // Downward sweep
          oscillators.current.slice(0, 3).forEach((osc, index) => {
            const startFreq = 880 - (index * 220);
            const endFreq = 110;
            
            osc.frequency.setValueAtTime(startFreq, audioContext.current!.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
              endFreq,
              audioContext.current!.currentTime + 1.5
            );
            
            const gain = gains.current[index];
            gain.gain.setValueAtTime(0, audioContext.current!.currentTime);
            gain.gain.linearRampToValueAtTime(
              0.15 * volume,
              audioContext.current!.currentTime + 0.1
            );
            gain.gain.setTargetAtTime(0, audioContext.current!.currentTime + 1.2, 0.3);
          });
          break;
      }
    } catch (error) {
      console.error("Error playing celestial event:", error);
    }
  }, [initialized, enabled, volume]);

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    if (!initialized) return;
    
    // Silence all oscillators
    gains.current.forEach(gain => {
      gain.gain.setTargetAtTime(0, audioContext.current!.currentTime, 0.1);
    });
    
    if (ambientGain.current) {
      ambientGain.current.gain.setTargetAtTime(0, audioContext.current!.currentTime, 0.1);
    }
    
    intentWaveGains.current.forEach(gain => {
      gain.gain.setTargetAtTime(0, audioContext.current!.currentTime, 0.1);
    });
  }, [initialized]);

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    setEnabled(prev => !prev);
    return !enabled;
  }, [enabled]);

  // Set up regular updates for intent wave audio
  useEffect(() => {
    if (!initialized || !enabled) return;
    
    const intervalId = setInterval(() => {
      updateIntentWaveAudio();
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [initialized, enabled, updateIntentWaveAudio]);

  // Clean up audio resources on unmount
  useEffect(() => {
    return () => {
      // Disconnect and stop all oscillators
      oscillators.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      
      if (ambientOscillator.current) {
        try {
          ambientOscillator.current.stop();
          ambientOscillator.current.disconnect();
        } catch (e) {}
      }
      
      intentWaveOscillators.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
    };
  }, []);

  return {
    initialized,
    initialize,
    updateVolume,
    playSound,
    playCelestialEvent,
    playAmbientSound,
    stopAllSounds,
    toggleAudio,
    intentWaveMetrics,
    exposedData: {
      intentWaveMetrics,
      isEnabled: enabled,
      volume
    }
  };
}

export default useSimpleAudio;
