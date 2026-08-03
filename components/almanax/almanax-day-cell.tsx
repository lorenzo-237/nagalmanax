"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, CheckCheck, Circle, Copy, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AlmanaxDay } from "@/lib/api"
import type { AlmanaxDayStatus } from "@/lib/day-status"

interface AlmanaxDayCellProps {
  dayNumber: number
  day: AlmanaxDay | undefined
  loading: boolean
  isToday: boolean
  status: AlmanaxDayStatus
  numChars: number
  onCycleStatus: () => void
  onOpenDetails: () => void
}

const STATUS_CONFIG: Record<
  AlmanaxDayStatus,
  { icon: typeof Circle; iconClass: string; cellClass: string; label: string }
> = {
  none: {
    icon: Circle,
    iconClass: "text-muted-foreground",
    cellClass: "bg-card",
    label: "Marquer les ressources comme préparées",
  },
  prepared: {
    icon: Check,
    iconClass: "text-primary",
    cellClass: "bg-primary/15",
    label: "Marquer la quête comme faite sur tous les personnages",
  },
  done: {
    icon: CheckCheck,
    iconClass: "text-chart-3",
    cellClass: "bg-chart-3/15",
    label: "Réinitialiser",
  },
}

export function AlmanaxDayCell({
  dayNumber,
  day,
  loading,
  isToday,
  status,
  numChars,
  onCycleStatus,
  onOpenDetails,
}: AlmanaxDayCellProps) {
  const hasData = !!day?.item
  const total =
    hasData && day.itemQuantity != null ? day.itemQuantity * numChars : null
  const [copied, setCopied] = useState(false)
  const {
    icon: StatusIcon,
    iconClass,
    cellClass,
    label,
  } = STATUS_CONFIG[status]

  async function copyItemName() {
    if (!day?.item?.name) return
    try {
      await navigator.clipboard.writeText(day.item.name)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable (e.g. insecure context) — silently ignore
    }
  }

  return (
    <div
      className={cn(
        "almanax-cell grid h-full min-h-0 grid-rows-[22px_1fr] gap-1.5 overflow-hidden border-r border-b border-border p-2",
        status === "none" && isToday ? "bg-primary/10" : cellClass
      )}
    >
      <div className="flex h-5.5 items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground tabular-nums">
            {dayNumber}
          </span>
          {isToday && (
            <span className="almanax-heading rounded bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground">
              Aujourd&apos;hui
            </span>
          )}
        </div>
        {hasData && (
          <div className="flex items-center gap-0.5">
            {day?.bonus && (
              <button
                type="button"
                aria-label="Voir le bonus du jour"
                title="Voir le bonus du jour"
                onClick={onOpenDetails}
                className="flex size-5.5 cursor-pointer items-center justify-center rounded text-primary"
              >
                <Info className="size-3.75" />
              </button>
            )}
            <button
              type="button"
              aria-label="Copier le nom de la ressource"
              title={copied ? "Copié !" : "Copier le nom de la ressource"}
              onClick={copyItemName}
              className={cn(
                "flex size-5.5 cursor-pointer items-center justify-center rounded",
                copied ? "text-primary" : "text-muted-foreground"
              )}
            >
              {copied ? (
                <Check className="size-3.75" />
              ) : (
                <Copy className="size-3.25" />
              )}
            </button>
            <button
              type="button"
              aria-label={label}
              title={label}
              onClick={onCycleStatus}
              className={cn(
                "flex size-5.5 cursor-pointer items-center justify-center rounded",
                iconClass
              )}
            >
              <StatusIcon className="size-3.75" />
            </button>
          </div>
        )}
      </div>

      {hasData && day && (
        <div className="flex items-start gap-1.5">
          {day.item?.iconUrl && (
            <Image
              src={day.item.iconUrl}
              alt={day.item.name}
              width={28}
              height={28}
              className="shrink-0 rounded-sm border border-border bg-muted object-contain"
            />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="almanax-heading text-[12px] leading-relaxed font-semibold text-foreground">
              {day.item?.name}
            </div>
            <div className="flex items-center gap-1 self-start text-xs text-foreground tabular-nums">
              <span>{day.itemQuantity}</span>
              {numChars > 1 && (
                <>
                  <span className="text-muted-foreground">×</span>
                  <span className="text-primary">{numChars}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-semibold text-accent">{total}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {!hasData && loading && (
        <div className="text-xs text-muted-foreground">…</div>
      )}
      {!hasData && !loading && (
        <div className="text-xs text-muted-foreground">—</div>
      )}
    </div>
  )
}
