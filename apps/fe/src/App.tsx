import { useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate('/login');
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-border border-b px-8 py-4">
        <span className="font-semibold text-base text-foreground">ThinkData</span>
        <div className="flex items-center gap-3">
          {session?.user && (
            <span className="text-sm text-muted-foreground">{session.user.email}</span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </header>
    </main>
  );
}
