
/**
 * Play looping background audio
 * @param url URL of the audio file
 * @param id ID to assign to the audio element
 * @param volume Volume level (0-1)
 */
export function playLoopingAudio(url: string, id: string, volume: number = 0.5): void {
  try {
    const audioElement = document.getElementById(id) as HTMLAudioElement || new Audio();
    
    if (!document.getElementById(id)) {
      audioElement.id = id;
      audioElement.loop = true;
      audioElement.volume = volume;
      document.body.appendChild(audioElement);
    }
    
    audioElement.src = url;
    audioElement.play().catch(e => console.error("Error playing audio:", e));
  } catch (e) {
    console.error("Error with looping audio:", e);
  }
}

/**
 * Stop looping background audio
 * @param id ID of the audio element to stop
 */
export function stopLoopingAudio(id: string): void {
  try {
    const audioElement = document.getElementById(id) as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  } catch (e) {
    console.error("Error stopping audio:", e);
  }
}

/**
 * Set volume for looping audio
 * @param id ID of the audio element
 * @param volume Volume level (0-1)
 */
export function setLoopingAudioVolume(id: string, volume: number): void {
  try {
    const audioElement = document.getElementById(id) as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = Math.min(Math.max(volume, 0), 1);
    }
  } catch (e) {
    console.error("Error setting audio volume:", e);
  }
}
