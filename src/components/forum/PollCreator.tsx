import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PollCreatorProps {
  onPollChange: (poll: PollData | null) => void;
}

export interface PollData {
  question: string;
  options: string[];
  allowsMultiple: boolean;
}

export function PollCreator({ onPollChange }: PollCreatorProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [allowsMultiple, setAllowsMultiple] = useState(false);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onPollChange(null);
    }
  };

  const updatePoll = (newQuestion: string, newOptions: string[], newAllowsMultiple: boolean) => {
    const validOptions = newOptions.filter(o => o.trim());
    if (newQuestion.trim() && validOptions.length >= 2) {
      onPollChange({
        question: newQuestion,
        options: validOptions,
        allowsMultiple: newAllowsMultiple
      });
    } else {
      onPollChange(null);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      const newOptions = [...options, ""];
      setOptions(newOptions);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      updatePoll(question, newOptions, allowsMultiple);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updatePoll(question, newOptions, allowsMultiple);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="add-poll"
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="add-poll" className="flex items-center gap-2 cursor-pointer">
          <BarChart3 className="h-4 w-4" />
          Add a poll to your post
        </Label>
      </div>

      {isEnabled && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Poll Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="poll-question">Question</Label>
              <Input
                id="poll-question"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  updatePoll(e.target.value, options, allowsMultiple);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="allows-multiple"
                checked={allowsMultiple}
                onCheckedChange={(checked) => {
                  setAllowsMultiple(checked);
                  updatePoll(question, options, checked);
                }}
              />
              <Label htmlFor="allows-multiple">Allow multiple selections</Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
