import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 flex-1 flex flex-col space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-8 w-20 mt-4" />
      </CardContent>
      <CardFooter className="px-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
