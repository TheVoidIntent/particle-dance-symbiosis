
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Brain, Database, Book, CircleHelp, Shield, Zap } from 'lucide-react';
import { knowledgeBase, KnowledgeConcept } from '@/utils/knowledge/intentKnowledgeBase';
import { initializeDocumentContent } from '@/utils/knowledge/docContentFetcher';

interface IntentSimonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withKnowledgeDisplay?: boolean;
  animated?: boolean;
  onSpeak?: (message: string) => void;
}

const IntentSimon: React.FC<IntentSimonProps> = ({
  size = 'md',
  className = '',
  withKnowledgeDisplay = false,
  animated = true,
  onSpeak
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCircle, setActiveCircle] = useState<string | null>(null);
  const [knowledgeStats, setKnowledgeStats] = useState({
    totalConcepts: 0,
    simulationInsights: 0,
    documentChunks: 0
  });
  const [activeFacts, setActiveFacts] = useState<KnowledgeConcept[]>([]);
  const animationFrame = useRef<number | null>(null);
  
  // Initialize knowledge base on mount
  useEffect(() => {
    const initialize = async () => {
      if (isInitialized) return;
      
      setIsLoading(true);
      
      try {
        // Initialize document content
        await initializeDocumentContent();
        
        // Get initial stats
        const stats = knowledgeBase.getStats();
        setKnowledgeStats({
          totalConcepts: stats.totalConcepts,
          simulationInsights: stats.simulationInsightsCount,
          documentChunks: stats.documentContentChunks
        });
        
        // Pick some initial active facts
        const coreConcepts = knowledgeBase.getIntentCircleConcepts('core');
        setActiveFacts(coreConcepts.slice(0, 2));
        
        // Say hello if we have a speak function
        if (onSpeak) {
          setTimeout(() => {
            onSpeak("Hello, I'm IntentSim(on). I'm here to help explain the intent-based universe model.");
          }, 1000);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing IntentSimon:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isInitialized, onSpeak]);
  
  // Update knowledge stats periodically
  useEffect(() => {
    if (!isInitialized) return;
    
    const statsInterval = setInterval(() => {
      const stats = knowledgeBase.getStats();
      setKnowledgeStats({
        totalConcepts: stats.totalConcepts,
        simulationInsights: stats.simulationInsightsCount,
        documentChunks: stats.documentContentChunks
      });
      
      // Occasionally update active facts
      if (Math.random() < 0.3) {
        // Pick a random intent circle
        const circles: Array<KnowledgeConcept['intentCircle']> = ['core', 'protective', 'explorative', 'communicative', 'reflective'];
        const randomCircle = circles[Math.floor(Math.random() * circles.length)];
        
        const circleConcepts = knowledgeBase.getIntentCircleConcepts(randomCircle);
        if (circleConcepts.length > 0) {
          setActiveFacts([
            circleConcepts[Math.floor(Math.random() * circleConcepts.length)]
          ]);
        }
      }
    }, 5000);
    
    return () => clearInterval(statsInterval);
  }, [isInitialized]);
  
  // Handle animation
  useEffect(() => {
    if (!animated || !isInitialized) return;
    
    let angle = 0;
    const animate = () => {
      angle += 0.01;
      // Any animation logic would go here
      
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    animationFrame.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [animated, isInitialized]);
  
  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'lg':
        return 'w-48 h-48';
      case 'md':
      default:
        return 'w-32 h-32';
    }
  };
  
  // Helper to get the current active circle info
  const getActiveCircleInfo = () => {
    if (!activeCircle) return null;
    
    const circleInfo = {
      core: {
        name: 'Core Knowledge',
        description: 'Fundamental concepts about intent-based universe simulation',
        icon: <Database className="w-5 h-5 text-blue-400" />
      },
      protective: {
        name: 'Protective Circle',
        description: 'Guards the integrity of the knowledge nexus',
        icon: <Shield className="w-5 h-5 text-red-400" />
      },
      explorative: {
        name: 'Explorative Circle',
        description: 'New insights and discoveries from simulation data',
        icon: <Zap className="w-5 h-5 text-yellow-400" />
      },
      communicative: {
        name: 'Communicative Circle',
        description: 'Interface between knowledge and external queries',
        icon: <Bot className="w-5 h-5 text-green-400" />
      },
      reflective: {
        name: 'Reflective Circle',
        description: 'Self-awareness and system improvement insights',
        icon: <Brain className="w-5 h-5 text-purple-400" />
      }
    };
    
    return circleInfo[activeCircle as keyof typeof circleInfo];
  };
  
  // Handle circle hover
  const handleCircleHover = (circle: string | null) => {
    setActiveCircle(circle);
    
    if (circle) {
      const circleConcepts = knowledgeBase.getIntentCircleConcepts(circle as KnowledgeConcept['intentCircle']);
      if (circleConcepts.length > 0) {
        // Show up to 3 random concepts from this circle
        const count = Math.min(3, circleConcepts.length);
        const randomConcepts: KnowledgeConcept[] = [];
        
        // Get random concepts without duplicates
        const indices = new Set<number>();
        while (indices.size < count) {
          indices.add(Math.floor(Math.random() * circleConcepts.length));
        }
        
        indices.forEach(index => {
          randomConcepts.push(circleConcepts[index]);
        });
        
        setActiveFacts(randomConcepts);
      } else {
        setActiveFacts([]);
      }
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Main character */}
      <div className={`relative ${getSizeClasses()} bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ${animated ? 'animate-pulse' : ''}`}>
        <div className="absolute w-full h-full rounded-full bg-indigo-900 bg-opacity-20"></div>
        
        {/* Inner circles of intent */}
        <div 
          className="absolute w-[85%] h-[85%] rounded-full border-2 border-white border-opacity-30"
          onMouseEnter={() => handleCircleHover('core')}
          onMouseLeave={() => handleCircleHover(null)}
        />
        <div 
          className="absolute w-[70%] h-[70%] rounded-full border-2 border-white border-opacity-30"
          onMouseEnter={() => handleCircleHover('protective')}
          onMouseLeave={() => handleCircleHover(null)}
        />
        <div 
          className="absolute w-[55%] h-[55%] rounded-full border-2 border-white border-opacity-30"
          onMouseEnter={() => handleCircleHover('explorative')}
          onMouseLeave={() => handleCircleHover(null)}
        />
        <div 
          className="absolute w-[40%] h-[40%] rounded-full border-2 border-white border-opacity-30"
          onMouseEnter={() => handleCircleHover('communicative')}
          onMouseLeave={() => handleCircleHover(null)}
        />
        <div 
          className="absolute w-[25%] h-[25%] rounded-full border-2 border-white border-opacity-30"
          onMouseEnter={() => handleCircleHover('reflective')}
          onMouseLeave={() => handleCircleHover(null)}
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className={`${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'} text-white`} />
        </div>
        
        {/* Knowledge icons around perimeter */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Book className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-blue-300`} />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Database className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-green-300`} />
        </div>
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Shield className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-red-300`} />
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 translate-x-1/2">
          <Zap className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-yellow-300`} />
        </div>
      </div>
      
      {/* Knowledge display */}
      {withKnowledgeDisplay && (
        <div className="mt-4 bg-gray-800 bg-opacity-70 backdrop-blur-sm p-4 rounded-lg border border-indigo-900 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-indigo-300 font-semibold flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              Knowledge Status
            </h3>
            <div className="text-xs text-gray-400">
              {isInitialized ? 'Online' : isLoading ? 'Initializing...' : 'Offline'}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded">
              <div className="text-xs text-gray-400">Concepts</div>
              <div className="text-indigo-300 font-medium">{knowledgeStats.totalConcepts}</div>
            </div>
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded">
              <div className="text-xs text-gray-400">Simulation Data</div>
              <div className="text-green-300 font-medium">{knowledgeStats.simulationInsights}</div>
            </div>
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded">
              <div className="text-xs text-gray-400">Document Info</div>
              <div className="text-blue-300 font-medium">{knowledgeStats.documentChunks}</div>
            </div>
          </div>
          
          {activeCircle && getActiveCircleInfo() && (
            <div className="mb-3 bg-indigo-900 bg-opacity-30 p-2 rounded border border-indigo-800">
              <div className="flex items-center mb-1">
                {getActiveCircleInfo()?.icon}
                <div className="ml-2 text-indigo-200 font-medium">{getActiveCircleInfo()?.name}</div>
              </div>
              <div className="text-xs text-gray-300">{getActiveCircleInfo()?.description}</div>
            </div>
          )}
          
          {activeFacts.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-1">Active Knowledge:</div>
              {activeFacts.map((fact, i) => (
                <div key={i} className="text-xs text-white mb-1 bg-gray-900 bg-opacity-40 p-2 rounded">
                  <span className="text-indigo-300 font-medium">{fact.name}:</span> {fact.description.substring(0, 100)}
                  {fact.description.length > 100 ? '...' : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IntentSimon;
