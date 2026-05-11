import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cart, useCart, formatXAF } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — JB Construction" }] }),
});

function Checkout() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });

  if (items.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in name, phone and address");
      return;
    }
    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null,
          delivery_address: form.address,
          notes: form.notes || null,
          total,
          status: "pending",
        })
        .select()
        .single();
      if (error || !order) throw error;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        unit_price: i.price,
        quantity: i.quantity,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      cart.clear();
      toast.success("Order placed! We'll contact you shortly.");

      // Send full order details directly to admin's WhatsApp
      const waMessage =
        `*NEW ORDER #${order.id.slice(0, 8).toUpperCase()}*\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `*Customer:* ${form.name}\n` +
        `*Phone:* ${form.phone}\n` +
        (form.email ? `*Email:* ${form.email}\n` : "") +
        `*Address:* ${form.address}\n` +
        (form.notes ? `*Notes:* ${form.notes}\n` : "") +
        `\n*ITEMS ORDERED:*\n` +
        items.map((i) => `• ${i.quantity} × ${i.name} — ${formatXAF(i.price * i.quantity)}`).join("\n") +
        `\n━━━━━━━━━━━━━━━━━\n*TOTAL: ${formatXAF(total)}*`;

      window.open(`https://wa.me/237670713943?text=${encodeURIComponent(waMessage)}`, "_blank");

      navigate({ to: "/order-confirmed", search: { id: order.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>
      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-lg">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Phone (WhatsApp) *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+237..." />
              </div>
            </div>
            <div>
              <Label>Email (optional)</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Delivery address *</Label>
              <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="Quarter, town, landmarks..." />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Special instructions, delivery time..." />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 h-fit space-y-3">
          <h2 className="font-semibold text-lg mb-2">Order summary</h2>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="truncate">{i.quantity} × {i.name}</span>
              <span className="font-medium shrink-0 ml-2">{formatXAF(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border my-2" />
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{formatXAF(total)}</span></div>
          <Button type="submit" disabled={loading} size="lg" className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            {loading ? "Placing..." : "Place order"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">You'll be connected via WhatsApp to confirm payment & delivery.</p>
        </div>
      </form>
    </div>
  );
}
