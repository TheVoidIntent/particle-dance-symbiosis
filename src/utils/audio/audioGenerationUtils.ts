
import { toast } from "sonner";

/**
 * Utilities for generating audio content
 */

// Create a simple audio fallback when needed
export const createFallbackAudioIfNeeded = () => {
  try {
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      console.error("Web Audio API not supported in this browser");
      toast.error("Audio not supported in your browser");
      return;
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for tone generation
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // sine wave — other values are 'square', 'sawtooth', 'triangle'
    oscillator.frequency.value = 440; // value in hertz
    
    // Create gain node to control volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1; // 10% volume
    
    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set up envelope (fade in/out)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    
    // Start and stop
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.1);
    
    console.log("Generated fallback audio tone");
    
  } catch (error) {
    console.error("Error generating fallback audio:", error);
  }
};

// Generate a sample audio for testing
export const generateSampleAudio = (duration = 1, type = 'sine', frequency = 440, volume = 0.2) => {
  try {
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      console.error("Web Audio API not supported in this browser");
      toast.error("Audio not supported in your browser");
      return;
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = type as OscillatorType;
    oscillator.frequency.value = frequency;
    
    // Create gain node
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    
    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    // Start and stop
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.1);
    
    console.log("Generated sample audio tone");
    
  } catch (error) {
    console.error("Error generating sample audio:", error);
  }
};
