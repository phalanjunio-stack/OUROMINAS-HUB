export type DemandCardData = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  materialType: string;
  position: number;
  requester: { id: string; name: string };
  assignee: { id: string; name: string } | null;
  campaign: { id: string; name: string; color: string | null } | null;
  _count: { comments: number; versions: number; checklist: number };
};
