import { useEffect } from 'react';
import { useApp } from '../store';
import { checkAuth } from './authService';

export const useAuthCheck = () => {
  const { isAuthenticated, login } = useApp();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if we have a valid token
        const hasValidToken = await checkAuth();
        
        if (hasValidToken && !isAuthenticated) {
          // If we have a valid token but user is not authenticated,
          // try to restore session (this would require additional API calls)
          console.log('useAuthCheck: Valid token found, but session restoration not implemented yet');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear any invalid tokens
        localStorage.removeItem('weboost_access_token');
      }
    };
    
    checkAuthentication();
  }, [isAuthenticated, login]);
};