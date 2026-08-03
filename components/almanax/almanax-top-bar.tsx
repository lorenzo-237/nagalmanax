"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlmanaxSettingsSheet } from "@/components/almanax/almanax-settings-sheet"

interface AlmanaxTopBarProps {
  monthLabel: string
  numChars: number
  onChangeChars: (value: number) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

/** Title + month navigation + settings, shared by the kiosk and mobile layouts. */
export function AlmanaxTopBar({
  monthLabel,
  numChars,
  onChangeChars,
  onPrevMonth,
  onNextMonth,
}: AlmanaxTopBarProps) {
  return (
    <div className="mb-2 flex shrink-0 items-center justify-between gap-3 border-b border-border pb-2">
      <div className="almanax-heading hidden shrink-0 text-sm font-semibold tracking-wider text-accent uppercase sm:block">
        Almanax
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Mois précédent"
          title="Mois précédent"
          onClick={onPrevMonth}
          className="rounded-md text-primary hover:text-primary"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="almanax-heading min-w-28 text-center text-base font-semibold capitalize sm:min-w-36 sm:text-lg">
          {monthLabel}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Mois suivant"
          title="Mois suivant"
          onClick={onNextMonth}
          className="rounded-md text-primary hover:text-primary"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <AlmanaxSettingsSheet numChars={numChars} onChangeChars={onChangeChars} />
        <ThemeToggle />
      </div>
    </div>
  )
}
