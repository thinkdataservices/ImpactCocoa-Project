import { Link, Outlet } from "react-router-dom";
import { ThemeSwitcher } from "@/shared/components/composed/theme-switcher";
import { LocaleSwitcher } from "@/shared/components/composed/locale-switcher";
import type { Locale } from "@/shared/hooks/use-locale";

interface AuthLayoutProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function AuthLayout({ locale, onLocaleChange }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-border border-b px-8 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="font-semibold text-base text-foreground">
            ThinkData
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher locale={locale} onLocaleChange={onLocaleChange} />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center bg-muted p-6">
        <Outlet />
      </main>
    </div>
  );
}
