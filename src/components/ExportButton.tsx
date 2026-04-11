import { Download } from "lucide-react";

interface Props {
  label: string;
  onClick: () => void;
}

export default function ExportButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors print:hidden"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
