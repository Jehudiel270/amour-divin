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
  { title: "7. Offres payantes", body: "Les offres, prix, durées et conditions de remboursement sont affichés avant chaque achat. Les abonnements sont ponctuels, sans renouvellement automatique, et leur activation dépend d'une confirmation FedaPay vérifiée par le serveur." },
  { title: "8. Suspension et suppression", body: "Les procédures de suspension, de suppression de compte et de conservation des données doivent être consultées dans leur version finale avant l'ouverture publique." },
  { title: "9. Modification des conditions", body: "Les présentes conditions sont un projet et doivent être validées et datées par l'exploitant avant la mise en service publique." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-[var(--color-midnight)] mb-2">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-slate-400 mb-10">Projet en cours de validation juridique; ne constitue pas encore les conditions finales du service.</p>
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
