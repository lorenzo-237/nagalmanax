"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { almanaxHeadingFont } from "@/components/almanax/fonts"
import type { AlmanaxDay } from "@/lib/api"

interface AlmanaxDayDialogProps {
  date: string | null
  day: AlmanaxDay | undefined
  locale: string
  onClose: () => void
}

export function AlmanaxDayDialog({ date, day, locale, onClose }: AlmanaxDayDialogProps) {
  const dateLabel = date
    ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(
        new Date(date)
      )
    : ""

  return (
    <Dialog open={!!date} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={almanaxHeadingFont.variable}>
        <DialogHeader>
          <DialogTitle className="almanax-heading text-xl font-semibold capitalize">
            {dateLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm">
          <div className="almanax-heading mb-2 text-lg font-semibold">{day?.item?.name}</div>
          <DialogDescription className="mb-3">{day?.bonus?.description}</DialogDescription>
          <div className="my-3 h-px bg-border" />
          <div className="text-[10px] tracking-wider text-accent uppercase">Gains de la quête</div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {day?.rewardKamas ? (
              <span className="rounded bg-accent/15 px-2.5 py-1 text-[11px] text-accent">
                {day.rewardKamas.toLocaleString(locale)} kamas
              </span>
            ) : (
              <span className="text-[13px] text-muted-foreground">Aucune donnée de récompense</span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
