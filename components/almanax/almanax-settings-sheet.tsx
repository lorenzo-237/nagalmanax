"use client"

import { Minus, Plus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface AlmanaxSettingsSheetProps {
  numChars: number
  onChangeChars: (value: number) => void
}

export function AlmanaxSettingsSheet({ numChars, onChangeChars }: AlmanaxSettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Paramètres"
        title="Paramètres"
        render={<Button type="button" variant="ghost" size="icon" />}
      >
        <Settings className="size-4" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Paramètres</SheetTitle>
          <SheetDescription>À régler une fois, ça reste enregistré.</SheetDescription>
        </SheetHeader>

        <div className="px-6">
          <label className="flex flex-col gap-2 text-sm text-muted-foreground">
            Nombre de personnages
            <div className="flex items-center gap-1.5 rounded-sm border border-border px-1.5 py-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Moins"
                onClick={() => onChangeChars(numChars - 1)}
                className="size-7 rounded-md"
              >
                <Minus className="size-3.5" />
              </Button>
              <Input
                type="number"
                min={1}
                max={20}
                value={numChars}
                onChange={(e) => onChangeChars(Number(e.target.value))}
                className="h-auto flex-1 rounded-none border-none bg-transparent p-0 text-center text-base tabular-nums shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Plus"
                onClick={() => onChangeChars(numChars + 1)}
                className="size-7 rounded-md"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </label>
        </div>
      </SheetContent>
    </Sheet>
  )
}
