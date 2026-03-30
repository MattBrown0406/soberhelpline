import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Save, Video, ExternalLink, Printer, MessageSquare, Phone, Mail, UserCheck, CalendarDays, ChevronDown, History } from "lucide-react";

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day <= 1 ? 1 - day : 8 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  question: string;
  request_follow_up: boolean;
  consent_email_list: boolean;
  created_at: string;
  meeting_date: string;
}

function RegistrantCard({ r, index }: { r: Registration; index: number }) {
  return (
    <div className="border border-border rounded-lg p-3 bg-muted/20 space-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">{index + 1}</span>
          <span className="font-medium text-foreground text-sm">{r.name}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
          <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" />{r.email}</a>
          <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" />{r.phone}</a>
        </div>
      </div>
      {r.question && <p className="text-xs text-muted-foreground pl-7 line-clamp-2">{r.question}</p>}
      <div className="flex gap-3 pl-7">
        {r.request_follow_up && (
          <span className="text-xs text-destructive flex items-center gap-1"><UserCheck className="h-3 w-3" />Follow-up requested</span>
        )}
        {r.consent_email_list && (
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />Email opt-in</span>
        )}
      </div>
    </div>
  );
}

export function ZoomLinkSettings() {
  const [zoomLink, setZoomLink] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  useEffect(() => {
    fetchZoomLink();
    fetchAllRegistrations();
  }, []);

  const fetchZoomLink = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["monday_zoom_link", "monday_zoom_meeting_id", "monday_zoom_passcode"]);
      if (error) throw error;
      data?.forEach((row) => {
        if (row.key === "monday_zoom_link") setZoomLink(row.value || "");
        if (row.key === "monday_zoom_meeting_id") setMeetingId(row.value || "");
        if (row.key === "monday_zoom_passcode") setPasscode(row.value || "");
      });
    } catch (err) {
      console.error("Error fetching zoom settings:", err);
      toast.error("Failed to load Zoom settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("zoom_meeting_registrations")
        .select("*")
        .order("meeting_date", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAllRegistrations(data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const nextMonday = getNextMonday();

  // Derive filtered lists
  const upcomingRegistrations = allRegistrations.filter(r => r.meeting_date === nextMonday);
  const questionsOnly = upcomingRegistrations.filter(r => r.question && r.question.trim() !== "");
  const followUpsOnly = upcomingRegistrations.filter(r => r.request_follow_up);

  // Past follow-ups (grouped by date)
  const pastFollowUps: Record<string, Registration[]> = {};
  allRegistrations.forEach(r => {
    if (r.request_follow_up && r.meeting_date !== nextMonday) {
      if (!pastFollowUps[r.meeting_date]) pastFollowUps[r.meeting_date] = [];
      pastFollowUps[r.meeting_date].push(r);
    }
  });

  // Archive: group all by date, dedup by email within each week
  const allWeeks: Record<string, Registration[]> = {};
  allRegistrations.forEach((r) => {
    if (!allWeeks[r.meeting_date]) allWeeks[r.meeting_date] = [];
    const isDuplicate = allWeeks[r.meeting_date].some(
      (existing) => existing.email.toLowerCase() === r.email.toLowerCase()
    );
    if (!isDuplicate) {
      allWeeks[r.meeting_date].push(r);
    }
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const updates = [
        { key: "monday_zoom_link", value: zoomLink.trim() },
        { key: "monday_zoom_meeting_id", value: meetingId.trim() },
        { key: "monday_zoom_passcode", value: passcode.trim() },
      ];
      for (const u of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: u.value, updated_by: user?.id })
          .eq("key", u.key);
        if (error) throw error;
      }
      toast.success("Zoom meeting settings updated successfully!");
    } catch (err) {
      console.error("Error saving zoom settings:", err);
      toast.error("Failed to save Zoom settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const nextMondayFormatted = formatDate(nextMonday);

    const questionsHtml = questionsOnly
      .map(
        (r, i) => `
        <div style="margin-bottom: 20px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <strong style="font-size: 14px;">${i + 1}. ${r.name}</strong>
            <span style="font-size: 12px; color: #6b7280;">${r.email} · ${r.phone}</span>
          </div>
          <p style="margin: 0; font-size: 15px; line-height: 1.5;">${r.question}</p>
          ${r.request_follow_up ? '<p style="margin: 6px 0 0; font-size: 12px; color: #dc2626;">⚑ Requested interventionist follow-up</p>' : ""}
        </div>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Zoom Meeting Questions - ${nextMondayFormatted}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; color: #1f2937; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
          .count { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <h1>The Family Squares Zoom — Questions</h1>
        <p class="subtitle">${nextMondayFormatted}</p>
        <p class="count">${questionsOnly.length} question${questionsOnly.length !== 1 ? "s" : ""} submitted</p>
        ${questionsOnly.length > 0 ? questionsHtml : "<p>No questions submitted for this meeting.</p>"}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Zoom Settings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Meeting Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure the Zoom meeting credentials for the The Family Squares meeting.
          The Meeting ID and Passcode power the in-browser embedded experience. The external link is a fallback.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="meetingId">Zoom Meeting ID</Label>
            <Input id="meetingId" placeholder="123 456 7890" value={meetingId} onChange={(e) => setMeetingId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passcode">Meeting Passcode</Label>
            <Input id="passcode" placeholder="abc123" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zoomLink">External Zoom Link (fallback)</Label>
          <Input id="zoomLink" type="url" placeholder="https://zoom.us/j/1234567890?pwd=..." value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" />Save Settings</>}
        </Button>

        {meetingId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <Video className="h-4 w-4 text-primary flex-shrink-0" />
            <span>In-browser join link: /join-meeting?mn={meetingId}{passcode ? `&pwd=${passcode}` : ""}</span>
          </div>
        )}
        {!meetingId && (
          <p className="text-sm text-destructive">
            ⚠️ No Meeting ID is set. Members will not be able to join the meeting in-browser after registering.
          </p>
        )}
      </div>

      <Separator />

      {/* Questions Section — only registrants who submitted questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Questions for {formatDate(nextMonday)}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {questionsOnly.length} question{questionsOnly.length !== 1 ? "s" : ""} submitted
              {upcomingRegistrations.length > 0 && ` (of ${upcomingRegistrations.length} registrants)`}
            </p>
          </div>
          <Button variant="outline" onClick={handlePrint} disabled={questionsOnly.length === 0}>
            <Printer className="h-4 w-4 mr-2" />
            Print Questions
          </Button>
        </div>

        {loadingRegistrations ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : questionsOnly.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
            No questions submitted for the upcoming Monday meeting.
          </div>
        ) : (
          <div className="space-y-3">
            {questionsOnly.map((r, i) => (
              <div key={r.id} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                    <span className="font-medium text-foreground">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground pl-8">{r.question}</p>
                <div className="flex gap-3 pl-8">
                  {r.request_follow_up && (
                    <span className="text-xs text-destructive flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />Requested interventionist follow-up
                    </span>
                  )}
                  {r.consent_email_list && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />Opted into email list
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Follow-Up Contacts Section — only registrants who requested follow-up */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Follow-Up Contact Requests
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Members who requested a private follow-up from an interventionist.
          </p>
        </div>

        {loadingRegistrations ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Week Follow-Ups */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-foreground">This Week — {formatDate(nextMonday)}</h4>
                <Badge variant="secondary" className="text-xs">{followUpsOnly.length}</Badge>
              </div>
              {followUpsOnly.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-4 ml-6">
                  No follow-up requests for the upcoming meeting yet.
                </div>
              ) : (
                <div className="space-y-2 pl-6">
                  {followUpsOnly.map((r) => (
                    <div key={r.id} className="border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="font-medium text-foreground">{r.name}</span>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" />{r.email}</a>
                        <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" />{r.phone}</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Previous Weeks Follow-Ups */}
            {Object.keys(pastFollowUps).length > 0 && (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Previous Weeks ({Object.values(pastFollowUps).reduce((sum, regs) => sum + regs.length, 0)} total requests)
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-5 pt-2">
                  {Object.entries(pastFollowUps).map(([date, regs]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-muted-foreground">{formatDate(date)}</h4>
                        <Badge variant="outline" className="text-xs">{regs.length}</Badge>
                      </div>
                      <div className="space-y-2 pl-6">
                        {regs.map((r) => (
                          <div key={r.id} className="border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-muted/30">
                            <span className="font-medium text-foreground">{r.name}</span>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" />{r.email}</a>
                              <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" />{r.phone}</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Weekly Registration Archive — includes upcoming week */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <History className="h-5 w-5" />
            Weekly Registration Archive
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            All registrations grouped by week. The upcoming meeting appears first. Duplicates are removed.
          </p>
        </div>

        {loadingRegistrations ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : Object.keys(allWeeks).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
            No meeting registrations yet.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(allWeeks).map(([date, regs]) => {
              const isUpcoming = date === nextMonday;
              return (
                <Collapsible key={date} defaultOpen={isUpcoming}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-foreground hover:bg-muted/50 border border-border rounded-lg px-4 py-3 h-auto">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatDate(date)}</span>
                        {isUpcoming && <Badge variant="default" className="text-xs">Upcoming</Badge>}
                        <Badge variant="secondary" className="text-xs">{regs.length} registrant{regs.length !== 1 ? "s" : ""}</Badge>
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2 pl-4">
                    {regs.map((r, i) => (
                      <RegistrantCard key={r.id} r={r} index={i} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
