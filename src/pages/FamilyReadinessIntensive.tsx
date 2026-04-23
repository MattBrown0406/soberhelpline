import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Users, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const FamilyReadinessIntensive = () => {
  const faqs = [
    {
      question: "Who is the Family Readiness Intensive for?",
      answer: "It is for families who are scared, divided, exhausted, or unsure what to do next. If you need clarity before deciding on a full intervention, this is the right starting point.",
    },
    {
      question: "Does this mean we are not ready for an intervention?",
      answer: "Not necessarily. Sometimes the right next step is a full intervention. Sometimes the family first needs alignment, boundaries, and a clear plan. This intensive helps determine that honestly.",
    },
    {
      question: "What do we get at the end?",
      answer: "You leave with a clearer understanding of the situation, a professional recommendation, and a specific next-step plan instead of more confusion and second-guessing.",
    },
    {
      question: "Can the fee apply toward a full intervention?",
      answer: "Yes. If your family moves forward with a full intervention within 30 days, part of the intensive fee can be credited toward the intervention cost.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Family Readiness Intensive | Sober Helpline"
        description="A focused 90-minute strategy session for families who need expert clarity before deciding on a full intervention. Stop guessing. Get a real plan."
        canonical="https://soberhelpline.com/family-readiness-intensive"
      />

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Link to="/family-coaching" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Coaching
              </Link>
            </div>

            <section className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-background to-primary/5 px-6 py-12 md:px-10 md:py-16">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <ShieldCheck className="h-4 w-4" />
                  Paid strategy session for families who need clarity now
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                  Your Family Cannot Afford to Wait in Confusion
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  If your loved one is spiraling and your family is scared, divided, or exhausted, the Family Readiness Intensive gives you professional guidance, a clear recommendation, and a real next-step plan before the situation gets worse.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/book-consultation?plan=family-readiness-intensive">
                    <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                      Reserve the Intensive
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <a href="tel:+15412415886">
                    <Button variant="outline" size="lg">
                      <PhoneCall className="mr-2 h-5 w-5" />
                      Call (541) 241-5886
                    </Button>
                  </a>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  $2,500 includes a confidential 90-minute Zoom session and 7 days of follow-up support by Zoom, phone, text, or email, with a partial credit available toward a full intervention.
                </p>
              </div>
            </section>

            <section className="py-16 md:py-20">
              <div className="max-w-4xl mx-auto space-y-12">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground mb-6">When this is the right move</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Not every family is ready to commit to a full intervention today. But many families wait far too long because they are trapped in fear, disagreement, and second-guessing. That delay costs leverage, clarity, and sometimes lives.
                    </p>
                    <p>
                      The Family Readiness Intensive is for the moment before the full yes. It gives your family a structured way to stop spinning, understand what is actually happening, and decide what the right next move should be.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-3">This is for families who are:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• scared but not aligned</li>
                        <li>• exhausted and overwhelmed</li>
                        <li>• unsure whether an intervention is the right next step</li>
                        <li>• stuck in enabling, avoidance, or mixed messages</li>
                        <li>• desperate for expert clarity before making a major decision</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-3">What you get:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• a 90-minute deep-dive strategy session</li>
                        <li>• family/system assessment</li>
                        <li>• intervention readiness analysis</li>
                        <li>• boundary and communication guidance</li>
                        <li>• a clear recommendation and written action plan</li>
                        <li>• 7 days of follow-up support by Zoom, phone, text, or email</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-semibold text-foreground mb-4">What changes after this session</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You stop guessing. You stop arguing in circles. You stop hoping the situation will somehow fix itself.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Instead, your family leaves with a professional read on the situation, a more unified direction, and a next-step plan you can actually act on.
                    </p>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-3xl font-semibold text-foreground mb-6">Investment</h2>
                  <Card>
                    <CardContent className="p-8">
                      <p className="text-4xl font-bold text-foreground mb-3">$2,500</p>
                      <p className="text-muted-foreground mb-4">
                        This includes the initial 90-minute Zoom consultation plus 7 days of follow-up support by Zoom, phone, text, or email. If your family moves forward with a full intervention within 30 days, part of that fee can be credited toward the intervention cost.
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        Include any concerned loved ones who need to be part of the decision.
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        Members receive 10% off, bringing the intensive to $2,250.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-3xl font-semibold text-foreground mb-6">Common questions</h2>
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <Card key={faq.question}>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-card border border-border px-6 py-12 md:px-10 md:py-14 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
                If You Keep Waiting, The Situation Usually Gets Worse
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Get expert clarity now, while your family still has options, leverage, and a chance to move from chaos to a plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book-consultation?plan=family-readiness-intensive">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                    Reserve the Family Readiness Intensive
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/family-coaching">
                  <Button variant="outline" size="lg">
                    Ask a Question First
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default FamilyReadinessIntensive;
