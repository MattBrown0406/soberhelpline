import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Send, Inbox, ArrowLeft, Trash2, Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fetchUsernames, type ForumMemberMatch } from '@/lib/publicProfiles';
import { forumDisplayName } from '@/lib/forumTopics';
import { MemberPicker } from './MemberPicker';
import { useVisiblePolling } from './useVisiblePolling';

interface PrivateMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  /** Open straight into "compose" addressed to this member. */
  initialRecipient?: ForumMemberMatch | null;
  /** Called after messages are read so the caller can refresh its badge. */
  onMessagesChanged?: () => void;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_username: string;
  recipient_username: string;
}

/** Unread private messages for the forum's "Messages" button (polls every 60s). */
export function useUnreadMessageCount(userId: string | null | undefined) {
  const [count, setCount] = useState(0);
  const refresh = useCallback(async () => {
    if (!userId) return;
    const { count: c, error } = await supabase
      .from('private_messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);
    if (!error) setCount(c ?? 0);
  }, [userId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useVisiblePolling(refresh, 60_000, !!userId);
  return { count, refresh };
}

/**
 * Private messages between members. private_messages is not in the realtime
 * publication (removed for privacy), so the open dialog polls every 20 seconds.
 */
export function PrivateMessagesDialog({
  open,
  onOpenChange,
  currentUserId,
  initialRecipient,
  onMessagesChanged,
}: PrivateMessagesDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'compose' | 'detail'>('list');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

  const [recipient, setRecipient] = useState<ForumMemberMatch | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setLoading(true);
      try {
        let query = supabase
          .from('private_messages')
          .select('id, sender_id, recipient_id, subject, content, is_read, created_at')
          .order('created_at', { ascending: false })
          .limit(100);
        query = activeTab === 'inbox' ? query.eq('recipient_id', currentUserId) : query.eq('sender_id', currentUserId);

        const { data, error } = await query;
        if (error) throw error;

        const names = await fetchUsernames((data || []).flatMap((m) => [m.sender_id, m.recipient_id]));
        setMessages(
          (data || []).map((msg) => ({
            ...msg,
            sender_username: forumDisplayName(names.get(msg.sender_id)),
            recipient_username: forumDisplayName(names.get(msg.recipient_id)),
          })),
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [activeTab, currentUserId],
  );

  useEffect(() => {
    if (open) void fetchMessages(true);
  }, [open, fetchMessages]);

  useVisiblePolling(() => fetchMessages(false), 20_000, open);

  useEffect(() => {
    if (open && initialRecipient) {
      setRecipient(initialRecipient);
      setSubject('');
      setContent('');
      setView('compose');
    } else if (!open) {
      setView('list');
      setSelectedMessage(null);
    }
  }, [open, initialRecipient]);

  const handleSend = async () => {
    if (!recipient || !subject.trim() || !content.trim()) {
      toast.error('Please choose who to send to, and add a subject and a message.');
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from('private_messages').insert({
        sender_id: currentUserId,
        recipient_id: recipient.id,
        subject: subject.trim().slice(0, 200),
        content: content.trim().slice(0, 5000),
      });
      if (error) throw error;
      toast.success('Message sent');
      setRecipient(null);
      setSubject('');
      setContent('');
      setView('list');
      setActiveTab('sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Your message didn't send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setView('detail');
    if (message.recipient_id === currentUserId && !message.is_read) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)));
      const { error } = await supabase.from('private_messages').update({ is_read: true }).eq('id', message.id);
      if (error) console.error('Error marking message read:', error);
      onMessagesChanged?.();
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase.from('private_messages').delete().eq('id', messageId);
      if (error) throw error;
      toast.success('Message deleted');
      setView('list');
      setSelectedMessage(null);
      void fetchMessages(false);
      onMessagesChanged?.();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("That message couldn't be deleted. Please try again.");
    }
  };

  const handleReply = (message: Message) => {
    setRecipient({ id: message.sender_id, username: message.sender_username });
    setSubject(message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`);
    setContent('');
    setView('compose');
  };

  const unreadCount = activeTab === 'inbox' ? messages.filter((m) => !m.is_read).length : 0;

  const renderList = (kind: 'inbox' | 'sent') => {
    if (loading) {
      return <p className="text-muted-foreground text-center py-4">Loading…</p>;
    }
    if (messages.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-6">
          {kind === 'inbox' ? 'No messages yet.' : "You haven't sent any messages."}
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {messages.map((message) => (
          <button
            type="button"
            key={message.id}
            onClick={() => handleViewMessage(message)}
            className={`w-full text-left p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
              kind === 'inbox' && !message.is_read ? 'bg-primary/5 border-primary/30' : 'border-border'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {kind === 'inbox' ? message.sender_username : `To: ${message.recipient_username}`}
                  </span>
                  {kind === 'inbox' && !message.is_read && <Badge variant="secondary" className="text-xs">New</Badge>}
                </div>
                <p className="font-semibold text-sm mt-1 truncate">{message.subject}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{message.content}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {kind === 'sent' && message.is_read && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-label="Read" />}
                <span className="text-xs text-muted-foreground">{format(new Date(message.created_at), 'MMM d, h:mm a')}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Private Messages
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
          </DialogTitle>
          <DialogDescription>Only you and the other member can read these. Members see your username, never your name.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {view === 'list' && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'inbox' | 'sent')} className="w-full">
              <div className="flex justify-between items-center gap-2">
                <TabsList>
                  <TabsTrigger value="inbox" className="flex items-center gap-1">
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    Sent
                  </TabsTrigger>
                </TabsList>
                <Button onClick={() => { setRecipient(null); setSubject(''); setContent(''); setView('compose'); }} size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  New message
                </Button>
              </div>
              <TabsContent value="inbox" className="mt-4">{renderList('inbox')}</TabsContent>
              <TabsContent value="sent" className="mt-4">{renderList('sent')}</TabsContent>
            </Tabs>
          )}

          {view === 'compose' && (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setView('list')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="space-y-2">
                <Label htmlFor="pm-recipient">To</Label>
                <MemberPicker id="pm-recipient" value={recipient} onChange={setRecipient} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pm-subject">Subject</Label>
                <Input id="pm-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pm-content">Message</Label>
                <Textarea id="pm-content" className="min-h-[150px]" value={content} onChange={(e) => setContent(e.target.value)} maxLength={5000} />
              </div>
              <Button onClick={handleSend} disabled={sending} className="w-full">
                {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {sending ? 'Sending…' : 'Send message'}
              </Button>
            </div>
          )}

          {view === 'detail' && selectedMessage && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => { setView('list'); setSelectedMessage(null); }}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="flex gap-2">
                  {selectedMessage.sender_id !== currentUserId && (
                    <Button variant="outline" size="sm" onClick={() => handleReply(selectedMessage)}>
                      Reply
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)} aria-label="Delete message">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg break-words">{selectedMessage.subject}</h3>
                  <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground mt-2">
                    <span>
                      {selectedMessage.sender_id === currentUserId
                        ? `To: ${selectedMessage.recipient_username}`
                        : `From: ${selectedMessage.sender_username}`}
                    </span>
                    <span>{format(new Date(selectedMessage.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
                <p className="whitespace-pre-wrap break-words">{selectedMessage.content}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
