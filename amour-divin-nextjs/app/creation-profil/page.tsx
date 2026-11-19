"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, User, Heart, Star, Search, Eye, Check, ArrowRight, ArrowLeft } from "lucide-react";

import { unsplashUrl } from "@/data/profiles";

const STEPS = ["Photos", "Informations", "Foi & Communauté", "Centres d'intérêt", "Recherche", "Aperçu"];
const INTERESTS = ["Lecture", "Musique", "Sport", "Voyage", "Cuisine", "Art", "Cinéma", "Nature", "Photographie", "Bénévolat", "Yoga", "Danse", "Jardinage", "Jeux de société", "Randonnée"];
const VALUES_LIST = ["Fidélité", "Famille", "Honnêteté", "Service", "Prière", "Louange", "Évangélisation", "Humilité", "Générosité"];

interface ProfileDraft {
  photos: string[];
  firstName: string;
  birthDate: string;
  city: string;
  countryCode: string;
  profession: string;
  church: string;
  values: string[];
  bio: string;
  interests: string[];
  lookingFor: string;
  ageRange: [number, number];
  maxDistance: number;
}

import Image from "next/image";
export default function CreateProfile() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploadingPosition, setUploadingPosition] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ProfileDraft>({
    photos: [],
    firstName: "",
    birthDate: "",
    city: "",
    countryCode: "",
    profession: "",
    church: "",
    values: [],
    bio: "",
    interests: [],
    lookingFor: "",
    ageRange: [22, 35],
    maxDistance: 50,
  });

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/profile"), fetch("/api/profile/photos")])
      .then(async ([profileResponse, photosResponse]) => {
        const [profileData, photosData] = await Promise.all([profileResponse.json(), photosResponse.json()]);
        if (!active) return;
        const savedProfile = profileData.profile;
        const preferences = profileData.preferences;
        if (savedProfile) {
          setProfile((current) => ({
            ...current,
            firstName: savedProfile.firstName ?? "",
            birthDate: savedProfile.birthDate ?? "",
            city: savedProfile.city ?? "",
            countryCode: savedProfile.countryCode ?? "",
            profession: savedProfile.profession ?? "",
            church: savedProfile.church ?? "",
            values: savedProfile.faithValues ?? [],
            bio: savedProfile.bio ?? "",
            interests: savedProfile.interests ?? [],
            lookingFor: savedProfile.lookingFor ?? "",
            ageRange: [preferences?.minAge ?? 18, preferences?.maxAge ?? 70],
            maxDistance: preferences?.maxDistanceKm ?? 100,
          }));
        }
        if (Array.isArray(photosData.photos)) {
          setProfile((current) => {
            const photos = [...current.photos];
            for (const photo of photosData.photos) photos[photo.position] = photo.secureUrl;
            return { ...current, photos };
          });
        }
      })
      .catch(() => {
        if (active) setError("Impossible de charger votre brouillon de profil.");
      });
    return () => {
      active = false;
    };
  }, []);

  const progress = (step / (STEPS.length - 1)) * 100;

  const toggleItem = (arr: string[], item: string): string[] => (arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);

  const next = () => step < STEPS.length - 1 && setStep((s) => s + 1);
  const prev = () => step > 0 && setStep((s) => s - 1);

  const uploadPhoto = async (file: File, position: number) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choisissez une image de 5 Mo maximum.");
      return;
    }
    setUploadingPosition(position);
    setError("");
    try {
      const signatureResponse = await fetch("/api/profile/photos/signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ position }),
      });
      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signatureData.error || "Signature d'upload indisponible.");

      const uploadData = new FormData();
      uploadData.set("file", file);
      uploadData.set("api_key", signatureData.apiKey);
      uploadData.set("timestamp", String(signatureData.timestamp));
      uploadData.set("folder", signatureData.folder);
      uploadData.set("public_id", signatureData.publicId);
      uploadData.set("upload_preset", signatureData.uploadPreset);
      uploadData.set("overwrite", "false");
      uploadData.set("signature", signatureData.signature);

      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });
      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) throw new Error("L'envoi de la photo a échoué.");

      const saveResponse = await fetch("/api/profile/photos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          publicId: cloudinaryData.public_id,
          version: cloudinaryData.version,
          signature: cloudinaryData.signature,
          position,
        }),
      });
      const savedData = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(savedData.error || "Impossible d'enregistrer la photo.");
      setProfile((current) => {
        const photos = [...current.photos];
        photos[position] = savedData.photo.secureUrl;
        return { ...current, photos };
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload indisponible.");
    } finally {
      setUploadingPosition(null);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          birthDate: profile.birthDate,
          city: profile.city,
          countryCode: profile.countryCode,
          profession: profile.profession,
          church: profile.church,
          bio: profile.bio,
          lookingFor: profile.lookingFor,
          faithValues: profile.values,
          interests: profile.interests,
          minAge: profile.ageRange[0],
          maxAge: profile.ageRange[1],
          maxDistanceKm: profile.maxDistance,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible d'enregistrer votre profil.");
      router.push("/decouvrir");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Enregistrement indisponible.");
    } finally {
      setSaving(false);
    }
  };

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
          {error && <p role="alert" className="mb-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
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
                  <label
                    key={i}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-[var(--color-beige-dark)] bg-[var(--color-beige)] transition-opacity hover:opacity-80"
                  >
                    {profile.photos[i] ? (
                      <Image src={profile.photos[i]} fill sizes="(max-width: 640px) 33vw, 160px" className="rounded-2xl object-cover" alt={`Photo du profil ${i + 1}`} />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <Camera size={22} className="text-slate-300" />
                      </span>
                    )}
                    {uploadingPosition === i && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-white">Envoi...</span>}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploadingPosition !== null}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadPhoto(file, i);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
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
                    { label: "Date de naissance", key: "birthDate", type: "date", placeholder: "" },
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
                  <Image src={unsplashUrl("photo-1531746020798-e6953c6e8e04", 600, 400)} alt="Exemple de photo de profil" fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-display font-semibold text-2xl">
                      {profile.firstName || "Votre prénom"}{profile.birthDate ? `, ${new Date().getFullYear() - new Date(profile.birthDate).getFullYear()}` : ""}
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
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                {saving ? "Enregistrement..." : "Envoyer mon profil en vérification"} <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
