import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUIStore } from "@/stores/uiStore";
import { toast } from "sonner";
import { ThemeSection } from "@/components/settings/ThemeSection";
import { Moon, Sun, Palette, Bell, Lock } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <div className="space-y-8 animate-in max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and interface preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Palette className="h-4 w-4" /> Appearance
          </div>
          <p className="text-sm text-muted-foreground">
            Customize how the application looks for you.
          </p>
        </aside>
        
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                Interface Mode
              </CardTitle>
              <CardDescription>
                Switch between light and dark mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Reduce eye strain in low light.</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Color Theme</CardTitle>
              <CardDescription>
                Select your preferred accent color for the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSection />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
        <aside className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Lock className="h-4 w-4" /> Security
          </div>
          <p className="text-sm text-muted-foreground">
            Keep your account secure with a strong password.
          </p>
        </aside>

        <div className="md:col-span-2">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>
              <Button className="gradient-primary mt-2" onClick={() => toast.success("Password updated!")}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
        <aside className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Bell className="h-4 w-4" /> Notifications
          </div>
          <p className="text-sm text-muted-foreground">
            Configure how you receive updates and alerts.
          </p>
        </aside>

        <div className="md:col-span-2">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Email notifications", desc: "Receive updates via your registered email." },
                { label: "Push notifications", desc: "Get real-time alerts in your browser." },
                { label: "Logbook reminders", desc: "Daily notifications to complete your logbook entries." },
                { label: "Evaluation alerts", desc: "Get notified when a new evaluation is submitted." }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
