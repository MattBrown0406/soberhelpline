import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProviderAnalytics {
  provider_id: string;
  provider_name: string;
  category: string;
  city: string;
  state: string;
  total_clicks: number;
  unique_visitors: number;
  card_views: number;
  website_clicks: number;
  phone_clicks: number;
  email_clicks: number;
  clicks_last_30_days: number;
}

interface ProviderWithEmail {
  id: string;
  provider_name: string;
  email: string;
  submitted_by: string;
  category: string;
  city: string;
  state: string;
}

function formatNumber(num: number | null): string {
  return (num || 0).toLocaleString();
}

function getMonthYear(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function generateEmailHtml(
  providerName: string,
  analytics: ProviderAnalytics[],
  monthYear: string
): string {
  const listingsHtml = analytics.map(listing => `
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #16a34a;">
      <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;">${listing.provider_name}</h3>
      <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px;">${listing.category} • ${listing.city}, ${listing.state}</p>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Profile Views</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #1e293b;">
            ${formatNumber(listing.card_views)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Unique Visitors</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #1e293b;">
            ${formatNumber(listing.unique_visitors)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Website Clicks</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #16a34a;">
            ${formatNumber(listing.website_clicks)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Phone Clicks</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #16a34a;">
            ${formatNumber(listing.phone_clicks)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Email Clicks</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #16a34a;">
            ${formatNumber(listing.email_clicks)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <span style="color: #64748b;">Last 30 Days Activity</span>
          </td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e293b;">
            ${formatNumber(listing.clicks_last_30_days)} clicks
          </td>
        </tr>
      </table>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://soberhelpline.lovable.app/lovable-uploads/e3e9bf01-a493-4d24-9ebd-1c71dd37f1b2.png" alt="Sober Helpline" style="max-width: 200px; height: auto;">
        </div>
        
        <!-- Main Card -->
        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Green Header Bar -->
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">Monthly Analytics Report</h1>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${monthYear}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <!-- Gratitude Message -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
              <p style="margin: 0; color: #166534; font-size: 16px; line-height: 1.6;">
                <strong>Thank you for being part of the Sober Helpline community!</strong>
              </p>
              <p style="margin: 12px 0 0 0; color: #166534; font-size: 15px; line-height: 1.6;">
                We are deeply grateful for your partnership in helping families find hope and recovery. Every view, every click, every connection represents a family reaching out for help — and your listing is there to answer that call.
              </p>
            </div>
            
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
              Here's how your listing${analytics.length > 1 ? 's have' : ' has'} performed this past month:
            </p>
            
            <!-- Analytics Cards -->
            ${listingsHtml}
            
            <!-- Hope Message -->
            <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0; margin-top: 24px;">
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">
                We hope these numbers represent meaningful connections — families finding the help they need, and your organization making a difference in their lives.
              </p>
            </div>
            
            <!-- Contact Section -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #1e293b; font-size: 15px;">
                <strong>Questions or feedback?</strong>
              </p>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                We're here to help. Reach out anytime at:
              </p>
              <p style="margin: 12px 0 0 0;">
                <a href="tel:541-241-5886" style="color: #16a34a; text-decoration: none; font-weight: 600;">541-241-5886</a>
                <span style="color: #cbd5e1; margin: 0 8px;">|</span>
                <a href="mailto:support@soberhelpline.com" style="color: #16a34a; text-decoration: none; font-weight: 600;">support@soberhelpline.com</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #1e293b; padding: 24px; text-align: center;">
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
              © ${new Date().getFullYear()} Sober Helpline. All rights reserved.
            </p>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 12px;">
              Helping families find hope, one connection at a time.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting monthly provider analytics email job...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all approved providers with their submitter info
    const { data: providers, error: providersError } = await supabase
      .from("provider_submissions")
      .select("id, provider_name, email, submitted_by, category, city, state")
      .eq("status", "approved");

    if (providersError) {
      console.error("Error fetching providers:", providersError);
      throw new Error("Failed to fetch providers");
    }

    console.log(`Found ${providers?.length || 0} approved providers`);

    // Get all analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from("provider_click_analytics")
      .select("*");

    if (analyticsError) {
      console.error("Error fetching analytics:", analyticsError);
      throw new Error("Failed to fetch analytics");
    }

    // Create a map of analytics by provider_id
    const analyticsMap = new Map<string, ProviderAnalytics>();
    for (const a of analytics || []) {
      analyticsMap.set(a.provider_id, a);
    }

    // Group providers by submitted_by (the account creator)
    const providersBySubmitter = new Map<string, ProviderWithEmail[]>();
    for (const provider of providers || []) {
      if (!provider.submitted_by) continue;
      
      const existing = providersBySubmitter.get(provider.submitted_by) || [];
      existing.push(provider);
      providersBySubmitter.set(provider.submitted_by, existing);
    }

    console.log(`Grouped into ${providersBySubmitter.size} unique submitters`);

    const monthYear = getMonthYear();
    let emailsSent = 0;
    let emailsFailed = 0;

    // Send email to each provider account holder
    for (const [submitterId, providerList] of providersBySubmitter) {
      // Get the email from the first provider (they all belong to the same submitter)
      const primaryEmail = providerList[0].email;
      const providerName = providerList[0].provider_name;

      // Gather analytics for all their listings
      const listingAnalytics: ProviderAnalytics[] = [];
      for (const provider of providerList) {
        const providerAnalytics = analyticsMap.get(provider.id);
        if (providerAnalytics) {
          listingAnalytics.push(providerAnalytics);
        } else {
          // Include listing even without analytics (shows zeros)
          listingAnalytics.push({
            provider_id: provider.id,
            provider_name: provider.provider_name,
            category: provider.category,
            city: provider.city || "",
            state: provider.state || "",
            total_clicks: 0,
            unique_visitors: 0,
            card_views: 0,
            website_clicks: 0,
            phone_clicks: 0,
            email_clicks: 0,
            clicks_last_30_days: 0,
          });
        }
      }

      const emailHtml = generateEmailHtml(providerName, listingAnalytics, monthYear);

      try {
        const emailResponse = await resend.emails.send({
          from: "Sober Helpline <noreply@soberhelpline.com>",
          to: [primaryEmail],
          subject: `Your Sober Helpline Analytics Report - ${monthYear}`,
          html: emailHtml,
        });

        console.log(`Email sent to ${primaryEmail}:`, emailResponse);
        emailsSent++;
      } catch (emailError) {
        console.error(`Failed to send email to ${primaryEmail}:`, emailError);
        emailsFailed++;
      }
    }

    console.log(`Monthly analytics emails complete. Sent: ${emailsSent}, Failed: ${emailsFailed}`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        emailsFailed,
        totalProviders: providersBySubmitter.size,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-monthly-provider-analytics:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
