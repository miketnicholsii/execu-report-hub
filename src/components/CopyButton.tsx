import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  /** Text to copy. If a function, called on click to produce text. */
  content: string | (() => string);
  /** Optional label shown next to icon. */
  label?: string;
  /** Accessible label for icon-only usage. */
  ariaLabel?: string;
  /** Optional transform before copying (e.g. convert to markdown). */
  transform?: (text: string) => string;
  /** Toast message on success. Default: "Copied to clipboard" */
  successMessage?: string;
  /** Extra CSS classes */
  className?: string;
  /** Render as compact icon-only */
  iconOnly?: boolean;
  /** Size variant */
  size?: "sm" | "md";
}

export default function CopyButton({
  content,
  label,
  ariaLabel,
  transform,
  successMessage = "Copied to clipboard",
  className = "",
  iconOnly = false,
  size = "sm",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      let text = typeof content === "function" ? content() : content;
      if (transform) text = transform(text);

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [content, transform, successMessage]);

  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const padding = iconOnly
    ? size === "sm" ? "p-1" : "p-1.5"
    : size === "sm" ? "px-2 py-1" : "px-2.5 py-1.5";

  return (
    <button
      onClick={handleCopy}
      aria-label={ariaLabel || label || "Copy to clipboard"}
      title={copied ? "Copied!" : label || "Copy"}
      className={`inline-flex items-center gap-1 rounded-md border text-[11px] font-medium transition-all print:hidden
        ${copied
          ? "border-status-on-track/30 bg-status-on-track/10 text-status-on-track"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${padding} ${className}`}
    >
      {copied ? (
        <Check className={iconSize} />
      ) : (
        <Copy className={iconSize} />
      )}
      {!iconOnly && (
        <span>{copied ? "Copied" : label || "Copy"}</span>
      )}
    </button>
  );
}

/* Helper: format table rows as TSV for clipboard */
export function rowsToTsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join("\t"),
    ...rows.map(row => headers.map(h => String(row[h] ?? "").replace(/[\t\n]/g, " ")).join("\t")),
  ];
  return lines.join("\n");
}

/* Helper: format a summary block as copyable markdown */
export function summaryToMarkdown(sections: { heading: string; items: string[] }[]): string {
  return sections
    .map(s => `## ${s.heading}\n${s.items.map(i => `- ${i}`).join("\n")}`)
    .join("\n\n");
}