import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatXAF } from "@/lib/cart";
import { Package, ShoppingBag, Banknote, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [{ count: productCount }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total,status,created_at"),
      ]);
      const revenue = (orders ?? []).reduce((s, o) => s + Number(o.total), 0);
      const pending = (orders ?? []).filter((o) => o.status === "pending").length;
      return {
        productCount: productCount ?? 0,
        orderCount: orders?.length ?? 0,
        revenue,
        pending,
      };
    },
  });

  const cards = [
    { label: "Total revenue", value: formatXAF(data?.revenue ?? 0), icon: Banknote, color: "bg-accent/15 text-accent" },
    { label: "Total orders", value: String(data?.orderCount ?? 0), icon: ShoppingBag, color: "bg-secondary/15 text-secondary" },
    { label: "Pending orders", value: String(data?.pending ?? 0), icon: Clock, color: "bg-gold/20 text-gold-foreground" },
    { label: "Products", value: String(data?.productCount ?? 0), icon: Package, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl bg-card border border-border p-6">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.color} mb-4`}>
            <c.icon className="h-5 w-5" />
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
          <div className="font-display text-2xl font-bold mt-1">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
