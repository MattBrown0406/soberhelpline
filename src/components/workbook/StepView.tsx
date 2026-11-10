import { forwardRef, useId, type KeyboardEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OTHER_VALUE, otherKey, type AnswerValue, type Answers, type ChoiceOption, type ExerciseStep } from "@/data/exercises";

interface StepViewProps {
  step: ExerciseStep;
  answers: Answers;
  onAnswer: (key: string, value: AnswerValue) => void;
  /** Enter in a one-line field (or Ctrl/Cmd+Enter in a long one) moves on. */
  onSubmit: () => void;
}

const choiceBase =
  "flex w-full min-h-14 cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background";
const choiceOn = "border-primary bg-primary/10 dark:bg-primary/20";
const choiceOff = "border-border bg-card hover:border-primary/50 hover:bg-muted/50";

function Indicator({ on, round }: { on: boolean; round: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2",
        round ? "rounded-full" : "rounded-md",
        on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 bg-background",
      ].join(" ")}
    >
      {on && <Check className="h-4 w-4" />}
    </span>
  );
}

function ChoiceLabel({ option }: { option: ChoiceOption }) {
  return (
    <span className="flex-1">
      <span className="block text-base leading-snug text-foreground">{option.label}</span>
      {option.hint && <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{option.hint}</span>}
    </span>
  );
}

/** One question screen. The heading is focusable so focus can move to it. */
const StepView = forwardRef<HTMLHeadingElement, StepViewProps>(function StepView({ step, answers, onAnswer, onSubmit }, headingRef) {
  const uid = useId();
  const helpId = `${uid}-help`;
  const exampleText = typeof step.example === "function" ? step.example(answers) : step.example;

  const enterToSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSubmit();
    }
  };
  const ctrlEnterToSubmit = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  const otherInput = (show: boolean, label: string) =>
    show ? (
      <div className="pl-1 pt-1">
        <label htmlFor={`${uid}-other`} className="sr-only">
          {label}
        </label>
        <Input
          id={`${uid}-other`}
          className="h-12 text-base"
          placeholder="Type it here..."
          maxLength={200}
          value={typeof answers[otherKey(step.id)] === "string" ? (answers[otherKey(step.id)] as string) : ""}
          onChange={(e) => onAnswer(otherKey(step.id), e.target.value)}
          onKeyDown={enterToSubmit}
        />
      </div>
    ) : null;

  let body: ReactNode = null;

  if (step.type === "single" || step.type === "scale") {
    const options: ChoiceOption[] =
      step.type === "scale"
        ? step.labels.map((label, i) => ({ value: String(i), label }))
        : [...step.options, ...(step.allowOther ? [{ value: OTHER_VALUE, label: step.otherLabel ?? "Something else" }] : [])];
    const raw = answers[step.id];
    const current = raw === undefined || raw === null ? "" : String(raw);
    body = (
      <div role="radiogroup" aria-labelledby={`${uid}-q`} aria-describedby={step.help ? helpId : undefined} className="space-y-2">
        {options.map((o) => {
          const on = current === o.value;
          return (
            <label key={o.value} className={`${choiceBase} ${on ? choiceOn : choiceOff}`}>
              <input
                type="radio"
                className="sr-only"
                name={`${uid}-${step.id}`}
                value={o.value}
                checked={on}
                onChange={() => onAnswer(step.id, step.type === "scale" ? Number(o.value) : o.value)}
              />
              <Indicator on={on} round />
              {step.type === "scale" ? (
                <span className="flex-1 text-base text-foreground">{o.label}</span>
              ) : (
                <ChoiceLabel option={o} />
              )}
            </label>
          );
        })}
        {step.type === "single" && otherInput(current === OTHER_VALUE, step.otherLabel ?? "Something else")}
      </div>
    );
  } else if (step.type === "multi") {
    const values = Array.isArray(answers[step.id]) ? (answers[step.id] as string[]) : [];
    const options = [...step.options, ...(step.allowOther ? [{ value: OTHER_VALUE, label: step.otherLabel ?? "Something else" }] : [])];
    const atMax = !!step.max && values.length >= step.max;
    const toggle = (v: string) => {
      if (values.includes(v)) onAnswer(step.id, values.filter((x) => x !== v));
      else if (!atMax) onAnswer(step.id, [...values, v]);
    };
    body = (
      <div role="group" aria-labelledby={`${uid}-q`} aria-describedby={step.help ? helpId : undefined} className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {step.max ? `Choose up to ${step.max}.` : "Choose all that apply."}
        </p>
        {options.map((o) => {
          const on = values.includes(o.value);
          const disabled = !on && atMax;
          return (
            <label
              key={o.value}
              className={`${choiceBase} ${on ? choiceOn : choiceOff} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <input type="checkbox" className="sr-only" checked={on} disabled={disabled} onChange={() => toggle(o.value)} />
              <Indicator on={on} round={false} />
              <ChoiceLabel option={o} />
            </label>
          );
        })}
        {otherInput(values.includes(OTHER_VALUE), step.otherLabel ?? "Something else")}
      </div>
    );
  } else {
    const value = typeof answers[step.id] === "string" ? (answers[step.id] as string) : "";
    const common = {
      id: `${uid}-input`,
      value,
      maxLength: step.maxLength ?? 1000,
      placeholder: step.placeholder,
      "aria-labelledby": `${uid}-q`,
      "aria-describedby": [step.help ? helpId : "", exampleText ? `${uid}-ex` : ""].filter(Boolean).join(" ") || undefined,
    };
    body = (
      <div className="space-y-2">
        {step.prefix && (
          <p className="text-base font-medium text-foreground" aria-hidden="true">
            {step.prefix}…
          </p>
        )}
        {step.type === "text" ? (
          <Input
            {...common}
            className="h-12 text-base"
            onChange={(e) => onAnswer(step.id, e.target.value)}
            onKeyDown={enterToSubmit}
          />
        ) : (
          <Textarea
            {...common}
            rows={4}
            className="min-h-32 text-base leading-relaxed"
            onChange={(e) => onAnswer(step.id, e.target.value)}
            onKeyDown={ctrlEnterToSubmit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2
          id={`${uid}-q`}
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold leading-snug text-foreground outline-none sm:text-3xl"
        >
          {step.type === "scale" ? `“${step.prompt}”` : step.prompt}
        </h2>
        {step.help && (
          <p id={helpId} className="text-base leading-relaxed text-muted-foreground">
            {step.help}
          </p>
        )}
      </div>
      {body}
      {exampleText && (
        <div id={`${uid}-ex`} className="rounded-lg bg-muted/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">For example: </span>
          {exampleText}
        </div>
      )}
    </div>
  );
});

export default StepView;
