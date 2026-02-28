import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  AlertTriangle,
  Heart,
  Brain,
  Users,
  Scale,
  Utensils,
  Activity
} from 'lucide-react';
import ToolBrandHeader from '@/components/ToolBrandHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WarningSign {
  id: string;
  text: string;
  severity: 'moderate' | 'high' | 'critical';
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  signs: WarningSign[];
}

const categories: Category[] = [
  {
    id: 'eating-behaviors',
    title: 'Eating Behaviors',
    icon: <Utensils className="w-5 h-5" />,
    description: 'Changes in how your loved one eats or relates to food',
    signs: [
      { id: 'eb1', text: 'Skipping meals or making excuses not to eat', severity: 'moderate' },
      { id: 'eb2', text: 'Eating unusually large amounts of food in one sitting', severity: 'moderate' },
      { id: 'eb3', text: 'Disappearing after meals (bathroom trips)', severity: 'high' },
      { id: 'eb4', text: 'Cutting food into very small pieces or rearranging food', severity: 'moderate' },
      { id: 'eb5', text: 'Refusing to eat certain food groups entirely', severity: 'moderate' },
      { id: 'eb6', text: 'Eating in secret or hiding food', severity: 'high' },
      { id: 'eb7', text: 'Chewing food and spitting it out', severity: 'high' },
      { id: 'eb8', text: 'Ritualistic eating patterns (specific order, times, etc.)', severity: 'moderate' },
    ]
  },
  {
    id: 'physical-signs',
    title: 'Physical Warning Signs',
    icon: <Activity className="w-5 h-5" />,
    description: 'Observable physical changes or symptoms',
    signs: [
      { id: 'ps1', text: 'Noticeable weight loss or fluctuation', severity: 'high' },
      { id: 'ps2', text: 'Feeling cold all the time or wearing layers to hide body', severity: 'moderate' },
      { id: 'ps3', text: 'Dizziness, fainting, or chronic fatigue', severity: 'critical' },
      { id: 'ps4', text: 'Dry skin, brittle nails, or hair loss', severity: 'high' },
      { id: 'ps5', text: 'Swollen cheeks or jaw (parotid gland swelling)', severity: 'high' },
      { id: 'ps6', text: 'Calluses on knuckles (from self-induced vomiting)', severity: 'critical' },
      { id: 'ps7', text: 'Dental problems or enamel erosion', severity: 'high' },
      { id: 'ps8', text: 'Stomach cramps, constipation, or digestive issues', severity: 'moderate' },
    ]
  },
  {
    id: 'emotional-behavioral',
    title: 'Emotional & Behavioral Signs',
    icon: <Brain className="w-5 h-5" />,
    description: 'Changes in mood, thinking patterns, and daily behavior',
    signs: [
      { id: 'emb1', text: 'Preoccupation with weight, food, calories, or dieting', severity: 'moderate' },
      { id: 'emb2', text: 'Expressing guilt or shame about eating', severity: 'moderate' },
      { id: 'emb3', text: 'Withdrawal from friends and usual activities', severity: 'moderate' },
      { id: 'emb4', text: 'Mood swings, irritability, or depression', severity: 'moderate' },
      { id: 'emb5', text: 'Excessive or compulsive exercise routines', severity: 'high' },
      { id: 'emb6', text: 'Denying hunger or claiming to have already eaten', severity: 'moderate' },
      { id: 'emb7', text: 'Extreme distress about body image or appearance', severity: 'high' },
      { id: 'emb8', text: 'Perfectionism or rigid, all-or-nothing thinking', severity: 'moderate' },
    ]
  },
  {
    id: 'body-image',
    title: 'Body Image Concerns',
    icon: <Scale className="w-5 h-5" />,
    description: 'How your loved one perceives and talks about their body',
    signs: [
      { id: 'bi1', text: 'Frequent body checking (mirrors, pinching, measuring)', severity: 'moderate' },
      { id: 'bi2', text: 'Wearing baggy clothes to hide body shape', severity: 'moderate' },
      { id: 'bi3', text: 'Constant comparison to others\' bodies', severity: 'moderate' },
      { id: 'bi4', text: 'Refusing to be photographed', severity: 'moderate' },
      { id: 'bi5', text: 'Expressing feeling "fat" despite being underweight', severity: 'high' },
      { id: 'bi6', text: 'Obsessive focus on specific body parts', severity: 'moderate' },
    ]
  },
  {
    id: 'social-relationship',
    title: 'Social & Relationship Changes',
    icon: <Users className="w-5 h-5" />,
    description: 'Impact on relationships and social functioning',
    signs: [
      { id: 'sr1', text: 'Avoiding social events involving food', severity: 'moderate' },
      { id: 'sr2', text: 'Increased isolation or secrecy', severity: 'moderate' },
      { id: 'sr3', text: 'Difficulty concentrating or declining performance', severity: 'moderate' },
      { id: 'sr4', text: 'Lying about eating or food-related behaviors', severity: 'high' },
      { id: 'sr5', text: 'Becoming defensive or angry when eating is discussed', severity: 'moderate' },
      { id: 'sr6', text: 'Taking over meal preparation for others but not eating', severity: 'high' },
    ]
  },
  {
    id: 'compensatory',
    title: 'Compensatory Behaviors',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Behaviors used to "undo" or compensate for eating',
    signs: [
      { id: 'cb1', text: 'Evidence of laxative, diet pill, or diuretic use', severity: 'critical' },
      { id: 'cb2', text: 'Signs of vomiting (smell, sounds, evidence)', severity: 'critical' },
      { id: 'cb3', text: 'Fasting or severe calorie restriction after eating', severity: 'high' },
      { id: 'cb4', text: 'Excessive exercise that interferes with daily life', severity: 'high' },
      { id: 'cb5', text: 'Using exercise to "earn" food or "burn off" meals', severity: 'high' },
      { id: 'cb6', text: 'Refusing to eat unless able to exercise', severity: 'high' },
    ]
  }
];

const allSigns = categories.flatMap(cat => cat.signs);

export default function EatingDisorderScreening() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedSigns, setCheckedSigns] = useState<Record<string, boolean>>({});

  const handleCheckChange = (signId: string, checked: boolean) => {
    setCheckedSigns(prev => ({ ...prev, [signId]: checked }));
  };

  const getCheckedCount = () => Object.values(checkedSigns).filter(Boolean).length;
  
  const getCheckedBySeverity = () => {
    const checked = Object.entries(checkedSigns).filter(([_, isChecked]) => isChecked);
    return {
      critical: checked.filter(([id]) => allSigns.find(s => s.id === id)?.severity === 'critical').length,
      high: checked.filter(([id]) => allSigns.find(s => s.id === id)?.severity === 'high').length,
      moderate: checked.filter(([id]) => allSigns.find(s => s.id === id)?.severity === 'moderate').length,
    };
  };

  const getConcernLevel = () => {
    const counts = getCheckedBySeverity();
    const total = getCheckedCount();
    
    if (counts.critical >= 1 || total >= 10) {
      return { 
        level: 'High Concern', 
        color: 'text-red-600', 
        bg: 'bg-red-50 border-red-200',
        description: 'Multiple significant warning signs present. Professional evaluation is strongly recommended.'
      };
    }
    if (counts.high >= 2 || total >= 6) {
      return { 
        level: 'Elevated Concern', 
        color: 'text-orange-600', 
        bg: 'bg-orange-50 border-orange-200',
        description: 'Several concerning signs observed. Consider consulting with a healthcare professional.'
      };
    }
    if (total >= 3) {
      return { 
        level: 'Moderate Concern', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50 border-yellow-200',
        description: 'Some warning signs present. Monitor closely and consider seeking guidance.'
      };
    }
    if (total >= 1) {
      return { 
        level: 'Low Concern', 
        color: 'text-blue-600', 
        bg: 'bg-blue-50 border-blue-200',
        description: 'Few signs noted. Continue to observe and maintain open communication.'
      };
    }
    return { 
      level: 'No Signs Noted', 
      color: 'text-green-600', 
      bg: 'bg-green-50 border-green-200',
      description: 'No warning signs currently identified. Stay aware and informed.'
    };
  };

  const handleReset = () => {
    setCheckedSigns({});
    setCurrentStep(0);
  };

  const progress = ((currentStep + 1) / (categories.length + 1)) * 100;

  const renderIntro = () => (
    <div className="space-y-6">
      <ToolBrandHeader
        title="Eating Disorder Family Screening Tool"
        subtitle="This screening tool helps family members recognize potential warning signs of eating disorders in a loved one. It is not a diagnostic tool but can help you identify patterns that may warrant professional evaluation."
        clinicalNote="Based on recognized clinical indicators from the DSM-5 and NEDA (National Eating Disorders Association) guidelines. Signs are organized across six categories."
      />
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="space-y-4 text-muted-foreground">
          <p>
            The signs are organized into six categories covering eating behaviors, physical symptoms, 
            emotional changes, body image concerns, social impacts, and compensatory behaviors.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 text-sm">
          <strong>Important:</strong> Eating disorders are serious mental health conditions. 
          If you observe multiple warning signs, especially those marked as critical, 
          please seek professional help promptly. Early intervention significantly improves outcomes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">What You'll Assess</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {allSigns.length} warning signs across 6 categories</li>
            <li>• Physical, behavioral, and emotional indicators</li>
            <li>• Severity-weighted concern assessment</li>
          </ul>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">What You'll Receive</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Overall concern level assessment</li>
            <li>• Category-by-category breakdown</li>
            <li>• Recommended next steps</li>
          </ul>
        </div>
      </div>

      <Button onClick={() => setCurrentStep(1)} className="w-full">
        Begin Screening <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderCategory = (categoryIndex: number) => {
    const category = categories[categoryIndex - 1];
    const categoryChecked = category.signs.filter(s => checkedSigns[s.id]).length;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {category.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{category.title}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {category.signs.map((sign) => (
            <label
              key={sign.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                checkedSigns[sign.id] 
                  ? sign.severity === 'critical' 
                    ? 'bg-red-50 border-red-200' 
                    : sign.severity === 'high'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
                  : 'bg-background border-border hover:bg-muted/50'
              }`}
            >
              <Checkbox
                checked={checkedSigns[sign.id] || false}
                onCheckedChange={(checked) => handleCheckChange(sign.id, checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <span className="text-foreground">{sign.text}</span>
                {sign.severity === 'critical' && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                    Critical
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>

        <div className="text-sm text-muted-foreground text-center">
          {categoryChecked} of {category.signs.length} signs checked in this category
        </div>

        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(categoryIndex - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <Button 
            onClick={() => setCurrentStep(categoryIndex + 1)}
          >
            {categoryIndex === categories.length ? 'View Results' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const concern = getConcernLevel();
    const counts = getCheckedBySeverity();
    const total = getCheckedCount();

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg border-2 ${concern.bg}`}>
          <div className="text-center">
            <h3 className={`text-2xl font-bold ${concern.color}`}>{concern.level}</h3>
            <p className="text-muted-foreground mt-2">{concern.description}</p>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{counts.critical}</div>
              <div className="text-xs text-muted-foreground">Critical Signs</div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{counts.high}</div>
              <div className="text-xs text-muted-foreground">High Concern</div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{counts.moderate}</div>
              <div className="text-xs text-muted-foreground">Moderate</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Signs by Category</h4>
          {categories.map(category => {
            const categoryChecked = category.signs.filter(s => checkedSigns[s.id]);
            if (categoryChecked.length === 0) return null;
            
            return (
              <div key={category.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {category.icon}
                  <span className="font-medium text-foreground">{category.title}</span>
                  <span className="text-sm text-muted-foreground">
                    ({categoryChecked.length} signs)
                  </span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                  {categoryChecked.map(sign => (
                    <li key={sign.id} className="flex items-center gap-2">
                      <span>• {sign.text}</span>
                      {sign.severity === 'critical' && (
                        <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Critical</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {total === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No warning signs were checked.
            </p>
          )}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-3">Recommended Next Steps</h4>
          {concern.level === 'High Concern' && (
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Immediate action recommended:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Schedule an appointment with a healthcare provider experienced in eating disorders</li>
                <li>Contact the National Eating Disorders Association (NEDA) helpline: 1-800-931-2237</li>
                <li>If there are signs of medical emergency (fainting, chest pain, severe weakness), seek emergency care</li>
                <li>Document specific behaviors and patterns to share with professionals</li>
              </ul>
            </div>
          )}
          {concern.level === 'Elevated Concern' && (
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Professional consultation recommended:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Schedule an appointment with your loved one's primary care physician</li>
                <li>Consider a consultation with an eating disorder specialist</li>
                <li>Learn more about eating disorders and treatment options</li>
                <li>Create a supportive, non-judgmental environment for open conversation</li>
              </ul>
            </div>
          )}
          {concern.level === 'Moderate Concern' && (
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Monitoring and education recommended:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Continue observing for additional warning signs</li>
                <li>Open a gentle, non-confrontational conversation about your observations</li>
                <li>Educate yourself about eating disorders</li>
                <li>Consider discussing concerns with a therapist or counselor</li>
              </ul>
            </div>
          )}
          {(concern.level === 'Low Concern' || concern.level === 'No Signs Noted') && (
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Continue supporting your loved one:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Maintain open communication about health and well-being</li>
                <li>Model healthy attitudes toward food, exercise, and body image</li>
                <li>Stay informed about eating disorder warning signs</li>
                <li>Create a supportive environment where concerns can be shared</li>
              </ul>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Remember:</strong> This screening does not replace professional diagnosis. 
            Eating disorders can be life-threatening, and early intervention is crucial. 
            When in doubt, consult with a healthcare professional experienced in eating disorders.
          </p>
        </div>

        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(categories.length)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Review Answers
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Start Over
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="border-2 border-pink-500/40 bg-gradient-to-br from-pink-50 to-transparent dark:from-pink-950/20 rounded-lg overflow-hidden">
      <Accordion 
        type="single" 
        collapsible 
        value={isExpanded ? "screening" : ""}
        onValueChange={(value) => setIsExpanded(value === "screening")}
      >
        <AccordionItem value="screening" className="border-0">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">
                  Eating Disorder Warning Signs Screening
                </h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Interactive tool to help families identify potential warning signs
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {currentStep > 0 && currentStep <= categories.length && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Category {currentStep} of {categories.length}</span>
                  <span>{getCheckedCount()} signs checked</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {currentStep === 0 && renderIntro()}
            {currentStep >= 1 && currentStep <= categories.length && renderCategory(currentStep)}
            {currentStep > categories.length && renderResults()}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
