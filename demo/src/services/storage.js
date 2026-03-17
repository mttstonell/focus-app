const STORAGE_KEY = 'focus_app_state'
const SCHEMA_KEY = 'focus_schema_version'
const SCHEMA_VERSION = 1
const LEGACY_NOTES_KEY = 'shk_notes'
const LEGACY_TASK_KEY = 'shk_task'

const VALID_STATUSES = new Set(['due', 'scheduled', 'processed', 'archived'])

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw)
  } catch (_) {
    return null
  }
}

function toIsoOrNow(value) {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function normalizeNote(note, fallbackTaskName) {
  if (!note || typeof note !== 'object') return null
  const content = typeof note.content === 'string' ? note.content.trim() : ''
  if (!content) return null
  const status = VALID_STATUSES.has(note.status) ? note.status : 'due'
  return {
    id:
      typeof note.id === 'string' && note.id
        ? note.id
        : `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    content,
    type: typeof note.type === 'string' && note.type ? note.type : 'random',
    status,
    remindAt: note.remindAt ? toIsoOrNow(note.remindAt) : null,
    createdAt: toIsoOrNow(note.createdAt),
    contextTask:
      typeof note.contextTask === 'string' && note.contextTask
        ? note.contextTask
        : fallbackTaskName,
  }
}

function normalizeTask(task, fallbackTask) {
  const name =
    task && typeof task.name === 'string' && task.name.trim() ? task.name.trim() : fallbackTask.name

  const focusedSeconds =
    task && Number.isFinite(task.focusedSeconds) && task.focusedSeconds >= 0
      ? Math.floor(task.focusedSeconds)
      : fallbackTask.focusedSeconds

  return { name, focusedSeconds }
}

export const FOCUS_MINUTES_OPTIONS = [15, 25, 30, 45]
export const BREAK_MINUTES_OPTIONS = [5, 10, 15]

const DEFAULT_PROFILE = {
  accountName: '专注学习中',
  reminderDueOn: true,
  reminderPomodoroOn: true,
  focusMinutes: 25,
  breakMinutes: 5,
}

function clampMinutes(value, options, defaultVal) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1) return defaultVal
  return options.includes(n) ? n : (options.find((m) => m >= n) ?? options[options.length - 1])
}

function normalizeProfile(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PROFILE }
  const accountName =
    typeof raw.accountName === 'string'
      ? raw.accountName.trim().slice(0, 20)
      : DEFAULT_PROFILE.accountName
  return {
    accountName: accountName || DEFAULT_PROFILE.accountName,
    reminderDueOn: typeof raw.reminderDueOn === 'boolean' ? raw.reminderDueOn : DEFAULT_PROFILE.reminderDueOn,
    reminderPomodoroOn:
      typeof raw.reminderPomodoroOn === 'boolean' ? raw.reminderPomodoroOn : DEFAULT_PROFILE.reminderPomodoroOn,
    focusMinutes: clampMinutes(raw.focusMinutes, FOCUS_MINUTES_OPTIONS, DEFAULT_PROFILE.focusMinutes),
    breakMinutes: clampMinutes(raw.breakMinutes, BREAK_MINUTES_OPTIONS, DEFAULT_PROFILE.breakMinutes),
  }
}

function migrateState(rawState, defaults) {
  const safeTask = normalizeTask(rawState.currentTask, defaults.defaultTask)
  const rawNotes = Array.isArray(rawState.notes) ? rawState.notes : []
  const migratedNotes = rawNotes.map((note) => normalizeNote(note, safeTask.name)).filter(Boolean)
  const profile = normalizeProfile(rawState.profile)

  return {
    version: SCHEMA_VERSION,
    notes: migratedNotes.length > 0 ? migratedNotes : defaults.defaultNotes,
    currentTask: safeTask,
    profile,
  }
}

function readLegacyState(defaults) {
  const legacyNotes = safeJsonParse(window.localStorage.getItem(LEGACY_NOTES_KEY))
  const legacyTask = safeJsonParse(window.localStorage.getItem(LEGACY_TASK_KEY))
  const state = migrateState(
    {
      notes: Array.isArray(legacyNotes) ? legacyNotes : [],
      currentTask: legacyTask,
    },
    defaults
  )
  return state
}

export function loadAppState(defaults) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { ok: true, state: readLegacyState(defaults), source: 'legacy_or_default' }
    }

    const parsed = safeJsonParse(stored)
    if (!parsed || typeof parsed !== 'object') {
      return { ok: true, state: readLegacyState(defaults), source: 'legacy_or_default' }
    }

    const migrated = migrateState(parsed, defaults)
    return { ok: true, state: migrated, source: 'state' }
  } catch (error) {
    return {
      ok: false,
      error,
      state: {
        notes: defaults.defaultNotes,
        currentTask: defaults.defaultTask,
        profile: DEFAULT_PROFILE,
        version: SCHEMA_VERSION,
      },
      source: 'fallback',
    }
  }
}

export function saveAppState({ notes, currentTask, profile }) {
  try {
    const payload = {
      version: SCHEMA_VERSION,
      notes,
      currentTask,
      profile: normalizeProfile(profile || DEFAULT_PROFILE),
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    window.localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION))

    // Keep legacy keys to avoid breaking older app versions.
    window.localStorage.setItem(LEGACY_NOTES_KEY, JSON.stringify(notes))
    window.localStorage.setItem(LEGACY_TASK_KEY, JSON.stringify(currentTask))

    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

export function clearAppState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(SCHEMA_KEY)
    window.localStorage.removeItem(LEGACY_NOTES_KEY)
    window.localStorage.removeItem(LEGACY_TASK_KEY)
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

function csvEscape(value) {
  const safeValue = value == null ? '' : String(value)
  if (safeValue.includes('"') || safeValue.includes(',') || safeValue.includes('\n')) {
    return `"${safeValue.replaceAll('"', '""')}"`
  }
  return safeValue
}

export function buildNotesCsv(notes) {
  const header = ['id', 'content', 'type', 'status', 'createdAt', 'remindAt', 'contextTask']
  const rows = notes.map((note) =>
    [
      note.id,
      note.content,
      note.type,
      note.status,
      note.createdAt,
      note.remindAt || '',
      note.contextTask || '',
    ]
      .map(csvEscape)
      .join(',')
  )

  return `${header.join(',')}\n${rows.join('\n')}`
}
