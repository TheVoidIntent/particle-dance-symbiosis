
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotebookLmIntegration } from '@/hooks/useNotebookLmIntegration';
import { getDataPoints } from '@/utils/dataExportUtils';

const NotebookLmExport: React.FC = () => {
  const { onExportForNotebook, exportSimulationData, openNotebookLm, notebookLmConfig } = useNotebookLmIntegration();

  const handleExport = () => {
    onExportForNotebook();
    alert('Data exported to NotebookLM successfully!');
  };

  const handleOpenNotebook = () => {
    exportSimulationData();
    openNotebookLm();
    alert('Opening NotebookLM with current simulation data');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>NotebookLM Integration</span>
          {notebookLmConfig.isEnabled ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-800">Disabled</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Export your simulation data to NotebookLM to analyze patterns and create insights.
        </p>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={!notebookLmConfig.isEnabled}
          >
            Export Data
          </Button>
          <Button 
            variant="default"
            onClick={handleOpenNotebook}
            disabled={!notebookLmConfig.isEnabled}
          >
            Open in NotebookLM
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotebookLmExport;
