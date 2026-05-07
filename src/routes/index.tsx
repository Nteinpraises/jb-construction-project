import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Truck, Building2, Hammer, Home as HomeIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "JB Construction — The Brighter Face of Engineering" },
      { name: "description", content: "Order construction materials, furniture and house accessories online. Pre-order, prepay and we deliver across Cameroon." },
    ],
  }),
});

const services = [
  { icon: Hammer, title: "Build Conception", desc: "Build the advanced quality of your dream — structures from conception to finish." },
  { icon: Building2, title: "Exchange Opportunity", desc: "Buy qualitative materials in bulk with less stress and lower cost." },
  { icon: Truck, title: "Delivery Opportunities", desc: "Transport and delivery of materials, almost free with us. Just book." },
  { icon: HomeIcon, title: "Real Estate", desc: "We buy and sell good plots, houses, and properties — moderately." },
];

function Index() {
  const { data: featured } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Product[];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-primary-foreground">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/30 backdrop-blur text-xs uppercase tracking-widest text-secondary-foreground border border-secondary/40">
              Quality is our priority
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05]">
              We Are <span className="block text-secondary">The Brighter</span>
              <span className="block text-gradient-gold">Face of Engineering</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl">
              The bridge to Africa's better infrastructure. Browse, buy and pre-order construction materials, furniture and house accessories — delivered anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/shop">Shop now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/services">Our services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">What we do</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">Building smarter, together</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div key={s.title} className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:shadow-elegant">
              <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Marketplace</span>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">Featured products</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/shop">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="hero-gradient rounded-3xl p-10 md:p-16 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold">Pre-order & prepay</h2>
            <p className="mt-4 text-primary-foreground/80">
              Need materials in 1 or 2 weeks? Open an account, prepay, and we secure your stock — delivered when you're ready.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Reserved stock at today's prices", "Affordable, almost-free delivery", "Real estate listings — buy or sell"].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> {t}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
