import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: Blog,
  head: () => ({
    meta: [
      { title: "News & Updates — JB Construction" },
      { name: "description", content: "Latest news, updates and stories from JB Construction." },
    ],
  }),
});

function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient text-primary-foreground">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gradient-gold font-semibold">News & updates</span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
            Stories from the <span className="text-gradient-gold">construction floor</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
            Project updates, market insights, and behind-the-scenes news from the JB Construction team in Bamenda and beyond.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold">Latest posts</h2>
        <p className="mt-1 text-muted-foreground">Fresh updates from our team.</p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No posts yet. Check back soon.</p>
        ) : (
          posts.map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full hero-gradient" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" /> {new Date(p.published_at).toLocaleDateString()}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-accent line-clamp-2">{p.title}</h3>
                {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
