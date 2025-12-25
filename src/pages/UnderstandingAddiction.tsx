import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Brain, Heart, AlertTriangle, Lightbulb, Users, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function UnderstandingAddiction() {
  useGuideTracking("/understanding-addiction", "Addiction: A Chronic Disease, Not a Choice");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Addiction: A Chronic Disease, Not a Choice | Sober Helpline</title>
        <meta name="description" content="Learn why addiction is classified as a chronic brain disease, how it affects the brain, and why this understanding is crucial for effective treatment and recovery." />
      </Helmet>

      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>
            <Link to="/">
              <img src={logo} alt="Sober Helpline" className="h-12 md:h-16" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(541) 241-5886</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
            Addiction: A Chronic Disease, Not a Choice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Families facing a loved one's addiction often feel frustration, anger, or betrayal, wondering why they "choose" to destroy their lives despite pleas and consequences. Viewing addiction as a chronic disease—much like diabetes or heart disease—shifts understanding from moral failure to a treatable medical condition rooted in brain changes, genetics, and environment. This reframing builds empathy, encourages evidence-based treatment, and improves recovery odds.
          </p>
        </div>

        <div className="space-y-8">
          {/* What Is Addiction? */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-6 w-6 text-logo-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-logo-green">What Is Addiction?</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Major health organizations, including the National Institute on Drug Abuse (NIDA) and American Medical Association, classify addiction as a <strong>chronic, relapsing brain disease</strong>. Prolonged substance use alters brain structure and function, hijacking reward pathways, impairing decision-making, and strengthening memory circuits tied to drug cues.
              </p>
              <p>
                Neuroimaging shows these changes persist years after quitting, explaining intense cravings and relapse risks even after long abstinence. Like hypertension damaging arteries over time, addiction rewires neural circuits, making controlled use nearly impossible without intervention.
              </p>
            </div>
          </section>

          {/* Brain Science Behind the Shift */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-logo-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-logo-green">Brain Science Behind the Shift</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Substances flood the brain's dopamine system, creating euphoria far beyond natural rewards like food or relationships. Repeated exposure strengthens these pathways, turning casual use into compulsion. The prefrontal cortex, responsible for impulse control and foresight, weakens, while the amygdala heightens emotional responses to drug cues—social settings, stress, or locations once linked to use.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tolerance:</strong> The brain reduces dopamine receptors, requiring more of the substance to feel the same effect.</li>
                <li><strong>Dependence:</strong> The brain becomes reliant on the substance to function normally, leading to withdrawal symptoms without it.</li>
                <li><strong>Impaired Decision-Making:</strong> The prefrontal cortex becomes compromised, weakening judgment and impulse control.</li>
                <li><strong>Hijacked Stress Response:</strong> The brain's stress systems become dysregulated, making stress a powerful trigger for use.</li>
                <li><strong>Memory and Learning Changes:</strong> Powerful associations form between environmental cues and drug use, creating persistent cravings.</li>
              </ul>
              <p>
                These brain changes can persist long after substance use stops, which is why addiction is considered a <strong>chronic condition</strong> that requires ongoing management rather than a problem that can be solved with willpower alone.
              </p>
            </div>
          </section>

          {/* The Lobster Allergy Metaphor */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-logo-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-logo-green">Why "Just Stopping" Isn't Simple</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Consider this metaphor: A group of friends goes out to a seafood restaurant and all order lobster dinners. For most, it's a delightful meal—rich flavors, no issues, just satisfaction. But one person has a shellfish allergy due to their unique immune wiring. Within minutes, they experience hives, swelling, wheezing, and potentially life-threatening reactions.
              </p>
              <p>
                The allergic person didn't "choose" this reaction; their biology dictates it. No amount of willpower stops the immune flood of histamines. <strong>Addiction works the same way:</strong> substances trigger dopamine surges everyone feels initially, but the genetically or environmentally vulnerable brain reacts pathologically, creating compulsion beyond choice. Willpower has no bearing; it's physiological, not personal failure.
              </p>
              <p>
                This mirrors other chronic diseases. Diabetes involves insulin dysregulation requiring lifelong management. Heart disease builds plaque silently until crisis strikes. Addiction follows suit: no "cure," but remission through medication, therapy, and lifestyle changes. Relapse rates match those of asthma (50-70%) or hypertension (50-70%), not a sign of weak character but disease progression without ongoing care.
              </p>
            </div>
          </section>

          {/* The Role of Genetics and Environment */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-6 w-6 text-logo-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-logo-green">The Role of Genetics and Environment</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Research shows that <strong>40-60% of addiction risk</strong> is genetic. This doesn't mean addiction is inevitable for those with family history, but it does mean some people are more vulnerable than others.
              </p>
              <p>
                Environmental factors also play a crucial role:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Early exposure to substances (especially before age 25 when the brain is still developing)</li>
                <li>Childhood trauma or adverse experiences</li>
                <li>Mental health conditions like anxiety, depression, or PTSD</li>
                <li>Social environment and peer influences</li>
                <li>Availability and access to substances</li>
                <li>Lack of family support or healthy coping skills</li>
              </ul>
              <p>
                Understanding these factors helps remove blame while identifying areas for prevention and intervention.
              </p>
            </div>
          </section>

          {/* Why the "Choice" Myth Persists */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-logo-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-logo-green">Why the "Choice" Myth Persists</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Cultural stigma paints addiction as willpower deficit, rooted in outdated moral models. Early users choose experimentation, but dependence flips agency—cravings override rational choice, much like hunger drives eating despite diet knowledge. Families see "choices" like skipping work or stealing, missing the underlying compulsion.
              </p>
              <p>
                This view delays treatment; only 23% of U.S. adults with substance use disorders get help, versus 80-90% for other chronic illnesses. Stigma worsens isolation, shame, and barriers like job loss or family rejection. <strong>Reframing reduces these harms.</strong> Studies show disease-model education increases family support and treatment adherence.
              </p>
            </div>
          </section>

          {/* Hope for Recovery */}
          <section className="bg-logo-green/10 border border-logo-green/20 rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-logo-green" />
              <h2 className="text-xl md:text-2xl font-semibold text-logo-green">Hope for Recovery</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                The disease model of addiction isn't about hopelessness—it's about understanding what we're dealing with so we can treat it effectively. The good news is:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The brain can heal.</strong> With sustained recovery, many brain changes can reverse over time.</li>
                <li><strong>Treatment works.</strong> Evidence-based treatments have success rates comparable to other chronic diseases.</li>
                <li><strong>Recovery is possible.</strong> Over 50% achieve long-term recovery with proper management.</li>
                <li><strong>Relapse isn't failure</strong>—it's a signal for adjustment, like tweaking insulin for diabetes spikes.</li>
              </ul>
              <p>
                Detox alone fails 80-90% within a year; comprehensive care—residential programs, counseling, family therapy—addresses medical, psychological, and social roots. Families play key roles: learning boundaries prevents enabling, attending support groups builds resilience, and modeling healthy behaviors aids recovery.
              </p>
              <p>
                <strong>Your loved one deserves treatment as a patient, not punishment as a criminal.</strong> Recovery thrives when all see the disease, commit to management, and reject choice-based myths.
              </p>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-logo-green mb-3">
            Ready to Take the Next Step?
          </h2>
          <p className="text-muted-foreground mb-4">
            If you or a loved one is struggling with addiction, help is available. Understanding addiction as a disease is the first step toward finding effective treatment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:541-241-5886"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              Call (541) 241-5886
            </a>
            <Link
              to="/addiction-assessment"
              className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              Take the Addiction Assessment
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
