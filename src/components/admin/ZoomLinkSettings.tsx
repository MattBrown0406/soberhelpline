import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, Video, ExternalLink, Printer, MessageSquare, Phone, Mail, UserCheck } from "lucide-react";

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon
  const daysUntilMonday = day <= 1 ? 1 - day : 8 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  return next.toISOString().split("T")[0];
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

export function ZoomLinkSettings() {
  const [zoomLink, setZoomLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  useEffect(() => {
    fetchZoomLink();
    fetchRegistrations();
  }, []);

  const fetchZoomLink = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "monday_zoom_link")
        .maybeSingle();
      if (error) throw error;
      setZoomLink(data?.value || "");
    } catch (err) {
      console.error("Error fetching zoom link:", err);
      toast.error("Failed to load Zoom link");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const nextMonday = getNextMonday();
      const { data, error } = await supabase
        .from("zoom_meeting_registrations")
        .select("*")
        .eq("meeting_date", nextMonday)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("site_settings")
        .update({ value: zoomLink.trim(), updated_by: user?.id })
        .eq("key", "monday_zoom_link");
      if (error) throw error;
      toast.success("Zoom meeting link updated successfully!");
    } catch (err) {
      console.error("Error saving zoom link:", err);
      toast.error("Failed to save Zoom link");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const nextMonday = formatDate(getNextMonday());

    const questionsHtml = registrations
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
        <title>Zoom Meeting Questions - ${nextMonday}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; color: #1f2937; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
          .count { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <h1>Monday Night Family Support Zoom — Questions</h1>
        <p class="subtitle">${nextMonday}</p>
        <p class="count">${registrations.length} registered attendee${registrations.length !== 1 ? "s" : ""}</p>
        ${registrations.length > 0 ? questionsHtml : "<p>No registrations yet for this meeting.</p>"}
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
      {/* Zoom Link Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Meeting Link</h3>
        <p className="text-sm text-muted-foreground">
          Update the Zoom meeting link for the Monday night family support meeting.
          When a member registers, they'll receive an email with this link.
        </p>
        <div className="space-y-2">
          <Label htmlFor="zoomLink">Monday Night Zoom Meeting Link</Label>
          <div className="flex gap-3">
            <Input
              id="zoomLink"
              type="url"
              placeholder="https://zoom.us/j/1234567890?pwd=..."
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" />Save</>}
            </Button>
          </div>
        </div>
        {zoomLink && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <Video className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">Current link: {zoomLink}</span>
            <a href={zoomLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <ExternalLink className="h-4 w-4 text-primary hover:text-primary/80" />
            </a>
          </div>
        )}
        {!zoomLink && (
          <p className="text-sm text-destructive">
            ⚠️ No Zoom link is set. Members who register will not receive a meeting link in their confirmation email.
          </p>
        )}
      </div>

      <Separator />

      {/* Questions List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Questions for {formatDate(getNextMonday())}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {registrations.length} registered attendee{registrations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="outline" onClick={handlePrint} disabled={registrations.length === 0}>
            <Printer className="h-4 w-4 mr-2" />
            Print Questions
          </Button>
        </div>

        {loadingRegistrations ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
            No registrations yet for the upcoming Monday meeting.
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((r, i) => (
              <div key={r.id} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {i + 1}
                    </span>
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
                      <UserCheck className="h-3 w-3" />
                      Requested interventionist follow-up
                    </span>
                  )}
                  {r.consent_email_list && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Opted into email list
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
