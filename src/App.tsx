
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import UniverseSimulation from "./pages/UniverseSimulation";
import UniverseSimulator from "./pages/UniverseSimulator";
import DataAnalysis from "./pages/DataAnalysis";
import Deployment from "./pages/Deployment";
import License from "./pages/License";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Root App component
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/index" element={<Navigate to="/" replace />} />
                  <Route path="/simulation" element={<UniverseSimulation />} />
                  <Route path="/simulator" element={<UniverseSimulator />} />
                  <Route path="/analysis" element={<DataAnalysis />} />
                  <Route path="/deployment" element={<Deployment />} />
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/license" element={<License />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
