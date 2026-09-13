# Amour Divin — Projet et état actuel

## Contexte
`amour-divin-nextjs` est une application Next.js 15 (App Router) pour une plateforme de rencontres sérieuses entre jeunes chrétiens. L'app est un prototype fonctionnel avec 25+ routes et un design fidèle à une maquette Figma, mais la plupart des données et de l'authentification sont encore simulées.

## Objectif du projet
- Créer une expérience de rencontres chrétiennes sérieuses
- Offrir un espace public, un espace membre et un back-office admin
- Préparer l'app à être branchée sur une vraie base de données et un système d'authentification
- Ajouter à terme des services payants et un workflow de paiement sécurisé

## Architecture actuelle
- Frontend : Next.js 15, React 19, TypeScript
- Styles : Tailwind CSS v4, variables CSS et shadcn/ui
- Composants : `components/shared`, `components/layout`, `components/ui`
- Données : contenus fictifs dans `data/` (`profiles.ts`, `messages.ts`, `notifications.ts`, `admin.ts`)
- Authentification : simulation via `lib/auth-context.tsx`
- Routes : pages publiques, espace utilisateur, dashboard admin
- Environnement : `.env.example` déjà rempli avec des clés de test Supabase et FedaPay

## Structure principale
- `app/` : routes et layouts
- `components/` : composants partagés et layout admin
- `data/` : données fictives et utilitaires
- `lib/` : contexte d'authentification et utilitaires
- `types/` : définitions TypeScript centrales
- `package.json` : dépendances du projet

## Routes couvertes
- Public : `/`, `/a-propos`, `/comment-ca-marche`, `/securite`, `/conditions`, `/confidentialite`, `/faq`, `/contact`
- Auth : `/connexion`, `/inscription`, `/mot-de-passe-oublie`
- Espace membre : `/creation-profil`, `/decouvrir`, `/profil/[id]`, `/favoris`, `/demandes`, `/matchs`, `/messages`, `/notifications`, `/reglages`, `/signaler`
- Admin : `/admin`, `/admin/utilisateurs`, `/admin/signalements`, `/admin/verifications`

## Points importants à connaître
- `lib/auth-context.tsx` gère uniquement un état `isLoggedIn` en mémoire.
- Les pages `/connexion` et `/inscription` valident localement puis basculent l'utilisateur connecté.
- Les données sont générées localement depuis `data/*.ts` : aucun backend connecté.
- `@prisma/client` est déjà présent dans `package.json`, mais `prisma` (dev) n'est pas encore déclaré et aucun `schema.prisma` n'existe.
- `zod` est déjà installé, ce qui est utile pour la validation future des formulaires et des APIs.
- `ad-nextjs` a été supprimé, donc le workspace contient désormais uniquement le projet principal et `mon-app`.

## Environnement prepare
Le fichier `.env.example` inclut maintenant :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY`
- `FEDAPAY_SECRET_KEY`

> Copie ces valeurs dans `.env.local` pour un usage local. Ne commit jamais de véritables secrets.

## Dépendances clés
- `next`, `react`, `react-dom`
- `@prisma/client`
- `zod`
- `framer-motion`
- `@radix-ui/react-*`
- `class-variance-authority`, `clsx`, `tailwind-merge`

## Ce qui fonctionne déjà
- Navigation complète entre toutes les pages
- Inscription / connexion simulées
- Recherche et filtres du catalogue de profils
- Page de profil avec actions de favori, demande, signalement
- Messages avec conversation fictive
- Dashboard admin et vues de signalements/utilisateurs
- Formulaire de création de profil en assistant multi-étapes

## Ce qui reste à faire
- Brancher une vraie base de données
- Implémenter une authentification réelle
- Remplacer les données fictives par des requêtes backend
- Ajouter un service de paiement / Cloudinary pour les photos
- Valider les formulaires côté serveur
- Ajouter la gestion des sessions et du rôle admin
