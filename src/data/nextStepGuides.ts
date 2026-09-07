export const urgentHelp = "In the U.S., call 911 for immediate danger, suspected overdose, trouble breathing, or someone who cannot be woken. For a suicide or mental-health crisis, call or text 988. Outside the U.S., use your local emergency or crisis service. Do not wait for this guide or a reply from Sober Helpline.";

export const nextStepPaths = [
  {
    id: "options",
    title: "Understanding options",
    description: "Get oriented without having to choose a treatment program today.",
    question: "What would be most useful to understand first?",
    choices: [
      { label: "Where support can begin", action: "Start with one conversation with a licensed clinician or primary care professional. Ask for an assessment of substance use, physical health, and mental health together—not a placement recommendation based on a sales call." },
      { label: "Questions to ask a treatment provider", action: "Before agreeing to a program, ask who provides care, how they decide the appropriate level of care, what medications and mental-health support are available, and what happens after discharge. Request costs, insurance coverage, and cancellation terms in writing." },
      { label: "Support for me as a family member", action: "Choose one source of support for yourself: a licensed therapist, a family peer-support meeting such as Al-Anon or SMART Recovery Family & Friends, or someone you trust. You can seek support even if your loved one is not ready." },
    ],
    heading: "A clearer starting point",
    steps: [
      "Separate what you have observed from what you fear. On paper, note one concrete change and one question you want answered. You do not need to label or diagnose anyone.",
      "Know the broad options: outpatient care fits around life at home; residential care provides a live-in setting; medical withdrawal care addresses withdrawal safety. A qualified clinician—not this guide—should help determine what fits.",
      "Choose one question to take to a professional or trusted support person. You can gather information without committing to treatment or sharing your loved one's story widely.",
    ],
    script: "I am trying to understand the options, not make a decision today. How would you assess what support is appropriate, and what would it cost?",
  },
  {
    id: "conversation",
    title: "Preparing a family conversation",
    description: "Plan a calm opening and a boundary you can actually keep.",
    question: "Which part would you like help with?",
    choices: [
      { label: "Finding the words to start", action: "Choose one observation rather than a list of accusations: ‘I noticed you missed work twice this week, and I am worried. How have things been for you?’ Ask one open question, then leave room to listen." },
      { label: "Setting a caring boundary", action: "Name an action you control: ‘I care about you. I will not lend my car when you have been drinking. I can help arrange a safe ride.’ A boundary protects safety and wellbeing; it is not a punishment or a way to force recovery." },
      { label: "When we disagree or they say no", action: "A no does not require an argument. Try: ‘I hear you are not ready. I am still available to talk about support, and I am going to get support for myself.’ If relatives disagree, plan separately with a trusted professional rather than staging a surprise confrontation." },
    ],
    heading: "A conversation you can prepare for",
    steps: [
      "Pick a time when neither of you is intoxicated, driving, or in the middle of an argument. Ask whether it is a good time to talk. If you fear violence or retaliation, do not confront the person; get individual safety support first.",
      "Keep the goal small: understanding each other and offering one possible next step. Use specific observations and ‘I’ statements. Avoid shame, threats, labels, and trying to prove who is right.",
      "Decide how you will pause: ‘This is getting heated. I am going to stop for now.’ Arrange support for yourself afterward. Their response does not determine whether you deserve care or support.",
    ],
    script: "I love you, and I am worried about what I have noticed. I want to listen. Would you be willing to talk about one kind of support?",
  },
  {
    id: "concern",
    title: "Immediate concern",
    description: "See urgent resources now, then practical steps if it is safe to continue.",
    question: "If it is safe to keep reading, what information would help?",
    choices: [
      { label: "Overdose or immediate danger resources", action: "Call 911 now for suspected overdose, trouble breathing, inability to wake someone, or immediate danger. If opioid overdose is possible and naloxone is available, give it according to the package instructions and follow the dispatcher's directions. Stay nearby only if safe. Do not wait to see if the person sleeps it off." },
      { label: "Suicide or mental-health crisis resources", action: "In the U.S., call or text 988 for suicide or mental-health crisis support, including concern about someone else. Call 911 if there is immediate physical danger or a medical emergency. If safe, stay connected while getting help; do not put yourself in danger or try to physically restrain someone." },
      { label: "Concern about stopping alcohol or drugs", action: "Seek prompt medical advice about withdrawal; stopping alcohol or benzodiazepines suddenly can be dangerous. Do not force detox, set up a home taper, or give someone else's medication. Seizures, severe confusion, trouble breathing, or loss of consciousness need 911." },
    ],
    heading: "Safety comes before planning",
    steps: [
      "Move yourself and children to a safer place if needed. Do not get into a car with an impaired driver, argue over substances, or physically intervene when doing so could put you at risk.",
      "Tell emergency responders what you can observe and where the person is. You do not need to know the exact substance or have all the facts before asking for help.",
      "Once urgent needs have been addressed, ask the treating clinician what warning signs to watch for and where to get follow-up care. Choose one trusted person who can support you, too.",
    ],
    script: "I am at [location]. I am worried about [what I can observe]. Please tell me what to do while help is on the way.",
  },
] as const;

export const guideDisclaimer = "This is general education, not a diagnosis, medical advice, a safety assessment, or an emergency service. A guide cannot determine whether someone is safe. You can stop here; contacting Sober Helpline is optional.";
