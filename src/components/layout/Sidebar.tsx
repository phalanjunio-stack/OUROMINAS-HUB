"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar({ pendingApprovals }: { pendingApprovals: number }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[248px] flex-none flex-col bg-gradient-to-b from-hub-brown-950 to-hub-brown-900 text-hub-cream">
      <div className="flex flex-col items-center gap-2 px-5 pb-6 pt-7 text-center">
        <div className="relative h-14 w-14">
          <Image src="/images/logo-ouro-de-minas.png" alt="Ouro de Minas" fill sizes="56px" className="object-contain" />
        </div>
        <div>
          <p className="font-display text-xl leading-none font-semibold tracking-wide text-hub-gold-light">Ouro de Minas</p>
          <p className="mt-1 text-[11px] font-bold tracking-[0.35em] text-hub-cream/70">HUB</p>
        </div>
        <p className="mt-2 text-[10px] leading-tight tracking-[0.12em] text-hub-cream/45 uppercase">
          Tradição que conecta sabores
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const badgeValue = item.badgeKey === "pendingApprovals" ? pendingApprovals : undefined;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                    active ? "bg-hub-gold/15 text-hub-gold-light" : "text-hub-cream/70 hover:bg-white/5 hover:text-hub-cream",
                  )}
                >
                  <item.icon className={clsx("h-[18px] w-[18px] flex-none", active ? "text-hub-gold" : "text-hub-cream/50 group-hover:text-hub-cream/80")} strokeWidth={1.8} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {!!badgeValue && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-hub-gold px-1 text-[11px] font-bold text-hub-brown-950">
                      {badgeValue}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative mx-3 mb-4 overflow-hidden rounded-xl border border-hub-line-soft bg-black/20 px-4 py-5">
        <svg viewBox="0 0 200 60" className="absolute inset-x-0 bottom-0 h-14 w-full text-hub-gold/15" fill="currentColor" aria-hidden="true">
          <path d="M0 60 L35 18 L60 42 L95 5 L130 40 L160 22 L200 60 Z" />
        </svg>
        <p className="relative font-display text-[15px] leading-snug text-hub-cream/85">
          Mais que doces,
          <br />
          relacionamentos que adoçam.
        </p>
      </div>
    </aside>
  );
}
