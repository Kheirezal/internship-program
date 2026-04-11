import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeOption } from "@/lib/theme-config";

interface ColorSwatchProps {
  option: ThemeOption;
  isSelected: boolean;
  onClick: () => void;
}

export function ColorSwatch({ option, isSelected, onClick }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex h-12 w-full items-center justify-between rounded-lg border-2 p-3 transition-all hover:scale-[1.02] active:scale-[0.98]",
        isSelected 
          ? "border-primary bg-accent/50 ring-2 ring-primary/20" 
          : "border-transparent bg-muted/50 hover:bg-muted"
      )}
      title={option.label}
    >
      <div className="flex items-center gap-3">
        <div 
          className="h-6 w-6 rounded-full shadow-sm ring-1 ring-black/5" 
          style={{ backgroundColor: option.hex }}
        />
        <span className="text-sm font-medium">{option.label}</span>
      </div>
      
      {isSelected && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm animate-in zoom-in">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
}
