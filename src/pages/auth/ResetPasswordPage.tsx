import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Password updated!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex gradient-primary text-primary-foreground font-bold text-xl px-4 py-2 rounded-xl">IMEM</div>
          <h1 className="text-2xl font-bold">New password</h1>
          <p className="text-muted-foreground text-sm">Enter your new password</p>
        </div>
        <Card className="shadow-elevated">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
