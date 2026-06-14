export interface RouteMetadata {
  title: string;
  description: string;
}

export const routeMetadata: Record<string, RouteMetadata> = {
  '/': {
    title: 'Family Addiction Support & Education | Sober Helpline',
    description: 'Free education, support, and ethical resources for families affected by addiction. Recovery Roadmap, AI tools, coaching, and a community that understands.',
  },
  '/roadmap': {
    title: 'Recovery Roadmap — 8-Stage Family Guide | Sober Helpline',
    description: 'Find your stage in the family recovery journey. From first suspicion to long-term recovery — personalized guidance, resources, and support at every step.',
  },
  '/roadmap/assessment': {
    title: 'Recovery Roadmap Assessment | Sober Helpline',
    description: 'Take a 5-minute assessment to find where you are in the family recovery journey and get your personalized roadmap.',
  },
  '/roadmap/suspicion': {
    title: 'Suspicion Stage — Recovery Roadmap | Sober Helpline',
    description: 'You sense something is wrong but aren\'t sure. Learn the signs to look for and what to do when you first suspect a loved one is struggling.',
  },
  '/roadmap/confirmation': {
    title: 'Confirmation Stage — Recovery Roadmap | Sober Helpline',
    description: 'You know there\'s a problem. Learn what to do next — and what NOT to do — when addiction is confirmed in your family.',
  },
  '/roadmap/crisis': {
    title: 'Crisis Stage — Recovery Roadmap | Sober Helpline',
    description: 'Things are falling apart right now. Emergency guidance for families in crisis with a loved one\'s addiction.',
  },
  '/roadmap/pre-intervention': {
    title: 'Pre-Intervention Stage — Recovery Roadmap | Sober Helpline',
    description: 'You\'re ready to take action. Prepare yourself and your family for the intervention conversation with expert guidance.',
  },
  '/roadmap/treatment': {
    title: 'Treatment Stage — Recovery Roadmap | Sober Helpline',
    description: 'Your loved one is in treatment. What families should do during this critical time to support recovery without enabling.',
  },
  '/roadmap/early-recovery': {
    title: 'Early Recovery Stage — Recovery Roadmap | Sober Helpline',
    description: 'They\'re home from treatment. How families can navigate early recovery, set boundaries, and rebuild trust.',
  },
  '/roadmap/long-term-recovery': {
    title: 'Long-Term Recovery — Recovery Roadmap | Sober Helpline',
    description: 'It\'s been 6+ months. How to rebuild family relationships and create a sustainable new normal in long-term recovery.',
  },
  '/roadmap/relapse': {
    title: 'Relapse Stage — Recovery Roadmap | Sober Helpline',
    description: 'It happened again. A family guide to responding to relapse with boundaries, compassion, and a clear plan forward.',
  },
  '/addiction-assessment': {
    title: 'Free Addiction Assessment for Families | Sober Helpline',
    description: 'Free, confidential addiction assessment to understand your situation and get personalized guidance for your family\'s next steps.',
  },
  '/family-coaching': {
    title: 'Family Addiction Coaching for Boundaries & Enabling | Sober Helpline',
    description: 'Private family addiction coaching for parents, spouses, and loved ones who need a clear plan for boundaries, enabling, relapse, treatment refusal, and next steps.',
  },
  '/family-consultation': {
    title: 'Crisis Coaching Session for Families | Sober Helpline',
    description: 'Book a private 60-minute Crisis Coaching Session with a professional family interventionist. Get a clear, calm next step for addiction-related family crisis.',
  },
  '/from-no-more-enabling': {
    title: 'Coming From No More Enabling? | Sober Helpline',
    description: 'A guided next step for No More Enabling readers: free Family Squares support, private family coaching, intervention readiness, and ethical treatment guidance.',
  },
  '/family-squares-next-step': {
    title: 'After Family Squares: Choose the Right Next Step | Sober Helpline',
    description: 'Choose the right next step after Family Squares: continued free support, family membership, private coaching, or intervention readiness.',
  },
  '/family-addiction-consult': {
    title: 'Family Addiction Consult | Sober Helpline',
    description: 'A private family addiction consult for parents, spouses, and loved ones who need help choosing the next right step.',
  },
  '/intervention-readiness-consult': {
    title: 'Intervention Readiness Consult | Sober Helpline',
    description: 'A private consult for families deciding whether treatment refusal, relapse, or escalating risk may require professional intervention planning.',
  },
  '/addiction-family-coaching': {
    title: 'Family Addiction Coaching for Parents, Spouses & Siblings | Sober Helpline',
    description: 'Private family addiction coaching for parents, spouses, and siblings dealing with lying, relapse, boundaries, treatment refusal, and family alignment.',
  },
  '/partner-with-sober-helpline': {
    title: 'Partner With Sober Helpline | Audience & Family Support',
    description: 'A quiet partner overview for ethical providers, sponsors, and recovery-aligned brands interested in Sober Helpline family addiction support.',
  },
  '/family-readiness-intensive': {
    title: 'Family Readiness Intensive for Intervention Planning | Sober Helpline',
    description: 'A focused intervention readiness strategy session for families who need clarity before moving into a professional intervention with Freedom Interventions.',
  },
  '/intervention-help': {
    title: 'Intervention Help for Families | Sober Helpline',
    description: 'Not sure if your family needs a professional intervention? Learn the warning signs, next steps, and how Sober Helpline connects families with Freedom Interventions.',
  },
  '/family-support': {
    title: 'Family Support Resources for Addiction | Sober Helpline',
    description: 'Support resources for families dealing with a loved one\'s addiction. Education, community, coaching, and tools to help you take action.',
  },
  '/support': {
    title: 'SoberHelpline App Support | Sober Helpline',
    description: 'Support for the SoberHelpline mobile app, account access, subscriptions, billing questions, technical issues, and family support resources.',
  },
  '/privacy': {
    title: 'Privacy Policy | Sober Helpline',
    description: 'Privacy policy for Sober Helpline and the SoberHelpline mobile app, including data collection, use, sharing, retention, account deletion, and contact information.',
  },
  '/start-here': {
    title: 'Start Here for Family Addiction Help | Sober Helpline',
    description: 'Not sure where to begin? Choose between free Monday support, private family coaching, or intervention readiness help.',
  },
  '/family-education': {
    title: 'Addiction Education for Families | Sober Helpline',
    description: 'Learn what addiction really is, how it affects families, and what you can do. Evidence-based education designed for families.',
  },
  '/family-education/tracks': {
    title: 'Curated Family Education Tracks | Sober Helpline',
    description: 'Guided family education tracks for crisis, boundaries, treatment decisions, relapse, family systems, and more.',
  },
  '/family-membership': {
    title: 'Family Membership — Premium Support & Tools | Sober Helpline',
    description: 'Premium family resources, coaching sessions, exclusive content, and community support. Invest in your family\'s recovery journey.',
  },
  '/family-webinars': {
    title: 'Free Family Webinars on Addiction & Recovery | Sober Helpline',
    description: 'Live and recorded webinars on boundaries, enabling, treatment navigation, and family recovery. Free for all families.',
  },
  '/family-forum': {
    title: 'Family Support Forum — Connect with Families | Sober Helpline',
    description: 'Join a community of families navigating addiction together. Share experiences, ask questions, and find support from people who truly understand.',
  },
  '/family-action-plan': {
    title: 'Family Action Plan — Your Next Steps | Sober Helpline',
    description: 'Get a personalized family action plan for dealing with your loved one\'s addiction. Practical steps based on where you are right now.',
  },
  '/understanding-addiction': {
    title: 'Understanding Addiction — A Family Guide | Sober Helpline',
    description: 'Addiction isn\'t a choice or a moral failure. Learn what it really is, how it changes the brain, and what families need to know.',
  },
  '/how-addiction-affects-the-brain': {
    title: 'How Addiction Affects the Brain | Sober Helpline',
    description: 'Understand the neuroscience of addiction in plain language. How substances hijack the brain and why willpower alone isn\'t enough.',
  },
  '/faqs': {
    title: 'Addiction & Recovery FAQs for Families | Sober Helpline',
    description: 'Answers to common questions families have about addiction, intervention, treatment, recovery, and how to help a loved one.',
  },
  '/testimonials': {
    title: 'Family Success Stories & Testimonials | Sober Helpline',
    description: 'Real stories from families who navigated addiction and found their way. See how education, boundaries, and the right support changed everything.',
  },
  '/for-providers': {
    title: 'For Treatment Providers — Partner with Us | Sober Helpline',
    description: 'Join our vetted provider directory. Ethical treatment providers connecting with families who need help. No referral fees.',
  },
  '/interventionists': {
    title: 'Find a Professional Interventionist | Sober Helpline',
    description: 'Connect with vetted, experienced addiction interventionists. We only recommend professionals we trust to serve families with integrity.',
  },
  '/recovery-resources': {
    title: 'Addiction Recovery Resources for Families | Sober Helpline',
    description: 'Comprehensive recovery resources: treatment guides, support tools, boundary exercises, and more — all in one place.',
  },
  '/family-squares': {
    title: 'Family Squares Free Monday Support Meeting | Sober Helpline',
    description: 'Free Monday support meeting for families affected by addiction. Register for Family Squares, ask practical questions, and find a calmer next step.',
  },
  '/monday-zoom-registration': {
    title: 'Monday Family Support Group — Free Zoom | Sober Helpline',
    description: 'Free weekly family support group every Monday at 7 PM PT. Connect with other families, get guidance, and feel less alone.',
  },
  '/conversation-starters': {
    title: 'How to Talk About Addiction with a Loved One | Sober Helpline',
    description: 'Conversation starters for the hardest talk about addiction. Approach your loved one with compassion and clarity.',
  },
  '/fear-inventory-exercise': {
    title: 'Fear Inventory Exercise for Families | Sober Helpline',
    description: 'Identify the fears that keep you stuck. This exercise helps families move from paralysis to action in dealing with addiction.',
  },
  '/boundaries-ultimatums': {
    title: 'Boundaries vs. Ultimatums — Know the Difference | Sober Helpline',
    description: 'Boundaries protect you. Ultimatums try to control them. Learn the difference and how to set boundaries that work.',
  },
  '/communication-guide': {
    title: 'Addiction Communication Guide for Families | Sober Helpline',
    description: 'How to communicate with an addicted loved one. Stop the arguments, reduce the chaos, and start conversations that matter.',
  },
  '/enabling-language-translator': {
    title: 'Enabling Language Translator — AI Tool | Sober Helpline',
    description: 'Paste what you\'re about to say and our AI will show you if it\'s enabling, boundary-setting, or somewhere in between.',
  },
  '/ai-boundary-builder-coach': {
    title: 'AI Boundary Builder — Free Coaching Tool | Sober Helpline',
    description: 'Build personalized boundaries for your specific situation. Free AI coaching tool for families dealing with addiction.',
  },
  '/ai-enabling-decision-coach': {
    title: 'Am I Enabling? — AI Decision Coach | Sober Helpline',
    description: 'Are you enabling? Describe your situation and find out. Free AI tool for families of addicted loved ones.',
  },
  '/ai-addiction-reality-translator': {
    title: 'Addiction Reality Translator — AI Tool | Sober Helpline',
    description: 'Translate the confusing behavior of addiction into plain language. Understand what\'s really happening and your options.',
  },
  '/ai-treatment-navigator': {
    title: 'AI Treatment Navigator — Find the Right Care | Sober Helpline',
    description: 'Find the right level of care for your loved one. Free AI treatment navigator — no personal info required.',
  },
  '/ai-relapse-response-guide': {
    title: 'Relapse Response Guide — AI Support Tool | Sober Helpline',
    description: 'Your loved one relapsed. Our AI guide walks you through what to do right now — boundaries, safety, and next steps.',
  },
  '/ai-life-coach': {
    title: 'AI Life Coach for Families of Addicts | Sober Helpline',
    description: 'Get personalized guidance for the challenges of loving someone with addiction. Take care of yourself while navigating recovery.',
  },
  '/medical-detox': {
    title: 'Medical Detox — What Families Need to Know | Sober Helpline',
    description: 'What is medical detox? How long does it take? A family-focused guide to the first step of addiction treatment.',
  },
  '/inpatient-treatment': {
    title: 'Inpatient Treatment — Family Guide | Sober Helpline',
    description: 'Everything families need to know about inpatient addiction treatment: what it is, how long, and what to look for.',
  },
  '/outpatient-treatment': {
    title: 'Outpatient Treatment Programs — Family Guide | Sober Helpline',
    description: 'Outpatient addiction treatment options explained: IOP, PHP, and standard outpatient. When it\'s appropriate and what families should know.',
  },
  '/sober-living': {
    title: 'Sober Living Homes — What Families Should Know | Sober Helpline',
    description: 'A family guide to sober living homes: what they are, how they work, and why they\'re often critical between treatment and independence.',
  },
  '/levels-of-care-addiction-treatment': {
    title: 'Levels of Care in Addiction Treatment | Sober Helpline',
    description: 'Understand the continuum of addiction treatment: detox, residential, PHP, IOP, outpatient, and aftercare. Match the right level.',
  },
  '/treatment-modalities': {
    title: 'Addiction Treatment Modalities Explained | Sober Helpline',
    description: 'CBT, DBT, EMDR, motivational interviewing, 12-step, and more. Understand the treatment approaches used in addiction recovery.',
  },
  '/treatment-red-flags': {
    title: 'Treatment Center Red Flags — What to Watch For | Sober Helpline',
    description: 'Red flags every family should know before choosing an addiction treatment center. Protect your family from bad actors.',
  },
  '/treatment-questions': {
    title: 'Questions to Ask a Treatment Center | Sober Helpline',
    description: 'The most important questions to ask before choosing a treatment center. Don\'t commit until you\'ve asked these.',
  },
  '/treatment-industry-guide': {
    title: 'The Addiction Treatment Industry — Family Guide | Sober Helpline',
    description: 'How the treatment industry works, what to watch for, and how to navigate it as a family. Honest, unfiltered guidance.',
  },
  '/aftercare-checklist': {
    title: 'Aftercare Checklist — Post-Treatment Planning | Sober Helpline',
    description: 'Treatment is just the beginning. Use this aftercare checklist to plan for long-term recovery success and prevent relapse.',
  },
  '/recovery-podcasts': {
    title: 'Best Addiction Recovery Podcasts | Sober Helpline',
    description: 'Curated list of the best addiction and recovery podcasts for families and individuals. Education, inspiration, and community.',
  },
  '/family-roles-addiction': {
    title: 'Family Roles in Addiction — Who Plays What Part | Sober Helpline',
    description: 'The hero, the scapegoat, the lost child, the mascot. Understand the roles families adopt around addiction and how to break free.',
  },
  '/sibling-experience': {
    title: 'The Sibling Experience — Growing Up with Addiction | Sober Helpline',
    description: 'Siblings of addicts carry invisible wounds. Understanding their experience is crucial for family healing and recovery.',
  },
  '/grief-for-family': {
    title: 'Family Grief in Addiction — Mourning a Living Person | Sober Helpline',
    description: 'The grief of watching someone you love disappear into addiction. It\'s real, it\'s valid, and there are ways to process it.',
  },
  '/emotional-regulation': {
    title: 'Emotional Regulation for Families of Addicts | Sober Helpline',
    description: 'When your loved one\'s addiction triggers your emotions, here\'s how to regulate, respond (not react), and protect your mental health.',
  },
  '/cost-of-secrecy': {
    title: 'The Cost of Secrecy in Addiction | Sober Helpline',
    description: 'Family secrets don\'t protect anyone — they protect the addiction. Why secrecy is dangerous and how to break the cycle.',
  },
  '/guilt-relief-resentment': {
    title: 'Guilt, Relief & Resentment in Addiction | Sober Helpline',
    description: 'It\'s normal to feel guilty, relieved, and resentful — sometimes all at once. Understanding these emotions is part of your recovery.',
  },
  '/blog': {
    title: 'Family Addiction Blog — Education & Support | Sober Helpline',
    description: 'Articles, guides, and insights for families dealing with a loved one\'s addiction. Written by a professional interventionist with 20+ years experience.',
  },
  '/sober-coaches-companions': {
    title: 'Find a Sober Coach Near You | Sober Coaches & Companions',
    description: 'Find a sober coach, sober companion, or sober living coach for recovery support. Search by state or ZIP code and learn what kind of support fits.',
  },
  '/therapists': {
    title: 'Find an Addiction Therapist | Sober Helpline',
    description: 'Browse vetted therapists specializing in addiction and family recovery. Find the right mental health support for your situation.',
  },
  '/psychiatrists': {
    title: 'Find an Addiction Psychiatrist | Sober Helpline',
    description: 'Connect with psychiatrists who specialize in addiction and co-occurring mental health disorders. Medication management and dual diagnosis.',
  },
  '/free-guide': {
    title: 'Free Family Guide to Addiction Recovery | Sober Helpline',
    description: 'Download our free guide for families navigating a loved one\'s addiction. Practical steps, boundary tips, and recovery resources.',
  },
  '/eating-disorders-guide': {
    title: 'Eating Disorders & Addiction — Family Guide | Sober Helpline',
    description: 'Understanding the connection between eating disorders and addiction. What families need to know about co-occurring conditions.',
  },
  '/why-change-doesnt-happen': {
    title: 'Why Change Doesn\'t Happen in Addiction | Sober Helpline',
    description: 'Understanding why addicts resist change and what families can do to stop waiting and start their own recovery process.',
  },
  '/drug-induced-psychosis': {
    title: 'Drug-Induced Psychosis — Family Guide | Sober Helpline',
    description: 'What families need to know about drug-induced psychosis: signs, causes, treatment, and how to keep everyone safe.',
  },
  '/multiple-treatment-episodes': {
    title: 'Multiple Treatment Episodes — Why Relapse Happens | Sober Helpline',
    description: 'When treatment doesn\'t stick the first time. Understanding multiple episodes, what to do differently, and maintaining hope.',
  },
  '/legal-issues-guide': {
    title: 'Legal Issues & Addiction — Family Guide | Sober Helpline',
    description: 'Navigating the legal system when addiction is involved. What families need to know about courts, custody, and intervention.',
  },
  '/disease-choice-reality-map': {
    title: 'Addiction: Disease vs. Choice — Reality Map | Sober Helpline',
    description: 'Is addiction a disease or a choice? The answer is more nuanced than either side admits. Understand what the science really says.',
  },
  '/why-willpower-fails': {
    title: 'Why Willpower Fails in Addiction | Sober Helpline',
    description: 'Willpower isn\'t enough to overcome addiction. Understand the neuroscience behind why and what actually works instead.',
  },
  '/addiction-progression-timeline': {
    title: 'Addiction Progression Timeline | Sober Helpline',
    description: 'How addiction progresses over time — from experimentation to dependence. A visual timeline families can use to understand the stages.',
  },
  '/mental-health-vs-substance-induced': {
    title: 'Mental Health vs. Substance-Induced Symptoms | Sober Helpline',
    description: 'Is it mental illness or the drugs? How to tell the difference between mental health disorders and substance-induced symptoms.',
  },
  '/misunderstood-diagnoses': {
    title: 'Misunderstood Diagnoses in Addiction | Sober Helpline',
    description: 'Common misdiagnoses in addiction treatment and how they can derail recovery. What families should question and advocate for.',
  },
  '/mental-health-delays-recovery': {
    title: 'When Mental Health Delays Recovery | Sober Helpline',
    description: 'Untreated mental health conditions can prevent lasting recovery. How families can advocate for proper dual-diagnosis treatment.',
  },
  '/trauma-vs-excuses': {
    title: 'Trauma vs. Excuses in Addiction | Sober Helpline',
    description: 'Understanding trauma\'s role in addiction without letting it become an excuse. A balanced perspective for families.',
  },
  '/how-trauma-shapes-addiction': {
    title: 'How Trauma Shapes Addiction | Sober Helpline',
    description: 'The connection between trauma and addiction is powerful. Learn how adverse experiences drive substance use and what heals it.',
  },
  '/matching-modality': {
    title: 'Matching Treatment Modality to Your Loved One | Sober Helpline',
    description: 'Not all treatment approaches work for everyone. Learn how to match the right modality to your loved one\'s specific needs.',
  },
  '/therapy-timing': {
    title: 'When to Start Therapy in Recovery | Sober Helpline',
    description: 'Timing matters in recovery therapy. Understand when different types of therapy are most effective and why.',
  },
  '/family-interference': {
    title: 'Family Interference in Recovery | Sober Helpline',
    description: 'When family help becomes family interference. Learn the line between supporting recovery and sabotaging it.',
  },
  '/what-changes-when-families-change': {
    title: 'What Changes When Families Change | Sober Helpline',
    description: 'When families stop enabling and start recovering, everything shifts. Understand the ripple effect of family change.',
  },
  '/insight-behavior-tracker': {
    title: 'Insight & Behavior Tracker for Families | Sober Helpline',
    description: 'Track patterns, triggers, and changes in your loved one\'s behavior. A practical tool for families navigating addiction.',
  },
  '/values-aligned-decisions': {
    title: 'Values-Aligned Decisions in Addiction | Sober Helpline',
    description: 'Make decisions about your loved one\'s addiction that align with your values, not your fears. A framework for families.',
  },
  '/living-well-regardless': {
    title: 'Living Well Regardless of Their Addiction | Sober Helpline',
    description: 'You can\'t control their recovery, but you can reclaim your life. How to live well regardless of what they choose.',
  },
  '/brain-spiritual-recovery': {
    title: 'Brain Science & Spiritual Recovery | Sober Helpline',
    description: 'How neuroscience and spirituality intersect in addiction recovery. Understanding the whole-person approach to healing.',
  },
  '/twelve-steps-explained': {
    title: '12 Steps of Recovery Explained for Families | Sober Helpline',
    description: 'A family-friendly explanation of the 12 steps. What they mean, how they work, and why they matter in recovery.',
  },
  '/non-twelve-step-modalities': {
    title: 'Non-12-Step Recovery Options | Sober Helpline',
    description: 'SMART Recovery, Refuge Recovery, and other alternatives to 12-step programs. Understanding all the paths to recovery.',
  },
  '/no-negotiation': {
    title: 'No-Negotiation Boundaries in Addiction | Sober Helpline',
    description: 'Some boundaries aren\'t negotiable. Learn which lines should never be crossed and how to hold them firmly with love.',
  },
  '/strong-one': {
    title: 'The Strong One — When You Carry Everything | Sober Helpline',
    description: 'You\'ve been the strong one for too long. This guide is for the family member who holds it all together — and is exhausted.',
  },
  '/growing-up-shadow': {
    title: 'Growing Up in the Shadow of Addiction | Sober Helpline',
    description: 'What it\'s like to grow up with an addicted family member. Understanding the lasting impact and finding healing.',
  },
  '/sibling-guilt-anger-loyalty': {
    title: 'Sibling Guilt, Anger & Loyalty in Addiction | Sober Helpline',
    description: 'Siblings face unique emotional conflicts around addiction. Understanding guilt, anger, and divided loyalty.',
  },
  '/rebuilding-sibling-relationships': {
    title: 'Rebuilding Sibling Relationships After Addiction | Sober Helpline',
    description: 'Addiction damages sibling bonds. Learn how to begin repairing relationships and rebuilding trust within the family.',
  },
  '/parents-repairing-sibling-system': {
    title: 'Parents Repairing the Sibling System | Sober Helpline',
    description: 'How parents can help restore balance among siblings after addiction has disrupted the family dynamic.',
  },
  '/sibling-support': {
    title: 'Support for Siblings of Addicts | Sober Helpline',
    description: 'Resources and guidance specifically for siblings of people struggling with addiction. You matter too.',
  },
  '/addiction-rewrites-family-rules': {
    title: 'How Addiction Rewrites Family Rules | Sober Helpline',
    description: 'Addiction doesn\'t just affect the user — it rewrites the unspoken rules your family lives by. Learn to recognize and reclaim them.',
  },
  '/boundary-drift': {
    title: 'Boundary Drift — When Limits Slowly Erode | Sober Helpline',
    description: 'How boundaries slowly erode over time and why families don\'t notice until they\'re gone. Recognizing and reversing boundary drift.',
  },
  '/anger-and-boundaries': {
    title: 'Anger & Boundaries in Addiction | Sober Helpline',
    description: 'Anger is a signal that your boundaries have been crossed. Learn to use anger constructively in your family recovery.',
  },
  '/flexibility-vs-instability': {
    title: 'Flexibility vs. Instability in Family Recovery | Sober Helpline',
    description: 'Knowing when to be flexible and when to hold firm. The balance families must find in addiction recovery.',
  },
  '/addiction-attachment-styles': {
    title: 'Attachment Styles & Addiction in Families | Sober Helpline',
    description: 'How attachment patterns influence addiction and family dynamics. Understanding your style can transform your approach.',
  },
  '/intergenerational-enabling': {
    title: 'Intergenerational Enabling Patterns | Sober Helpline',
    description: 'Enabling behaviors often pass through generations. Recognize inherited patterns and break the cycle in your family.',
  },
  '/who-benefits-filter': {
    title: 'Who Benefits? Decision Filter for Families | Sober Helpline',
    description: 'Before you help, ask: who really benefits? A decision-making filter for families navigating addiction.',
  },
  '/family-unity-liability': {
    title: 'Family Unity as a Liability in Addiction | Sober Helpline',
    description: 'When family togetherness enables addiction. Understanding when unity helps and when it hurts recovery.',
  },
  '/safe-to-open-up': {
    title: 'Is It Safe to Open Up About Addiction? | Sober Helpline',
    description: 'Deciding who to trust with your family\'s story. When to share, who to tell, and how to protect your privacy.',
  },
  '/addiction-as-stress-disorder': {
    title: 'Addiction as a Stress Response Disorder | Sober Helpline',
    description: 'Understanding addiction through the lens of stress and trauma. A perspective that changes how families respond.',
  },
  '/scenario-exercise': {
    title: 'Family Scenario Exercise — Practice Responses | Sober Helpline',
    description: 'Practice your responses to common addiction scenarios before they happen. Build confidence in your boundary-setting skills.',
  },
  '/crisis-chaos': {
    title: 'Crisis & Chaos in Addiction — Family Guide | Sober Helpline',
    description: 'When everything is falling apart. A guide for families in the middle of addiction-related chaos and crisis.',
  },
  '/values-exercise': {
    title: 'Values Clarification Exercise for Families | Sober Helpline',
    description: 'Identify your core values to make better decisions about your loved one\'s addiction. A guided exercise for families.',
  },
  '/talking-about-treatment': {
    title: 'Talking About Treatment with Your Loved One | Sober Helpline',
    description: 'How to bring up treatment without triggering defensiveness. Practical scripts and strategies for the conversation.',
  },
  '/readiness-checklist': {
    title: 'Recovery Readiness Checklist for Families | Sober Helpline',
    description: 'Is your loved one ready for treatment? Use this checklist to assess readiness and prepare for the next steps.',
  },
  '/relapse-warning-signs': {
    title: 'Relapse Warning Signs — What Families Should Watch For | Sober Helpline',
    description: 'Know the early warning signs of relapse before it happens. A practical tracker and guide for families in recovery.',
  },
  '/family-advocacy-toolkit': {
    title: 'Family Advocacy Toolkit for Addiction | Sober Helpline',
    description: 'Tools and resources to help families advocate effectively for their loved one\'s treatment and recovery.',
  },
  '/recovery-requirements': {
    title: 'Recovery Requirements — What It Takes | Sober Helpline',
    description: 'What recovery actually requires from the addicted person and their family. Setting realistic expectations.',
  },
  '/boundary-setting-worksheet': {
    title: 'Boundary Setting Worksheet for Families | Sober Helpline',
    description: 'A step-by-step worksheet to help you define, communicate, and enforce healthy boundaries with your addicted loved one.',
  },
  '/book-consultation': {
    title: 'Book a Family Consultation | Sober Helpline',
    description: 'Schedule a consultation with an addiction professional. Get personalized guidance for your family\'s situation.',
  },
  '/onboarding-quiz': {
    title: 'Family Onboarding Quiz | Sober Helpline',
    description: 'Tell us about your situation so we can personalize your experience. A quick quiz to get you started.',
  },
  '/coaching-onboarding': {
    title: 'Coaching Onboarding — Get Started | Sober Helpline',
    description: 'Get started with family addiction coaching. Complete your onboarding to begin working with your coach.',
  },
  '/zoom-recordings': {
    title: 'Past Support Group Recordings | Sober Helpline',
    description: 'Watch past family support group recordings. Catch up on sessions you missed or revisit helpful discussions.',
  },
  '/provider-info': {
    title: 'Provider Directory Information | Sober Helpline',
    description: 'Learn about our vetted provider directory and how we connect families with ethical addiction treatment providers.',
  },
  '/provider-application': {
    title: 'Provider Application — Join Our Directory | Sober Helpline',
    description: 'Apply to join Sober Helpline\'s vetted provider directory. We connect ethical treatment providers with families who need help.',
  },
  '/relapse-radar': {
    title: 'Relapse Radar — Early Warning Signs Assessment | Sober Helpline',
    description: 'Identify potential relapse risks before a crisis happens. Free interactive assessment tool for families navigating addiction recovery.',
  },
};

/**
 * Get metadata for a given route. Falls back to a smart title derived from the path.
 */
export function getRouteMetadata(pathname: string): RouteMetadata {
  // Exact match first
  if (routeMetadata[pathname]) {
    return routeMetadata[pathname];
  }

  // Blog posts handled separately via BlogArticle component
  if (pathname.startsWith('/blog/')) {
    return {
      title: 'Family Addiction Blog | Sober Helpline',
      description: 'Articles, guides, and insights for families dealing with a loved one\'s addiction.',
    };
  }

  // Smart fallback: convert slug to title case
  const slug = pathname.replace(/^\//, '').split('/').pop() || '';
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const topic = formattedTitle || 'Addiction Recovery';
  return {
    title: formattedTitle ? `${formattedTitle} | Sober Helpline` : 'Sober Helpline',
    description: `Learn about ${topic} — free family addiction support and education at Sober Helpline.`,
  };
}
