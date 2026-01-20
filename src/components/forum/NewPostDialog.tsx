import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { moderateContent } from "@/lib/contentModeration";
import { toast } from "sonner";
import { Loader2, Plus, MessageSquare, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ForumTopic {
  id: string;
  title: string;
  description: string;
}

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  forumTopics: ForumTopic[];
}

export function NewPostDialog({ open, onOpenChange, userId, forumTopics }: NewPostDialogProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState<"existing" | "new">("existing");
  
  // Existing topic post fields
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  
  // New topic request fields
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [newTopicPostTitle, setNewTopicPostTitle] = useState("");
  const [newTopicPostContent, setNewTopicPostContent] = useState("");
  const [moderationError, setModerationError] = useState<string | null>(null);

  const resetForm = () => {
    setPostType("existing");
    setSelectedTopicId("");
    setPostTitle("");
    setPostContent("");
    setNewTopicTitle("");
    setNewTopicDescription("");
    setNewTopicPostTitle("");
    setNewTopicPostContent("");
    setModerationError(null);
  };

  const handleSubmitExistingTopic = async () => {
    if (!selectedTopicId || !postTitle.trim() || !postContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setModerationError(null);
    
    try {
      // Check content moderation
      const moderation = await moderateContent(postContent.trim(), postTitle.trim());
      
      if (!moderation.allowed) {
        setModerationError(moderation.reason || "Please revise your message to be more respectful and try again.");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: userId,
          topic_id: selectedTopicId,
          title: postTitle.trim(),
          content: postContent.trim()
        });

      if (error) throw error;

      toast.success("Post created successfully!");
      resetForm();
      onOpenChange(false);
      navigate(`/family-forum/${selectedTopicId}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitNewTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicDescription.trim() || !newTopicPostTitle.trim() || !newTopicPostContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setModerationError(null);
    
    try {
      // Check content moderation
      const moderation = await moderateContent(newTopicPostContent.trim(), newTopicPostTitle.trim());
      
      if (!moderation.allowed) {
        setModerationError(moderation.reason || "Please revise your message to be more respectful and try again.");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('pending_topic_requests')
        .insert({
          requested_by: userId,
          topic_title: newTopicTitle.trim(),
          topic_description: newTopicDescription.trim(),
          post_title: newTopicPostTitle.trim(),
          post_content: newTopicPostContent.trim()
        });

      if (error) throw error;

      toast.success("Topic request submitted! A moderator will review your request and create the topic if approved.");
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting topic request:', error);
      toast.error("Failed to submit topic request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (postType === "existing") {
      handleSubmitExistingTopic();
    } else {
      handleSubmitNewTopic();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-logo-green">Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community. Choose an existing topic or request a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Post Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Where would you like to post?</Label>
            <RadioGroup
              value={postType}
              onValueChange={(value) => setPostType(value as "existing" | "new")}
              className="grid gap-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="flex items-center gap-2 cursor-pointer flex-1">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Existing Topic</div>
                    <div className="text-sm text-muted-foreground">Post to one of our forum categories</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Plus className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Request New Topic</div>
                    <div className="text-sm text-muted-foreground">Suggest a new category (requires moderator approval)</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Existing Topic Form */}
          {postType === "existing" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {moderationError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{moderationError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="topic">Select Topic</Label>
                <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {forumTopics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postTitle">Post Title</Label>
                <Input
                  id="postTitle"
                  placeholder="Enter a title for your post..."
                  value={postTitle}
                  onChange={(e) => {
                    setPostTitle(e.target.value);
                    setModerationError(null);
                  }}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postContent">Post Content</Label>
                <Textarea
                  id="postContent"
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                    setModerationError(null);
                  }}
                  className="min-h-[150px]"
                  maxLength={5000}
                />
              </div>
            </div>
          )}

          {/* New Topic Request Form */}
          {postType === "new" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {moderationError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{moderationError}</AlertDescription>
                </Alert>
              )}
              
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  New topic requests are reviewed by moderators before being created. You'll be notified once your request is approved.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newTopicTitle">Suggested Topic Name</Label>
                <Input
                  id="newTopicTitle"
                  placeholder="e.g., Coping with Holidays"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newTopicDescription">Topic Description</Label>
                <Textarea
                  id="newTopicDescription"
                  placeholder="Briefly describe what this topic would be about..."
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="min-h-[80px]"
                  maxLength={500}
                />
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Your First Post in This Topic</p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newTopicPostTitle">Post Title</Label>
                    <Input
                      id="newTopicPostTitle"
                      placeholder="Enter a title for your post..."
                      value={newTopicPostTitle}
                      onChange={(e) => {
                        setNewTopicPostTitle(e.target.value);
                        setModerationError(null);
                      }}
                      maxLength={200}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newTopicPostContent">Post Content</Label>
                    <Textarea
                      id="newTopicPostContent"
                      placeholder="Share your thoughts to start the discussion..."
                      value={newTopicPostContent}
                      onChange={(e) => {
                        setNewTopicPostContent(e.target.value);
                        setModerationError(null);
                      }}
                      className="min-h-[150px]"
                      maxLength={5000}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {postType === "new" ? "Submitting Request..." : "Creating Post..."}
              </>
            ) : (
              postType === "new" ? "Submit for Approval" : "Create Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
