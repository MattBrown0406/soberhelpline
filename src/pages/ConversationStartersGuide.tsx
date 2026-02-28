import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Heart, AlertTriangle, Shield, Lightbulb, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GuidePageWrapper from "@/components/GuidePageWrapper";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const ConversationStartersGuide = () => {
  return (
    <GuidePageWrapper guideName="Conversation Starters for Families" guidePath="/conversation-starters">
      <Helmet>
        <title>Conversation Starters for Families | Sober Helpline</title>
        <meta name="description" content="Helpful conversation starters designed to reduce defensiveness and help families speak from a calmer, steadier place when discussing addiction." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <ToolBrandHeader
            title="Conversation Starters for Families"
            subtitle="Practical phrases designed to reduce defensiveness and help families speak from a calmer, steadier place when discussing addiction."
            clinicalNote="Based on Motivational Interviewing (Miller & Rollnick) and CRAFT communication principles."
          />

          {/* Introduction */}
          <Card className="mb-8 border-primary/20">
            <CardContent className="p-6 md:p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Talking about addiction within a family is rarely simple. Emotions run high, trust may be fragile, and many conversations quickly turn into arguments, shutdowns, or silence. Just as important as <em>what</em> you say is the frame of mind you bring into the conversation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fear and anxiety, when left unchecked, quietly give the problem more power before anyone even opens their mouth. These conversation starters are not designed to convince, confront, or control anyone. They are meant to help families slow things down, reduce defensiveness, and speak from a calmer, steadier place.
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                You do not need to ask every question. Choose the ones that fit where your family is right now, and return to others later as clarity grows.
              </p>
            </CardContent>
          </Card>

          {/* Before You Start */}
          <Card className="mb-8 border-amber-500/30 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                Before You Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Check your internal state first; if fear, panic, or urgency are driving the conversation, it will likely escalate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Regulate yourself before engaging—pause, breathe, take a walk, or write your thoughts down first</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Choose a time when no one is already emotionally activated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Avoid conversations during or immediately after substance use</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Focus on understanding, not persuading or controlling the outcome</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">End or pause the conversation if it becomes unsafe or emotionally charged</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-amber-800 dark:text-amber-300 font-medium text-center">
                  The calmer and clearer you are, the less power the problem has in the room.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Understanding What's Really Happening */}
          <Card className="mb-6 border-blue-500/30 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
                <Lightbulb className="w-6 h-6" />
                Understanding What's Really Happening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                These questions help families move beyond surface-level arguments and defensiveness.
              </p>
              <ul className="space-y-3">
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What feels hardest about this for you right now?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What do you think we're all reacting to?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What worries you the most that you don't usually say out loud?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What do you feel like we're missing or not talking about?"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Exploring Impact Without Blame */}
          <Card className="mb-6 border-purple-500/30 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-400">
                <Heart className="w-6 h-6" />
                Exploring Impact Without Blame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use these to acknowledge consequences without turning the conversation into an attack.
              </p>
              <ul className="space-y-3">
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"How has this been affecting the family?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What has changed in ways we haven't really talked about?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What feels different now compared to before?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What are we all doing now that we weren't doing before?"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Helping vs. Enabling */}
          <Card className="mb-6 border-orange-500/30 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-400">
                <AlertTriangle className="w-6 h-6" />
                Helping vs. Enabling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                These questions are useful when families feel stuck between rescuing and resentment.
              </p>
              <ul className="space-y-3">
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What are we doing that helps in the short term but hurts in the long term?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What would support look like if it didn't involve fixing or rescuing?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What are we afraid would happen if we stopped stepping in?"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Boundaries and Safety */}
          <Card className="mb-6 border-green-500/30 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
                <Shield className="w-6 h-6" />
                Boundaries and Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                These questions clarify limits without threats, ultimatums, or control.
              </p>
              <ul className="space-y-3">
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What do we need in order to feel safe and stable?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What are we willing to participate in—and what are we not?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What boundary would protect us, even if it doesn't change them?"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Looking Forward */}
          <Card className="mb-6 border-teal-500/30 bg-gradient-to-br from-teal-50 to-transparent dark:from-teal-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-teal-700 dark:text-teal-400">
                <Lightbulb className="w-6 h-6" />
                Looking Forward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use these when the family is ready to think beyond the immediate crisis.
              </p>
              <ul className="space-y-3">
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What would a healthier version of this look like for us?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What do we need help with that we can't do alone?"</span>
                </li>
                <li className="p-3 bg-background rounded-lg border border-border">
                  <span className="text-foreground">"What's one small change we could make that we could actually hold?"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* When to Pause */}
          <Card className="mb-8 border-red-500/30 bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-400">
                <Pause className="w-6 h-6" />
                When to Pause the Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                It's appropriate to pause or end the discussion if:
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Voices escalate or threats appear</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Someone is intoxicated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">The conversation becomes emotionally or physically unsafe</span>
                </li>
              </ul>
              <div className="p-4 bg-red-100/50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-800 dark:text-red-300 font-medium text-center">
                  Pausing a conversation is not quitting. It's choosing stability over damage.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Closing Reminder */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Heart className="w-6 h-6" />
                Closing Reminder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These conversations are about changing patterns, not forcing outcomes. You may not see immediate agreement or relief—and that's okay. Calm, honest conversations held consistently often matter more than one dramatic discussion.
              </p>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-foreground font-semibold text-center text-lg">
                  Progress is measured in clarity and consistency, not instant results.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    
          <RelatedResources currentPath="/conversation-starters" />
        </GuidePageWrapper>
  );
};

export default ConversationStartersGuide;
