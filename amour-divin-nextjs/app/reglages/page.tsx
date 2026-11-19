"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, Lock, Bell, CreditCard, HelpCircle, LogOut, Check } from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { translateAuthError } from "@/lib/auth/messages";

const SECTIONS = [
  { id: "profile", label: "Mon profil", icon: <User size={18} /> },
  { id: "security", label: "Sécurité", icon: <Shield size={18} /> },
  { id: "privacy", label: "Confidentialité", icon: <Lock size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { id: "subscription", label: "Abonnement", icon: <CreditCard size={18} /> },
  { id: "help", label: "Aide", icon: <HelpCircle size={18} /> },
];

type NotificationPreferences = { matches: boolean; messages: boolean; requests: boolean; marketing: boolean };
type AccountSettings = {
  firstName: string;
  city: string;
  email: string;
  isVisible: boolean;
  notifications: NotificationPreferences;
};

export default function Settings() {
  const router = useRouter();
  const [active, setActive] = useState("profile");
  const [accountSettings, setAccountSettings] = useState<AccountSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [saved, setSaved] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [activePlan, setActivePlan] = useState<{ planCode: string; endsAt: string | null } | null>(null);
  const [plans, setPlans] = useState<Array<{ code: string; name: string; description: string; amountXof: number; durationDays: number; features: string[] }>>([]);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Impossible de charger vos réglages.");
        if (active) setAccountSettings(result);
      })
      .catch((loadError) => {
        if (active) setSettingsError(loadError instanceof Error ? loadError.message : "Impossible de charger vos réglages.");
      })
      .finally(() => {
        if (active) setSettingsLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/billing/status")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Abonnement indisponible.");
        if (active) {
          setActivePlan(result.subscription);
          setPlans(Array.isArray(result.plans) ? result.plans : []);
        }
      })
      .catch(() => {
        if (active) setBillingError("Impossible de charger votre abonnement.");
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    if (!accountSettings) return;
    setSettingsSaving(true);
    setSettingsError("");
    setSaved(false);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: accountSettings.firstName,
          city: accountSettings.city,
          isVisible: accountSettings.isVisible,
          notifications: accountSettings.notifications,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible d’enregistrer vos réglages.");
      setAccountSettings((current) => current ? { ...current, ...result.profile, notifications: result.notifications } : current);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (saveError) {
      setSettingsError(saveError instanceof Error ? saveError.message : "Impossible d’enregistrer vos réglages.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const logout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const changePassword = async () => {
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordMessage("");
    if (passwordNew.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      setPasswordLoading(false);
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      setPasswordLoading(false);
      return;
    }
    try {
      const changePasswordClient = (authClient as unknown as {
        changePassword: (args: { currentPassword: string; newPassword: string; revokeOtherSessions?: boolean }) => Promise<{ error?: unknown }>;
      }).changePassword;
      const result = await changePasswordClient({
        currentPassword: passwordCurrent,
        newPassword: passwordNew,
        revokeOtherSessions: false,
      });
      if (result.error) throw new Error(translateAuthError(result.error, "Modification du mot de passe impossible."));
      setPasswordMessage("Votre mot de passe a été modifié.");
      setPasswordCurrent("");
      setPasswordNew("");
      setPasswordConfirm("");
    } catch (changeError) {
      setPasswordError(changeError instanceof Error ? changeError.message : "Modification du mot de passe impossible.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const startPremiumCheckout = async (planCode: string) => {
    setBillingLoading(true);
    setBillingError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planCode }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.paymentUrl !== "string") {
        setBillingError(result.error || "Le paiement n'est pas disponible pour le moment.");
        return;
      }
      window.location.assign(result.paymentUrl);
    } catch {
      setBillingError("Impossible de joindre le service de paiement.");
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)] mb-8">Réglages</h1>
        {settingsError && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{settingsError}</p>}

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
                  {settingsLoading ? <p className="py-8 text-sm text-slate-500">Chargement du compte…</p> : accountSettings && (
                    <div className="space-y-4">
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">Prénom</span>
                        <input value={accountSettings.firstName} onChange={(event) => setAccountSettings((current) => current ? { ...current, firstName: event.target.value } : current)} className="w-full rounded-xl border border-[var(--color-beige-dark)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">Ville</span>
                        <input value={accountSettings.city} onChange={(event) => setAccountSettings((current) => current ? { ...current, city: event.target.value } : current)} className="w-full rounded-xl border border-[var(--color-beige-dark)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">Adresse e-mail</span>
                        <input type="email" value={accountSettings.email} readOnly aria-describedby="email-settings-note" className="w-full rounded-xl border border-[var(--color-beige-dark)] bg-slate-50 px-4 py-3 text-sm text-slate-500" />
                        <span id="email-settings-note" className="mt-1 block text-xs text-slate-500">Pour modifier l’adresse e-mail, contactez l’équipe.</span>
                      </label>
                      <Link href="/creation-profil" className="inline-block rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}>Compléter mon profil</Link>
                    </div>
                  )}
                </div>
              )}

              {active === "security" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Sécurité</h2>
                  <div className="space-y-4">
                    {passwordError && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{passwordError}</p>}
                    {passwordMessage && <p role="status" className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">{passwordMessage}</p>}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mot de passe actuel</label>
                      <input type="password" value={passwordCurrent} onChange={(event) => setPasswordCurrent(event.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Nouveau mot de passe</label>
                      <input type="password" value={passwordNew} onChange={(event) => setPasswordNew(event.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all" placeholder="8 caractères minimum" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Confirmer le nouveau mot de passe</label>
                      <input type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all" placeholder="••••••••" />
                    </div>
                    <button type="button" onClick={() => void changePassword()} disabled={passwordLoading || !passwordCurrent || !passwordNew || !passwordConfirm} className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--color-midnight)" }}>{passwordLoading ? "Modification…" : "Modifier le mot de passe"}</button>
                    <div className="p-4 rounded-2xl space-y-4" style={{ background: "var(--color-lavender-light)" }}>
                      <div className="flex items-start gap-3">
                        <Shield size={18} className="text-[var(--color-lavender)] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-midnight)]">Double authentification indisponible</p>
                          <p className="mt-1 text-sm text-slate-600">Le client Neon Auth utilisé par cette application n’expose pas le module TOTP. Cette protection n’est donc pas active; ne considérez pas le compte comme protégé par une deuxième étape.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {active === "privacy" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Confidentialité</h2>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 rounded-2xl p-4" style={{ background: "var(--color-beige)" }}>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-midnight)]">Rendre mon profil visible</p>
                        <p className="text-xs text-slate-500 mt-0.5">Votre profil apparaît dans les résultats de recherche des autres membres.</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={accountSettings?.isVisible ?? false}
                        disabled={!accountSettings || settingsLoading}
                        onClick={() => setAccountSettings((current) => current ? { ...current, isVisible: !current.isVisible } : current)}
                        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${accountSettings?.isVisible ? "bg-[var(--color-lavender)]" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${accountSettings?.isVisible ? "translate-x-6" : "translate-x-1"}`}></span>
                      </button>
                    </div>
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
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between rounded-2xl p-4" style={{ background: "var(--color-beige)" }}>
                        <span className="text-sm font-medium text-[var(--color-midnight)]">{label}</span>
                        <button
                          type="button"
                          role="switch"
                          aria-label={label}
                          aria-checked={accountSettings?.notifications[key] ?? false}
                          disabled={!accountSettings || settingsLoading}
                          onClick={() => setAccountSettings((current) => current ? { ...current, notifications: { ...current.notifications, [key]: !current.notifications[key] } } : current)}
                          className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${accountSettings?.notifications[key] ? "bg-[var(--color-lavender)]" : "bg-slate-300"}`}
                        >
                          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${accountSettings?.notifications[key] ? "translate-x-6" : "translate-x-1"}`}></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === "subscription" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-6">Abonnement</h2>
                  <div className="p-6 rounded-2xl mb-4" style={{ background: "var(--color-lavender-light)" }}>
                    <p className="text-sm font-semibold text-[var(--color-midnight)] mb-1">Plan actuel : {activePlan ? "AD Premium" : "Gratuit"}</p>
                    <p className="text-xs text-slate-500">{activePlan?.endsAt ? `Valable jusqu'au ${new Date(activePlan.endsAt).toLocaleDateString("fr-FR")}.` : "Accès gratuit aux fonctions de base."}</p>
                  </div>
                  {plans.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-beige-dark)] p-6 text-sm text-slate-500">Aucune offre payante n&apos;est actuellement disponible.</div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      {plans.map((plan, index) => (
                        <div key={plan.code} className="rounded-2xl border-2 p-5" style={{ borderColor: index === 1 ? "var(--color-gold)" : "var(--color-beige-dark)" }}>
                          {index === 1 && <p className="mb-3 w-fit rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: "var(--color-gold)" }}>Populaire</p>}
                          <p className="font-display text-lg font-bold text-[var(--color-midnight)]">{plan.name}</p>
                          <p className="mt-1 min-h-10 text-xs leading-relaxed text-slate-500">{plan.description}</p>
                          <p className="my-4 font-display text-2xl font-bold text-[var(--color-midnight)]">{plan.amountXof.toLocaleString("fr-FR")} <span className="text-xs">XOF</span></p>
                          <p className="mb-4 text-xs font-semibold text-[var(--color-lavender)]">{plan.durationDays} jours</p>
                          <ul className="mb-5 space-y-2">
                            {(plan.features.length > 0 ? plan.features : ["Demandes illimitées", "Filtres avancés"]).map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-xs text-slate-600"><Check size={13} className="text-green-500" /> {feature}</li>
                            ))}
                          </ul>
                          <button onClick={() => void startPremiumCheckout(plan.code)} disabled={billingLoading} className="w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60" style={{ background: index === 1 ? "var(--color-gold)" : "var(--color-midnight)" }}>
                            {billingLoading ? "Préparation..." : `Choisir ${plan.name}`}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {billingError && <p role="alert" className="mt-3 text-sm text-red-600">{billingError}</p>}
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
                    type="button"
                    onClick={() => void save()}
                    disabled={settingsSaving || settingsLoading || !accountSettings}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                  >
                    {settingsSaving ? "Enregistrement…" : "Enregistrer les modifications"}
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
              <p className="mt-6 text-sm text-slate-500">
                Pour demander la suppression de votre compte, <Link href="/contact" className="font-medium text-[var(--color-lavender)] underline">contactez l&apos;équipe</Link>.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
