
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, ExternalLink, Download, Bookmark } from "lucide-react";

const TextbookTab: React.FC = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <BookText className="h-6 w-6 text-indigo-400" />
          The Intentional Universe Textbook
        </CardTitle>
        <CardDescription className="text-gray-300">
          Complete reference material for the Intent Universe Framework
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">About the Textbook</h3>
          <p className="text-gray-300 mb-4">
            "The Intentional Universe" is a comprehensive textbook that explores the theoretical foundations of the Intent Universe Framework. It covers the emergence of structure, particle behavior, and the information-intent nexus that drives cosmic development.
          </p>
          
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Button className="flex items-center gap-2" size="lg">
              <ExternalLink className="h-4 w-4" />
              Access Online
            </Button>
            <Button variant="outline" className="flex items-center gap-2" size="lg">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Key Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-400 mt-1" />
                  <div>
                    <p className="font-medium">Chapter 1: Intent as First Cause</p>
                    <p className="text-sm text-gray-400">Theoretical foundation of pre-physical intent</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-400 mt-1" />
                  <div>
                    <p className="font-medium">Chapter 3: Information Mechanics</p>
                    <p className="text-sm text-gray-400">How information structures create physical-like rules</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-400 mt-1" />
                  <div>
                    <p className="font-medium">Chapter 5: Emergence & Complexity</p>
                    <p className="text-sm text-gray-400">The birth of organized structures from intent fields</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-400 mt-1" />
                  <div>
                    <p className="font-medium">Chapter 8: Experimental Framework</p>
                    <p className="text-sm text-gray-400">Guidelines for simulating intent-based universes</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Repository Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Repository Location:</h4>
                <p className="text-sm bg-gray-900/60 p-2 rounded font-mono">
                  thevoidintent/the_intentional_universe
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Available Formats:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    PDF Document (Complete Textbook)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    Markdown Files (By Chapter)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    LaTeX Source (For Academic Citations)
                  </li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => window.open("https://github.com/thevoidintent/the_intentional_universe", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Repository
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextbookTab;
