
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, FileText, CheckCircle, Database, BookOpen, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ORCID information
const RESEARCHER_ORCID = "0009-0001-0403-6452";
const ORCID_URL = "https://orcid.org/0009-0001-0403-6452";
const RESEARCHER_NAME = "Marcelo Mezquia";

// Sample works for demonstration
const sampleWorks = [
  { 
    id: 1, 
    title: "Adaptive Particle Analysis in Proto-Universe Simulations", 
    type: "Journal Article", 
    date: "2024", 
    source: "IntentSim.org",
    doi: "10.1234/intent.2024.0001"
  },
  { 
    id: 2, 
    title: "Energy Conservation in Intent Field Fluctuations", 
    type: "Conference Paper", 
    date: "2023", 
    source: "CERN Physics Conference",
    doi: "10.1234/cern.2023.5678"
  }
];

const OrcidIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [doiInput, setDoiInput] = useState("");
  const [worksList, setWorksList] = useState(sampleWorks);
  
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

  const handleAddDOI = () => {
    if (!doiInput.trim()) {
      toast.error("Please enter a valid DOI");
      return;
    }

    // In a real implementation, this would validate and fetch metadata for the DOI
    // For demonstration, we'll just add a placeholder entry
    const newWork = {
      id: worksList.length + 1,
      title: `Publication with DOI: ${doiInput}`,
      type: "Journal Article",
      date: new Date().getFullYear().toString(),
      source: "Added via DOI",
      doi: doiInput
    };

    setWorksList([...worksList, newWork]);
    setDoiInput("");
    toast.success("Work added from DOI!");
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="works">ORCID Works</TabsTrigger>
              <TabsTrigger value="add">Add Works</TabsTrigger>
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">Your Works ({worksList.length}/10,000)</span>
                  </div>
                  <Badge variant="secondary">First 50 shown</Badge>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {worksList.map(work => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">{work.title}</TableCell>
                        <TableCell>{work.type}</TableCell>
                        <TableCell>{work.date}</TableCell>
                        <TableCell>{work.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => setActiveTab("add")}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Work
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="add" className="pt-4">
              <div className="space-y-6">
                <div className="border rounded-md p-4 bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    Add Works to Your ORCID Record
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Works are your research outputs, including publications, data sets, and presentations. You can add up to 10,000 works to your ORCID record.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
                      <h4 className="text-sm font-medium mb-2">Add by DOI</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Import the work by entering its Digital Object Identifier (DOI).
                      </p>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter DOI (e.g., 10.1234/example)" 
                          value={doiInput}
                          onChange={(e) => setDoiInput(e.target.value)}
                          className="text-sm"
                        />
                        <Button size="sm" onClick={handleAddDOI}>Add</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
                      <h4 className="text-sm font-medium mb-2">Search & Link (Recommended)</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Connect with trusted databases like Scopus and Crossref to import your works with just a few clicks.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Search className="h-4 w-4 mr-2" />
                        Search External Databases
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
                      <h4 className="text-sm font-medium mb-2">Add IntentSim Simulation</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Add your current simulation as a research output to your ORCID record with proper attribution.
                      </p>
                      <Button onClick={handleAddWork} size="sm" className="w-full">
                        <Database className="h-4 w-4 mr-2" />
                        Add Current Simulation
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="mb-2 font-medium">💡 Tips for adding works:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Allow trusted organizations to automatically update your ORCID record for the most accurate information.</li>
                    <li>When publishing papers, look for the green ORCID iD icon to connect your publication directly.</li>
                    <li>For multiple publications, use BibTex import to add them in bulk.</li>
                    <li>Always verify information after importing to ensure accuracy.</li>
                  </ul>
                </div>
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
      
      <CardFooter className="text-xs text-gray-500 border-t pt-4">
        <div className="flex items-center">
          <FileText className="h-3 w-3 mr-1 text-gray-400" />
          <span>Using ORCID API v3.0 for DOE research integration</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrcidIntegration;
