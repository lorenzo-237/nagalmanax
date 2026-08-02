"use client"

import { useCallback, useSyncExternalStore } from "react"

type Listener = () => void

const listeners = new Map<string, Set<Listener>>()

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener())
}

function subscribe(key: string, listener: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key)!.add(listener)

  const onStorage = (e: StorageEvent) => {
    if (e.key === key) listener()
  }
  window.addEventListener("storage", onStorage)

  return () => {
    listeners.get(key)?.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** State synced with localStorage under `key`, shared across all hook instances. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const raw = useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => readRaw(key),
    () => null
  )

  const value = raw !== null ? (JSON.parse(raw) as T) : initialValue

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const prevRaw = readRaw(key)
      const prev = prevRaw !== null ? (JSON.parse(prevRaw) as T) : initialValue
      const next = typeof update === "function" ? (update as (p: T) => T)(prev) : update
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // ignore write failures (e.g. private browsing quota)
      }
      notify(key)
    },
    [key, initialValue]
  )

  return [value, setValue] as const
}
