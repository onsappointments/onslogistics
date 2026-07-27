export function fmtDate(d?: string | Date | null): string | null {
  if (!d) return null;

  const dt = new Date(d as string);

  if (isNaN(dt.getTime())) return null;

  const hasTime =
    dt.getUTCHours() !== 0 ||
    dt.getUTCMinutes() !== 0 ||
    dt.getUTCSeconds() !== 0;

  if (hasTime) {
    return dt.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toDateValue(
  val?: string | null
): string | Date | null {
  if (!val) return null;

  const trimmed = typeof val === "string" ? val.trim() : "";

  if (!trimmed) return null;

  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const d = new Date(trimmed);

  return isNaN(d.getTime()) ? null : d;
}