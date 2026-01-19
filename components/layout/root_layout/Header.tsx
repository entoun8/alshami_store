import Link from "next/link";
import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../Logo";
import CartIcon from "../../cart/CartIcon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import auth from "@/middleware";
import UserMenu from "@/components/authentication/UserMenu";
import { ThemeToggle } from "../ThemeToggle";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { getProducts } from "@/lib/data-service";

export default async function Header() {
  const session = await auth();
  const products = await getProducts();

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-md">
      <div className="wrapper flex h-14 items-center justify-between">
        <Logo />

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <SearchTrigger products={products} />
            <Link href="/cart">
              <CartIcon />
            </Link>
            <ThemeToggle />
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Button size="sm" className="gap-2" asChild>
                <Link href="/sign-in">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 p-0">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="text-lg">Menu</SheetTitle>
                <SheetDescription className="text-sm">
                  Navigate and manage your account
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 p-4">
                <nav className="flex flex-col gap-1">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1 px-3">
                    Navigation
                  </h3>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center h-9 px-3 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="border-t" />

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-muted-foreground px-3">
                    Quick Actions
                  </h3>

                  <div className="flex items-center h-10 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                    <SearchTrigger products={products} />
                    <span className="text-sm font-medium ml-1">
                      Search Products
                    </span>
                  </div>

                  <Link
                    href="/cart"
                    className="flex items-center gap-3 h-10 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <CartIcon />
                    <span className="text-sm font-medium">Shopping Cart</span>
                  </Link>

                  <div className="flex items-center gap-3 h-10 px-3">
                    <span className="text-sm font-medium">Theme</span>
                    <div className="ml-auto">
                      <ThemeToggle />
                    </div>
                  </div>

                  {session?.user ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border">
                      <UserMenu user={session.user} />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {session.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full justify-center gap-2" asChild>
                      <Link href="/sign-in">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="border-t bg-muted/30 hidden md:block">
        <nav className="wrapper flex h-9 items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
