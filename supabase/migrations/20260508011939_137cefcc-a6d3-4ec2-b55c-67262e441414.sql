
-- Blog posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON public.posts FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Failed admin login tracking (brute-force protection)
CREATE TABLE public.admin_login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_admin_login_attempts_identifier ON public.admin_login_attempts(identifier, attempted_at DESC);
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert attempts" ON public.admin_login_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view attempts" ON public.admin_login_attempts FOR SELECT USING (true);
