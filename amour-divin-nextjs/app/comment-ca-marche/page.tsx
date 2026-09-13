import type { Metadata } from "next";
import Link from "next/link";
import { Camera, UserCheck, Compass, Send, Heart, MessageCircle, ArrowRight } from "lucide-react";

import Footer from "@/components/shared/footer";

export const metadata: Metadata = { title: "Comment ça marche" };

const STEPS = [
  {
    icon: <Camera size={36} />,
    step: "01",
    title: "Créez votre profil",
    desc: "Ajoutez vos meilleures photos, partagez votre histoire, vos valeurs de foi et ce qui vous rend unique. Notre assistant pas-à-pas vous guide à chaque étape.",
    details: ["Photos authentiques et naturelles", "Présentation personnelle libre", "Valeurs et foi partagées"],
    cta: "Créer mon profil",
    href: "/inscription",
  },
  {
    icon: <UserCheck size={36} />,
    step: "02",
    title: "Vérifiez votre compte",
    desc: 'Obtenez le badge "Profil vérifié" en confirmant votre identité. Cela renforce la confiance au sein de la communauté et augmente vos chances de connexion.',
    details: ["Vérification par e-mail", "Validation manuelle par notre équipe", "Badge de confiance visible sur votre profil"],
    cta: null,
    href: null,
  },
  {
    icon: <Compass size={36} />,
    step: "03",
    title: "Découvrez des profils",
    desc: "Explorez des profils compatibles grâce à nos filtres intelligents : âge, ville, église, centres d'intérêt et valeurs. Trouvez ceux qui résonnent avec vous.",
    details: ["Filtres personnalisés", "Suggestions selon vos préférences", "Profils tous vérifiés"],
    cta: "Découvrir",
    href: "/decouvrir",
  },
  {
    icon: <Send size={36} />,
    step: "04",
    title: "Envoyez une demande",
    desc: "Lorsqu'un profil vous touche, envoyez une demande de connexion accompagnée d'un message sincère. Pas de swipe compulsif — des gestes intentionnels.",
    details: ["Message d'introduction personnalisé", "Demande respectueuse et bienveillante", "Pas de pression ni de spam"],
    cta: null,
    href: null,
  },
  {
    icon: <Heart size={36} />,
    step: "05",
    title: "Devenez un match",
    desc: 'Quand votre demande est acceptée, vous devenez un "match" ! C\'est le début d\'une belle aventure ensemble. Les deux parties peuvent désormais échanger librement.',
    details: ["Notification de match en temps réel", "Accès à la messagerie privée", "Profil complet partagé entre matchs"],
    cta: null,
    href: null,
  },
  {
    icon: <MessageCircle size={36} />,
    step: "06",
    title: "Échangez librement",
    desc: "Discutez dans un espace sécurisé et respectueux. Prenez le temps de vous connaître en profondeur avant toute rencontre. La qualité prime sur la quantité.",
    details: ["Messagerie sécurisée et chiffrée", "Rappels de sécurité discrets", "Options de signalement à portée de main"],
    cta: "Commencer",
    href: "/inscription",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <section className="py-24" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Étape par étape</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--color-midnight)] mt-4 mb-6">Comment fonctionne AD</h1>
          <p className="text-xl text-slate-600 leading-relaxed">Chaque étape de votre parcours sur AD a été pensée pour être simple, sécurisante et intentionnelle.</p>
        </div>
      </section>

      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-8">
            {STEPS.map((s, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
                <div className="w-full md:w-1/2 bg-white rounded-3xl p-10 shadow-sm">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                      {s.icon}
                    </div>
                    <div>
                      <span className="font-display text-5xl font-bold text-[var(--color-beige-dark)] leading-none">{s.step}</span>
                      <h3 className="font-display text-2xl font-bold text-[var(--color-midnight)] mt-1 mb-3">{s.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm mb-5">{s.desc}</p>
                      <ul className="space-y-1.5">
                        {s.details.map((d) => (
                          <li key={d} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lavender)] flex-shrink-0"></span>
                            {d}
                          </li>
                        ))}
                      </ul>
                      {s.cta && s.href && (
                        <Link
                          href={s.href}
                          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                        >
                          {s.cta} <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center text-6xl font-display font-bold"
                    style={{ background: "linear-gradient(135deg, var(--color-lavender-light) 0%, var(--color-beige) 100%)", color: "var(--color-lavender)" }}
                  >
                    {s.step}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-6">Prêt(e) à commencer ?</h2>
          <p className="text-white/70 mb-8">Créez votre profil en quelques minutes et rejoignez une communauté bienveillante.</p>
          <Link href="/inscription" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-semibold bg-white text-[var(--color-midnight)] hover:bg-[var(--color-beige)] transition-all">
            Créer mon compte <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
