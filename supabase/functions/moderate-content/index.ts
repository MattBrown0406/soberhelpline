import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();
    
    if (!content && !title) {
      return new Response(
        JSON.stringify({ allowed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      // If AI is not available, allow the post (fail open for UX, but log the issue)
      return new Response(
        JSON.stringify({ allowed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const textToCheck = [title, content].filter(Boolean).join("\n\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a content moderator for a supportive family forum about addiction recovery. 

Your job is to detect content that should NOT be posted:
- Abusive language, insults, or personal attacks
- Threats of violence or harm
- Hate speech or discriminatory language
- Harassment or bullying
- Explicit profanity used aggressively

IMPORTANT: This is a forum for families dealing with addiction. Allow:
- Honest expression of frustration, anger, or pain about difficult situations
- Discussion of challenging topics like relapse, boundaries, tough love
- Emotional venting that is not directed AT other members
- Strong feelings expressed appropriately

Only flag content that is genuinely abusive, threatening, or would make other members feel unsafe.

Respond with a JSON object with these fields:
- "allowed": boolean (true if content is acceptable, false if it should be blocked)
- "reason": string (if blocked, a brief, kind explanation to show the user - be supportive, not punitive)

Example blocked response:
{"allowed": false, "reason": "Your message contains language that could feel hurtful to other members. We understand emotions run high - please try rephrasing your thoughts in a way that focuses on your feelings rather than attacking others."}

Example allowed response:
{"allowed": true}`
          },
          {
            role: "user",
            content: textToCheck
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        // Allow the post if rate limited - fail open
        return new Response(
          JSON.stringify({ allowed: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required for AI gateway");
        return new Response(
          JSON.stringify({ allowed: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ allowed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response from the AI
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      const result = JSON.parse(jsonStr.trim());
      
      return new Response(
        JSON.stringify({
          allowed: result.allowed === true,
          reason: result.reason || null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // If we can't parse, allow the post
      return new Response(
        JSON.stringify({ allowed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Content moderation error:", error);
    // Fail open - allow the post if there's an error
    return new Response(
      JSON.stringify({ allowed: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
