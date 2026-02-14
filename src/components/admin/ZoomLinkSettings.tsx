import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Video, ExternalLink } from "lucide-react";

export function ZoomLinkSettings() {
  const [zoomLink, setZoomLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchZoomLink();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
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
  );
}
