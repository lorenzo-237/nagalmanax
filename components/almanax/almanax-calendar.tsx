"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"

import "./almanax.css"
import { buildMonthGrid, toDateKey, weekdayLabels } from "@/lib/calendar"
import { useAlmanaxMonth } from "@/hooks/use-almanax-month"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlmanaxDayCell } from "@/components/almanax/almanax-day-cell"
import { AlmanaxDayDialog } from "@/components/almanax/almanax-day-dialog"
import { almanaxBodyFont, almanaxHeadingFont } from "@/components/almanax/fonts"

const LOCALE = "fr"

export function AlmanaxCalendar() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [numChars, setNumChars] = useLocalStorage("almanax-num-chars", 1)
  const [prepared, setPrepared] = useLocalStorage<Record<string, boolean>>("almanax-prepared", {})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { days, loading, error, retry } = useAlmanaxMonth(cursor.year, cursor.month, LOCALE)

  const cells = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor.year, cursor.month])
  const labels = useMemo(() => weekdayLabels(LOCALE), [])
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" }).format(
        new Date(cursor.year, cursor.month, 1)
      ),
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

  function togglePrepared(date: string) {
    setPrepared((prev) => {
      const next = { ...prev }
      if (next[date]) delete next[date]
      else next[date] = true
      return next
    })
  }

  return (
    <div
      className={`${almanaxHeadingFont.variable} ${almanaxBodyFont.variable} almanax min-h-svh px-4 py-6 sm:px-6 sm:py-8`}
    >
      <div className="mx-auto max-w-5xl">
        <header
          className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b pb-4"
          style={{ borderColor: "var(--am-divider)" }}
        >
          <div>
            <div
              className="almanax-heading text-[13px] font-semibold tracking-wider uppercase"
              style={{ color: "var(--am-accent-400)" }}
            >
              Dofus
            </div>
            <h1 className="almanax-heading mt-0.5 text-3xl font-normal sm:text-4xl">
              Almanax — ressources du mois
            </h1>
          </div>

          <label className="flex flex-col gap-1 text-[13px]" style={{ color: "var(--am-neutral-500)" }}>
            Nombre de personnages
            <div
              className="flex items-center gap-1.5 rounded-sm border px-1.5 py-1"
              style={{ borderColor: "var(--am-divider)" }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Moins"
                onClick={() => setChars(numChars - 1)}
                className="size-7 rounded-md text-current hover:bg-white/10"
              >
                <Minus className="size-3.5" />
              </Button>
              <Input
                type="number"
                min={1}
                max={20}
                value={numChars}
                onChange={(e) => setChars(Number(e.target.value))}
                className="h-auto w-11 rounded-none border-none bg-transparent p-0 text-center text-base tabular-nums shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Plus"
                onClick={() => setChars(numChars + 1)}
                className="size-7 rounded-md text-current hover:bg-white/10"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </label>
        </header>

        <div className="mb-4 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => changeMonth(-1)}
            className="rounded-md px-2 text-current hover:bg-white/10"
            style={{ color: "var(--am-accent)" }}
          >
            <ChevronLeft className="size-4" /> Précédent
          </Button>
          <div className="almanax-heading text-2xl font-semibold capitalize">{monthLabel}</div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => changeMonth(1)}
            className="rounded-md px-2 text-current hover:bg-white/10"
            style={{ color: "var(--am-accent)" }}
          >
            Suivant <ChevronRight className="size-4" />
          </Button>
        </div>

        {error ? (
          <div
            className="rounded-md border p-4 text-center"
            style={{ borderColor: "var(--am-accent-300)" }}
          >
            <div className="almanax-heading text-lg font-semibold">
              Impossible de charger l&apos;Almanax
            </div>
            <div className="text-sm opacity-80">
              L&apos;API dofusdu.de est peut-être hors ligne ou injoignable depuis ce navigateur.
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={retry}
              className="mt-3 rounded-md border"
              style={{ borderColor: "var(--am-divider)", color: "var(--am-text)", background: "transparent" }}
            >
              Réessayer
            </Button>
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-7 border-t border-l"
              style={{ borderColor: "var(--am-divider)" }}
            >
              {labels.map((label) => (
                <div
                  key={label}
                  className="almanax-heading border-r border-b px-2.5 py-2 text-xs tracking-wider uppercase"
                  style={{
                    borderColor: "var(--am-divider)",
                    color: "var(--am-neutral-400)",
                    background: "var(--am-surface)",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l" style={{ borderColor: "var(--am-divider)" }}>
              {cells.map((cell, i) =>
                cell.inMonth && cell.date && cell.dayNumber ? (
                  <AlmanaxDayCell
                    key={cell.date}
                    dayNumber={cell.dayNumber}
                    day={days.get(cell.date)}
                    loading={loading}
                    isToday={cell.date === todayKey}
                    isPrepared={!!prepared[cell.date]}
                    numChars={numChars}
                    onTogglePrepared={() => togglePrepared(cell.date!)}
                    onOpenDetails={() => setSelectedDate(cell.date)}
                  />
                ) : (
                  <div
                    key={`empty-${i}`}
                    className="border-r border-b opacity-35"
                    style={{ borderColor: "var(--am-divider)" }}
                  />
                )
              )}
            </div>
          </div>
        )}

        <AlmanaxDayDialog
          date={selectedDate}
          day={selectedDate ? days.get(selectedDate) : undefined}
          locale={LOCALE}
          onClose={() => setSelectedDate(null)}
        />

        <div className="my-6 h-px" style={{ background: "var(--am-divider)" }} />
        <p className="text-center text-xs" style={{ color: "var(--am-neutral-700)" }}>
          Données Almanax fournies par l&apos;API publique{" "}
          <a href="https://github.com/dofusdude/almanax-api" target="_blank" rel="noopener noreferrer">
            dofusdude/almanax-api
          </a>
          .
        </p>
      </div>
    </div>
  )
}
