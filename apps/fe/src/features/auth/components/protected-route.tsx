import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

/**
 * Protects routes that require authentication.
 * Redirects to /login if user is not authenticated.
 */
export function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
