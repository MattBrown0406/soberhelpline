import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// One consistent safety note for guides and tools that ask families to step
// back, hold a boundary, or get through a dangerous moment. The education in
// this library assumes nobody is in immediate danger; this box says what to do
// when that isn't true. Pick the topics that apply to the page.

export type SafetyTopic = "emergency" | "suicide" | "overdose" | "withdrawal" | "violence";

const TOPIC_TEXT: Record<SafetyTopic, { lead: string; body: string }> = {
  emergency: {
    lead: "If anyone is in immediate danger, call 911.",
    body: "That includes a possible overdose, someone who can't be woken, a seizure, or anyone threatening to hurt themselves or someone else. Calling for help is not rescuing or enabling.",
  },
  suicide: {
    lead: "Any talk of suicide: call or text 988.",
    body: "You don't have to decide whether they mean it. The 988 Suicide & Crisis Lifeline will help you work out what to do next, and you can call for yourself too. Your boundary can still stand afterwards.",
  },
  overdose: {
    lead: "Overdose risk is highest after a break from using.",
    body: "After detox, treatment, jail, or any stretch without using, tolerance drops, and the amount they used before can now kill them. If opioids are involved (including pills that may contain fentanyl), keep naloxone (Narcan) where you can reach it and learn how to use it. Many pharmacies sell it without a prescription.",
  },
  withdrawal: {
    lead: "Stopping alcohol or benzodiazepines suddenly can be dangerous.",
    body: "Someone who drinks heavily every day, or takes benzodiazepines (Xanax, Klonopin, Ativan, Valium), can have seizures or life-threatening withdrawal if they stop all at once. They need medical help to stop. Confusion, shaking, or seeing things in the days after stopping is an emergency: call 911.",
  },
  violence: {
    lead: "If you are afraid of them, your safety comes before any boundary.",
    body: "If there has been violence, threats, or intimidation, don't announce a boundary or a consequence when you're alone with them. Make a safety plan first. The National Domestic Violence Hotline is 1-800-799-7233 (or text START to 88788), any time, for partners and for parents.",
  },
};

interface SafetyBoxProps {
  topics: SafetyTopic[];
  /** Heading above the notes. */
  title?: string;
  className?: string;
}

export default function SafetyBox({ topics, title = "Before you use this guide: safety comes first", className }: SafetyBoxProps) {
  return (
    <aside
      aria-label="Safety information"
      className={cn(
        "mb-6 rounded-xl border-2 border-amber-400/70 bg-amber-50 p-5 text-amber-950 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-50 print:break-inside-avoid print:border-foreground/40",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="m-0 text-base font-semibold leading-snug">{title}</p>
      </div>
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic} className="text-sm leading-relaxed">
            <strong className="font-semibold">{TOPIC_TEXT[topic].lead}</strong> {TOPIC_TEXT[topic].body}
          </li>
        ))}
      </ul>
    </aside>
  );
}
