-- Exécuter si les conversations ne se créent pas (erreur 500)
-- À lancer APRÈS schema.sql

-- 1. Créer les profils manquants pour les users Auth existants
INSERT INTO public.profiles (id, email, first_name, last_name, role, status)
SELECT
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'last_name', ''),
  'user',
  'actif'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

-- 2. Passer un user en admin (remplacez l'email)
-- UPDATE public.profiles SET role = 'admin', first_name = 'Admin', last_name = 'Kurubis'
-- WHERE email = 'kurubis.uniforme@gmail.com';

-- 3. Vérifier les tables
SELECT 'profiles' AS table_name, count(*) FROM public.profiles
UNION ALL
SELECT 'conversations', count(*) FROM public.conversations;
