// Types of rules.mjs, the reference rules of the Mini RC Racers leaderboard, contract version "1".

export type Direction = 'counter-clockwise' | 'clockwise'
export type RunKind = 'qualifying' | 'final'
export type Minutes = 3 | 5 | 7
export type Weather = 'dry' | 'changeable' | 'wet'
export type WeatherFilter = 'all' | Weather
export type Cars = 2 | 4 | 7
export type Difficulty = 'club' | 'regional' | 'national'
export type BoardKind = 'lap' | 'race'

/** floors.json. */
export interface FloorTable {
  scoringVersion: string
  margin: number
  floors: Record<string, Record<string, Record<string, number>>>
}

/** A start body less `version`: what the service stores as the run's `run_config`. */
export interface RunConfig {
  track: string
  direction: Direction
  class: string
  kind: RunKind
  minutes: Minutes
  weather: Weather
  cars: Cars
  difficulty: Difficulty
  assisted: boolean
}

export interface StartBody extends RunConfig {
  version: string
}

/** A finish body less `version`: what the service stores. Times in milliseconds. */
export interface Finish {
  bestLapMs: number | null
  laps: number
  timeMs: number
}

export interface FinishBody extends Finish {
  version: string
}

/** A submitted run, as the board functions read it. `submittedAt` is ISO 8601; `id` a lowercase uuid. */
export interface SubmittedRun {
  id: string
  playerId: string
  displayName: string
  submittedAt: string
  runConfig: RunConfig
  finish: Finish
}

export interface BoardQuery {
  kind: BoardKind
  track: string
  direction: Direction
  class: string
  weather: WeatherFilter
  /** A race board only. */
  minutes?: Minutes
  /** Not read by the board functions. */
  version?: string
}

interface EntryBase {
  displayName: string
  submittedAt: string
  cars: Cars
  difficulty: Difficulty
  weather: Weather
  assisted: boolean
}
export interface LapEntry extends EntryBase {
  bestLapMs: number
}
export interface RaceEntry extends EntryBase {
  laps: number
  timeMs: number
}
export type BoardEntry = LapEntry | RaceEntry

export type Refusal<Status extends number> = { ok: false; status: Status; message: string }
export type Checked<Value, Status extends number> = { ok: true; value: Value } | Refusal<Status>

export interface Rank {
  rank: number
  best: boolean
}

export declare const VERSION: '1'
export declare const KINDS: readonly RunKind[]
export declare const MINUTES: readonly Minutes[]
export declare const WEATHERS: readonly Weather[]
export declare const WEATHER_FILTERS: readonly WeatherFilter[]
export declare const CARS: readonly Cars[]
export declare const DIFFICULTIES: readonly Difficulty[]
export declare const BOARD_KINDS: readonly BoardKind[]
export declare const MAX_LAPS: number
export declare const WALL_SLACK_MS: number
export declare const ALLOWANCE_MS_PER_CAR: number
export declare const QUALIFYING_OVERTIME_MS: number
export declare const RUN_LIFETIME_MS: number
export declare const MAX_STARTS_PER_HOUR: number
export declare const BOARD_SIZE: number
export declare const MESSAGES: Readonly<Record<'invalid' | 'reload' | 'unknownBoard' | 'notRanked' | 'mismatch' | 'tooFast' | 'tooLong' | 'tooSoon' | 'badQuery', string>>

export declare function floorFor(floors: FloorTable, track: unknown, direction: unknown, carClass: unknown): number | null
export declare function validateStart(body: unknown, floors: FloorTable): Checked<RunConfig, 400 | 409>
export declare function maxTimeMs(runConfig: RunConfig): number
export declare function validateFinish(body: unknown, runConfig: RunConfig, wallMs: number, floors: FloorTable): Checked<Finish, 400 | 409>
export declare function validateBoardQuery(query: unknown, floors: FloorTable): Checked<BoardQuery & { version: string }, 400>
export declare function board(runs: readonly SubmittedRun[], query: BoardQuery): BoardEntry[]
export declare function placeOf(runs: readonly SubmittedRun[], playerId: string, query: BoardQuery): { rank: number; runId: string } | null
export declare function boardAnswer(runs: readonly SubmittedRun[], query: BoardQuery, viewerId: string | null): { entries: BoardEntry[]; mine: number | null }
export declare function finishRanks(runs: readonly SubmittedRun[], runId: string): { lap: Rank | null; race: Rank | null }
