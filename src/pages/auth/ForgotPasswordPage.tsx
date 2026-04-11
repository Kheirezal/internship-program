import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success("Reset link sent to your email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex gradient-primary text-primary-foreground font-bold text-xl px-4 py-2 rounded-xl">IMEM</div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-muted-foreground text-sm">We'll send you a reset link</p>
        </div>
        <Card className="shadow-elevated">
          <CardContent className="pt-6">
            {sent ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm">Check your email for a reset link.</p>
                <Link to="/login"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to login</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Send reset link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
