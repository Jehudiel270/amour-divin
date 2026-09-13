# État du projet — amour-divin-nextjs

Date: 2026-07-27

## Résumé actuel
- Next.js app présente dans `amour-divin-nextjs`.
- `npm install` a été exécuté dans le dossier; les dépendances listées dans `package.json` sont installées dans `node_modules`.

## Dépendances installées (extrait de `package.json`)
- @radix-ui/react-dialog, label, select, separator, slot, switch, tabs
- class-variance-authority
- clsx
- lucide-react
- next (^15.x), react (^19.x), react-dom
- tailwind-merge

DevDependencies principales:
- @eslint/eslintrc, eslint, eslint-config-next
- @tailwindcss/postcss, tailwindcss, tw-animate-css
- typescript, @types/node, @types/react, @types/react-dom

Autres dépendances du repo racine: `@supabase/supabase-js` (utilisé pour l'auth/data).

## Dépendances recommandées et pourquoi
- `@prisma/client` + `prisma` (dev) — ORM léger, migrations et typage DB; utile si tu veux gérer une base PostgreSQL (recommandé pour les opérations serveur et les relations complexes).
- `framer-motion` — animations et transitions fluides dans Next.js (si tu veux animations modernes). Si tu fais des prototypes Framer, ajouter `framer` peut aider.
- `dotenv` (optionnel) — utile pour scripts Node hors Next (Next charge `process.env` automatiquement en dev via `.env.local`).
- `zod` — validation et schémas (recommandé pour valider les données côté serveur/API).
- `@types/framer-motion` (si nécessaire)

## Commandes d'installation suggérées
Se placer dans `d:\Programmation 2.0\AD\Projet-AD\amour-divin-nextjs` puis:

```bash
npm install framer-motion @prisma/client zod
npm install -D prisma
```

Après installation de Prisma, initialiser:

```bash
npx prisma init
# mettre DATABASE_URL dans .env.local
npx prisma migrate dev --name init
npx prisma generate
```

## `.env`
J'ai créé `.env.example` à la racine du projet. Pour le moment, le projet est un front-end Next.js avec authentification simulée et données fictives.

Si tu ajoutes un vrai backend plus tard, voici des variables utiles à définir dans `.env.local` :
- `DATABASE_URL` pour une base PostgreSQL
- `NEXTAUTH_URL` pour NextAuth / Auth.js
- `NEXT_PUBLIC_SITE_URL` pour les URL publiques
- `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` si tu utilises Supabase
- `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY` / `FEDAPAY_SECRET_KEY` si tu utilises un prestataire de paiement

## Services payants que l'application peut proposer
Ce projet est une application de rencontres chrétiennes. Voici des modèles de monétisation adaptés :
- Abonnement Premium : accès à des fonctions avancées comme messages illimités, filtres avancés, voir qui a aimé votre profil, et recherche prioritaire.
- Boost de profil : paiement unique pour mettre son profil en avant dans la page `Découvrir` pendant une durée limitée.
- Vérification prioritaire : service payant pour obtenir un badge « Profil vérifié » plus rapidement.
- Pack de crédits / super likes : crédits pour envoyer des mises en avant de messages ou des cœurs spéciaux.
- Accès à des fonctionnalités premium : mode incognito, suppression de publicités, suggestions personnalisées, ou algorithme de matching amélioré.
- Assistance prioritaire / coaching de profil : service additionnel pour aider les membres à améliorer leur profil et leurs messages.

## Prochaines étapes recommandées
1. Confirmer si tu veux rester sur un prototype front-end ou ajouter une vraie base de données et authentification.
2. Installer `framer-motion` si tu veux ajouter des animations et transitions plus fluides.
3. Installer `prisma` uniquement si tu ajoutes un backend et que tu veux gérer une base de données SQL proprement.
4. Ajouter `next-auth` / `@auth/core` ou `@supabase/supabase-js` selon le backend choisi.
5. Ajouter des tests et des validations de formulaire avec `react-hook-form` + `zod` si tu veux renforcer l’onboarding.

## Notes utiles
- Ne commite jamais les clés réelles dans le repo.
- Pour tester localement: `npm run dev` (Next.js) — l'app écoute sur `http://localhost:3000`.

---

Si tu veux, je peux maintenant:
- récupérer les clés (tu me les fournis ici? attention aux secrets),
- exécuter l'installation de `framer-motion` et `prisma` et initialiser Prisma,
- ou générer le `schema.prisma` de base si tu me donnes le schéma souhaité.
