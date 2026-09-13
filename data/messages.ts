import type { Message } from "@/types";

export const MESSAGES: Message[] = [
  {
    id: "1",
    sender: "Sophie",
    content: "Bonjour ! J'ai vu ton profil et j'ai adoré ce que tu as écrit sur ta foi. Tu es de quelle église exactement ?",
    time: "14:32",
    isMine: false,
  },
  {
    id: "2",
    sender: "Moi",
    content: "Bonjour Sophie ! Merci beaucoup. Je fais partie de la communauté Timothée à Paris. Et toi, tu es dans le 15e ?",
    time: "14:45",
    isMine: true,
  },
  {
    id: "3",
    sender: "Sophie",
    content: "Oui exactement ! C'est une belle église. Tu y sers dans un ministère particulier ?",
    time: "15:02",
    isMine: false,
  },
  {
    id: "4",
    sender: "Moi",
    content: "Je fais partie de l'équipe de louange. C'est une vraie joie. Et toi ?",
    time: "15:15",
    isMine: true,
  },
  {
    id: "5",
    sender: "Sophie",
    content: "Comme c'est beau ! Je suis dans le ministère jeunesse. J'adorerais te parler de vive voix un jour. Tu habites dans quel arrondissement ?",
    time: "15:28",
    isMine: false,
  },
];
