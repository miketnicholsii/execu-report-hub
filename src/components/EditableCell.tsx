import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { useEditableField } from "@/hooks/useEditableField";

interface EditableTextProps {
  entityId: string;
  field: string;
  defaultValue: string;
  className?: string;
  multiline?: boolean;
}

export function EditableText({ entityId, field, defaultValue, className = "", multiline = false }: EditableTextProps) {
  const { value, isEditing, startEdit, cancelEdit, confirmEdit, onChange } = useEditableField(entityId, field, defaultValue);

  if (isEditing) {
    return (
      <div className="flex items-start gap-1">
        {multiline ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded border border-primary bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]" autoFocus onKeyDown={(e) => { if (e.key === "Escape") cancelEdit(); if (e.key === "Enter" && e.metaKey) confirmEdit(); }} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded border border-primary bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary" autoFocus onKeyDown={(e) => { if (e.key === "Escape") cancelEdit(); if (e.key === "Enter") confirmEdit(); }} />
        )}
        <button onClick={confirmEdit} className="p-1 text-status-on-track hover:bg-muted rounded"><Check className="h-3 w-3" /></button>
        <button onClick={cancelEdit} className="p-1 text-destructive hover:bg-muted rounded"><X className="h-3 w-3" /></button>
      </div>
    );
  }

  return (
    <span className={`group inline-flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 ${className}`} onClick={startEdit}>
      <span>{value || "—"}</span>
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />
    </span>
  );
}

interface EditableSelectProps {
  entityId: string;
  field: string;
  defaultValue: string;
  options: string[];
  className?: string;
  renderBadge?: (value: string) => React.ReactNode;
}

export function EditableSelect({ entityId, field, defaultValue, options, className = "", renderBadge }: EditableSelectProps) {
  const { value, isEditing, startEdit, cancelEdit, confirmEdit, onChange } = useEditableField(entityId, field, defaultValue);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <select value={value} onChange={(e) => { onChange(e.target.value); }} className="rounded border border-primary bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary" autoFocus onBlur={() => { confirmEdit(); }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <button onClick={cancelEdit} className="p-1 text-destructive hover:bg-muted rounded"><X className="h-3 w-3" /></button>
      </div>
    );
  }

  return (
    <span className={`group inline-flex items-center gap-1 cursor-pointer ${className}`} onClick={startEdit}>
      {renderBadge ? renderBadge(value) : <span>{value}</span>}
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />
    </span>
  );
}
