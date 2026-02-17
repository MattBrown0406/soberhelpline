import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, CalendarDays, Clock, Ban } from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DateOverride {
  id: string;
  provider_id: string;
  override_date: string;
  is_available: boolean;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  timezone: string;
}

interface ProviderDateCalendarProps {
  providerId: string;
  timezone: string;
}

const ProviderDateCalendar = ({ providerId, timezone }: ProviderDateCalendarProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Form state for new override
  const [newOverride, setNewOverride] = useState({
    isAvailable: true,
    startTime: "09:00",
    endTime: "10:00",
    notes: "",
  });

  useEffect(() => {
    loadOverrides();
  }, [currentMonth, providerId]);

  const loadOverrides = async () => {
    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(addMonths(currentMonth, 1)), "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("provider_date_overrides")
      .select("*")
      .eq("provider_id", providerId)
      .gte("override_date", monthStart)
      .lte("override_date", monthEnd)
      .order("override_date")
      .order("start_time");

    if (!error) setOverrides(data || []);
    setLoading(false);
  };

  const addOverride = async () => {
    if (!selectedDate) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");

    const insertData: any = {
      provider_id: providerId,
      override_date: dateStr,
      is_available: newOverride.isAvailable,
      timezone,
      notes: newOverride.notes || null,
    };

    if (newOverride.isAvailable) {
      insertData.start_time = newOverride.startTime;
      insertData.end_time = newOverride.endTime;
    }

    const { error } = await supabase.from("provider_date_overrides").insert(insertData);

    if (error) {
      toast({ title: "Error", description: error.message.includes("unique") ? "A slot with that time already exists for this date." : "Failed to save override.", variant: "destructive" });
    } else {
      toast({ title: newOverride.isAvailable ? "Available slot added" : "Day marked unavailable" });
      setNewOverride({ isAvailable: true, startTime: "09:00", endTime: "10:00", notes: "" });
      loadOverrides();
    }
  };

  const removeOverride = async (id: string) => {
    const { error } = await supabase.from("provider_date_overrides").delete().eq("id", id);
    if (!error) {
      toast({ title: "Override removed" });
      loadOverrides();
    }
  };

  // Get overrides for selected date
  const selectedDateOverrides = selectedDate
    ? overrides.filter((o) => isSameDay(new Date(o.override_date + "T00:00:00"), selectedDate))
    : [];

  // Dates that have overrides (for calendar highlighting)
  const availableDates = overrides.filter((o) => o.is_available).map((o) => new Date(o.override_date + "T00:00:00"));
  const unavailableDates = overrides.filter((o) => !o.is_available).map((o) => new Date(o.override_date + "T00:00:00"));

  const modifiers = {
    hasAvailable: (date: Date) => availableDates.some((d) => isSameDay(d, date)),
    hasUnavailable: (date: Date) => unavailableDates.some((d) => isSameDay(d, date)),
  };

  const modifiersStyles = {
    hasAvailable: { backgroundColor: "hsl(var(--primary) / 0.15)", borderRadius: "50%" },
    hasUnavailable: { backgroundColor: "hsl(var(--destructive) / 0.15)", borderRadius: "50%" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Date-Specific Availability
        </CardTitle>
        <CardDescription>
          Override your recurring schedule for specific dates. Add extra slots or mark days as unavailable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className={cn("p-3 pointer-events-auto rounded-md border")}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--primary) / 0.3)" }} />
                Extra availability
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--destructive) / 0.3)" }} />
                Unavailable
              </div>
            </div>
          </div>

          {/* Selected date panel */}
          <div>
            {selectedDate ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h3>

                {/* Existing overrides for this date */}
                {selectedDateOverrides.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Current overrides:</Label>
                    {selectedDateOverrides.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {o.is_available ? (
                            <>
                              <Badge variant="default" className="text-xs">Available</Badge>
                              <span className="text-sm flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {o.start_time?.slice(0, 5)} – {o.end_time?.slice(0, 5)}
                              </span>
                            </>
                          ) : (
                            <Badge variant="destructive" className="text-xs flex items-center gap-1">
                              <Ban className="h-3 w-3" /> Unavailable All Day
                            </Badge>
                          )}
                          {o.notes && <span className="text-xs text-muted-foreground">({o.notes})</span>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeOverride(o.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new override form */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={newOverride.isAvailable}
                      onCheckedChange={(v) => setNewOverride({ ...newOverride, isAvailable: v })}
                    />
                    <Label>{newOverride.isAvailable ? "Add available time slot" : "Mark as unavailable"}</Label>
                  </div>

                  {newOverride.isAvailable && (
                    <div className="flex gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Start</Label>
                        <Input
                          type="time"
                          value={newOverride.startTime}
                          onChange={(e) => setNewOverride({ ...newOverride, startTime: e.target.value })}
                          className="w-32"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">End</Label>
                        <Input
                          type="time"
                          value={newOverride.endTime}
                          onChange={(e) => setNewOverride({ ...newOverride, endTime: e.target.value })}
                          className="w-32"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs">Notes (optional)</Label>
                    <Input
                      placeholder="e.g. Holiday, Special hours"
                      value={newOverride.notes}
                      onChange={(e) => setNewOverride({ ...newOverride, notes: e.target.value })}
                    />
                  </div>

                  <Button onClick={addOverride} size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    {newOverride.isAvailable ? "Add Time Slot" : "Mark Unavailable"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-12">
                Select a date on the calendar to manage availability.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderDateCalendar;
