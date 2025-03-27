
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, BookOpen } from "lucide-react";
import { useNotebookIntegration } from '@/hooks/useNotebookIntegration';

interface NotebookInsightsProps {
  className?: string;
}

const NotebookInsights: React.FC<NotebookInsightsProps> = ({ className = "" }) => {
  const { annotations } = useNotebookIntegration();
  
  // Get only the 5 most recent annotations
  const recentAnnotations = annotations.slice(0, 5);
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-500" />
          Notebook Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAnnotations.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-40" />
            <p>No notebook entries yet.</p>
            <p>Add observations to track your insights.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAnnotations.map((annotation) => (
              <div 
                key={annotation.id} 
                className="flex items-start gap-2 border-b border-gray-800/10 last:border-none pb-2 last:pb-0"
              >
                <Lightbulb className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">{annotation.text}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(annotation.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotebookInsights;
