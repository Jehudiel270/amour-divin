import type { Metadata } from "next";
import Link from "next/link";
import { Shield, AlertTriangle, Lock, Eye, Phone, ArrowRight, CheckCircle } from "lucide-react";

import Footer from "@/components/shared/footer";

export const metadata: Metadata = { title: "Sécurité & Confiance" };

export default function Safety() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <section className="py-24" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
            <Shield size={32} />
          </div>
          <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Votre protection</span>
          <h1 className="font-display text-5xl font-bold text-[var(--color-midnight)] mt-4 mb-6">Sécurité & Confiance</h1>
          <p className="text-xl text-slate-600 leading-relaxed">Votre sécurité est notre priorité absolue. Voici tout ce que nous faisons pour vous protéger.</p>
        </div>
      </section>

      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                <Eye size={22} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)]">Conseils de sécurité</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Ne partagez jamais vos coordonnées personnelles (adresse, téléphone) trop tôt.",
                "Faites votre premier contact dans l'application avant de passer à d'autres plateformes.",
                "Pour une première rencontre, choisissez un lieu public et informez un proche de votre rendez-vous.",
                "Ne transférez jamais d'argent à quelqu'un rencontré en ligne, quelles que soient les circonstances.",
                "Si quelque chose vous met mal à l'aise, faites confiance à votre instinct et signalez le profil.",
                "Effectuez une recherche en ligne (Google, réseaux sociaux) avant de rencontrer quelqu'un.",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "var(--color-beige)" }}>
                  <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500">
                <AlertTriangle size={22} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)]">Règles de respect</h2>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">La communauté AD est fondée sur le respect mutuel. Tout manquement aux règles suivantes peut entraîner une suspension immédiate du compte :</p>
            <div className="space-y-3">
              {[
                "Aucun harcèlement, aucune pression ou insistance après un refus.",
                "Aucun propos offensant, discriminatoire ou vulgaire.",
                "Aucun contenu sexuel explicite ou non sollicité.",
                "Aucune usurpation d'identité ou faux profil.",
                "Aucune sollicitation commerciale ou financière.",
                "Respecter la règle d'âge minimum de 18 ans.",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-[var(--color-beige-dark)] last:border-0">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "var(--color-midnight)" }}>
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500">
                <Lock size={22} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)]">Confidentialité de vos données</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Connexions HTTPS", desc: "Le domaine de production devra utiliser HTTPS avant toute ouverture publique." },
                { title: "Données minimales", desc: "Les informations recueillies et leurs usages doivent être détaillés dans la politique finale." },
                { title: "Visibilité du profil", desc: "Vous contrôlez la visibilité de votre profil depuis vos réglages." },
                { title: "Demandes de données", desc: "Contactez l'équipe pour demander une intervention sur votre compte pendant la bêta." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl" style={{ background: "var(--color-beige)" }}>
                  <h4 className="font-semibold text-[var(--color-midnight)] mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/confidentialite" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[var(--color-lavender)] hover:text-[var(--color-midnight)] transition-colors">
              Lire notre politique de confidentialité <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                <CheckCircle size={22} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)]">Vérification des profils</h2>
            </div>
            <p className="text-slate-600 mb-6">Les profils soumis sont destinés à être examinés avant publication; la vérification d&apos;identité et les badges ne sont pas encore disponibles.</p>
            <div className="flex flex-col md:flex-row gap-4">
              {[
                { n: "1", t: "Compte", d: "La vérification email dépend de l'activation Neon Auth et de la configuration du service email." },
                { n: "2", t: "Profil", d: "Les profils attendent une revue manuelle avant publication." },
                { n: "3", t: "Identité", d: "La vérification d'identité et le badge sont à construire." },
              ].map((s) => (
                <div key={s.n} className="flex-1 p-6 rounded-2xl text-center" style={{ background: "var(--color-lavender-light)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-white text-sm" style={{ background: "var(--color-lavender)" }}>
                    {s.n}
                  </div>
                  <h4 className="font-semibold text-[var(--color-midnight)] mb-1">{s.t}</h4>
                  <p className="text-xs text-slate-500">{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/10">
              <Phone size={28} className="text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">Signaler un problème</h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">Si vous vous sentez en danger ou avez été victime d&apos;un comportement inapproprié, contactez-nous immédiatement. Notre équipe répond sous 2h.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signaler" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-white text-[var(--color-midnight)] hover:bg-[var(--color-beige)] transition-all">
                <AlertTriangle size={18} /> Signaler un profil
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all">
                Contacter l&apos;équipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
