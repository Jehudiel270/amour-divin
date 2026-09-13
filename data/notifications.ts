import type { AppNotification } from "@/types";

export const NOTIFICATIONS: AppNotification[] = [
  { id: "1", type: "match", text: "Vous avez un nouveau match avec Sophie !", time: "Il y a 5 min", read: false, icon: "💝" },
  { id: "2", type: "request", text: "Emma vous a envoyé une demande de connexion.", time: "Il y a 1 heure", read: false, icon: "💌" },
  { id: "3", type: "message", text: 'Nouveau message de Théo : "Bonjour, comment allez-vous ?"', time: "Il y a 2 heures", read: false, icon: "✉️" },
  { id: "4", type: "verified", text: "Votre profil a été vérifié avec succès. Vous avez maintenant le badge vérifié !", time: "Hier", read: true, icon: "✅" },
  { id: "5", type: "request", text: "Chloé a accepté votre demande de connexion.", time: "Hier", read: true, icon: "🤝" },
  { id: "6", type: "match", text: "Nouveau match avec Amara !", time: "Il y a 3 jours", read: true, icon: "💝" },
];
