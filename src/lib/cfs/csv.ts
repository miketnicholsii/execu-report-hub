import { ActionItem, RawSourceRow, TrackerItem } from "@/lib/cfs/model";

function encode(value: unknown) {
  return `"${String(value ?? "").split('"').join('""')}"`;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => encode(row[header])).join(",")).join("\n");
  return `${headers.join(",")}\n${body}`;
}

export function downloadCsv(filename: string, csvText: string) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportTrackerCsv(items: TrackerItem[]) {
  return toCsv(items.map((item) => ({ ...item, raw_record: JSON.stringify(item.raw_record) })));
}

export function exportActionCsv(items: ActionItem[]) {
  return toCsv(items as unknown as Record<string, unknown>[]);
}

export function exportRawRowsCsv(rows: RawSourceRow[]) {
  return toCsv(rows.map((row) => ({ ...row, raw_record: JSON.stringify(row.raw_record) })));
}
