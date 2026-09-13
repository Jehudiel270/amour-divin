"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle, ArrowLeft } from "lucide-react";

import { PROFILES, unsplashUrl } from "@/data/profiles";
import { MESSAGES } from "@/data/messages";
import type { Message } from "@/types";

const CONVERSATIONS = PROFILES.slice(0, 5).map((p, i) => ({
  profile: p,
  lastMessage: ["Comme c'est beau ! Je suis...", "Bonjour, comment allez-vous ?", "Merci pour ce bel échange", "À bientôt j'espère !", "Avec plaisir, on se dit ça"][i],
  time: ["15:28", "Hier", "Lundi", "12 jan.", "10 jan."][i],
  unread: i === 0 ? 2 : 0,
}));

export default function Messages() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].profile.id);
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [draft, setDraft] = useState("");
  const [showList, setShowList] = useState(true);

  const active = CONVERSATIONS.find((c) => c.profile.id === activeId)!;

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: String(prev.length + 1), sender: "Moi", content: draft, time: "À l'instant", isMine: true }]);
    setDraft("");
  };

  return (
    <div className="h-screen bg-[var(--color-cream)] pt-16 flex overflow-hidden">
      {/* Conversation list */}
      <div className={`w-full sm:w-80 border-r border-[var(--color-beige-dark)] bg-white flex-col ${showList ? "flex" : "hidden sm:flex"}`}>
        <div className="p-5 border-b border-[var(--color-beige-dark)]">
          <h1 className="font-display text-xl font-bold text-[var(--color-midnight)]">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <button
              key={c.profile.id}
              onClick={() => {
                setActiveId(c.profile.id);
                setShowList(false);
              }}
              className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-[var(--color-beige-dark)]/50 hover:bg-[var(--color-beige)] ${
                activeId === c.profile.id ? "bg-[var(--color-lavender-light)]" : ""
              }`}
            >
              <img src={unsplashUrl(c.profile.photo, 80, 80)} alt={c.profile.firstName} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-[var(--color-midnight)] truncate">{c.profile.firstName}</p>
                  <span className="text-xs text-slate-400 flex-shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: "var(--color-lavender)" }}>
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active conversation */}
      <div className={`flex-1 flex-col ${showList ? "hidden sm:flex" : "flex"}`}>
        <div className="flex items-center gap-3 p-4 border-b border-[var(--color-beige-dark)] bg-white">
          <button onClick={() => setShowList(true)} className="sm:hidden text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <img src={unsplashUrl(active.profile.photo, 80, 80)} alt={active.profile.firstName} className="w-10 h-10 rounded-xl object-cover" />
          <div className="flex-1">
            <Link href={`/profil/${active.profile.id}`} className="font-semibold text-sm text-[var(--color-midnight)] hover:underline flex items-center gap-1">
              {active.profile.firstName}
              {active.profile.verified && <CheckCircle size={12} className="text-[var(--color-lavender)]" />}
            </Link>
            <p className="text-xs text-green-500">{active.profile.lastSeen}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: "var(--color-beige)" }}>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${m.isMine ? "text-white rounded-br-sm" : "bg-white text-slate-700 rounded-bl-sm shadow-sm"}`}
                style={m.isMine ? { background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" } : {}}
              >
                <p>{m.content}</p>
                <p className={`text-[10px] mt-1 ${m.isMine ? "text-white/60" : "text-slate-400"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-[var(--color-beige-dark)] flex items-center gap-3">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Écrivez un message respectueux..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
          />
          <button
            onClick={send}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
