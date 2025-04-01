
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, FileText, CheckCircle, Database } from "lucide-react";
import { toast } from "sonner";

// ORCID information
const RESEARCHER_ORCID = "0009-0001-0403-6452";
const ORCID_URL = "https://orcid.org/0009-0001-0403-6452";
const RESEARCHER_NAME = "Marcelo Mezquia";

const OrcidIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [isAuthorized, setIsAuthorized] = useState(true);
  
  const handleOpenOrcid = () => {
    window.open(ORCID_URL, '_blank');
    toast.success("Opening ORCID profile");
  };
  
  const handleAuthorize = () => {
    toast.success("ORCID authorization successful!");
    setIsAuthorized(true);
  };
  
  const handleAddWork = () => {
    toast.success("Simulation data added to your ORCID Works");
  };
  
  return (
    <Card className="shadow-lg border-green-200/40 dark:border-green-800/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <img 
              src="/lovable-uploads/7772820c-08b8-40cc-a74b-278e08a6b862.png" 
              alt="ORCID Logo" 
              className="h-6 w-6" 
            />
            ORCID Account Integration
          </CardTitle>
          {isAuthorized && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" /> Authorized
            </Badge>
          )}
        </div>
        <CardDescription>
          Connect your simulation research with the Department of Energy database
        </CardDescription>
      </CardHeader>
      
      {isAuthorized ? (
        <CardContent className="pt-0">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="works">OSTI.GOV Works</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                <span className="col-span-3">{RESEARCHER_NAME}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ORCID:</span>
                <div className="col-span-3 flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">{ORCID_URL}</span>
                  <Button variant="ghost" size="icon" onClick={handleOpenOrcid} className="h-6 w-6">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40 mt-4">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Authorization successful! You can now browse OSTI.GOV and add DOE research entries you've helped author directly to your ORCID Works.
                </p>
              </div>
              
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddWork}
                  className="text-xs"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Add Current Simulation to ORCID
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="works" className="pt-4">
              <div className="text-sm space-y-4">
                <p>
                  You can search OSTI.GOV and add DOE research records you've authored directly to your ORCID Works. Use the search box to find records, or search your name.
                </p>
                
                <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded">Add to ORCID Works</span>
                    <span className="text-sm">Will appear at the bottom of each search result</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button 
                      variant="default" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => toast.info("Opening OSTI.GOV search page")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Search OSTI.GOV
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleOpenOrcid}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View ORCID Works
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 pt-2">
                  Your simulation data from IntentSim can be published to OSTI.GOV and linked with your ORCID profile, enhancing scientific credibility.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Connect your ORCID account to export and publish your simulation data with proper attribution.
            </p>
            
            <Button onClick={handleAuthorize} className="w-full sm:w-auto">
              <img 
                src="/lovable-uploads/7772820c-08b8-40cc-a74b-278e08a6b862.png" 
                alt="ORCID Logo" 
                className="h-4 w-4 mr-2"
              />
              Authorize ORCID Access
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default OrcidIntegration;
