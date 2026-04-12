import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockLogbooks, mockPlacements } from "@/data/mockData";
import { 
  ArrowLeft, Calendar, User, FileText, 
  CheckCircle, XCircle, Send, MessageSquare, 
  MapPin, Clock, Edit3, Trash2 
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function LogbookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  
  const logbook = mockLogbooks.find(l => l.id === id) || mockLogbooks[0];
  const placement = mockPlacements.find(p => p.id === logbook.placementId);

  if (!logbook) return <div className="flex h-96 items-center justify-center text-muted-foreground">Logbook entry not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Logbook Detail</h1>
            <p className="text-muted-foreground text-sm">Daily entry by {logbook.studentName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Edit3 className="h-4 w-4" /></Button>
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
           <StatusBadge status={logbook.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-none overflow-hidden h-full">
            <div className="p-6 bg-muted/30 border-b flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-sm">
                   <FileText className="h-5 w-5" />
                 </div>
                 <div>
                   <h2 className="text-lg font-bold">{logbook.title}</h2>
                   <p className="text-xs text-muted-foreground font-medium">{logbook.date}</p>
                 </div>
               </div>
               <StatusBadge status={logbook.status} />
            </div>
            <CardContent className="p-8">
               <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                 {logbook.content}
               </div>

               {logbook.feedback && (
                 <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                      <MessageSquare className="h-4 w-4" /> Reviewer Feedback
                    </div>
                    <p className="text-sm italic font-medium leading-relaxed">
                      "{logbook.feedback}"
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                       <User className="h-3 w-3" /> Reviewed by {logbook.reviewedBy}
                    </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-none bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Log Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                   {logbook.studentName.charAt(0)}
                 </div>
                 <div>
                    <p className="text-sm font-bold">{logbook.studentName}</p>
                    <p className="text-xs text-muted-foreground font-medium">{placement?.companyName}</p>
                 </div>
               </div>
               <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Date: <span className="text-foreground ml-auto">{logbook.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Work Setting: <span className="text-foreground ml-auto">On-site</span>
                  </div>
               </div>
               <Button variant="outline" className="w-full text-xs h-8 rounded-lg" onClick={() => navigate(`/internship-coordinator/students/${placement?.id}`)}>Student Journey</Button>
            </CardContent>
          </Card>

          {logbook.status === 'submitted' && (
            <Card className="shadow-elevated border-none bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2">
                  <Edit3 className="h-4 w-4" /> Advisor Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <p className="text-xs font-semibold text-muted-foreground">Provide constructive feedback:</p>
                   <Textarea 
                     placeholder="Write your feedback here..." 
                     className="bg-card border-none shadow-inner resize-none min-h-[100px] text-xs font-medium" 
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" className="text-xs h-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => toast.error("Entry flagged for revision.")}>
                     <XCircle className="h-3.5 w-3.5 mr-1" /> Revise
                   </Button>
                   <Button className="text-xs h-8 rounded-lg gradient-primary" onClick={() => toast.success("Logbook approved!")}>
                     <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                   </Button>
                 </div>
                 <Button variant="ghost" className="w-full text-xs h-8 rounded-lg gap-1.5" onClick={() => toast.info("Sent to student inbox.")}>
                   <Send className="h-3.5 w-3.5" /> Notify Student
                 </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
