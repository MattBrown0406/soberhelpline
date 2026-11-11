import {
  Compass, HandHeart, HeartPulse, MessagesSquare, Scale, ShieldCheck, Sparkles, Sprout, Users,
  type LucideIcon,
} from "lucide-react";

// One icon per guided exercise, the same ones ExerciseCard shows, so a result
// in My Workbook and the exercise screens carry the picture she saw on the card.
const EXERCISE_ICONS: Record<string, LucideIcon> = {
  "boundary-script": ShieldCheck,
  "helping-or-enabling": Scale,
  "guilt-check": HandHeart,
  "control-sort": Compass,
  "weekly-self-care": Sprout,
  "stress-check": HeartPulse,
  "hard-moment-practice": MessagesSquare,
  "family-pulse": Users,
};

export const iconForExercise = (id: string): LucideIcon => EXERCISE_ICONS[id] ?? Sparkles;
