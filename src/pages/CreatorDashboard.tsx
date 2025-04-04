import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bot, Code } from 'lucide-react';
import MotherSimulationControl from '@/components/MotherSimulationControl';
import SimulationStatus from '@/components/simulation/SimulationStatus';

const CreatorDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Under Construction</AlertTitle>
        <AlertDescription>
          This dashboard is currently under development. More features coming soon!
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="simulation" className="w-full mt-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="simulation">
            <Bot className="mr-2 h-4 w-4" />
            Simulation
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="mr-2 h-4 w-4" />
            Codebase
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="simulation">
          <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>Universe Simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MotherSimulationControl />
              <SimulationStatus className="mb-4" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code">
          <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>Codebase Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Explore the IntentSim codebase and contribute to the project.</p>
              <Button variant="outline" className="mt-4">
                View Codebase
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;
