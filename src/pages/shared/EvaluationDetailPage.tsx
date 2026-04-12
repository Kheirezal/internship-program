import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockEvaluations, mockPlacements } from "@/data/mockData";
import { ArrowLeft, Printer, Share2, Star, User, Building2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function EvaluationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const canEvaluate = user?.role === "internship_advisor" || user?.role === "company_supervisor";
  
  const evaluation = mockEvaluations.find(e => e.id === id) || mockEvaluations[0];
  const placement = mockPlacements.find(p => p.id === evaluation.placementId);

  if (!evaluation) return <div className="flex h-96 items-center justify-center text-muted-foreground">Evaluation not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Evaluation Details</h1>
            <p className="text-muted-foreground text-sm">Formal assessment for {evaluation.studentName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success("Shared!")}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <StatusBadge status={evaluation.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="shadow-sm border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Evaluator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-bold">{evaluation.evaluatorName}</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{evaluation.evaluatorRole}</p>
              </div>
              <div className="pt-4 border-t border-primary/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Weight</p>
                  <p className="font-bold">{evaluation.weight}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Date</p>
                  <p className="font-bold">{evaluation.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Placement Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <p className="font-bold">{placement?.companyName}</p>
                  <p className="text-xs text-muted-foreground italic">Addis Ababa, Ethiopia</p>
               </div>
               <div className="pt-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{placement?.startDate} — {placement?.endDate}</span>
               </div>
               <Button variant="outline" className="w-full text-xs h-8" onClick={() => navigate(`/internship-coordinator/students/${placement?.id}`)}>View Full Profile</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-elevated border-none overflow-hidden">
            <div className="bg-primary/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/20">
                  {evaluation.score}
                </div>
                <div>
                   <p className="text-xl font-bold">Overall Performance</p>
                   <p className="text-sm text-muted-foreground">Weighted grade for this period</p>
                </div>
              </div>
              <div className="hidden sm:block">
                 <CheckCircle2 className="h-12 w-12 text-primary opacity-20" />
              </div>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" /> Criteria Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {evaluation.criteria.map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{c.name}</span>
                        <span className="text-primary">{c.score} <span className="text-muted-foreground font-normal">/ {c.maxScore}</span></span>
                      </div>
                      <Progress value={(c.score / c.maxScore) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Qualitative Feedback
                </h3>
                <div className="p-6 rounded-2xl bg-muted/30 italic text-sm leading-relaxed text-muted-foreground font-medium border-l-4 border-primary">
                  "{evaluation.comments}"
                </div>
              </div>

              {canEvaluate && evaluation.status !== "finalized" && (
                <div className="pt-6 flex justify-end gap-3">
                   <Button variant="outline" className="rounded-xl">Save as Draft</Button>
                   <Button className="gradient-primary rounded-xl px-8" onClick={() => toast.success("Evaluation finalized!")}>Finalize & Submit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
