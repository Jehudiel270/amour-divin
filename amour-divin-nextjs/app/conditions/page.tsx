import type { Metadata } from "next";

import Footer from "@/components/shared/footer";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

const SECTIONS = [
  { title: "1. Acceptation des conditions", body: "En créant un compte sur AD, vous acceptez sans réserve les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme." },
  { title: "2. Éligibilité", body: "AD est strictement réservé aux personnes âgées de 18 ans et plus. Toute inscription par une personne mineure est interdite et entraînera la suppression immédiate du compte concerné." },
  { title: "3. Compte et sécurité", body: "Vous êtes responsable de la confidentialité de vos identifiants de connexion. Vous vous engagez à fournir des informations exactes et à ne pas usurper l'identité d'un tiers." },
  { title: "4. Comportement attendu", body: "Les membres s'engagent à interagir avec respect et bienveillance. Le harcèlement, les propos haineux, discriminatoires ou à caractère sexuel non sollicité sont strictement interdits." },
  { title: "5. Contenu publié", body: "Vous êtes seul responsable des photos, textes et informations que vous publiez sur votre profil. Il est interdit de publier du contenu appartenant à des tiers sans autorisation." },
  { title: "6. Signalement et modération", body: "AD se réserve le droit d'examiner tout signalement et de suspendre ou supprimer un compte en cas de non-respect des présentes conditions." },
  { title: "7. Abonnement Premium", body: "L'abonnement Premium est facturé selon la formule choisie et peut être résilié à tout moment depuis les réglages, sans engagement de durée." },
  { title: "8. Résiliation", body: "Vous pouvez supprimer votre compte à tout moment. AD peut également résilier l'accès d'un membre en cas de violation des présentes conditions." },
  { title: "9. Modification des conditions", body: "AD peut modifier ces conditions à tout moment. Les membres seront informés de toute modification substantielle par notification ou e-mail." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-[var(--color-midnight)] mb-2">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-slate-400 mb-10">Dernière mise à jour : janvier 2025</p>
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-semibold text-[var(--color-midnight)] mb-2">{s.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
