import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MessageSquare, ArrowLeft, Send, Globe, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactSupportPage() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Support ticket submitted! We will get back to you within 24 hours.");
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
          <p className="text-muted-foreground">Expert help when you need it most.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-elevated border-primary/10">
            <CardHeader>
              <CardTitle>Submit a Ticket</CardTitle>
              <CardDescription>Fill out the form below and our team will investigate your issue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Issue Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue / Bug</SelectItem>
                      <SelectItem value="account">Account Access</SelectItem>
                      <SelectItem value="grades">Grade Discrepancy</SelectItem>
                      <SelectItem value="placement">Placement Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue or question in detail..." 
                    rows={6} 
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-11 gradient-primary gap-2" disabled={sending}>
                  <Send className={`h-4 w-4 ${sending ? "animate-ping" : ""}`} /> 
                  {sending ? "Sending Ticket..." : "Submit Support Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card overflow-hidden border-none">
            <div className="h-2 bg-primary"></div>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Email Us</p>
                  <p className="text-muted-foreground">Support: support@imem.edu</p>
                  <p className="text-muted-foreground">General: info@imem.edu</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Call Us</p>
                  <p className="text-muted-foreground">Mon-Fri 8:30 AM - 5:30 PM</p>
                  <p className="text-muted-foreground">+251 11-667-8899</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Visit Us</p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" /> University Campus, Block B
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-none bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> FAQ 
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p className="text-muted-foreground">Have you checked our FAQ? You might find your answer there faster.</p>
              <Button variant="link" className="p-0 h-auto text-primary border-none" onClick={() => navigate("/faq")}>
                Browse FAQ →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
