
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Database, ChevronLeft } from "lucide-react";
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
                <CardTitle className="text-lg">DOE Research Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  The Department of Energy's Office of Scientific and Technical Information (OSTI.GOV) serves as the DOE repository for scientific and technical information. Connecting your ORCID identifier allows your simulation research to be properly attributed.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2">
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
