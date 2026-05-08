import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function AdminPosts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function save(form: any) {
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      is_published: form.is_published,
    };
    const { error } = editing?.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Blog posts</h2>
        <Button onClick={() => setEditing({ is_published: true })} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" /> New post
        </Button>
      </div>

      {editing && <PostForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />}

      <div className="grid gap-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">/{p.slug} · {p.is_published ? "Published" : "Draft"} · {new Date(p.published_at).toLocaleDateString()}</div>
            </div>
            <Button variant="outline" size="icon" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground text-sm">No posts yet.</p>}
      </div>
    </div>
  );
}

function PostForm({ initial, onCancel, onSave }: any) {
  const [form, setForm] = useState({
    title: initial.title ?? "",
    slug: initial.slug ?? "",
    excerpt: initial.excerpt ?? "",
    content: initial.content ?? "",
    cover_image_url: initial.cover_image_url ?? "",
    is_published: initial.is_published ?? true,
  });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-2xl bg-card border border-border p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{initial.id ? "Edit post" : "New post"}</h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Slug (optional)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
      </div>
      <div><Label>Cover image URL (optional)</Label><Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://..." /></div>
      <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary shown on the blog list" /></div>
      <div><Label>Content</Label><Textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published
      </label>
      <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}
