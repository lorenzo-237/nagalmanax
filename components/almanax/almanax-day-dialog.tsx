"use client"

import { XIcon } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { almanaxBodyFont, almanaxHeadingFont } from "@/components/almanax/fonts"
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
      <DialogContent
        showCloseButton={false}
        className={cn(
          almanaxHeadingFont.variable,
          almanaxBodyFont.variable,
          "almanax-body rounded-lg border border-(--am-divider) bg-(--am-surface) p-4 text-(--am-text)"
        )}
      >
        <DialogClose className="absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-md text-(--am-text) hover:bg-white/10">
          <XIcon className="size-4" />
          <span className="sr-only">Fermer</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="almanax-heading text-xl font-semibold text-(--am-text) capitalize">
            {dateLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm">
          <div className="almanax-heading mb-2 text-lg font-semibold">{day?.item?.name}</div>
          <DialogDescription className="mb-3 text-(--am-text) opacity-85">
            {day?.bonus?.description}
          </DialogDescription>
          <div className="my-3 h-px bg-(--am-divider)" />
          <div className="text-[10px] tracking-wider text-(--am-accent) uppercase">
            Gains de la quête
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {day?.rewardKamas ? (
              <span className="rounded bg-(--am-accent-100) px-2.5 py-1 text-[11px] text-(--am-accent-800)">
                {day.rewardKamas.toLocaleString(locale)} kamas
              </span>
            ) : (
              <span className="text-[13px] text-(--am-neutral-700)">
                Aucune donnée de récompense
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-md border-(--am-divider) bg-transparent text-(--am-text) hover:bg-white/10"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
