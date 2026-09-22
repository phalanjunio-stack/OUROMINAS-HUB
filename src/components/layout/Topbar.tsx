"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { initials, formatRelativeDate } from "@/lib/constants";

export type TopbarNotification = {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  link: string | null;
  createdAt: Date;
};

export function Topbar({
  userName,
  userJobTitle,
  userAvatarUrl,
  notifications,
  onSignOut,
}: {
  userName: string;
  userJobTitle: string;
  userAvatarUrl?: string | null;
  notifications: TopbarNotification[];
  onSignOut: () => Promise<void>;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(event.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="flex h-[68px] flex-none items-center gap-5 border-b border-hub-line bg-hub-cream/95 px-6 backdrop-blur">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hub-ink/35" strokeWidth={2} />
        <input
          type="search"
          placeholder="Buscar demandas, arquivos, campanhas, representantes..."
          className="w-full rounded-full border border-hub-line bg-hub-paper/70 py-2.5 pl-10 pr-4 text-sm text-hub-ink placeholder:text-hub-ink/40 outline-none transition focus:border-hub-gold/60 focus:bg-white focus:ring-2 focus:ring-hub-gold/15"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificações"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-hub-line bg-white text-hub-ink/70 transition hover:border-hub-gold/50 hover:text-hub-brown"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hub-red px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-xl border border-hub-line bg-white shadow-xl hub-animate-in">
              <div className="border-b border-hub-line px-4 py-3">
                <p className="text-sm font-bold text-hub-ink">Notificações</p>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && <li className="px-4 py-6 text-center text-sm text-hub-ink/50">Nenhuma notificação.</li>}
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.link ?? "#"}
                      onClick={() => setNotifOpen(false)}
                      className={clsx("block border-b border-hub-line/60 px-4 py-3 text-sm transition hover:bg-hub-paper/60", !n.read && "bg-hub-gold/[0.06]")}
                    >
                      <p className="font-semibold text-hub-ink">{n.title}</p>
                      {n.body && <p className="mt-0.5 text-[13px] text-hub-ink/60">{n.body}</p>}
                      <p className="mt-1 text-[11px] text-hub-ink/40">{formatRelativeDate(n.createdAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button type="button" onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-hub-paper">
            {userAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatarUrl} alt={userName} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hub-brown text-[13px] font-bold text-hub-gold-light">{initials(userName)}</span>
            )}
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[13px] font-bold text-hub-ink">{userName}</span>
              <span className="block text-[11px] text-hub-ink/55">{userJobTitle}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-hub-ink/40" strokeWidth={2} />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-14 z-30 w-52 overflow-hidden rounded-xl border border-hub-line bg-white py-1.5 shadow-xl hub-animate-in">
              <form action={onSignOut}>
                <button type="submit" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-hub-ink/80 transition hover:bg-hub-paper">
                  <LogOut className="h-4 w-4" strokeWidth={1.8} />
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="ml-1 hidden border-l border-hub-line pl-4 text-right lg:block">
          <p className="font-display text-lg font-semibold leading-none text-hub-brown">Ouro de Minas</p>
          <p className="mt-1 text-[9px] font-bold tracking-[0.18em] text-hub-ink/45">DOCES QUE FAZEM BEM</p>
        </div>
      </div>
    </header>
  );
}
