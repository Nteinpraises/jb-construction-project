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
    <div className="container mx-auto px-4 py-12">
      <span className="text-xs uppercase tracking-widest text-accent font-semibold">News & updates</span>
      <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">From the construction floor</h1>
      <p className="mt-2 text-muted-foreground">Project updates, market news and tips from our team.</p>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
