import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Printer, AlertTriangle, Heart, Scale, Activity, Shield, Users, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import { useGuideTracking } from "@/hooks/useGuideTracking";
import EatingDisorderScreening from '@/components/EatingDisorderScreening';

const EatingDisordersGuide = () => {
  useGuideTracking("Understanding Eating Disorders", "/eating-disorders-guide");
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Understanding Eating Disorders | Family Guide | Sober Helpline</title>
        <meta name="description" content="A comprehensive guide for families to understand eating disorders including anorexia, bulimia, and binge eating disorder. Learn warning signs, risk factors, and treatment options." />
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
              <Heart className="h-16 w-16 text-primary print:text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Understanding Eating Disorders</h1>
            <p className="text-xl text-muted-foreground italic">A Family Guide to Recognition, Risk Factors, and Treatment</p>
          </div>

          {/* Screening Tool */}
          <EatingDisorderScreening />

          {/* Purpose Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Why This Matters for Families</h2>
            <p className="text-foreground mb-4">
              Eating disorders are serious, potentially life-threatening mental health conditions that affect people of all ages, genders, and backgrounds. They often co-occur with substance use disorders, anxiety, depression, and trauma. Families play a crucial role in early detection and supporting recovery.
            </p>
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded print:border print:border-black">
              <p className="font-bold text-destructive print:text-black flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important: Eating disorders have the highest mortality rate of any mental illness.
              </p>
              <p className="mt-2 text-foreground">
                Early intervention significantly improves outcomes. If you suspect an eating disorder, don't wait — seek professional evaluation.
              </p>
            </div>
          </section>

          {/* Types of Eating Disorders */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black flex items-center gap-2">
              <Scale className="h-6 w-6" />
              Types of Eating Disorders
            </h2>

            {/* Anorexia Nervosa */}
            <div className="bg-muted p-5 rounded-lg mb-4 print:border print:border-black">
              <h3 className="text-xl font-bold text-foreground mb-3">Anorexia Nervosa</h3>
              <p className="text-foreground mb-3">
                Characterized by severe food restriction, intense fear of weight gain, and distorted body image. Often involves viewing oneself as overweight despite being dangerously underweight.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Warning Signs:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Dramatic weight loss</li>
                    <li>Refusing to eat or extreme calorie counting</li>
                    <li>Wearing baggy clothes to hide body</li>
                    <li>Excessive exercise despite fatigue or injury</li>
                    <li>Denial of hunger</li>
                    <li>Ritualistic eating behaviors</li>
                    <li>Social withdrawal, especially around meals</li>
                    <li>Hair loss, dry skin, feeling cold constantly</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Medical Consequences:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Heart arrhythmias and heart failure</li>
                    <li>Bone density loss (osteoporosis)</li>
                    <li>Muscle wasting</li>
                    <li>Kidney damage</li>
                    <li>Brain changes affecting cognition</li>
                    <li>Hormonal disruption</li>
                    <li>Anemia and immune compromise</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bulimia Nervosa */}
            <div className="bg-muted p-5 rounded-lg mb-4 print:border print:border-black">
              <h3 className="text-xl font-bold text-foreground mb-3">Bulimia Nervosa</h3>
              <p className="text-foreground mb-3">
                Cycles of binge eating followed by compensatory behaviors (purging through vomiting, laxatives, or excessive exercise). Often occurs at normal weight, making it harder to detect.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Warning Signs:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Evidence of binge eating (missing food, wrappers)</li>
                    <li>Frequent trips to bathroom after meals</li>
                    <li>Smell of vomit or use of air fresheners</li>
                    <li>Swollen cheeks or jaw (parotid gland swelling)</li>
                    <li>Calluses on knuckles (from self-induced vomiting)</li>
                    <li>Dental problems (enamel erosion, cavities)</li>
                    <li>Mood swings, especially around food</li>
                    <li>Excessive exercise routines</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Medical Consequences:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Electrolyte imbalances (can cause cardiac arrest)</li>
                    <li>Esophageal tears and chronic reflux</li>
                    <li>Severe dental damage</li>
                    <li>Chronic dehydration</li>
                    <li>Digestive problems</li>
                    <li>Throat and stomach damage</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Binge Eating Disorder */}
            <div className="bg-muted p-5 rounded-lg mb-4 print:border print:border-black">
              <h3 className="text-xl font-bold text-foreground mb-3">Binge Eating Disorder (BED)</h3>
              <p className="text-foreground mb-3">
                Recurrent episodes of eating large quantities of food in short periods, often rapidly and to the point of discomfort, accompanied by feelings of loss of control and significant shame.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Warning Signs:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Eating unusually large amounts in one sitting</li>
                    <li>Eating when not physically hungry</li>
                    <li>Eating alone due to embarrassment</li>
                    <li>Feeling disgusted, depressed, or guilty after eating</li>
                    <li>Hoarding or hiding food</li>
                    <li>Frequent dieting without weight loss</li>
                    <li>Weight fluctuations</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Medical Consequences:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Weight-related health conditions</li>
                    <li>Type 2 diabetes</li>
                    <li>Cardiovascular disease</li>
                    <li>High blood pressure</li>
                    <li>Gallbladder disease</li>
                    <li>Sleep apnea</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Other Eating Disorders */}
            <div className="bg-muted p-5 rounded-lg print:border print:border-black">
              <h3 className="text-xl font-bold text-foreground mb-3">Other Specified Feeding or Eating Disorders (OSFED)</h3>
              <p className="text-foreground mb-3">
                This category includes serious eating disorders that don't meet full criteria for anorexia, bulimia, or BED but are equally dangerous.
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li><strong>Atypical Anorexia:</strong> All criteria for anorexia except significant weight loss occurred but weight is within or above normal range</li>
                <li><strong>Purging Disorder:</strong> Recurrent purging to influence weight without binge eating</li>
                <li><strong>Night Eating Syndrome:</strong> Recurrent episodes of eating after awakening from sleep or excessive food intake after evening meal</li>
                <li><strong>Orthorexia:</strong> Obsessive focus on "healthy" or "clean" eating that becomes restrictive and harmful</li>
                <li><strong>ARFID (Avoidant/Restrictive Food Intake Disorder):</strong> Significant restriction not driven by weight concerns but by sensory issues, fear of consequences, or lack of interest in food</li>
              </ul>
            </div>
          </section>

          {/* Risk Factors */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Risk Profiles: Who Is Vulnerable?
            </h2>
            <p className="text-foreground mb-4">
              Eating disorders don't discriminate — they affect all demographics. However, certain factors increase risk:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold mb-2">Psychological Factors</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                  <li>Perfectionism and high achievement pressure</li>
                  <li>Low self-esteem and negative body image</li>
                  <li>Anxiety disorders (often precede eating disorders)</li>
                  <li>Depression</li>
                  <li>Trauma history (especially childhood trauma)</li>
                  <li>Difficulty expressing emotions</li>
                  <li>OCD or obsessive traits</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold mb-2">Biological Factors</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                  <li>Family history of eating disorders</li>
                  <li>Genetic predisposition (40-60% heritability)</li>
                  <li>History of dieting or weight cycling</li>
                  <li>Type 1 diabetes ("diabulimia" is common)</li>
                  <li>Neurological differences in reward/impulse centers</li>
                  <li>Hormonal changes (puberty, pregnancy)</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold mb-2">Social/Environmental Factors</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                  <li>Cultural emphasis on thinness</li>
                  <li>Social media and comparison culture</li>
                  <li>Bullying about weight or appearance</li>
                  <li>Family comments about weight or eating</li>
                  <li>Sports emphasizing weight (gymnastics, wrestling, dance)</li>
                  <li>Professions with appearance pressure (modeling, acting)</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold mb-2">Life Transitions & Triggers</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                  <li>Starting college or new school</li>
                  <li>Relationship changes or breakups</li>
                  <li>Loss of a loved one</li>
                  <li>Moving or major life changes</li>
                  <li>Pregnancy and postpartum period</li>
                  <li>Retirement or career changes</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded print:border print:border-black">
              <p className="font-semibold text-amber-800 dark:text-amber-200">Note on Gender:</p>
              <p className="text-foreground mt-1">
                While eating disorders are often associated with young women, they affect all genders. Men represent 25-40% of eating disorder cases but are less likely to seek treatment due to stigma. LGBTQ+ individuals face higher risk due to minority stress.
              </p>
            </div>
          </section>

          {/* Connection to Substance Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black flex items-center gap-2">
              <Brain className="h-6 w-6" />
              The Connection to Substance Use Disorders
            </h2>
            <p className="text-foreground mb-4">
              Eating disorders and substance use disorders frequently co-occur. Understanding this connection is critical for families navigating addiction.
            </p>
            <div className="bg-muted p-5 rounded-lg print:border print:border-black">
              <ul className="space-y-3 text-foreground">
                <li><strong>50% of people with eating disorders also abuse alcohol or drugs</strong> (compared to 9% of the general population)</li>
                <li><strong>35% of those with substance use disorders have eating disorders</strong></li>
                <li><strong>Stimulants</strong> (cocaine, methamphetamine, Adderall) are commonly misused to suppress appetite</li>
                <li><strong>Alcohol</strong> may be used to cope with shame or as a source of calories while restricting food</li>
                <li><strong>"Drunkorexia":</strong> Restricting food to "save calories" for drinking or enhance intoxication</li>
                <li>Both conditions share underlying factors: <strong>trauma, anxiety, need for control, difficulty regulating emotions</strong></li>
              </ul>
            </div>
            <div className="mt-4 p-4 bg-primary/10 rounded-lg print:border print:border-black">
              <p className="font-semibold text-primary print:text-black">Treatment Implication:</p>
              <p className="text-foreground mt-1">
                Both conditions must be treated simultaneously. Treating one while ignoring the other typically leads to relapse in both. Integrated treatment programs that address co-occurring eating disorders and substance use have the best outcomes.
              </p>
            </div>
          </section>

          {/* Treatment Approaches */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Treatment Approaches That Work
            </h2>
            <p className="text-foreground mb-4">
              Eating disorder treatment typically requires a multidisciplinary team approach. The level of care depends on medical stability and severity.
            </p>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold text-lg mb-2">Levels of Care</h4>
                <ul className="space-y-2 text-foreground">
                  <li><strong>Inpatient/Medical Hospitalization:</strong> For medical stabilization when vitals are unstable, severe malnutrition, or acute psychiatric risk</li>
                  <li><strong>Residential Treatment:</strong> 24/7 structured care for those medically stable but needing intensive support (typically 30-90 days)</li>
                  <li><strong>Partial Hospitalization (PHP):</strong> 6-8 hours daily, 5-7 days/week with supervised meals and therapy</li>
                  <li><strong>Intensive Outpatient (IOP):</strong> 3-4 hours daily, 3-5 days/week, step down from higher care</li>
                  <li><strong>Outpatient:</strong> Weekly therapy with dietitian and therapist for those stable in recovery</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold text-lg mb-2">Evidence-Based Therapies</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-1">For Adolescents:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                      <li><strong>FBT (Family-Based Treatment/Maudsley):</strong> Gold standard for adolescent anorexia — parents take charge of refeeding</li>
                      <li><strong>Adolescent-Focused Therapy (AFT)</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">For Adults:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                      <li><strong>CBT-E (Enhanced Cognitive Behavioral Therapy):</strong> First-line treatment for bulimia and BED</li>
                      <li><strong>DBT (Dialectical Behavior Therapy):</strong> Especially helpful for emotional dysregulation</li>
                      <li><strong>IPT (Interpersonal Therapy)</strong></li>
                      <li><strong>SSCM (Specialist Supportive Clinical Management)</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg print:border print:border-black">
                <h4 className="font-bold text-lg mb-2">The Treatment Team</h4>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li><strong>Therapist/Psychologist:</strong> Addresses underlying psychological issues and behaviors</li>
                  <li><strong>Registered Dietitian:</strong> Creates meal plans and challenges food rules (must specialize in eating disorders)</li>
                  <li><strong>Physician/Psychiatrist:</strong> Monitors medical complications, manages medications if needed</li>
                  <li><strong>Family Therapist:</strong> Helps family understand their role and improve communication</li>
                </ul>
              </div>
            </div>
          </section>

          {/* What Families Can Do */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black flex items-center gap-2">
              <Users className="h-6 w-6" />
              What Families Can Do
            </h2>

            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-4 rounded print:border print:border-black">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  DO:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li>Express concern with specific observations ("I've noticed you seem anxious around meals")</li>
                  <li>Listen without judgment</li>
                  <li>Seek professional evaluation early — don't wait for "rock bottom"</li>
                  <li>Participate in family therapy when recommended</li>
                  <li>Model healthy eating behaviors at home</li>
                  <li>Avoid commenting on anyone's weight, shape, or appearance</li>
                  <li>Be patient — recovery is not linear</li>
                  <li>Take care of your own mental health</li>
                  <li>Learn about the illness</li>
                  <li>Separate the person from the eating disorder</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 rounded print:border print:border-black">
                <h4 className="font-bold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  DON'T:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li>Comment on their weight — even "you look healthy" can be triggering</li>
                  <li>Monitor or police their eating (unless directed by treatment team)</li>
                  <li>Blame them for the illness</li>
                  <li>Make ultimatums about eating</li>
                  <li>Have diet culture conversations at home</li>
                  <li>Compare them to others</li>
                  <li>Express frustration about treatment costs or inconvenience</li>
                  <li>Expect a quick fix</li>
                </ul>
              </div>
            </div>
          </section>

          {/* When to Seek Emergency Care */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">When to Seek Emergency Care</h2>
            <div className="bg-destructive/10 border-2 border-destructive p-5 rounded-lg print:border print:border-black">
              <p className="font-bold text-destructive print:text-black mb-3">Go to the ER immediately if your loved one shows:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                <li>Fainting or dizziness</li>
                <li>Chest pain or heart palpitations</li>
                <li>Confusion or difficulty concentrating</li>
                <li>Blood in vomit</li>
                <li>Severe abdominal pain</li>
                <li>Inability to keep anything down</li>
                <li>Suicidal thoughts or self-harm</li>
                <li>Seizures</li>
                <li>Extreme weakness or inability to stand</li>
              </ul>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Resources</h2>
            <div className="bg-muted p-5 rounded-lg print:border print:border-black">
              <ul className="space-y-2 text-foreground">
                <li><strong>National Eating Disorders Association (NEDA):</strong> 1-800-931-2237 | nationaleatingdisorders.org</li>
                <li><strong>ANAD (Anorexia Nervosa and Associated Disorders):</strong> 1-888-375-7767 | anad.org</li>
                <li><strong>Crisis Text Line:</strong> Text "NEDA" to 741741</li>
                <li><strong>Eating Disorder Hope:</strong> eatingdisorderhope.com</li>
                <li><strong>FEAST (Families Empowered and Supporting Treatment):</strong> feast-ed.org — Parent support for FBT</li>
              </ul>
            </div>
          </section>

          {/* Key Takeaways */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 print:text-black">Key Takeaways for Families</h2>
            <div className="bg-primary/5 p-5 rounded-lg border border-primary/20 print:border print:border-black">
              <ul className="space-y-2 text-foreground">
                <li>✓ Eating disorders are serious mental illnesses, not choices or phases</li>
                <li>✓ Early intervention leads to better outcomes</li>
                <li>✓ Recovery is possible with proper treatment</li>
                <li>✓ Family involvement improves outcomes, especially for adolescents</li>
                <li>✓ Co-occurring substance use and eating disorders require integrated treatment</li>
                <li>✓ You cannot "see" an eating disorder — people of all weights can be severely ill</li>
                <li>✓ Your role is to support recovery, not to be the treatment provider</li>
              </ul>
            </div>
          </section>

          {/* Closing */}
          <section className="border-t-2 border-primary pt-6 print:border-black">
            <p className="text-center text-muted-foreground italic">
              "You didn't cause it. You can't control it. You can't cure it. But you can support recovery."
            </p>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sober Helpline | soberhelpline.com | 1-844-962-3744
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EatingDisordersGuide;
