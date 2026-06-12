# Configuration Supabase — Kurubis

## 1. Exécuter le schéma SQL

Dans le [dashboard Supabase](https://supabase.com/dashboard) → SQL Editor, exécutez le fichier `schema.sql`.

## 2. Créer un administrateur

1. **Authentication** → **Users** → **Add user** (email + mot de passe)
2. Dans **SQL Editor**, définir le rôle admin :

```sql
update public.profiles
set role = 'admin', first_name = 'Admin', last_name = 'Kurubis'
where email = 'votre-email-admin@example.com';
```

## 3. Variables d'environnement

Copiez `.env.example` vers `.env.local` et renseignez :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optionnel, Settings → API)
- Identifiants SMTP Gmail

## 4. Lancer l'application

```bash
npm run dev
```

Le serveur custom inclut **Socket.io** sur `/api/socketio`.

## Flux devis

| Source | Email admin | Plateforme |
|--------|-------------|------------|
| Landing (contact, panier sans compte) | Oui | Non |
| Espace client connecté | Oui | Oui (messagerie temps réel) |
