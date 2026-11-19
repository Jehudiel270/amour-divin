# Amour Divin

Plateforme de rencontres sérieuses pour les membres de l'église Amour Divin. Le dépôt contient une interface Next.js et les parcours métier connectés à Neon, Cloudinary, Neon Auth et FedaPay.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Neon Postgres avec Drizzle ORM et migrations SQL
- Neon Managed Better Auth pour les comptes et sessions
- Cloudinary pour les photos de profil
- FedaPay REST API pour Premium XOF (paiement ponctuel selon le plan choisi)

## Démarrage local

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:3000`. Sans identifiants, les pages publiques s'affichent; les parcours backend retournent une erreur de configuration explicite.

## Configuration

- `.env.local` existe localement avec les valeurs configurées; `.env.example` décrit les noms de variables sans secret pour les déploiements. Ne jamais commit `.env.local` ni mettre de clé secrète dans une variable `NEXT_PUBLIC_*`.

- Neon : `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEON_JWKS_URL`
- Cloudinary : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
- FedaPay sandbox : `FEDAPAY_ENVIRONMENT=sandbox`, `FEDAPAY_SECRET_KEY`, `FEDAPAY_WEBHOOK_SECRET`
- FedaPay live uniquement après validation : `FEDAPAY_ENVIRONMENT=live`, `FEDAPAY_LIVE_SECRET_KEY`, secret du webhook live
- Identité : `NEXT_PUBLIC_CHURCH_NAME`, `SUPER_ADMIN_EMAIL`, `NEXT_PUBLIC_APP_URL`

Les prix sont stockés dans `subscription_plans` et modifiables depuis `/admin/tarifs`; aucune variable de prix Vercel n'est requise. Neon Managed Better Auth doit être activé dans la console Neon et le domaine Vercel doit être autorisé pour les URL de rappel. Brevo SMTP ne sert actuellement qu'au script de diagnostic `npm run mail:test`; ajouter ses variables à Vercel ne configure pas les e-mails de vérification/réinitialisation Neon. Le fournisseur d'e-mails doit être configuré dans Neon Auth.

### Déploiement Vercel

- Définir **Root Directory** sur `amour-divin-nextjs` (le dépôt Git contient l'application dans ce sous-répertoire).
- Utiliser `npm run build` comme commande de build; ne pas lancer les migrations au moment du build.
- Ajouter à Vercel les variables Neon, Cloudinary et identité listées ci-dessus, avec des valeurs de production.
- Garder `FEDAPAY_ENVIRONMENT=sandbox` et définir le secret webhook sandbox avant le test de paiement. Enregistrer l'URL webhook `https://<domaine-vercel>/api/webhooks/fedapay` dans FedaPay.
- Définir `NEXT_PUBLIC_APP_URL` sur l'URL HTTPS exacte de production; elle est utilisée pour le retour de paiement.
- Vérifier que `DATABASE_URL` pointe vers la base Neon ayant reçu les migrations. Si Vercel utilise une autre base, exécuter `npm run db:migrate` manuellement contre cette base avant ouverture.
- Configurer aussi le fournisseur d'e-mails et le domaine de rappel dans Neon Auth. Les seules variables Brevo ne branchent pas Neon Auth à SMTP.

Le preset Cloudinary `eglise_amour_divin_profiles_signed` est **signé**, limité aux formats JPEG/PNG/WebP, avec modération manuelle et dossier `eglise-amour-divin/profiles`. Le client Neon Auth installé n'expose pas le plugin TOTP: la double authentification n'est pas active et ne doit pas être annoncée comme une protection disponible.
## Base de données

Le schéma est dans `db/schema.ts`; les migrations générées et versionnées sont dans `drizzle/`.

```bash
npm run db:generate
npm run db:migrate
```

`db:migrate` nécessite `DATABASE_URL`. Les migrations applicatives ont été appliquées au projet Neon configuré dans `.env.local`.

Le premier super administrateur est identifié automatiquement par `SUPER_ADMIN_EMAIL=dossoucarrel@gmail.com`. Il peut depuis `/admin/equipe` nommer des admins ou super-admins et définir les permissions des admins.

Ne publiez jamais de profil réel avant d'avoir choisi votre pays de lancement, finalisé les mentions légales et configuré la modération.

## FedaPay

Le checkout et le webhook sont configurés par `FEDAPAY_ENVIRONMENT`; gardez `sandbox` jusqu'aux tests de bout en bout. Les prix et durées proviennent des plans enregistrés en base (`subscription_plans`). L'accès est accordé uniquement après vérification serveur du statut de transaction. Les abonnements sont des paiements ponctuels, sans renouvellement automatique.

Dans FedaPay, configurez le webhook sur `/api/webhooks/fedapay` et copiez son secret correspondant à l'environnement dans `FEDAPAY_WEBHOOK_SECRET`. L'intégration utilise la clé live uniquement si `FEDAPAY_ENVIRONMENT=live`; gardez `sandbox` pendant les tests. Gérez les offres depuis `/admin/tarifs`.

## Contrôles

```bash
npm run lint
npm run build
npm run db:generate
npm audit
```

Le plan de travail par vagues, les tâches restantes et leurs critères de sortie sont centralisés dans [TODO.md](TODO.md).
