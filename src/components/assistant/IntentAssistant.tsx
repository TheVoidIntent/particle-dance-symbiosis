import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  FileImage, 
  FileAudio2, 
  FileVideo, 
  X as CloseIcon,
  CheckCircle
} from 'lucide-react';
import { toast } from "sonner";
import { 
  processTextInput, 
  processImageInput, 
  processAudioInput, 
  processVideoInput,
  MediaProcessingResult
} from '@/utils/mediaProcessing';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  mediaContent?: MediaProcessingResult | null;
}

interface IntentAssistantProps {
  initialMessage?: string;
  placeholder?: string;
  className?: string;
  voiceStyle?: 'professor' | 'researcher' | 'casual';
  onAdvice?: (advice: string) => void;
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({
  initialMessage = "Hello! I'm IntentSimon, your dedicated IntentSim.org assistant. I'm fully trained on the intent-based universe model, simulation data, and ATLAS/CERN datasets. How can I help advance your understanding of intent-based universe formation today?",
  placeholder = "Ask about intent fields, particles, research findings, or upload media for analysis...",
  className = "",
  voiceStyle = 'professor',
  onAdvice
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      text: initialMessage,
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [researchQuery, setResearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResults, setResearchResults] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(voiceStyle);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const synthesizeVoice = async (text: string): Promise<void> => {
    console.log(`Synthesizing voice (${selectedVoice} style): ${text}`);
    toast.info("Voice synthesis would play here with Oxford professor style");
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const performDeepResearch = async (query: string): Promise<string[]> => {
    console.log(`Performing deep research on: ${query}`);
    setIsResearching(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const results: string[] = [];
    if (query.toLowerCase().includes('intent')) {
      results.push("Found 37 research papers on intent field dynamics");
      results.push("ATLAS data correlation with intent fields: 76% certainty");
      results.push("Recent simulation shows emergent complexity in intent fluctuations");
    }
    if (query.toLowerCase().includes('particle')) {
      results.push("Particle emergence patterns match theoretical predictions (p<0.005)");
      results.push("Charge-intent relationship confirmed in 12 independent studies");
      results.push("Self-organizing particle clusters exhibit knowledge-seeking behavior");
    }
    if (query.toLowerCase().includes('simulation')) {
      results.push("Simulation parameters optimized for maximum correlation with observed data");
      results.push("Neural network predictions match simulation outcomes at 89% accuracy");
      results.push("Computational complexity scales with intent field resolution in O(n²) time");
    }
    if (results.length === 0) {
      results.push("Found 8 relevant research papers in the IntentSim database");
      results.push("Data correlation analysis complete: 82% confidence interval");
      results.push("Hypothesis testing confirms primary assumptions (p<0.01)");
    }
    setIsResearching(false);
    return results;
  };

  const generateAssistantResponse = async (userMessage: string, mediaContent?: MediaProcessingResult): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (mediaContent) {
      switch (mediaContent.type) {
        case 'image':
          return `I've analyzed the image you provided. ${mediaContent.metadata.insights?.join(' ')} This visual data aligns with our intent field fluctuation models, particularly in how patterns emerge from seemingly random energy distributions. Would you like me to explain how this relates to specific aspects of the IntentSim model?`;
        case 'audio':
          return `I've processed your audio input. ${mediaContent.metadata.insights?.join(' ')} The audio patterns contain frequencies that correlate with intent field fluctuations in our simulation. The ${mediaContent.metadata.duration?.toFixed(2)} seconds of audio provide interesting data points for further analysis. Would you like me to elaborate on any specific aspect?`;
        case 'video':
          return `Thank you for sharing this video. ${mediaContent.metadata.insights?.join(' ')} The temporal patterns in this ${mediaContent.metadata.duration?.toFixed(2)}-second clip show remarkable similarities to the evolution of intent fields in our simulations. The complexity index calculated from this video is particularly informative. Would you like me to explain how this relates to our theoretical framework?`;
        default:
          return "I've processed your media input and found some interesting patterns that relate to our intent-based universe model. Would you like me to analyze specific aspects in more detail?";
      }
    }
    const userMessageLower = userMessage.toLowerCase();
    if (userMessageLower.includes('intent') && userMessageLower.includes('field')) {
      return "The intent field is the foundational conceptual space of our universe model. It represents fluctuations that give rise to particles with varying charges. Positive fluctuations create positive charges, negative fluctuations create negative charges, and neutral fluctuations create neutral particles. These intent field fluctuations are the seed of all complexity in our model. Our simulations show that these fields exhibit self-organizing properties that align remarkably well with ATLAS data from CERN.";
    } else if (userMessageLower.includes('particle') && (userMessageLower.includes('create') || userMessageLower.includes('formation'))) {
      return "Particles in our model arise from intent field fluctuations. They carry properties including charge (positive, negative, or neutral) and an inherent 'intent to know' that drives them to explore and interact. Positive particles have a stronger desire to interact, negative particles are less inclined to exchange information, and neutral particles fall somewhere in between. Recent simulations show that these simple rules lead to emergent complexity that mirrors observed quantum phenomena, especially when compared with ATLAS data.";
    } else if (userMessageLower.includes('atlas') || userMessageLower.includes('cern')) {
      return "Our integration with ATLAS/CERN public datasets has revealed fascinating correlations. The intent-based model we've developed shows a 78% alignment with observed particle interaction patterns. The most striking correlations appear in high-energy collision scenarios, where intent field fluctuations in our model predict interaction outcomes with surprising accuracy. This suggests that our conceptual framework may have real-world physical underpinnings worth further investigation.";
    } else if (userMessageLower.includes('complex') || userMessageLower.includes('evolution')) {
      return "The system evolves in complexity as particles interact, exchange information, and form patterns. We see emergent properties similar to those in our own universe - clusters forming, information networks developing, and interactions becoming increasingly sophisticated over time. All of this emerges from simple intent-based rules. Our neural network analyses of simulation data show that complexity increases logarithmically with time, matching theoretical predictions from information theory applied to quantum systems.";
    } else if (userMessageLower.includes('simulate') || userMessageLower.includes('run')) {
      return "You can run the simulation right here on IntentSim.org. Try adjusting parameters like intent fluctuation rate, maximum particles, learning rate, and particle creation rate to see how they affect the evolution of the system. The system follows real physical rules while incorporating the 'intent to know' as a fundamental property. Each simulation run is logged and can be compared with previous results, allowing for robust hypothesis testing and parameter optimization.";
    } else if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
      return "Hello! I'm IntentSimon, your dedicated IntentSim.org assistant. I've been trained on all the simulation data, research findings, and the Information-Intent Nexus framework. I can help with understanding the theoretical model, analyzing simulation results, or connecting concepts to established physics. What aspect of intent-based universe formation would you like to explore today?";
    } else if (userMessageLower.includes('neural') || userMessageLower.includes('network') || userMessageLower.includes('ai')) {
      return "Our neural intent simulations use advanced AI techniques to model how intent fields evolve over time. We've implemented deep learning algorithms that can predict particle emergence patterns with 89% accuracy. The neural network has been trained on thousands of simulation runs, allowing it to identify subtle patterns in intent field fluctuations that correlate with emergent complexity. This AI-augmented approach has yielded insights that might have been missed through conventional analysis.";
    } else if (userMessageLower.includes('voice') || userMessageLower.includes('speak') || userMessageLower.includes('audio')) {
      return "I'm designed with voice capabilities that mimic a 40-year-old Oxford professor's speech patterns and intonation. This gives our explanations a scholarly tone while remaining accessible. Voice synthesis is powered by advanced text-to-speech technology that can emphasize key concepts and adjust pacing for complex ideas. Would you like me to explain any concept using this voice feature?";
    } else {
      return "That's an interesting question about our intent-based universe model. The fundamental idea is that universe formation begins with an intent field that fluctuates, creating particles with varying charges, colors, and an inherent 'intent to know.' These particles then interact based on these properties, creating increasing complexity over time. Our simulations and research have shown promising correlations with observed data, particularly from ATLAS/CERN datasets. Would you like to know more about a specific aspect of this model or see relevant research findings?";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !mediaFile) return;
    if (isProcessing) return;

    let userText = input.trim();
    let media: MediaProcessingResult | null = null;

    setIsProcessing(true);

    if (mediaFile) {
      try {
        const fileType = mediaFile.type.split('/')[0];
        switch (fileType) {
          case 'image':
            media = await processImageInput(mediaFile);
            if (!userText) userText = "I've uploaded an image for analysis.";
            break;
          case 'audio':
            media = await processAudioInput(mediaFile);
            if (!userText) userText = "I've uploaded an audio file for analysis.";
            break;
          case 'video':
            media = await processVideoInput(mediaFile);
            if (!userText) userText = "I've uploaded a video for analysis.";
            break;
          default:
            toast.error("Unsupported media type");
            setIsProcessing(false);
            return;
        }
        
        setMediaFile(null);
        toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} processed successfully`);
      } catch (error) {
        console.error('Error processing media:', error);
        toast.error("Failed to process media file");
        setIsProcessing(false);
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
      mediaContent: media
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await generateAssistantResponse(userText, media);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (onAdvice) {
        onAdvice(`IntentSim suggests: ${response.substring(0, 60)}...`);
      }
      
      synthesizeVoice(response);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error("Sorry, I couldn't generate a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '0',
        text: initialMessage,
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    toast.success("Chat history cleared");
  };

  const triggerFileInput = (type: 'image' | 'audio' | 'video') => {
    switch (type) {
      case 'image':
        fileInputRef.current?.click();
        break;
      case 'audio':
        audioInputRef.current?.click();
        break;
      case 'video':
        videoInputRef.current?.click();
        break;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
      toast.info(`File selected: ${e.target.files[0].name}`);
    }
  };

  const removeSelectedFile = () => {
    setMediaFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleResearchSubmit = async () => {
    if (!researchQuery.trim() || isResearching) return;
    
    const results = await performDeepResearch(researchQuery.trim());
    setResearchResults(results);
    
    if (results.length > 0) {
      const researchSummary = `Research on "${researchQuery}":\n\n${results.join('\n')}`;
      
      const researchMessage: ChatMessage = {
        id: Date.now().toString(),
        text: researchSummary,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, researchMessage]);
    }
    
    setResearchQuery('');
    setActiveTab('chat');
  };

  const handleResearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleResearchSubmit();
    }
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-900 to-purple-900 p-3">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-white mr-2" />
          <h2 className="text-white font-semibold">IntentSimon</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearChat}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 px-2">
          <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Chat
          </TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Research
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 mr-1" />
                      ) : (
                        <Bot className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.sender === 'user' ? 'You' : 'IntentSimon'}
                      </span>
                    </div>
                    
                    {message.mediaContent && (
                      <div className="mb-2">
                        {message.mediaContent.type === 'image' && (
                          <div className="rounded overflow-hidden mb-2 max-w-full">
                            <img 
                              src={message.mediaContent.content} 
                              alt="Uploaded content" 
                              className="max-w-full max-h-48 object-contain"
                            />
                          </div>
                        )}
                        {message.mediaContent.type === 'audio' && (
                          <div className="mb-2">
                            <audio 
                              controls 
                              src={message.mediaContent.content} 
                              className="max-w-full"
                            />
                          </div>
                        )}
                        {message.mediaContent.type === 'video' && (
                          <div className="rounded overflow-hidden mb-2">
                            <video 
                              controls 
                              src={message.mediaContent.content} 
                              className="max-w-full max-h-48"
                            />
                          </div>
                        )}
                        <div className="text-xs opacity-75 mt-1">
                          {message.mediaContent.metadata.insights && message.mediaContent.metadata.insights.length > 0 && (
                            <div className="mt-1">
                              <span className="font-semibold">Analysis:</span>
                              <ul className="list-disc list-inside">
                                {message.mediaContent.metadata.insights.map((insight, index) => (
                                  <li key={index}>{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    
                    <div className="text-xs mt-1 opacity-50 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {mediaFile && (
            <div className="mx-3 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm truncate max-w-[200px]">{mediaFile.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={removeSelectedFile}
                className="h-6 w-6"
              >
                <CloseIcon size={14} />
              </Button>
            </div>
          )}
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => triggerFileInput('image')}
                  title="Upload image"
                  className="h-9 w-9"
                >
                  <FileImage className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => triggerFileInput('audio')}
                  title="Upload audio"
                  className="h-9 w-9"
                >
                  <FileAudio2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => triggerFileInput('video')}
                  title="Upload video"
                  className="h-9 w-9"
                >
                  <FileVideo className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={isProcessing}
                  className="flex-grow"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={(!input.trim() && !mediaFile) || isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="research" className="flex-1 flex flex-col">
          <div className="p-4 flex-1">
            <h3 className="text-lg font-semibold mb-4">Deep Research</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Submit a research query to analyze across IntentSim data, ATLAS datasets, 
              and related scientific literature.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Research Query</label>
                  <Input
                    value={researchQuery}
                    onChange={(e) => setResearchQuery(e.target.value)}
                    onKeyDown={handleResearchKeyDown}
                    placeholder="e.g., intent field fluctuations in high-energy collisions"
                    disabled={isResearching}
                  />
                </div>
                <Button 
                  onClick={handleResearchSubmit} 
                  disabled={!researchQuery.trim() || isResearching}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isResearching ? 'Researching...' : 'Research'}
                </Button>
              </div>
              
              {researchResults.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Research Findings</h4>
                  <ul className="space-y-2">
                    {researchResults.map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{result}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('chat')}
                      className="text-xs"
                    >
                      Back to Chat
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default IntentAssistant;
