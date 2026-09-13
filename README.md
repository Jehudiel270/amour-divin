# Amour Divin (AD) — Rencontres sérieuses entre jeunes chrétiens

Projet Next.js (App Router) généré à partir de l'export Figma Make
« Application de rencontres AD.zip », porté fidèlement en TypeScript.

> ⚠️ Plateforme réservée aux personnes de **18 ans et plus**. Toutes les données
> (profils, messages, utilisateurs admin, signalements) sont **fictives**. Aucune
> base de données ni authentification réelle n'est branchée (voir `lib/auth-context.tsx`).

## Stack technique

- **Next.js 15** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS v4** (thème via `@theme` dans `app/globals.css`)
- **shadcn/ui** : primitives disponibles dans `components/ui/` (button, input, card,
  dialog, tabs, select, switch, label, separator, skeleton, badge, textarea).
  Les pages elles-mêmes reprennent le style Tailwind + variables CSS (`var(--color-x)`)
  de l'export Figma Make à l'identique, pour respecter fidèlement le design fourni.
- **lucide-react** pour les icônes

## Ce qui a changé par rapport à l'export Figma Make

L'export original utilisait **react-router-dom** (SPA Vite). Conversion effectuée :

| Original (react-router-dom) | Next.js App Router |
|---|---|
| `pages/*.tsx` + `<Routes>` dans `App.tsx` | un dossier par route sous `app/`, avec `page.tsx` |
| `<Link to="...">` | `<Link href="...">` (`next/link`) |
| `useNavigate()` / `navigate(x)` | `useRouter()` / `router.push(x)` (`next/navigation`) |
| `useParams()` | `useParams()` (`next/navigation`, mêmes noms) |
| `useLocation()` | `usePathname()` (`next/navigation`) |
| `useState(isLoggedIn)` dans `App.tsx` | `AuthProvider` / `useAuth()` (`lib/auth-context.tsx`) |
| Un seul `<Navbar isLoggedIn .../>` monté une fois | `<Navbar />` dans `app/layout.tsx`, lit le contexte |

Le contenu, les textes, la palette de couleurs, les composants (Navbar, Footer,
ProfileCard) et les 26 fichiers sources ont été repris **sans suppression ni
simplification** — les 25 routes demandées sont toutes présentes (`Home` sert la
route `/`).

## Structure du projet

```
amour-divin-nextjs/
├── app/
│   ├── layout.tsx              # AuthProvider + Navbar globale
│   ├── globals.css             # Thème Tailwind v4 (palette Amour Divin)
│   ├── page.tsx                 # /
│   ├── a-propos/                # /a-propos
│   ├── comment-ca-marche/       # /comment-ca-marche
│   ├── securite/                # /securite
│   ├── inscription/             # /inscription
│   ├── connexion/                # /connexion
│   ├── mot-de-passe-oublie/     # /mot-de-passe-oublie
│   ├── creation-profil/         # /creation-profil (assistant 6 étapes)
│   ├── decouvrir/               # /decouvrir
│   ├── profil/[id]/             # /profil/[id] (route dynamique)
│   ├── favoris/                 # /favoris
│   ├── demandes/                # /demandes (onglets reçues/envoyées)
│   ├── matchs/                  # /matchs
│   ├── messages/                # /messages
│   ├── notifications/           # /notifications
│   ├── reglages/                # /reglages (6 sections)
│   ├── signaler/                # /signaler
│   ├── faq/                     # /faq
│   ├── contact/                 # /contact
│   ├── conditions/              # /conditions
│   ├── confidentialite/         # /confidentialite
│   └── admin/                   # back-office (layout latéral dédié)
│       ├── page.tsx             # /admin
│       ├── utilisateurs/        # /admin/utilisateurs
│       ├── signalements/        # /admin/signalements
│       └── verifications/       # /admin/verifications
├── components/
│   ├── ui/          # Primitives shadcn/ui disponibles
│   ├── layout/       # admin-layout.tsx (layout latéral admin)
│   └── shared/       # navbar.tsx, footer.tsx, profile-card.tsx
├── data/              # Données fictives typées (profils, messages, notifications, admin)
├── lib/               # utils.ts (cn) + auth-context.tsx (contexte isLoggedIn)
├── types/index.ts     # Types TypeScript centraux
└── ...configs (tsconfig, next.config, postcss, eslint, components.json)
```

## Routes couvertes (25/25)

`/`, `/a-propos`, `/comment-ca-marche`, `/securite`, `/inscription`, `/connexion`,
`/mot-de-passe-oublie`, `/creation-profil`, `/decouvrir`, `/profil/[id]`, `/favoris`,
`/demandes`, `/matchs`, `/messages`, `/notifications`, `/reglages`, `/signaler`,
`/faq`, `/contact`, `/conditions`, `/confidentialite`, `/admin`, `/admin/utilisateurs`,
`/admin/signalements`, `/admin/verifications`.

## Préparation base de données / authentification

- `lib/auth-context.tsx` : contexte React (`isLoggedIn` / `setLoggedIn`) qui simule une
  session. À remplacer par une vraie solution (Auth.js/NextAuth recommandé) connectée
  à une base de données.
- `data/*.ts` : à remplacer progressivement par des requêtes à la base de données ;
  les types de `types/index.ts` peuvent rester inchangés.

## Installation

```bash
# 1. Décompresser le zip puis se placer dans le dossier du projet
cd amour-divin-nextjs

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur **http://localhost:3000**.

### Autres commandes utiles

```bash
npm run build   # Build de production
npm run start   # Démarrer le build de production
npm run lint    # Vérifier le code avec ESLint
```

## Notes importantes

- Aucune donnée personnelle réelle : tous les profils, messages, utilisateurs admin
  et signalements sont fictifs (`data/*.ts`).
- Les photos proviennent d'Unsplash (usage éditorial de démonstration).
- Le service est explicitement réservé aux 18 ans et plus (page d'accueil, formulaire
  d'inscription, pied de page).
- Mon environnement de build n'a pas d'accès réseau (registre npm bloqué en sandbox),
  donc `npm install` / `next build` n'ont pas pu être exécutés ici. Une revue statique
  complète a été faite à la place (imports, TS, classes Tailwind, équilibre syntaxique).
  Lancez `npm run build` en premier réflexe chez vous pour confirmer.
