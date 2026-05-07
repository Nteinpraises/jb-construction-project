import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cart, useCart, formatXAF } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart — JB Construction" }] }),
});

function CartPage() {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse our marketplace and add items.</p>
        <Button asChild size="lg" className="mt-6"><Link to="/shop">Start shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold mb-8">Your cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border">
              <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full hero-gradient" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{item.name}</div>
                <div className="text-sm text-muted-foreground">{formatXAF(item.price)} / {item.unit ?? "piece"}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center border border-border rounded-full">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => cart.setQty(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => cart.setQty(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => cart.remove(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="font-bold text-primary">{formatXAF(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 h-fit sticky top-20">
          <h2 className="font-display text-xl font-bold mb-4">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatXAF(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-secondary">Quoted at checkout</span></div>
          </div>
          <div className="border-t border-border my-4" />
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{formatXAF(total)}</span></div>
          <Button asChild size="lg" className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
