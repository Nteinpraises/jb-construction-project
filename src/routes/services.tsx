import { createFileRoute } from "@tanstack/react-router";
import { Hammer, Truck, Building2, Home, Package, Banknote } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Services — JB Construction" },
      { name: "description", content: "Build conception, materials, delivery, real estate and pre-order accounts." },
    ],
  }),
});

const items = [
  { icon: Package, title: "Buy online, anytime", desc: "Browse and buy construction materials, house accessories, furniture and more — delivered anywhere." },
  { icon: Hammer, title: "Build conception", desc: "From concept to finish: structural design and execution for villas, commercial and industrial projects." },
  { icon: Banknote, title: "Pre-order & prepay", desc: "Open an account, prepay for materials and we secure your stock at today's price for 1–2 weeks." },
  { icon: Truck, title: "Delivery opportunities", desc: "Affordable transport across Bamenda and beyond. Almost free with us — just book." },
  { icon: Home, title: "Real estate", desc: "Land, houses and rentals. Buy from us or list your property to reach serious buyers fast." },
  { icon: Building2, title: "List your products", desc: "Selling cement, blocks, roofing, tiles, doors, plumbing or furniture? Send pics + price — we advertise for you." },
];

function Services() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">What we do</span>
        <h1 className="mt-2 font-display text-5xl font-bold">Services</h1>
        <p className="mt-3 text-muted-foreground">Your one-stop platform to buy, sell and build smarter — in Bamenda and beyond.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((s) => (
          <div key={s.title} className="p-7 rounded-2xl bg-card border border-border hover:shadow-elegant transition-all">
            <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground mb-5">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-xl mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
