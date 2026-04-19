import { getStatusColor } from "@/lib/utils";

interface Props {
  status: string;
}

const labels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  ready: "Ready",
  updated: "Updated",
};

export default function StatusBadge({ status }: Props) {
  const { bg, text } = getStatusColor(status);
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
      {labels[status] ?? status}
    </span>
  );
}
