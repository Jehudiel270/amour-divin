"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

interface Conversation {
  id: string;
  profile: { userId: string; firstName: string; city: string; age: number; profession: string; photo: string };
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
}

import Image from "next/image";
interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  time: string;
  isMine: boolean;
}

export default function MessagesInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/conversations")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Conversations indisponibles.");
        if (!active) return;
        setConversations(result.conversations);
        const preferredConversation = new URLSearchParams(window.location.search).get("conversation");
        setActiveId(result.conversations.find((conversation: Conversation) => conversation.id === preferredConversation)?.id ?? result.conversations[0]?.id ?? null);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Conversations indisponibles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let active = true;
    fetch(`/api/conversations/${activeId}/messages`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Messages indisponibles.");
        if (active) setMessages(result.messages);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Messages indisponibles.");
      });
    return () => {
      active = false;
    };
  }, [activeId]);

  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? null;

  const send = async () => {
    if (!activeId || !draft.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch(`/api/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Message non envoyé.");
      setMessages((current) => [...current, {
        ...result.message,
        senderName: "Vous",
        time: new Date(result.message.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        isMine: true,
      }]);
      setConversations((current) => current.map((conversation) => conversation.id === activeId
        ? { ...conversation, lastMessage: { content: draft, createdAt: new Date().toISOString(), senderId: result.message.senderId } }
        : conversation));
      setDraft("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Message non envoyé.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-cream)] pt-16">
      <div className={`w-full flex-col border-r border-[var(--color-beige-dark)] bg-white sm:w-80 ${showList ? "flex" : "hidden sm:flex"}`}>
        <div className="border-b border-[var(--color-beige-dark)] p-5">
          <h1 className="font-display text-xl font-bold text-[var(--color-midnight)]">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-5 text-sm text-slate-400">Chargement...</p>}
          {!loading && conversations.length === 0 && <p className="p-5 text-sm text-slate-500">Vos conversations apparaîtront après l&apos;acceptation d&apos;une demande.</p>}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                setActiveId(conversation.id);
                setMessages([]);
                setShowList(false);
              }}
              className={`flex w-full items-center gap-3 border-b border-[var(--color-beige-dark)]/50 p-4 text-left transition-colors hover:bg-[var(--color-beige)] ${activeId === conversation.id ? "bg-[var(--color-lavender-light)]" : ""}`}
            >
              <Image src={conversation.profile.photo} alt={`Photo de ${conversation.profile.firstName}`} width={48} height={48} sizes="48px" className="h-12 w-12 shrink-0 rounded-2xl object-cover" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[var(--color-midnight)]">{conversation.profile.firstName}</span>
                  {conversation.unreadCount > 0 && <span className="rounded-full bg-[var(--color-lavender)] px-1.5 text-[10px] text-white">{conversation.unreadCount}</span>}
                </span>
                <span className="block truncate text-xs text-slate-500">{conversation.lastMessage?.content ?? "Conversation démarrée"}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${showList ? "hidden sm:flex" : "flex"}`}>
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-[var(--color-beige-dark)] bg-white p-4">
              <button onClick={() => setShowList(true)} aria-label="Retour aux conversations" className="text-slate-500 sm:hidden"><ArrowLeft size={20} /></button>
              <Image src={activeConversation.profile.photo} alt={`Photo de ${activeConversation.profile.firstName}`} width={40} height={40} sizes="40px" className="h-10 w-10 rounded-xl object-cover" />
              <div className="flex-1">
                <Link href={`/profil/${activeConversation.profile.userId}`} className="text-sm font-semibold text-[var(--color-midnight)] hover:underline">{activeConversation.profile.firstName}</Link>
                <p className="text-xs text-slate-500">{activeConversation.profile.city} · {activeConversation.profile.age} ans</p>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6" style={{ background: "var(--color-beige)" }}>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm sm:max-w-sm ${message.isMine ? "rounded-br-sm text-white" : "rounded-bl-sm bg-white text-slate-700 shadow-sm"}`} style={message.isMine ? { background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" } : {}}>
                    <p>{message.content}</p>
                    <p className={`mt-1 text-[10px] ${message.isMine ? "text-white/60" : "text-slate-400"}`}>{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 border-t border-[var(--color-beige-dark)] bg-white p-4">
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && void send()}
                maxLength={4000}
                placeholder="Écrivez un message respectueux..."
                className="flex-1 rounded-xl border border-[var(--color-beige-dark)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]"
              />
              <button onClick={() => void send()} disabled={sending || !draft.trim()} aria-label="Envoyer le message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-50" style={{ background: "var(--color-midnight)" }}>
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">
            {error || "Acceptez une demande pour commencer une conversation."}
          </div>
        )}
      </div>
    </div>
  );
}
