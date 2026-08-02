/** Pure date helpers for building a month grid, independent of any UI framework. */

export function toDateKey(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

export interface CalendarCell {
  inMonth: boolean
  date: string | null
  dayNumber: number | null
}

/** Builds a Monday-first grid of cells (padded to full weeks) for the given month. */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7 // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - firstWeekday + 1
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth
    return {
      inMonth,
      dayNumber: inMonth ? dayNumber : null,
      date: inMonth ? toDateKey(year, month, dayNumber) : null,
    }
  })
}

/** Monday-first weekday labels, e.g. ["lun.", "mar.", ..., "dim."]. */
export function weekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const monday = new Date(2024, 0, 1) // a known Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return formatter.format(d).replace(".", "")
  })
}
