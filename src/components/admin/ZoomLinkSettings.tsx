import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Save, Video, ExternalLink, Printer, MessageSquare, Phone, Mail, UserCheck, CalendarDays, ChevronDown, History, MousePointerClick, Users, UserX, Share2, RefreshCw, ShieldAlert } from "lucide-react";

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

function RegistrantCard({ r, index, isBlocked }: { r: Registration; index: number; isBlocked?: boolean }) {
  return (
    <div className={`border rounded-lg p-3 space-y-1 ${isBlocked ? "border-destructive bg-destructive/10" : "border-border bg-muted/20"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">{index + 1}</span>
          <span className="font-medium text-foreground text-sm">{r.name}</span>
          {isBlocked && (
            <Badge variant="destructive" className="text-[10px] gap-1">
              <ShieldAlert className="h-3 w-3" />
              BLOCKED — DO NOT ADMIT
            </Badge>
          )}
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
  const [blocklist, setBlocklist] = useState<{ emails: Set<string>; lastNames: Set<string> }>({ emails: new Set(), lastNames: new Set() });

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
        <h1>“The Family Squares” Zoom — Questions</h1>
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
          Configure the Zoom meeting credentials for the “The Family Squares” meeting.
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

      <Separator />

      {/* Attendance Tracking Section */}
      <AttendanceTracking nextMonday={nextMonday} />
    </div>
  );
}

interface ClickRecord {
  id: string;
  registration_name: string;
  registration_email: string;
  meeting_date: string;
  clicked_at: string;
}

interface AttendanceRecord {
  id: string;
  participant_name: string;
  participant_email: string | null;
  meeting_date: string;
  join_time: string;
  leave_time: string | null;
  duration_minutes: number;
  registration_id: string | null;
}

function AttendanceTracking({ nextMonday }: { nextMonday: string }) {
  const [clicks, setClicks] = useState<ClickRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(nextMonday);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clicksRes, attendanceRes] = await Promise.all([
        supabase
          .from("zoom_link_clicks")
          .select("*")
          .eq("meeting_date", selectedDate)
          .order("clicked_at", { ascending: false }),
        supabase
          .from("zoom_attendance")
          .select("*")
          .eq("meeting_date", selectedDate)
          .order("join_time", { ascending: true }),
      ]);

      setClicks((clicksRes.data as ClickRecord[]) || []);
      setAttendance((attendanceRes.data as AttendanceRecord[]) || []);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAttendance = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-zoom-attendance", {
        body: { meeting_date: selectedDate },
      });
      if (error) throw error;
      toast.success(`Synced ${data.synced} participants. ${data.no_shows?.length || 0} no-shows detected.`);
      fetchData();
    } catch (err: any) {
      console.error("Sync error:", err);
      toast.error(err.message || "Failed to sync attendance");
    } finally {
      setSyncing(false);
    }
  };

  // Deduplicate clicks by email to get unique clickers
  const uniqueClickers = new Map<string, ClickRecord>();
  clicks.forEach(c => {
    if (!uniqueClickers.has(c.registration_email.toLowerCase())) {
      uniqueClickers.set(c.registration_email.toLowerCase(), c);
    }
  });

  // Detect potential sharing: registration emails with 2+ clicks
  const clickCountByEmail = new Map<string, number>();
  clicks.forEach(c => {
    const key = c.registration_email.toLowerCase();
    clickCountByEmail.set(key, (clickCountByEmail.get(key) || 0) + 1);
  });
  const sharingIndicators = Array.from(clickCountByEmail.entries())
    .filter(([_, count]) => count >= 2)
    .map(([email, count]) => {
      const click = clicks.find(c => c.registration_email.toLowerCase() === email);
      return { name: click?.registration_name || email, email, clicks: count };
    });

  // Get available dates for the dropdown
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  useEffect(() => {
    const fetchDates = async () => {
      const { data } = await supabase
        .from("zoom_meeting_registrations")
        .select("meeting_date")
        .order("meeting_date", { ascending: false });
      const dates = [...new Set((data || []).map((d: any) => d.meeting_date))];
      if (!dates.includes(nextMonday)) dates.unshift(nextMonday);
      setAvailableDates(dates);
    };
    fetchDates();
  }, [nextMonday]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            Attendance Tracking
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track who clicked the join link and who actually attended.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {availableDates.map(d => (
              <option key={d} value={d}>{formatDate(d)}{d === nextMonday ? " (Upcoming)" : ""}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={handleSyncAttendance} disabled={syncing}>
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Sync from Zoom
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-border rounded-lg p-3 text-center">
              <MousePointerClick className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-foreground">{uniqueClickers.size}</p>
              <p className="text-xs text-muted-foreground">Link Clicks</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-foreground">{attendance.length}</p>
              <p className="text-xs text-muted-foreground">Attendees</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <UserX className="h-5 w-5 mx-auto mb-1 text-destructive" />
              <p className="text-2xl font-bold text-foreground">
                {Math.max(0, uniqueClickers.size - attendance.length)}
              </p>
              <p className="text-xs text-muted-foreground">Clicked, Didn't Join</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <Share2 className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-foreground">{sharingIndicators.length}</p>
              <p className="text-xs text-muted-foreground">Shared Links</p>
            </div>
          </div>

          {/* Family Sharing Alerts */}
          {sharingIndicators.length > 0 && (
            <div className="border border-primary/30 bg-primary/5 rounded-lg p-4">
              <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
                <Share2 className="h-4 w-4 text-primary" />
                Family Sharing Detected
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                These registrants appear to have shared their link — multiple clicks detected from the same registration.
              </p>
              <div className="space-y-2">
                {sharingIndicators.map(s => (
                  <div key={s.email} className="flex items-center justify-between bg-background rounded p-2 border border-border">
                    <div>
                      <span className="font-medium text-sm text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{s.email}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{s.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link Clicks */}
          {clicks.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-foreground hover:bg-muted/50 border border-border rounded-lg px-4 py-3 h-auto">
                  <span className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-primary" />
                    <span className="font-medium">Link Clicks</span>
                    <Badge variant="secondary" className="text-xs">{clicks.length} total</Badge>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2 pl-4">
                {clicks.map(c => (
                  <div key={c.id} className="border border-border rounded-lg p-3 bg-muted/20 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm text-foreground">{c.registration_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{c.registration_email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.clicked_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Zoom Attendance */}
          {attendance.length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-foreground hover:bg-muted/50 border border-border rounded-lg px-4 py-3 h-auto">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">Zoom Participants</span>
                    <Badge variant="secondary" className="text-xs">{attendance.length} attendees</Badge>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2 pl-4">
                {attendance.map(a => (
                  <div key={a.id} className="border border-border rounded-lg p-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm text-foreground">{a.participant_name}</span>
                        {a.participant_email && <span className="text-xs text-muted-foreground ml-2">{a.participant_email}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={a.registration_id ? "default" : "outline"} className="text-xs">
                          {a.registration_id ? "Registered" : "Walk-in"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{a.duration_minutes} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {clicks.length === 0 && attendance.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              No tracking data yet for this date. Click "Sync from Zoom" after the meeting ends to pull attendance.
            </div>
          )}
        </>
      )}
    </div>
  );
}
