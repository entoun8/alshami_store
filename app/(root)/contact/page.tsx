import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Alshami Store. Contact us via email, Instagram, or Facebook for inquiries about our premium herbs and coffee products.",
};

export default function ContactPage() {
  const contacts = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email",
      value: "basharshalhoub077@gmail.com",
      href: "mailto:basharshalhoub077@gmail.com",
      bgColor: "bg-muted",
    },
    {
      icon: Share2,
      title: "Instagram",
      description: "Follow us on Instagram",
      value: "@alshami_coffee",
      href: "https://www.instagram.com/bashar_shalhoub_007?igsh=MXhlb2psMWh2Z2l1Ng%3D%3D&utm_source=qr",
      bgColor: "bg-accent",
    },
    {
      icon: MessageCircle,
      title: "Facebook",
      description: "Connect with us on Facebook",
      value: "Alshami Store",
      href: "https://www.facebook.com/share/19L46LH3tw/?mibextid=wwXIfr",
      bgColor: "bg-muted",
    },
  ];

  return (
    <section className="wrapper my-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="h1-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg">
            We&apos;d love to hear from you. Reach out through any of our channels.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <Card
                key={contact.title}
                className="bg-card text-card-foreground border-border transition-transform hover:scale-105"
              >
                <CardHeader>
                  <div className={`${contact.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <CardTitle className="h3-bold">{contact.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {contact.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 break-all">{contact.value}</p>
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Link href={contact.href} target="_blank" rel="noopener noreferrer">
                      Contact Us
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-muted/50 border-border">
            <CardHeader>
              <CardTitle className="h2-bold">Visit Our Store</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Discover our premium selection of herbs, coffees, and more at Alshami Store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
