import Link from "next/link";
import { Heart, Eye, Send, CheckCircle } from "lucide-react";

import type { Profile } from "@/types";
import { unsplashUrl } from "@/data/profiles";

interface ProfileCardProps {
  profile: Profile;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  showActions?: boolean;
}

export default function ProfileCard({ profile, onFavorite, isFavorite, showActions = true }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-beige)]">
        <img
          src={unsplashUrl(profile.photo, 400, 500)}
          alt={profile.firstName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {profile.verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <CheckCircle size={12} className="text-[var(--color-lavender)]" />
            <span className="text-xs font-medium text-[var(--color-midnight)]">Vérifié</span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white font-display font-semibold text-lg">
            {profile.firstName}, {profile.age}
          </p>
          <p className="text-white/80 text-sm">{profile.city}</p>
        </div>
      </div>
      {showActions && (
        <div className="p-4 flex gap-2">
          <Link
            href={`/profil/${profile.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] text-[var(--color-midnight)] hover:bg-[var(--color-beige)] transition-colors"
          >
            <Eye size={15} /> Voir
          </Link>
          <button
            onClick={() => onFavorite?.(profile.id)}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${
              isFavorite ? "bg-red-50 border-red-200 text-red-400" : "border-[var(--color-beige-dark)] text-slate-400 hover:border-red-200 hover:text-red-400"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
          >
            <Send size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
