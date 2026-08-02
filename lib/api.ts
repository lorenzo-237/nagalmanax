/**
 * Client for the public Almanax API (https://github.com/dofusdude/almanax-api).
 * Exposes typed helpers to fetch a single day or a full month of Dofus Almanax data.
 */

export const ALMANAX_LANGUAGES = ["fr", "en", "de", "es", "pt"] as const

export type AlmanaxLanguage = (typeof ALMANAX_LANGUAGES)[number]

const API_BASE_URL = "https://api.dofusdu.de/dofus3/v1"

export interface AlmanaxBonus {
  name: string
  description: string
}

export interface AlmanaxTributeItem {
  ankamaId: number
  name: string
  iconUrl: string | null
}

export interface AlmanaxDay {
  date: string
  bonus: AlmanaxBonus | null
  rewardKamas: number | null
  item: AlmanaxTributeItem | null
  itemQuantity: number | null
}

export class AlmanaxApiError extends Error {
  constructor(
    message: string,
    public readonly date: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = "AlmanaxApiError"
  }
}

/** Raw shape returned by GET /{lang}/almanax/{date}. */
interface AlmanaxDayResponse {
  date: string
  bonus?: {
    description?: string
    type?: { id?: string; name?: string }
  }
  reward_kamas?: number
  tribute?: {
    item?: {
      ankama_id?: number
      name?: string
      image_urls?: { icon?: string; sd?: string }
    }
    quantity?: number
  }
}

function toDateString(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

function parseAlmanaxDay(raw: AlmanaxDayResponse): AlmanaxDay {
  const item = raw.tribute?.item

  return {
    date: raw.date,
    bonus: raw.bonus?.type?.name
      ? { name: raw.bonus.type.name, description: raw.bonus.description ?? "" }
      : null,
    rewardKamas: raw.reward_kamas ?? null,
    item: item
      ? {
          ankamaId: item.ankama_id ?? 0,
          name: item.name ?? "",
          iconUrl: item.image_urls?.icon ?? item.image_urls?.sd ?? null,
        }
      : null,
    itemQuantity: raw.tribute?.quantity ?? null,
  }
}

/** Fetches a single Almanax day. Throws {@link AlmanaxApiError} on failure. */
export async function fetchAlmanaxDay(
  date: string,
  lang: AlmanaxLanguage = "fr",
  signal?: AbortSignal
): Promise<AlmanaxDay> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/${lang}/almanax/${date}`, { signal })
  } catch (cause) {
    throw new AlmanaxApiError(`Network error while fetching Almanax for ${date}`, date, cause)
  }

  if (!response.ok) {
    throw new AlmanaxApiError(`Almanax API returned status ${response.status} for ${date}`, date)
  }

  const json = (await response.json()) as AlmanaxDayResponse
  return parseAlmanaxDay(json)
}

export interface AlmanaxMonthResult {
  /** Successfully fetched days, keyed by "YYYY-MM-DD". */
  days: Map<string, AlmanaxDay>
  /** Dates that failed to load. */
  failedDates: string[]
}

/**
 * Fetches every day of a given month in parallel. Individual day failures are
 * collected in `failedDates` rather than rejecting the whole call.
 */
export async function fetchAlmanaxMonth(
  year: number,
  month: number,
  lang: AlmanaxLanguage = "fr",
  signal?: AbortSignal
): Promise<AlmanaxMonthResult> {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dates = Array.from({ length: daysInMonth }, (_, i) => toDateString(year, month, i + 1))

  const settled = await Promise.allSettled(
    dates.map((date) => fetchAlmanaxDay(date, lang, signal))
  )

  const days = new Map<string, AlmanaxDay>()
  const failedDates: string[] = []

  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      days.set(dates[index], result.value)
    } else {
      failedDates.push(dates[index])
    }
  })

  return { days, failedDates }
}
