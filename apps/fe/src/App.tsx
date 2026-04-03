import { Outlet } from "react-router-dom";
import { AppShell } from "@/shared/components/composed/app-shell";
import type { Locale } from "@/shared/hooks/use-locale";

interface AppProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function App({ locale, onLocaleChange }: AppProps) {
  return (
    <AppShell locale={locale} onLocaleChange={onLocaleChange}>
      <Outlet />
    </AppShell>
  );
}
