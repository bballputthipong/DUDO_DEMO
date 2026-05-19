export interface Period {
  start: Date;
  end: Date;
}

export function startOfMonth(month: string): Date {
  const [yearPart, monthPart] = month.split('-');
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  return new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
}

export function endOfMonth(month: string): Date {
  const [yearPart, monthPart] = month.split('-');
  const year = Number(yearPart);
  const monthIndex = Number(monthPart);
  return new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59, 999));
}

export function currentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function parsePeriod(start: string, end: string): Period {
  return {
    start: new Date(start),
    end: new Date(end),
  };
}
