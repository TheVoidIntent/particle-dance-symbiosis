
import { useState, useEffect, useRef, useCallback } from 'react';

interface SoundOptions {
  intensity?: number;
  complexity?: number;
  pitch?: number;
  duration?: number;
  weight?: number;
  informationDensity?: number;
}

interface AmbientSoundOptions {
  type: 'intent_field' | 'cosmic_background' | 'quantum_fluctuations';
  intensity: number;
  complexity: number;
}

export function useSimpleAudio(autoInit = true, initialVolume = 0.5) {
  const [initialized, setInitialized] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const ambientOscillators = useRef<{osc: OscillatorNode, gain: GainNode}[]>([]);
  
  // Initialize the audio context
  const initialize = useCallback(() => {
    if (initialized) return;
    
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain.current = audioContext.current.createGain();
      masterGain.current.gain.value = volume;
      masterGain.current.connect(audioContext.current.destination);
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing audio context:", error);
    }
  }, [initialized, volume]);
  
  // Initialize on mount if autoInit is true
  useEffect(() => {
    if (autoInit) {
      initialize();
    }
    
    return () => {
      stopAllSounds();
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, [autoInit, initialize]);
  
  // Update master volume
  const updateVolume = useCallback((newVolume: number) => {
    if (!initialized || !masterGain.current) return;
    
    setVolume(newVolume);
    masterGain.current.gain.value = newVolume;
  }, [initialized]);
  
  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    // Stop ambient oscillators
    ambientOscillators.current.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {
        // Ignore disconnection errors
      }
    });
    ambientOscillators.current = [];
  }, []);
  
  // Play a specific sound effect
  const playSound = useCallback((soundType: string, options: SoundOptions = {}) => {
    if (!initialized || !audioContext.current || !masterGain.current) {
      initialize();
      if (!audioContext.current || !masterGain.current) return;
    }
    
    try {
      const currentTime = audioContext.current.currentTime;
      
      // Configure sound based on type
      let oscillator = audioContext.current.createOscillator();
      let gainNode = audioContext.current.createGain();
      
      switch (soundType) {
        case 'cosmicBell':
          // Bell-like sound for events
          oscillator.type = 'sine';
          oscillator.frequency.value = 150 + (options.pitch || 0) * 200;
          
          // Bell envelope
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.4 * volume, currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + (options.duration || 1.5));
          
          // Connect and play
          oscillator.connect(gainNode);
          gainNode.connect(masterGain.current);
          oscillator.start();
          oscillator.stop(currentTime + (options.duration || 1.5));
          break;
          
        case 'fluctuation':
          // Quantum fluctuation sounds
          oscillator.type = 'sine';
          oscillator.frequency.value = 220 + Math.random() * 880;
          
          // Short envelope
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1 * volume, currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.2);
          
          // Connect and play
          oscillator.connect(gainNode);
          gainNode.connect(masterGain.current);
          oscillator.start();
          oscillator.stop(currentTime + 0.3);
          break;
          
        default:
          // Generic sound
          oscillator.type = 'sine';
          oscillator.frequency.value = 440;
          
          // Simple envelope
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2 * volume, currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
          
          // Connect and play
          oscillator.connect(gainNode);
          gainNode.connect(masterGain.current);
          oscillator.start();
          oscillator.stop(currentTime + 0.6);
      }
    } catch (error) {
      console.error(`Error playing ${soundType} sound:`, error);
    }
  }, [initialize, initialized, volume]);
  
  // Play a celestial event sound
  const playCelestialEvent = useCallback((eventType: string, options: SoundOptions = {}) => {
    if (!initialized || !audioContext.current || !masterGain.current) {
      initialize();
      if (!audioContext.current || !masterGain.current) return;
    }
    
    try {
      const currentTime = audioContext.current.currentTime;
      const intensity = options.intensity || 0.5;
      
      switch (eventType) {
        case 'inflation':
          // Cosmic inflation - rising sweep
          const sweepOsc = audioContext.current.createOscillator();
          const sweepGain = audioContext.current.createGain();
          
          sweepOsc.type = 'sine';
          sweepOsc.frequency.setValueAtTime(100, currentTime);
          sweepOsc.frequency.exponentialRampToValueAtTime(800, currentTime + 2 * intensity);
          
          sweepGain.gain.setValueAtTime(0, currentTime);
          sweepGain.gain.linearRampToValueAtTime(0.2 * volume * intensity, currentTime + 0.1);
          sweepGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 2.5 * intensity);
          
          sweepOsc.connect(sweepGain);
          sweepGain.connect(masterGain.current);
          sweepOsc.start();
          sweepOsc.stop(currentTime + 3 * intensity);
          break;
          
        case 'intent_field_collapse':
          // Intent field collapse - falling tone
          const collapseOsc = audioContext.current.createOscillator();
          const collapseGain = audioContext.current.createGain();
          
          collapseOsc.type = 'sine';
          collapseOsc.frequency.setValueAtTime(600, currentTime);
          collapseOsc.frequency.exponentialRampToValueAtTime(100, currentTime + 1.5 * intensity);
          
          collapseGain.gain.setValueAtTime(0, currentTime);
          collapseGain.gain.linearRampToValueAtTime(0.15 * volume * intensity, currentTime + 0.1);
          collapseGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 2 * intensity);
          
          collapseOsc.connect(collapseGain);
          collapseGain.connect(masterGain.current);
          collapseOsc.start();
          collapseOsc.stop(currentTime + 2.5 * intensity);
          break;
          
        default:
          // Generic celestial event
          playSound('cosmicBell', { intensity, duration: 1 });
      }
    } catch (error) {
      console.error(`Error playing celestial event ${eventType}:`, error);
    }
  }, [initialize, initialized, playSound, volume]);
  
  // Play ambient background sound
  const playAmbientSound = useCallback((options: AmbientSoundOptions) => {
    if (!initialized || !audioContext.current || !masterGain.current) {
      initialize();
      if (!audioContext.current || !masterGain.current) return;
    }
    
    // Clear any existing ambient sounds
    stopAllSounds();
    
    try {
      const { type, intensity, complexity } = options;
      const layerCount = Math.floor(2 + complexity * 4); // 2-6 layers based on complexity
      
      for (let i = 0; i < layerCount; i++) {
        const layerIntensity = intensity * (0.7 + Math.random() * 0.3); // Slight intensity variation
        const baseFreq = 
          type === 'intent_field' ? 100 + i * 50 :
          type === 'cosmic_background' ? 50 + i * 30 :
          150 + i * 80; // For quantum_fluctuations
          
        const osc = audioContext.current.createOscillator();
        const gain = audioContext.current.createGain();
        
        // Set oscillator type and frequency
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = baseFreq * (0.9 + Math.random() * 0.2); // Slight frequency variation
        
        // Add slight detuning for complexity
        osc.detune.value = (i - layerCount/2) * 10 * complexity;
        
        // Set gain value based on layer and intensity
        const layerVolume = (0.08 / layerCount) * volume * layerIntensity * (1 - i/layerCount * 0.5);
        gain.gain.value = layerVolume;
        
        // If this is an intent field, add subtle pulsing
        if (type === 'intent_field') {
          const pulseRate = 0.05 + Math.random() * 0.1; // Different pulse rate for each layer
          gain.gain.setValueAtTime(layerVolume, audioContext.current.currentTime);
          
          // Create a repeating pulse effect using a waveshaper
          setInterval(() => {
            if (gain.gain) {
              const time = audioContext.current?.currentTime || 0;
              gain.gain.cancelScheduledValues(time);
              gain.gain.setValueAtTime(gain.gain.value, time);
              gain.gain.linearRampToValueAtTime(
                layerVolume * (0.85 + Math.random() * 0.3), 
                time + pulseRate
              );
            }
          }, 2000);
        }
        
        // Connect and start
        osc.connect(gain);
        gain.connect(masterGain.current);
        osc.start();
        
        // Store for later cleanup
        ambientOscillators.current.push({ osc, gain });
      }
    } catch (error) {
      console.error("Error playing ambient sound:", error);
    }
  }, [initialize, initialized, stopAllSounds, volume]);
  
  // Export audio data for saving
  const exportAudioData = useCallback(() => {
    return {
      volume,
      ambientOscillatorCount: ambientOscillators.current.length,
      timestamp: new Date().toISOString()
    };
  }, [volume]);
  
  return {
    initialized,
    initialize,
    updateVolume,
    playSound,
    playCelestialEvent,
    playAmbientSound,
    stopAllSounds,
    exportAudioData
  };
}
