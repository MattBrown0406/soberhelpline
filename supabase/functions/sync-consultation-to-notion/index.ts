import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOTION_API_TOKEN = Deno.env.get('NOTION_API_TOKEN');
const CRM_DB_ID = '2bb286dad2cf81499fc8d8151ee033a8';
const CALL_LOG_DB_ID = '314286dad2cf817dbfbcd6c2e94894fb';

interface ConsultationPayload {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  amountPaid: number;
  providerName: string;
  coachingPlan?: {
    planType: string;
    sessionNumber: number;
    totalSessions: number;
  };
  intakeResponses?: Record<string, string>;
}

async function searchNotionCRMByEmail(email: string): Promise<any> {
  const response = await fetch(`https://api.notion.com/v1/databases/${CRM_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        property: 'Email',
        email: {
          equals: email.toLowerCase().trim()
        }
      }
    }),
  });

  if (!response.ok) {
    console.error('Notion search error:', await response.text());
    return null;
  }

  const data = await response.json();
  return data.results.length > 0 ? data.results[0] : null;
}

async function createNotionCRMRecord(payload: ConsultationPayload): Promise<string | null> {
  const isCoachingPlan = !!payload.coachingPlan;
  
  const properties: any = {
    'Name': {
      title: [{ text: { content: payload.clientName } }]
    },
    'Email': {
      email: payload.clientEmail
    },
    'Status': {
      status: { name: isCoachingPlan ? 'Scheduled' : 'Lead' }
    },
    'Stage': {
      select: { name: isCoachingPlan ? 'Booked' : 'Consultation' }
    },
    'Lead Source': {
      select: { name: 'Website' }
    },
    'Last Contact': {
      date: { start: new Date().toISOString().split('T')[0] }
    }
  };

  // Add phone if provided
  if (payload.clientPhone) {
    properties['Phone'] = {
      phone_number: payload.clientPhone
    };
  }

  // Add coaching details if it's a coaching plan
  if (isCoachingPlan && payload.coachingPlan) {
    properties['Service Type'] = {
      select: { name: 'Coaching' }
    };
    
    // Set coaching type based on plan type
    const coachingTypeMap: Record<string, string> = {
      'parallel-recovery': 'Recovery Coaching',
      'stabilization': 'Family Coaching'
    };
    
    if (coachingTypeMap[payload.coachingPlan.planType]) {
      properties['Coaching Type'] = {
        select: { name: coachingTypeMap[payload.coachingPlan.planType] }
      };
    }
    
    properties['Coaching Revenue'] = { number: payload.amountPaid };
    properties['Session Count'] = { number: payload.coachingPlan.sessionNumber };
    
    const planLabel = payload.coachingPlan.planType === 'parallel-recovery' 
      ? 'Parallel Recovery Program™' 
      : 'Family Stabilization Plan™';
    
    properties['Next Step'] = {
      rich_text: [{
        text: { 
          content: `${planLabel} - Session ${payload.coachingPlan.sessionNumber} of ${payload.coachingPlan.totalSessions} scheduled for ${payload.bookingDate} at ${payload.startTime} with ${payload.providerName}` 
        }
      }]
    };
  } else {
    // Consultation
    properties['Quoted Price'] = { number: payload.amountPaid };
    properties['Next Step'] = {
      rich_text: [{
        text: { 
          content: `Consultation scheduled for ${payload.bookingDate} at ${payload.startTime} with ${payload.providerName}` 
        }
      }]
    };
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: CRM_DB_ID },
      properties
    }),
  });

  if (!response.ok) {
    console.error('Notion create error:', await response.text());
    return null;
  }

  const data = await response.json();
  return data.id;
}

async function updateNotionCRMRecord(pageId: string): Promise<boolean> {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      properties: {
        'Last Contact': {
          date: { start: new Date().toISOString().split('T')[0] }
        }
      }
    }),
  });

  return response.ok;
}

async function createCallLogEntry(crmPageId: string, payload: ConsultationPayload): Promise<boolean> {
  const isCoachingPlan = !!payload.coachingPlan;
  
  let notes = `${isCoachingPlan ? 'Coaching session' : 'Consultation'} booked via SoberHelpline for ${payload.bookingDate} at ${payload.startTime}-${payload.endTime} with ${payload.providerName}. Amount: $${payload.amountPaid.toFixed(2)}`;
  
  if (payload.coachingPlan) {
    const planLabel = payload.coachingPlan.planType === 'parallel-recovery' 
      ? 'Parallel Recovery Program™' 
      : 'Family Stabilization Plan™';
    notes += `\n${planLabel} - Session ${payload.coachingPlan.sessionNumber} of ${payload.coachingPlan.totalSessions}`;
  }
  
  if (payload.intakeResponses && Object.keys(payload.intakeResponses).length > 0) {
    notes += '\n\nIntake Responses:\n';
    for (const [question, answer] of Object.entries(payload.intakeResponses)) {
      notes += `${question}: ${answer}\n`;
    }
  }

  const properties = {
    'CRM': {
      relation: [{ id: crmPageId }]
    },
    'Date': {
      date: { start: new Date().toISOString().split('T')[0] }
    },
    'Type': {
      select: { name: isCoachingPlan ? 'Booking - Coaching' : 'Booking - Consultation' }
    },
    'Notes': {
      rich_text: [{
        text: { content: notes }
      }]
    }
  };

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: CALL_LOG_DB_ID },
      properties
    }),
  });

  if (!response.ok) {
    console.error('Call log create error:', await response.text());
    return false;
  }

  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_API_TOKEN) {
      throw new Error('NOTION_API_TOKEN not configured');
    }

    // Get booking data from the request
    const { bookingId } = await req.json();
    
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    // Use service role to fetch booking details
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch booking with provider and plan info
    const { data: booking, error: bookingError } = await supabase
      .from('consultation_bookings')
      .select(`
        *,
        consultation_providers (
          full_name
        ),
        coaching_plans (
          plan_type,
          total_sessions,
          completed_sessions
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    console.log('Syncing consultation to Notion:', {
      email: booking.client_email,
      date: booking.booking_date,
      provider: booking.consultation_providers?.full_name
    });

    const payload: ConsultationPayload = {
      clientName: booking.client_name,
      clientEmail: booking.client_email,
      clientPhone: booking.client_phone,
      bookingDate: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      amountPaid: booking.amount_paid,
      providerName: booking.consultation_providers?.full_name || 'Unknown Provider',
      intakeResponses: booking.intake_responses as Record<string, string> | undefined
    };

    // Add coaching plan info if present
    if (booking.coaching_plans) {
      payload.coachingPlan = {
        planType: booking.coaching_plans.plan_type,
        sessionNumber: (booking.coaching_plans.completed_sessions || 0) + 1,
        totalSessions: booking.coaching_plans.total_sessions
      };
    }

    // Check if contact already exists
    const existingContact = await searchNotionCRMByEmail(payload.clientEmail);
    
    let crmPageId: string;
    
    if (existingContact) {
      // Update existing contact
      crmPageId = existingContact.id;
      await updateNotionCRMRecord(crmPageId);
      console.log('Updated existing CRM contact:', crmPageId);
    } else {
      // Create new contact
      const newPageId = await createNotionCRMRecord(payload);
      if (!newPageId) {
        throw new Error('Failed to create CRM record');
      }
      crmPageId = newPageId;
      console.log('Created new CRM contact:', crmPageId);
    }

    // Create call log entry
    const callLogCreated = await createCallLogEntry(crmPageId, payload);
    if (!callLogCreated) {
      console.error('Failed to create call log entry, but continuing...');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      crmPageId,
      isNewContact: !existingContact,
      callLogCreated 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error syncing consultation to Notion:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});