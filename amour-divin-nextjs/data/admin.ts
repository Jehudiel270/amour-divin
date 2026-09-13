import type { AdminUser, AdminReport } from "@/types";

export const ADMIN_STATS = [
  { label: "Membres inscrits", value: "12 438", change: "+142 ce mois", color: "var(--color-midnight)", bg: "var(--color-lavender-light)" },
  { label: "Nouveaux profils", value: "87", change: "Cette semaine", color: "#4caf7d", bg: "#f0faf4" },
  { label: "Signalements actifs", value: "14", change: "3 urgents", color: "#e05c4e", bg: "#fef3f2" },
  { label: "Profils à vérifier", value: "31", change: "En attente", color: "var(--color-gold)", bg: "#fef9ef" },
];

export const RECENT_USERS = [
  { name: "Marie Laurent", email: "marie.l@example.com", city: "Paris", date: "Il y a 2h", status: "pending" },
  { name: "Jonas Koffi", email: "jonas.k@example.com", city: "Lyon", date: "Il y a 4h", status: "verified" },
  { name: "Esther Müller", email: "esther.m@example.com", city: "Strasbourg", date: "Il y a 6h", status: "pending" },
  { name: "David Nkosi", email: "david.n@example.com", city: "Bordeaux", date: "Hier", status: "verified" },
  { name: "Clara Petit", email: "clara.p@example.com", city: "Nantes", date: "Hier", status: "suspended" },
];

export const RECENT_REPORTS_SUMMARY = [
  { id: "SIG-001", reporter: "Sophie M.", target: "Jean P.", reason: "Faux profil", date: "Il y a 1h", status: "urgent" },
  { id: "SIG-002", reporter: "Thomas L.", target: "Inconnu K.", reason: "Comportement inapproprié", date: "Il y a 3h", status: "pending" },
  { id: "SIG-003", reporter: "Amara D.", target: "Marc R.", reason: "Spam", date: "Hier", status: "resolved" },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: "1", name: "Sophie Martin", email: "sophie.m@example.com", city: "Paris", age: 26, joinDate: "12 jan. 2025", status: "verified", reports: 0 },
  { id: "2", name: "Théo Bernard", email: "theo.b@example.com", city: "Lyon", age: 29, joinDate: "10 jan. 2025", status: "verified", reports: 0 },
  { id: "3", name: "Amara Diallo", email: "amara.d@example.com", city: "Bordeaux", age: 24, joinDate: "8 jan. 2025", status: "pending", reports: 0 },
  { id: "4", name: "Lucas Petit", email: "lucas.p@example.com", city: "Marseille", age: 31, joinDate: "7 jan. 2025", status: "verified", reports: 1 },
  { id: "5", name: "Chloé Dupont", email: "chloe.d@example.com", city: "Nantes", age: 23, joinDate: "5 jan. 2025", status: "pending", reports: 0 },
  { id: "6", name: "Nathan Rousseau", email: "nathan.r@example.com", city: "Toulouse", age: 27, joinDate: "3 jan. 2025", status: "suspended", reports: 3 },
  { id: "7", name: "Emma Weber", email: "emma.w@example.com", city: "Strasbourg", age: 28, joinDate: "2 jan. 2025", status: "verified", reports: 0 },
  { id: "8", name: "Raphaël Moreau", email: "raphael.m@example.com", city: "Paris", age: 33, joinDate: "1 jan. 2025", status: "pending", reports: 0 },
];

export const ADMIN_REPORTS: AdminReport[] = [
  { id: "SIG-001", reporter: "Sophie Martin", reporterEmail: "sophie.m@example.com", target: "Jean Pascale", reason: "Faux profil ou usurpation d'identité", desc: "Le profil utilise des photos qui ne sont pas réelles. J'ai fait une recherche et trouvé les mêmes photos sur un autre site.", date: "17 jan. 2025, 14:32", status: "urgent" },
  { id: "SIG-002", reporter: "Thomas Lambert", reporterEmail: "thomas.l@example.com", target: "Karim Inconnu", reason: "Comportement harcelant", desc: "Cette personne m'envoie des messages insistants après que j'ai refusé sa demande.", date: "17 jan. 2025, 11:20", status: "pending" },
  { id: "SIG-003", reporter: "Amara Diallo", reporterEmail: "amara.d@example.com", target: "Marc Richard", reason: "Spam ou escroquerie", desc: "Me demande de l'argent après seulement 2 messages.", date: "16 jan. 2025, 19:05", status: "pending" },
  { id: "SIG-004", reporter: "Clara Petit", reporterEmail: "clara.p@example.com", target: "Stéphane M.", reason: "Contenu offensant", desc: "A envoyé des messages vulgaires non sollicités.", date: "15 jan. 2025, 08:44", status: "resolved" },
  { id: "SIG-005", reporter: "Nathan R.", reporterEmail: "nathan.r@example.com", target: "Utilisateur supprimé", reason: "Faux profil", desc: "Profil mineur suspect.", date: "14 jan. 2025, 16:30", status: "resolved" },
];
