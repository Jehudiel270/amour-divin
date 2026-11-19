import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Shield, Star, Users, ArrowRight } from "lucide-react";

import Footer from "@/components/shared/footer";

export const metadata: Metadata = { title: "À propos" };

const VALUES = [
  {
    icon: <Heart size={32} />,
    title: "Foi & Spiritualité",
    desc: "La relation avec Dieu est au centre de tout. Chez AD, nous croyons que la foi partagée est le socle le plus solide sur lequel une relation peut reposer. Chaque membre est invité à partager ouvertement sa communauté de foi et ses convictions.",
    color: "var(--color-lavender)",
    bg: "var(--color-lavender-light)",
  },
  {
    icon: <Shield size={32} />,
    title: "Respect & Dignité",
    desc: "Chaque personne mérite d'être traitée avec une dignité absolue. Nos règles de conduite sont claires : aucun propos blessant, aucune pression, aucune manipulation. Le respect n'est pas une option, c'est notre fondement.",
    color: "var(--color-gold)",
    bg: "#fef9ef",
  },
  {
    icon: <Star size={32} />,
    title: "Authenticité",
    desc: "Nous encourageons nos membres à être pleinement eux-mêmes. Pas de faux profils, pas de performances. Le vrai attire le vrai. L'authenticité est la clé de rencontres qui durent.",
    color: "#4caf7d",
    bg: "#f0faf4",
  },
  {
    icon: <Users size={32} />,
    title: "Relation sérieuse",
    desc: "AD n'est pas une plateforme de rencontres informelles. Nos membres viennent avec l'intention sincère de construire une relation profonde, ancrée dans des valeurs communes, et potentiellement une vie partagée.",
    color: "var(--color-midnight)",
    bg: "var(--color-lavender-light)",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <section className="relative py-24 overflow-hidden" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Notre raison d&apos;être</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--color-midnight)] mt-4 mb-6">
            Une mission fondée
            <br />
            sur l&apos;amour vrai
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            AD est né d&apos;une conviction simple : les relations chrétiennes méritent un espace dédié, sûr et respectueux, loin du bruit des applications de rencontres ordinaires.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-[var(--color-midnight)] mb-6">Notre mission</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nous croyons que chaque jeune adulte chrétien mérite de trouver quelqu&apos;un qui partage non seulement ses goûts, mais aussi ses convictions profondes, sa vision de la famille, et sa relation avec Dieu.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                AD est conçu pour offrir un espace de rencontres sincères et respectueuses, où la foi peut être partagée ouvertement.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                La plateforme est en cours de construction. Les fonctions de modération, de confidentialité et de prise en charge seront décrites selon leur fonctionnement réel avant l&apos;ouverture publique.
              </p>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Rejoindre la communauté <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=700&fit=crop&auto=format" alt="Groupe de jeunes adultes réunis en plein air" width={600} height={700} sizes="(max-width: 1024px) 100vw, 50vw" className="rounded-3xl w-full object-cover shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Nos piliers</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mt-3">Nos valeurs fondamentales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: v.bg, color: v.color }}>
                  {v.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-4">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
