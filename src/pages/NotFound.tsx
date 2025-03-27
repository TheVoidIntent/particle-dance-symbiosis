
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-500">404</h1>
        <div className="mt-4 mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Universe Not Found</h2>
          <p className="text-gray-400">
            The intent field you're looking for doesn't exist in this dimension.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
