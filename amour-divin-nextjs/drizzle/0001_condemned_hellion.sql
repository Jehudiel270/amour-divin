CREATE TABLE "legal_consents" (
	"user_id" text NOT NULL,
	"consent_type" varchar(32) NOT NULL,
	"document_version" varchar(32) NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "legal_consents_user_id_consent_type_document_version_pk" PRIMARY KEY("user_id","consent_type","document_version"),
	CONSTRAINT "legal_consents_type_check" CHECK ("legal_consents"."consent_type" IN ('terms', 'privacy'))
);
