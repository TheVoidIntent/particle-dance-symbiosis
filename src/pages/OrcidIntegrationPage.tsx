
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Database, ChevronLeft, BookOpen, HelpCircle } from "lucide-react";
import OrcidIntegration from '@/components/OrcidIntegration';
import NotebookLmExport from '@/components/NotebookLmExport';
import Footer from "@/components/Footer";
import { useNavigate } from 'react-router-dom';

const OrcidIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <Helmet>
          <title>IntentSim.org | ORCID Integration</title>
          <meta name="description" content="Connect your IntentSim research with ORCID and OSTI.GOV for scientific attribution and publication." />
        </Helmet>

        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Simulation
          </Button>
          
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            Scientific Attribution & Integration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Connect your simulation research with scientific databases and ensure proper attribution through ORCID integration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <OrcidIntegration />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  ORCID Works & DOI Integration
                </CardTitle>
                <CardDescription>
                  Manage your research outputs and add them to your ORCID profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-blue-50/20 dark:bg-blue-900/10 border-blue-200 dark:border-blue-700/40 mb-4">
                  <h3 className="font-medium text-sm mb-2">About ORCID Works</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Works are your research outputs, including publications, data sets, conference presentations, and more. 
                    You can add up to 10,000 works to your ORCID record to maintain a comprehensive research profile.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By connecting DOIs and other identifiers to your ORCID profile, your research gains visibility and proper attribution.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-green-500" />
                      Export Options
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pl-6 mb-2">
                      Export your simulation data in various formats for addition to your ORCID record: PDF, BibTeX, DOI metadata.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-1 flex items-center">
                      <Database className="h-4 w-4 mr-2 text-amber-500" />
                      OSTI.GOV Integration
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pl-6 mb-2">
                      The Department of Energy's Office of Scientific and Technical Information (OSTI.GOV) repository connects with your ORCID iD for proper attribution.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open("https://www.osti.gov/", "_blank")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Visit OSTI.GOV
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open("https://orcid.org/", "_blank")}
                  >
                    <img 
                      src="/lovable-uploads/7772820c-08b8-40cc-a74b-278e08a6b862.png" 
                      alt="ORCID" 
                      className="h-4 w-4 mr-2"
                    />
                    Visit ORCID.org
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <NotebookLmExport />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publication Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Enhanced Scientific Credibility</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By connecting your simulation data with your ORCID identifier, you establish provenance and enhance the scientific credibility of your research.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Research Attribution</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your ORCID identifier ensures that all your research contributions are properly attributed to you across different platforms and databases.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">DOE Compliance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Meets Department of Energy requirements for research data attribution and publication, facilitating collaboration with national laboratories.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-sm mb-2 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-blue-400" />
                    ORCID Works Help
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Works can be added in multiple ways:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                    <li>Search & Link (recommended)</li>
                    <li>Add by DOI or PubMed ID</li>
                    <li>Import BibTeX</li>
                    <li>Manual entry</li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => window.open("https://www.osti.gov/orcid/", "_blank")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Learn More About OSTI.GOV + ORCID
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrcidIntegrationPage;
