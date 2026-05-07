import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { cart, formatXAF } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  unit: string | null;
  stock: number;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <Link to="/product/$id" params={{ id: product.id }} className="block aspect-square bg-muted overflow-hidden relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center hero-gradient text-primary-foreground/40 font-display text-3xl">
            {product.name.charAt(0)}
          </div>
        )}
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-background/90 backdrop-blur px-2 py-1 rounded-full font-semibold">
          {product.category}
        </span>
      </Link>
      <div className="p-4 space-y-2">
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-semibold leading-tight line-clamp-1 hover:text-accent">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="font-display font-bold text-lg text-primary">{formatXAF(product.price)}</div>
            <div className="text-[10px] text-muted-foreground">per {product.unit ?? "piece"}</div>
          </div>
          <Button
            size="icon"
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => {
              cart.add({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                unit: product.unit,
                image_url: product.image_url,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
