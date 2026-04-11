import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare, BookOpen, Phone, FileText } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  { q: "How do I submit a logbook?", a: "Navigate to Logbooks → Submit Logbook. Fill in the daily entry form and click submit." },
  { q: "How is the final grade calculated?", a: "Final grade = Company Supervisor (30%) + Academic Advisor (30%) + Academic Evaluator (40%)" },
  { q: "How do I file a grade complaint?", a: "Go to Complaints → New Complaint. Describe the issue and submit." },
  { q: "How do I upload documents?", a: "Navigate to Documents → Upload Document. Select the file and submit." },
  { q: "Who do I contact for technical issues?", a: "Use the Contact Support form below or email support@imem.edu." },
  { q: "How do I view my defense schedule?", a: "Go to your Dashboard or the Calendar page. Defense events appear with the 'defense' tag." },
  { q: "Can I edit a submitted logbook?", a: "Once submitted, you cannot edit logbooks. Contact your advisor if changes are needed." },
  { q: "How do I check my attendance records?", a: "Students can view their attendance from the Dashboard. Supervisors manage attendance from the Attendance page." },
];

const guides = [
  { title: "Getting Started Guide", icon: BookOpen, desc: "Learn the basics of IMEM and how to navigate the platform." },
  { title: "Logbook Submission Guide", icon: FileText, desc: "Step-by-step instructions for submitting daily logbook entries." },
  { title: "Report Writing Guide", icon: FileText, desc: "Guidelines for writing and submitting your internship report." },
  { title: "Evaluation Process", icon: HelpCircle, desc: "Understanding how evaluations work and what to expect." },
];

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-in max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground text-sm">Find answers or get in touch</p>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Frequently Asked Questions</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g, i) => (
              <Card key={i} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <g.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{g.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{g.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="h-5 w-5" /> Contact Support</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Subject</Label><Input placeholder="Brief description of your issue" /></div>
                <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Describe your issue in detail..." rows={4} /></div>
                <Button className="gradient-primary" onClick={() => toast.success("Support ticket submitted!")}>Submit</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>support@imem.edu</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>+1-555-IMEM (4636)</span></div>
                <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-muted-foreground" /><span>Live chat available Mon-Fri 9am-5pm</span></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
