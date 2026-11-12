// The three conversation starters on /ai-prompts. A member fills in a few
// blanks, copies the finished prompt, and pastes it as her first message in
// any AI chat tool (ChatGPT, Claude, Gemini and the like).
//
// These replace six long "master prompts" that asked the AI to play a
// therapist. Each prompt here is short, says plainly that the AI is not a
// professional, and carries its own safety rules, because the prompt is used
// somewhere this site cannot see.

/** What a member has written in for each prompt, plus her notes afterwards. */
export interface AIPromptSheet {
  decision: { relationship: string; situation: string; action: string; notes: string };
  boundary: { relationship: string; situation: string; worry: string; notes: string };
  treatment: { who: string; using: string; tried: string; hoping: string; notes: string };
}

export const blankAIPromptSheet: AIPromptSheet = {
  decision: { relationship: "", situation: "", action: "", notes: "" },
  boundary: { relationship: "", situation: "", worry: "", notes: "" },
  treatment: { who: "", using: "", tried: "", hoping: "", notes: "" },
};

const BLANK = "[fill this in before you send]";
const filled = (value: string | undefined) => (value && value.trim() ? value.trim() : BLANK);

// The same rules open every prompt.
const GROUND_RULES = `Ground rules for this conversation:
- You are not a therapist, doctor or lawyer, and I know that. Do not diagnose anyone.
- If anything I say suggests someone may be in immediate danger (a possible overdose, talk of suicide, violence or threats, or dangerous withdrawal such as seizures, confusion or seeing things), stop and tell me plainly to call 911, or to call or text 988 for thoughts of suicide, before anything else.
- Keeping someone alive or safe is never enabling. That includes calling 911, carrying naloxone (Narcan), getting medical care, and protecting children.
- Ask me one question at a time and wait for my answer.
- Be direct and kind. No lectures, no slogans. If I seem to be fooling myself, say so gently.
- Stick to what has actually happened. Don't guess at what my loved one is thinking or feeling.
- Don't promise that anything I do will make them stop. I can't control that. Help me with what I can control.
- Keep each reply to a few sentences unless I ask for more.`;

export function decisionPrompt(f: AIPromptSheet["decision"]): string {
  return `I love someone who has an addiction. I have a decision to make and I want help thinking it through honestly, not just reassurance.

My relationship to them: ${filled(f.relationship)}
What is happening: ${filled(f.situation)}
What I am thinking of doing: ${filled(f.action)}

${GROUND_RULES}

Please take me through this in order:
1. Ask how I'm feeling right now. If I sound panicked or rushed, and nobody is in danger, help me slow down before we go on. Decisions made in a panic are usually the ones I regret.
2. Ask me up to two questions about anything that isn't clear.
3. Then go through these with me, one at a time:
   - Does this shield them from the results of their drinking or using, or does it leave those results with them?
   - Am I taking over something an adult could do for themselves?
   - Have I done this before? What happened afterwards?
   - Am I doing this because it fits my values, or to quiet my own fear or guilt?
   - If I kept doing this for a year, what would it cost me, them, and the rest of the family?
4. Tell me plainly which this looks like: helping, enabling, or neither. Say why.
5. If it looks like enabling, give me one or two other things I could do that I could actually live with, including the words I might say.`;
}

export function boundaryPrompt(f: AIPromptSheet["boundary"]): string {
  return `I love someone who has an addiction. I want help putting one boundary into words.

My relationship to them: ${filled(f.relationship)}
What I can't keep living with: ${filled(f.situation)}
What I'm afraid will happen if I set a boundary: ${filled(f.worry)}

${GROUND_RULES}
- If I say I'm afraid of how they might react physically, or that there has been violence, threats or intimidation, do not write a script. Tell me to make a safety plan first and give me the National Domestic Violence Hotline: 1-800-799-7233.

Work from these ideas:
- A boundary is about what I will do, not what they must do.
- It is not a threat, a punishment, or a way to force them into treatment.
- It doesn't need their agreement or understanding.
- If I won't follow through, it isn't a boundary yet.

Please take me through this in order:
1. Ask how I'm feeling right now. If I'm upset, help me settle first. Boundaries set in the heat of the moment tend to turn into ultimatums or fall apart.
2. Ask me up to two questions to find out what I need.
3. Help me write it as "When ___ happens, I will ___." One or two sentences I could say once, calmly, without explaining myself.
4. If what I've written is really a demand or an ultimatum, tell me, and help me turn it into something I control.
5. Give me short replies for the pushback I'm likely to hear: guilt, anger, "you're overreacting," and bargaining. Each reply should restate the boundary without arguing.
6. Finish by asking whether I'm ready to follow through, calmly, the first time it's tested. If I'm not, help me choose a smaller boundary I can keep.`;
}

export function treatmentPrompt(f: AIPromptSheet["treatment"]): string {
  return `Someone I love has an addiction and our family is looking at treatment. I want to understand the options and get my questions ready before I call anyone.

Who it's for: ${filled(f.who)}
What they are using, and for how long, as far as I know: ${filled(f.using)}
What has been tried before: ${filled(f.tried)}
What I'm hoping treatment will do: ${filled(f.hoping)}

${GROUND_RULES}
- Do not name, recommend, rank or compare specific treatment centers. If I ask you to pick one, remind me that Sober Helpline can help with that at (458) 298-8008.
- Don't tell me which level of care my loved one needs. That takes an assessment by a licensed professional. Help me understand the choices and the questions to ask.
- Stopping alcohol or benzodiazepines suddenly can be medically dangerous. If either is in the picture, tell me they need medical help to stop, before anyone tries it at home.

Please take me through this in order:
1. Explain the levels of care in plain language, a few sentences each: medical detox, residential, day treatment (PHP), intensive outpatient (IOP), outpatient, and sober living. Explain where prescribed medications for addiction fit.
2. Tell me honestly what treatment can't do. It can't guarantee sobriety, create willingness, or replace what the family does afterwards.
3. Ask what I'm most worried about, then help me build a short list of questions to ask a program on the phone. Cover licensing and accreditation, who is on the medical and clinical staff, how they handle detox and medications, how families are involved, the full cost in writing, what happens if my loved one leaves early, and the plan for after discharge.
4. Tell me the warning signs of a program to avoid: guaranteed results, pressure to commit today, offers to pay for travel, and vague answers about staff or cost.
5. Ask what I want to do first, and help me write down my next step.`;
}
