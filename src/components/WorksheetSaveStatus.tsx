import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { SaveStatus } from "@/hooks/useWorksheetPersistence";

interface Props {
  status: SaveStatus;
}

export default function WorksheetSaveStatus({ status }: Props) {
  if (status === "idle") return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      {status === "saving" && (
        <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
      )}
      {status === "saved" && (
        <><Cloud className="h-3 w-3 text-emerald-500" /> Saved</>
      )}
      {status === "error" && (
        <><CloudOff className="h-3 w-3 text-destructive" /> Save failed</>
      )}
    </span>
  );
}
