
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to creator dashboard
    if (isAuthenticated) {
      navigate('/creator');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Successfully logged in as creator');
        navigate('/creator');
      } else {
        toast.error('Invalid credentials. Try creator@intentsim.org / creator123');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4">
      <Helmet>
        <title>Creator Login | IntentSim</title>
      </Helmet>
      
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Creator Access</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access the creator version
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="creator@intentsim.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="text-xs text-gray-400">
              <p>For demo purposes:</p>
              <p>Email: creator@intentsim.org</p>
              <p>Password: creator123</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;
