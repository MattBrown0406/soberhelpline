import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useSavedTool } from "@/hooks/useSavedTool";
import { reflectionKey, reflectionPrompts } from "@/data/guideReflections";
import { findLibraryItem } from "@/data/memberLibrary";
import { SaveStatusChip, SavedTextarea } from "@/components/tools/ToolKit";

// "Reflect and write" at the end of a library guide: two or three questions
// about this guide plus free notes, saved to her account and printed with the
// guide. Rendered by RelatedResources (which every guide already ends with),
// so no guide page needs to mount it itself.

interface ReflectionAnswers {
  answers: Record<string, string>;
  notes: string;
}

const blank: ReflectionAnswers = { answers: {}, notes: "" };

function Reflection({ path }: { path: string }) {
  const saved = useSavedTool<ReflectionAnswers>(reflectionKey(path), blank);
  const prompts = reflectionPrompts(path);
  const { data } = saved;
  // Answers to questions that have since been reworded or replaced are still
  // hers: keep showing them (and let her edit or clear them).
  const earlier = Object.entries(data.answers ?? {}).filter(([question, answer]) => !prompts.includes(question) && answer.trim());

  return (
    <section
      aria-labelledby="guide-reflection-title"
      className="mt-10 rounded-3xl border border-[#e8a73a]/45 bg-[#e8a73a]/[0.08] p-5 shadow-sm shadow-slate-900/[0.04] sm:p-7 dark:bg-[#e8a73a]/[0.06] print:mt-6 print:break-inside-auto print:rounded-none print:border-0 print:border-t print:bg-transparent print:p-0 print:pt-4 print:shadow-none"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8a73a]/25 print:hidden">
            <PenLine className="h-5 w-5 text-amber-800 dark:text-amber-300" aria-hidden="true" />
          </span>
          <div>
            <h2 id="guide-reflection-title" className="text-xl font-semibold text-foreground">
              Reflect and write
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground print:hidden">
              A few minutes of writing helps this stick. Only you can see what you write here.
            </p>
          </div>
        </div>
        <SaveStatusChip status={saved.status} signedIn={saved.signedIn} lastSavedAt={saved.lastSavedAt} className="print:hidden" />
      </div>

      <fieldset disabled={!saved.loaded} className="m-0 min-w-0 space-y-5 border-0 p-0">
        {/* Answers are stored under the question's own text, so reordering or
            adding questions never puts an answer under the wrong question. */}
        {prompts.map((prompt) => (
          <SavedTextarea
            key={prompt}
            label={prompt}
            rows={3}
            value={data.answers?.[prompt] ?? ""}
            onChange={(value) => saved.setData((prev) => ({ ...prev, answers: { ...(prev.answers ?? {}), [prompt]: value } }))}
          />
        ))}
        <SavedTextarea
          label="Anything else you want to remember"
          rows={2}
          value={data.notes}
          onChange={(value) => saved.patch({ notes: value })}
        />
        {earlier.length > 0 && (
          <div className="space-y-5 border-t border-border pt-5">
            <p className="text-sm font-semibold text-foreground">Your earlier answers</p>
            {earlier.map(([question, answer]) => (
              <SavedTextarea
                key={question}
                label={question}
                rows={2}
                value={answer}
                onChange={(value) => saved.setData((prev) => ({ ...prev, answers: { ...(prev.answers ?? {}), [question]: value } }))}
              />
            ))}
          </div>
        )}
      </fieldset>

      {saved.loaded && !saved.signedIn && (
        <p className="mt-4 text-sm text-muted-foreground print:hidden">
          <Link to={`/auth?redirect=${encodeURIComponent(path)}`} className="font-medium text-primary underline-offset-2 hover:underline">
            Sign in
          </Link>{" "}
          to save your answers to your account. Until then they stay on this device.
        </p>
      )}
    </section>
  );
}

/** Renders only on library reading guides. */
export default function GuideReflection({ path }: { path: string }) {
  const item = findLibraryItem(path);
  if (!item || item.type !== "guide") return null;
  return <Reflection key={path} path={path} />;
}
