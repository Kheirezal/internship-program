import { THEME_OPTIONS } from "@/lib/theme-config";
import { useUIStore } from "@/stores/uiStore";
import { ColorSwatch } from "./ColorSwatch";
import { Label } from "@/components/ui/label";

export function ThemeSection() {
  const { colorTheme, setColorTheme } = useUIStore();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base">Accent Color</Label>
        <p className="text-sm text-muted-foreground">
          Choose a primary color for your dashboard interface.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {THEME_OPTIONS.map((option) => (
          <ColorSwatch
            key={option.id}
            option={option}
            isSelected={colorTheme === option.id}
            onClick={() => setColorTheme(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
