"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, Lock, Bell, CreditCard, HelpCircle, LogOut, Trash2, Check } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { CURRENT_USER_PHOTO } from "@/data/profiles";

const SECTIONS = [
  { id: "profile", label: "Mon profil", icon: <User size={18} /> },
  { id: "security", label: "Sécurité", icon: <Shield size={18} /> },
  { id: "privacy", label: "Confidentialité", icon: <Lock size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { id: "subscription", label: "Abonnement", icon: <CreditCard size={18} /> },
  { id: "help", label: "Aide", icon: <HelpCircle size={18} /> },
];

export default function Settings() {
  const router = useRouter();
  const { setLoggedIn } = useAuth();
  const [active, setActive] = useState("profile");
  const [notifs, setNotifs] = useState({ matches: true, messages: true, requests: true, marketing: false });
  const [visible, setVisible] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = () => {
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)] mb-8">Réglages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-2 shadow-sm">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active === s.id ? "text-white" : "text-slate-600 hover:bg-[var(--color-beige)]"
                  }`}
                  style={active === s.id ? { background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" } : {}}
                >
                  {s.icon} {s.label}
                </button>
              ))}
              <hr className="my-2 border-[var(--color-beige-dark)]" />
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={18} /> Se déconnecter
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {active === "profile" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Mon profil</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={CURRENT_USER_PHOTO} alt="Profil" className="w-20 h-20 rounded-2xl object-cover" />
                    <div>
                      <Link
                        href="/creation-profil"
                        className="inline-block px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                      >
                        Modifier mon profil
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Prénom", value: "Sarah" },
                      { label: "Ville", value: "Paris" },
                      { label: "Adresse e-mail", value: "sarah@example.com" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{f.label}</label>
                        <input
                          type="text"
                          defaultValue={f.value}
                          className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === "security" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Sécurité</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mot de passe actuel</label>
                      <input type="password" className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Nouveau mot de passe</label>
                      <input type="password" className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all" placeholder="••••••••" />
                    </div>
                    <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "var(--color-lavender-light)" }}>
                      <Shield size={18} className="text-[var(--color-lavender)] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600">Votre compte est protégé par une vérification en 2 étapes. Nous vous recommandons de la maintenir active.</p>
                    </div>
                  </div>
                </div>
              )}

              {active === "privacy" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Confidentialité</h2>
                  <div className="space-y-5">
                    <label className="flex items-center justify-between p-4 rounded-2xl cursor-pointer" style={{ background: "var(--color-beige)" }}>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-midnight)]">Rendre mon profil visible</p>
                        <p className="text-xs text-slate-500 mt-0.5">Votre profil apparaît dans les résultats de recherche des autres membres.</p>
                      </div>
                      <button
                        onClick={() => setVisible(!visible)}
                        className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${visible ? "" : "bg-slate-300"}`}
                        style={visible ? { background: "var(--color-lavender)" } : {}}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${visible ? "translate-x-6" : "translate-x-1"}`}></span>
                      </button>
                    </label>
                    <Link href="/confidentialite" className="inline-block text-sm text-[var(--color-lavender)] hover:text-[var(--color-midnight)] transition-colors">
                      Lire notre politique de confidentialité →
                    </Link>
                  </div>
                </div>
              )}

              {active === "notifications" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Notifications</h2>
                  <div className="space-y-3">
                    {(
                      [
                        ["matches", "Nouveaux matchs"],
                        ["messages", "Nouveaux messages"],
                        ["requests", "Demandes de connexion"],
                        ["marketing", "Actualités et offres AD"],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="flex items-center justify-between p-4 rounded-2xl cursor-pointer" style={{ background: "var(--color-beige)" }}>
                        <span className="text-sm font-medium text-[var(--color-midnight)]">{label}</span>
                        <button
                          onClick={() => setNotifs((p) => ({ ...p, [key]: !p[key] }))}
                          className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
                          style={{ background: notifs[key] ? "var(--color-lavender)" : "#cbd5e1" }}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifs[key] ? "translate-x-6" : "translate-x-1"}`}></span>
                        </button>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {active === "subscription" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Abonnement</h2>
                  <div className="p-6 rounded-2xl mb-4" style={{ background: "var(--color-lavender-light)" }}>
                    <p className="text-sm font-semibold text-[var(--color-midnight)] mb-1">Plan actuel : Gratuit</p>
                    <p className="text-xs text-slate-500">Découverte illimitée, 5 demandes par jour.</p>
                  </div>
                  <div className="p-6 rounded-2xl border-2" style={{ borderColor: "var(--color-gold)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-display font-bold text-lg text-[var(--color-midnight)]">AD Premium</p>
                      <span className="text-xs font-bold text-white px-2 py-1 rounded-full" style={{ background: "var(--color-gold)" }}>
                        Populaire
                      </span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {["Demandes illimitées", "Voir qui a consulté votre profil", "Mise en avant de votre profil", "Filtres de recherche avancés"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                          <Check size={14} className="text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--color-gold)" }}>
                      Passer à Premium
                    </button>
                  </div>
                </div>
              )}

              {active === "help" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Aide</h2>
                  <div className="space-y-3">
                    <Link href="/faq" className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--color-beige)] transition-colors">
                      <span className="text-sm font-medium text-[var(--color-midnight)]">Questions fréquentes</span> →
                    </Link>
                    <Link href="/contact" className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--color-beige)] transition-colors">
                      <span className="text-sm font-medium text-[var(--color-midnight)]">Nous contacter</span> →
                    </Link>
                    <Link href="/securite" className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--color-beige)] transition-colors">
                      <span className="text-sm font-medium text-[var(--color-midnight)]">Conseils de sécurité</span> →
                    </Link>
                  </div>
                </div>
              )}

              {active !== "help" && active !== "subscription" && (
                <div className="mt-8 pt-6 border-t border-[var(--color-beige-dark)] flex items-center gap-3">
                  <button
                    onClick={save}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                  >
                    Enregistrer les modifications
                  </button>
                  {saved && (
                    <span className="text-sm text-green-600 flex items-center gap-1.5">
                      <Check size={15} /> Modifications enregistrées
                    </span>
                  )}
                </div>
              )}
            </div>

            {active === "profile" && (
              <div className="mt-6">
                <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-500 transition-colors">
                  <Trash2 size={15} /> Supprimer mon compte
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowDelete(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-3">Supprimer votre compte ?</h3>
            <p className="text-slate-500 text-sm mb-6">Cette action est irréversible. Toutes vos données, conversations et correspondances seront définitivement supprimées.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-3 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                Annuler
              </button>
              <button onClick={logout} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
