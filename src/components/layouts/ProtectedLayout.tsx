
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { toast } from 'sonner';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to access the creator version');
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isCreatorVersion={true} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
