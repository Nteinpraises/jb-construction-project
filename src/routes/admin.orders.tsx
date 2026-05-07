import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatXAF } from "@/lib/cart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-4">Orders ({orders.length})</h2>
      {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-card border border-border p-5">
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div>
                <div className="font-semibold">{o.customer_name}</div>
                <div className="text-sm text-muted-foreground">{o.customer_phone} {o.customer_email && `• ${o.customer_email}`}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">📍 {o.delivery_address}</div>
                {o.notes && <div className="text-xs italic mt-1">Note: {o.notes}</div>}
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-bold text-primary">{formatXAF(o.total)}</div>
                <div className="mt-2">
                  <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                    <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border space-y-1">
              {o.order_items?.map((it: any) => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span>{it.quantity} × {it.product_name}</span>
                  <span className="text-muted-foreground">{formatXAF(it.unit_price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
