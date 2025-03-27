
import React from "react";
import { FileText, Atom } from "lucide-react";

const DocumentationHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-1.5 mb-4 border border-gray-700">
        <FileText className="h-4 w-4 text-indigo-400" />
        <span className="text-sm font-medium text-gray-300">Documentation</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
        Intent Universe Framework
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        A comprehensive guide to understanding the theoretical basis, implementation, and application
        of the intent-based universe simulation.
      </p>
    </div>
  );
};

export default DocumentationHeader;
