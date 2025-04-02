import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Mic, Speaker, FileImage, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface IntentAssistantProps {
  onAdvice?: (advice: string) => void; // Make this prop optional
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({ onAdvice }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: `IntentSim says: ${input}? That's an interesting question!`
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      if (onAdvice) {
        onAdvice(`IntentSim suggests: Explore the implications of "${input}" further.`);
      }
    }, 1500);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col border-indigo-100 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5 text-blue-500" />
          Intent Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="flex flex-col space-y-4 p-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/intentsim-logo.png" alt="IntentSim" />
                    <AvatarFallback>IS</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 text-sm w-fit max-w-[70%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 ml-3">
                    <AvatarImage src="/default-user.jpg" alt="You" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start justify-start">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src="/intentsim-logo.png" alt="IntentSim" />
                  <AvatarFallback>IS</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 text-sm w-fit max-w-[70%] bg-gray-100 text-gray-800">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3">
        <form onSubmit={handleSubmit} className="w-full flex items-center">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={handleInputChange}
            className="mr-2 flex-grow"
          />
          <Button type="submit" disabled={isTyping}>
            Send
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default IntentAssistant;
