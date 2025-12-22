import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Printer, AlertTriangle, Brain, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const DrugInducedPsychosis = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Understanding Drug-Induced Psychosis | Family Guide</title>
        <meta name="description" content="A comprehensive guide for families to understand drug-induced psychosis, recognize warning signs, and distinguish between THC and methamphetamine psychosis." />
      </Helmet>

      {/* Header - Hidden when printing */}
      <header className="bg-primary text-primary-foreground py-4 px-6 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="Sober Helpline Logo" className="h-12" />
          </Link>
          <a href="tel:1-844-962-3744" className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity">
            <Phone className="h-5 w-5" />
            1-844-962-3744
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation - Hidden when printing */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link to="/family-education" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Family Resources
          </Link>
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Document
          </Button>
        </div>

        {/* Printable Content */}
        <div className="print:text-black print:bg-white">
          {/* Title Section */}
          <div className="text-center mb-8 pb-6 border-b-2 border-primary print:border-black">
            <div className="flex justify-center mb-4">
              <Brain className="h-16 w-16 text-primary print:text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Understanding Drug-Induced Psychosis</h1>
            <p className="text-xl text-muted-foreground italic">What Families Need to Know — and How to Tell the Difference Between THC and Methamphetamine Psychosis</p>
          </div>

          {/* Purpose Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Purpose</h2>
            <p className="text-foreground mb-4">
              Families often sense that "something is very wrong," but struggle to name it. Drug-induced psychosis is frequently missed, minimized, or misdiagnosed, especially when substances like cannabis are assumed to be "safe."
            </p>
            <div className="bg-muted p-4 rounded-lg print:border print:border-black">
              <p className="font-semibold mb-2">This guide will help you:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                <li>Understand what drug-induced psychosis is</li>
                <li>Recognize warning signs early</li>
                <li>Distinguish substance-induced psychosis from primary mental illness</li>
                <li>Understand key differences between THC-induced and methamphetamine-induced psychosis</li>
                <li>Know when urgent medical intervention is needed</li>
              </ul>
            </div>
            <div className="mt-4 p-4 bg-destructive/10 border-l-4 border-destructive rounded print:border print:border-black">
              <p className="font-bold text-destructive print:text-black flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Psychosis is a medical emergency — not a behavioral problem.
              </p>
            </div>
          </section>

          {/* What Is Drug-Induced Psychosis */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">What Is Drug-Induced Psychosis?</h2>
            <p className="text-foreground mb-4">
              Drug-induced psychosis is a temporary or persistent break from reality caused or significantly worsened by substance use.
            </p>
            <div className="bg-muted p-4 rounded-lg print:border print:border-black">
              <p className="font-semibold mb-2">It can include:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                <li><strong>Hallucinations</strong> (seeing or hearing things that aren't there)</li>
                <li><strong>Delusions</strong> (fixed false beliefs)</li>
                <li><strong>Paranoia</strong></li>
                <li><strong>Disorganized thinking</strong></li>
                <li><strong>Loss of insight</strong> ("Nothing is wrong with me")</li>
              </ul>
            </div>
            <p className="mt-4 text-foreground italic">
              Unlike typical intoxication, psychosis does not resolve when the person sobers up in the usual timeframe.
            </p>
          </section>

          {/* Why Families Often Miss It */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Why Families Often Miss It</h2>
            <p className="text-foreground mb-4">Families often assume:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground mb-4 ml-4">
              <li>"They're just high"</li>
              <li>"They're anxious"</li>
              <li>"They're having a mental health episode"</li>
              <li>"They'll calm down once they sleep"</li>
            </ul>
            <p className="text-foreground font-semibold">
              Unfortunately, psychosis often escalates without treatment, and continued substance use can worsen or solidify symptoms.
            </p>
          </section>

          {/* Common Signs */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Common Signs of Drug-Induced Psychosis</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary print:text-black" />
                  Behavioral Signs
                </h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Extreme suspicion or fear</li>
                  <li>Belief others are watching, following, or plotting</li>
                  <li>Talking to themselves or unseen people</li>
                  <li>Social withdrawal or barricading behavior</li>
                  <li>Sudden aggression or panic without clear cause</li>
                  <li>Disorganized or nonsensical speech</li>
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary print:text-black" />
                  Emotional & Cognitive Signs
                </h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Intense paranoia</li>
                  <li>Inability to distinguish reality from thoughts</li>
                  <li>Rigid, unshakeable beliefs</li>
                  <li>Confusion about time, identity, or surroundings</li>
                  <li>Lack of awareness that anything is wrong</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded print:border print:border-black">
              <p className="font-bold text-amber-800 dark:text-amber-200 print:text-black">
                Red Flag Pattern: When behavior seems driven by fear rather than choice, psychosis must be considered.
              </p>
            </div>
          </section>

          {/* Drug-Induced vs Primary Mental Illness */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Drug-Induced Psychosis vs. Primary Mental Illness</h2>
            <p className="text-foreground mb-4 font-semibold">This distinction matters.</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2 text-primary print:text-black">Drug-Induced Psychosis</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Onset follows substance use</li>
                  <li>Symptoms worsen with continued use</li>
                  <li>May partially improve with abstinence</li>
                  <li>Often includes intense paranoia</li>
                  <li>Insight is typically poor</li>
                  <li>Can evolve into persistent psychosis if untreated</li>
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2 text-primary print:text-black">Primary Psychotic Disorders</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Often emerge gradually</li>
                  <li>Not directly tied to substance timing</li>
                  <li>Symptoms persist independent of use</li>
                  <li>Family history often present</li>
                  <li>Requires long-term psychiatric treatment</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded print:border print:border-black">
              <p className="font-semibold text-blue-800 dark:text-blue-200 print:text-black">
                Important: Substance use can trigger or unmask underlying mental illness — especially in young adults.
              </p>
            </div>
          </section>

          {/* THC-Induced Psychosis */}
          <section className="mb-8 page-break-before">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">THC-Induced Psychosis (Cannabis-Related Psychosis)</h2>
            
            <div className="bg-muted p-4 rounded-lg mb-4 print:border print:border-black">
              <h3 className="font-bold text-lg mb-2">Why This Is Increasing</h3>
              <p className="text-foreground mb-2">High-potency cannabis products today are dramatically stronger than in the past, especially:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground ml-4">
                <li>Concentrates</li>
                <li>Vape cartridges</li>
                <li>Edibles</li>
                <li>Delta-8 / Delta-9 variants</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2">Common Features</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Severe anxiety or panic</li>
                  <li>Intense paranoia ("people are after me")</li>
                  <li>Visual distortions</li>
                  <li>Derealization or depersonalization</li>
                  <li>Disorganized thinking</li>
                  <li>Emotional volatility</li>
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2">Typical Pattern</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Often occurs in adolescents or young adults</li>
                  <li>Can appear suddenly after heavy or concentrated use</li>
                  <li>May fluctuate — seeming better, then worse</li>
                  <li>Insight may return intermittently</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded print:border print:border-black">
              <h3 className="font-bold mb-2 text-destructive print:text-black">Unique Risks</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                <li>Families often minimize cannabis-related psychosis</li>
                <li>Continued THC use greatly increases recurrence risk</li>
                <li>Repeated episodes raise the likelihood of long-term psychotic illness</li>
              </ul>
              <p className="mt-2 font-bold text-destructive print:text-black">THC psychosis is real — and not rare.</p>
            </div>
          </section>

          {/* Methamphetamine-Induced Psychosis */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Methamphetamine-Induced Psychosis</h2>
            
            <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded mb-4 print:border print:border-black">
              <h3 className="font-bold mb-2 text-destructive print:text-black">Why It Is Especially Dangerous</h3>
              <p className="text-foreground">
                Methamphetamine is a powerful stimulant that profoundly affects dopamine systems, often producing severe, persistent psychosis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2">Common Features</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Extreme paranoia</li>
                  <li>Auditory hallucinations (voices commenting or threatening)</li>
                  <li>Delusions of persecution</li>
                  <li>Agitation or violent fear responses</li>
                  <li>Insomnia lasting days</li>
                  <li>Skin-picking or repetitive behaviors</li>
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-2">Typical Pattern</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Psychosis often escalates over time</li>
                  <li>Can persist weeks or months after stopping use</li>
                  <li>High risk of recurring episodes</li>
                  <li>Increased likelihood of permanent psychotic disorders</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded print:border print:border-black">
              <h3 className="font-bold mb-2 text-destructive print:text-black">Unique Risks</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                <li>Psychosis can become chronic even with abstinence</li>
                <li>Risk of violence or self-harm is higher</li>
                <li>Medical stabilization is often required</li>
              </ul>
              <p className="mt-2 font-bold text-destructive print:text-black">
                Meth-induced psychosis is one of the most dangerous substance-related psychiatric conditions.
              </p>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Key Differences: THC vs. Meth Psychosis</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border print:border-black">
                <thead>
                  <tr className="bg-primary text-primary-foreground print:bg-gray-200 print:text-black">
                    <th className="border border-border print:border-black p-3 text-left">Feature</th>
                    <th className="border border-border print:border-black p-3 text-left">THC-Induced Psychosis</th>
                    <th className="border border-border print:border-black p-3 text-left">Meth-Induced Psychosis</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  <tr className="bg-muted/50">
                    <td className="border border-border print:border-black p-3 font-semibold">Onset</td>
                    <td className="border border-border print:border-black p-3">Often sudden</td>
                    <td className="border border-border print:border-black p-3">Often progressive</td>
                  </tr>
                  <tr>
                    <td className="border border-border print:border-black p-3 font-semibold">Age group</td>
                    <td className="border border-border print:border-black p-3">Younger users</td>
                    <td className="border border-border print:border-black p-3">Any age</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border print:border-black p-3 font-semibold">Insight</td>
                    <td className="border border-border print:border-black p-3">Sometimes returns</td>
                    <td className="border border-border print:border-black p-3">Rarely present</td>
                  </tr>
                  <tr>
                    <td className="border border-border print:border-black p-3 font-semibold">Duration</td>
                    <td className="border border-border print:border-black p-3">May resolve with abstinence</td>
                    <td className="border border-border print:border-black p-3">Often persistent</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border print:border-black p-3 font-semibold">Paranoia</td>
                    <td className="border border-border print:border-black p-3">High</td>
                    <td className="border border-border print:border-black p-3">Extreme</td>
                  </tr>
                  <tr>
                    <td className="border border-border print:border-black p-3 font-semibold">Violence risk</td>
                    <td className="border border-border print:border-black p-3">Moderate</td>
                    <td className="border border-border print:border-black p-3">High</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border print:border-black p-3 font-semibold">Long-term risk</td>
                    <td className="border border-border print:border-black p-3">Elevated</td>
                    <td className="border border-border print:border-black p-3">Very high</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* When to Act */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              When Families Should Act Immediately
            </h2>
            
            <div className="p-4 bg-destructive/10 border-2 border-destructive rounded-lg print:border print:border-black">
              <p className="font-bold mb-3 text-destructive print:text-black">Seek emergency medical or psychiatric help if your loved one:</p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Believes others are trying to harm them</li>
                <li>Is hearing voices or seeing things</li>
                <li>Cannot distinguish reality from fear</li>
                <li>Is aggressive, panicked, or unpredictable</li>
                <li>Has not slept for extended periods</li>
                <li>Refuses help while clearly detached from reality</li>
              </ul>
              <div className="mt-4 p-3 bg-destructive/20 rounded print:bg-gray-200">
                <p className="font-bold text-destructive print:text-black text-center">
                  Do not attempt to reason, argue, or "talk them down."<br />
                  Psychosis requires medical intervention.
                </p>
              </div>
            </div>
          </section>

          {/* Do's and Don'ts */}
          <section className="mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-destructive/10 p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-3 text-destructive print:text-black">What Families Should NOT Do</h3>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive print:text-black font-bold">✗</span>
                    <span>Do not argue about what's real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive print:text-black font-bold">✗</span>
                    <span>Do not validate delusions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive print:text-black font-bold">✗</span>
                    <span>Do not assume sobriety will fix it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive print:text-black font-bold">✗</span>
                    <span>Do not leave the person isolated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive print:text-black font-bold">✗</span>
                    <span>Do not wait for insight to return</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg print:border print:border-black">
                <h3 className="font-bold text-lg mb-3 text-green-800 dark:text-green-200 print:text-black flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  What Helps
                </h3>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 print:text-black font-bold">✓</span>
                    <span>Medical evaluation (ER or psychiatric facility)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 print:text-black font-bold">✓</span>
                    <span>Substance cessation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 print:text-black font-bold">✓</span>
                    <span>Psychiatric stabilization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 print:text-black font-bold">✓</span>
                    <span>Ongoing monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 print:text-black font-bold">✓</span>
                    <span>Family education and boundaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 print:text-black font-bold">✓</span>
                    <span>Long-term treatment planning if symptoms persist</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Critical Reframe */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">A Critical Reframe for Families</h2>
            <div className="p-6 bg-primary/10 rounded-lg text-center print:border-2 print:border-black">
              <p className="text-xl font-semibold text-foreground mb-4">
                Psychosis is not a character flaw.<br />
                It is not manipulation.<br />
                It is not a choice.
              </p>
              <p className="text-lg text-foreground">
                It is a serious brain-based condition that requires swift, compassionate, and firm intervention.
              </p>
            </div>
          </section>

          {/* Companion Resources */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Suggested Companion Resources</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link to="/crisis-chaos" className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors print:border print:border-black block">
                <span className="font-semibold text-foreground">Crisis vs. Chaos Decision Guide</span>
              </Link>
              <Link to="/treatment-red-flags" className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors print:border print:border-black block">
                <span className="font-semibold text-foreground">Treatment Industry Red Flags Guide</span>
              </Link>
              <Link to="/family-advocacy-toolkit" className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors print:border print:border-black block">
                <span className="font-semibold text-foreground">Family Advocacy Toolkit</span>
              </Link>
              <Link to="/relapse-warning-signs-tracker" className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors print:border print:border-black block">
                <span className="font-semibold text-foreground">Relapse Warning Signs Tracker</span>
              </Link>
              <Link to="/family-education" className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors print:border print:border-black block md:col-span-2">
                <span className="font-semibold text-foreground">Guilt vs. Responsibility Module</span>
              </Link>
            </div>
          </section>

          {/* Footer for print */}
          <footer className="mt-12 pt-6 border-t-2 border-primary print:border-black text-center">
            <p className="text-muted-foreground">
              <strong>Sober Helpline</strong> — 24/7 Support: 1-844-962-3744
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              www.soberhelpline.com
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default DrugInducedPsychosis;
