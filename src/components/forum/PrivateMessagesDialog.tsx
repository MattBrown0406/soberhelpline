import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Inbox, ArrowLeft, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fetchPublicProfiles } from '@/lib/publicProfiles';

interface PrivateMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_username?: string;
  recipient_username?: string;
}

interface Member {
  id: string;
  username: string;
}

export function PrivateMessagesDialog({ open, onOpenChange, currentUserId }: PrivateMessagesDialogProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'compose' | 'detail'>('list');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Compose form state
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMessages();
      fetchMembers();
    }
  }, [open, activeTab]);

  useEffect(() => {
    if (!open) return;

    const channel = supabase
      .channel('private-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'private_messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from('private_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab === 'inbox') {
        query.eq('recipient_id', currentUserId);
      } else {
        query.eq('sender_id', currentUserId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch usernames for messages
      const userIds = new Set<string>();
      data?.forEach(msg => {
        userIds.add(msg.sender_id);
        userIds.add(msg.recipient_id);
      });

      const profiles = await fetchPublicProfiles(Array.from(userIds));

      const usernameMap = new Map(profiles?.map(p => [p.id, p.username || p.first_name || 'Anonymous']) || []);

      const messagesWithUsernames = data?.map(msg => ({
        ...msg,
        sender_username: usernameMap.get(msg.sender_id) || 'Anonymous',
        recipient_username: usernameMap.get(msg.recipient_id) || 'Anonymous'
      })) || [];

      setMessages(messagesWithUsernames);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      // Get all active forum members
      const { data: subscriptions } = await supabase
        .from('provider_subscriptions')
        .select('user_id')
        .eq('status', 'active')
        .is('provider_submission_id', null);

      if (!subscriptions?.length) return;

      const userIds = subscriptions.map(s => s.user_id).filter(id => id !== currentUserId);

      const profiles = await fetchPublicProfiles(userIds);

      setMembers(profiles
        ?.map(p => ({
          id: p.id,
          username: p.username || p.first_name || 'Anonymous'
        }))
        .filter(p => p.username !== 'Anonymous') || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSend = async () => {
    if (!recipientId || !subject.trim() || !content.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: recipientId,
          subject: subject.trim(),
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: 'Message sent',
        description: 'Your message has been delivered'
      });

      setRecipientId('');
      setSubject('');
      setContent('');
      setView('list');
      setActiveTab('sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setView('detail');

    // Mark as read if recipient
    if (message.recipient_id === currentUserId && !message.is_read) {
      await supabase
        .from('private_messages')
        .update({ is_read: true })
        .eq('id', message.id);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('private_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: 'Message deleted'
      });

      if (view === 'detail') {
        setView('list');
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
    }
  };

  const handleReply = (message: Message) => {
    setRecipientId(message.sender_id);
    setSubject(`Re: ${message.subject}`);
    setContent('');
    setView('compose');
  };

  const unreadCount = messages.filter(m => !m.is_read && m.recipient_id === currentUserId).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Private Messages
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} unread</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {view === 'list' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex justify-between items-center">
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
                    <Button onClick={() => setView('compose')} size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Compose
                    </Button>
                  </div>

                  <TabsContent value="inbox" className="mt-4 max-h-[400px] overflow-y-auto">
                    {loading ? (
                      <p className="text-muted-foreground text-center py-4">Loading...</p>
                    ) : messages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No messages in inbox</p>
                    ) : (
                      <div className="space-y-2">
                        {messages.map(message => (
                          <div
                            key={message.id}
                            onClick={() => handleViewMessage(message)}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              !message.is_read ? 'bg-primary/5 border-primary/20' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{message.sender_username}</span>
                                  {!message.is_read && (
                                    <Badge variant="secondary" className="text-xs">New</Badge>
                                  )}
                                </div>
                                <p className="font-semibold text-sm mt-1">{message.subject}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{message.content}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.created_at), 'MMM d, h:mm a')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sent" className="mt-4 max-h-[400px] overflow-y-auto">
                    {loading ? (
                      <p className="text-muted-foreground text-center py-4">Loading...</p>
                    ) : messages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No sent messages</p>
                    ) : (
                      <div className="space-y-2">
                        {messages.map(message => (
                          <div
                            key={message.id}
                            onClick={() => handleViewMessage(message)}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <span className="text-muted-foreground text-sm">To: {message.recipient_username}</span>
                                <p className="font-semibold text-sm mt-1">{message.subject}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{message.content}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {message.is_read && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {view === 'compose' && (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setView('list')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">To:</label>
                  <Select value={recipientId} onValueChange={setRecipientId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Subject:</label>
                  <Input
                    className="mt-1"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Message subject"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Message:</label>
                  <Textarea
                    className="mt-1 min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your message..."
                  />
                </div>

                <Button onClick={handleSend} disabled={sending} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
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
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>
                      {selectedMessage.sender_id === currentUserId 
                        ? `To: ${selectedMessage.recipient_username}`
                        : `From: ${selectedMessage.sender_username}`
                      }
                    </span>
                    <span>{format(new Date(selectedMessage.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
