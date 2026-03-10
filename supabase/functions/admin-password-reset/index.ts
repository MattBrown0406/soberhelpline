import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate recovery link via admin API (bypasses rate limits)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: 'https://soberhelpline.com/auth',
      },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resetLink = data?.properties?.action_link;

    // Send via SendGrid
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'matt@soberhelpline.com', name: 'Sober Helpline' },
        subject: 'Reset Your Password — Sober Helpline',
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a;">Reset Your Password</h2>
              <p style="color: #555; line-height: 1.6;">Hi Kimberly,</p>
              <p style="color: #555; line-height: 1.6;">We received a request to reset your password for your Sober Helpline account. Click the button below to set a new password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset My Password</a>
              </div>
              <p style="color: #555; line-height: 1.6;">After resetting your password, you can log in and reactivate your membership at <a href="https://soberhelpline.com/family-membership" style="color: #16a34a;">soberhelpline.com/family-membership</a>.</p>
              <p style="color: #555; line-height: 1.6;">If you didn't request this, you can safely ignore this email.</p>
              <p style="color: #555; line-height: 1.6;">— The Sober Helpline Team</p>
            </div>
          `
        }]
      }),
    });

    if (!sgResponse.ok) {
      const sgError = await sgResponse.text();
      return new Response(JSON.stringify({ error: `SendGrid error: ${sgError}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Password reset email sent to ${email}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
