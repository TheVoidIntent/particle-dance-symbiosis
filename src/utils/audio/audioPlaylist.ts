
import { playLoopingAudio, stopLoopingAudio, setLoopingAudioVolume } from './audioPlaybackUtils';

// Audio tracks playlist - using generated tones instead of WAV files
const audioTracks = [
  "Gentle Ambience",
  "Cosmic Flow",
  "Quantum Harmony",
  "Intent Waves",
  "Digital Serenity"
];

// We'll use the Web Audio API to generate tones instead of using the problematic files
let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

let currentTrackIndex = 0;
let isPlaying = false;
let lastPlayAttemptTime = 0;
const MIN_PLAY_INTERVAL_MS = 5000; // Minimum time between play attempts

/**
 * Initialize Web Audio API components
 */
function initAudio() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
    }
  } catch (error) {
    console.error("Error initializing audio context:", error);
  }
}

/**
 * Generate a tone with the given parameters
 * @param type Type of oscillator
 * @param frequency Base frequency
 * @param detune Detune amount
 */
function generateTone(type: OscillatorType = 'sine', frequency: number = 220, detune: number = 0) {
  try {
    if (!audioContext || !gainNode) {
      initAudio();
    }
    
    // Stop any existing oscillator
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
    }
    
    if (!audioContext || !gainNode) return;
    
    // Create and configure new oscillator
    oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.detune.setValueAtTime(detune, audioContext.currentTime);
    
    // Apply smooth fade-in
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 2);
    
    // Connect and start
    oscillator.connect(gainNode);
    oscillator.start();
  } catch (error) {
    console.error("Error generating tone:", error);
  }
}

/**
 * Start playing the audio playlist continuously
 */
export function startAudioPlaylist(volume: number = 0.5): void {
  try {
    initAudio();
    isPlaying = true;
    setVolumeDirectly(volume);
    playCurrentTrack();
  } catch (error) {
    console.error("Error starting audio playlist:", error);
  }
}

/**
 * Stop the audio playlist
 */
export function stopAudioPlaylist(): void {
  try {
    if (oscillator) {
      // Fade out before stopping
      if (gainNode && audioContext) {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        
        setTimeout(() => {
          if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
          }
        }, 1000);
      }
    }
    isPlaying = false;
  } catch (error) {
    console.error("Error stopping audio playlist:", error);
  }
}

/**
 * Set the volume directly through gain node
 */
function setVolumeDirectly(volume: number): void {
  try {
    if (gainNode && audioContext) {
      const clampedVolume = Math.min(Math.max(volume, 0), 1);
      gainNode.gain.linearRampToValueAtTime(clampedVolume * 0.2, audioContext.currentTime + 0.5);
    }
  } catch (error) {
    console.error("Error setting audio volume directly:", error);
  }
}

/**
 * Set the volume for the audio playlist
 */
export function setAudioPlaylistVolume(volume: number): void {
  try {
    setVolumeDirectly(volume);
  } catch (error) {
    console.error("Error setting audio volume:", error);
  }
}

/**
 * Play the next track in the playlist
 */
function playNextTrack(): void {
  try {
    if (!isPlaying) return;
    
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    
    // Add a delay before playing the next track to prevent rapid switching
    setTimeout(() => {
      playCurrentTrack();
    }, 1000);
  } catch (error) {
    console.error("Error playing next track:", error);
  }
}

/**
 * Play the current track (generates appropriate tone pattern)
 */
function playCurrentTrack(): void {
  try {
    if (!isPlaying) return;
    
    const now = Date.now();
    if (now - lastPlayAttemptTime < MIN_PLAY_INTERVAL_MS) {
      // If we tried to play a track too recently, delay this attempt
      setTimeout(playCurrentTrack, MIN_PLAY_INTERVAL_MS);
      return;
    }
    
    lastPlayAttemptTime = now;
    const trackName = audioTracks[currentTrackIndex];
    
    console.log("Now playing:", trackName);
    
    // Generate different tones based on track name
    switch (trackName) {
      case "Gentle Ambience":
        generateTone('sine', 220, 0);
        break;
      case "Cosmic Flow":
        generateTone('sine', 294, 10);
        break;
      case "Quantum Harmony":
        generateTone('triangle', 330, 5);
        break;
      case "Intent Waves":
        generateTone('sine', 392, 15);
        break;
      case "Digital Serenity":
        generateTone('sine', 440, 0);
        break;
      default:
        generateTone('sine', 220, 0);
    }
    
    // Schedule switching to the next track after some time
    setTimeout(playNextTrack, 30000); // 30 seconds per track
  } catch (error) {
    console.error("Error playing current track:", error);
    // Attempt recovery by trying the next track
    setTimeout(playNextTrack, 3000);
  }
}

/**
 * Toggle play/pause of the audio playlist
 */
export function toggleAudioPlaylist(): boolean {
  try {
    if (isPlaying) {
      stopAudioPlaylist();
    } else {
      startAudioPlaylist();
    }
    return isPlaying;
  } catch (error) {
    console.error("Error toggling audio playlist:", error);
    return false;
  }
}

/**
 * Check if the audio playlist is currently playing
 */
export function isAudioPlaylistPlaying(): boolean {
  return isPlaying;
}

/**
 * Get the name of the currently playing track
 */
export function getCurrentTrackName(): string {
  return audioTracks[currentTrackIndex] || "Unknown Track";
}
