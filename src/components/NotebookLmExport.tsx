
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Activity, Award, ZapOff, Database, BookOpen, BookText, Atom } from "lucide-react";
import { useNotebookLmIntegration } from '@/hooks/useNotebookLmIntegration';
import { getAvailableAtlasDatasets } from '@/utils/atlasDataIntegration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInflationEvents } from '@/hooks/useInflationEvents';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ORCID information
const RESEARCHER_ORCID = "0009-0001-0403-6452";
const ORCID_URL = "https://orcid.org/0009-0001-0403-6452";

const NotebookLmExport: React.FC = () => {
  const { exportSimulationData, openNotebookLm, notebookLmConfig } = useNotebookLmIntegration();
  const { inflationEvents } = useInflationEvents();
  const [selectedDataset, setSelectedDataset] = useState("6004"); // Default to 13 TeV collision data
  const availableDatasets = getAvailableAtlasDatasets();
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleExport = () => {
    exportSimulationData(selectedDataset, exportFormat);
    toast.success(`Exporting as ${exportFormat.toUpperCase()} with ATLAS/CERN comparison data`);
  };

  return (
    <Card className="shadow-lg border-purple-200/40 dark:border-purple-800/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            Notebook LM Integration
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-xs">
            <img 
              src="/lovable-uploads/7772820c-08b8-40cc-a74b-278e08a6b862.png" 
              alt="ORCID" 
              className="h-3 w-3 mr-1"
            />
            ORCID Linked
          </Badge>
        </div>
        <CardDescription>
          Export simulation data to your Notebook LM for analysis with proper attribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-purple-300/20 rounded-md p-3 bg-purple-50/20 dark:bg-purple-900/10">
          <p className="text-sm mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
            <span className="font-medium">Export as ORCID Work</span>
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Adaptive Particle Analysis</li>
            <li>Energy Conservation Simulation</li>
            <li>Baseline Simulation</li>
            <li>Full Features Integration</li>
            <li className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <Atom className="h-3 w-3 mr-1 inline" />
              CERN ATLAS Comparison (PDF)
            </li>
            <li className="font-medium">Inflation Events ({inflationEvents.length})</li>
          </ul>
        </div>
        
        <div className="border border-indigo-300/20 rounded-md p-3 bg-indigo-50/20 dark:bg-indigo-900/10">
          <p className="text-sm mb-2 flex items-center">
            <BookText className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="font-medium">Textbook Reference</span>
          </p>
          <p className="text-xs mb-2">Include citations from "The Intentional Universe" textbook</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => window.location.href = '/documentation?tab=textbook'}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Access Textbook
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Atom className="h-4 w-4 mr-1 text-blue-500" />
            ATLAS Dataset Reference:
          </label>
          <Select 
            value={selectedDataset} 
            onValueChange={setSelectedDataset}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ATLAS dataset" />
            </SelectTrigger>
            <SelectContent>
              {availableDatasets.map(dataset => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Export Format:</label>
          <Select
            value={exportFormat}
            onValueChange={setExportFormat}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document (with ATLAS Comparison)</SelectItem>
              <SelectItem value="bibtex">BibTeX Citation</SelectItem>
              <SelectItem value="json">JSON Metadata</SelectItem>
              <SelectItem value="doi">DOI Metadata</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleExport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export for ORCID
          </Button>
          
          <Button 
            className="flex-1"
            onClick={openNotebookLm}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Notebook LM
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 space-y-1">
          <p className="flex items-center">
            <Activity className="h-3 w-3 mr-1 text-green-500" /> 
            Connected to ATLAS Open Data Portal
          </p>
          <p className="flex items-center">
            <ZapOff className="h-3 w-3 mr-1 text-yellow-500" />
            Inflation Events: {inflationEvents.length} detected
          </p>
          <div className="flex items-center">
            <Award className="h-3 w-3 mr-1 text-blue-500" />
            <a href={ORCID_URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
              ORCID: {RESEARCHER_ORCID}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-6">
        <div className="w-full text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>Notebook ID: {notebookLmConfig.notebookId.slice(0, 8)}...</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => window.location.href = '/orcid-integration'}
          >
            <Database className="h-3 w-3 mr-1" />
            OSTI.GOV Integration
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NotebookLmExport;
