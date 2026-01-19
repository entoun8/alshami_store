"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="wrapper min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-6">
              <AlertCircleIcon />
              <AlertTitle className="text-lg font-semibold">
                Application Error
              </AlertTitle>
              <AlertDescription className="mt-2">
                {error.message || "A critical error occurred. Please refresh the page."}
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button onClick={reset} className="flex-1">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
