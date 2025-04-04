
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Upload, 
  Download, 
  PlaySquare,
  Bell,
  Music
} from 'lucide-react';
import { useNotebookLmIntegration } from '@/hooks/useNotebookLmIntegration';
import { useSimpleAudio } from '@/hooks/useSimpleAudio';
import { getSimulationStats } from '@/utils/simulation/state';

const NotebookLmExport: React.FC = () => {
  const { 
    onExportForNotebook, 
    exportSimulationData, 
    openNotebookLm, 
    notebookLmConfig,
    updateConfig
  } = useNotebookLmIntegration();
  
  const { playSound } = useSimpleAudio();
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportTime, setLastExportTime] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const simulationStats = getSimulationStats();
      await onExportForNotebook(simulationStats);
      setLastExportTime(new Date().toLocaleTimeString());
      alert('Data exported to NotebookLM successfully!');
    } catch (error) {
      console.error("Export error:", error);
      alert('Error exporting data to NotebookLM');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenNotebook = () => {
    exportSimulationData();
    openNotebookLm();
  };
  
  const toggleAudioDataInclusion = () => {
    updateConfig({ includeAudioData: !notebookLmConfig.includeAudioData });
  };
  
  const toggleAutoExport = () => {
    updateConfig({ autoExport: !notebookLmConfig.autoExport });
  };
  
  const playTestSound = (type: string) => {
    switch (type) {
      case 'cosmicBell':
        playSound('cosmicBell', { informationDensity: 0.8, weight: 0.7 });
        break;
      case 'gravitationalWave':
        playSound('gravitationalWave', { strength: 0.7, complexity: 0.6 });
        break;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
            NotebookLM Integration
          </span>
          {notebookLmConfig.isEnabled ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-800">Disabled</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="export">
        <TabsList className="grid grid-cols-2 mx-4">
          <TabsTrigger value="export">Export Options</TabsTrigger>
          <TabsTrigger value="audio">Audio Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="space-y-4">
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Export your simulation data to NotebookLM to analyze patterns and create insights.
            </p>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-export" className="text-sm">
                Auto-export data every {notebookLmConfig.exportInterval} minutes
              </Label>
              <Switch 
                id="auto-export" 
                checked={notebookLmConfig.autoExport}
                onCheckedChange={toggleAutoExport}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleExport}
                disabled={!notebookLmConfig.isEnabled || isExporting}
                className="flex-1"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </>
                )}
              </Button>
              <Button 
                variant="default"
                onClick={handleOpenNotebook}
                disabled={!notebookLmConfig.isEnabled}
                className="flex-1"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Open in NotebookLM
              </Button>
            </div>
            
            {lastExportTime && (
              <p className="text-xs text-gray-400 mt-2">
                Last exported: {lastExportTime}
              </p>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-4">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="include-audio" className="text-sm flex items-center">
                <Music className="h-4 w-4 mr-2 text-indigo-400" />
                Include audio data in exports
              </Label>
              <Switch 
                id="include-audio" 
                checked={notebookLmConfig.includeAudioData}
                onCheckedChange={toggleAudioDataInclusion}
              />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border text-xs mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Bell className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                Cosmic Audio Test Sounds
              </h4>
              <p className="text-gray-500 mb-3">
                Test the cosmic bell sounds that represent information weight
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => playTestSound('cosmicBell')}
                  className="text-xs"
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Cosmic Bell
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => playTestSound('gravitationalWave')}
                  className="text-xs"
                >
                  <PlaySquare className="h-3 w-3 mr-1" />
                  Gravity Wave
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-3 text-xs">
              <h4 className="font-medium mb-1">Audio Export Data Format</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-xs">
{`{
  "audioSystem": "Cosmic Sonata Sound Generator",
  "soundTypes": [
    { "name": "Cosmic Bell Toll", ... },
    { "name": "Gravitational Wave", ... }
  ],
  "soundTheory": {
    "framework": "Information-Intent Nexus",
    "harmonicMapping": "Particle → Harmonics",
    "informationWeight": "Freq → Weight"
  }
}`}
              </pre>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-400 italic">
          Exported data includes simulation state, particle metrics, and cosmic audio mappings
        </p>
      </CardFooter>
    </Card>
  );
};

export default NotebookLmExport;
