const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "2027-05" -> "May 2027"; "2027" -> "2027". Throws on anything else, so bad data is never shown. */
export function formatMonth(date: string): string {
  const match = /^(\d{4})(?:-(\d{2}))?$/.exec(date);
  if (!match) throw new Error(`Invalid date: ${date}`);
  const [, year, month] = match;
  if (!month) return year ?? date;
  const index = Number(month) - 1;
  const name = MONTHS[index];
  if (!name) throw new Error(`Invalid month in date: ${date}`);
  return `${name} ${year}`;
}

/** "2026-05" + "2026-09" -> "May 2026 – September 2026"; open end -> "May 2026 – now". */
export function formatRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (!start) return end ? formatMonth(end) : '';
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'now'}`;
}
