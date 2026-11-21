import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-green-200 bg-green-50 text-green-700",
  accepted: "border-green-200 bg-green-50 text-green-700",
  active: "border-green-200 bg-green-50 text-green-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  closed: "border-gray-200 bg-gray-100 text-gray-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant='outline' className={`capitalize ${styles[status] ?? ""}`}>
      {status}
    </Badge>
  );
}
