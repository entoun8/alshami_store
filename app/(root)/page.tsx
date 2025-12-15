import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import heroBackground from "@/public/images/hero_img.jpg";

export default function HomePage() {
  return (
    <section className="relative h-[calc(100vh-92px)] md:h-[calc(100vh-56px)] flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={heroBackground}
        alt="Hero background"
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-foreground/60" />

      {/* Hero Content */}
      <div className="wrapper relative z-10 text-center">
        <h1 className="h1-bold mb-6 text-primary-foreground">
          Discover Premium Herbs & Coffee
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
          Experience the finest selection of artisanal herbs and coffees,
          carefully sourced for exceptional quality and flavor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Now
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/about">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
