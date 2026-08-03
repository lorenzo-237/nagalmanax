/**
 * Client for the public Dofusdude Almanax API. Spec:
 * https://github.com/dofusdude/api-docs (openapi-3.0.yaml).
 * Exposes typed helpers to fetch a single day or a date range of Dofus Almanax data.
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

/**
 * Fetches a date range in a single request (GET /{lang}/almanax with
 * range[from]/range[to]), keyed by "YYYY-MM-DD". Throws {@link AlmanaxApiError}
 * on failure; dates absent from the response simply have no entry in the map.
 */
export async function fetchAlmanaxRange(
  from: string,
  to: string,
  lang: AlmanaxLanguage = "fr",
  signal?: AbortSignal
): Promise<Map<string, AlmanaxDay>> {
  const params = new URLSearchParams({
    "range[from]": from,
    "range[to]": to,
    "range[size]": "-1",
  })

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/${lang}/almanax?${params}`, { signal })
  } catch (cause) {
    throw new AlmanaxApiError(`Network error while fetching Almanax range ${from}..${to}`, from, cause)
  }

  if (!response.ok) {
    throw new AlmanaxApiError(
      `Almanax API returned status ${response.status} for range ${from}..${to}`,
      from
    )
  }

  const json = (await response.json()) as AlmanaxDayResponse[]
  const days = new Map<string, AlmanaxDay>()
  for (const raw of json) {
    days.set(raw.date, parseAlmanaxDay(raw))
  }
  return days
}

/** Fetches every day of a given month in a single request. */
export function fetchAlmanaxMonth(
  year: number,
  month: number,
  lang: AlmanaxLanguage = "fr",
  signal?: AbortSignal
): Promise<Map<string, AlmanaxDay>> {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const from = toDateString(year, month, 1)
  const to = toDateString(year, month, daysInMonth)
  return fetchAlmanaxRange(from, to, lang, signal)
}
