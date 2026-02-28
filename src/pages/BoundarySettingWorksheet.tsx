import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import logoImg from "@/assets/logo.png";

const BoundarySettingWorksheet = () => {
  const [user, setUser] = useState<User | null>(null);
  const worksheetRef = useRef<HTMLDivElement>(null);
  const [logoBase64, setLogoBase64] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetch(logoImg)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result as string);
        reader.readAsDataURL(blob);
      });
  }, []);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const checkbox = (label: string) => `<div class="check-item"><span class="checkbox">☐</span> ${label}</div>`;
    const writeLine = (label: string, lines = 3) =>
      `<div class="field"><label>${label}</label>${Array(lines).fill('<div class="line"></div>').join('')}</div>`;
    const yesNo = (label: string) => `<div class="field"><label>${label}</label><span class="yn">☐ Yes &nbsp;&nbsp; ☐ No</span></div>`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Boundary Setting Worksheet - Sober Helpline</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Georgia, 'Times New Roman', serif; padding: 24px 36px; line-height: 1.5; color: #1a1a1a; max-width: 820px; margin: 0 auto; font-size: 13px; }
            .header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #2d6a4f; padding-bottom: 12px; margin-bottom: 6px; }
            .header img { height: 60px; width: auto; }
            .header-text h1 { margin: 0; font-size: 22px; color: #2d6a4f; }
            .header-text p { margin: 2px 0 0; color: #666; font-size: 12px; font-style: italic; }
            .subtitle { color: #666; font-size: 11px; margin-bottom: 16px; text-align: right; }
            .section { margin-bottom: 18px; page-break-inside: avoid; }
            .section-title { font-size: 15px; font-weight: bold; color: #2d6a4f; margin: 0 0 4px; padding: 4px 0; border-bottom: 1px solid #ccc; }
            .section-desc { font-size: 11px; color: #666; margin: 0 0 8px; font-style: italic; }
            .field { margin-bottom: 10px; }
            .field label { display: block; font-weight: 600; font-size: 12px; margin-bottom: 3px; }
            .line { border-bottom: 1px solid #bbb; height: 22px; margin-bottom: 2px; }
            .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; margin-bottom: 8px; }
            .check-item { font-size: 12px; display: flex; align-items: center; gap: 4px; }
            .checkbox { font-size: 15px; }
            .yn { font-size: 12px; }
            .examples-box { background: #f5f5f0; border: 1px solid #ddd; border-radius: 4px; padding: 8px 10px; font-size: 11px; color: #555; margin-top: 4px; }
            .examples-box strong { color: #2d6a4f; }
            .commitment-box { border: 2px solid #2d6a4f; border-radius: 6px; padding: 14px; margin-top: 10px; }
            .commitment-box h3 { color: #2d6a4f; margin: 0 0 8px; font-size: 14px; }
            .sig-line { display: flex; gap: 32px; margin-top: 16px; }
            .sig-line div { flex: 1; }
            .sig-line .line { margin-top: 28px; }
            .sig-line label { font-size: 11px; color: #666; }
            .footer { text-align: center; font-size: 10px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 8px; }
            .tip { background: #f0f7f3; border-left: 3px solid #2d6a4f; padding: 6px 10px; font-size: 11px; color: #444; margin: 8px 0; }
            @page { margin: 0.6in; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Sober Helpline Logo" />` : ''}
            <div class="header-text">
              <h1>Boundary Setting Worksheet</h1>
              <p>Protecting Recovery, Safety, and Sanity</p>
            </div>
          </div>
          <div class="subtitle">SoberHelpline.com &bull; Date: _______________</div>

          <div class="tip">
            <strong>Remember:</strong> Boundaries are not punishments, threats, or ultimatums. They are clear statements of what you will and will not participate in. Boundaries are about <em>your</em> behavior, not controlling someone else's.
          </div>

          <!-- Part 1 -->
          <div class="section">
            <div class="section-title">Part 1: Boundary Mindset Check</div>
            <div class="section-desc">Before writing any boundary, answer honestly.</div>
            <div class="field">
              <label>What makes boundaries difficult for you? (check all that apply)</label>
              <div class="check-grid">
                ${checkbox("Fear of conflict")}
                ${checkbox("Fear of abandonment")}
                ${checkbox("Guilt or shame")}
                ${checkbox("Financial dependence")}
                ${checkbox("Hope they will change without limits")}
                ${checkbox("Other: ___________________")}
              </div>
            </div>
            <div class="field">
              <label>When you think about enforcing a boundary, what emotion comes up most strongly?</label>
              <div class="check-grid">
                ${checkbox("Anxiety")}
                ${checkbox("Guilt")}
                ${checkbox("Anger")}
                ${checkbox("Sadness")}
                ${checkbox("Relief")}
                ${checkbox("Fear")}
              </div>
            </div>
            ${writeLine("What has happened in the past when you set limits but did not follow through?")}
          </div>

          <!-- Part 2 -->
          <div class="section">
            <div class="section-title">Part 2: Identify the Problem Behavior</div>
            <div class="section-desc">Boundaries are responses to specific, repeated behaviors — not general frustrations.</div>
            ${writeLine("The behavior that is harming me or my household is:")}
            <div class="field">
              <label>How often does this behavior occur?</label>
              <div class="check-grid">
                ${checkbox("Occasionally")}
                ${checkbox("Frequently")}
                ${checkbox("Constantly")}
              </div>
            </div>
            <label style="font-weight:600;font-size:12px;display:block;margin-bottom:6px;">How does this behavior impact:</label>
            ${writeLine("My emotional health:", 2)}
            ${writeLine("My safety:", 2)}
            ${writeLine("My finances:", 2)}
            ${writeLine("My family or children:", 2)}
          </div>

          <!-- Part 3 -->
          <div class="section">
            <div class="section-title">Part 3: Clarify Your Boundary</div>
            <div class="section-desc">A healthy boundary is: Clear, Specific, Enforceable, and About your actions.</div>
            <div class="tip">Complete the sentence: "If this behavior continues, I will…"</div>
            ${writeLine("Boundary Statement:", 4)}
            <div class="examples-box">
              <strong>Examples (for reference only):</strong><br/>
              • "If you come home intoxicated, I will take the children and stay at my sister's house."<br/>
              • "I will no longer give money without receipts for how it was spent."<br/>
              • "If you skip your recovery meetings for two weeks, I will pause financial support."
            </div>
          </div>

          <!-- Part 4 -->
          <div class="section">
            <div class="section-title">Part 4: Check Your Boundary</div>
            <div class="section-desc">Answer these honestly. If you answer "No" to any, revise your boundary.</div>
            ${yesNo("Am I willing and able to follow through on this consequence?")}
            ${yesNo("Is the consequence about my behavior, not controlling theirs?")}
            ${yesNo("Can I enforce this consistently, not just when I'm angry?")}
            ${writeLine("If you answered 'No' to any above, revise your boundary here:", 3)}
          </div>

          <!-- Part 5 -->
          <div class="section">
            <div class="section-title">Part 5: Anticipate Pushback</div>
            <div class="section-desc">Think through how your loved one may respond and prepare your response.</div>
            <div class="field">
              <label>How might your loved one respond? (check all that apply)</label>
              <div class="check-grid">
                ${checkbox("Anger")}
                ${checkbox("Manipulation")}
                ${checkbox("Promises to change")}
                ${checkbox("Blame")}
                ${checkbox("Silence")}
                ${checkbox("Crisis behavior")}
              </div>
            </div>
            ${writeLine("What is your greatest fear about holding this boundary?")}
            ${writeLine('Write a calm, one-line response you can use: (e.g., "I love you, and this is what I need to do for my own health.")', 2)}
          </div>

          <!-- Part 6 -->
          <div class="section">
            <div class="section-title">Part 6: Build Your Support Plan</div>
            ${writeLine("Who will you tell about this boundary for accountability?")}
            <div class="field">
              <label>What will you do when you feel like giving in? (check all that apply)</label>
              <div class="check-grid">
                ${checkbox("Review this worksheet")}
                ${checkbox("Call a support person")}
                ${checkbox("Watch a reminder video")}
                ${checkbox("Attend a support group")}
                ${checkbox("Coaching or professional support")}
              </div>
            </div>
            ${writeLine("What warning signs tell you you're about to abandon this boundary?")}
          </div>

          <!-- Part 7: Commitment -->
          <div class="commitment-box">
            <h3>Part 7: Commitment</h3>
            <p style="font-size:12px;">
              I am setting this boundary not out of anger, punishment, or control — but because I deserve peace, safety, and clarity.
              I commit to honoring this boundary even when it feels hard.
            </p>
            <div style="margin-top:8px;">${checkbox("I commit to this boundary")}</div>
            <div class="sig-line">
              <div><div class="line"></div><label>Signature</label></div>
              <div><div class="line"></div><label>Date</label></div>
            </div>
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} Sober Helpline &bull; SoberHelpline.com &bull; This worksheet may be printed and reused as many times as needed.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <>
      <SEOHead
        title="Boundary Setting Worksheet | Sober Helpline"
        description="A free, interactive worksheet to help families set healthy boundaries with loved ones struggling with addiction."
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Boundary Setting Worksheet
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Use this interactive worksheet to identify, define, and strengthen healthy boundaries with your loved one.
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="mt-4 gap-2">
              <Download className="h-4 w-4" />
              Download Fillable PDF
            </Button>
          </div>
          <div ref={worksheetRef}>
            {user ? (
              <BoundaryWorksheet user={user} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Sign in to save your worksheet progress.</p>
                <BoundaryWorksheet user={{ id: "anonymous" } as User} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoundarySettingWorksheet;
