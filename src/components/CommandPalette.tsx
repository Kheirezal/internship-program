import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/stores/uiStore";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Building2, Users, Briefcase, FileText, Star, Search } from "lucide-react";
import { mockCompanies, mockPlacements } from "@/data/mockData";

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const go = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search students, companies, placements..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Companies">
          {mockCompanies.map((c) => (
            <CommandItem key={c.id} onSelect={() => go("/internship-coordinator/companies")}>
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Placements">
          {mockPlacements.map((p) => (
            <CommandItem key={p.id} onSelect={() => go("/internship-coordinator/placements")}>
              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              {p.studentName} — {p.companyName}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => go("/notifications")}><Search className="mr-2 h-4 w-4" /> Notifications</CommandItem>
          <CommandItem onSelect={() => go("/profile")}><Users className="mr-2 h-4 w-4" /> Profile</CommandItem>
          <CommandItem onSelect={() => go("/settings")}><Star className="mr-2 h-4 w-4" /> Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
