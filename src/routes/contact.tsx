import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — JB Construction" },
      { name: "description", content: "Reach JB Construction for orders, listings, deliveries and real estate." },
    ],
  }),
});

function Contact() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <span className="text-xs uppercase tracking-widest text-accent font-semibold">Get in touch</span>
      <h1 className="mt-2 font-display text-5xl font-bold">Let's talk</h1>
      <p className="mt-3 text-muted-foreground">Reach us on WhatsApp for the fastest response.</p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <a href="tel:+237670713943" className="p-6 rounded-2xl bg-card border border-border hover:border-accent transition-all flex items-center gap-4">
          <Phone className="h-6 w-6 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Call us</div>
            <div className="font-semibold">+237 670 713 943</div>
          </div>
        </a>
        <a href="https://wa.me/237670713943" target="_blank" rel="noreferrer" className="p-6 rounded-2xl bg-card border border-border hover:border-accent transition-all flex items-center gap-4">
          <MessageCircle className="h-6 w-6 text-secondary" />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">WhatsApp</div>
            <div className="font-semibold">Chat with us</div>
          </div>
        </a>
        <a href="mailto:nkembohjuniorbrown@gmail.com" className="p-6 rounded-2xl bg-card border border-border hover:border-accent transition-all flex items-center gap-4">
          <Mail className="h-6 w-6 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Email</div>
            <div className="font-semibold text-sm break-all">nkembohjuniorbrown@gmail.com</div>
          </div>
        </a>
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4">
          <MapPin className="h-6 w-6 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Location</div>
            <div className="font-semibold">Bamenda, Cameroon</div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <a href="https://wa.me/237670713943" target="_blank" rel="noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" /> Chat on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
