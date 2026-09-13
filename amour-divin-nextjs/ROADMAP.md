# Roadmap de finitions et améliorations

## Objectif général
Finaliser l'application `amour-divin-nextjs` en transformant le prototype actuel en une application fonctionnelle et sécurisée.

## Étape 1 — Brancher l'authentification et la base de données
1. Choisir une solution d'authentification :
   - Supabase Auth + Supabase Database
   - ou NextAuth / Auth.js avec une base PostgreSQL
2. Installer et configurer Prisma si tu veux une base SQL :
   - `npm install -D prisma`
   - `npx prisma init`
   - créer `schema.prisma`
   - définir `DATABASE_URL` dans `.env.local`
   - `npx prisma migrate dev --name init`
   - `npx prisma generate`
3. Remplacer `lib/auth-context.tsx` par une vraie implémentation d'authentification.
4. Modifier les pages `/connexion`, `/inscription`, `/reglages`, et `/creation-profil` pour appeler les APIs réelles.
5. Ajouter une validation de token et gestion de session côté serveur.

## Étape 2 — Structurer les données réelles
1. Définir les modèles principaux : `User`, `Profile`, `Message`, `Notification`, `Report`, `Like`, `Subscription`, `Photo`, `Preference`, `AdminAction`.
2. Migrer les données de `data/*.ts` vers la base de données.
3. Créer des APIs internes (`app/api/*` ou `src/app/api/*`) pour :
   - récupérer les profils
   - rechercher et filtrer
   - envoyer des messages
   - ajouter/retirer un favori
   - signaler un profil
   - récupérer les notifications
4. Utiliser `zod` pour valider les entrées des API routes et des formulaires.

## Étape 3 — Intégrer Cloudinary / stockage de photos
1. Installer la librairie Cloudinary ou utiliser l’API REST de Cloudinary.
2. Ajouter des variables d'environnement :
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Permettre l'upload d'images depuis le frontend vers un endpoint sécurisé.
4. Stocker les URL de photos dans la base de données plutôt que `unsplashUrl()`.
5. Ajouter un gestionnaire de photos dans le profil (upload, suppression, sélection photo principale).

## Étape 4 — Brancher le paiement FedaPay
1. Créer un endpoint backend sécurisé pour les paiements.
2. Utiliser `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY` coté client et `FEDAPAY_SECRET_KEY` côté serveur.
3. Prévoir des produits / offres : abonnement premium, boost de profil, vérification prioritaire.
4. Ajouter une page ou un composant de paiement dans l'espace utilisateur.
5. Stocker le statut de paiement et l'accès premium dans la base de données.

## Étape 5 — Améliorations UX / sécurité
1. Renforcer la gestion des sessions : redirection automatique si utilisateur non connecté.
2. Protéger les routes sensibles (`/decouvrir`, `/messages`, `/admin/*`) avec `middleware` ou checks côté serveur.
3. Ajouter des notifications réelles générées par le backend.
4. Ajouter des composants `Skeleton` / chargement sur toutes les pages de données.
5. Vérifier l'accessibilité et les contrastes de couleur.
6. Ajouter un système de pagination ou de scroll infini sur `/decouvrir`.

## Corrections et points techniques prioritaires
- Supprimer ou nettoyer le dossier `.next/` du repo si nécessaire.
- Vérifier l'usage `@prisma/client` : soit ajouter `prisma` en devDependency, soit retirer `@prisma/client` si tu n'utilises pas Prisma.
- Vérifier que `zod` est bien utilisé dans le code si tu l'as installé.
- Renommer `auth-context` si besoin pour clarifier (`auth-provider`, `auth-session`).
- Vérifier les imports `src/` et alias `@/` dans `tsconfig.json`.
- Ajouter des tests unitaires pour les composants critiques et les utilitaires.

## Suggestions produit
- Ajouter un onboarding plus simple : formulaire d'existence + profil en moins d'étapes.
- Ajouter un filtre de compatibilité basé sur les valeurs de foi.
- Ajouter un «Boost profil» payant pour mettre en avant un profil.
- Ajouter un badge de vérification manuelle avec un processus d'examen.
- Ajouter un système de messagerie avec statut lu/non lu et notifications en temps réel.

## Priorités immédiates
1. Authentification réelle + gestion de sessions
2. Base de données et modèles utilisateurs
3. Endpoint API pour profils/messages/favoris
4. Stockage d’images Cloudinary
5. Paiement FedaPay

## Résultat attendu
À la fin, l'app doit être :
- utilisable avec vrais comptes
- connectée à une base de données
- capable de gérer des conversations et signalements
- sécurisée pour les routes privées
- prête à vendre un abonnement ou une offre premium
