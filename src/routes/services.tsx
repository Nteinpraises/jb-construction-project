import { createFileRoute } from "@tanstack/react-router";
import { Hammer, Truck, Building2, Home, Package, Banknote, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/services-hero.jpg";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Services — JB Construction" },
      { name: "description", content: "Build conception, materials, delivery, real estate and pre-order accounts in Bamenda and beyond." },
    ],
  }),
});

const items = [
  { icon: Package, title: "Buy online, anytime", desc: "Browse and buy construction materials, house accessories, furniture and more — delivered anywhere.", img: "/services/buyonline.jpg" },
  { icon: Hammer, title: "Build conception", desc: "From concept to finish: structural design and execution for villas, commercial and industrial projects.", img: "/services/conception.jpg" },
  { icon: Banknote, title: "Pre-order & prepay", desc: "Open an account, prepay for materials and we secure your stock at today's price for 1–2 weeks.", img: "/services/buyonline.jpg" },
  { icon: Truck, title: "Delivery opportunities", desc: "Affordable transport across Bamenda and beyond. Almost free with us — just book.", img: "/services/delivery.jpg" },
  { icon: Home, title: "Real estate", desc: "Land, houses and rentals. Buy from us or list your property to reach serious buyers fast.", img: "/services/realestate.jpg" },
  { icon: Building2, title: "List your products", desc: "Selling cement, blocks, roofing, tiles, doors, plumbing or furniture? Send pics + price — we advertise for you.", img: "/services/conception.jpg" },
];

function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="JB Construction services" className="absolute inset-0 w-full h-full object-cover" width={1600} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-primary-foreground">
          <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">What we do</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl font-extrabold max-w-3xl leading-[1.05]">
            Everything you need to <span className="text-gradient-gold">build smarter</span>.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            One platform for materials, design, delivery and real estate. We make construction in Cameroon faster, cheaper, and stress-free.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent/90 transition">
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* Service cards with images */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s) => (
            <div key={s.title} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="w-11 h-11 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground mb-4 -mt-12 relative shadow-elegant">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
