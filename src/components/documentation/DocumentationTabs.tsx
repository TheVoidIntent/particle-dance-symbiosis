
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Atom, Brain, Share2, Video } from "lucide-react";

const DocumentationTabs: React.FC = () => {
  return (
    <div className="flex justify-center mb-8">
      <TabsList className="bg-gray-800/50 border border-gray-700">
        <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600">
          <Atom className="mr-2 h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="hypothesis" className="data-[state=active]:bg-indigo-600">
          <Brain className="mr-2 h-4 w-4" />
          Hypothesis
        </TabsTrigger>
        <TabsTrigger value="implementation" className="data-[state=active]:bg-indigo-600">
          <Share2 className="mr-2 h-4 w-4" />
          Implementation
        </TabsTrigger>
        <TabsTrigger value="media" className="data-[state=active]:bg-indigo-600">
          <Video className="mr-2 h-4 w-4" />
          Audio/Visual
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default DocumentationTabs;
