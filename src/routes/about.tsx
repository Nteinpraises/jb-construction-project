import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/about-hero.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — JB Construction" },
      { name: "description", content: "JB Construction — the brighter face of engineering. Building Africa's better infrastructure." },
    ],
  }),
});

function About() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="JB Construction site" className="absolute inset-0 w-full h-full object-cover" width={1600} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/30" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-primary-foreground">
          <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">About JB Construction</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl font-extrabold max-w-3xl leading-[1.05]">
            The brighter face of <span className="text-gradient-gold">engineering</span>.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            We are the bridge to Africa's better infrastructure — buying, building and delivering smarter for thousands of customers across Cameroon.
          </p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent/90 transition">
            Explore our marketplace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <p className="text-lg text-muted-foreground leading-relaxed">
          JB Construction is a one-stop platform for buying, selling and building smarter. Based in Bamenda, we serve customers across Cameroon and beyond — from individual home builders to large contractors.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Whether you need cement, blocks, roofing sheets, tiles, doors, plumbing, electricals, or furniture — we'll source it, advertise yours, or deliver it to your site. Our pre-order service lets you secure stock at today's prices, and our real estate desk connects buyers and sellers of land and homes.
        </p>
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          {[
            ["100+", "Projects delivered"],
            ["500+", "Happy customers"],
            ["24/7", "WhatsApp support"],
          ].map(([num, label]) => (
            <div key={label} className="p-6 rounded-2xl bg-muted">
              <div className="font-display text-3xl font-bold text-primary">{num}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
