import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUIStore } from "@/stores/uiStore";
import { ROLE_LABELS } from "@/types";
import { Bell, Menu, MessageSquare, Moon, Search, Sun, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { toggleSidebar, theme, toggleTheme, setCommandPaletteOpen } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card/80 backdrop-blur-xl px-4 lg:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden lg:flex items-center gap-2">
        <div className="gradient-primary text-primary-foreground font-bold text-sm px-2.5 py-1 rounded-lg">IMEM</div>
        <span className="font-semibold text-sm text-primary">Internship</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <Button
        variant="outline"
        className="hidden md:flex items-center gap-2 text-muted-foreground w-64 justify-start"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </Button>

      {/* Messages */}
      <Button variant="ghost" size="icon" onClick={() => navigate("/messages")} className="relative">
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
              Mark all read
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-accent/30" : ""}`}
                onClick={() => markAsRead(n.id)}
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => navigate("/notifications")}>
              View all notifications
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Theme */}
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
            <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ""}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="h-4 w-4 mr-2" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4 mr-2" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
