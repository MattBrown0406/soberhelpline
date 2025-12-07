import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Allowlist of trusted podcast feed hosts to prevent SSRF attacks
const ALLOWED_HOSTS = [
  'feeds.buzzsprout.com',
  'anchor.fm',
  'feed.podbean.com',
  'feeds.libsyn.com',
  'feeds.simplecast.com',
  'rss.art19.com',
  'feeds.megaphone.fm',
  'feeds.transistor.fm',
  'www.spreaker.com',
  'feeds.acast.com',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedUrl } = await req.json();
    
    if (!feedUrl) {
      return new Response(
        JSON.stringify({ error: 'feedUrl parameter is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate URL against allowlist to prevent SSRF
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(feedUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check if the host is in our allowlist
    if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      console.warn('Blocked SSRF attempt to:', parsedUrl.hostname);
      return new Response(
        JSON.stringify({ error: 'Feed URL host is not allowed. Only trusted podcast platforms are supported.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    // Ensure HTTPS protocol
    if (parsedUrl.protocol !== 'https:') {
      return new Response(
        JSON.stringify({ error: 'Only HTTPS URLs are allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    console.log('Fetching RSS feed:', feedUrl);
    
    const response = await fetch(feedUrl);
    const xmlText = await response.text();
    
    console.log('RSS feed fetched successfully');

    // Parse the RSS XML to extract episode data
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const episodes: any[] = [];
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null && episodes.length < 3) {
      const itemContent = match[1];
      
      // Extract title
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(itemContent) || 
                        /<title>(.*?)<\/title>/.exec(itemContent);
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract description
      const descMatch = /<itunes:summary><!\[CDATA\[(.*?)\]\]><\/itunes:summary>/.exec(itemContent);
      const description = descMatch ? descMatch[1] : '';
      
      // Extract audio URL
      const enclosureMatch = /<enclosure url="(.*?)"/.exec(itemContent);
      const audioUrl = enclosureMatch ? enclosureMatch[1] : '';
      
      // Extract duration
      const durationMatch = /<itunes:duration>(\d+)<\/itunes:duration>/.exec(itemContent);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
      
      // Extract pub date
      const pubDateMatch = /<pubdate>(.*?)<\/pubdate>/i.exec(itemContent);
      const pubDate = pubDateMatch ? pubDateMatch[1] : '';
      
      if (title && audioUrl) {
        episodes.push({
          title,
          description,
          audioUrl,
          duration,
          pubDate
        });
      }
    }
    
    console.log(`Parsed ${episodes.length} episodes`);
    
    return new Response(
      JSON.stringify({ episodes }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error fetching podcast feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
