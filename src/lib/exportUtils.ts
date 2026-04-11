export function downloadCsvFile(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const encode = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = `${headers.join(",")}\n${rows.map((row) => headers.map((h) => encode(row[h])).join(",")).join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSectionToPdf() {
  window.print();
}
