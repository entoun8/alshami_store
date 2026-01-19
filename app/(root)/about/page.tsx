import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Leaf, Award, Heart, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We source only the finest herbs and coffees from trusted brands like Alattar and Alshami Coffee.",
      bgColor: "bg-muted",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our priority. We ensure every product meets our high standards.",
      bgColor: "bg-accent",
    },
    {
      icon: Leaf,
      title: "Natural & Pure",
      description: "All our products are carefully selected for their purity and natural goodness.",
      bgColor: "bg-muted",
    },
  ];

  const brands = [
    {
      name: "Alattar",
      description: "Premium herbs and natural products",
      specialty: "Green Tea & Herbs",
    },
    {
      name: "Alshami Coffee",
      description: "Artisanal coffee blends",
      specialty: "Coffee Blends",
    },
  ];

  return (
    <section className="wrapper my-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary text-primary-foreground mb-4">About Alshami</Badge>
          <h1 className="h1-bold mb-4">Your Destination for Premium Herbs & Coffee</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to Alshami Store, where tradition meets quality. We bring you the finest selection
            of herbs and coffees from renowned brands, carefully curated for discerning customers.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="h2-bold mb-6 text-center">What We Offer</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card text-card-foreground border-border transition-transform hover:scale-105">
              <CardHeader>
                <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="h3-bold">Premium Herbs</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover our selection of natural herbs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  From green tea to specialty herbal blends, our collection features premium products
                  from Alattar and other trusted brands, known for their exceptional quality and health benefits.
                </p>
                <Badge variant="outline" className="border-border">Green Tea</Badge>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground border-border transition-transform hover:scale-105">
              <CardHeader>
                <div className="bg-muted w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="h3-bold">Artisanal Coffee</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Experience the finest coffee blends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Savor the rich flavors of Alshami Coffee and other premium brands. Each blend is
                  carefully crafted to deliver an exceptional coffee experience.
                </p>
                <Badge variant="outline" className="border-border">Coffee Blends</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-12">
          <h2 className="h2-bold mb-6 text-center">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="bg-card text-card-foreground border-border"
                >
                  <CardHeader>
                    <div className={`${value.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <CardTitle className="h3-bold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Brands */}
        <div className="mb-12">
          <h2 className="h2-bold mb-6 text-center">Featured Brands</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {brands.map((brand) => (
              <Card
                key={brand.name}
                className="bg-muted/50 border-border"
              >
                <CardHeader>
                  <CardTitle className="h3-bold">{brand.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {brand.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Specialty:</span>
                    <Badge className="bg-primary text-primary-foreground">{brand.specialty}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="h2-bold">Ready to Explore?</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Browse our curated collection of premium herbs and coffees
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Link href="/contact">
                  <Users className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
