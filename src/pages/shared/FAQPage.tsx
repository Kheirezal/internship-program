import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, ArrowLeft, MessageSquare, BookOpen, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const faqs = [
  { 
    category: "General",
    questions: [
      { q: "What is IMEM?", a: "IMEM (Internship Management Education Module) is a comprehensive platform designed to streamline the internship process for students, coordinator, and industry partners." },
      { q: "How do I reset my password?", a: "You can reset your password from the login page by clicking 'Forgot Password' or from your Account Settings after logging in." }
    ]
  },
  {
    category: "For Students",
    questions: [
      { q: "How do I submit a logbook?", a: "Navigate to the Logbooks section from your dashboard, click 'Submit Logbook', fill in your daily activities and click submit." },
      { q: "When are evaluations due?", a: "Evaluations are typically due towards the end of your internship. You will receive notification alerts when they are active." }
    ]
  },
  {
    category: "Grades & Assessment",
    questions: [
      { q: "How is my final grade calculated?", a: "Your final grade is an aggregate of Company Supervisor (30%), Academic Advisor (30%), and Academic Evaluator (40%) assessments." },
      { q: "Can I appeal a grade?", a: "Yes, if you disagree with an assessment, you can file a complaint through the 'Complaints' page within 7 days of grade publication." }
    ]
  }
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 animate-in max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find quick answers to common questions about the internship process.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          className="pl-10 h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary" 
          placeholder="Search for answers..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">
          {faqs.map((category) => (
            <section key={category.category} className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" /> {category.category}
              </h2>
              <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, i) => (
                      <AccordionItem key={i} value={`${category.category}-${i}`} className="px-6 border-b last:border-0">
                        <AccordionTrigger className="hover:no-underline text-left py-4">
                          <span className="font-medium">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="shadow-card gradient-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Still Need Help?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Can't find the answer you're looking for? Reach out to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                onClick={() => navigate("/contact-support")}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Download our detailed user guides for more information.</p>
              <Button variant="outline" className="w-full text-xs h-8">Student Guide (PDF)</Button>
              <Button variant="outline" className="w-full text-xs h-8">Staff Handbook (PDF)</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
