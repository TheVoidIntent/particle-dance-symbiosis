
import React from 'react';
import { Share, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotebookHeader: React.FC = () => {
  return (
    <div className="bg-black py-4 px-4 border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="/logo.svg" alt="IntentSim Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-medium text-white">Intent Notebook</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <Share className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 p-2 hidden group-hover:block">
              <p className="text-sm text-gray-300 mb-2">Share this notebook:</p>
              <Button variant="outline" size="sm" className="w-full mb-1">Copy Link</Button>
              <Button variant="outline" size="sm" className="w-full">Export as PDF</Button>
            </div>
          </div>
          <BookOpen className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default NotebookHeader;
