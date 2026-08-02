"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  type AlmanaxDay,
  type AlmanaxLanguage,
  fetchAlmanaxMonth,
} from "@/lib/api"

interface UseAlmanaxMonthResult {
  days: Map<string, AlmanaxDay>
  loading: boolean
  error: boolean
  retry: () => void
}

/** Fetches and caches Almanax data for a given year/month/language. */
export function useAlmanaxMonth(
  year: number,
  month: number,
  lang: AlmanaxLanguage
): UseAlmanaxMonthResult {
  const [days, setDays] = useState<Map<string, AlmanaxDay>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const cache = useRef(new Map<string, Map<string, AlmanaxDay>>())

  const load = useCallback(() => {
    const cacheKey = `${lang}-${year}-${month}`
    const cached = cache.current.get(cacheKey)
    if (cached) {
      setDays(cached)
      setLoading(false)
      setError(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(false)

    fetchAlmanaxMonth(year, month, lang, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        cache.current.set(cacheKey, result.days)
        setDays(result.days)
        setError(result.days.size === 0)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [year, month, lang])

  useEffect(() => load(), [load])

  return { days, loading, error, retry: load }
}
