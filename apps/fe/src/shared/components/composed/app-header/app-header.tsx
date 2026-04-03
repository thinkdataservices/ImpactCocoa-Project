import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/shared/components/composed/theme-switcher";
import { LocaleSwitcher } from "@/shared/components/composed/locale-switcher";
import type { Locale } from "@/shared/hooks/use-locale";

interface AppHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function AppHeader({ locale, onLocaleChange }: AppHeaderProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="!mx-1 !h-4 !self-center" />
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <ThemeSwitcher />
        <LocaleSwitcher locale={locale} onLocaleChange={onLocaleChange} />
        <Separator orientation="vertical" className="!mx-1 !h-4 !self-center" />
        {session?.user && (
          <span className="hidden text-sm text-muted-foreground sm:inline">{session.user.email}</span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
