"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Heart, Send, Flag, MapPin, Briefcase, ArrowLeft, X } from "lucide-react";

import { PROFILES, unsplashUrl } from "@/data/profiles";

export default function ProfileView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const profile = PROFILES.find((p) => p.id === params.id) || PROFILES[0];
  const [favorite, setFavorite] = useState(false);
  const [requested, setRequested] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [success, setSuccess] = useState("");

  const sendRequest = () => {
    setRequested(true);
    setSuccess("Demande envoyée à " + profile.firstName + " !");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--color-midnight)] mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm sticky top-24">
              <div className="relative aspect-[3/4] bg-[var(--color-beige)]">
                <img src={unsplashUrl(profile.photo, 400, 533)} alt={profile.firstName} className="w-full h-full object-cover" />
                {profile.verified && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <CheckCircle size={14} className="text-[var(--color-lavender)]" />
                    <span className="text-xs font-semibold text-[var(--color-midnight)]">Profil vérifié</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)]">
                    {profile.firstName}, {profile.age}
                  </h1>
                  <span className="text-xs text-green-500 font-medium">{profile.lastSeen}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                  <MapPin size={14} /> {profile.city}
                  <span className="mx-1">·</span>
                  <Briefcase size={14} /> {profile.profession}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={sendRequest}
                    disabled={requested}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      requested ? "bg-[var(--color-beige-dark)] text-slate-400 cursor-not-allowed" : "text-white hover:opacity-90"
                    }`}
                    style={!requested ? { background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" } : {}}
                  >
                    <Send size={15} /> {requested ? "Demande envoyée" : "Envoyer une demande"}
                  </button>
                  <button
                    onClick={() => setFavorite(!favorite)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                      favorite ? "border-red-200 bg-red-50 text-red-400" : "border-[var(--color-beige-dark)] text-slate-600 hover:border-[var(--color-lavender)]"
                    }`}
                  >
                    <Heart size={15} fill={favorite ? "currentColor" : "none"} /> {favorite ? "Retiré des favoris" : "Ajouter aux favoris"}
                  </button>
                  <button onClick={() => setShowReport(true)} className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-red-400 flex items-center justify-center gap-1.5 transition-colors">
                    <Flag size={13} /> Signaler ce profil
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-4">À propos</h2>
              <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-4">Foi & Valeurs</h2>
              <p className="text-slate-500 text-sm mb-4">
                Église : <span className="text-[var(--color-midnight)] font-medium">{profile.church}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.values.map((v) => (
                  <span key={v} className="px-3 py-1.5 rounded-full text-sm font-medium text-white" style={{ background: "var(--color-lavender)" }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-4">Centres d&apos;intérêt</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium border border-[var(--color-beige-dark)] text-slate-600">
                    {i}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-4">Ce que je recherche</h2>
              <p className="text-slate-600 leading-relaxed italic">&quot;{profile.lookingFor}&quot;</p>
            </div>
            <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "var(--color-lavender-light)" }}>
              <CheckCircle size={16} className="text-[var(--color-lavender)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600">Pensez à votre sécurité. Ne partagez pas vos coordonnées personnelles trop tôt et rencontrez-vous d&apos;abord dans un lieu public.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Signaler ce profil</h3>
              <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Vous pouvez aussi utiliser la page{" "}
              <Link href="/signaler" className="text-[var(--color-lavender)] underline">
                Signaler un profil
              </Link>{" "}
              pour plus de détails.
            </p>
            <div className="space-y-2 mb-6">
              {["Faux profil ou usurpation", "Comportement inapproprié", "Contenu offensant", "Spam ou arnaque", "Autre"].map((r) => (
                <label key={r} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[var(--color-beige)] transition-colors">
                  <input type="radio" name="reason" className="accent-[var(--color-midnight)]" /> <span className="text-sm text-slate-700">{r}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => {
                setShowReport(false);
                setSuccess("Signalement envoyé. Merci de nous avoir alertés.");
              }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
            >
              Envoyer le signalement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
