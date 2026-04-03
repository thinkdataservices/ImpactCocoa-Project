import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LocaleSwitcher } from "@/shared/components/composed/locale-switcher";
import { UserMenu } from "@/shared/components/composed/user-menu";
import type { Locale } from "@/shared/hooks/use-locale";

interface AppHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function AppHeader({ locale, onLocaleChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="!mx-1 !h-4 !self-center" />
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <LocaleSwitcher locale={locale} onLocaleChange={onLocaleChange} />
        <UserMenu />
      </div>
    </header>
  );
}
