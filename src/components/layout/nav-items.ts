import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  CalendarDays,
  Send,
  Image as ImageIcon,
  FolderOpen,
  Megaphone,
  Users,
  FileBadge2,
  Wallet,
  FileBarChart2,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: "pendingApprovals";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/demandas", label: "Demandas", icon: ClipboardList },
  { href: "/aprovacoes", label: "Aprovações", icon: CheckCircle2, badgeKey: "pendingApprovals" },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/publicados", label: "Publicados", icon: Send },
  { href: "/galeria", label: "Galeria", icon: ImageIcon },
  { href: "/drive", label: "Drive", icon: FolderOpen },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/representantes", label: "Representantes", icon: Users },
  { href: "/materiais", label: "Materiais Comerciais", icon: FileBadge2 },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart2 },
  { href: "/administracao", label: "Administração", icon: Settings },
];
