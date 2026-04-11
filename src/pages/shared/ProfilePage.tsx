import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROLE_LABELS } from "@/types";
import { toast } from "sonner";
import { User, Mail, Phone, Building2, Camera } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 animate-in max-w-3xl">
      <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground text-sm">Your account information</p></div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <Button size="icon" variant="outline" className="h-7 w-7 absolute -bottom-1 -right-1 rounded-full"><Camera className="h-3.5 w-3.5" /></Button>
            </div>
            <div>
              <p className="text-xl font-bold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user ? ROLE_LABELS[user.role] : ""}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> Full Name</Label><Input defaultValue={user?.name} /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Email</Label><Input defaultValue={user?.email} type="email" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Phone</Label><Input defaultValue={user?.phone || ""} placeholder="+1-555-0100" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> Department</Label><Input defaultValue={user?.department || ""} /></div>
              </div>
              <Button className="gradient-primary" onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Academic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Student ID / Staff ID</Label><Input defaultValue={user?.id} readOnly className="bg-muted" /></div>
                <div className="space-y-2"><Label>Role</Label><Input defaultValue={user ? ROLE_LABELS[user.role] : ""} readOnly className="bg-muted" /></div>
                <div className="space-y-2"><Label>Department</Label><Input defaultValue={user?.department || ""} /></div>
                <div className="space-y-2"><Label>Faculty</Label><Input placeholder="Faculty of Computing" /></div>
              </div>
              <Button className="gradient-primary" onClick={() => toast.success("Academic info updated!")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" /></div>
              <Button className="gradient-primary" onClick={() => toast.success("Password updated!")}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
