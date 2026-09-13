"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, User, Heart, Star, Search, Eye, Check, ArrowRight, ArrowLeft } from "lucide-react";

import { unsplashUrl } from "@/data/profiles";

const STEPS = ["Photos", "Informations", "Foi & Communauté", "Centres d'intérêt", "Recherche", "Aperçu"];
const INTERESTS = ["Lecture", "Musique", "Sport", "Voyage", "Cuisine", "Art", "Cinéma", "Nature", "Photographie", "Bénévolat", "Yoga", "Danse", "Jardinage", "Jeux de société", "Randonnée"];
const VALUES_LIST = ["Fidélité", "Famille", "Honnêteté", "Service", "Prière", "Louange", "Évangélisation", "Humilité", "Générosité"];

interface ProfileDraft {
  photos: string[];
  firstName: string;
  age: string;
  city: string;
  profession: string;
  church: string;
  values: string[];
  bio: string;
  interests: string[];
  lookingFor: string;
  ageRange: [number, number];
  maxDistance: number;
}

export default function CreateProfile() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileDraft>({
    photos: [],
    firstName: "Sarah",
    age: "25",
    city: "Paris",
    profession: "",
    church: "",
    values: [],
    bio: "",
    interests: [],
    lookingFor: "",
    ageRange: [22, 35],
    maxDistance: 50,
  });

  const progress = (step / (STEPS.length - 1)) * 100;

  const toggleItem = (arr: string[], item: string): string[] => (arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);

  const next = () => step < STEPS.length - 1 && setStep((s) => s + 1);
  const prev = () => step > 0 && setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-[var(--color-beige)] pt-16">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)]">Créer mon profil</h2>
            <span className="text-sm text-slate-400">
              Étape {step + 1} / {STEPS.length}
            </span>
          </div>
          <div className="h-2 bg-[var(--color-beige-dark)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--color-lavender) 0%, var(--color-midnight) 100%)" }}></div>
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-xs transition-colors ${i === step ? "text-[var(--color-lavender)] font-semibold" : i < step ? "text-green-500" : "text-slate-300"}`}>
                {i < step ? "✓" : s.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {/* Step 0: Photos */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  <Camera size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Vos photos</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">Ajoutez jusqu&apos;à 6 photos. La première sera votre photo principale.</p>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:opacity-80 ${
                      i === 0 ? "border-2 border-dashed border-[var(--color-lavender)]" : "border-2 border-dashed border-[var(--color-beige-dark)]"
                    }`}
                    style={{ background: i < 2 ? "var(--color-lavender-light)" : "var(--color-beige)" }}
                  >
                    {i < 2 ? (
                      <img src={unsplashUrl(i === 0 ? "photo-1531746020798-e6953c6e8e04" : "photo-1488426862026-3ee34a7d66df", 200, 200)} className="w-full h-full object-cover rounded-2xl" alt="" />
                    ) : (
                      <Camera size={22} className="text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">Photos sobres et naturelles recommandées. Visage visible sur la photo principale.</p>
            </div>
          )}

          {/* Step 1: Info */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  <User size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Vos informations</h3>
              </div>
              <div className="space-y-5">
                {(
                  [
                    { label: "Prénom", key: "firstName", type: "text", placeholder: "Votre prénom" },
                    { label: "Âge", key: "age", type: "number", placeholder: "25" },
                    { label: "Ville", key: "city", type: "text", placeholder: "Paris, Lyon..." },
                    { label: "Profession ou études", key: "profession", type: "text", placeholder: "Infirmière, Étudiant en droit..." },
                  ] as const
                ).map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{field.label}</label>
                    <input
                      type={field.type}
                      value={profile[field.key]}
                      onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Faith */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  <Heart size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Foi & Communauté</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mon église ou communauté</label>
                  <input
                    type="text"
                    value={profile.church}
                    onChange={(e) => setProfile((p) => ({ ...p, church: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                    placeholder="Église évangélique, Catholique, Protestante..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mes valeurs (sélectionnez jusqu&apos;à 5)</label>
                  <div className="flex flex-wrap gap-2">
                    {VALUES_LIST.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setProfile((p) => ({ ...p, values: toggleItem(p.values, v) }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          profile.values.includes(v) ? "text-white" : "border border-[var(--color-beige-dark)] text-slate-600 hover:border-[var(--color-lavender)]"
                        }`}
                        style={profile.values.includes(v) ? { background: "var(--color-lavender)" } : {}}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Ma présentation (quelques mots sur moi)</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all resize-none"
                    placeholder="Parlez de votre foi, de ce qui vous passionne, de vos rêves..."
                  />
                  <p className="text-xs text-slate-400 mt-1">{profile.bio.length}/500 caractères</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  <Star size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Centres d&apos;intérêt</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">Sélectionnez vos passions pour apparaître dans les bons profils.</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, interests: toggleItem(p.interests, interest) }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      profile.interests.includes(interest) ? "text-white" : "border border-[var(--color-beige-dark)] text-slate-600 hover:border-[var(--color-lavender)]"
                    }`}
                    style={profile.interests.includes(interest) ? { background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-lavender) 100%)" } : {}}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  <Search size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Préférences de recherche</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Tranche d&apos;âge recherchée : {profile.ageRange[0]} – {profile.ageRange[1]} ans
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={profile.ageRange[0]}
                      onChange={(e) => setProfile((p) => ({ ...p, ageRange: [+e.target.value, p.ageRange[1]] }))}
                      className="flex-1 accent-[var(--color-lavender)]"
                    />
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={profile.ageRange[1]}
                      onChange={(e) => setProfile((p) => ({ ...p, ageRange: [p.ageRange[0], +e.target.value] }))}
                      className="flex-1 accent-[var(--color-lavender)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">Distance maximum : {profile.maxDistance} km</label>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    value={profile.maxDistance}
                    onChange={(e) => setProfile((p) => ({ ...p, maxDistance: +e.target.value }))}
                    className="w-full accent-[var(--color-lavender)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Ce que je recherche</label>
                  <textarea
                    value={profile.lookingFor}
                    onChange={(e) => setProfile((p) => ({ ...p, lookingFor: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all resize-none"
                    placeholder="Décrivez la personne que vous recherchez, vos attentes pour cette relation..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                  <Eye size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Aperçu de votre profil</h3>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[var(--color-beige-dark)]">
                <div className="relative aspect-video bg-[var(--color-beige)]">
                  <img src={unsplashUrl("photo-1531746020798-e6953c6e8e04", 600, 400)} alt="Photo de profil" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-display font-semibold text-2xl">
                      {profile.firstName || "Sarah"}, {profile.age || "25"}
                    </p>
                    <p className="text-white/80">
                      {profile.city || "Paris"} · {profile.profession || "Profession"}
                    </p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-slate-600 italic">&quot;{profile.bio || "Votre présentation apparaîtra ici..."}&quot;</p>
                  {profile.values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.values.map((v) => (
                        <span key={v} className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ background: "var(--color-lavender)" }}>
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3">
                <Check size={18} className="text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">Votre profil sera examiné par notre équipe sous 24h avant publication.</p>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-beige-dark)]">
            <button onClick={prev} disabled={step === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-[var(--color-beige)] disabled:opacity-30 transition-all">
              <ArrowLeft size={16} /> Précédent
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Suivant <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => router.push("/decouvrir")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Publier mon profil <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
