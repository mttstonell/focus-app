export const NOTE_TYPES = [
  { key: 'random', label: '杂念', emoji: '💭', bg: '#EEF3FB', color: '#58708F' },
  { key: 'lookup', label: '待查', emoji: '🔍', bg: '#F2EAFF', color: '#7A5CC2' },
  { key: 'task', label: '任务', emoji: '✅', bg: '#EAF2FF', color: '#3D73D1' },
  { key: 'emotion', label: '情绪', emoji: '💫', bg: '#FFF1EC', color: '#D97757' },
  { key: 'inspiration', label: '灵感', emoji: '✨', bg: '#E8F8EF', color: '#2E8B57' },
]

export const TYPE_MAP = Object.fromEntries(NOTE_TYPES.map((t) => [t.key, t]))

export const REMIND_OPTIONS = [
  { label: '15分钟后', minutes: 15 },
  { label: '番茄钟后', minutes: 25 },
  { label: '今晚20:00', minutes: null, special: 'tonight' },
  { label: '睡前23:00', minutes: null, special: 'bedtime' },
  { label: '不提醒', minutes: null, special: 'none' },
]

export function getRemindAt(option) {
  if (option.minutes) return new Date(Date.now() + option.minutes * 60 * 1000)
  if (option.special === 'tonight') {
    const d = new Date()
    d.setHours(20, 0, 0, 0)
    return d
  }
  if (option.special === 'bedtime') {
    const d = new Date()
    d.setHours(23, 0, 0, 0)
    return d
  }
  return null
}

export function timeAgo(date) {
  const d = date instanceof Date ? date : new Date(date)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
}

export function getCurrentTime() {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
