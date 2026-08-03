/** Progress of a given Almanax day: not started → resources prepared → quest done in-game. */
export type AlmanaxDayStatus = "none" | "prepared" | "done"

const CYCLE: AlmanaxDayStatus[] = ["none", "prepared", "done"]

/** Cycles a day's status forward: none → prepared → done → none. */
export function nextDayStatus(status: AlmanaxDayStatus): AlmanaxDayStatus {
  return CYCLE[(CYCLE.indexOf(status) + 1) % CYCLE.length]
}
