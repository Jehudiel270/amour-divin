import type { Metadata } from "next";

import Footer from "@/components/shared/footer";

export const metadata: Metadata = { title: "Politique de confidentialité" };

const SECTIONS = [
  { title: "1. Données collectées", body: "Nous collectons les informations que vous fournissez lors de votre inscription (prénom, e-mail, date de naissance) ainsi que les informations de votre profil (photos, ville, centres d'intérêt, préférences)." },
  { title: "2. Utilisation des données", body: "Vos données sont utilisées pour vous proposer des profils compatibles, sécuriser votre compte, assurer la modération de la plateforme et améliorer nos services." },
  { title: "3. Partage des données", body: "AD ne vend jamais vos données personnelles à des tiers. Certaines informations de votre profil sont visibles par les autres membres de la plateforme." },
  { title: "4. Conservation", body: "Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont supprimées ou anonymisées dans un délai raisonnable." },
  { title: "5. Vos droits", body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données, exerçable depuis Réglages > Confidentialité." },
  { title: "6. Sécurité", body: "Nous mettons en œuvre des mesures techniques et organisationnelles (chiffrement SSL) pour protéger vos données contre tout accès non autorisé." },
  { title: "7. Cookies", body: "AD utilise des cookies strictement nécessaires au fonctionnement du service. Aucun cookie publicitaire tiers n'est utilisé." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-[var(--color-midnight)] mb-2">Politique de confidentialité</h1>
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
