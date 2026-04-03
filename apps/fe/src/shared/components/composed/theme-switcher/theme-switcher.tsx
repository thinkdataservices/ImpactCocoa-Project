import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "@/shared/hooks/use-app-theme";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { isDark, toggleTheme } = useAppTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  );
}
