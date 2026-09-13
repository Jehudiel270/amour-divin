import Link from "next/link";
import { UserPlus, Search, Heart, ChevronDown, Star, Shield, CheckCircle, ArrowRight } from "lucide-react";

import Footer from "@/components/shared/footer";
import { unsplashUrl } from "@/data/profiles";

const STATS = [
  { value: "12 400+", label: "Membres inscrits" },
  { value: "2 100+", label: "Couples formés" },
  { value: "96%", label: "Profils vérifiés" },
  { value: "4.9/5", label: "Note de confiance" },
];

const STEPS = [
  { icon: <UserPlus size={28} />, title: "Créez votre profil", desc: "Partagez votre foi, vos valeurs et ce que vous recherchez en quelques minutes." },
  { icon: <Search size={28} />, title: "Découvrez des profils", desc: "Explorez des profils compatibles avec vos valeurs et votre vision de la vie." },
  { icon: <Heart size={28} />, title: "Construisez ensemble", desc: "Échangez, connectez-vous et laissez une belle histoire commencer." },
];

const TESTIMONIALS = [
  { name: "Sarah & Matthieu", city: "Paris", text: "Nous nous sommes rencontrés sur AD en mars 2024 et sommes fiancés depuis décembre. Merci pour ce beau cadeau !", photo: "photo-1531746020798-e6953c6e8e04" },
  { name: "Esther & David", city: "Lyon", text: "L'équipe AD a créé un espace sûr et sincère. On a immédiatement senti que les profils étaient authentiques.", photo: "photo-1438761681033-6461ffad8d80" },
  { name: "Claire & Jonah", city: "Bordeaux", text: "Ce que j'aime ici, c'est qu'on parle d'abord des valeurs avant les photos. Notre relation repose sur des fondations solides.", photo: "photo-1488426862026-3ee34a7d66df" },
];

const FAQ_ITEMS = [
  { q: "AD est-il réservé aux chrétiens ?", a: "Oui, AD est conçu pour des jeunes adultes qui souhaitent fonder une relation sur des valeurs chrétiennes partagées." },
  { q: "Comment fonctionne la vérification des profils ?", a: "Chaque profil est examiné par notre équipe de modération avant publication. Vous pouvez aussi vérifier votre identité pour obtenir le badge vérifié." },
  { q: "Est-ce gratuit ?", a: "L'inscription et la découverte de profils sont gratuites. Certaines fonctionnalités avancées sont disponibles avec un abonnement Premium." },
  { q: "Comment puis-je signaler un comportement inapproprié ?", a: 'Chaque profil dispose d\'un bouton "Signaler". Notre équipe traite tous les signalements sous 24h.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop&auto=format"
            alt="Couple dans la nature"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,39,68,0.88) 0%, rgba(26,39,68,0.65) 50%, rgba(155,142,196,0.4) 100%)" }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="text-[var(--color-gold-light)] text-sm font-medium">✝ Plateforme de rencontres chrétiennes</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Des rencontres sincères,
              <br />
              <span style={{ color: "var(--color-gold-light)" }}>fondées sur des valeurs</span>
              <br />
              partagées.
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              AD réunit de jeunes adultes chrétiens qui cherchent l&apos;amour authentique — pas juste une rencontre, mais une relation qui dure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-[var(--color-midnight)] bg-white hover:bg-[var(--color-beige)] transition-all shadow-lg"
              >
                Créer mon profil <ArrowRight size={18} />
              </Link>
              <Link
                href="/decouvrir"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white border-2 border-white/40 hover:border-white/70 hover:bg-white/10 transition-all"
              >
                Découvrir des profils
              </Link>
            </div>
          </div>
        </div>
        <a href="#fonctionnement" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors animate-bounce">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: "var(--color-gold-light)" }}>
                  {s.value}
                </div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="fonctionnement" className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Simple et bienveillant</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mt-3">Comment ça marche</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-[var(--color-lavender)] uppercase tracking-widest mb-2">Étape {i + 1}</div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/comment-ca-marche" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-lavender)] hover:text-[var(--color-midnight)] transition-colors">
              En savoir plus <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Notre identité</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mt-3 mb-6">Des valeurs qui guident chaque relation</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Chez AD, nous croyons que les meilleures histoires commencent par des fondations solides. Foi, respect, authenticité et bienveillance sont au cœur de chaque connexion.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Foi & Spiritualité", "Respect mutuel", "Authenticité", "Relations durables", "Sécurité", "Bienveillance"].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[var(--color-lavender)] flex-shrink-0" />
                    <span className="text-sm font-medium text-[var(--color-midnight)]">{v}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Nos valeurs <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&h=400&fit=crop&auto=format" alt="Couple" className="rounded-3xl w-full object-cover aspect-[3/4] mt-8" />
              <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=400&fit=crop&auto=format" alt="Couple heureux" className="rounded-3xl w-full object-cover aspect-[3/4]" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Votre sécurité</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mt-3">Une plateforme en qui vous pouvez avoir confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={24} />, title: "Profils vérifiés", desc: "Notre équipe examine chaque profil manuellement avant publication." },
              { icon: <Star size={24} />, title: "Modération active", desc: "Des modérateurs humains surveillent la plateforme en continu." },
              { icon: <CheckCircle size={24} />, title: "Données protégées", desc: "Vos informations sont chiffrées et jamais revendues à des tiers." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/securite" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-lavender)] hover:text-[var(--color-midnight)] transition-colors">
              En savoir plus sur la sécurité <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Ils témoignent</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mt-3">De belles histoires vraies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[var(--color-gold)] fill-[var(--color-gold)]" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <img src={unsplashUrl(t.photo, 60, 60)} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm text-[var(--color-midnight)]">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[var(--color-lavender)] text-sm font-semibold uppercase tracking-widest">Questions fréquentes</span>
            <h2 className="font-display text-4xl font-bold text-[var(--color-midnight)] mt-3">FAQ</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-white rounded-2xl shadow-sm group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-[var(--color-midnight)] text-sm">{item.q}</span>
                  <ChevronDown size={18} className="text-[var(--color-lavender)] transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-lavender)] hover:text-[var(--color-midnight)] transition-colors">
              Voir toutes les questions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt(e) à commencer
            <br />
            votre histoire ?
          </h2>
          <p className="text-white/70 mb-10 text-lg">Rejoignez des milliers de jeunes chrétiens qui ont osé chercher l&apos;amour authentique.</p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-semibold bg-white text-[var(--color-midnight)] hover:bg-[var(--color-beige)] transition-all shadow-lg"
          >
            Créer mon compte gratuitement <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
