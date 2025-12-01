import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a session ID for tracking unique visitors
function getOrCreateSessionId(): string {
  const storageKey = 'sober_helpline_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

export type ClickType = 'card_view' | 'website_click' | 'phone_click' | 'email_click';

interface TrackClickParams {
  providerId: string;
  clickType: ClickType;
}

export function useClickTracking() {
  const trackClick = useCallback(async ({ providerId, clickType }: TrackClickParams) => {
    try {
      const sessionId = getOrCreateSessionId();
      
      const clickData = {
        provider_id: providerId,
        session_id: sessionId,
        click_type: clickType,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      };

      // Fire and forget - don't wait for response
      supabase
        .from('provider_clicks')
        .insert(clickData)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to track click:', error);
          }
        });
    } catch (error) {
      console.error('Click tracking error:', error);
    }
  }, []);

  return { trackClick };
}
