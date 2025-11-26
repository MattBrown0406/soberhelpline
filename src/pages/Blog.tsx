import { useState } from "react";
import { ArrowLeft, Phone, Calendar, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "@/assets/logo.png";
import reluctantLovedOneImg from "@/assets/blog-reluctant-loved-one.png";
import firstStepsImg from "@/assets/blog-first-steps-recovery.png";
import supportLovedOneImg from "@/assets/blog-support-loved-one.png";
import aftercareImg from "@/assets/blog-aftercare-recovery.png";
import levelOfCareImg from "@/assets/blog-level-of-care.png";
const blogPosts = [
  {
    id: 1,
    title: "Why the Right Level of Care Matters",
    excerpt: "Choosing the right level of addiction treatment care is critical because it can mean the difference between short-term symptom relief and lasting recovery.",
    author: "Sober Helpline Team",
    date: "2024-11-26",
    category: "Treatment",
    image: levelOfCareImg,
    content: `Choosing the right level of addiction treatment care is critical because it can mean the difference between short-term symptom relief and lasting recovery. Matching care intensity to a person's medical, psychological, and social needs creates a safer, more effective path out of addiction.

**What "levels of care" mean**

Addiction treatment is organized into levels of care, ranging from early intervention and standard outpatient therapy to intensive outpatient/partial hospitalization, residential/inpatient rehab, and medically managed inpatient or detox. These levels are often guided by widely used clinical criteria that look at withdrawal risk, mental health, medical stability, and home environment.

Each level represents a different intensity of structure, monitoring, and support, not a "better or worse" option. The goal is to place someone where they can be safe, engaged, and challenged—but not overwhelmed or under-treated.

**Safety and medical stability**

For people at high risk of severe withdrawal, overdose, or medical complications, choosing a high enough level of care is a safety issue, not just a preference. Medically managed inpatient or detox programs provide 24/7 monitoring, medications, and rapid response if complications arise, which can be lifesaving.

On the other hand, placing someone with mild to moderate symptoms in a hospital-level program they do not need can waste resources, strain insurance benefits, and discourage them from engaging if it feels unnecessarily restrictive. Matching medical risk to the right setting supports safety without over-hospitalizing.

**Intensity that matches severity**

Higher levels of care—like residential or intensive outpatient—offer more hours of therapy, more frequent contact with clinicians, and more structure, which are essential for people with severe addiction, repeated relapses, or unstable living situations. These settings can include individual counseling, group therapy, family work, and psychiatric care in a tightly coordinated schedule.

Milder substance use disorders or people stepping down from more intensive programs may do well in standard outpatient care, where they live at home and attend therapy a few hours per week. This lighter level reduces disruption to work and family while still providing accountability and skills-building.

**Supporting co-occurring mental health needs**

Many people with addiction also live with depression, anxiety, trauma, or other mental health disorders, which should strongly influence the level of care chosen. Programs at higher levels of care are more likely to offer integrated, "dual diagnosis" services with psychiatric evaluation, medication management, and coordinated therapy.

If co-occurring conditions are serious—such as suicidal thoughts, psychosis, or severe mood instability—a more intensive level like partial hospitalization or inpatient/residential treatment is often necessary to stabilize both conditions together. When mental health needs are moderate and stable, outpatient or intensive outpatient may be an appropriate and less disruptive choice.

**Continuum of care and long-term success**

Modern addiction treatment is built around a continuum of care, meaning people can move up or down levels as needs change instead of being "one and done" with a single program. Starting at the right place makes it easier to step down gradually—from detox to residential, then to intensive outpatient, and finally to standard outpatient and recovery supports.

This step-down approach helps people practice new skills in progressively less structured environments, which reduces the risk of relapse when they eventually rely mostly on community and peer support. Skipping needed levels or jumping straight from crisis to minimal care can leave dangerous gaps and increase the chance of returning to use.

**Efficient use of time, money, and motivation**

Addiction treatment requires time, emotional energy, and often significant financial investment. Choosing too low a level of care can lead to revolving-door treatment: brief improvement, quick relapse, and repeated admissions that ultimately cost more in money and suffering.

Choosing a level that is too high—not medically or clinically justified—can consume limited insurance days or personal funds and make it harder to access care later if it is truly needed. Right-sized care uses resources wisely while addiction motivation is high, which is especially important because the window of willingness to change can be brief.

**Involving professionals in the decision**

Because matching a person to the correct level of addiction treatment depends on many factors—substance type, use pattern, withdrawal risk, mental health, physical health, home stability, and past treatment history—an assessment by a qualified addiction professional is essential. Clinicians trained in standardized criteria can recommend a level of care based on objective dimensions rather than guesswork or fear.

Families and individuals who understand the purpose of each level can ask better questions, advocate for appropriate placement, and recognize when a change in level is needed. This collaboration with professionals helps ensure that treatment is not only accessible, but also effective, personalized, and sustainable over time.`
  },
  {
    id: 2,
    title: "Motivating Your Reluctant Loved One",
    excerpt: "When someone you care about is struggling with addiction but resistant to help, it can feel hopeless. Discover compassionate strategies to encourage treatment without pushing them away.",
    author: "Sober Helpline Team",
    date: "2024-11-25",
    category: "Family Support",
    image: reluctantLovedOneImg,
    content: `Helping an addicted son or daughter become willing to get treatment starts with changing how the family responds to the addiction, using calm, consistent love, clear boundaries, and evidence-based communication rather than pressure or panic. Parents cannot force true recovery, but they can strongly influence motivation and make the path into treatment feel safer, more hopeful, and more attractive than staying in addiction.

**Understand addiction and denial**

Addiction is a chronic brain disease that impacts judgment, motivation, and the ability to see consequences clearly, which is why many sons and daughters insist they "don't have a problem." Learning that substance use disorder is a treatable medical condition, not a moral failure, helps parents approach their child with empathy instead of shame or blame, which is crucial for opening the door to treatment.

Denial and defensiveness are common because your child may feel ashamed, afraid of withdrawal, or worried about what treatment involves. When you understand these fears, you can speak directly to them with reassurance, practical information about rehab, and stories of successful recovery, making treatment feel less overwhelming.

**Shift from enabling to healthy boundaries**

Many parents unintentionally enable addiction by rescuing their child from consequences, giving money that ends up funding substances, or repeatedly covering for missed work or school. Shifting to recovery-focused support means no longer protecting your son or daughter from the natural results of their use, while still offering emotional support and a clear path to help.

Setting firm, consistent boundaries might include not providing cash, refusing to lie to employers or schools, and limiting substance use in your home. These boundaries, communicated calmly and lovingly, help your child feel the real impact of their addiction and see treatment as a more attractive option than continuing to use.

**Use proven communication strategies**

The CRAFT (Community Reinforcement and Family Training) approach teaches parents how to communicate in ways that reduce conflict and increase willingness to enter treatment. Research shows that families using CRAFT skills—such as positive reinforcement, clear requests, and better timing—help their loved ones accept treatment at far higher rates than traditional confrontational interventions.

Instead of lectures or character attacks, focus on specific behaviors and how they affect you and others: "When you didn't come home last night, I was scared something happened to you," rather than "You're irresponsible." Pair these observations with expressions of love and concern, such as, "I care about you and I want to help you get the support you deserve," which lowers defensiveness and keeps the conversation going.

**Choose the right moment and message**

Pick a time to talk when your son or daughter is as sober, rested, and calm as possible, not in the middle of a crisis, argument, or high intoxication. Planning what you want to say ahead of time helps you stay focused on love, concern, and clear options instead of getting pulled into old arguments.

Keep the message simple and repetitive: you are worried, you see specific problems, you believe treatment can help, and you are willing to support them if they say yes. Avoid threats you cannot keep or ultimatums delivered in anger; instead, explain what will change in your behavior and boundaries if they continue to refuse help.

**Make treatment easy to say "yes" to**

One of the most powerful ways to increase willingness is to remove obstacles by researching treatment options in advance so your child does not have to figure everything out while in crisis. Look into levels of care (detox, residential rehab, intensive outpatient, medication-assisted treatment), insurance coverage, and trusted local programs so you can offer concrete choices, not vague suggestions.

Share what a typical day in treatment looks like, including therapy, groups, healthy activities, and support for mental health, so rehab feels less mysterious and scary. Emphasize that treatment is not a punishment but a chance to feel better physically and emotionally, reconnect with family, and rebuild their future.

**Reinforce any step toward recovery**

Positive reinforcement is central to helping an addicted child become willing to go to rehab, especially when using CRAFT-informed strategies. Notice and affirm any step in the right direction—showing up sober, talking honestly about their use, agreeing to visit a counselor, or touring a treatment center—so recovery-linked behaviors start to feel rewarding.

You can also create more rewarding sober experiences at home by planning substance-free activities, family meals, or outings that your child enjoys, which gradually makes a sober lifestyle more appealing. At the same time, gently withdraw rewards (such as rides, money, or privileges) when your son or daughter is using, so the payoff for staying in addiction shrinks.

**Consider structured family intervention**

Sometimes, even with healthy communication and boundaries, a young person continues to resist treatment, and a structured intervention becomes necessary. Interventions, especially those guided by trained professionals, can help families present a unified, loving message and clear treatment plan in a single, focused meeting.

There are different intervention models, from more confrontational Johnson-style approaches to more collaborative and invitational methods like ARISE and CRAFT-informed interventions. A professional interventionist can help you decide which model best fits your family, prepare everyone for the conversation, and coordinate immediate admission into treatment if your child agrees.

**Take care of yourself and get support**

Helping an addicted son or daughter is emotionally exhausting, and parents are more effective advocates when they have their own support system. Family support groups, parent-focused programs, and counseling provide education, coping tools, and a safe place to process anger, fear, and grief.

Prioritizing your own mental health and self-care is not selfish; it models healthy behavior and prevents burnout, which can otherwise lead to explosive confrontations or complete withdrawal. Many family programs also teach you how to maintain hope and resilience even when your child is not yet ready for treatment, so you remain ready to respond the moment willingness appears.

By combining compassionate communication, firm boundaries, concrete treatment options, and evidence-based family strategies, parents can dramatically increase the chances that an addicted son or daughter will say "yes" to help and begin the journey into recovery.`
  },
  {
    id: 3,
    title: "Understanding the First Steps of Recovery",
    excerpt: "Recovery is a journey that begins with a single step. Learn about the crucial first steps that can set you or your loved one on the path to lasting sobriety.",
    author: "Sober Helpline Team",
    date: "2024-01-15",
    category: "Recovery Basics",
    image: firstStepsImg,
    content: null
  },
  {
    id: 4,
    title: "How to Support a Loved One in Treatment",
    excerpt: "Supporting someone through addiction treatment can be challenging. Discover effective ways to be there for your loved one while maintaining healthy boundaries.",
    author: "Sober Helpline Team",
    date: "2024-01-10",
    category: "Family Support",
    image: supportLovedOneImg,
    content: null
  },
  {
    id: 5,
    title: "The Importance of Aftercare in Recovery",
    excerpt: "Treatment is just the beginning. Learn why aftercare programs are essential for maintaining long-term sobriety and preventing relapse.",
    author: "Sober Helpline Team",
    date: "2024-01-05",
    category: "Aftercare",
    image: aftercareImg,
    content: null
  }
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      return (
        <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5886</span>
            </a>
            <img src={logo} alt="Sober Helpline" className="h-16 w-auto" />
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Recovery Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, stories, and resources to support you and your loved ones on the journey to recovery.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className={`hover:shadow-lg transition-shadow overflow-hidden ${post.content ? 'cursor-pointer' : ''}`}
              onClick={() => post.content && setSelectedPost(post)}
            >
              {post.image && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {post.content && (
                  <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                    Read Full Article →
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-12 p-8 bg-muted rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">More Content Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on bringing you more valuable content about recovery, treatment options, and family support. Check back regularly for updates.
          </p>
        </div>
      </div>

      {/* Article Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <div className="text-sm text-primary font-medium mb-1">{selectedPost?.category}</div>
            <DialogTitle className="text-2xl">{selectedPost?.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{selectedPost?.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{selectedPost?.date && new Date(selectedPost.date).toLocaleDateString()}</span>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="py-4">
              {selectedPost?.image && (
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              {selectedPost?.content && renderContent(selectedPost.content)}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;
