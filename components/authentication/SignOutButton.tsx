import { signOutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" size="sm" variant="destructive" className="gap-2">
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </Button>
    </form>
  );
}
