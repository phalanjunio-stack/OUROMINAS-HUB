import type { LucideIcon } from "lucide-react";

export function ComingSoon({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-hub-brown">{title}</h1>
        <p className="text-[13px] text-hub-ink/55">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hub-line bg-white py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-hub-paper text-hub-caramel">
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <p className="font-display text-lg font-semibold text-hub-ink">Módulo em construção</p>
        <p className="max-w-sm text-[13px] text-hub-ink/50">Este módulo está no roteiro do Hub e chega numa próxima etapa, seguindo a mesma base de dados já modelada.</p>
      </div>
    </div>
  );
}
