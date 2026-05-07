import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="JB Construction" className="h-10 w-10 object-contain" width={40} height={40} />
          <div className="hidden sm:block leading-tight">
            <div className="font-display font-bold text-base">JB Construction</div>
            <div className="text-[10px] uppercase tracking-widest text-secondary">Quality is our priority</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                path === n.to ? "text-accent" : "text-foreground/80"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Button onClick={() => setOpen(!open)} variant="ghost" size="icon" className="md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
