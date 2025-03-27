
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Import refactored components
import DocumentationHeader from "@/components/documentation/DocumentationHeader";
import DocumentationTabs from "@/components/documentation/DocumentationTabs";
import OverviewTab from "@/components/documentation/OverviewTab";
import HypothesisTab from "@/components/documentation/HypothesisTab";
import ImplementationTab from "@/components/documentation/ImplementationTab";
import MediaTab from "@/components/documentation/MediaTab";

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <Helmet>
        <title>IntentSim | Documentation</title>
        <meta name="description" content="Comprehensive documentation of the Intent Universe Framework" />
      </Helmet>

      <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" 
               style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
               style={{animationDuration: '20s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DocumentationHeader />

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <DocumentationTabs />

            <TabsContent value="overview" className="animate-fade-in">
              <OverviewTab setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="hypothesis" className="animate-fade-in">
              <HypothesisTab />
            </TabsContent>

            <TabsContent value="implementation" className="animate-fade-in">
              <ImplementationTab />
            </TabsContent>

            <TabsContent value="media" className="animate-fade-in">
              <MediaTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Documentation;
