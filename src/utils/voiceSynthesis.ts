
import { toast } from "sonner";

interface VoiceOptions {
  rate?: number;    // Speaking rate (0.1 to 10, default 1)
  pitch?: number;   // Voice pitch (0 to 2, default 1)
  volume?: number;  // Volume (0 to 1, default 1)
}

interface ElevenLabsVoiceOptions extends VoiceOptions {
  voiceId?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
}

// Use browser's built-in speech synthesis as fallback
class BrowserSpeechSynthesis {
  private static instance: BrowserSpeechSynthesis;
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private defaultOptions: VoiceOptions = {
    rate: 0.9,   // Slightly slower than default for professor-like pacing
    pitch: 0.9,  // Slightly deeper voice
    volume: 1.0  // Full volume
  };

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.setVoice();
  }

  public static getInstance(): BrowserSpeechSynthesis {
    if (!BrowserSpeechSynthesis.instance) {
      BrowserSpeechSynthesis.instance = new BrowserSpeechSynthesis();
    }
    return BrowserSpeechSynthesis.instance;
  }

  private setVoice() {
    // Get all available voices
    let voices = this.synthesis.getVoices();
    
    // If voices list is empty, wait for them to load
    if (voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        voices = this.synthesis.getVoices();
        this.selectAppropriateVoice(voices);
      });
    } else {
      this.selectAppropriateVoice(voices);
    }
  }

  private selectAppropriateVoice(voices: SpeechSynthesisVoice[]) {
    // Look for a deep male voice that sounds professorial
    // Prioritize en-GB voices for Oxford professor sound
    const britishMaleVoices = voices.filter(v => 
      v.lang.includes('en-GB') && v.name.toLowerCase().includes('male'));
    
    const anyBritishVoices = voices.filter(v => v.lang.includes('en-GB'));
    const anyMaleVoices = voices.filter(v => 
      v.name.toLowerCase().includes('male') || !v.name.toLowerCase().includes('female'));
    
    if (britishMaleVoices.length > 0) {
      this.voice = britishMaleVoices[0];
    } else if (anyBritishVoices.length > 0) {
      this.voice = anyBritishVoices[0];
    } else if (anyMaleVoices.length > 0) {
      this.voice = anyMaleVoices[0];
    } else if (voices.length > 0) {
      // Fallback to any available voice
      this.voice = voices[0];
    }
    
    console.log("Selected voice:", this.voice?.name);
  }

  public speak(text: string, options?: VoiceOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const mergedOptions = { ...this.defaultOptions, ...options };
        
        if (this.voice) {
          utterance.voice = this.voice;
        }
        
        utterance.rate = mergedOptions.rate || 1;
        utterance.pitch = mergedOptions.pitch || 1;
        utterance.volume = mergedOptions.volume || 1;
        
        utterance.onend = () => resolve();
        utterance.onerror = (err) => reject(err);
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        // Start speaking
        this.synthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis error:", error);
        reject(error);
      }
    });
  }

  public stop(): void {
    this.synthesis.cancel();
  }

  public pause(): void {
    this.synthesis.pause();
  }

  public resume(): void {
    this.synthesis.resume();
  }
}

// ElevenLabs voice synthesis for high-quality male Oxford professor voice
class ElevenLabsVoiceSynthesis {
  private static instance: ElevenLabsVoiceSynthesis;
  private apiKey: string | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private defaultOptions: ElevenLabsVoiceOptions = {
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // ElevenLabs "George" - a British male voice
    model: "eleven_multilingual_v2",
    stability: 0.5,
    similarityBoost: 0.75,
    rate: 0.9,
    pitch: 0.9
  };
  
  private constructor() {
    this.audioElement = new Audio();
  }
  
  public static getInstance(): ElevenLabsVoiceSynthesis {
    if (!ElevenLabsVoiceSynthesis.instance) {
      ElevenLabsVoiceSynthesis.instance = new ElevenLabsVoiceSynthesis();
    }
    return ElevenLabsVoiceSynthesis.instance;
  }
  
  public setApiKey(key: string): void {
    this.apiKey = key;
  }
  
  public hasApiKey(): boolean {
    return this.apiKey !== null && this.apiKey.trim() !== '';
  }
  
  public async speak(text: string, options?: ElevenLabsVoiceOptions): Promise<void> {
    if (!this.hasApiKey()) {
      throw new Error("ElevenLabs API key not set");
    }
    
    // Clear any existing audio
    this.stop();
    
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    try {
      // In a real implementation, this would call the ElevenLabs API
      // For now, we'll simulate the API call
      await this.simulateElevenLabsCall(text, mergedOptions);
      
      return new Promise((resolve, reject) => {
        if (this.audioElement) {
          this.audioElement.onended = () => resolve();
          this.audioElement.onerror = (e) => reject(e);
        } else {
          reject(new Error("Audio element not initialized"));
        }
      });
    } catch (error) {
      console.error("ElevenLabs voice synthesis error:", error);
      throw error;
    }
  }

  private async simulateElevenLabsCall(text: string, options: ElevenLabsVoiceOptions): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For simulation purposes, we'll use the browser's speech synthesis
    // but we'll mention it's a simulation
    toast.info("Simulating ElevenLabs premium voice", {
      description: "Using browser speech synthesis as a placeholder"
    });
    
    // Use browser speech synthesis as a placeholder
    return BrowserSpeechSynthesis.getInstance().speak(
      text, 
      { rate: options.rate, pitch: options.pitch, volume: options.volume }
    );
  }
  
  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    
    // Also stop any browser speech synthesis that might be running
    BrowserSpeechSynthesis.getInstance().stop();
  }
  
  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }
  
  public resume(): void {
    if (this.audioElement) {
      this.audioElement.play();
    }
  }
}

// Unified voice interface
export const VoiceSynthesis = {
  speak: async (text: string, useElevenLabs: boolean = true, options?: VoiceOptions | ElevenLabsVoiceOptions): Promise<void> => {
    try {
      if (useElevenLabs && ElevenLabsVoiceSynthesis.getInstance().hasApiKey()) {
        return ElevenLabsVoiceSynthesis.getInstance().speak(text, options as ElevenLabsVoiceOptions);
      } else {
        return BrowserSpeechSynthesis.getInstance().speak(text, options);
      }
    } catch (error) {
      console.error("Voice synthesis error:", error);
      toast.error("Failed to generate speech");
      
      // Fallback to browser speech synthesis
      if (useElevenLabs) {
        return BrowserSpeechSynthesis.getInstance().speak(text, options);
      }
      
      throw error;
    }
  },
  
  stop: (): void => {
    BrowserSpeechSynthesis.getInstance().stop();
    ElevenLabsVoiceSynthesis.getInstance().stop();
  },
  
  pause: (): void => {
    BrowserSpeechSynthesis.getInstance().pause();
    ElevenLabsVoiceSynthesis.getInstance().pause();
  },
  
  resume: (): void => {
    BrowserSpeechSynthesis.getInstance().resume();
    ElevenLabsVoiceSynthesis.getInstance().resume();
  },
  
  setElevenLabsApiKey: (key: string): void => {
    ElevenLabsVoiceSynthesis.getInstance().setApiKey(key);
    toast.success("ElevenLabs voice activated", {
      description: "Premium British male voice is now available"
    });
  }
};

export default VoiceSynthesis;
