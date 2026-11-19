# Amour Divin - plan de livraison

> Plan de pilotage unique. Etat au 19 novembre 2026 : Next.js 16 compilé, migrations Neon appliquées, Cloudinary configuré, rôles super-admin/admin, tarifs Premium administrables, interface TOTP et parcours principaux intégrés. Les tests réels Neon Auth/TOTP, Cloudinary et FedaPay restent à exécuter.
> `.env.local` contient les services deja configurés; restees vides dans `.env.example` pour le suivi Git. Brevo SMTP est testé localement et Brevo doit encore être relié aux liens Neon Auth. Les items **[CLES]** nécessitent des tests externes, le prix, les emails, les webhooks ou la mise en production.

## Objectif produit

Construire une plateforme de rencontres serieuses entre adultes chretiens avec comptes prives, profils moderes, decouverte, demandes mutuelles, conversations, signalements et option Premium. Les informations religieuses et les photos de profil sont sensibles : collecte minimale, visibilite controlee, suppression/export et moderation sont des pre-requis avant l'ouverture publique.

### MVP

- Un pays et une zone de lancement explicitement choisis; pages publiques coherentes avec cette disponibilite.
- Inscription email/mot de passe, verification email, connexion, reinitialisation, deconnexion et session persistante via Neon Managed Better Auth.
- Validation de l'age de 18 ans ou plus cote serveur; profil persistant et photos Cloudinary; moderation avant publication.
- Decouverte paginee et filtree, favoris/demandes, acceptation mutuelle et messagerie persistante entre membres connectes.
- Signalement, blocage et back-office protege par role admin.
- Un achat Premium ponctuel a duree fixe via FedaPay, renouvelable manuellement; activation uniquement apres confirmation serveur verifiee. Aucun renouvellement automatique sans validation explicite du prestataire.
- Pages juridiques exactes, tests de parcours essentiels, sauvegardes/observabilite et deploiement reproductible.

### Criteres de sortie MVP

- Aucun secret, faux profil, faux chiffre, faux temoignage ou fausse promesse de securite en production.
- Operations sensibles autorisees cote serveur; les permissions ne dependent jamais du seul navigateur.
- Donnees persistantes, migrations versionnees et procedures de rollback/restauration documentees.
- Paiement sandbox teste avec succes, annulation, echec, doublon webhook et remboursement; aucune activation Premium basee sur le retour navigateur.
- `npm run lint`, `npm run build`, tests automatises et audit de dependances passent.
- Aucun acces membre/admin non autorise; verification des roles et proprietes sur chaque mutation.

## Vague 0 - securite et decisions produit

- [x] Les anciennes valeurs `.env.example` ont ete retirees. Les nouvelles valeurs sont dans `.env.local`; revoquer les anciennes cles historiques chez les fournisseurs reste une action externe.
- [ ] **[CLES]** Finaliser pays de lancement, devise, entite juridique, public cible, emails, tarifs et pages legales.
- [x] Retirer les principaux chiffres/temoignages fictifs de l'accueil et les garanties absolues de securite/moderation.
- [x] Neon est configure via URL Auth, JWKS, URL Postgres et secret cookie. L'inscription, la verification email et les emails externes restent a tester sur le vrai compte.
- [ ] Confirmer pays marchand, moyens de paiement et conditions de retrait FedaPay; choisir paiement Premium a duree fixe ou recurrence confirmee par ecrit.
- [x] Creer `.env.local` avec Neon, Cloudinary, FedaPay sandbox/live, l'église et le super-administrateur; le fichier est ignore par Git.

**Sortie :** decisions consignees, anciennes cles revoquees, promesses publiques non verifiables retirees.

## Vague 1 - donnees et authentification

- [x] Utiliser Neon Postgres + driver serverless pour les requetes applicatives et Neon Managed Better Auth pour l'identite/session; ne pas introduire un second fournisseur d'auth.
- [x] Definir les tables initiales : `profiles`, `profile_preferences`, `profile_photos`, `favorites`, `connection_requests`, `matches`, `conversations`, `conversation_members`, `messages`, `notifications`, `reports`, `blocks`, `subscriptions`, `payments`, `webhook_events`, `admin_actions`, `legal_consents`.
- [x] Concevoir les contraintes FK/unique/check, index et etats de moderation. Les FK vers les tables Managed Better Auth restent a confirmer dans le projet Neon.
- [x] Generer les migrations SQL versionnees; `npm run db:generate` fonctionne sans connexion distante.
- [x] Creer le client Neon serverless cote serveur, schemas Zod et acces donnees server-only.
- [ ] Activer/configurer `@neon/auth` dans la console (URL Auth, verification email, envoi/reset email), puis executer les parcours sur le vrai service.
- [x] Supprimer `lib/auth-context.tsx` simule et connecter inscription/connexion/deconnexion/reset avec controle 18+ et consentements versionnes.
- [x] Ajouter protection middleware membres et verification admin cote serveur; la revue des permissions par endpoint et les tests restent a faire.
- [x] Ajouter tests locaux de signature FedaPay (corps, timestamp, en-tete invalides).
- [ ] Ajouter tests migration, validation serveur, session absente/valide et acces cross-user refuse.

**Sortie :** un membre peut s'inscrire, confirmer son adresse, se connecter, retrouver sa session; les API privees refusent une session absente.

## Vague 2 - profils, images et decouverte

- [x] Definir le profil persistant avec date de naissance, ville, bio, valeurs, preferences, statuts et consentements.
- [x] Rendre creation/reprise du brouillon persistante et valider l'age cote serveur.
- [x] Implementer signatures Cloudinary authentifiees, dossier par membre, photo max 5 Mo cote interface et six emplacements; le preset signe restreint doit etre configure dans Cloudinary.
- [x] Stocker `public_id`, URL HTTPS, ordre et statut; supprimer l'asset lors du retrait individuel.
- [x] Mettre en place la file admin de moderation; decouverte et profils publics exigent statut actif et photo approuvee.
- [x] Implementer API de decouverte avec filtres valides, limite et champs publics sans date de naissance exacte.
- [ ] Retirer les profils de demonstration de toutes les pages marketing/anciennes vues et migrer les derniers ecrans non MVP.
- [ ] Optimiser affichage/alt/images et definir les regles de diffusion Cloudinary.

**Sortie :** un profil reel se cree, se modere, se publie, se filtre et se supprime; aucune donnee de demo en production.

## Vague 3 - interactions et confiance

- [x] Implementer favoris idempotents, demandes uniques actives, acceptation/refus/retrait, match et conversation apres acceptation.
- [x] Stocker messages, limiter a 4 000 caracteres, verifier participants, paginer a 50 et gerer lecture/non lu.
- [x] Stocker notifications et etat lu/non lu; les alertes dans l'app fonctionnent, emails opt-in restent a faire.
- [x] Implementer signalements et blocage; un blocage empeche l'envoi de messages et demandes.
- [x] Proteger `/admin/*` cote serveur, utiliser le role `admin`, journaliser decisions de moderation.
- [ ] Ajouter rate limiting et protections contre scraping, spam, enumeration email et creation abusive de comptes.
- [ ] Tester concurrence, doublons, utilisateurs bloques/suspendus et demandes croisees.

**Sortie :** les interactions multi-comptes sont persistantes, autorisees et moderables; les acces negatifs ont des tests.

## Vague 4 - Cloudinary production

- [x] Cloudinary est configure avec le cloud `dmnhxis9e`, les dossiers `eglise-amour-divin/*` et le preset signe `eglise_amour_divin_profiles_signed`. L'upload reel reste a tester.
- [x] Le preset signe limite JPEG/PNG/WebP, 5 Mo cote client et folder Cloudinary par membre.
- [x] Ajouter `/api/profile/photos/signature`, authentifie, dossier unique par membre; confirmation verifiee et suppression proprietaire.
- [x] Ajouter upload front, indicateur d'envoi, six emplacements, remplacement et moderation avant affichage; reordonner les photos reste a finir.
- [ ] Verifier signatures/reponses upload, URLs HTTPS, nettoyage des uploads abandonnes et quotas Cloudinary **[CLES]**.

**Sortie :** un membre ne peut televerser/modifier que ses photos; formats et volumes sont limites et les photos sont moderees.

## Vague 5 - FedaPay et Premium

- [ ] Valider en production les tarifs initiaux: 2 500 XOF (7 jours), 6 900 XOF (30 jours) et 15 900 XOF (90 jours); ils restent modifiables depuis `/admin/tarifs`.
- [ ] Confirmer pays marchand, politique remboursement/annulation et avantages; tester FedaPay sandbox puis enregistrer le webhook live.
- [x] FedaPay sandbox/live est configure avec des cles distinctes dans `.env.local`; l'environnement reste sandbox. Les prix sont persistés en base dans `subscription_plans`.
- [x] Creer `POST /api/billing/checkout` avec utilisateur, plan allowlist serveur, montant serveur, paiement pending, reference unique et metadata.
- [x] Creer transaction/lien FedaPay cote serveur via REST native et ne jamais accepter de montant/statut navigateur.
- [x] Creer `/api/webhooks/fedapay` avec HMAC-SHA256, timestamp 5 minutes, comparaison constante, deduplication et transition compare-and-set.
- [x] Au retour utilisateur, re-verifier le statut via l'API FedaPay et ne pas faire confiance aux parametres URL.
- [x] Gerer activation, expiration selon la durée du plan choisi, annulation/refund et journal d'evenements; aucune recurrence auto.
- [x] Tester localement la signature webhook validee, le corps modifie, l'horodatage expire et l'entete malformee (`npm test`).
- [ ] Tester sandbox : paiement reel de test, montant/devise, transaction inconnue, webhook rejoue et remboursement **[CLES]**.
- [ ] Passer live seulement apres KYC/KYB, domaine Checkout autorise si necessaire, CGV et politique de remboursement publiees.

**Sortie :** Premium ne s'active que sur confirmation serveur; un evenement repete ne double pas l'acces.

## Vague 6 - conformite et qualite de service

- [ ] Implémenter suppression réelle du compte, export, rectification et préférences persistantes de visibilité/notifications; connexion, session, reset mot de passe et interface TOTP existent.
- [ ] Faire valider les conditions, politique donnees/cookies, sous-traitants, conservation, consentement explicite et obligations des pays servis.
- [ ] Aligner FAQ/securite sur les pratiques reelles; definir canal de signalement et processus d'urgence realiste.
- [ ] Ajouter emails transactionnels (confirmation, reset, alertes de securite, recus), DNS expediteur et tests de delivrabilite.
- [ ] Ajouter logs sans donnees sensibles, surveillance erreurs, alertes paiement, sauvegardes Neon et exercice de restauration.
- [ ] Optimiser les balises image qui restent et ajouter tests API/Playwright pour inscription, decouverte, match, messagerie, report et Premium.
- [ ] Verifier responsive, accessibilite, performances mobiles et chargement d'images.

**Sortie :** les pages publiques decrivent exactement le service et les demandes utilisateurs/securite sont executables.

## Vague 7 - lancement controle et projet complet

- [ ] **[CLES]** Deployer staging et production avec secrets par environnement, HTTPS, migrations controlees et rollback.
- [ ] Effectuer tests d'autorisation, charge modeste, paiement reel de faible montant puis remboursement; documenter la procedure d'incident.
- [ ] Lancer une beta fermee sur une zone, mesurer activation, profils completes, reponses, signalements, conversion Premium et churn.
- [ ] Ajuster limites gratuites, prix et avantages avec les donnees d'usage; proscrire dark patterns et vente de donnees personnelles.
- [ ] Apres MVP : matching personnalise explicable, recherche geographique, presence/realtime, messagerie enrichie, outils de moderation/anti-fraude, abonnements recurrents si confirmes, evenements/communautes, langues supplementaires et analytics respectueux de la vie privee.
- [ ] Revoir l'ensemble du front apres stabilisation Neon/Cloudinary/FedaPay : finaliser le design responsive, remplacer les images restantes, harmoniser chargements/erreurs/etats vides et auditer l'accessibilite.

**Sortie :** lancement progressif avec support, observabilite, equipe de moderation et indicateurs de sante produit.

## Variables de configuration

Les noms de `.env.example` sont un contrat de configuration, pas des identifiants fonctionnels.

- Neon Postgres : `DATABASE_URL`
- Neon Managed Better Auth : `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEON_JWKS_URL`
- Cloudinary : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
- FedaPay : `FEDAPAY_ENVIRONMENT`, `FEDAPAY_SECRET_KEY`, `FEDAPAY_LIVE_SECRET_KEY` (si passage en live), `FEDAPAY_WEBHOOK_SECRET`
- Application : `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CHURCH_NAME`, `SUPER_ADMIN_EMAIL`

Ne pas basculer FedaPay en live ni lancer des paiements réels avant validation des prix depuis `/admin/tarifs`, du webhook sandbox/live, du domaine, du KYC/KYB et des CGV. Les migrations SQL sont déjà appliquées à Neon.
