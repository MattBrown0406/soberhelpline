import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Brain, Heart, AlertTriangle, Lightbulb } from "lucide-react";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo.png";

export default function UnderstandingAddiction() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Understanding Addiction as a Disease | Sober Helpline</title>
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Understanding Addiction as a Disease
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Addiction is not a moral failing or a lack of willpower—it is a chronic, relapsing brain disease that requires understanding, compassion, and proper treatment.
          </p>
        </div>

        <div className="space-y-8">
          {/* What Is Addiction? */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">What Is Addiction?</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                The American Medical Association, the American Society of Addiction Medicine, and the National Institute on Drug Abuse all recognize addiction as a <strong>chronic brain disease</strong>. Like diabetes, heart disease, or asthma, addiction involves complex interactions between brain circuits, genetics, environment, and life experiences.
              </p>
              <p>
                Addiction fundamentally changes how the brain works. It hijacks the brain's reward system, making the pursuit of substances or behaviors feel as essential as food or water. This is why people continue to use despite devastating consequences—their brain has been rewired to prioritize the substance above all else.
              </p>
            </div>
          </section>

          {/* How Addiction Changes the Brain */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">How Addiction Changes the Brain</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Substances of abuse flood the brain with dopamine—the "feel good" neurotransmitter—at levels far beyond what natural rewards provide. Over time, this causes significant changes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tolerance:</strong> The brain reduces dopamine receptors, requiring more of the substance to feel the same effect.</li>
                <li><strong>Dependence:</strong> The brain becomes reliant on the substance to function normally, leading to withdrawal symptoms without it.</li>
                <li><strong>Impaired Decision-Making:</strong> The prefrontal cortex (responsible for judgment, impulse control, and decision-making) becomes compromised.</li>
                <li><strong>Hijacked Stress Response:</strong> The brain's stress systems become dysregulated, making stress a powerful trigger for use.</li>
                <li><strong>Memory and Learning Changes:</strong> Powerful associations form between environmental cues and drug use, creating persistent cravings.</li>
              </ul>
              <p>
                These brain changes can persist long after substance use stops, which is why addiction is considered a <strong>chronic condition</strong> that requires ongoing management rather than a problem that can be solved with willpower alone.
              </p>
            </div>
          </section>

          {/* Why "Just Stopping" Isn't Simple */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">Why "Just Stopping" Isn't Simple</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Family members often wonder, "Why can't they just stop?" Understanding addiction as a disease helps answer this question. Consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We don't tell someone with diabetes to "just produce more insulin"</li>
                <li>We don't expect someone with depression to "just cheer up"</li>
                <li>We don't ask someone with heart disease to "just have better arteries"</li>
              </ul>
              <p>
                Similarly, telling someone with addiction to "just stop" ignores the biological reality of their condition. Their brain has been fundamentally altered, and recovery requires proper treatment, support, and often medical intervention—not just good intentions.
              </p>
              <p>
                This doesn't mean people with addiction aren't responsible for their recovery. It means that recovery is possible with the right help, and that shame and blame are counterproductive approaches that often make things worse.
              </p>
            </div>
          </section>

          {/* The Role of Genetics and Environment */}
          <section className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">The Role of Genetics and Environment</h2>
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

          {/* Hope for Recovery */}
          <section className="bg-primary/10 border border-primary/20 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Hope for Recovery</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                The disease model of addiction isn't about hopelessness—it's about understanding what we're dealing with so we can treat it effectively. The good news is:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The brain can heal.</strong> With sustained recovery, many brain changes can reverse over time.</li>
                <li><strong>Treatment works.</strong> Evidence-based treatments have success rates comparable to other chronic diseases.</li>
                <li><strong>Recovery is possible.</strong> Millions of people are living in long-term recovery.</li>
                <li><strong>Each attempt builds toward success.</strong> Relapse isn't failure—it's often part of the learning process.</li>
              </ul>
              <p>
                Understanding addiction as a disease opens the door to compassion, appropriate treatment, and lasting recovery. It helps families support their loved ones without enabling, and helps those struggling understand that they're not broken—they have a treatable condition.
              </p>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
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
