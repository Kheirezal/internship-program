import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import AppSidebar from "./AppSidebar";
import CommandPalette from "@/components/CommandPalette";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
