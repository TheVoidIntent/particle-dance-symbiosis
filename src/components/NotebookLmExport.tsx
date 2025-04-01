
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Upload, Settings, FileText } from "lucide-react";
import { useNotebookLmIntegration } from '@/hooks/useNotebookLmIntegration';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotebookLmExport: React.FC = () => {
  const { exportSimulationData, openNotebookLm, notebookLmConfig, setNotebookLmConfig } = useNotebookLmIntegration();

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
            Ready to export 5 datasets for your Notebook LM analysis:
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Adaptive Particle Analysis</li>
            <li>Energy Conservation Simulation</li>
            <li>Baseline Simulation</li>
            <li>Full Features Integration</li>
            <li>CERN Atlas Comparison</li>
          </ul>
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <Switch 
            id="pdf-format" 
            checked={notebookLmConfig.usePdfFormat}
            onCheckedChange={(checked) => setNotebookLmConfig({...notebookLmConfig, usePdfFormat: checked})}
          />
          <Label htmlFor="pdf-format" className="text-sm">Export as PDF (Recommended for Notebook LM)</Label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => exportSimulationData()}
          >
            {notebookLmConfig.usePdfFormat ? (
              <FileText className="h-4 w-4 mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Data
          </Button>
          
          <Button 
            className="flex-1"
            onClick={openNotebookLm}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Notebook LM
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          <p>Connected to Notebook ID: b2d28cf3-eebe-436c-9cfe-0015c99f99ac</p>
          <p>After exporting, upload the {notebookLmConfig.usePdfFormat ? "PDF" : "JSON"} file to your Notebook for analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotebookLmExport;
