
import { playLoopingAudio, stopLoopingAudio, setLoopingAudioVolume } from './audioPlaybackUtils';

// Audio tracks playlist - focused on LM audio tracks only
const audioTracks = [
  "Intent as a Universal Information Filter",
  "The Intentional Universe",
  "Particle Genesis",
  "The Map",
  "The Nexus",
  "From The Heart",
  "In Deep Waters",
  "The Why",
  "The Composer",
  "The Source"
];

let currentTrackIndex = 0;
let isPlaying = false;
let audioElement: HTMLAudioElement | null = null;
let lastPlayAttemptTime = 0;
const MIN_PLAY_INTERVAL_MS = 5000; // Increased minimum time between play attempts to 5 seconds

/**
 * Start playing the audio playlist continuously
 */
export function startAudioPlaylist(volume: number = 0.5): void {
  try {
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.volume = volume;
      
      // When one audio track ends, play the next one
      audioElement.addEventListener('ended', playNextTrack);
      
      // Handle errors
      audioElement.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        // Try the next track if there's an error, but with a longer delay
        setTimeout(playNextTrack, 3000);
      });
    }
    
    isPlaying = true;
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
    if (audioElement) {
      audioElement.pause();
      isPlaying = false;
    }
  } catch (error) {
    console.error("Error stopping audio playlist:", error);
  }
}

/**
 * Set the volume for the audio playlist
 */
export function setAudioPlaylistVolume(volume: number): void {
  try {
    if (audioElement) {
      audioElement.volume = Math.min(Math.max(volume, 0), 1);
    }
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
 * Play the current track
 */
function playCurrentTrack(): void {
  try {
    if (!audioElement || !isPlaying) return;
    
    const now = Date.now();
    if (now - lastPlayAttemptTime < MIN_PLAY_INTERVAL_MS) {
      // If we tried to play a track too recently, delay this attempt significantly
      setTimeout(playCurrentTrack, MIN_PLAY_INTERVAL_MS);
      return;
    }
    
    lastPlayAttemptTime = now;
    const trackName = audioTracks[currentTrackIndex];
    
    // Use a consistent file naming pattern for LM audio files
    // We'll use files from qfplS_1.wav to qfplS_20.wav
    const fileIndex = (currentTrackIndex % 20) + 1;
    const audioUrl = `/audio/qfplS_${fileIndex}.wav`;
    
    console.log("Attempting to play:", trackName, "from", audioUrl);
    
    // Stop any existing audio before loading the new one
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = audioUrl;
    
    // Use a promise to handle playback errors more gracefully
    audioElement.play().then(() => {
      console.log("Now playing:", trackName);
    }).catch(e => {
      console.error("Error playing track:", trackName, e);
      // Try the next track if there's an error, with a longer delay
      setTimeout(playNextTrack, 3000);
    });
  } catch (error) {
    console.error("Error playing current track:", error);
    // Attempt recovery by trying the next track after a longer delay
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
