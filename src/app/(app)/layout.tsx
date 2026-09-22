import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { signOutAction } from "./actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [pendingApprovals, notifications] = await Promise.all([
    prisma.approval.count({ where: { approverId: session.user.id, status: "PENDENTE" } }),
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-hub-paper">
      <Sidebar pendingApprovals={pendingApprovals} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={session.user.name ?? "Usuário"}
          userJobTitle={session.user.jobTitle ?? ""}
          userAvatarUrl={session.user.image}
          notifications={notifications}
          onSignOut={signOutAction}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
