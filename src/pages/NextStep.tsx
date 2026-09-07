import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo.png";
import { guideDisclaimer, nextStepPaths, urgentHelp } from "@/data/nextStepGuides";
import "./NextStep.css";

// Deliberately independent of Layout, auth, analytics, and contact widgets.
export default function NextStep() {
  const [pathIndex, setPathIndex] = useState<number | null>(null);
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const path = pathIndex === null ? null : nextStepPaths[pathIndex];
  const choice = choiceIndex === null ? null : path?.choices[choiceIndex];

  useEffect(() => { heading.current?.focus(); }, [pathIndex, complete]);
  useEffect(() => {
    // Do not restore a private guide from the browser's back-forward cache.
    const clear = () => { setPathIndex(null); setChoiceIndex(null); setComplete(false); setFeedback(""); };
    window.addEventListener("pagehide", clear);
    window.addEventListener("pageshow", clear);
    return () => { window.removeEventListener("pagehide", clear); window.removeEventListener("pageshow", clear); };
  }, []);

  const reset = () => {
    setPathIndex(null); setChoiceIndex(null); setComplete(false); setFeedback("Choices cleared. Choose a starting point when you are ready.");
    heading.current?.focus();
  };
  const download = () => {
    if (!path || !choice) return;
    const text = ["Sober Helpline — Your next-step guide", path.heading, urgentHelp, choice.action, ...path.steps.map((step, i) => `${i + 1}. ${step}`), "Words you can adapt:", path.script, guideDisclaimer, "Optional contact options: https://soberhelpline.com/contact", "This file stays wherever you save it. Delete it when you no longer need it."].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "my-next-step-guide.txt";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("Download requested. Check your browser's downloads. A saved guide can be seen by others using this device.");
  };

  return (
    <div className="next-step-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Private Next-Step Guide | Sober Helpline</title>
        <meta name="description" content="Not ready to call? Make a private next-step plan for understanding options, preparing a family conversation, or finding urgent resources. No signup required." />
        <link rel="canonical" href="https://soberhelpline.com/next-step" />
        <meta property="og:url" content="https://soberhelpline.com/next-step" />
        <meta property="og:title" content="Private Next-Step Guide | Sober Helpline" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <a href="#next-step-main" className="sr-only focus:not-sr-only">Skip to guide</a>
      <header className="border-b border-border bg-background">
        <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3" aria-label="Site navigation">
          <a href="/" className="flex min-w-0 items-center gap-2 font-semibold"><img src={logo} alt="" className="h-12 w-12 object-contain" /><span>Sober Helpline</span></a>
          <a href="/" className="text-sm underline">Home</a>
        </nav>
      </header>
      <main id="next-step-main" className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <p className="font-semibold text-primary">Not ready to call?</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Make a plan for your next step</h1>
        <p className="mt-4 text-lg">You do not have to solve everything today. Choose what would help, then read a short guide. No name, email, or account needed.</p>
        <p className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-sm" id="privacy-note">Your choices stay in this page's memory. We do not send or save them, or load analytics, session replay, chat, or popups here. Refreshing, leaving, or resetting clears them. The page visit may still appear in browser history and ordinary hosting logs. Downloaded or printed guides remain on your device or paper.</p>
        <aside aria-labelledby="urgent-title" className="my-6 rounded-xl border border-amber-600/40 bg-amber-50 p-4 text-slate-900">
          <h2 id="urgent-title" className="font-bold">Need urgent help? Do not wait for a guide.</h2>
          <p className="mt-2">{urgentHelp}</p>
          <div className="mt-3 flex flex-wrap gap-3"><a className="next-step-button" href="tel:911">Call 911</a><a className="next-step-button" href="tel:988">Call 988</a><a className="next-step-button" href="sms:988">Text 988</a></div>
        </aside>
        <section className="rounded-xl border border-border bg-card p-4 sm:p-6" aria-labelledby="guide-heading" aria-describedby="privacy-note">
          <p className="mb-2 text-sm text-muted-foreground">{complete ? "Your guide • no contact details needed" : path ? "Step 2 of 2 • choose a focus" : "Step 1 of 2 • choose a starting point"}</p>
          <h2 id="guide-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold">{complete && path ? path.heading : path ? path.question : "What would help right now?"}</h2>
          {!path && <div className="mt-5 grid gap-3">{nextStepPaths.map((item, index) => <button type="button" key={item.id} className="next-step-choice" onClick={() => { setPathIndex(index); setFeedback(""); }}><strong className="block">{item.title}</strong><span className="mt-1 block text-sm">{item.description}</span></button>)}</div>}
          {path && !complete && <>
            {path.id === "concern" && <p className="mt-4 font-medium">Use 911 or 988 above now if needed. These choices are information topics, not a check that someone is safe.</p>}
            <fieldset className="mt-5 grid gap-3"><legend className="sr-only">Choose one focus for your guide</legend>{path.choices.map((item, index) => <label key={item.label} className="next-step-choice flex cursor-pointer items-start gap-3"><input className="mt-1 h-5 w-5 shrink-0 accent-teal-800" type="radio" name="guide-focus" checked={choiceIndex === index} onChange={() => setChoiceIndex(index)} /><span>{item.label}</span></label>)}</fieldset>
            {path.id === "concern" && choice && <div role="alert" className="mt-4 rounded-lg border border-amber-600/40 bg-amber-50 p-4 text-slate-900"><p>{choice.action}</p><div className="mt-3 flex flex-wrap gap-3"><a className="next-step-button" href="tel:911">Call 911 now</a><a className="next-step-button" href="tel:988">Call 988 for crisis support</a><a className="next-step-button" href="sms:988">Text 988 for crisis support</a></div></div>}
            <button type="button" className="next-step-button mt-5" disabled={choiceIndex === null} onClick={() => { setComplete(true); setFeedback("Your guide is ready. Nothing has been sent or saved."); }}>Read my guide</button>
          </>}
          {complete && path && choice && <article className="mt-5 space-y-5" aria-label="Your next-step guide">
            <div className="rounded-lg bg-primary/10 p-4"><h3 className="font-semibold">Start here: {choice.label}</h3><p className="mt-2">{choice.action}</p></div>
            <ol className="list-decimal space-y-4 pl-6">{path.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <div><h3 className="font-semibold">Words you can adapt</h3><blockquote className="mt-2 border-l-4 border-primary pl-4">“{path.script}”</blockquote></div>
            <p className="text-sm text-muted-foreground">{guideDisclaimer}</p>
            <div className="next-step-controls"><p className="mb-3 text-sm">Keep a copy only if it is safe on this device. Downloading does not send an email.</p><div className="flex flex-wrap gap-3"><button type="button" className="next-step-button" onClick={download}>Download text guide</button><button type="button" className="next-step-button" onClick={() => window.print()}>Print guide</button></div></div>
            <div className="next-step-controls border-t border-border pt-5"><h3 className="font-semibold">Want to reach a person later? Optional.</h3><p className="mt-2 mb-3 text-sm">The contact page offers phone, WhatsApp, and Family Squares options. Opening it does not send this guide, request a callback, or carry your choices over. Other site pages use the site's usual analytics. You can also stop here.</p><a className="next-step-button" href="/contact" rel="noreferrer">See contact options</a></div>
          </article>}
          <div className="next-step-controls mt-6 flex flex-wrap gap-4 border-t border-border pt-4">
            {path && <button type="button" className="next-step-button" onClick={() => { if (complete) setComplete(false); else { setPathIndex(null); setChoiceIndex(null); } setFeedback(""); }}>Back</button>}
            <button type="button" className="next-step-button" onClick={reset}>Reset choices</button>
          </div>
        </section>
        <p className="next-step-controls mt-4 text-sm" role="status" aria-live="polite">{feedback}</p>
      </main>
      <footer className="bg-gray-900 px-4 py-8 text-gray-200"><div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-4"><p>Sober Helpline • Education and support for families</p><a className="underline" href="/privacy">Privacy policy</a></div></footer>
    </div>
  );
}
