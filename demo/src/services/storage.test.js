import { beforeEach, describe, expect, it } from 'vitest'
import { buildNotesCsv, clearAppState, loadAppState, saveAppState } from './storage'

const defaults = {
  defaultNotes: [
    {
      id: 'n-default',
      content: 'default note',
      type: 'random',
      status: 'due',
      remindAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      contextTask: '默认任务',
    },
  ],
  defaultTask: {
    name: '默认任务',
    focusedSeconds: 0,
  },
}

function createMemoryStorage() {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  }
}

describe('storage service', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createMemoryStorage(),
    })
  })

  it('读取空存储时回退到默认值', () => {
    const result = loadAppState(defaults)
    expect(result.ok).toBe(true)
    expect(result.state.notes.length).toBe(1)
    expect(result.state.currentTask.name).toBe('默认任务')
  })

  it('能够保存并读回状态', () => {
    const data = {
      notes: [
        {
          id: 'n1',
          content: 'test',
          type: 'task',
          status: 'processed',
          remindAt: null,
          createdAt: new Date().toISOString(),
          contextTask: '任务A',
        },
      ],
      currentTask: {
        name: '任务A',
        focusedSeconds: 120,
      },
    }
    const save = saveAppState(data)
    expect(save.ok).toBe(true)

    const loaded = loadAppState(defaults)
    expect(loaded.state.notes[0].content).toBe('test')
    expect(loaded.state.currentTask.focusedSeconds).toBe(120)
  })

  it('清空后不再保留历史状态', () => {
    saveAppState({
      notes: defaults.defaultNotes,
      currentTask: defaults.defaultTask,
    })
    clearAppState()

    const loaded = loadAppState(defaults)
    expect(loaded.state.notes[0].id).toBe('n-default')
  })

  it('导出的 CSV 包含表头和内容', () => {
    const csv = buildNotesCsv(defaults.defaultNotes)
    expect(csv.includes('id,content,type,status,createdAt,remindAt,contextTask')).toBe(true)
    expect(csv.includes('default note')).toBe(true)
  })
})
