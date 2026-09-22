"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { authenticate } from "./actions";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hub-brown-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #d4a017 0, transparent 45%), radial-gradient(circle at 85% 80%, #d4a017 0, transparent 40%)" }} />

      <div className="relative grid w-full max-w-[960px] overflow-hidden rounded-2xl border border-white/10 bg-hub-cream shadow-2xl md:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-hub-brown-900 via-hub-brown to-hub-caramel p-10 text-hub-cream md:flex">
          <div className="relative h-16 w-16">
            <Image src="/images/logo-ouro-de-minas.png" alt="Ouro de Minas" fill sizes="64px" className="object-contain" />
          </div>
          <div>
            <p className="font-display text-4xl font-semibold leading-tight text-hub-gold-light">
              Ouro de Minas
              <br />
              Hub
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-hub-cream/70">
              Demandas, aprovações, campanhas e representantes — tudo em um só lugar, com o
              cuidado que a marca merece.
            </p>
          </div>
          <p className="text-[11px] font-bold tracking-[0.3em] text-hub-cream/40">DOCES QUE FAZEM BEM</p>
        </div>

        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
          <div className="mb-8 flex flex-col items-center gap-3 md:hidden">
            <div className="relative h-14 w-14">
              <Image src="/images/logo-ouro-de-minas.png" alt="Ouro de Minas" fill sizes="56px" className="object-contain" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold text-hub-brown">Bem-vinda de volta</h1>
          <p className="mt-1.5 text-sm text-hub-ink/60">Entre com sua conta para acessar o Hub.</p>

          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-hub-ink/55">E-mail</span>
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hub-ink/35" strokeWidth={1.8} />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue="ana.carolina@ourominas.com.br"
                  placeholder="seu.nome@ourominas.com.br"
                  className="w-full rounded-lg border border-hub-line bg-white py-2.5 pl-10 pr-3.5 text-sm text-hub-ink outline-none transition focus:border-hub-gold/60 focus:ring-2 focus:ring-hub-gold/15"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-hub-ink/55">Senha</span>
              <span className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hub-ink/35" strokeWidth={1.8} />
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  defaultValue="ourodeminas123"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-hub-line bg-white py-2.5 pl-10 pr-3.5 text-sm text-hub-ink outline-none transition focus:border-hub-gold/60 focus:ring-2 focus:ring-hub-gold/15"
                />
              </span>
            </label>

            {errorMessage && (
              <p className="rounded-lg bg-hub-red/10 px-3.5 py-2.5 text-[13px] font-medium text-hub-red">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-hub-caramel to-hub-brown py-3 text-sm font-bold text-white shadow-lg shadow-hub-brown/20 transition hover:brightness-110 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Entrar <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-7 rounded-lg border border-hub-line bg-hub-paper/60 px-3.5 py-3 text-[12px] leading-relaxed text-hub-ink/55">
            Ambiente de demonstração — os campos já vêm preenchidos com um usuário de teste
            (Marketing). Dados fictícios, seguros para explorar.
          </p>
        </div>
      </div>
    </div>
  );
}
