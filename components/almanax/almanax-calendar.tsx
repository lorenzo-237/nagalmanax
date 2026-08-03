"use client"

import { useMemo, useState } from "react"

import "./almanax.css"
import { buildMonthGrid, toDateKey, weekdayLabels } from "@/lib/calendar"
import { type AlmanaxDayStatus, nextDayStatus } from "@/lib/day-status"
import { useAlmanaxMonth } from "@/hooks/use-almanax-month"
import { useAlmanaxToday } from "@/hooks/use-almanax-today"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { AlmanaxDayCell } from "@/components/almanax/almanax-day-cell"
import { AlmanaxDayDialog } from "@/components/almanax/almanax-day-dialog"
import { AlmanaxDayList } from "@/components/almanax/almanax-day-list"
import { AlmanaxTodaySpotlight } from "@/components/almanax/almanax-today-spotlight"
import { AlmanaxTopBar } from "@/components/almanax/almanax-top-bar"
import { almanaxHeadingFont } from "@/components/almanax/fonts"

const LOCALE = "fr"

export function AlmanaxCalendar() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [numChars, setNumChars] = useLocalStorage("almanax-num-chars", 1)
  const [dayStatus, setDayStatus] = useLocalStorage<
    Record<string, AlmanaxDayStatus>
  >("almanax-day-status", {})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { days, loading, error, retry } = useAlmanaxMonth(
    cursor.year,
    cursor.month,
    LOCALE
  )
  const { day: today, loading: todayLoading } = useAlmanaxToday(LOCALE)

  const cells = useMemo(
    () => buildMonthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  )
  const weekCount = cells.length / 7
  const labels = useMemo(() => weekdayLabels(LOCALE), [])
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(LOCALE, {
        month: "long",
        year: "numeric",
      }).format(new Date(cursor.year, cursor.month, 1)),
    [cursor.year, cursor.month]
  )
  const todayKey = useMemo(() => {
    const now = new Date()
    return toDateKey(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  function changeMonth(delta: number) {
    setCursor(({ year, month }) => {
      const next = month + delta
      if (next < 0) return { year: year - 1, month: 11 }
      if (next > 11) return { year: year + 1, month: 0 }
      return { year, month: next }
    })
  }

  function setChars(value: number) {
    const clamped = Math.max(1, Math.min(20, Math.round(value) || 1))
    setNumChars(clamped)
  }

  function cycleStatus(date: string) {
    setDayStatus((prev) => {
      const next = nextDayStatus(prev[date] ?? "none")
      const updated = { ...prev }
      if (next === "none") delete updated[date]
      else updated[date] = next
      return updated
    })
  }

  return (
    <div
      className={`${almanaxHeadingFont.variable} flex flex-col bg-background px-4 py-3 text-foreground sm:px-6 md:h-svh md:overflow-hidden`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col md:h-full md:min-h-0">
        <AlmanaxTopBar
          monthLabel={monthLabel}
          numChars={numChars}
          onChangeChars={setChars}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
        />

        <AlmanaxTodaySpotlight
          day={today}
          loading={todayLoading}
          numChars={numChars}
          locale={LOCALE}
          onOpenDetails={() => setSelectedDate(todayKey)}
        />

        {error ? (
          <div className="rounded-md border border-destructive/40 p-4 text-center">
            <div className="almanax-heading text-lg font-semibold">
              Impossible de charger l&apos;Almanax
            </div>
            <div className="text-sm text-muted-foreground">
              L&apos;API dofusdu.de est peut-être hors ligne ou injoignable
              depuis ce navigateur.
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={retry}
              className="mt-3 rounded-md"
            >
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            {/* Kiosk grid — second-screen layout, md and up, fills the viewport, never scrolls. */}
            <div className="hidden min-h-0 flex-1 flex-col md:flex">
              <div className="grid shrink-0 grid-cols-7 border-t border-l border-border">
                {labels.map((label) => (
                  <div
                    key={label}
                    className="almanax-heading border-r border-b border-border bg-card px-2.5 py-1.5 text-xs tracking-wider text-muted-foreground uppercase"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div
                className="grid min-h-0 flex-1 grid-cols-7 border-l border-border"
                style={{ gridTemplateRows: `repeat(${weekCount}, minmax(0, 1fr))` }}
              >
                {cells.map((cell, i) =>
                  cell.inMonth && cell.date && cell.dayNumber ? (
                    <AlmanaxDayCell
                      key={cell.date}
                      dayNumber={cell.dayNumber}
                      day={days.get(cell.date)}
                      loading={loading}
                      isToday={cell.date === todayKey}
                      status={dayStatus[cell.date] ?? "none"}
                      numChars={numChars}
                      onCycleStatus={() => cycleStatus(cell.date!)}
                      onOpenDetails={() => setSelectedDate(cell.date)}
                    />
                  ) : (
                    <div
                      key={`empty-${i}`}
                      className="border-r border-b border-border opacity-35"
                    />
                  )
                )}
              </div>
            </div>

            {/* Simple list — below md, essentials only, page scrolls normally. */}
            <div className="md:hidden">
              <AlmanaxDayList
                cells={cells}
                days={days}
                loading={loading}
                todayKey={todayKey}
                dayStatus={dayStatus}
                numChars={numChars}
                locale={LOCALE}
                onCycleStatus={cycleStatus}
                onOpenDetails={setSelectedDate}
              />
            </div>
          </>
        )}

        <AlmanaxDayDialog
          date={selectedDate}
          day={
            selectedDate
              ? (days.get(selectedDate) ?? (selectedDate === todayKey ? (today ?? undefined) : undefined))
              : undefined
          }
          locale={LOCALE}
          onClose={() => setSelectedDate(null)}
        />

        <p className="shrink-0 pt-1 text-center text-[10px] text-muted-foreground">
          Données Almanax fournies par l&apos;API publique{" "}
          <a
            href="https://github.com/dofusdude/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            dofusdude/api-docs
          </a>
          .
        </p>
      </div>
    </div>
  )
}
