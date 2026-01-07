import { signOutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export default function SignOutButton({
  variant = "destructive",
  size = "sm",
  className = "gap-2",
  showIcon = true
}: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <Button type="submit" size={size} variant={variant} className={className}>
        {showIcon && <LogOut className="h-4 w-4" />}
        <span>Sign Out</span>
      </Button>
    </form>
  );
}
