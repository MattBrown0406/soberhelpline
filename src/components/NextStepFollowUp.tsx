import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./NextStepFollowUp.css";

const API = "https://followup.187.77.196.68.sslip.io";

export default function NextStepFollowUp({ guideSummary }: { guideSummary: string }) {
  const [open, setOpen] = useState(false);
  return <section className="next-step-followup next-step-controls" aria-label="Optional personal follow-up">
    <h3>Ask Matt to Follow Up</h3>
    <p>This is optional. You can keep using or downloading your guide without contacting anyone.</p>
    {!open ? <button type="button" onClick={() => setOpen(true)}>Ask Matt to Follow Up</button> : <FollowUpForm guideSummary={guideSummary} close={() => setOpen(false)} />}
  </section>;
}

function FollowUpForm({ guideSummary, close }: { guideSummary: string; close: () => void }) {
  const [name, setName] = useState("");
  const [method, setMethod] = useState("phone");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [shareGuide, setShareGuide] = useState(false);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState("");
  const firstInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);
  const submitting = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    firstInput.current?.focus();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    // Only opening the optional form contacts our relay. No guide answers or
    // form fields accompany this anti-abuse token request. Never load a tracker.
    void fetch(`${API}/v1/challenge`, { method: "POST", credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok || typeof data.token !== "string") throw new Error("unavailable");
        if (active && !controller.signal.aborted) setToken(data.token);
      })
      .catch(() => {
        if (active && !controller.signal.aborted) setMessage("The form could not connect. Close and reopen it to try again, or use the contact options below.");
        else if (active) setMessage("The form connection timed out. Close and reopen it, or use the contact options below.");
      }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; mounted.current = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !token || !consent) return;
    submitting.current = true;
    setBusy(true); setMessage("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      const payload = {
        token, name: name.trim(), method, contact: contact.trim(), note: note.trim(), company,
        consent: true, shareGuide,
        ...(shareGuide ? { guide: guideSummary } : {}),
      };
      const response = await fetch(`${API}/v1/follow-up`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "omit", referrerPolicy: "no-referrer", body: JSON.stringify(payload), signal: controller.signal,
      });
      const data = await response.json();
      if (!mounted.current) return;
      if (!response.ok || data.accepted !== true || typeof data.requestId !== "string") {
        setMessage(typeof data.error === "string" ? data.error : "We could not confirm delivery. Please use the contact options below.");
        return;
      }
      setReceipt(data.requestId); setSent(true);
      setName(""); setContact(""); setNote(""); setConsent(false); setShareGuide(false); setToken("");
    } catch {
      if (mounted.current) setMessage("We could not confirm delivery. Your request may have arrived. Please use the contact options below if you need to reach Matt.");
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  if (sent) return <div role="status" className="followup-success">
    <p><strong>Your request was delivered to Matt’s notification inbox.</strong></p>
    <p>Matt has not necessarily read it yet. There is no guaranteed response time. For immediate danger call 911; for a U.S. suicide or mental-health crisis call or text 988.</p>
    <p className="followup-receipt">Request reference: {receipt}</p>
    <button type="button" onClick={close}>Close confirmation</button>
  </div>;

  return <form onSubmit={submit} className="followup-form">
    <p><strong>Not monitored for emergencies.</strong> For immediate danger call 911. For a U.S. suicide or mental-health crisis call or text 988. Please do not wait for a reply here.</p>
    <p>Matt Brown at Freedom Interventions handles these requests, including requests from Sober Helpline and No More Enabling. When you press Send, your contact details and note go to his private Telegram notification inbox. There is no newsletter signup or automated marketing sequence.</p>
    <label>Your name<input ref={firstInput} name="followup-name" autoComplete="off" value={name} onChange={e => setName(e.target.value)} maxLength={80} required disabled={busy} /></label>
    <label>How should Matt contact you?<select name="followup-method" value={method} onChange={e => { setMethod(e.target.value); setContact(""); }} disabled={busy}><option value="phone">Phone call</option><option value="email">Email</option></select></label>
    <label>{method === "phone" ? "Phone number, including area or country code" : "Email address"}<input name="followup-contact" type={method === "phone" ? "tel" : "email"} autoComplete="off" value={contact} onChange={e => setContact(e.target.value)} maxLength={200} required disabled={busy} /></label>
    <label>Anything Matt should know? (optional)<textarea name="followup-note" autoComplete="off" value={note} onChange={e => setNote(e.target.value)} maxLength={600} rows={3} disabled={busy} /></label>
    <p>Include a safe time to contact you or whether it is okay to leave a voicemail. Avoid names or sensitive details about other people.</p>
    <div className="followup-honeypot" aria-hidden="true"><label>Leave this field empty<input name="company" tabIndex={-1} autoComplete="off" value={company} onChange={e => setCompany(e.target.value)} /></label></div>
    <label className="followup-check"><input type="checkbox" name="share-guide" checked={shareGuide} onChange={e => setShareGuide(e.target.checked)} disabled={busy} /><span>Also share my guide choices with Matt (optional).</span></label>
    {shareGuide && <div className="followup-preview"><strong>Exactly what will be shared from your guide:</strong><pre>{guideSummary}</pre></div>}
    <label className="followup-check"><input type="checkbox" name="followup-consent" checked={consent} onChange={e => setConsent(e.target.checked)} required disabled={busy} /><span>I ask Matt to contact me by the method above, and agree to send the information shown in this form to his notification inbox. My guide choices are only included if I separately choose to share them.</span></label>
    <p>Opening this form contacts our request service for spam protection but does not send your guide choices or contact fields. Unsent fields stay in this page’s memory. Closing the form or resetting the guide clears them. Submitted information remains in Matt’s inbox; resetting does not retract it.</p>
    {message && <p role="alert" className="followup-error">{message}</p>}
    <div className="followup-actions"><button type="submit" disabled={busy || !token || !consent}>{busy ? "Sending request…" : "Send follow-up request"}</button><button type="button" onClick={close} disabled={busy}>Cancel and clear form</button></div>
  </form>;
}
