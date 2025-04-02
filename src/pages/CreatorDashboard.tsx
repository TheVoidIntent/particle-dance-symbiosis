
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Calendar, FileText, Settings, Upload, Download, Clipboard, Database, Atom } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SimulationStatus } from '@/components/simulation/SimulationStatus';
import { toast } from 'sonner';

const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  useEffect(() => {
    // Set current time as last updated time
    setLastUpdated(new Date().toLocaleTimeString());
    
    // Update the last updated time every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path: string, actionName: string) => {
    navigate(path);
    toast.success(`Navigating to ${actionName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <Helmet>
        <title>Creator Dashboard | IntentSim</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || 'Creator'}!</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Data
            </Button>
          </div>
        </div>
        
        {/* Simulation Status */}
        <div className="mb-8">
          <SimulationStatus />
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Simulations</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div className="h-12 w-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Atom className="h-6 w-6 text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Data Points</p>
                  <p className="text-2xl font-bold">18,246</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Notebook Entries</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Clipboard className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Exported Files</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Download className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick access grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Active Simulations</span>
                <span className="text-xs text-gray-400">Last updated: {lastUpdated}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Adaptive Probabilistic", status: "Running", type: "adaptive_probabilistic", activity: "HIGH" },
                  { name: "Energy Conservation", status: "Running", type: "energy_conservation", activity: "MEDIUM" },
                  { name: "Full Features", status: "Running", type: "full_features", activity: "HIGH" },
                  { name: "Baseline", status: "Running", type: "baseline", activity: "LOW" },
                ].map((sim, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <div>
                        <p className="font-medium">{sim.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 text-xs px-1">
                            {sim.status}
                          </Badge>
                          <span className="text-xs text-gray-400">Activity: {sim.activity}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleNavigation(`/creator/simulation?type=${sim.type}`, `${sim.name} Simulation`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/creator/simulation', 'New Simulation')}
                  >
                    <Atom className="mr-2 h-4 w-4" />
                    New Simulation
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/creator/notebook', 'Notebook')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Open Notebook
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Analytics view coming soon')}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Settings view coming soon')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Calendar className="h-20 w-20 text-gray-500" />
                </div>
                <p className="text-center text-sm text-gray-400">
                  Data schedule: Daily exports at midnight
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Activity feed */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Exported simulation data", date: "Today, 10:23 AM", user: "You" },
                { action: "Added notebook annotation", date: "Yesterday, 2:45 PM", user: "You" },
                { action: "Modified simulation parameters", date: "Yesterday, 11:30 AM", user: "You" },
                { action: "Generated PDF report", date: "3 days ago", user: "System" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.date} by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorDashboard;
