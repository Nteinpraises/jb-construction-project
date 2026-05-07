import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) ?? "" }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { id } = Route.useSearch();
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      <div className="w-20 h-20 mx-auto rounded-full bg-secondary/15 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-secondary" />
      </div>
      <h1 className="font-display text-4xl font-bold">Order received!</h1>
      <p className="mt-3 text-muted-foreground">
        Thank you. Our team will reach out on WhatsApp shortly to confirm your order and arrange delivery.
      </p>
      {id && <p className="mt-2 text-xs text-muted-foreground">Reference: <span className="font-mono">{id.slice(0, 8)}</span></p>}
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild><Link to="/shop">Keep shopping</Link></Button>
        <Button asChild variant="outline"><Link to="/">Home</Link></Button>
      </div>
    </div>
  );
}
