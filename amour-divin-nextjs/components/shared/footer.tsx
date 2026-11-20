import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, #0d1b38 100%)" }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
                <span className="text-white font-display font-bold text-lg">AD</span>
              </div>
              <span className="font-display text-xl font-semibold">Église Amour Divin</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Une plateforme de rencontres sérieuses pour jeunes adultes chrétiens, fondée sur la foi, le respect et l&apos;authenticité.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-xs text-slate-400">Plateforme sécurisée et vérifiée</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--color-gold-light)]">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                ["/", "Accueil"],
                ["/a-propos", "Nos valeurs"],
                ["/comment-ca-marche", "Comment ça marche"],
                ["/securite", "Sécurité"],
                ["/faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--color-gold-light)]">Légal</h4>
            <ul className="space-y-2.5">
              {[
                ["/conditions", "Conditions d'utilisation"],
                ["/confidentialite", "Confidentialité"],
                ["/contact", "Contact"],
                ["/signaler", "Signaler un problème"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© 2026 Église Amour Divin. Tous droits réservés.</p>
          <p className="text-xs text-slate-500">Réservé aux adultes de 18 ans et plus · Avec amour ✝</p>
        </div>
      </div>
    </footer>
  );
}
