import { Helmet } from "react-helmet-async";
import { ArrowLeft, Phone, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import reluctantLovedOneImg from "@/assets/blog-reluctant-loved-one.png";
import firstStepsImg from "@/assets/blog-first-steps-recovery.png";
import supportLovedOneImg from "@/assets/blog-support-loved-one.png";
import aftercareImg from "@/assets/blog-aftercare-recovery.png";
import levelOfCareImg from "@/assets/blog-level-of-care.png";
import aaMeetingsImg from "@/assets/blog-aa-meetings.png";
import amIAddictedImg from "@/assets/blog-am-i-addicted.png";
import cycleOfAddictionImg from "@/assets/blog-cycle-of-addiction.jpg";
import gratitudeHappinessImg from "@/assets/blog-gratitude-happiness.png";
import holidayRelapseTriggersImg from "@/assets/blog-holiday-relapse-triggers.png";
import ozempicEatingDisordersImg from "@/assets/blog-ozempic-eating-disorders.png";
import youthVapingRecovery2025Img from "@/assets/blog-youth-vaping-recovery-2025.png";
import sportsBettingAddictionImg from "@/assets/blog-sports-betting-addiction.png";
import professionalInterventionistImg from "@/assets/blog-professional-interventionist.png";
import boundariesFortressImg from "@/assets/blog-boundaries-fortress.png";

export const imageMap: Record<string, string> = {
  cycleOfAddictionImg,
};

export const blogPosts = [
  {
    id: 0,
    title: "Understanding the Cycle of Addiction and How 12-Step Recovery Breaks It",
    excerpt: "The diagram shows how addiction becomes a self-feeding cycle, and how the 12-step recovery model speaks directly to each part of that loop, offering a spiritual and practical shift that breaks the cycle from the inside out.",
    author: "Sober Helpline Team",
    date: "2025-11-27",
    category: "Recovery Basics",
    image: cycleOfAddictionImg,
    content: `The diagram shows how addiction becomes a self-feeding cycle, and how the 12-step recovery model speaks directly to each part of that loop. It moves from internal discomfort and obsession, to using, to remorse and resolution, and then back again unless something deeper changes. In 12-step language, that "something" is a spiritual and practical shift that breaks the cycle from the inside out.

[IMAGE:cycleOfAddictionImg]

**Restless, irritable, and obsessed**

At the top, the diagram starts with being "restless, irritable, discontented with an obsession to use." That's the emotional and spiritual condition described in Step 1: life has become unmanageable, and the person feels driven by a power they can't control. This is more than just "wanting a drink" or "wanting a hit" – it's the sense that nothing feels right unless they can change how they feel with a substance.

In 12-step terms, this is untreated addiction: the person may be sober for a moment, but the inner discomfort and untreated spiritual condition make them vulnerable. Without recovery tools, meetings, a sponsor, and a Higher Power, this restless, irritable, and discontent state almost always leads back to the first drink or drug.

**Succumbing to the desire to use**

The next box, "succumb to the desire to use," shows the moment of giving in. In the 12-step model, this is where lack of power shows up clearly. The Big Book talks about the "mental obsession" that convinces the person "this time will be different," even when experience shows otherwise. In that moment, logic and good intentions lose to the urge.

Steps 1–3 address this part of the cycle. Step 1 admits powerlessness. Step 2 opens the door to believing that a Power greater than oneself can restore sanity. Step 3 is a decision to turn one's will and life over to that Power. In practice, that looks like calling a sponsor, going to a meeting, praying, or pausing to use tools instead of acting on the first thought.

**Ease, comfort, and craving**

Once the person uses, the diagram shows "sense of ease and comfort after using" followed by "phenomenon of craving to keep using." For many people, that first drink or drug brings a powerful sense of relief: tension drops, anxiety fades, and things feel "normal" for a little while. That relief is what the addicted brain remembers and chases.

In 12-step language, the "phenomenon of craving" is more than just liking it; it's a physical and mental response that makes stopping very hard once the person starts. This is why the program emphasizes "one day at a time" and "don't pick up the first one." If the first use triggers craving, then the safest place to interrupt the cycle is before that first drink, pill, or bet.

**Active using and consequences**

At the bottom of the diagram, "active using" runs along the curve, showing that once craving kicks in, the person may stay in a pattern of heavy use. In this phase, relationships, work, health, and self-respect often erode. The person may hurt others, break promises, lie, or cross their own moral lines – all classic themes described in stories shared at 12-step meetings.

The 12 steps respond to this not just by telling people to stop, but by giving a path to clean up the wreckage. Steps 4–9 deal with moral inventory, sharing the truth with another person, becoming ready to change character defects, and making amends. These steps help heal the guilt and shame that build up during active using.

**Emerging remorseful and resolving to quit**

The left side of the diagram says "emerge remorseful" and then "firm resolution to not use again." Many people in addiction wake up after a binge feeling deep shame, fear, and regret. They swear off: "Never again." They may mean it with all their heart. The problem is that, without a program of recovery, this sincere resolution usually is not enough to protect them the next time obsession returns.

The 12-step model understands this pattern well. Step 1 recognizes that willpower alone has failed repeatedly. Steps 10–12 provide daily tools: ongoing self-inventory, promptly admitting when wrong, seeking conscious contact with a Higher Power, and carrying the message to others. These daily practices help turn "firm resolution" into a way of life, not just a promise made in pain.

**Breaking the cycle with the 12 steps**

If nothing changes, the person moves from remorse and resolution right back into restlessness, irritability, discontent, and obsession – and the cycle repeats. The 12 steps aim to interrupt that loop at multiple points:

Before using: by building a spiritual foundation, a support network, and habits like meetings, sponsorship, prayer, and service.

After harm: by providing a way to make amends and grow, instead of drowning in shame.

In daily life: by helping people handle stress, resentment, fear, and discomfort without needing to numb out.

In short, the diagram illustrates the untreated disease of addiction, and the 12-step recovery model offers a set of actions that change how a person responds at each stage. Instead of being trapped in the cycle of obsession, use, craving, and remorse, people in recovery learn to live with more serenity, honesty, and connection – one day at a time.`
  },
  {
    id: 1,
    title: "How Do I Know If I'm Addicted?",
    excerpt: "The DSM-IV provided clear guidelines for diagnosing substance use disorder and alcohol use disorder. Learn about the criteria that help identify when someone's use of drugs or alcohol is causing serious problems.",
    author: "Sober Helpline Team",
    date: "2025-11-27",
    category: "Recovery Basics",
    image: amIAddictedImg,
    content: `The DSM-IV (Diagnostic and Statistical Manual of Mental Disorders, Fourth Edition) provided clear guidelines for diagnosing both substance use disorder and alcohol use disorder. These diagnoses helped clinicians identify when someone's use of drugs or alcohol was causing serious problems in their life. The criteria are designed to be understood in everyday language, so families and individuals can recognize warning signs and seek help when needed.

**DSM-IV Criteria for Substance Use Disorder**

Substance use disorder under DSM-IV was divided into two categories: substance abuse and substance dependence. To be diagnosed with substance abuse, a person must show at least one of the following within a 12-month period:

Repeatedly failing to meet major responsibilities at work, school, or home because of substance use.

Using substances in dangerous situations, like driving or operating machinery while impaired.

Getting into repeated legal trouble due to substance use.

Continuing to use substances even when it causes or worsens social or relationship problems.

For substance dependence, a person must show at least three of these criteria in a 12-month period:

Tolerance: needing much more of the substance to feel the desired effect, or feeling less effect with the same amount.

Withdrawal: experiencing physical or emotional symptoms when not using, or using the substance to avoid withdrawal.

Using more or for a longer time than intended.

Repeatedly trying to cut down or stop but failing.

Spending a lot of time obtaining, using, or recovering from the substance.

Giving up important activities (social, work, hobbies) because of substance use.

Continuing to use despite knowing it is causing or worsening physical or mental health problems.

**DSM-IV Criteria for Alcohol Use Disorder**

Alcohol use disorder was diagnosed using similar criteria. Alcohol abuse was diagnosed if at least one of the following was present in the past year:

Alcohol interfered with responsibilities at home, work, or school.

Repeatedly used alcohol in physically hazardous situations.

Had repeated legal problems related to drinking.

Continued drinking despite ongoing relationship problems caused by alcohol.

Alcohol dependence required at least three of the following in a 12-month period:

Tolerance: needing more alcohol to feel the same effect, or less effect with the same amount.

Withdrawal: experiencing withdrawal symptoms or drinking to avoid them.

Drinking more or longer than intended.

Repeated unsuccessful attempts to cut down or quit.

Spending a lot of time drinking or recovering from drinking.

Giving up important activities to drink.

Continuing to drink despite knowing it is causing or worsening physical or mental health problems.

**Key Differences and Practical Implications**

The DSM-IV separated abuse and dependence, which helped clinicians understand the severity of someone's condition. Abuse was considered less severe, while dependence indicated more serious problems and often physical addiction. These distinctions helped guide treatment decisions and support strategies for individuals and families.

Understanding these criteria helps families and friends recognize when someone might need professional help. If someone is showing several of these signs, it's important to encourage them to speak with a healthcare provider or addiction specialist. Early intervention can make a big difference in recovery outcomes.`
  },
  {
    id: 2,
    title: "The Lifeline After Treatment: Why AA Meetings Matter Most Once Rehab Ends",
    excerpt: "Completing inpatient treatment is an enormous accomplishment, but the transition back to everyday life brings new challenges. Discover why AA meetings become the single most consistent support system in lifelong recovery.",
    author: "Sober Helpline Team",
    date: "2025-01-10",
    category: "Aftercare",
    image: aaMeetingsImg,
    content: `Completing an inpatient treatment program for alcohol addiction is an enormous accomplishment. It marks the end of one chapter and the beginning of another—life in recovery. But while residential treatment provides a safe and structured space to heal physically and emotionally, the transition back into everyday life often brings new challenges. This is where Alcoholics Anonymous (AA) meetings play a vital role. Attending AA meetings after inpatient care isn't just recommended; for many people, it becomes the single most consistent support system in their lifelong recovery journey.

**From Structure to Freedom**

During inpatient treatment, individuals follow a carefully designed schedule filled with therapy sessions, group work, educational classes, and accountability. Once treatment ends, that structure ends too. Suddenly, there's freedom—along with all the temptations, stress, and uncertainty that freedom can bring. Without the daily rhythm and professional oversight of treatment, many find it difficult to maintain focus.

AA meetings provide a way to rebuild that structure in daily life. By attending meetings regularly, people can establish new routines that anchor them during this adjustment period. A consistent meeting schedule provides both accountability and stability, helping prevent old habits from resurfacing. It becomes a regular checkpoint where people reinforce their commitment to recovery, share progress, and gain encouragement from others on the same path.

**A Safe Space for Real Connection**

Loneliness can be one of the biggest threats to early recovery. In treatment, community is built-in; after discharge, however, many people return to environments that may still include drinking culture, unsupportive friends, or family members who don't fully understand addiction. That's where AA fills a critical gap.

AA meetings create a space where everyone understands the struggle. It's a place of shared experience and mutual respect, where people don't have to explain themselves or justify their feelings. This sense of belonging helps to replace alcohol's former grip with genuine human connection. The relationships formed in AA often become lifelong friendships and sources of strength during difficult times.

Research consistently shows that people who engage in peer-based recovery programs like AA are more likely to sustain long-term sobriety. The power of peer support cannot be overstated—hearing others' stories reinforces hope and shows that recovery is not only possible but sustainable.

**Living the Principles, Not Just Learning Them**

Inpatient programs lay a foundation of understanding—about addiction, triggers, coping mechanisms, and relapse prevention. But real mastery comes through practice, and AA provides the environment to continue learning and applying these lessons.

Through the 12 Steps, members work through personal reflection, amends, and spiritual growth. Each meeting reinforces these values and offers practical insights from members who have turned abstract lessons into lived experience. For example, learning about self-honesty and acceptance in treatment becomes lived through sharing at meetings or connecting with a sponsor.

AA meetings also emphasize service, encouraging members to help others who are newer to recovery. This responsibility fosters empathy, reinforces purpose, and strengthens personal commitment. In this way, AA is about more than staying sober—it's about maturing emotionally and spiritually.

**Accountability and Real-Time Support**

Relapse is often described as a process, not an event. It begins with subtle emotional or mental shifts before a person ever takes a drink. The regular rhythm of AA meetings offers a built-in system of early detection. Sponsors and peers can notice when someone seems discouraged, anxious, or withdrawn, allowing timely intervention.

Having a group to check in with keeps recovery in focus. Many attendees view AA as their "sober family," a network that holds them accountable but never condemns them. For individuals who may not have supportive environments at home, this accountability can be life-saving.

**Spiritual Growth and Hope**

Recovery from alcoholism is not just about abstaining from alcohol—it's about building a life that feels worth living. The spiritual and emotional guidance within AA meetings helps members find meaning and peace after years of struggle. The 12-step framework—while not inherently religious—encourages openness to a higher power or sense of purpose. That inner shift often becomes the foundation of long-term recovery and serenity.

Attending meetings regularly keeps this spiritual momentum alive. Even for those who don't connect with the spiritual language, the principles of honesty, humility, and self-reflection benefit anyone trying to live a healthier, more balanced life.

**A Proven Path for Long-Term Sobriety**

Studies have shown that consistent AA involvement strongly correlates with higher rates of sustained abstinence. The National Institute on Alcohol Abuse and Alcoholism notes that mutual-help groups significantly reduce relapse risk, especially when combined with professional treatment. Even attending one or two meetings a week after rehab can make a measurable difference.

The key lies in consistency. Regular participation builds routine, while hearing recovery stories continues to inspire perseverance. The lessons learned in AA meetings eventually integrate into everyday thinking—turning sobriety from a daily struggle into a natural state of being.

**Building a Life Beyond Recovery**

In the end, the goal of recovery is not just to stop drinking, but to rediscover purpose, connection, and joy. AA meetings help bridge the gap between treatment and thriving in everyday life. Members often describe their ongoing attendance not as an obligation, but as a privilege—a place where they continue to grow, learn, and give back.

For anyone completing inpatient treatment, attending AA meetings is not merely an afterthought. It is the continuation of recovery, the maintenance plan that keeps healing active and alive. Sobriety is built one day at a time—and AA offers the daily framework and fellowship to make that possible.`
  },
  {
    id: 3,
    title: "Why the Right Level of Care Matters",
    excerpt: "Choosing the right level of addiction treatment care is critical because it can mean the difference between short-term symptom relief and lasting recovery.",
    author: "Sober Helpline Team",
    date: "2025-01-05",
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
    id: 4,
    title: "Motivating Your Reluctant Loved One",
    excerpt: "When someone you care about is struggling with addiction but resistant to help, it can feel hopeless. Discover compassionate strategies to encourage treatment without pushing them away.",
    author: "Sober Helpline Team",
    date: "2025-01-01",
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
    id: 5,
    title: "Understanding the First Steps of Recovery",
    excerpt: "Recovery is a journey that begins with a single step. Learn about the crucial first steps that can set you or your loved one on the path to lasting sobriety.",
    author: "Sober Helpline Team",
    date: "2025-01-20",
    category: "Recovery Basics",
    image: firstStepsImg,
    content: null
  },
  {
    id: 6,
    title: "How to Support a Loved One in Treatment",
    excerpt: "Supporting someone through addiction treatment can be challenging. Discover effective ways to be there for your loved one while maintaining healthy boundaries.",
    author: "Sober Helpline Team",
    date: "2025-01-25",
    category: "Family Support",
    image: supportLovedOneImg,
    content: null
  },
  {
    id: 7,
    title: "The Importance of Aftercare in Recovery",
    excerpt: "Treatment is just the beginning. Learn why aftercare programs are essential for maintaining long-term sobriety and preventing relapse.",
    author: "Sober Helpline Team",
    date: "2025-01-30",
    category: "Aftercare",
    image: aftercareImg,
    content: null
  },
  {
    id: 8,
    title: "The Inseparability of Gratitude and Happiness in Staying Sober",
    excerpt: "Sobriety is more than the absence of substance use—it's a daily commitment to live in clarity and balance. Discover how gratitude transforms recovery from a struggle for survival into a journey of meaning and purpose.",
    author: "Sober Helpline Team",
    date: "2025-11-27",
    category: "Recovery Basics",
    image: gratitudeHappinessImg,
    content: `Sobriety is more than the absence of substance use—it's a daily commitment to live in clarity and balance. For many in recovery, the secret to maintaining that balance lies not only in willpower or therapy but in something far simpler and more profound: gratitude. Gratitude is the emotional anchor that keeps happiness, perspective, and peace alive. It transforms recovery from a struggle for survival into a journey of meaning and purpose.

**Gratitude as the Foundation of Emotional Stability**

When someone first chooses sobriety, life often feels raw and unstable. The numbing effect of substances masks pain, guilt, and shame, so when that layer is stripped away, a flood of emotion can take its place. Gratitude provides a grounding force amidst that emotional turbulence. By focusing on the good—even in small ways, such as waking up clear-minded or having the chance to start again—people in recovery create emotional stability.

Statistics and recovery programs align with this idea. Studies show that individuals who practice gratitude experience higher levels of optimism and lower rates of relapse. This happens because gratitude redirects attention away from what is missing and toward what is present. It shifts thinking from scarcity to abundance, helping people see life as something happening for them, not to them. That change in perspective fuels emotional resilience—the very fuel needed to endure the difficulties of recovery.

**Happiness as a Byproduct of Perspective**

Happiness in sobriety is not an endless high or a static emotion. It is a state of deep satisfaction and acceptance that grows as gratitude takes root. Many people chasing happiness without gratitude find it fleeting. Without gratitude, the mind fixates on what is lacking—money, comfort, relationships—and in recovery, that emptiness can lead straight back to the false promises of drinking or using.

Gratitude keeps happiness grounded. It transforms happiness from a passing mood into an enduring mindset. Daily gratitude—whether written, spoken, or silently acknowledged—creates pathways in the brain associated with positive thinking and contentment. Neuroscientists have found that these consistent expressions of thankfulness physically alter brain chemistry, activating dopamine and serotonin, the same feel-good neurotransmitters often disrupted by substance abuse. In this sense, gratitude biologically reinforces sobriety.

**Building Daily Practices that Sustain Both**

Recovery programs often say, "gratitude is an action word." It's not simply feeling thankful—it's living thankfully. This principle highlights the inseparable nature of gratitude and happiness: each sustains the other through intentional, daily actions. Here are ways people in recovery weave both into daily life:

**Morning reflection or journaling.** Writing down three things to be thankful for trains the mind to seek positive patterns. Over time, this becomes second nature, helping individuals face challenges from a place of calm and clarity.

**Service to others.** Helping someone else, whether through sharing one's story or volunteering, turns gratitude into motion. It creates purpose rooted in community, expanding happiness beyond self-interest.

**Mindful presence.** From savoring a warm coffee to appreciating a peaceful evening, mindfulness amplifies awareness of small joys that add up to greater contentment.

**Connection and humility.** Expressing appreciation for others—sponsors, family, friends—fosters trust and belonging. These interpersonal bonds are vital protections against relapse and loneliness.

These actions don't just make a person feel better for the moment. They rewire thought patterns to make gratitude and happiness self-reinforcing habits rather than reactions to circumstances.

**Why Gratitude Prevents Regression**

One of the silent threats to sobriety is complacency—the belief that once sober, one can stop doing the emotional work. Gratitude prevents that trap by keeping humility alive. It reminds a person that sobriety is both a gift and a choice renewed daily. When gratitude fades, discontent often sneaks back in, whispering the myth that happiness once came from a drink or a high. But gratitude exposes that illusion by grounding a person in present joy and self-worth.

Moreover, gratitude interrupts negative feedback loops. Shame, resentment, or regret—common feelings in early recovery—tend to breed isolation. Gratitude, by contrast, encourages openness. It invites connection, vulnerability, and forgiveness. It creates the emotional space needed to heal relationships and rebuild identity not as "someone who used to drink," but as someone growing stronger through experience.

**Happiness as the Ultimate Expression of Sobriety**

In active addiction, happiness was often transactional—something earned temporarily by escaping pain. In sobriety, happiness transforms into something sustainable: an appreciation for life's simple moments, the trust rebuilt with others, and the personal growth that replaces chaos with calm. This kind of happiness doesn't deny hardship; it coexists with it. And that's only possible through gratitude.

Every time someone in recovery chooses gratitude over resentment, they affirm their commitment to living with purpose. Each moment of happiness—laughter with a friend, peace after conflict, confidence in self—becomes evidence of that transformation. Gratitude gives those moments texture and permanence, turning happiness into a steady companion rather than a fleeting guest.

**A Shared Path Forward**

For those walking the road of sobriety, gratitude and happiness are not luxuries; they are necessities. They sustain motivation when the initial excitement of recovery fades and life resumes its normal rhythm. Practicing gratitude isn't about ignoring pain or pretending everything is fine—it's about recognizing that even through struggle, there are reasons to be thankful. And in that recognition, happiness naturally emerges.

Sobriety, at its heart, is a process of rediscovering life's gifts. When a person learns to be deeply grateful for the clarity, relationships, and opportunities sobriety brings, they are not just staying sober—they are living joyfully. Gratitude and happiness, inseparable and self-renewing, become the true measures of freedom.`
  },
  {
    id: 9,
    title: "Holiday Relapse Triggers: How to Protect Your Recovery This Season",
    excerpt: "The holidays can quietly increase relapse risk for people in recovery from alcohol or other addictions. Learn practical, compassionate strategies to stay grounded, connected, and sober this season.",
    author: "Sober Helpline Team",
    date: "2025-11-27",
    category: "Recovery Basics",
    image: holidayRelapseTriggersImg,
    content: `Listening to the holidays being described as "the most wonderful time of the year" can feel painful when you are just trying to stay sober one day at a time. If you are worried about relapse between now and the New Year, you are not alone and there are concrete steps you can take to protect your recovery.

**Why the Holidays Feel So Hard**

Research shows that relapse risk often jumps during the holiday season because stress, social pressure, and disrupted routines all pile up at once. Alcohol-centered gatherings, travel, financial strain, grief, and "holiday blues" can reactivate old patterns even when motivation to stay sober is strong.

For many people, familiar places, family dynamics, or certain dates carry powerful emotional memories linked to drinking, using, or other compulsive behaviors. When those memories collide with loneliness or conflict, cravings can feel intense and sudden.

**Know Your Triggers Before They Hit**

Taking time now to list your biggest triggers gives you more control when things get busy. Common holiday triggers include alcohol at every event, being around people you used to use with, unstructured time, and exhaustion from overscheduling.

Once you know your triggers, create a simple written plan: which events you will attend or skip, what you will say when offered a drink, who you will call if cravings spike, and how you will leave early if you start feeling unsafe. Treat this plan like a safety net rather than a set of rules to "perform" perfectly.

**Protect Your Routine and Your Body**

Studies and clinical experience both suggest that relapse risk increases when sleep, meals, and daily structure fall apart. Try to keep a basic routine: regular wake and bed times, consistent meals, movement, and a few non-negotiable recovery actions each day.

Simple physical habits can make a real difference in cravings: staying hydrated, eating balanced food, moving your body, and using grounding skills like slow breathing or brief mindfulness check-ins. When your body is less stressed, your brain has more space to use the tools you already have.

**Stay Connected, Not Isolated**

Loneliness and feeling "different" at holiday events are major risk factors for relapse. Planning regular contact with sober friends, peer support, or a sponsor can cushion those moments when you feel out of place or overwhelmed.

You might choose to bookend difficult events with calls or texts, attend extra mutual-help meetings, or join online recovery communities when travel or weather make in-person support hard to reach. Even a short check-in can remind you that you are not facing this season alone.

**Give Yourself Permission to Set Boundaries**

Recovery often requires saying no to situations that other people see as "no big deal." It is okay to leave early, decline invitations, skip traditions that revolve around alcohol, or bring your own non-alcoholic drink to feel more comfortable.

If certain conversations or people are consistently harmful, you can keep interactions brief, change the subject, or choose not to engage at all. Protecting your sobriety is not selfish; it is an act of care that benefits both you and the people who love you.

**A Gentle Call to Reach Out**

    If this holiday season feels heavy, or if you are scared you might relapse, reaching out for help is a sign of strength, not failure. A helpline, local treatment program, therapist, or peer support group can help you make a plan and walk with you through the hardest days.

You deserve support, and you do not have to wait until things get worse to ask for it. If you or someone you love is struggling right now, consider contacting a trusted helpline or recovery resource today to talk to someone who understands and can help you stay safe.`
  },
  {
    id: 10,
    title: "Ozempic, Weight Loss, and Eating Disorders: A Gentle Guide for Families",
    excerpt: "GLP‑1 drugs like Ozempic and Wegovy are all over the news, and many families feel unsure about the risks. This gentle guide explains how these medications can interact with eating disorders and how to lovingly support a loved one.",
    author: "Sober Helpline Team",
    date: "2025-11-28",
    category: "Family Support",
    image: ozempicEatingDisordersImg,
    content: `Medications like Ozempic, Wegovy, and similar GLP‑1 drugs were created to help people manage type 2 diabetes, but their strong effect on appetite and weight loss has made them widely used for weight control. Many people now know someone who is taking one of these medications or considering it, so it is natural to have questions and worries.

For some, these drugs can bring real health benefits. At the same time, they exist in a culture that praises thinness and quick fixes, which can be especially hard for anyone who already struggles with body image or food. Families are not overreacting when they pause and ask, "Is this truly supporting long‑term health?"

**How These Medications Change Hunger and Eating**

GLP‑1 medications change how the brain and gut communicate about hunger and fullness, often leading people to feel satisfied with much less food and to think about eating less often. Many describe this as "food getting quieter" in their minds, which can feel like a huge relief after years of struggling with overeating.

For someone who has wrestled with binge eating or emotional eating, this can seem like a fresh start. But when eating becomes very limited, rules get rigid, or there is growing fear about ever gaining weight back, the line between "helpful support" and "harmful control" can quietly blur. That is where gentle, curious conversations and good professional support really matter.

**When Helpful Support Starts to Hurt**

More professionals are noticing that these medications can sometimes worsen existing eating disorders or help them hide in plain sight. Rapid weight loss, constant compliments about appearance, and pressure to "keep it off" can accidentally reinforce dangerous patterns. On the surface, a person may look "successful," while inside they feel terrified of food or of their body changing.

There is also the emotional crash that can come if weight returns when the medicine is stopped or changed. Someone may feel shame, like they "failed," and that can push them toward more extreme dieting or urgent attempts to get back on the medication. In these moments, compassion and connection from loved ones are much more powerful than advice or criticism.

**Gentle Warning Signs to Notice**

If someone you care about is using a GLP‑1 medication, it helps to look at the whole picture, not just their weight. You might want to pay attention if you notice:

Often skipped meals, very long stretches without eating, or pride in "forgetting to eat" because of the shot.

Intense fear around missing a dose or gaining any amount of weight back, even a few pounds.

New, rigid food rules ("I never eat carbs now," "I can't eat after 4 p.m.") that cause distress if broken.

Pulling away from social events that involve food, or becoming more anxious, withdrawn, or self‑critical about appearance.

Noticing these signs does not mean you have to label anything right away. It simply means something important is going on and your loved one may need extra kindness, curiosity, and support.

**How to Show Up With Care**

You do not need to have all the answers to be deeply helpful. Often, what matters most is your steady presence and your willingness to listen without judgment. You might say things like, "I've noticed you seem more stressed about food lately—how has this been feeling for you?" or "I care about you far beyond your weight or what you eat."

If your loved one is open to it, encouraging a conversation with their prescriber, a therapist, or a dietitian who understands eating disorders can be a loving next step. Remind them that needing help is not a failure; it is a brave and wise response to something complicated. Their worth was never meant to be measured by a number on the scale or by a prescription.

**A Soft Call to Reach Out**

If any of this feels familiar—for you or someone you love—you do not have to sort it out alone. A caring helpline or recovery‑focused resource can listen to your story, help you make sense of what is happening, and connect you with support that fits your situation. Reaching out is not an overreaction; it is a gentle act of protection for your body, your mind, and your future. You and your loved ones deserve that care.`
  },
  {
    id: 11,
    title: "The Surge of Flavored Marijuana Vaping Among Youth and What Recovery Looks Like in 2025",
    excerpt: "Explore the sharp increase in flavored marijuana vaping among adolescents, evolving public views on alcohol risks, and the newest trends in compassionate addiction recovery support in 2025.",
    author: "Sober Helpline Team",
    date: "2025-11-30",
    category: "Family Support",
    image: youthVapingRecovery2025Img,
    content: `In recent years, flavored marijuana vaping has become a major trend among adolescents, raising health concerns for families and communities nationwide. Alongside this, shifts in alcohol consumption patterns and innovations in recovery support reveal a landscape of change in how addiction and wellness are understood and addressed today.

**The Rise of Flavored Marijuana Vaping Among Youth**

Studies show that from 2021 to 2024, the percentage of adolescents vaping flavored marijuana rose significantly, with vaping becoming the predominant mode of marijuana use among teens. This trend is troubling because flavored vaping products are often more appealing to young people and may facilitate more frequent, habitual use. Experts are calling for targeted research and policies to address this growing public health challenge focused on youth prevention and education.

**Changing Perceptions and Patterns of Alcohol Use**

In 2025, U.S. adults are drinking alcohol at historic lows, driven by a growing belief that even moderate alcohol consumption poses health risks. This shifting mindset has led to a surge in non-alcoholic beverage options and more public dialogue about alcohol's impact on sleep, blood pressure, cancer risk, and overall well-being. This change presents an opportunity for communities to support healthier lifestyles through education and interventions that reflect current scientific understanding.

**Innovations in Addiction Recovery Support**

Recovery in 2025 is evolving beyond traditional methods, emphasizing compassionate, culturally sensitive care that respects individual dignity. Outpatient treatment and virtual care are gaining popularity due to cost and accessibility benefits. Additionally, peer support services are increasingly recognized as vital in sustaining recovery, helping individuals navigate the challenges of maintaining health while managing life's economic pressures.

**Preventing and Addressing Addiction in Our Communities**

Preventing youth vaping and supporting those struggling with addiction require community-driven efforts, combining education, policy, treatment, and peer networks. Understanding these trends helps families, educators, and healthcare providers engage more effectively, fostering environments where support and recovery resources are accessible and stigma is reduced.

**Call to Action**

If you or someone you care about is facing challenges with substance use or addiction, reaching out for support can be a life-changing step. Contact a trusted helpline or local recovery resource today to learn about available options and start the journey toward healing.`
  },
  {
    id: 12,
    title: "Are Sports Betting Apps Quietly Fueling a New Addiction Crisis?",
    excerpt: "Mobile sports betting has made gambling feel like a game, especially for young men—but the mental health and financial fallout is very real. Here's how to spot the signs and where to get support.",
    author: "Sober Helpline Team",
    date: "2025-11-30",
    category: "Family Support",
    image: sportsBettingAddictionImg,
    content: `Mobile sports betting has made gambling feel like a game, especially for young men—but the mental health and financial fallout is very real. Here's how to spot the signs and where to get support.

**Why Sports Betting Feels "Safer" Than It Is**

Legal sports betting has exploded across the United States, driven largely by easy-to-use apps and nonstop advertising. Because bets happen on a phone instead of at a casino, many people see it as entertainment rather than a serious risk.

Surveys show that a growing majority of online sports bettors now believe they can reliably make money from betting, even though the odds are stacked against them. That confidence keeps people placing more bets, chasing the rush of a "big win" that rarely solves the damage being done in the background.

**The New Face of Gambling Addiction**

Mobile sports betting has changed who is getting hooked, and how quickly. Research and public health experts warn that young men are being hit especially hard, with rising rates of anxiety, depression, and substance use tied directly to sports betting apps. What used to develop over years in a casino can now escalate in months when a sportsbook lives in someone's pocket 24/7.

Data from recent surveys show that more than half of online sports bettors have chased losses and bet more than they felt comfortable losing. Many report feeling ashamed after a betting binge, and a significant portion say their gambling has already harmed their finances or relationships.

**Warning Signs You Might Be Past "Just for Fun"**

Problem gambling rarely starts as an obvious addiction; it usually begins as "just something to do during the game." Over time, certain patterns are red flags that things are slipping out of control.

Common warning signs include:

Betting more money or more often than planned, especially to "win back" what was lost.

Hiding betting activity, lying about losses, or moving money around to cover gaps.

Using credit cards, payday loans, or missed bills to keep betting.

Feeling intense shame, anxiety, or desperation after betting—but still going back to the app.

If a loved one seems constantly glued to live odds, has sudden money problems, or becomes irritable when they cannot check scores or place bets, those are also strong indicators that gambling might be crossing the line.

**The Hidden Mental Health Toll**

The damage from sports betting is not just financial. Mental health researchers are increasingly framing mobile betting as a growing public health problem. Constant exposure to real-time odds, "risk-free" promotions, and in-game bets creates a near-constant loop of anticipation, reward, and crash—very similar to other behavioral and substance addictions.

Problem bettors report higher levels of depression, anxiety, and thoughts of self-harm, especially when losses affect housing, family stability, or the ability to pay basic bills. For some, alcohol or drug use becomes a way to numb the shame and stress, creating a dangerous cycle where gambling and substance use feed each other.

**What Help Looks Like (And Why It's Not "Weak" to Ask)**

Gambling disorder is a treatable condition, not a moral failure. Evidence-based help can include specialized gambling counseling, debt and financial planning support, peer support groups, and sometimes medications for co-occurring depression or anxiety. Many people begin to recover as soon as they break the secrecy and talk honestly with someone who understands this specific kind of addiction.

If sports betting is starting to scare you—or someone you love—you do not have to wait for a complete collapse to reach out. A confidential helpline, support group, or addiction specialist can help you assess what is going on, talk through options, and create a practical plan to protect both mental health and money.

**Call to Action: You're Not Alone in This**

If sports betting, casino apps, or any form of gambling is taking over your life or your family's life, reach out today. A confidential helpline or recovery support service can help you make sense of what is happening and take the next right step—whether that is a conversation, a support group, or a structured intervention plan. You do not have to hit rock bottom, lose everything, or wait for one more "big game" to ask for help.`
  },
  {
    id: 13,
    title: "Why Using a Professional Interventionist Can Be Necessary",
    excerpt: "Discover the essential role of a professional interventionist in addiction recovery—their expertise can turn a crisis into a chance at hope, healing, and long-term change for families and loved ones.",
    author: "Sober Helpline Team",
    date: "2025-12-01",
    category: "Family Support",
    image: professionalInterventionistImg,
    content: `**The Role of a Professional Interventionist**

A professional interventionist acts as a neutral guide when confronting addiction within a family or friend group. Unlike informal approaches that can quickly become confrontational or emotionally charged, an interventionist uses proven strategies and compassionate communication to increase the chances of a loved one accepting help. These experts are trained to recognize the dynamics of addiction and mental health concerns, helping both the person in crisis and their support circle to focus on productive solutions instead of blame or frustration.

**Expertise and Structure Prevent Harm**

Interventions led by family alone often lack structure and can unknowingly worsen resistance or denial. Professional interventionists bring clinical knowledge about addiction, crisis management, and co-occurring mental health issues, skillfully navigating family dynamics to avoid damage. They organize the intervention process—from assessing the family's unique challenges, training participants, and selecting appropriate boundaries to preparing treatment options and transportation. This structured process means that everyone's voice is heard, reducing misunderstandings and increasing the likelihood of treatment enrollment, with entry rates of up to 80–90% reported for interventions led by professionals.

**Mediation, Objectivity, and Emotional Support**

An interventionist maintains objectivity when emotions run high. Their neutral standing helps mediate disputes, cool heated moments, and keep everyone, including the person struggling, focused on solutions. Professional interventionists also educate family members on enabling behaviors, the cycle of addiction, and the power of compassionate boundaries. By guiding families through writing and delivering letters, preparing next steps, and preventing personal grievances from hijacking the process, the interventionist ensures that the focus remains on hope and support rather than blame.

**Breaking Through Denial and Barriers**

Those struggling with addiction frequently defend, minimize, or hide their substance use due to denial, fear, or shame. Professional interventionists utilize evidence-based models like motivational interviewing and the Stages of Change to break through these defenses gently, moving the person toward treatment. They address ambivalence, highlighting the impact of addiction and presenting treatment as an opportunity, not a punishment. Such strategies are critical for preventing escalation into legal, medical, or irreparable family crises.

**Access to Resources and Continued Support**

Beyond the intervention event itself, professionals connect families to high-quality treatment providers, arrange logistics for detox or residential care, and coordinate follow-up support for early recovery and relapse prevention. Many offer ongoing consultation, helping families hold boundaries and manage expectations—key to long-term success. Their knowledge of insurance, local treatment options, and aftercare ensures that the path to recovery is as smooth and supported as possible.

**Call to Action: You Don't Have to Face This Alone**

If you're worried about a loved one's addiction, reaching out to a professional interventionist may change everything. The right support can replace desperation with hope. Call your local addiction helpline or search for certified interventionists in your area today—because help is available, and recovery starts with the right kind of guidance.`
  },
  {
    id: 14,
    title: "Boundaries Are the Fortress That Protects You from the Invasion of Addiction",
    excerpt: "Picture your family as an old stone castle on a hill. Addiction is not your loved one's soul or character; it is the enemy army camped outside the walls, always probing for weak spots, always trying to get inside the courtyard where your peace, safety, and sanity live.",
    author: "Sober Helpline Team",
    date: "2025-12-02",
    category: "Family Support",
    image: boundariesFortressImg,
    content: `Picture your family as an old stone castle on a hill. Addiction is not your loved one's soul or character; it is the enemy army camped outside the walls, always probing for weak spots, always trying to get inside the courtyard where your peace, safety, and sanity live.

**Walls and Gates**

The castle walls are your boundaries. They are not built to punish the person outside; they are built to protect the people inside.

If the walls are too low or crumbling, the invading force walks right in—crises, lies, late-night chaos, and constant rescues pour into your living room. If the walls are too high and sealed, the castle becomes a prison; no warmth, no relationship, just stone and silence.

That is why a healthy castle has walls and gates. The gate is where you say, "Here is what it takes to come inside: honesty, safety, respect, sobriety."

The gate can open for connection and close to manipulation. It does not swing on mood; it moves on clear values and limits.

**Moat and Drawbridge**

Around the castle is a moat. The moat is emotional distance: the space between you and the addiction. It means you no longer jump into the water every time your loved one thrashes; you let the water show them they are in trouble, while you stay on solid ground.

The drawbridge is how you respond. You can lower it when your loved one is willing to take real steps toward help, accountability, and recovery. You can raise it when they bring active use, blame, or abuse to your door. This is not cruelty; it is choosing safety over chaos.

**Watchtowers and Alarms**

Every good castle has watchtowers. These are your awareness and support: education about addiction, therapy, groups like SMART Family & Friends or Al-Anon, coaching, and your own recovery work.

From the tower, you can see the patterns coming: the broken promises, the guilt trips, the "just this once" requests for money or rescue.

When the guards see danger, they sound the alarm. For a family, the alarm is a calm, consistent boundary:

- "We will not have drugs or alcohol in this house."
- "We will not give you money, but we will help you find treatment."
- "If you are verbally abusive, we will end the conversation and step away."

**Inner Courtyard**

Inside the walls is the courtyard: your values, your peace, your other children, your marriage, your health, your work, your spirituality. Addiction loves to drag the entire castle into constant war, until no one inside remembers what a normal day feels like.

Healthy boundaries are how the castle remembers itself. They free the family to heal, rest, and connect again, instead of living in permanent crisis. They also give the addicted loved one something solid to push against—a clear outline of reality that can help them finally see the need for change.

**The Invitation, Not the Siege**

The goal is not to rain fire on your loved one outside the walls; it is to stop surrendering the castle to the invading army. When your boundaries are clear, consistent, and grounded in love, your message becomes: "This castle is safe, and you are wanted here—but only if you come without the army of addiction at your back."

One day, if they choose recovery, they do not have to storm the walls. They can walk across the bridge, lay down their weapons, and enter a home that is still standing, still warm, and still healthy enough to welcome them in.`
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Recovery Blog - Sober Helpline</title>
        <meta name="description" content="Expert guidance on addiction recovery, treatment options, and family support." />
      </Helmet>
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
          {blogPosts.slice().reverse().map((post) => (
            <Link key={post.id} to={post.content ? `/blog/${post.id}` : '#'} className={post.content ? '' : 'pointer-events-none'}>
              <Card className={`hover:shadow-lg transition-shadow overflow-hidden h-full ${post.content ? 'cursor-pointer' : ''}`}>
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
            </Link>
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
    </div>
  );
};

export default Blog;
