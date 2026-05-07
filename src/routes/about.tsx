import { createFileRoute } from "@tanstack/react-router";

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
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <span className="text-xs uppercase tracking-widest text-accent font-semibold">About us</span>
      <h1 className="mt-2 font-display text-5xl font-bold">The brighter face of engineering</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        We are the bridge to Africa's better infrastructure. JB Construction is a one-stop platform for buying, selling and building smarter — based in Bamenda and serving customers across Cameroon and beyond.
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Whether you need cement, blocks, roofing sheets, tiles, doors, plumbing, electricals, or furniture, we'll source it, advertise yours, or deliver it to your site. Our pre-order service lets you secure stock at today's prices, and our real estate desk connects buyers and sellers of land and homes.
      </p>
      <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
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
  );
}
