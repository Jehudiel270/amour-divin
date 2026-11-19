# Amour Divin

Plateforme de rencontres sérieuses pour les membres de l'église Amour Divin. Le dépôt contient une interface Next.js et les parcours métier connectés à Neon, Cloudinary, Neon Auth et FedaPay.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Neon Postgres avec Drizzle ORM et migrations SQL
- Neon Managed Better Auth pour les comptes et sessions
- Cloudinary pour les photos de profil
- FedaPay REST API pour Premium XOF (paiement ponctuel de 30 jours)

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
- FedaPay : `FEDAPAY_ENVIRONMENT`, `FEDAPAY_SECRET_KEY`, `FEDAPAY_LIVE_SECRET_KEY`, `FEDAPAY_PUBLIC_KEY`, `FEDAPAY_LIVE_PUBLIC_KEY`, `FEDAPAY_WEBHOOK_SECRET`, `PREMIUM_30D_PRICE_XOF`
- Identité : `NEXT_PUBLIC_CHURCH_NAME`, `SUPER_ADMIN_EMAIL`, `NEXT_PUBLIC_APP_URL`
- Configuration produit : `PREMIUM_30D_PRICE_XOF`, `NEXT_PUBLIC_APP_URL`

Neon Managed Better Auth doit être activé dans la console Neon. Brevo SMTP est configuré localement dans `.env.local` pour l'envoi applicatif via `npm run mail:test`; le fournisseur d'e-mails utilisé par les liens de vérification/réinitialisation Neon doit être configuré séparément dans Neon Auth.

Le preset Cloudinary `eglise_amour_divin_profiles_signed` est **signé**, limité aux formats JPEG/PNG/WebP, avec modération manuelle et dossier `eglise-amour-divin/profiles`. L'interface TOTP est intégrée; son activation effective doit être vérifiée dans le compte Neon Auth configuré.
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

Le checkout et le webhook sont en mode configuré par `FEDAPAY_ENVIRONMENT`; gardez `sandbox` jusqu'aux tests de bout en bout. Le prix Premium vient de `PREMIUM_30D_PRICE_XOF`. L'accès est accordé uniquement après vérification serveur du statut de transaction. Le plan actuel est un paiement ponctuel de 30 jours, sans renouvellement automatique.

Dans FedaPay, configurez le webhook sur `/api/webhooks/fedapay` et copiez son secret dans `FEDAPAY_WEBHOOK_SECRET`. L'intégration utilise les clés live uniquement si `FEDAPAY_ENVIRONMENT=live`; gardez `sandbox` pendant les tests. Définissez `PREMIUM_30D_PRICE_XOF` avant d'activer l'offre.

## Contrôles

```bash
npm run lint
npm run build
npm run db:generate
npm audit
```

Le plan de travail par vagues, les tâches restantes et leurs critères de sortie sont centralisés dans [TODO.md](TODO.md).
