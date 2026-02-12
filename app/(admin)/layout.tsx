import type { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="wrapper py-10">
        <h1 className="h1-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
