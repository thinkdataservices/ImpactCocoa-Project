import { LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/shared/components/composed/theme-switcher";

export function UserMenu() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <Popover>
      <PopoverTrigger className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        {initials}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={2}
        className="w-[220px] p-0"
        showArrow
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="truncate text-sm font-semibold text-foreground">
              {user?.name ?? "User"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email ?? ""}
            </span>
          </div>
          <ThemeSwitcher />
        </div>
        <Separator />
        <div className="p-1">
          <Link
            to="/profile"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
          >
            <Settings className="size-4" />
            Profile Settings
          </Link>
        </div>
        <Separator />
        <div className="p-1">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-accent"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
