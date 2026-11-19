CREATE TABLE "subscription_plans" (
	"code" varchar(40) PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(240) DEFAULT '' NOT NULL,
	"amount_xof" integer NOT NULL,
	"duration_days" integer NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_plans_amount_check" CHECK ("subscription_plans"."amount_xof" >= 100),
	CONSTRAINT "subscription_plans_duration_check" CHECK ("subscription_plans"."duration_days" > 0)
);

INSERT INTO "subscription_plans" ("code", "name", "description", "amount_xof", "duration_days", "features", "active", "sort_order") VALUES
	('premium-7d', 'Essentiel', 'Une semaine pour découvrir toutes les fonctions Premium.', 2500, 7, '["Demandes illimitées","Filtres de recherche avancés","Mise en avant du profil"]'::jsonb, true, 1),
	('premium-30d', 'Premium', 'Un mois complet pour construire des connexions sincères.', 6900, 30, '["Demandes illimitées","Voir qui a consulté votre profil","Mise en avant du profil","Filtres de recherche avancés"]'::jsonb, true, 2),
	('premium-90d', 'Premium Sérénité', 'Trois mois pour prendre le temps de rencontrer.', 15900, 90, '["Tous les avantages Premium","Mise en avant renforcée","Priorité dans les résultats","Filtres de recherche avancés"]'::jsonb, true, 3);
