import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMessages } from "@/data/mockData";
import { useAuthStore } from "@/stores/authStore";
import { Send, Search, Inbox, SendHorizontal, Eye, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Message } from "@/types";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("inbox");
  const [composeOpen, setComposeOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);

  const allMessages = mockMessages;
  const inbox = allMessages.filter(m => m.receiverId === user?.id || tab === "inbox");
  const sent = allMessages.filter(m => m.senderId === user?.id || tab === "sent");
  const currentMessages = (tab === "inbox" ? (inbox.length > 0 ? inbox : allMessages) : sent.length > 0 ? sent : allMessages)
    .filter(m => m.subject.toLowerCase().includes(search.toLowerCase()) || m.senderName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground text-sm">Communication center</p></div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild><Button className="gradient-primary gap-2"><Send className="h-4 w-4" /> Compose</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>To</Label><Input placeholder="Recipient name or email" /></div>
              <div className="space-y-2"><Label>Subject</Label><Input placeholder="Message subject" /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Write your message..." rows={6} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
              <Button className="gradient-primary gap-2" onClick={() => { setComposeOpen(false); toast.success("Message sent!"); }}><Send className="h-4 w-4" /> Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="inbox" className="gap-2"><Inbox className="h-4 w-4" /> Inbox</TabsTrigger>
          <TabsTrigger value="sent" className="gap-2"><SendHorizontal className="h-4 w-4" /> Sent</TabsTrigger>
        </TabsList>

        <div className="relative max-w-sm mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <TabsContent value={tab} className="space-y-3 mt-4">
          {currentMessages.map((m) => (
            <Card key={m.id} className={`shadow-card hover:shadow-elevated transition-shadow cursor-pointer ${!m.read ? "border-primary/30 bg-accent/20" : ""}`} onClick={() => { setSelected(m); setViewOpen(true); }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{(tab === "inbox" ? m.senderName : m.receiverName).charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{tab === "inbox" ? m.senderName : `To: ${m.receiverName}`}</p>
                        {!m.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="font-medium text-sm mt-0.5">{m.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.content}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.subject}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">From: {selected.senderName}</p>
                  <p className="text-muted-foreground">To: {selected.receiverName}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg border"><p>{selected.content}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={() => { setViewOpen(false); setReplyOpen(true); }}><Reply className="h-4 w-4" /> Reply</Button>
                <Button variant="outline" className="gap-2 text-destructive"><Trash2 className="h-4 w-4" /> Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Reply to: {selected?.subject}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-muted-foreground">Original from {selected?.senderName}:</p>
              <p className="mt-1 italic">{selected?.content}</p>
            </div>
            <div className="space-y-2"><Label>Your Reply</Label><Textarea placeholder="Write your reply..." rows={5} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyOpen(false)}>Cancel</Button>
            <Button className="gradient-primary gap-2" onClick={() => { setReplyOpen(false); toast.success("Reply sent!"); }}><Send className="h-4 w-4" /> Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
