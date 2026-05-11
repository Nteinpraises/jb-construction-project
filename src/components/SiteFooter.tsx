import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="hero-gradient text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-bold">JB <span className="text-gradient-gold">Construction</span></div>
          <p className="mt-3 text-sm text-primary-foreground/70 max-w-md">
            The brighter face of engineering. We are the bridge to Africa's better infrastructure — building, supplying and delivering across Bamenda and beyond.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm uppercase tracking-wider text-secondary">Explore</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/shop" className="hover:text-accent">Shop</Link></li>
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/blog" className="hover:text-accent">News & Updates</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm uppercase tracking-wider text-secondary">Contact</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>+237 670 713 943</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>jbconstruction@gmail.com</span></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Bamenda, Cameroon</span></li>
            <li className="flex items-center gap-2"><Facebook className="h-4 w-4" /><span>JB Construction</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-primary-foreground/60 px-4">
        © 2026 JB Construction. Quality work is our priority. •{" "}
        Designed & developed by{" "}
        <a href="https://nteinpraises.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gradient-gold font-semibold hover:underline">
          Ntein Praises
        </a>
      </div>
    </footer>
  );
}
