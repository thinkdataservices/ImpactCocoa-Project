import type { ReactNode } from "react";
import { AppHeader } from "@/shared/components/composed/app-header";
import { AppSidebar } from "@/shared/components/composed/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Locale } from "@/shared/hooks/use-locale";

interface AppShellProps {
  children: ReactNode;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function AppShell({ children, locale, onLocaleChange }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader locale={locale} onLocaleChange={onLocaleChange} />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
