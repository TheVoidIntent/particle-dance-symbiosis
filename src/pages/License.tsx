
import React from 'react';
import { Helmet } from 'react-helmet';

const License: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>License | IntentSim</title>
        <meta name="description" content="License information for the IntentSim simulation framework" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">License Information</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            IntentSim is protected under copyright by TheVoidIntent LLC
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <div className="p-6 border rounded-lg bg-card">
            <h2>MIT License with Research-Only Restriction</h2>
            
            <h3 className="text-primary">Copyright (c) 2025 TheVoidIntent LLC</h3>
            
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md my-6">
              <h3 className="text-destructive">Research-Only Clause:</h3>
              <p className="font-medium">
                This license is granted strictly for academic, scientific, and personal research purposes.
                Commercial use, sale, or redistribution of this Software or its derivatives
                is prohibited without prior written consent from TheVoidIntent LLC.
              </p>
            </div>
            
            <p>
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            
            <p className="text-sm text-muted-foreground mt-6">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
          
          <div className="mt-8">
            <h3>Contact Information</h3>
            <p>
              For licensing inquiries or permission requests, please contact:
              <br />
              <a href="mailto:licensing@thevoidintent.com" className="text-primary">
                licensing@thevoidintent.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default License;
