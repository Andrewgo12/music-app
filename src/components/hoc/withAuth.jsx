import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

// Higher-order component for protected routes
export function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400">Please log in to access this content.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
