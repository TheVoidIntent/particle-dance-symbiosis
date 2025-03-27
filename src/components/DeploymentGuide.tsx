
import React from 'react';
import { AlertCircle, CheckCircle, Code, Globe, Server, Shield } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const DeploymentGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Deployment Guide for intentSim.org</h2>
      
      <p className="text-muted-foreground">
        Follow these steps to deploy your IntentSim application to make it publicly accessible at intentSim.org.
      </p>
      
      <div className="space-y-4">
        <div className="bg-card rounded-lg p-5 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Code size={18} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Step 1: Build the Application</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Run the following command to generate production-ready files:
              </p>
              <div className="bg-muted rounded p-3 font-mono text-sm">
                npm run build
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This will create a <code>dist</code> directory containing all the optimized static files.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-5 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Server size={18} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Step 2: Deploy to Your Web Server</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upload the contents of the <code>dist</code> directory to your web server:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium">Option 1: Direct Upload</h4>
                  <ol className="text-sm text-muted-foreground list-decimal ml-5 mt-1 space-y-1">
                    <li>Connect to your web server using FTP, SFTP, or your hosting provider's file manager.</li>
                    <li>Upload all contents of the <code>dist</code> directory to the root directory of intentSim.org.</li>
                    <li>Ensure the <code>.htaccess</code> file is included in the upload (this handles routing for the single-page application).</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Option 2: Using Git</h4>
                  <ol className="text-sm text-muted-foreground list-decimal ml-5 mt-1 space-y-1">
                    <li>Push your code to your repository</li>
                    <li>Configure your hosting to build from your repository using the command <code>npm run build</code></li>
                    <li>Configure your hosting to serve files from the <code>dist</code> directory</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-5 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Step 3: Domain Configuration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                In your domain registrar (like GoDaddy, Namecheap, etc.), point the DNS records for intentSim.org to your hosting provider:
              </p>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>Set an A record pointing to your hosting's IP address</li>
                <li>Set CNAME records for www.intentSim.org pointing to intentSim.org</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-5 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Step 4: HTTPS Setup</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Make sure your hosting provider enables HTTPS for your domain:
              </p>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>Many hosting providers offer free SSL certificates through Let's Encrypt</li>
                <li>Enable automatic HTTPS redirection if available</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-5 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle size={18} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Step 5: Verify the Installation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Visit intentSim.org in your web browser to ensure everything works correctly:
              </p>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>Check that all pages and features work correctly</li>
                <li>Test navigation between different sections of the application</li>
                <li>Verify that the simulation runs properly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Troubleshooting</AlertTitle>
        <AlertDescription>
          <p className="mb-2">If you encounter issues during deployment:</p>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li>Ensure the <code>.htaccess</code> file is properly uploaded and that your server has <code>mod_rewrite</code> enabled.</li>
            <li>Check that your site is showing at intentSim.org and not at intentSim.org/index.html.</li>
            <li>Verify that the server configuration has index.html set as the directory index.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DeploymentGuide;
