import { useState, useMemo, ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

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
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  stickyHeader?: boolean;
  compact?: boolean;
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
  searchable,
  searchPlaceholder = "Search...",
  searchFn,
  stickyHeader = true,
  compact = false,
}: Props<T>) {
  const [sortCol, setSortCol] = useState<string | null>(defaultSort ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultDirection);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    if (!searchable || !searchQuery || !searchFn) return data;
    return data.filter(row => searchFn(row, searchQuery.toLowerCase()));
  }, [data, searchQuery, searchable, searchFn]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    const col = columns.find(c => c.key === sortCol);
    if (!col?.sortFn) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => dir * col.sortFn!(a, b));
  }, [filtered, sortCol, sortDir, columns]);

  const py = compact ? "py-2" : "py-2.5";
  const px = compact ? "px-2.5" : "px-3";

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {searchable && (
        <div className="px-3 py-2.5 border-b border-border bg-card">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={`${stickyHeader ? "sticky top-0" : ""} bg-muted/30 border-b border-border z-[1]`}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`${py} ${px} text-left text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground ${col.headerClassName || ""} ${col.sortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      sortCol === col.key
                        ? sortDir === "asc"
                          ? <ArrowUp className="h-3 w-3 text-primary" />
                          : <ArrowDown className="h-3 w-3 text-primary" />
                        : <ArrowUpDown className="h-3 w-3 opacity-25" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sorted.map(row => (
              <tr
                key={rowKey(row)}
                className={`hover:bg-muted/20 transition-colors ${onRowClick ? "cursor-pointer" : ""} ${rowClassName?.(row) || ""}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map(col => (
                  <td key={col.key} className={`${py} ${px} ${col.className || ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <div className="p-10 text-center text-muted-foreground text-sm">{emptyMessage}</div>
      )}
      {sorted.length > 0 && (
        <div className="px-3 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
          {sorted.length} {sorted.length === 1 ? "record" : "records"}{searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}