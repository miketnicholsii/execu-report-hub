function encode(value: unknown) {
  return `"${String(value ?? "").split('"').join('""')}"`;
}

export function toCsvString(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return `${headers.join(",")}\n${rows.map((r) => headers.map((h) => encode(r[h])).join(",")).join("\n")}`;
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const csv = toCsvString(rows);
  if (!csv) return;
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPdf() {
  window.print();
}
