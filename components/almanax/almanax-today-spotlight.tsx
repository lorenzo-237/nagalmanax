"use client"

import Image from "next/image"
import { Info } from "lucide-react"

import type { AlmanaxDay } from "@/lib/api"

interface AlmanaxTodaySpotlightProps {
  day: AlmanaxDay | null
  loading: boolean
  numChars: number
  locale: string
  onOpenDetails: () => void
}

export function AlmanaxTodaySpotlight({
  day,
  loading,
  numChars,
  locale,
  onOpenDetails,
}: AlmanaxTodaySpotlightProps) {
  if (!loading && !day?.item) return null

  const total = day?.itemQuantity != null ? day.itemQuantity * numChars : null

  return (
    <div className="mb-2 flex shrink-0 flex-wrap items-center gap-3 rounded-sm border border-border bg-card px-3 py-1.5 text-sm">
      {day?.bonus && (
        <button
          type="button"
          aria-label="Voir le bonus du jour"
          title="Voir le bonus du jour"
          onClick={onOpenDetails}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-primary"
        >
          <Info className="size-4" />
        </button>
      )}

      {loading && !day && <span className="text-muted-foreground">Chargement…</span>}

      {day?.item && (
        <>
          {day.item.iconUrl && (
            <Image
              src={day.item.iconUrl}
              alt={day.item.name}
              width={22}
              height={22}
              className="shrink-0 rounded-sm border border-border bg-muted object-contain"
            />
          )}
          <span className="almanax-heading shrink-0 font-semibold text-foreground">{day.item.name}</span>
          {day.itemQuantity != null && (
            <span className="shrink-0 text-muted-foreground tabular-nums">
              {day.itemQuantity}
              {numChars > 1 && (
                <>
                  {" × "}
                  <span className="text-primary">{numChars}</span>
                  {" = "}
                  <span className="font-semibold text-accent">{total}</span>
                </>
              )}
            </span>
          )}
          {day.bonus && (
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              <span className="font-medium text-foreground">{day.bonus.name}</span> — {day.bonus.description}
            </span>
          )}
          {day.rewardKamas != null && (
            <span className="ml-auto shrink-0 rounded bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
              {day.rewardKamas.toLocaleString(locale)} kamas
            </span>
          )}
        </>
      )}
    </div>
  )
}
