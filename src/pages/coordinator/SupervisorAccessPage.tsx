import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Key, Mail, Copy, 
  Send, RefreshCw, ShieldCheck, 
  CheckCircle2, Loader2, Lock 
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function SupervisorAccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialEmail = searchParams.get("email") || "";
  const initialName = searchParams.get("name") || "Supervisor";
  
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const generatePassword = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let result = "";
      for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setPassword(result);
      setIsGenerating(false);
      toast.success("Random password generated!");
    }, 800);
  };

  const currentPassword = password;

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const handleSendEmail = () => {
    if (!email || !password) {
      toast.error("Please ensure email and password are set.");
      return;
    }
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setHasSent(true);
      toast.success("Access credentials sent!", {
        description: `Login details sent to ${email}`,
        icon: <Send className="h-4 w-4" />
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supervisor Access Setup</h1>
          <p className="text-muted-foreground text-sm">Onboard company supervisors by providing secure access credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-elevated border-none overflow-hidden">
             <div className="h-2 bg-primary"></div>
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <ShieldCheck className="h-5 w-5 text-primary" /> Credentials Management
                </CardTitle>
                <CardDescription>Configure and send login information to the partner supervisor.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Supervisor Email Address</Label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input 
                           id="email" 
                           className="pl-10 h-11 bg-muted/30 border-none shadow-inner font-medium" 
                           placeholder="supervisor@company.com" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">One-Time Password Generation</Label>
                      <div className="flex gap-2">
                         <div className="relative flex-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="text" 
                              readOnly 
                              className="pl-10 h-11 bg-card border-dashed font-mono font-bold tracking-widest text-primary" 
                              placeholder="••••••••••••" 
                              value={password}
                            />
                            {password && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={handleCopy}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            )}
                         </div>
                         <Button 
                           variant="outline" 
                           className="h-11 px-4 gap-2 border-primary/20 hover:bg-primary/5" 
                           onClick={generatePassword}
                           disabled={isGenerating}
                         >
                           {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                           {password ? "Regenerate" : "Generate"}
                         </Button>
                      </div>
                   </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                   <Lock className="h-5 w-5 text-amber-500 mt-1" />
                   <div className="text-sm">
                      <p className="font-bold text-amber-600">Security Requirement</p>
                      <p className="text-muted-foreground font-medium">This password behaves as a temporary key. The supervisor will be prompted to create their own secure password upon first login.</p>
                   </div>
                </div>
             </CardContent>
             <CardFooter className="bg-muted/30 p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   {hasSent && <Badge className="bg-emerald-500 gap-1"><CheckCircle2 className="h-3 w-3" /> Credentials Sent</Badge>}
                </div>
                <Button 
                  className="gradient-primary h-11 px-8 gap-2 shadow-lg shadow-primary/20" 
                  disabled={!password || !email || isSending}
                  onClick={handleSendEmail}
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send Access Email
                </Button>
             </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm h-full">
             <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Preview</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="border rounded-2xl p-6 bg-white shadow-inner text-sm space-y-4">
                   <div className="flex items-center justify-between pb-4 border-b">
                      <div className="h-8 w-24 bg-primary/20 rounded flex items-center justify-center font-bold text-primary text-[10px]">ACADEMIA</div>
                      <span className="text-[10px] text-muted-foreground font-bold">{new Date().toLocaleDateString()}</span>
                   </div>
                   
                   <div className="space-y-4 py-4 min-h-[200px]">
                      <p className="font-bold">Subject: Welcome to the Internship Ecosystem</p>
                      <p>Dear {name || 'Supervisor'},</p>
                      <p className="text-muted-foreground">You have been assigned as a supervisor for our upcoming internship program at your organization. Please use the credentials below to access your dashboard:</p>
                      
                      <div className="py-4 px-6 rounded-xl bg-muted/50 border-2 border-dashed border-primary/20 text-center space-y-2">
                         <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Your Login Keys</div>
                         <p className="font-mono text-xs font-bold text-primary">{email || '[supervisor_email]'}</p>
                         <p className="font-mono text-lg font-bold tracking-widest border-t pt-2">{password || '••••••••'}</p>
                      </div>

                      <p className="text-muted-foreground text-xs">Login Link: <span className="text-primary underline">https://academia.imem.edu/login</span></p>
                   </div>

                   <div className="pt-4 border-t text-[10px] text-muted-foreground text-center italic">
                      This is an automated system email. Please do not reply directly.
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
