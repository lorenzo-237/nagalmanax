"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, CheckCircle, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AlmanaxDay } from "@/lib/api"

interface AlmanaxDayCellProps {
  dayNumber: number
  day: AlmanaxDay | undefined
  loading: boolean
  isToday: boolean
  isPrepared: boolean
  numChars: number
  onTogglePrepared: () => void
  onOpenDetails: () => void
}

export function AlmanaxDayCell({
  dayNumber,
  day,
  loading,
  isToday,
  isPrepared,
  numChars,
  onTogglePrepared,
  onOpenDetails,
}: AlmanaxDayCellProps) {
  const hasData = !!day?.item
  const total = hasData && day.itemQuantity != null ? day.itemQuantity * numChars : null
  const [copied, setCopied] = useState(false)

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
      className="almanax-cell grid min-h-29.5 grid-rows-[20px_1fr_auto] gap-1.5 border-r border-b p-2"
      style={{
        borderColor: "var(--am-divider)",
        background: isPrepared
          ? "var(--am-surface-prepared)"
          : isToday
            ? "var(--am-surface-today)"
            : "var(--am-surface)",
      }}
    >
      <div className="flex h-5 items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="text-sm tabular-nums"
            style={{ color: "var(--am-neutral-300)" }}
          >
            {dayNumber}
          </span>
          {isToday && (
            <span
              className="almanax-heading rounded px-1.5 py-0.5 text-[10px]"
              style={{ background: "var(--am-accent-100)", color: "var(--am-accent-800)" }}
            >
              Aujourd&apos;hui
            </span>
          )}
        </div>
        {hasData && (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Copier le nom de la ressource"
              title={copied ? "Copié !" : "Copier le nom de la ressource"}
              onClick={copyItemName}
              className="flex size-5.5 cursor-pointer items-center justify-center rounded"
              style={{ color: copied ? "var(--am-accent-100)" : "var(--am-neutral-500)" }}
            >
              {copied ? <Check className="size-3.75" /> : <Copy className="size-3.25" />}
            </button>
            <button
              type="button"
              aria-label="Ressources préparées"
              title="C'est bon, j'ai préparé les ressources"
              onClick={onTogglePrepared}
              className="flex size-5.5 cursor-pointer items-center justify-center rounded"
              style={{ color: isPrepared ? "var(--am-accent-100)" : "var(--am-neutral-500)" }}
            >
              <CheckCircle className="size-3.75" />
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
              className="shrink-0 rounded-sm border object-contain"
              style={{ borderColor: "var(--am-divider)", background: "var(--am-neutral-100)" }}
            />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="almanax-heading text-[15px] leading-tight font-semibold">
              {day.item?.name}
            </div>
            <div className="flex items-center gap-1 self-start text-xs tabular-nums">
              <span>{day.itemQuantity}</span>
              {numChars > 1 && (
                <>
                  <span style={{ color: "var(--am-neutral-400)" }}>×</span>
                  <span style={{ color: "var(--am-accent-400)" }}>{numChars}</span>
                  <span style={{ color: "var(--am-neutral-400)" }}>=</span>
                  <span className="font-semibold" style={{ color: "var(--am-warm)" }}>
                    {total}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {hasData && day?.bonus && (
        <button
          type="button"
          onClick={onOpenDetails}
          className={cn(
            "cursor-pointer self-start p-0 text-[11px] underline decoration-solid underline-offset-2"
          )}
          style={{ color: "var(--am-accent-400)" }}
        >
          Bonus du jour
        </button>
      )}

      {!hasData && loading && (
        <div className="text-xs" style={{ color: "var(--am-neutral-700)" }}>
          …
        </div>
      )}
      {!hasData && !loading && (
        <div className="text-xs" style={{ color: "var(--am-neutral-700)" }}>
          —
        </div>
      )}
    </div>
  )
}
