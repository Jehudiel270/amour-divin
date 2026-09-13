import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Star, Users, ArrowRight } from "lucide-react";

import Footer from "@/components/shared/footer";
import { unsplashUrl } from "@/data/profiles";

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

const TEAM = [
  { name: "Pasteur Élias Moreau", role: "Fondateur & Directeur spirituel", photo: "photo-1507003211169-0a1dd7228f2d" },
  { name: "Marie Dupont", role: "Directrice produit", photo: "photo-1438761681033-6461ffad8d80" },
  { name: "Jonathan Koffi", role: "Responsable sécurité & modération", photo: "photo-1500648767791-00dcc994a43e" },
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
                AD a été conçu pour offrir un espace de rencontres sincères, à l&apos;abri des pressions superficielles. Ici, les profils sont vérifiés, les échanges sont respectueux, et la foi est célébrée, pas cachée.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Notre équipe est composée de chrétiens engagés qui comprennent les enjeux et les désirs de cette communauté. Nous ne sommes pas juste une tech company : nous sommes des croyants qui ont voulu créer quelque chose de bien.
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
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=700&fit=crop&auto=format" alt="Couple heureux" className="rounded-3xl w-full object-cover shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-lg">
                <p className="font-display font-bold text-2xl text-[var(--color-midnight)]">2 100+</p>
                <p className="text-sm text-slate-500">couples formés sur AD</p>
              </div>
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

      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Des humains derrière l&apos;écran</span>
            <h2 className="font-display text-4xl font-bold text-[var(--color-midnight)] mt-3">L&apos;équipe AD</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <img src={unsplashUrl(member.photo, 200, 200)} alt={member.name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-md" />
                <h4 className="font-display font-bold text-lg text-[var(--color-midnight)]">{member.name}</h4>
                <p className="text-sm text-slate-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
