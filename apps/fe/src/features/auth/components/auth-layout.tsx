import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-border border-b px-8 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="font-semibold text-base text-foreground">
            ThinkData
          </span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center bg-muted p-6">
        <Outlet />
      </main>
    </div>
  );
}
