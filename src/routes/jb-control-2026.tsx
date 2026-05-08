import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/jb-control-2026")({
  component: SecretAdminLogin,
  head: () => ({ meta: [{ title: "Staff access — JB Construction" }, { name: "robots", content: "noindex, nofollow" }] }),
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function SecretAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [remaining, setRemaining] = useState<number>(MAX_ATTEMPTS);
  const navigate = useNavigate();

  // Check existing failed attempts on mount
  useEffect(() => {
    if (!email) return;
    void checkLockout(email);
  }, [email]);

  async function checkLockout(id: string) {
    const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("admin_login_attempts")
      .select("attempted_at, success")
      .eq("identifier", id.toLowerCase())
      .gte("attempted_at", since)
      .order("attempted_at", { ascending: false });
    if (!data) return;
    const failures = data.filter((r) => !r.success);
    setRemaining(Math.max(0, MAX_ATTEMPTS - failures.length));
    if (failures.length >= MAX_ATTEMPTS) {
      const oldest = failures[failures.length - 1];
      const until = new Date(new Date(oldest.attempted_at).getTime() + LOCKOUT_MINUTES * 60 * 1000);
      setLockedUntil(until);
    } else {
      setLockedUntil(null);
    }
  }

  async function logAttempt(id: string, success: boolean) {
    await supabase.from("admin_login_attempts").insert({ identifier: id.toLowerCase(), success });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    await checkLockout(email);
    if (lockedUntil && lockedUntil > new Date()) {
      toast.error("Too many failed attempts. Try again later.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        await logAttempt(email, false);
        await checkLockout(email);
        throw error;
      }
      await logAttempt(email, true);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  const isLocked = lockedUntil && lockedUntil > new Date();

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <div className="rounded-2xl bg-card border border-border p-8 shadow-elegant">
        <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground mb-5">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="font-display text-3xl font-bold">Staff access</h1>
        <p className="text-sm text-muted-foreground mt-1">Authorized personnel only.</p>

        {isLocked && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-2 text-sm text-destructive">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Account temporarily locked. Try again after {lockedUntil!.toLocaleTimeString()}.</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => checkLockout(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading || !!isLocked} className="w-full" size="lg">
            {loading ? "Verifying..." : "Sign in"}
          </Button>
          {email && !isLocked && remaining < MAX_ATTEMPTS && (
            <p className="text-xs text-muted-foreground text-center">{remaining} attempt{remaining === 1 ? "" : "s"} remaining</p>
          )}
        </form>
        <p className="mt-6 text-xs text-muted-foreground text-center">
          <Link to="/" className="hover:underline">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
