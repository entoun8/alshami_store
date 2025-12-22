import Link from "next/link";
import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../Logo";
import CartIcon from "../CartIcon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import auth from "@/middleware";
import SignOutButton from "@/components/authentication/SignOutButton";

export default async function Header() {
  const session = await auth();

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      {/* Main Header */}
      <div className="wrapper flex h-14 items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex gap-6">
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

        {/* Right Side - Desktop: Cart & Sign In, Mobile: Burger Menu */}
        <div className="flex items-center gap-3">
          {/* Desktop - Cart & Sign In/Out (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <CartIcon />
            {session?.user ? (
              <SignOutButton />
            ) : (
              <Button size="sm" className="gap-2" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile - Burger Menu (hidden on desktop) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-3">
              <SheetHeader className="p-2">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Access your cart and account
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 mt-3">
                {/* Cart Link */}
                <Link
                  href="/cart"
                  className="flex items-center gap-3 h-12 px-4 rounded-md hover:bg-accent transition-colors"
                >
                  <CartIcon />
                  <span>Cart</span>
                </Link>

                {/* Sign In/Out Button */}
                {session?.user ? (
                  <SignOutButton />
                ) : (
                  <Button className="justify-start gap-3 h-12" asChild>
                    <Link href="/login">
                      <LogIn className="h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Secondary Navigation Bar - Only visible on mobile */}
      <div className="border-t bg-muted/30 md:hidden">
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
