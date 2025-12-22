import { signInAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function SignInButton() {
  return (
    <form action={signInAction}>
      <Button type="submit" size="lg" className="w-full gap-2">
        <Mail className="h-5 w-5" />
        Sign in with Google
      </Button>
    </form>
  );
}
