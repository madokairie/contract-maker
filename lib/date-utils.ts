export function toWareki(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const reiwaYear = year - 2018;
  return `令和${reiwaYear}年${month}月${day}日`;
}

export function addMonths(dateStr: string, months: number): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function formatDateInput(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
