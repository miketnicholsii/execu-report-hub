import { useState, useMemo, ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  emptyMessage?: string;
  defaultSort?: string;
  defaultDirection?: "asc" | "desc";
}

export default function SortableTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  rowClassName,
  emptyMessage = "No data found.",
  defaultSort,
  defaultDirection = "asc",
}: Props<T>) {
  const [sortCol, setSortCol] = useState<string | null>(defaultSort ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultDirection);

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    const col = columns.find(c => c.key === sortCol);
    if (!col?.sortFn) return data;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...data].sort((a, b) => dir * col.sortFn!(a, b));
  }, [data, sortCol, sortDir, columns]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-card border-b border-border z-[1]">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={`py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${col.headerClassName || ""} ${col.sortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""}`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    sortCol === col.key
                      ? sortDir === "asc"
                        ? <ArrowUp className="h-3 w-3 text-primary" />
                        : <ArrowDown className="h-3 w-3 text-primary" />
                      : <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map(row => (
            <tr
              key={rowKey(row)}
              className={`hover:bg-muted/30 transition-colors ${onRowClick ? "cursor-pointer" : ""} ${rowClassName?.(row) || ""}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map(col => (
                <td key={col.key} className={`py-2.5 px-3 ${col.className || ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="p-8 text-center text-muted-foreground text-sm">{emptyMessage}</div>
      )}
    </div>
  );
}
