import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Hook to handle native back button on iOS/Android
 * Navigates back in history or exits app if at root
 */
export function useNativeBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleBackButton = () => {
      if (location.pathname === '/' || location.pathname === '') {
        // At root, minimize app (Android) or do nothing (iOS handles this)
        App.minimizeApp?.();
      } else {
        navigate(-1);
      }
    };

    // Listen for hardware back button (Android)
    App.addListener('backButton', handleBackButton);

    return () => {
      App.removeAllListeners();
    };
  }, [navigate, location.pathname]);
}
