import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="wrapper min-h-[70vh] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-12 pb-8 px-8">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-primary">404</h1>
          </div>

          <h2 className="h2-bold mb-3">Page Not Found</h2>

          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gap-2">
              <Link href="/products">
                <HomeIcon className="size-4" />
                Go Home
              </Link>
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <Link href="/products">
                <SearchIcon className="size-4" />
                Browse Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
