# Configuration Supabase — Kurubis uniforme

## 1. Récupérer les clés API

1. Ouvrez [Supabase Dashboard](https://supabase.com/dashboard)
2. Projet **advcxpcunhuhnvaxilye**
3. **Project Settings** → **API**
4. Copiez dans `.env.local` :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret key** → `SUPABASE_SERVICE_ROLE_KEY` (ne jamais exposer côté client)

## 2. Base de données (automatique)

Les tables (`profiles`, `conversations`, etc.) sont **créées automatiquement** au démarrage de l'app.

Ajoutez dans `.env.local` le mot de passe Postgres :

```
SUPABASE_DB_PASSWORD=votre_mot_de_passe
```

→ Supabase Dashboard → **Settings** → **Database** → **Database password**

Puis `npm run dev`. Au démarrage vous devez voir : `Base de données : schéma messagerie OK`

> Script manuel optionnel : `setup-messaging.sql` (plus nécessaire en dev)

## 2b. Créer le super admin via Postman (alternative)

```
POST http://localhost:3000/api/admin/bootstrap?x-bootstrap-secret=kurubis-bootstrap-2026
```

Body JSON :
```json
{
  "email": "kurubis.uniforme@gmail.com",
  "password": "Admin1234!"
}
```

(Mieux : mettre le secret dans l’onglet **Headers** `x-bootstrap-secret`, pas dans l’URL.)

Après `migrate-profiles.sql`, relancez la requête Postman.


### Étape A — Créer l'utilisateur Auth

1. Menu **Authentication** → **Users**
2. Cliquez **Add user** → **Create new user**
3. Renseignez :
   - **Email** : ex. `kurubis.uniforme@gmail.com`
   - **Password** : un mot de passe fort
   - Cochez **Auto Confirm User** (évite la validation email en dev)
4. Cliquez **Create user**

### Étape B — Passer le profil en admin

1. Menu **SQL Editor** → New query
2. Exécutez (remplacez l'email) :

```sql
UPDATE public.profiles
SET
  role = 'admin',
  first_name = 'Admin',
  last_name = 'Kurubis'
WHERE email = 'kurubis.uniforme@gmail.com';
```

3. Vérifiez :

```sql
SELECT id, email, role, first_name FROM public.profiles
WHERE email = 'kurubis.uniforme@gmail.com';
```

→ `role` doit être `admin`.

### Étape C — Se connecter

1. Lancez `npm run dev`
2. Allez sur `/connexion`
3. Connectez-vous avec l'email et mot de passe admin
4. Vous serez redirigé vers `/admin`

> Les **utilisateurs normaux** s'inscrivent via `/inscription` (rôle `user` automatique).

## 4. Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://advcxpcunhuhnvaxilye.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
MAIL_USER=...
MAIL_PASS=...
MAIL_ADMIN_TO=kurubis.uniforme@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Lancer l'application

```bash
npm run dev
```

Socket.io : `/api/socketio` (notifications temps réel).

## Notifications

| Événement | Admin | Client |
|-----------|-------|--------|
| Devis depuis espace client | Bandeau bleu + email | — |
| Message client | Bandeau + socket | — |
| Réponse admin | — | Email + bandeau + messagerie |

## Flux devis

| Source | Email admin | Plateforme |
|--------|-------------|------------|
| Landing (contact, panier sans compte) | Oui | Non |
| Espace client connecté | Oui | Oui |
