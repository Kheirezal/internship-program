import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const user = useAuthStore.getState().user!;
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role.replace(/_/g, "-")}`);
    } else {
      toast.error("Invalid credentials");
    }
  };

  const demoAccounts = [
    { label: "Coordinator", email: "coordinator@imem.edu" },
    { label: "Advisor", email: "advisor@imem.edu" },
    { label: "Evaluator", email: "evaluator@imem.edu" },
    { label: "Supervisor", email: "supervisor@company.com" },
    { label: "Student", email: "student@imem.edu" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex gradient-primary text-primary-foreground font-bold text-xl px-4 py-2 rounded-xl">IMEM</div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your internship management account</p>
        </div>

        <Card className="shadow-elevated">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">Click to fill credentials (password: password)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <Button key={acc.email} variant="outline" size="sm" className="text-xs" onClick={() => { setEmail(acc.email); setPassword("password"); }}>
                {acc.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
