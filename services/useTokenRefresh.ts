import { useEffect } from 'react';
import { getAccessToken, getRefreshToken, refreshAccessToken } from './authService';

/**
 * Hook to automatically refresh the access token before it expires
 */
export const useTokenRefresh = () => {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        
        // If we don't have tokens, don't do anything
        if (!accessToken || !refreshToken) {
          return;
        }
        
        // Decode the JWT to check expiration
        const decodeJWT = (token: string): any => {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(jsonPayload);
          } catch (error) {
            return null;
          }
        };
        
        const payload = decodeJWT(accessToken);
        
        if (payload && payload.exp) {
          // Check if token will expire in the next 5 minutes
          const expiresIn = payload.exp * 1000 - Date.now();
          const fiveMinutesInMs = 5 * 60 * 1000;
          
          if (expiresIn < fiveMinutesInMs) {
            console.log('Token will expire soon, refreshing...');
            
            try {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
                await refreshAccessToken(refreshToken);
              
              // Store the new tokens
              localStorage.setItem('weboost_access_token', newAccessToken);
              localStorage.setItem('weboost_refresh_token', newRefreshToken);
              
              console.log('Token refreshed successfully');
            } catch (error) {
              console.error('Failed to refresh token:', error);
              // Clear tokens if refresh fails
              localStorage.removeItem('weboost_access_token');
              localStorage.removeItem('weboost_refresh_token');
            }
          }
        }
      } catch (error) {
        console.error('Error in token refresh check:', error);
      }
    };
    
    // Check token every minute
    const interval = setInterval(checkAndRefreshToken, 60 * 1000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
    
  }, []);
};