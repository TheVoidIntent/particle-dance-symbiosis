
import { toast } from "sonner";

/**
 * Utilities for generating audio content programmatically
 */

/**
 * Create a simple audio fallback if needed
 */
export const createFallbackAudioIfNeeded = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a more pleasing audio notification
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2); // Slide to A5
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.4); // Back to A4
    
    // Create a gain node to control volume and envelope
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start silent
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05); // Fade in
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + 0.35); // Hold
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5); // Fade out
    
    // Connect the oscillator to the gain node, then to the audio context destination
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and stop the oscillator
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    toast.info("Using generated audio tone (original audio unavailable)");
    
    return "Generated audio fallback";
  } catch (error) {
    console.error("Failed to create fallback audio:", error);
    return null;
  }
};

/**
 * Generate a sample audio for testing
 */
export const generateSampleAudio = () => {
  // Check if the Web Audio API is supported
  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    console.error("Web Audio API is not supported in this browser");
    return null;
  }
  
  try {
    // Create an offline audio context
    const offlineCtx = new OfflineAudioContext({
      numberOfChannels: 1,
      length: 44100 * 5, // 5 seconds
      sampleRate: 44100
    });
    
    // Create an oscillator
    const oscillator = offlineCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, 0); // A4
    oscillator.frequency.linearRampToValueAtTime(880, 2.5); // Ramp to A5 over 2.5 seconds
    oscillator.frequency.linearRampToValueAtTime(440, 5); // Back to A4
    
    // Create a gain node
    const gainNode = offlineCtx.createGain();
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.gain.linearRampToValueAtTime(0.7, 0.5); // Fade in
    gainNode.gain.setValueAtTime(0.7, 4);
    gainNode.gain.linearRampToValueAtTime(0, 5); // Fade out
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(offlineCtx.destination);
    
    // Start the oscillator
    oscillator.start(0);
    oscillator.stop(5);
    
    // Render the audio
    return offlineCtx.startRendering().then(renderedBuffer => {
      // Create a blob from the rendered buffer
      const audioData = renderAudioBufferToWav(renderedBuffer);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log("Generated sample audio:", audioUrl);
      toast.success("Generated sample audio successfully");
      
      return {
        url: audioUrl,
        revoke: () => URL.revokeObjectURL(audioUrl)
      };
    });
    
  } catch (error) {
    console.error("Error generating sample audio:", error);
    return null;
  }
};

/**
 * Helper function to convert AudioBuffer to WAV format
 */
function renderAudioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);
  
  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * 2 * numOfChan, true);
  view.setUint16(32, numOfChan * 2, true);
  view.setUint16(34, 16, true);
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write audio data
  const offset = 44;
  let pos = 0;
  
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const channelData = audioBuffer.getChannelData(i);
    
    for (let j = 0; j < channelData.length; j++, pos += 2) {
      const sample = Math.max(-1, Math.min(1, channelData[j]));
      view.setInt16(offset + pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
  }
  
  return buffer;
}

/**
 * Helper function to write strings to DataView
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
