import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/admin/login" });
  },
});

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (path === "/admin/login") return;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { navigate({ to: "/admin/login" }); return; }
      setEmail(sess.session.user.email ?? "");
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) { toast.error(error.message); }
      setIsAdmin(!!data);
    })();
  }, [path, navigate]);

  if (path === "/admin/login") return <Outlet />;

  if (isAdmin === null) {
    return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading admin...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold">Access pending</h1>
        <p className="mt-3 text-muted-foreground">
          Your account ({email}) is signed in but does not yet have admin access.
          An existing admin must grant you the <span className="font-mono">admin</span> role in the backend.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          (First-time setup: open the backend, add a row to <span className="font-mono">user_roles</span> with your user_id and role <span className="font-mono">admin</span>.)
        </p>
        <Button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }} variant="outline" className="mt-6">
          Sign out
        </Button>
      </div>
    );
  }

  const tabs = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
      <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[1px] transition-colors whitespace-nowrap ${
              path === t.to ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
