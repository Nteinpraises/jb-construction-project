import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading...</div>;
  if (!post) return <div className="container mx-auto py-20 text-center text-muted-foreground">Post not found.</div>;

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-accent hover:underline"><ArrowLeft className="h-4 w-4" /> All posts</Link>
      <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString()}
      </div>
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="mt-8 w-full rounded-2xl aspect-[16/9] object-cover" />
      )}
      <div className="mt-8 prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
        {post.content}
      </div>
    </article>
  );
}
