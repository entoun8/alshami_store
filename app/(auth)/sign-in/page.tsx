import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInButton from "@/components/authentication/SignInButton";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Alshami Store account to access your profile and order history.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="h2-bold">Welcome to {APP_NAME}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
