// RETIRED. This function used to email everyone who registered for Family
// Squares for the first time, at 8 PM Pacific on Monday. It could not tell who
// had actually shown up, and it offered membership to all of them.
//
// send-after-meeting-followup replaces it: the morning after, people who
// attended and people who missed it get different emails.
//
// The function stays deployed as a no-op so the old scheduled jobs that still
// call it get a clean answer and send nothing. It can be deleted once those
// jobs are gone.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  return new Response(
    JSON.stringify({ retired: true, sent: 0, replaced_by: "send-after-meeting-followup" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
