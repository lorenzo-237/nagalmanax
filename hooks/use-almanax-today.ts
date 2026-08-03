"use client"

import { useEffect, useRef, useState } from "react"

import { type AlmanaxDay, type AlmanaxLanguage, fetchAlmanaxDay } from "@/lib/api"
import { toDateKey } from "@/lib/calendar"

interface UseAlmanaxTodayResult {
  day: AlmanaxDay | null
  loading: boolean
}

/** Fetches today's Almanax entry, independent of whichever month the calendar is browsing. */
export function useAlmanaxToday(lang: AlmanaxLanguage): UseAlmanaxTodayResult {
  const [day, setDay] = useState<AlmanaxDay | null>(null)
  const [loading, setLoading] = useState(true)
  const cache = useRef(new Map<string, AlmanaxDay>())

  useEffect(() => {
    const now = new Date()
    const dateStr = toDateKey(now.getFullYear(), now.getMonth(), now.getDate())
    const cacheKey = `${lang}-${dateStr}`
    const cached = cache.current.get(cacheKey)
    if (cached) {
      setDay(cached)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)

    fetchAlmanaxDay(dateStr, lang, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        cache.current.set(cacheKey, result)
        setDay(result)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setDay(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [lang])

  return { day, loading }
}
