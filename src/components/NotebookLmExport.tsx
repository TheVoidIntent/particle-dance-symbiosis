
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Activity, Award } from "lucide-react";
import { useNotebookLmIntegration } from '@/hooks/useNotebookLmIntegration';
import { getAvailableAtlasDatasets } from '@/utils/atlasDataIntegration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ORCID information
const RESEARCHER_ORCID = "0009-0001-0403-6452";
const ORCID_URL = "https://orcid.org/0009-0001-0403-6452";

const NotebookLmExport: React.FC = () => {
  const { exportSimulationData, openNotebookLm, notebookLmConfig } = useNotebookLmIntegration();
  const [selectedDataset, setSelectedDataset] = useState("6004"); // Default to 13 TeV collision data
  const availableDatasets = getAvailableAtlasDatasets();

  return (
    <Card className="shadow-lg border-purple-200/40 dark:border-purple-800/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          Notebook LM Integration
        </CardTitle>
        <CardDescription>
          Export simulation data to your Notebook LM for analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-purple-300/20 rounded-md p-3 bg-purple-50/20 dark:bg-purple-900/10">
          <p className="text-sm mb-2">
            Export and compare your data with ATLAS/CERN datasets:
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Adaptive Particle Analysis</li>
            <li>Energy Conservation Simulation</li>
            <li>Baseline Simulation</li>
            <li>Full Features Integration</li>
            <li>CERN ATLAS Comparison</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">ATLAS Dataset Reference:</label>
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
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => exportSimulationData(selectedDataset)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
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
            <Award className="h-3 w-3 mr-1 text-blue-500" />
            ORCID: <a href={ORCID_URL} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:underline">{RESEARCHER_ORCID}</a>
          </p>
          <p>Notebook ID: {notebookLmConfig.notebookId}</p>
          <p>After exporting, open the PDF file in your Notebook LM for analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotebookLmExport;
