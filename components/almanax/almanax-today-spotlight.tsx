"use client"

import Image from "next/image"

import type { AlmanaxDay } from "@/lib/api"

interface AlmanaxTodaySpotlightProps {
  day: AlmanaxDay | null
  loading: boolean
  numChars: number
  locale: string
}

export function AlmanaxTodaySpotlight({ day, loading, numChars, locale }: AlmanaxTodaySpotlightProps) {
  if (!loading && !day?.item) return null

  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())
  const total = day?.itemQuantity != null ? day.itemQuantity * numChars : null

  return (
    <div className="mb-6 rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-[11px] font-semibold tracking-wider text-accent uppercase">
          Offrande du jour
        </div>
        <div className="text-xs text-muted-foreground capitalize">{dateLabel}</div>
      </div>

      {loading && !day && <div className="text-sm text-muted-foreground">Chargement…</div>}

      {day?.item && (
        <div className="flex flex-wrap items-center gap-4">
          {day.item.iconUrl && (
            <Image
              src={day.item.iconUrl}
              alt={day.item.name}
              width={40}
              height={40}
              className="shrink-0 rounded-sm border border-border bg-muted object-contain"
            />
          )}

          <div className="min-w-0">
            <div className="almanax-heading text-lg font-semibold text-foreground">
              {day.item.name}
            </div>
            {day.itemQuantity != null && (
              <div className="flex items-center gap-1 text-sm text-foreground tabular-nums">
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
            )}
          </div>

          {day.bonus && (
            <div className="min-w-0 flex-1 basis-60 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{day.bonus.name}</span>
              {" — "}
              {day.bonus.description}
            </div>
          )}

          {day.rewardKamas != null && (
            <span className="ml-auto shrink-0 rounded bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
              {day.rewardKamas.toLocaleString(locale)} kamas
            </span>
          )}
        </div>
      )}
    </div>
  )
}
