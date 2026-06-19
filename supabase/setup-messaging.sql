-- ============================================================
-- Kurubis — INSTALLATION MESSAGERIE & DEVIS
-- Supabase → SQL Editor → New query → Coller tout → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profils (colonnes manquantes si table déjà créée)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  company text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status text NOT NULL DEFAULT 'actif' CHECK (status IN ('actif', 'inactif')),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'actif';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

-- 2. Tables messagerie / devis
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_email text NOT NULL,
  client_name text NOT NULL,
  phone text,
  company text,
  subject text NOT NULL,
  type text NOT NULL DEFAULT 'devis' CHECK (type IN ('devis', 'contact')),
  source text NOT NULL DEFAULT 'account' CHECK (source IN ('landing', 'account')),
  quote_status text NOT NULL DEFAULT 'nouveau' CHECK (quote_status IN ('nouveau', 'en_cours', 'accepte', 'refuse')),
  admin_notes text,
  unread_by_admin boolean NOT NULL DEFAULT true,
  unread_by_client boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quote_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  product_id text,
  product_name text NOT NULL,
  sku text,
  quantity int NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('client', 'admin')),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_client_email ON public.conversations(client_email);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.conversation_messages(conversation_id);

-- 3. Trigger profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, company, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Policies (drop + recreate = ré-exécutable)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "conv_select_own" ON public.conversations;
DROP POLICY IF EXISTS "conv_insert_account" ON public.conversations;
DROP POLICY IF EXISTS "conv_update_admin" ON public.conversations;
DROP POLICY IF EXISTS "conv_update_own_read" ON public.conversations;
CREATE POLICY "conv_select_own" ON public.conversations FOR SELECT
  USING (client_id = auth.uid() OR client_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR public.is_admin());
CREATE POLICY "conv_insert_account" ON public.conversations FOR INSERT
  WITH CHECK (source = 'account' AND auth.uid() IS NOT NULL);
CREATE POLICY "conv_update_admin" ON public.conversations FOR UPDATE USING (public.is_admin());
CREATE POLICY "conv_update_own_read" ON public.conversations FOR UPDATE
  USING (client_id = auth.uid() OR client_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "items_select" ON public.quote_items;
DROP POLICY IF EXISTS "items_insert" ON public.quote_items;
CREATE POLICY "items_select" ON public.quote_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.client_id = auth.uid() OR public.is_admin())));
CREATE POLICY "items_insert" ON public.quote_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.client_id = auth.uid()));

DROP POLICY IF EXISTS "msg_select" ON public.conversation_messages;
DROP POLICY IF EXISTS "msg_insert_client" ON public.conversation_messages;
DROP POLICY IF EXISTS "msg_insert_admin" ON public.conversation_messages;
CREATE POLICY "msg_select" ON public.conversation_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (
    c.client_id = auth.uid() OR c.client_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR public.is_admin()
  )));
CREATE POLICY "msg_insert_client" ON public.conversation_messages FOR INSERT
  WITH CHECK (sender = 'client' AND EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = conversation_id
    AND (c.client_id = auth.uid() OR c.client_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
  ));
CREATE POLICY "msg_insert_admin" ON public.conversation_messages FOR INSERT
  WITH CHECK (sender = 'admin' AND public.is_admin());

-- 5. Realtime (optionnel)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversation_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;
END $$;

-- 6. Vérification
SELECT 'profiles' AS table_name, count(*) AS rows FROM public.profiles
UNION ALL
SELECT 'conversations', count(*) FROM public.conversations
UNION ALL
SELECT 'conversation_messages', count(*) FROM public.conversation_messages;
