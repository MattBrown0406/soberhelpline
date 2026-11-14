// RETIRED 2026-11-14 at the owner's request. This function used to email
// non-members an offer to "lock in $14.99/month before the price triples".
// Membership is $9.99 a month, so that offer is wrong and must never go out
// again.
//
// The function stays deployed as a no-op so anything that still calls it (an
// old scheduled job, a saved request) gets a clean answer and sends nothing.
// It reads no data and has no email code left in it.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  return new Response(
    JSON.stringify({ retired: true, sent: 0 }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
