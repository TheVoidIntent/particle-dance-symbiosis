
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Code, FileText, Video, BookText } from "lucide-react";

const DocumentationTabs: React.FC = () => {
  return (
    <TabsList className="w-full grid grid-cols-5 mb-8">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="hypothesis" className="flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Hypothesis
      </TabsTrigger>
      <TabsTrigger value="implementation" className="flex items-center gap-2">
        <Code className="h-4 w-4" />
        Implementation
      </TabsTrigger>
      <TabsTrigger value="media" className="flex items-center gap-2">
        <Video className="h-4 w-4" />
        Media
      </TabsTrigger>
      <TabsTrigger value="textbook" className="flex items-center gap-2">
        <BookText className="h-4 w-4" />
        Textbook
      </TabsTrigger>
    </TabsList>
  );
};

export default DocumentationTabs;
