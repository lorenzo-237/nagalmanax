"use client"

import Image from "next/image"
import { Check, CheckCheck, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import type { CalendarCell } from "@/lib/calendar"
import type { AlmanaxDay } from "@/lib/api"
import type { AlmanaxDayStatus } from "@/lib/day-status"

interface AlmanaxDayListProps {
  cells: CalendarCell[]
  days: Map<string, AlmanaxDay>
  loading: boolean
  todayKey: string
  dayStatus: Record<string, AlmanaxDayStatus>
  numChars: number
  locale: string
  onCycleStatus: (date: string) => void
  onOpenDetails: (date: string) => void
}

const STATUS_ICON: Record<AlmanaxDayStatus, typeof Circle> = {
  none: Circle,
  prepared: Check,
  done: CheckCheck,
}

const STATUS_ICON_CLASS: Record<AlmanaxDayStatus, string> = {
  none: "text-muted-foreground",
  prepared: "text-primary",
  done: "text-chart-3",
}

const STATUS_LABEL: Record<AlmanaxDayStatus, string> = {
  none: "Marquer les ressources comme préparées",
  prepared: "Marquer la quête comme faite sur tous les personnages",
  done: "Réinitialiser",
}

/** Simple, essentials-only vertical list for small screens — scrolls freely. */
export function AlmanaxDayList({
  cells,
  days,
  loading,
  todayKey,
  dayStatus,
  numChars,
  locale,
  onCycleStatus,
  onOpenDetails,
}: AlmanaxDayListProps) {
  return (
    <div className="divide-y divide-border">
      {cells
        .filter((cell): cell is CalendarCell & { date: string; dayNumber: number } => cell.inMonth)
        .map((cell) => {
          const date = cell.date
          const day = days.get(date)
          const hasData = !!day?.item
          const status = dayStatus[date] ?? "none"
          const StatusIcon = STATUS_ICON[status]
          const isToday = date === todayKey
          const total = hasData && day.itemQuantity != null ? day.itemQuantity * numChars : null

          return (
            <div
              key={date}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetails(date)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onOpenDetails(date)
                }
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-1 py-2.5",
                isToday && "bg-primary/10"
              )}
            >
              <span className="w-6 shrink-0 text-sm text-muted-foreground tabular-nums">
                {cell.dayNumber}
              </span>

              {hasData ? (
                <>
                  {day.item?.iconUrl && (
                    <Image
                      src={day.item.iconUrl}
                      alt={day.item.name}
                      width={28}
                      height={28}
                      className="shrink-0 rounded-sm border border-border bg-muted object-contain"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="almanax-heading truncate text-sm font-semibold text-foreground">
                      {day.item?.name}
                    </div>
                    {day.itemQuantity != null && (
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {day.itemQuantity}
                        {numChars > 1 && (
                          <>
                            {" × "}
                            <span className="text-primary">{numChars}</span>
                            {" = "}
                            <span className="font-semibold text-accent">{total}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {day.rewardKamas != null && (
                    <span className="shrink-0 rounded bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                      {day.rewardKamas.toLocaleString(locale)}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={STATUS_LABEL[status]}
                    title={STATUS_LABEL[status]}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCycleStatus(date)
                    }}
                    className={cn(
                      "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded",
                      STATUS_ICON_CLASS[status]
                    )}
                  >
                    <StatusIcon className="size-4" />
                  </button>
                </>
              ) : (
                <span className="flex-1 text-xs text-muted-foreground">{loading ? "…" : "—"}</span>
              )}
            </div>
          )
        })}
    </div>
  )
}
