
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface DiscordIntegrationProps {
  onConnect?: (discordId: string) => void;
}

const DiscordIntegration: React.FC<DiscordIntegrationProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [discordUsername, setDiscordUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulating a connection process
    setTimeout(() => {
      setIsConnected(true);
      setDiscordUsername('thevoid_intent');
      setIsConnecting(false);
      
      // Notify parent component
      if (onConnect) {
        onConnect('thevoid_intent');
      }
      
      toast.success('Connected to Discord successfully!', {
        description: 'Simulation events will now be shared to your Discord account.',
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setDiscordUsername('');
    
    toast.info('Disconnected from Discord', {
      description: 'Your Discord account has been disconnected.',
    });
  };

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-400" />
          Discord Integration
        </CardTitle>
        <CardDescription>
          Connect your Discord account to share simulation events
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isConnected ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500">
                <img 
                  src="/lovable-uploads/f246c8dd-4285-430c-91b8-bf9acae8743e.png" 
                  alt="Discord Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium text-white">TheVoid🧠</h3>
                  <Badge variant="outline" className="ml-2 bg-indigo-900/50 text-indigo-300 border-indigo-700">
                    Connected
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">@{discordUsername}</p>
                <p className="text-xs text-gray-500 mt-1">Member since Feb 26, 2025</p>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium mb-2">Simulation Notifications</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Inflation Events</span>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-400">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Anomaly Detections</span>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-400">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Particle Creation</span>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-400">Enabled</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                  <span className="block font-medium text-amber-400 mb-1">Note from TheVoid:</span>
                  "some of us are not too pleased with uncertainty... 🧠"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Not Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Connect your Discord account to receive simulation events and share discoveries with your community.
            </p>
            <div className="flex flex-col space-y-2">
              <p className="text-xs text-gray-500 mb-2">
                Connecting will allow IntentSim to:
              </p>
              <ul className="text-xs text-gray-500 space-y-1 text-left ml-4 list-disc">
                <li>Send notifications about simulation events</li>
                <li>Share your simulation discoveries</li>
                <li>Notify you about anomalies</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        {isConnected ? (
          <div className="flex flex-col w-full space-y-2">
            <Button variant="outline" className="w-full" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Open Discord Channel
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleConnect} 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Discord Account"}
            <User className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DiscordIntegration;
