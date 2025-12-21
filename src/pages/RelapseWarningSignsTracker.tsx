import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Printer, AlertTriangle, Clock, TrendingDown, RefreshCw, Info, Heart, Brain, Users, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RelapseWarningSignsTracker = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  const emotionalSigns = [
    { id: "emotional-1", label: "Increased irritability or defensiveness" },
    { id: "emotional-2", label: "Withdrawal or emotional distance" },
    { id: "emotional-3", label: "Increased shame, hopelessness, or self-pity" },
    { id: "emotional-4", label: "Blaming others more frequently" },
    { id: "emotional-5", label: "Overconfidence about recovery" },
    { id: "emotional-6", label: "Mood swings or emotional instability" },
    { id: "emotional-7", label: "Increased anxiety or restlessness" },
    { id: "emotional-8", label: "Isolation from family and support systems" },
  ];

  const behavioralSigns = [
    { id: "behavioral-1", label: "Skipping recovery activities (meetings, therapy, etc.)" },
    { id: "behavioral-2", label: "Missed appointments or commitments" },
    { id: "behavioral-3", label: "Increased secrecy about whereabouts or activities" },
    { id: "behavioral-4", label: "Changes in routine or sleep patterns" },
    { id: "behavioral-5", label: "Decline in reliability or following through" },
    { id: "behavioral-6", label: "Reconnecting with old using friends or environments" },
    { id: "behavioral-7", label: "Neglecting self-care (hygiene, nutrition, exercise)" },
    { id: "behavioral-8", label: "Increased spending or unexplained financial issues" },
    { id: "behavioral-9", label: "Changes in eating habits (too much or too little)" },
  ];

  const thinkingSigns = [
    { id: "thinking-1", label: "Justifying risky behavior or situations" },
    { id: "thinking-2", label: "Romanticizing past use ('the good old days')" },
    { id: "thinking-3", label: "All-or-nothing thinking patterns" },
    { id: "thinking-4", label: "Resistance to feedback or suggestions" },
    { id: "thinking-5", label: "Denial of problems when confronted" },
    { id: "thinking-6", label: "Minimizing the severity of their addiction" },
    { id: "thinking-7", label: "Planning around potential use ('just in case')" },
    { id: "thinking-8", label: "Focusing on others' problems instead of their own" },
  ];

  const boundarySigns = [
    { id: "boundary-1", label: "Testing or pushing established boundaries" },
    { id: "boundary-2", label: "Asking for exceptions to rules or agreements" },
    { id: "boundary-3", label: "Using guilt-based pressure on family members" },
    { id: "boundary-4", label: "Resistance to accountability measures" },
    { id: "boundary-5", label: "Refusing to discuss recovery progress" },
    { id: "boundary-6", label: "Avoiding sponsor or recovery mentor" },
    { id: "boundary-7", label: "Manipulative behaviors increasing" },
  ];

  const allSigns = [...emotionalSigns, ...behavioralSigns, ...thinkingSigns, ...boundarySigns];
  const totalChecked = checkedItems.size;
  const totalPossible = allSigns.length;
  const percentageChecked = Math.round((totalChecked / totalPossible) * 100);

  const handleCheckChange = (id: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      newCheckedItems.add(id);
    } else {
      newCheckedItems.delete(id);
    }
    setCheckedItems(newCheckedItems);
  };

  const getConcernLevel = () => {
    if (totalChecked <= 5) return { level: "Low", color: "text-green-600", bg: "bg-green-100 dark:bg-green-950/50" };
    if (totalChecked <= 12) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-950/50" };
    if (totalChecked <= 20) return { level: "Elevated", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-950/50" };
    return { level: "High", color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/50" };
  };

  const concernLevel = getConcernLevel();

  const handlePrint = () => {
    const printContent = `
RELAPSE WARNING SIGNS TRACKER
Assessment Date: ${new Date().toLocaleDateString()}

SCORE SUMMARY
Total Signs Observed: ${totalChecked} of ${totalPossible}
Concern Level: ${concernLevel.level}

EMOTIONAL WARNING SIGNS (${emotionalSigns.filter(s => checkedItems.has(s.id)).length}/${emotionalSigns.length})
${emotionalSigns.map(s => `${checkedItems.has(s.id) ? '☑' : '☐'} ${s.label}`).join('\n')}

BEHAVIORAL WARNING SIGNS (${behavioralSigns.filter(s => checkedItems.has(s.id)).length}/${behavioralSigns.length})
${behavioralSigns.map(s => `${checkedItems.has(s.id) ? '☑' : '☐'} ${s.label}`).join('\n')}

THINKING & LANGUAGE SHIFTS (${thinkingSigns.filter(s => checkedItems.has(s.id)).length}/${thinkingSigns.length})
${thinkingSigns.map(s => `${checkedItems.has(s.id) ? '☑' : '☐'} ${s.label}`).join('\n')}

BOUNDARY & ACCOUNTABILITY SHIFTS (${boundarySigns.filter(s => checkedItems.has(s.id)).length}/${boundarySigns.length})
${boundarySigns.map(s => `${checkedItems.has(s.id) ? '☑' : '☐'} ${s.label}`).join('\n')}

NOTES & OBSERVATIONS
${notes || '(None recorded)'}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relapse Warning Signs Tracker</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <pre>${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleReset = () => {
    setCheckedItems(new Set());
    setNotes("");
  };

  const ChecklistSection = ({ 
    title, 
    icon: Icon, 
    items, 
    color 
  }: { 
    title: string; 
    icon: React.ElementType; 
    items: { id: string; label: string }[]; 
    color: string;
  }) => {
    const sectionChecked = items.filter(item => checkedItems.has(item.id)).length;
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className={`h-5 w-5 ${color}`} />
            {title}
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {sectionChecked}/{items.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <Checkbox
                id={item.id}
                checked={checkedItems.has(item.id)}
                onCheckedChange={(checked) => handleCheckChange(item.id, checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor={item.id} 
                className="text-sm cursor-pointer leading-relaxed"
              >
                {item.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>Relapse Warning Signs Tracker | Sober Helpline</title>
        <meta name="description" content="Track and identify early warning signs that may indicate your loved one is at risk of returning to substance use." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Relapse Warning Signs Tracker</h1>
          <p className="text-muted-foreground">
            Use this tracker to notice patterns over time. Check items that have been consistently present over the last 1–2 weeks.
          </p>
        </div>

        {/* Critical Understanding Alert */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <Clock className="h-5 w-5" />
          <AlertTitle className="font-semibold">Understanding the Relapse Process</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              <strong>Return to substance use is the END of a process—not the beginning.</strong> 
              By the time someone picks up their substance of choice, they have likely been struggling internally for days, weeks, or even months.
            </p>
            <p>
              Relapse typically begins with <strong>emotional and mental changes</strong> long before any substance use occurs. 
              Recognizing these early warning signs gives families the opportunity to intervene and provide support before a full return to use.
            </p>
          </AlertDescription>
        </Alert>

        {/* Sticky Score Card */}
        <Card className={`sticky top-4 z-10 mb-6 ${concernLevel.bg} border-2`}>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${concernLevel.color}`} />
                  <span className="font-semibold">Warning Signs Observed:</span>
                  <span className={`font-bold text-lg ${concernLevel.color}`}>
                    {totalChecked} of {totalPossible}
                  </span>
                </div>
                <Progress value={percentageChecked} className="h-2" />
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-muted-foreground">Concern Level</div>
                <div className={`text-xl font-bold ${concernLevel.color}`}>{concernLevel.level}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>

            {/* Concern Level Guidance */}
            {totalChecked > 5 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                {totalChecked <= 12 && (
                  <p className="text-sm">
                    <strong>Moderate concern:</strong> Increase your own self-care and support. Gently observe patterns without confrontation. Consider discussing observations with a professional.
                  </p>
                )}
                {totalChecked > 12 && totalChecked <= 20 && (
                  <p className="text-sm">
                    <strong>Elevated concern:</strong> Consider consulting with an interventionist or addiction professional. Strengthen your boundaries and prepare your support system.
                  </p>
                )}
                {totalChecked > 20 && (
                  <p className="text-sm">
                    <strong>High concern:</strong> We strongly recommend consulting with an interventionist to discuss next steps. Do not attempt to handle this alone.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* The Three Stages of Relapse */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              The Three Stages of Relapse
            </CardTitle>
            <CardDescription>
              Understanding these stages helps families recognize warning signs earlier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">1. Emotional Relapse</h3>
                <p className="text-sm text-muted-foreground">
                  The person isn't thinking about using, but their emotions and behaviors are setting them up. 
                  They may be isolating, not attending to emotional needs, or experiencing anxiety and mood swings.
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">2. Mental Relapse</h3>
                <p className="text-sm text-muted-foreground">
                  A war begins in the mind. Part of them wants to use, part doesn't. They may romanticize past use, 
                  think about people/places associated with use, or plan how they could use "safely."
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">3. Physical Relapse</h3>
                <p className="text-sm text-muted-foreground">
                  The actual use of the substance. This is often the most visible sign, but by this point, 
                  the internal relapse process has been underway for some time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Sections */}
        <div className="space-y-6 mb-8">
          <ChecklistSection 
            title="Emotional Warning Signs" 
            icon={Heart} 
            items={emotionalSigns} 
            color="text-red-500"
          />
          <ChecklistSection 
            title="Behavioral Warning Signs" 
            icon={Users} 
            items={behavioralSigns} 
            color="text-blue-500"
          />
          <ChecklistSection 
            title="Thinking & Language Shifts" 
            icon={Brain} 
            items={thinkingSigns} 
            color="text-purple-500"
          />
          <ChecklistSection 
            title="Boundary & Accountability Shifts" 
            icon={Shield} 
            items={boundarySigns} 
            color="text-orange-500"
          />
        </div>

        {/* Notes Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Notes & Observations</CardTitle>
            <CardDescription>
              Record specific examples, dates, or patterns you've noticed. This can be helpful when consulting with professionals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Document specific behaviors, conversations, or concerns you've observed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Guidance Card */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              How to Use This Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✓ Do</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use this to track patterns over time</li>
                  <li>• Share observations with professionals</li>
                  <li>• Focus on consistency, not single incidents</li>
                  <li>• Maintain your own self-care</li>
                  <li>• Strengthen your support network</li>
                  <li>• Review and reinforce your boundaries</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">✗ Avoid</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Using this as ammunition in arguments</li>
                  <li>• Confronting aggressively without support</li>
                  <li>• Diagnosing or accusing based on a few signs</li>
                  <li>• Ignoring your own emotional needs</li>
                  <li>• Trying to control or fix them alone</li>
                  <li>• Making threats you won't follow through on</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">
                <strong>Remember:</strong> Awareness does not require confrontation. Consistency matters more than intensity. 
                Your role is to observe, protect yourself, and seek appropriate support—not to control outcomes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What to Do Next */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>What to Do Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${totalChecked <= 5 ? 'bg-green-100 dark:bg-green-950/50 ring-2 ring-green-400' : 'bg-muted/50'}`}>
                <h4 className="font-semibold">0-5 Signs: Low Concern</h4>
                <p className="text-sm text-muted-foreground">
                  Continue monitoring. These may be normal stress responses. Focus on maintaining healthy communication and your own wellbeing.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${totalChecked > 5 && totalChecked <= 12 ? 'bg-yellow-100 dark:bg-yellow-950/50 ring-2 ring-yellow-400' : 'bg-muted/50'}`}>
                <h4 className="font-semibold">6-12 Signs: Moderate Concern</h4>
                <p className="text-sm text-muted-foreground">
                  Increase your own support and self-care. Document patterns. Consider consulting with an addiction professional or attending a support group for families.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${totalChecked > 12 && totalChecked <= 20 ? 'bg-orange-100 dark:bg-orange-950/50 ring-2 ring-orange-400' : 'bg-muted/50'}`}>
                <h4 className="font-semibold">13-20 Signs: Elevated Concern</h4>
                <p className="text-sm text-muted-foreground">
                  Consider consulting with an interventionist. Review and strengthen your boundaries. Prepare your support network for potential crisis.
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  We recommend speaking with a professional interventionist about next steps.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${totalChecked > 20 ? 'bg-red-100 dark:bg-red-950/50 ring-2 ring-red-400' : 'bg-muted/50'}`}>
                <h4 className="font-semibold">21+ Signs: High Concern</h4>
                <p className="text-sm text-muted-foreground">
                  Immediate professional consultation is strongly recommended. An interventionist can help you navigate this situation safely and effectively.
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  Please consult with an interventionist to create a plan of action.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelapseWarningSignsTracker;
