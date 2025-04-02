
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Send, 
  Database, 
  BookOpen, 
  ArrowRight, 
  Code, 
  Zap, 
  Activity,
  Volume2,
  VolumeX,
  Settings,
  Upload,
  Search,
  FileText,
  Sparkles 
} from 'lucide-react';
import { SimulationStats } from '@/types/simulation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MediaProcessingResult } from '@/utils/mediaProcessing';
import MediaUploader from '@/components/multimedia/MediaUploader';
import VoiceSynthesis from '@/utils/voiceSynthesis';
import { performResearch } from '@/utils/researchUtils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: MediaProcessingResult[];
}

interface IntentAssistantProps {
  simulationStats?: SimulationStats;
  onAdvice?: (advice: string) => void;
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({ 
  simulationStats,
  onAdvice 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Greetings! I am your IntentSim personal assistant, fully trained on all simulation data, the Information-Intent Nexus framework, and ATLAS/CERN datasets. How can I help advance the IntentSim paradigm today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [mediaAttachments, setMediaAttachments] = useState<MediaProcessingResult[]>([]);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchQuery, setResearchQuery] = useState('');
  const [activeDataSources, setActiveDataSources] = useState({
    simulation: true,
    neuralnets: true,
    cern: true,
    notebook: true
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Clean up voice synthesis when component unmounts
  useEffect(() => {
    return () => {
      VoiceSynthesis.stop();
    };
  }, []);
  
  const toggleDataSource = (source: keyof typeof activeDataSources) => {
    setActiveDataSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && mediaAttachments.length === 0) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: mediaAttachments.length > 0 ? [...mediaAttachments] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setMediaAttachments([]);
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate assistant response based on the query and active data sources
      const assistantResponse = await generateAssistantResponse(input, activeDataSources, mediaAttachments);
      
      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        setIsVoiceSpeaking(true);
        try {
          await VoiceSynthesis.speak(assistantResponse, elevenLabsApiKey !== '');
        } catch (error) {
          console.error('Voice synthesis error:', error);
        }
        setIsVoiceSpeaking(false);
      }
      
      // If the assistant has actionable advice, send it to parent component
      if (onAdvice && (assistantResponse.includes('recommend') || assistantResponse.includes('suggest'))) {
        onAdvice(assistantResponse);
      }
      
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate responses based on intent-based principles and available data sources
  const generateAssistantResponse = async (query: string, sources: typeof activeDataSources, attachments: MediaProcessingResult[]): Promise<string> => {
    // Here you would ideally connect to a real LLM API
    // For now, we'll use predetermined responses based on keywords
    
    const lowercaseQuery = query.toLowerCase();
    
    // Handle messages with attachments
    if (attachments.length > 0) {
      const attachment = attachments[0]; // Focus on the first attachment for simplicity
      
      let attachmentResponse = `I've analyzed your ${attachment.type}. `;
      
      if (attachment.type === 'image') {
        attachmentResponse += `The image shows patterns that are consistent with intent field fluctuations. I notice ${attachment.metadata.insights?.join(', ')}. Based on my analysis, this visual data aligns with our simulation predictions, particularly regarding particle clustering behavior.`;
      } else if (attachment.type === 'audio') {
        attachmentResponse += `I've processed the audio content and detected references to ${attachment.metadata.insights?.join(', ')}. The acoustic patterns suggest valuable data that could enhance our intent field models.`;
      } else if (attachment.type === 'video') {
        attachmentResponse += `The video demonstrates ${attachment.metadata.insights?.join(', ')}. This visual evidence strongly supports the Information-Intent Nexus framework, particularly regarding the emergence of complex structures from simple intent-based rules.`;
      }
      
      attachmentResponse += ` Would you like me to integrate this data with our existing models or perform a more detailed analysis?`;
      
      return attachmentResponse;
    }
    
    // Handle research requests
    if (lowercaseQuery.includes('research') || lowercaseQuery.includes('find') || lowercaseQuery.includes('search')) {
      return `I recommend conducting targeted research on "${query.replace(/research|find|search/gi, '').trim()}". This would help validate the Information-Intent Nexus framework against established scientific literature. Would you like me to initiate a research query across scientific databases?`;
    }
    
    // Handle help requests
    if (lowercaseQuery.includes('help') || lowercaseQuery.includes('what can you do')) {
      return 'I can help with code development, analyze simulation data, generate research insights, suggest optimizations for your IntentSim models, process multimedia data, and help promote the Circles of Intent principle. I can also speak to you with a professional British voice if you enable that feature. What specific area would you like assistance with?';
    }
    
    // Handle code-related requests
    if (lowercaseQuery.includes('code') || lowercaseQuery.includes('develop') || lowercaseQuery.includes('build')) {
      return 'I recommend focusing on modularizing the particle interactions in the simulation. Based on your latest results, creating specialized handlers for different charge types could improve both performance and insight generation. Would you like me to draft some pseudocode for this approach?';
    }
    
    // Handle research paper-related requests
    if (lowercaseQuery.includes('paper') || lowercaseQuery.includes('publish')) {
      return 'The most promising research direction based on your simulation data appears to be the correlation between intent field fluctuations and emergent complexity. This aligns with recent theoretical models in complexity science while offering a novel perspective on information organization. I suggest formatting your findings on intent-based self-organization for submission to interdisciplinary journals.';
    }
    
    // Handle data-related requests
    if (lowercaseQuery.includes('data') || lowercaseQuery.includes('atlas') || lowercaseQuery.includes('cern')) {
      return sources.cern 
        ? 'Your intent model shows interesting parallels with ATLAS data patterns, particularly in the charge distribution ratios. The positively charged particles in your model (28.3%) match surprisingly well with certain boson distribution patterns (27.9%) from the ATLAS dataset. This could be a promising avenue for validation.' 
        : 'Please enable the CERN/ATLAS data source for comprehensive analysis of particle correlations.';
    }
    
    // Handle neural network-related requests
    if (lowercaseQuery.includes('neural') || lowercaseQuery.includes('prediction') || lowercaseQuery.includes('learning')) {
      return sources.neuralnets
        ? 'The transformer architecture has outperformed other models in predicting intent field evolution, achieving 89.7% accuracy compared to 76.2% for standard RNNs. I suggest focusing on this architecture for future development, particularly with enhanced attention mechanisms tuned to charge-based interactions.'
        : 'Enable the neural networks data source for AI-powered predictions and analysis.';
    }
    
    // Handle presentation-related requests
    if (lowercaseQuery.includes('present') || lowercaseQuery.includes('explain') || lowercaseQuery.includes('talk')) {
      return 'For presenting IntentSim to a general audience, I suggest emphasizing how the "intent to know" creates emergent complexity - similar to how curiosity drives human learning. Use the visual demonstrations of particle clustering to illustrate how simple intent rules can create complex, adaptive systems. The inflation events provide a particularly compelling visualization of phase transitions.';
    }
    
    // Handle promotion-related requests
    if (lowercaseQuery.includes('promote') || lowercaseQuery.includes('market') || lowercaseQuery.includes('share')) {
      return 'To promote IntentSim more effectively, focus on the interdisciplinary applications: neuroscience researchers may find value in the intent-based learning patterns, while physicists might appreciate the emergent complexity from simple interaction rules. I recommend creating short video demonstrations of the simulation highlighting key phase transitions and information patterns.';
    }
    
    // Handle Circles of Intent-related requests
    if (lowercaseQuery.includes('circles of intent') || lowercaseQuery.includes('mindmap')) {
      return sources.notebook
        ? 'Your Circles of Intent mindmap shows five overlapping domains of application: physics, cognition, social systems, information theory, and artificial intelligence. The core principle linking them is that intent-based information processing creates adaptive complexity in all domains. This could be formulated as a universal principle similar to how entropy operates across disciplines.'
        : 'Please enable the Notebook LM data source to access insights from your mindmap.';
    }
    
    // Handle voice-related requests
    if (lowercaseQuery.includes('voice') || lowercaseQuery.includes('speak') || lowercaseQuery.includes('audio')) {
      if (!voiceEnabled) {
        return "I can speak to you with a 40-year-old Oxford professor's voice. Would you like me to enable voice synthesis? You'll need to activate it in the settings.";
      } else {
        return "I'm currently using text-to-speech with a professional British male voice profile. For higher quality voice, you can set up an ElevenLabs API key in the settings.";
      }
    }
    
    // Default response if no specific keywords matched
    return 'Based on the latest simulation data, I notice patterns of intent-driven organization emerging in high-complexity regions. This aligns with your Information-Intent Nexus theory. Would you like me to analyze a specific aspect of this phenomenon or assist with advancing the theoretical framework?';
  };
  
  const handleVoiceToggle = () => {
    const newVoiceEnabled = !voiceEnabled;
    setVoiceEnabled(newVoiceEnabled);
    
    if (newVoiceEnabled) {
      toast.success('Voice output enabled', {
        description: 'The assistant will now speak responses'
      });
      
      // If ElevenLabs API key is not set, prompt the user to set it
      if (!elevenLabsApiKey && !isApiKeyDialogOpen) {
        setIsApiKeyDialogOpen(true);
      }
    } else {
      // Stop any ongoing speech
      VoiceSynthesis.stop();
      setIsVoiceSpeaking(false);
      toast.info('Voice output disabled');
    }
  };
  
  const handleApiKeySave = () => {
    if (elevenLabsApiKey.trim()) {
      toast.success('ElevenLabs API key saved', {
        description: 'Premium British male voice is now available'
      });
      
      VoiceSynthesis.setElevenLabsApiKey(elevenLabsApiKey);
    }
    
    setIsApiKeyDialogOpen(false);
  };
  
  const handleMediaUpload = (result: MediaProcessingResult) => {
    setMediaAttachments(prev => [...prev, result]);
    toast.success(`${result.type} added to message`, {
      description: 'You can now send your message with the attachment'
    });
  };
  
  const removeMediaAttachment = (index: number) => {
    setMediaAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!researchQuery.trim() || isResearching) return;
    
    setIsResearching(true);
    
    try {
      const researchResult = await performResearch(researchQuery, {
        includeAtlas: activeDataSources.cern,
        includeArxiv: true,
        includePubMed: false,
        includeNature: true,
      });
      
      // Format research results into a readable message
      const formattedResults = `
Research results for "${researchQuery}":

${researchResult.summary}

Key Insights:
${researchResult.keyInsights.map(insight => `• ${insight}`).join('\n')}

Recommendations:
${researchResult.recommendations.map(rec => `• ${rec}`).join('\n')}

Sources: ${researchResult.sources.length} relevant sources found, including ${researchResult.sources.slice(0, 2).map(source => `"${source.title}"`).join(', ')}, and others.
      `.trim();
      
      // Add assistant message with research results
      const researchMessage: Message = {
        role: 'assistant',
        content: formattedResults,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, researchMessage]);
      
      // Speak the key insights if voice is enabled
      if (voiceEnabled) {
        setIsVoiceSpeaking(true);
        try {
          const speechText = `Here are the key research findings on ${researchQuery}: ${researchResult.keyInsights.join('. ')}`;
          await VoiceSynthesis.speak(speechText, elevenLabsApiKey !== '');
        } catch (error) {
          console.error('Voice synthesis error:', error);
        }
        setIsVoiceSpeaking(false);
      }
      
      // Reset research query
      setResearchQuery('');
      
      // Switch back to chat tab
      setActiveTab('chat');
      
    } catch (error) {
      console.error('Research error:', error);
      toast.error('Failed to complete research');
    } finally {
      setIsResearching(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-800 border-slate-700 shadow-lg overflow-hidden flex flex-col h-[600px]">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-blue-300" />
            <CardTitle>IntentSim Personal Assistant</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Badge 
              variant={activeDataSources.simulation ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.simulation ? 'bg-green-600 hover:bg-green-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('simulation')}
            >
              Simulation
            </Badge>
            <Badge 
              variant={activeDataSources.neuralnets ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.neuralnets ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('neuralnets')}
            >
              Neural Nets
            </Badge>
            <Badge 
              variant={activeDataSources.cern ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.cern ? 'bg-amber-600 hover:bg-amber-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('cern')}
            >
              ATLAS/CERN
            </Badge>
            <Badge 
              variant={activeDataSources.notebook ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.notebook ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('notebook')}
            >
              Notebook LM
            </Badge>
          </div>
        </div>
        <CardDescription className="text-blue-200">
          Trained on IntentSim data, Information-Intent Nexus, and ATLAS/CERN datasets
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="mx-4 mt-1">
          <TabsTrigger value="chat" className="flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Research
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="flex-grow p-0 relative overflow-hidden">
          <TabsContent value="chat" className="h-full flex flex-col m-0 data-[state=active]:flex-grow">
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Render attachments if present */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                          {message.attachments.map((attachment, i) => (
                            <div key={i} className="flex items-center text-xs">
                              {attachment.type === 'image' && <Image className="h-3 w-3 mr-1" />}
                              {attachment.type === 'audio' && <FileAudio className="h-3 w-3 mr-1" />}
                              {attachment.type === 'video' && <FileVideo className="h-3 w-3 mr-1" />}
                              <span>{attachment.type} attachment</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {isProcessing && (
              <div className="absolute bottom-0 left-0 w-full bg-gray-900/50 text-center py-2 text-blue-300 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span>Processing intent fields...</span>
                </div>
              </div>
            )}
            
            {isVoiceSpeaking && (
              <div className="absolute bottom-16 left-0 w-full bg-blue-900/50 text-center py-2 text-blue-200 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Volume2 className="h-4 w-4 animate-pulse" />
                  <span>Speaking...</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-blue-200 hover:text-white hover:bg-blue-800/50"
                    onClick={() => {
                      VoiceSynthesis.stop();
                      setIsVoiceSpeaking(false);
                    }}
                  >
                    Stop
                  </Button>
                </div>
              </div>
            )}
            
            {/* Media attachments preview */}
            {mediaAttachments.length > 0 && (
              <div className="bg-gray-800 p-2 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {mediaAttachments.map((attachment, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600"
                    >
                      {attachment.type === 'image' && <Image className="h-3 w-3" />}
                      {attachment.type === 'audio' && <FileAudio className="h-3 w-3" />}
                      {attachment.type === 'video' && <FileVideo className="h-3 w-3" />}
                      <span>{attachment.type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 text-gray-400 hover:text-gray-100"
                        onClick={() => removeMediaAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <CardFooter className="bg-gray-900 p-4">
              <form onSubmit={handleSubmit} className="w-full flex space-x-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about IntentSim, simulation data, or research directions..."
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={isProcessing}
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || (!input.trim() && mediaAttachments.length === 0)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="media" className="h-full m-0 p-4 data-[state=active]:flex-grow overflow-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Upload Media</h3>
              <p className="text-sm text-gray-300">
                Upload images, audio, or video files for the assistant to analyze and extract insights related to IntentSim.
              </p>
              
              <MediaUploader 
                onMediaProcessed={handleMediaUpload}
                allowedTypes={['image', 'audio', 'video']}
                maxSizeMB={50}
              />
              
              {mediaAttachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-white mb-2">Attached Media</h4>
                  <div className="space-y-2">
                    {mediaAttachments.map((attachment, index) => (
                      <div key={index} className="bg-gray-700 rounded-md p-2 flex justify-between items-center">
                        <div className="flex items-center">
                          {attachment.type === 'image' && <Image className="h-4 w-4 mr-2" />}
                          {attachment.type === 'audio' && <FileAudio className="h-4 w-4 mr-2" />}
                          {attachment.type === 'video' && <FileVideo className="h-4 w-4 mr-2" />}
                          <span className="text-white">{attachment.type} file</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-600/50"
                          onClick={() => removeMediaAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                  >
                    Send with Media
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="research" className="h-full m-0 p-4 data-[state=active]:flex-grow overflow-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Research Database</h3>
              <p className="text-sm text-gray-300">
                Search scientific literature, ATLAS/CERN datasets, and research papers relevant to the Information-Intent Nexus framework.
              </p>
              
              <form onSubmit={handleResearchSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={researchQuery}
                    onChange={(e) => setResearchQuery(e.target.value)}
                    placeholder="e.g., intent field fluctuations in complex systems"
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={isResearching}
                  />
                  <Button 
                    type="submit" 
                    disabled={isResearching || !researchQuery.trim()}
                    className={`min-w-24 ${isResearching ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isResearching ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Research
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-900 rounded-md p-3">
                  <h4 className="text-sm font-medium text-white mb-2">Research Sources</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="atlas" 
                        checked={activeDataSources.cern}
                        onCheckedChange={() => toggleDataSource('cern')}
                      />
                      <label htmlFor="atlas" className="text-sm text-gray-300 cursor-pointer">
                        ATLAS/CERN Datasets
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="arxiv" 
                        checked={true} 
                        onCheckedChange={() => {}}
                      />
                      <label htmlFor="arxiv" className="text-sm text-gray-300 cursor-pointer">
                        arXiv Papers
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="nature" 
                        checked={true} 
                        onCheckedChange={() => {}}
                      />
                      <label htmlFor="nature" className="text-sm text-gray-300 cursor-pointer">
                        Nature Journals
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="simulation" 
                        checked={activeDataSources.simulation} 
                        onCheckedChange={() => toggleDataSource('simulation')}
                      />
                      <label htmlFor="simulation" className="text-sm text-gray-300 cursor-pointer">
                        Simulation Results
                      </label>
                    </div>
                  </div>
                </div>
              </form>
              
              <div className="bg-gray-700 rounded-md p-3 mt-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-400 mr-2" />
                  <h4 className="text-md font-medium text-white">Recent Research Topics</h4>
                </div>
                <div className="mt-2 space-y-2">
                  {[
                    "Intent field fluctuations in complex systems",
                    "Emergent properties of self-organizing particles",
                    "Neural networks for predicting intent-based behavior",
                    "Correlation between ATLAS data and intent simulations",
                    "Information-Intent Nexus theoretical foundations"
                  ].map((topic, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-800 hover:bg-gray-600 rounded p-2 cursor-pointer transition-colors"
                      onClick={() => {
                        setResearchQuery(topic);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-200">{topic}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-4 data-[state=active]:flex-grow overflow-auto">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Assistant Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-md p-4">
                  <h4 className="text-md font-medium text-white mb-3">Voice Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-blue-400" />
                        <div>
                          <Label htmlFor="voice-toggle" className="text-white">Enable Voice Output</Label>
                          <p className="text-xs text-gray-400">
                            Assistant will speak responses with a 40-year-old Oxford professor's voice
                          </p>
                        </div>
                      </div>
                      <Switch 
                        id="voice-toggle" 
                        checked={voiceEnabled}
                        onCheckedChange={handleVoiceToggle}
                      />
                    </div>
                    
                    {voiceEnabled && (
                      <div className="pt-2 border-t border-gray-600">
                        <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                              Set ElevenLabs API Key
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white">
                            <DialogHeader>
                              <DialogTitle>ElevenLabs API Key</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Enter your ElevenLabs API key for premium voice quality. The key will be stored locally in your browser.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Input
                                value={elevenLabsApiKey}
                                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                                placeholder="Enter your ElevenLabs API key"
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                              <p className="text-xs text-gray-400 mt-2">
                                Don't have an API key? Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ElevenLabs</a> to get one.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>Cancel</Button>
                              <Button onClick={handleApiKeySave}>Save</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-md p-4">
                  <h4 className="text-md font-medium text-white mb-3">Data Sources</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-green-400" />
                        <Label htmlFor="simulation-toggle" className="text-white">IntentSim Simulation Data</Label>
                      </div>
                      <Switch 
                        id="simulation-toggle" 
                        checked={activeDataSources.simulation}
                        onCheckedChange={() => toggleDataSource('simulation')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        <Label htmlFor="neural-toggle" className="text-white">Neural Network Analysis</Label>
                      </div>
                      <Switch 
                        id="neural-toggle" 
                        checked={activeDataSources.neuralnets}
                        onCheckedChange={() => toggleDataSource('neuralnets')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <Label htmlFor="cern-toggle" className="text-white">ATLAS/CERN Datasets</Label>
                      </div>
                      <Switch 
                        id="cern-toggle" 
                        checked={activeDataSources.cern}
                        onCheckedChange={() => toggleDataSource('cern')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-blue-400" />
                        <Label htmlFor="notebook-toggle" className="text-white">Notebook LM Mindmap</Label>
                      </div>
                      <Switch 
                        id="notebook-toggle" 
                        checked={activeDataSources.notebook}
                        onCheckedChange={() => toggleDataSource('notebook')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default IntentAssistant;

// Add the Checkbox component inline since it's small and only used here
const Checkbox = ({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
}) => {
  return (
    <div 
      className={`h-4 w-4 rounded border ${
        checked ? 'bg-blue-500 border-blue-600' : 'bg-gray-800 border-gray-600'
      } flex items-center justify-center cursor-pointer transition-colors`}
      onClick={onCheckedChange}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </div>
  );
};
