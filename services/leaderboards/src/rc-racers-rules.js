// Copied verbatim from OpenGrid apps/mini-rc-racers-game/tests/fixtures/portal-api/rules.mjs at 3efa001.
// The reference rules of the Mini RC Racers leaderboard, contract version "1" (docs/portal-leaderboard-api.md).
//
// Dependency-free and without I/O: an ES module that runs as it is in Node and in a browser. The game's fake service
// imports it; the Portal service (raid-guild/portal-artifacts, services/leaderboards/src/rc-racers-rules.js) copies it,
// or ports it with the same answers to every case in this folder. The floor table is an argument, never read here:
// pass the parsed floors.json.
//
// A refusal is a value, never a throw: { ok: false, status, message }, with a message a player may read.

export const VERSION = '1'

export const KINDS = ['qualifying', 'final']
export const MINUTES = [3, 5, 7]
export const WEATHERS = ['dry', 'changeable', 'wet']
export const WEATHER_FILTERS = ['all', 'dry', 'changeable', 'wet']
export const CARS = [2, 4, 7]
export const DIFFICULTIES = ['club', 'regional', 'national']
export const BOARD_KINDS = ['lap', 'race']

/** The most laps a finish may report. */
export const MAX_LAPS = 999
/** A finish may report this much more time than the server has seen pass since the run started, ms. */
export const WALL_SLACK_MS = 10000
/** How long after a final's clock runs out each car may still finish: the game's finish allowance, ms per car in the field. */
export const ALLOWANCE_MS_PER_CAR = 30000
/** How long after its own clock runs out a qualifying car may still finish, ms (the derivation is in the contract). */
export const QUALIFYING_OVERTIME_MS = 360000
/** A run can be finished until this long after it started, ms; after that the service answers 410. */
export const RUN_LIFETIME_MS = 7200000
/** Starts per player per rolling hour; the next one answers 429. */
export const MAX_STARTS_PER_HOUR = 60
/** Entries on a board. */
export const BOARD_SIZE = 10

export const MESSAGES = {
  invalid: 'This request does not match the leaderboard rules.',
  reload: 'Reload Mini RC Racers for the current rules.',
  unknownBoard: 'Unknown track, direction or car class.',
  notRanked: 'This kind of session cannot be ranked.',
  mismatch: 'This result does not match the session.',
  tooFast: 'This lap is faster than the track allows.',
  tooLong: 'This result is longer than the session allows.',
  tooSoon: 'This result arrived sooner than it could have been driven.',
  badQuery: 'Unknown leaderboard.',
}

const START_KEYS = ['version', 'track', 'direction', 'class', 'kind', 'minutes', 'weather', 'cars', 'difficulty', 'assisted']
const FINISH_KEYS = ['version', 'bestLapMs', 'laps', 'timeMs']
const QUERY_KEYS = ['kind', 'track', 'direction', 'class', 'weather', 'minutes', 'version']

const refuse = (status, message) => ({ ok: false, status, message })
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)
const hasExactly = (body, keys) => {
  const own = Object.keys(body)
  return own.length === keys.length && keys.every((key) => Object.hasOwn(body, key))
}
const own = (record, key) => (isPlainObject(record) && typeof key === 'string' && Object.hasOwn(record, key) ? record[key] : undefined)

/** The floor of a track, direction and class, ms; null when the floor table has no such board. */
export function floorFor(floors, track, direction, carClass) {
  const floor = own(own(own(own(floors, 'floors'), track), direction), carClass)
  return Number.isInteger(floor) ? floor : null
}

/**
 * A start body (`POST /runs`). Ok: the run's `run_config`, the body less `version`, in this key order.
 * 409 when `version` is not this contract's; 400 for anything else that breaks a rule.
 */
export function validateStart(body, floors) {
  if (!isPlainObject(body)) return refuse(400, MESSAGES.invalid)
  if (body.version !== VERSION) return refuse(409, MESSAGES.reload)
  if (!hasExactly(body, START_KEYS)) return refuse(400, MESSAGES.invalid)
  const { track, direction, kind, minutes, weather, cars, difficulty, assisted } = body
  const carClass = body.class
  if (floorFor(floors, track, direction, carClass) === null) return refuse(400, MESSAGES.unknownBoard)
  if (!KINDS.includes(kind) || !MINUTES.includes(minutes) || !WEATHERS.includes(weather) || !CARS.includes(cars) || !DIFFICULTIES.includes(difficulty) || typeof assisted !== 'boolean') {
    return refuse(400, MESSAGES.notRanked)
  }
  return { ok: true, value: { track, direction, class: carClass, kind, minutes, weather, cars, difficulty, assisted } }
}

/** The longest `timeMs` a session of this run's config can give, ms. */
export function maxTimeMs(runConfig) {
  const overtime = runConfig.kind === 'final' ? runConfig.cars * ALLOWANCE_MS_PER_CAR : QUALIFYING_OVERTIME_MS
  return runConfig.minutes * 60000 + overtime
}

/**
 * A finish body (`POST /runs/:id/finish`) against the run's stored `run_config` and the server's time since the run
 * started, `wallMs`. Ok: `{ bestLapMs, laps, timeMs }`, what the service stores. 409 when `version` is not this
 * contract's; 400 for anything else that breaks a rule. (410, a run older than RUN_LIFETIME_MS, is the service's to
 * answer before it asks this.)
 */
export function validateFinish(body, runConfig, wallMs, floors) {
  if (!isPlainObject(body)) return refuse(400, MESSAGES.invalid)
  if (body.version !== VERSION) return refuse(409, MESSAGES.reload)
  if (!hasExactly(body, FINISH_KEYS)) return refuse(400, MESSAGES.invalid)
  const { bestLapMs, laps, timeMs } = body
  if (!Number.isInteger(laps) || laps < 0 || laps > MAX_LAPS || !Number.isInteger(timeMs) || timeMs < 0 || (bestLapMs !== null && !Number.isInteger(bestLapMs))) {
    return refuse(400, MESSAGES.invalid)
  }
  const floor = floorFor(floors, runConfig.track, runConfig.direction, runConfig.class)
  if (floor === null) return refuse(400, MESSAGES.unknownBoard)
  if (laps === 0) {
    // No counted lap: the game's row has no best lap and a time of 0.
    if (bestLapMs !== null || timeMs !== 0) return refuse(400, MESSAGES.mismatch)
  } else {
    if (bestLapMs === null) return refuse(400, MESSAGES.mismatch)
    if (bestLapMs < floor) return refuse(400, MESSAGES.tooFast)
    // Every counted lap lies inside the time, and each is rounded on its own: the best fits in the time, and so do
    // `laps` laps of at least the best, less half a millisecond each for the rounding.
    if (bestLapMs > timeMs || laps * (bestLapMs - 1) > timeMs) return refuse(400, MESSAGES.mismatch)
  }
  if (timeMs > maxTimeMs(runConfig)) return refuse(400, MESSAGES.tooLong)
  if (timeMs > wallMs + WALL_SLACK_MS) return refuse(400, MESSAGES.tooSoon)
  return { ok: true, value: { bestLapMs, laps, timeMs } }
}

/**
 * The query of `GET /leaderboard`, as strings (repeated or non-string values are refused). Ok: the board's query
 * `{ kind, track, direction, class, weather, minutes?, version }`, `minutes` a number and only for a race board. The
 * version is any whole number written plainly; one with no runs gives an empty board, not a refusal.
 */
export function validateBoardQuery(query, floors) {
  if (!isPlainObject(query)) return refuse(400, MESSAGES.badQuery)
  const keys = Object.keys(query)
  if (!keys.every((key) => QUERY_KEYS.includes(key)) || !keys.every((key) => typeof query[key] === 'string')) return refuse(400, MESSAGES.badQuery)
  const { kind, track, direction, weather, version } = query
  const carClass = query.class
  if (!BOARD_KINDS.includes(kind) || !WEATHER_FILTERS.includes(weather)) return refuse(400, MESSAGES.badQuery)
  if (typeof version !== 'string' || !/^[1-9][0-9]{0,8}$/.test(version)) return refuse(400, MESSAGES.badQuery)
  if (floorFor(floors, track, direction, carClass) === null) return refuse(400, MESSAGES.badQuery)
  const value = { kind, track, direction, class: carClass, weather, version }
  if (kind === 'lap') return Object.hasOwn(query, 'minutes') ? refuse(400, MESSAGES.badQuery) : { ok: true, value }
  if (!['3', '5', '7'].includes(query.minutes)) return refuse(400, MESSAGES.badQuery)
  return { ok: true, value: { ...value, minutes: Number(query.minutes) } }
}

/** Whether a submitted run is on a board: the board's track, direction and class, its weather, and its kind's rule. */
function onBoard(run, query) {
  const config = run.runConfig
  const finish = run.finish
  if (config.track !== query.track || config.direction !== query.direction || config.class !== query.class) return false
  if (query.weather !== 'all' && config.weather !== query.weather) return false
  if (query.kind === 'lap') return KINDS.includes(config.kind) && finish.bestLapMs !== null
  return config.kind === 'final' && config.minutes === query.minutes && finish.laps >= 1
}

const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
const bySubmission = (a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt) || byId(a, b)
const ORDER = {
  lap: (a, b) => a.finish.bestLapMs - b.finish.bestLapMs || bySubmission(a, b),
  race: (a, b) => b.finish.laps - a.finish.laps || a.finish.timeMs - b.finish.timeMs || bySubmission(a, b),
}

/** Each player's best run on the board, best first: the whole ranking, not only the ten shown. */
function ranking(runs, query) {
  const order = ORDER[query.kind]
  const best = new Map()
  for (const run of runs) {
    if (!onBoard(run, query)) continue
    const held = best.get(run.playerId)
    if (held === undefined || order(run, held) < 0) best.set(run.playerId, run)
  }
  return [...best.values()].sort(order)
}

function entryOf(kind, run) {
  const { displayName, submittedAt, runConfig, finish } = run
  const result = kind === 'lap' ? { bestLapMs: finish.bestLapMs } : { laps: finish.laps, timeMs: finish.timeMs }
  return { displayName, ...result, submittedAt, cars: runConfig.cars, difficulty: runConfig.difficulty, weather: runConfig.weather, assisted: runConfig.assisted }
}

/**
 * The entries of a board, best first, at most BOARD_SIZE: one per player, from a list of submitted runs
 * `{ id, playerId, displayName, submittedAt, runConfig, finish }` of one version. `query` is a board query as
 * `validateBoardQuery` gives it (its `version` is not read: pass only that version's runs).
 */
export function board(runs, query) {
  return ranking(runs, query)
    .slice(0, BOARD_SIZE)
    .map((run) => entryOf(query.kind, run))
}

/** A player's place on a board among all its players, 1-based, and the id of the run that holds it; null when the player has none there. */
export function placeOf(runs, playerId, query) {
  const ranked = ranking(runs, query)
  const at = ranked.findIndex((run) => run.playerId === playerId)
  return at === -1 ? null : { rank: at + 1, runId: ranked[at].id }
}

/** What `GET /leaderboard` answers, less `version`: the entries, and `mine`, the index of the viewer's entry among them or null. */
export function boardAnswer(runs, query, viewerId) {
  const entries = board(runs, query)
  const place = viewerId === null || viewerId === undefined ? null : placeOf(runs, viewerId, query)
  return { entries, mine: place !== null && place.rank <= BOARD_SIZE ? place.rank - 1 : null }
}

/**
 * The ranks in a finish's answer: the run's player's place on the board of the run's own weather, among all players,
 * with `runs` holding every submitted run of the version, this one included; `best` when this run now holds that
 * place. `lap` is null for a run with no best lap; `race` unless the run is a final with a counted lap.
 */
export function finishRanks(runs, runId) {
  const run = runs.find((one) => one.id === runId)
  if (run === undefined) return { lap: null, race: null }
  const { track, direction, weather, kind, minutes } = run.runConfig
  const base = { track, direction, class: run.runConfig.class, weather }
  const rankOn = (query) => {
    const place = placeOf(runs, run.playerId, query)
    return place === null ? null : { rank: place.rank, best: place.runId === run.id }
  }
  return {
    lap: run.finish.bestLapMs === null ? null : rankOn({ ...base, kind: 'lap' }),
    race: kind === 'final' && MINUTES.includes(minutes) && run.finish.laps >= 1 ? rankOn({ ...base, kind: 'race', minutes }) : null,
  }
}
