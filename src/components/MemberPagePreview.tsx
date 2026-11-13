import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { LIBRARY_TYPE_TOTALS, pillars } from "@/data/memberLibrary";
import { ACTIVE_TOPICS } from "@/lib/forumTopics";

// What a visitor sees beside the "members only" card: a look at what is behind
// it, so the lock is not a dead end. Everything here is public information
// (names of sections, counts, and guides that are already free to read).

interface Preview {
  heading: string;
  intro: string;
  items: { title: string; detail?: string }[];
  links: { label: string; to: string }[];
}

const libraryTotal = LIBRARY_TYPE_TOTALS.guide + LIBRARY_TYPE_TOTALS.worksheet + LIBRARY_TYPE_TOTALS.meditation;
const librarySize = `${Math.max(60, Math.floor(libraryTotal / 10) * 10)}+`;

const sampleGuides = [
  { label: "Boundary Drift: How Limits Slowly Erode", to: "/boundary-drift" },
  { label: "Crisis vs. Chaos Decision Guide", to: "/crisis-chaos" },
  { label: "The Hidden Cost of Being the \"Strong One\"", to: "/strong-one" },
];

const libraryPreview: Preview = {
  heading: "Inside the family education library",
  intro: `${librarySize} guides, tools and guided meditations in six parts. Members follow them as a path, with their place saved.`,
  items: pillars.map((pillar) => {
    const count = (pillar.resources ?? pillar.subcategories?.flatMap((s) => s.resources) ?? []).length;
    return { title: `${pillar.number}. ${pillar.title}`, detail: `${count} guides and tools` };
  }),
  links: sampleGuides,
};

const forumPreview: Preview = {
  heading: "Inside the private family forum",
  intro: "Families post under a username, not their real name. These are the rooms:",
  items: ACTIVE_TOPICS.slice(0, 5).map((topic) => ({ title: topic.title, detail: topic.description })),
  links: [{ label: "How the forum works", to: "/family-support-forum" }],
};

const recordingsPreview: Preview = {
  heading: "Inside the recordings",
  intro: "Every Monday meeting is recorded. Members can go back to any of them.",
  items: [
    { title: "Past Family Squares meetings", detail: "Watch the full hour on your own schedule, including the weeks you missed." },
    { title: "Questions and answers", detail: "The questions families asked, with the answers given in the meeting." },
    { title: "The private forum thread for each week", detail: "Keep talking about what came up after the meeting ends." },
  ],
  links: [{ label: "The live meeting is free. Save a spot for Monday", to: "/family-squares" }],
};

const promptsPreview: Preview = {
  heading: "Inside the AI conversation starters",
  intro: "Three prompts you fill in and paste into any AI chat tool. Each one carries its own safety rules.",
  items: [
    { title: "Helping or enabling?", detail: "Think a decision through honestly before you act." },
    { title: "Put a boundary into words", detail: "Turn what you mean into a sentence you can say and hold." },
    { title: "Prepare for a treatment call", detail: "Know what to ask before you phone a program." },
  ],
  links: sampleGuides.slice(0, 2),
};

function previewFor(path: string): Preview {
  if (path.startsWith("/family-forum")) return forumPreview;
  if (path.startsWith("/zoom-recordings") || path.startsWith("/member-qa")) return recordingsPreview;
  if (path.startsWith("/ai-prompts")) return promptsPreview;
  return libraryPreview;
}

const MemberPagePreview = ({ path }: { path: string }) => {
  const preview = previewFor(path);
  return (
    <section className="w-full max-w-md" aria-labelledby="member-preview-heading">
      <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-logo-blue">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        A look inside
      </p>
      <h2 id="member-preview-heading" className="text-xl font-bold text-foreground">
        {preview.heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{preview.intro}</p>
      <ul className="mt-4 space-y-3">
        {preview.items.map((item) => (
          <li key={item.title} className="rounded-lg border border-border bg-card p-3">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            {item.detail && <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>}
          </li>
        ))}
      </ul>
      {preview.links.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-foreground">Open to everyone right now</p>
          <ul className="mt-2 space-y-1.5">
            {preview.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm font-medium text-logo-blue hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default MemberPagePreview;
