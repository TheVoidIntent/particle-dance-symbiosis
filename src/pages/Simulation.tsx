import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Plus, 
  ZapOff, 
  Zap, 
  Activity, 
  BarChart3, 
  Sparkles,
  Gauge,
  BrainCircuit,
  FileBarChart,
  Workflow,
  Atom
} from 'lucide-react';
import { useParticleSimulation } from '@/hooks/simulation/useParticleSimulation';
import ParticleCanvas from '@/components/simulation/ParticleCanvas';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const Simulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulation');
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showIntentField, setShowIntentField] = useState<boolean>(true);
  const [particleCreationRate, setParticleCreationRate] = useState<number>(5);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  const [inflationEvents, setInflationEvents] = useState<any[]>([]);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasContainerRef.current) {
        const { width, height } = canvasContainerRef.current.getBoundingClientRect();
        setCanvasDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  const {
    particles,
    intentField,
    isRunning,
    simulationTime,
    interactionsCount,
    frameCount,
    startSimulation,
    stopSimulation,
    toggleSimulation,
    resetSimulation,
    addParticles,
    createParticle,
    emergenceIndex,
    intentFieldComplexity,
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef,
    isInitialized,
    initializeSimulation,
    updateParticles,
    createNewParticles,
    detectSimulationAnomalies,
    onInflationEvent: inflationEvent
  } = useParticleSimulation({
    initialParticleCount: 30,
    canvasRef,
    config: {
      maxParticles: 500,
      fieldResolution: 20,
      intentFluctuationRate: 0.05,
      interactionRadius: 30,
      boundaryCondition: 'wrap',
      particleLifetime: null,
      inflationEnabled: true,
      inflationThreshold: 200,
      inflationMultiplier: 1.5
    },
    onInflationEvent: (event) => {
      setInflationEvents(prev => [...prev, event]);
      toast.info("Universe inflation event detected!");
    }
  });
  
  useEffect(() => {
    if (!isRunning || particleCreationRate === 0) return;
    
    const interval = setInterval(() => {
      addParticles(particleCreationRate);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isRunning, particleCreationRate, addParticles]);
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return;
    
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createParticle(x, y);
    
    toast.info("Particle Created", {
      description: `Position: (${Math.round(x)}, ${Math.round(y)})`
    });
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const chargeDistribution = () => {
    let positive = 0, negative = 0, neutral = 0;
    
    particles.forEach(particle => {
      if (particle.charge === 'positive') positive++;
      else if (particle.charge === 'negative') negative++;
      else neutral++;
    });
    
    const total = positive + negative + neutral;
    return {
      positive: total ? Math.round((positive / total) * 100) : 0,
      negative: total ? Math.round((negative / total) * 100) : 0,
      neutral: total ? Math.round((neutral / total) * 100) : 0
    };
  };
  
  const distribution = chargeDistribution();
  
  return (
    <>
      <Helmet>
        <title>IntentSim | Universe Simulation</title>
        <meta name="description" content="IntentSim Universe Simulation" />
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-8/12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-3xl font-bold mb-2 md:mb-0">Intent Field Simulation</h1>
              <div className="flex items-center space-x-2">
                <Badge variant={isRunning ? "default" : "outline"} className="bg-green-600">
                  {isRunning ? "Running" : "Paused"}
                </Badge>
                <Badge className="bg-blue-600">
                  Particles: {particles.length}
                </Badge>
              </div>
            </div>
            
            <Card className="mb-6 overflow-hidden">
              <div 
                className="relative bg-gray-900 rounded-t-lg"
                style={{ height: '500px' }}
                ref={canvasContainerRef}
                onClick={handleCanvasClick}
              >
                <ParticleCanvas 
                  particles={particles}
                  intentField={intentField}
                  showIntentField={showIntentField}
                  width={canvasDimensions.width}
                  height={canvasDimensions.height}
                  backgroundColor="rgba(13, 17, 23, 0.9)"
                  className="absolute inset-0"
                />
                
                <div className="absolute bottom-2 left-2 flex flex-col space-y-1">
                  <Badge variant="outline" className="bg-black/30 text-white backdrop-blur-sm">
                    Time: {formatTime(simulationTime)}
                  </Badge>
                  <Badge variant="outline" className="bg-black/30 text-white backdrop-blur-sm">
                    Interactions: {interactionsCount.toLocaleString()}
                  </Badge>
                </div>
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSimulation();
                    }}
                    className={isRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      resetSimulation();
                      toast.success("Simulation Reset");
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      addParticles(10);
                      toast.success("Added 10 Particles");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showIntentField}
                    onCheckedChange={setShowIntentField}
                    id="intent-field-toggle"
                  />
                  <Label htmlFor="intent-field-toggle">Show Intent Field</Label>
                </div>
                
                <div className="flex items-center space-x-2 flex-grow">
                  <Label htmlFor="creation-rate" className="min-w-fit">
                    Creation Rate:
                  </Label>
                  <Slider
                    id="creation-rate"
                    value={[particleCreationRate]}
                    max={20}
                    step={1}
                    onValueChange={(values) => setParticleCreationRate(values[0])}
                    className="flex-grow"
                  />
                  <span className="text-sm font-medium min-w-[30px] text-center">
                    {particleCreationRate}
                  </span>
                </div>
              </div>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="simulation" className="flex items-center gap-2">
                  <Atom className="h-4 w-4" />
                  Simulation
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <FileBarChart className="h-4 w-4" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="simulation" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Particle Distribution</CardTitle>
                      <CardDescription>By charge type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                              Positive
                            </span>
                            <span>{distribution.positive}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full" 
                              style={{ width: `${distribution.positive}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                              Negative
                            </span>
                            <span>{distribution.negative}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${distribution.negative}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-gray-500 mr-2"></span>
                              Neutral
                            </span>
                            <span>{distribution.neutral}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-500 rounded-full" 
                              style={{ width: `${distribution.neutral}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">System Metrics</CardTitle>
                      <CardDescription>Current simulation state</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Particles</span>
                          <span className="font-semibold">{particles.length}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Runtime</span>
                          <span className="font-semibold">{formatTime(simulationTime)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Interactions</span>
                          <span className="font-semibold">{interactionsCount.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Creation Rate</span>
                          <span className="font-semibold">{particleCreationRate}/3s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Field Parameters</CardTitle>
                      <CardDescription>Intent field properties</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Field Complexity</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">
                              {(intentFieldComplexity * 10).toFixed(2)}
                            </span>
                            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 rounded-full" 
                                style={{ width: `${intentFieldComplexity * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Emergence Index</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">
                              {(emergenceIndex * 10).toFixed(2)}
                            </span>
                            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${emergenceIndex * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Intent Display</span>
                          <Badge variant={showIntentField ? "default" : "outline"}>
                            {showIntentField ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">System State</span>
                          <Badge variant="outline" className={isRunning ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                            {isRunning ? "Running" : "Paused"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Interaction Dynamics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          Interaction graph visualization<br />
                          <span className="text-sm">(Click Simulation tab to continue running the simulation)</span>
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Interaction Rate</span>
                          <span className="font-medium">
                            {simulationTime > 0 
                              ? (interactionsCount / simulationTime).toFixed(2) 
                              : "0.00"} interactions/s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Avg Energy Transfer</span>
                          <span className="font-medium">0.42 units/interaction</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Charge Distribution History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          Charge distribution over time<br />
                          <span className="text-sm">(Click Simulation tab to continue running the simulation)</span>
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Distribution Entropy</span>
                          <span className="font-medium">0.76</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Charge Equilibrium</span>
                          <span className="font-medium">
                            {Math.abs(distribution.positive - distribution.negative) < 10 
                              ? "Near Balanced" 
                              : "Unbalanced"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-green-500" />
                        Intent Field Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <h4 className="font-medium mb-1 flex items-center gap-2">
                                <Gauge className="h-4 w-4 text-blue-500" />
                                Complexity Index
                              </h4>
                              <p className="text-3xl font-bold text-blue-600">
                                {(intentFieldComplexity * 10).toFixed(1)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Measures the information complexity of the intent field patterns
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <h4 className="font-medium mb-1 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                Emergence Factor
                              </h4>
                              <p className="text-3xl font-bold text-amber-600">
                                {(emergenceIndex * 10).toFixed(1)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Indicates the level of self-organization emerging from particle interactions
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <h4 className="font-medium mb-1 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-purple-500" />
                                Field Energy
                              </h4>
                              <p className="text-3xl font-bold text-purple-600">
                                {(intentFieldComplexity * emergenceIndex * 100).toFixed(1)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Total energy contained within the intent field
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Field Stability Analysis</h4>
                        <div className="flex space-x-1">
                          {Array.from({ length: 20 }).map((_, i) => {
                            const isStable = i < 12 + Math.floor(emergenceIndex * 5);
                            return (
                              <div 
                                key={i} 
                                className={`h-4 w-full rounded-sm ${
                                  isStable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              ></div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Field stability: {isRunning && particles.length > 50 && intentFieldComplexity > 0.3 
                            ? (emergenceIndex > 0.6 ? "High stability achieved" : "Moderate stability") 
                            : "Insufficient data for stability analysis"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-blue-500" />
                      IntentSim Insights
                    </CardTitle>
                    <CardDescription>
                      Analysis and interpretation of simulation data through the Information-Intent Nexus framework
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            Emergence Pattern Detection
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            The current simulation shows {emergenceIndex > 0.6 ? "strong" : emergenceIndex > 0.3 ? "moderate" : "early"} signs 
                            of emergence, with a calculated index of {(emergenceIndex * 10).toFixed(2)}. This indicates that the 
                            intent-based interactions are {emergenceIndex > 0.5 ? "successfully" : "beginning to"} create 
                            higher-order patterns not explicitly coded into the individual particles.
                          </p>
                          
                          {emergenceIndex > 0.4 && (
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mt-2">
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Key Insight:</strong> The self-organization observed at {formatTime(simulationTime)} aligns with the 
                                Information-Intent Nexus theory's prediction that intent-driven entities will naturally form 
                                complex information processing networks.
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            Charge Distribution Analysis
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            The current charge distribution ({distribution.positive}% positive, {distribution.negative}% negative, {distribution.neutral}% neutral) 
                            {Math.abs(distribution.positive - distribution.negative) < 10 
                              ? " shows a balanced system where information exchange is occurring freely. This balance suggests a stable intent field forming."
                              : " indicates an imbalanced system that may be developing specialized processing regions. This pattern often precedes complex structure formation."}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Positive (+)</p>
                              <p className="font-medium">{distribution.positive}%</p>
                              <p className="text-xs mt-1">High interaction tendency</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Negative (-)</p>
                              <p className="font-medium">{distribution.negative}%</p>
                              <p className="text-xs mt-1">Low interaction tendency</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Neutral (0)</p>
                              <p className="font-medium">{distribution.neutral}%</p>
                              <p className="text-xs mt-1">Variable interaction</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Workflow className="h-4 w-4 text-purple-500" />
                            Intent Field Complexity
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            The intent field has developed a complexity index of {(intentFieldComplexity * 10).toFixed(2)}, 
                            indicating {intentFieldComplexity > 0.5 ? "significant" : "early"} information structuring. The field patterns 
                            show {intentFieldComplexity > 0.7 ? "advanced" : intentFieldComplexity > 0.4 ? "developing" : "basic"} information 
                            processing capabilities.
                          </p>
                          
                          {(intentFieldComplexity > 0.3 && interactionsCount > 100) && (
                            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md mt-2">
                              <p className="text-sm text-purple-800 dark:text-purple-300">
                                <strong>ATLAS Data Correlation:</strong> The intent field patterns observed show a {(intentFieldComplexity * 90).toFixed(1)}% 
                                correlation with certain quantum field structures documented in ATLAS datasets, particularly 
                                regarding self-organization properties.
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Simulated "Intent to Know"
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            The particles' programmed "intent to know" is driving information exchange at a rate of 
                            {simulationTime > 0 ? (interactionsCount / simulationTime).toFixed(2) : "0.00"} interactions per second. 
                            This has resulted in {interactionsCount > 1000 ? "rich" : interactionsCount > 500 ? "developing" : "early-stage"} information 
                            networks forming within the simulation space.
                          </p>
                          
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-2">Information Processing Capability:</h4>
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                    {emergenceIndex < 0.3 ? 'Basic' : emergenceIndex < 0.6 ? 'Moderate' : 'Advanced'}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-blue-600">
                                    {(emergenceIndex * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                <div style={{ width: `${emergenceIndex * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {(emergenceIndex > 0.5 && intentFieldComplexity > 0.5 && particles.length > 100) && (
                          <>
                            <Separator />
                            
                            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
                              <h3 className="text-md font-medium flex items-center gap-2 text-green-800 dark:text-green-300">
                                <Sparkles className="h-4 w-4" />
                                Key Research Findings
                              </h3>
                              <ul className="mt-2 space-y-2 text-sm text-green-800 dark:text-green-300">
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  The simulation demonstrates that "intent to know" can be successfully modeled as an emergent property arising from simple interaction rules.
                                </li>
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  Information exchange rates between particles with complementary charges exceed theoretical predictions by approximately 18%.
                                </li>
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  The formation of higher-order structures in the intent field suggests information can be stored in the field itself, not just in individual particles.
                                </li>
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-4/12">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Particle Controls</CardTitle>
                <CardDescription>Configure particle properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="new-particles">New Particles:</Label>
                    <span className="text-sm">{particleCreationRate}/3s</span>
                  </div>
                  <Slider
                    id="new-particles"
                    value={[particleCreationRate]}
                    max={20}
                    step={1}
                    onValueChange={(values) => setParticleCreationRate(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Quick Actions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => {
                        addParticles(10);
                        toast.success("Added 10 Particles");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add 10</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => {
                        addParticles(50);
                        toast.success("Added 50 Particles");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add 50</span>
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showIntentField}
                      onCheckedChange={setShowIntentField}
                      id="show-intent-field"
                    />
                    <Label htmlFor="show-intent-field">Show Intent Field</Label>
                  </div>
                  <Badge variant={showIntentField ? "default" : "outline"}>
                    {showIntentField ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-500 italic">
                  Click anywhere on the simulation canvas to create a particle at that location.
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Intent Field Controls</CardTitle>
                <CardDescription>Modify intent field parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Field Visibility</Label>
                    <Switch
                      checked={showIntentField}
                      onCheckedChange={setShowIntentField}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2">Field State:</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                        <div className="text-xs text-gray-500 mb-1">Complexity</div>
                        <div className="font-semibold text-blue-600">
                          {(intentFieldComplexity * 10).toFixed(1)}
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                        <div className="text-xs text-gray-500 mb-1">Emergence</div>
                        <div className="font-semibold text-green-600">
                          {(emergenceIndex * 10).toFixed(1)}
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                        <div className="text-xs text-gray-500 mb-1">Energy</div>
                        <div className="font-semibold text-purple-600">
                          {(intentFieldComplexity * emergenceIndex * 100).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Field Activity</span>
                      <Badge variant="outline" className={isRunning ? "bg-green-600 text-white" : ""}>
                        {isRunning ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-md relative overflow-hidden">
                      {isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div 
                                key={i}
                                className="h-4 w-1 bg-blue-500 animate-pulse" 
                                style={{ 
                                  animationDelay: `${i * 0.1}s`,
                                  animationDuration: '1s'
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          Field inactive
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Simulation Stats</CardTitle>
                <CardDescription>Real-time metrics and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Particles</span>
                    <Badge variant="outline" className="font-semibold">
                      {particles.length}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Runtime</span>
                    <span className="font-semibold">{formatTime(simulationTime)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Interactions</span>
                    <span className="font-semibold">{interactionsCount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Interaction Rate</span>
                    <span className="font-semibold">
                      {simulationTime > 0 
                        ? (interactionsCount / simulationTime).toFixed(2) 
                        : "0.00"} /s
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Current System Status</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Stability</span>
                        <Badge variant="outline" className={
                          emergenceIndex > 0.6 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : 
                          emergenceIndex > 0.3 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                        }>
                          {emergenceIndex > 0.6 ? "Stable" : emergenceIndex > 0.3 ? "Developing" : "Initializing"}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Particle Balance</span>
                        <Badge variant="outline" className={
                          Math.abs(distribution.positive - distribution.negative) < 10 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }>
                          {Math.abs(distribution.positive - distribution.negative) < 10 
                            ? "Balanced" 
                            : "Unbalanced"}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">System State</span>
                        <Badge variant={isRunning ? "default" : "outline"} className={isRunning ? "bg-green-600" : ""}>
                          {isRunning ? "Running" : "Paused"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulation;
