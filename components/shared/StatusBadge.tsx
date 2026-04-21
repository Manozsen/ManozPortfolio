import { getStatusColor } from "@/lib/utils";

interface Props { status: string; }

const labels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  ready: "Ready",
  updated: "Updated",
};

export default function StatusBadge({ status }: Props) {
  const { bg, text, dot } = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {labels[status] ?? status}
    </span>
  );
}
