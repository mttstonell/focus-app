import { useEffect, useRef, useState } from 'react'
import { TYPE_MAP, timeAgo } from '../constants/types'

export default function HomePage({
  notes,
  currentTask,
  setCurrentTask,
  onTaskNameChange,
  onOpenQuickNote,
  dueCount,
  onTabChange,
  onPomodoroComplete,
  focusMinutes = 25,
}) {
  const TOTAL = focusMinutes * 60
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [isRunning, setIsRunning] = useState(false)
  const [focusedSeconds, setFocusedSeconds] = useState(currentTask.focusedSeconds || 0)
  const [editingTaskName, setEditingTaskName] = useState(false)
  const [editingValue, setEditingValue] = useState(currentTask.name || '')
  const taskInputRef = useRef(null)
  const sessionStartRef = useRef(null)
  const initialTimeLeftRef = useRef(TOTAL)
  const initialFocusedSecondsRef = useRef(0)
  const intervalRef = useRef(null)
  const firstTickTimeoutRef = useRef(null)
  const pomodoroCompleteFiredRef = useRef(false)

  // 从会话开始时间计算当前应有状态（按已过去整秒数计算，避免首个 tick 多扣 1 秒）
  const computeStateFromSession = () => {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - sessionStartRef.current) / 1000))
    const newTimeLeft = Math.max(0, initialTimeLeftRef.current - elapsedSeconds)
    const newFocusedSeconds = initialFocusedSecondsRef.current + elapsedSeconds
    return { newTimeLeft, newFocusedSeconds, elapsedSeconds }
  }

  // 学习偏好中修改专注时长且未在计时时，同步剩余时间
  useEffect(() => {
    if (!isRunning) setTimeLeft(focusMinutes * 60)
  }, [focusMinutes, isRunning])

  // 开始/继续专注时：记录会话起点，并重置「完成提醒」触发标记
  useEffect(() => {
    if (isRunning) {
      sessionStartRef.current = Date.now()
      initialTimeLeftRef.current = timeLeft
      initialFocusedSecondsRef.current = focusedSeconds
      pomodoroCompleteFiredRef.current = false
    }
  }, [isRunning])

  // 第一秒后再开始逐秒更新，避免「立即 tick + 首次 interval 延迟」导致一下跳两秒
  useEffect(() => {
    if (!isRunning) return

    const tick = () => {
      const { newTimeLeft, newFocusedSeconds } = computeStateFromSession()
      setTimeLeft(newTimeLeft)
      setFocusedSeconds(newFocusedSeconds)
      if (newTimeLeft <= 0) {
        setIsRunning(false)
        if (!pomodoroCompleteFiredRef.current) {
          pomodoroCompleteFiredRef.current = true
          onPomodoroComplete?.()
        }
      }
    }

    firstTickTimeoutRef.current = setTimeout(() => {
      tick()
      intervalRef.current = setInterval(tick, 1000)
    }, 1000)
    return () => {
      if (firstTickTimeoutRef.current) clearTimeout(firstTickTimeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  // 锁屏/切后台再回来：用真实经过时间重算并刷新界面，修复锁屏期间不计时
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden || !isRunning) return
      const { newTimeLeft, newFocusedSeconds } = computeStateFromSession()
      setTimeLeft(newTimeLeft)
      setFocusedSeconds(newFocusedSeconds)
      if (newTimeLeft <= 0) {
        setIsRunning(false)
        if (!pomodoroCompleteFiredRef.current) {
          pomodoroCompleteFiredRef.current = true
          onPomodoroComplete?.()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isRunning])

  useEffect(() => {
    setCurrentTask((prev) => ({ ...prev, focusedSeconds }))
  }, [focusedSeconds, setCurrentTask])

  // 定期保存专注时长到 localStorage（每10秒），防止页面意外关闭丢失数据
  useEffect(() => {
    if (!isRunning) return
    
    const saveInterval = setInterval(() => {
      setCurrentTask((prev) => ({ ...prev, focusedSeconds }))
    }, 10000)
    
    // 页面关闭前保存
    const handleBeforeUnload = () => {
      setCurrentTask((prev) => ({ ...prev, focusedSeconds }))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      clearInterval(saveInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isRunning, focusedSeconds, setCurrentTask])

  useEffect(() => {
    setEditingValue(currentTask.name || '')
  }, [currentTask.name])

  useEffect(() => {
    if (editingTaskName) taskInputRef.current?.focus()
  }, [editingTaskName])

  const saveTaskName = () => {
    const name = editingValue.trim() || currentTask.name || '当前任务'
    if (onTaskNameChange && name !== currentTask.name) {
      onTaskNameChange(name)
    } else {
      setCurrentTask((prev) => ({ ...prev, name }))
    }
    setEditingTaskName(false)
  }

  const fmt = (sec) => {
    const totalSec = Math.max(0, Math.floor(Number(sec)))
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, '0')
    const s = (totalSec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const fmtFocused = (sec) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m} 分钟`
  }

  const progress = 1 - timeLeft / TOTAL
  const R = 72
  const circumference = 2 * Math.PI * R

  const today = new Date().toDateString()
  const todayNotes = notes.filter((n) => new Date(n.createdAt).toDateString() === today)
  const dueNotes = notes.filter((n) => n.status === 'due').slice(0, 3)

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 20px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', letterSpacing: -0.5 }}>
            {isRunning ? '专注中 🔥' : '准备好了吗？'}
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
            今天已记下{' '}
            <span style={{ color: '#4C8BF5', fontWeight: 600 }}>{todayNotes.length}</span> 个念头
          </div>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            background: 'linear-gradient(135deg, #EAF2FF, #D7E7FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🧑‍💻
        </div>
      </div>

      {/* Task Card */}
      <div
        style={{
          margin: '8px 16px',
          background: 'linear-gradient(135deg, #EAF2FF 0%, #E8F8EF 100%)',
          borderRadius: 16,
          padding: '14px 16px',
          border: '1px solid #D7E7FF',
          boxShadow: '0 2px 8px rgba(76,139,245,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 3, letterSpacing: 0.5 }}>
              当前任务
            </div>
            {editingTaskName ? (
              <input
                ref={taskInputRef}
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={saveTaskName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    saveTaskName()
                  }
                  if (e.key === 'Escape') {
                    setEditingValue(currentTask.name || '')
                    setEditingTaskName(false)
                  }
                }}
                placeholder="输入任务名"
                autoFocus
                style={{
                  width: '100%',
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#1F2937',
                  border: '1px solid #4C8BF5',
                  borderRadius: 8,
                  padding: '6px 10px',
                  outline: 'none',
                  background: '#fff',
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingValue(currentTask.name || '')
                  setEditingTaskName(true)
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#1F2937',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  textDecorationStyle: 'dotted',
                  textUnderlineOffset: 3,
                }}
              >
                {currentTask.name || '点击编辑任务名'}
              </button>
            )}
          </div>
          <span
            style={{
              background: isRunning ? '#34C759' : '#4C8BF5',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 999,
              transition: 'background 0.3s',
            }}
          >
            {isRunning ? '专注中' : '进行中'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>⏱</span>
          <span style={{ fontSize: 13, color: '#4B5563' }}>已专注 </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#3D73D1' }}>
            {fmtFocused(focusedSeconds)}
          </span>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <div
        style={{
          margin: '12px 16px',
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '24px 16px 20px',
          boxShadow: '0 2px 12px rgba(31,41,55,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', width: 180, height: 180, marginBottom: 20 }}>
          <svg width="180" height="180" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle cx="90" cy="90" r={R} fill="none" stroke="#F1F3F5" strokeWidth="10" />
            <circle
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke={timeLeft === 0 ? '#34C759' : '#4C8BF5'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: '#1F2937',
                letterSpacing: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(timeLeft)}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              {timeLeft === 0 ? '🎉 完成！' : '专注时间'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              if (timeLeft === 0) setTimeLeft(TOTAL)
              setIsRunning(!isRunning)
            }}
            style={{
              padding: '13px 36px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: isRunning ? '#FF6B6B' : 'linear-gradient(135deg, #4C8BF5, #6FA8FF)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              boxShadow: isRunning
                ? '0 4px 12px rgba(255,107,107,0.35)'
                : '0 4px 16px rgba(76,139,245,0.4)',
              transition: 'all 0.15s',
            }}
          >
            {isRunning
              ? '暂停'
              : timeLeft === TOTAL
                ? '开始专注'
                : timeLeft === 0
                  ? '再来一轮'
                  : '继续'}
          </button>
          {timeLeft !== TOTAL && (
            <button
              onClick={() => {
                setTimeLeft(TOTAL)
                setIsRunning(false)
              }}
              style={{
                padding: '13px 18px',
                borderRadius: 999,
                border: '1.5px solid #E5E7EB',
                background: 'transparent',
                color: '#6B7280',
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              重置
            </button>
          )}
        </div>
      </div>

      {/* 记一下 Button */}
      <div style={{ margin: '4px 16px 12px' }}>
        <button
          onClick={onOpenQuickNote}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: 20,
            border: 'none',
            background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            color: '#fff',
            fontSize: 17,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 16px rgba(31,41,55,0.25)',
          }}
        >
          <span style={{ fontSize: 20 }}>✏️</span>
          记一下
          <span
            style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}
          >
            有个念头
          </span>
        </button>
      </div>

      {/* Pending Summary */}
      {dueCount > 0 ? (
        <div style={{ margin: '0 16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>
              待回看
              <span
                style={{
                  marginLeft: 6,
                  background: '#FF6B6B',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 999,
                }}
              >
                {dueCount}
              </span>
            </div>
            <button
              onClick={() => onTabChange('review')}
              style={{
                fontSize: 13,
                color: '#4C8BF5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              全部查看 →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dueNotes.map((note) => {
              const t = TYPE_MAP[note.type] || TYPE_MAP.random
              return (
                <div
                  key={note.id}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '12px 14px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{t.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#1F2937',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {note.content}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                      {timeAgo(note.createdAt)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 999,
                      flexShrink: 0,
                      background: t.bg,
                      color: t.color,
                      fontWeight: 500,
                    }}
                  >
                    {t.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={{ margin: '0 16px', textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>🎉 没有待回看的念头，专注吧！</div>
        </div>
      )}
    </div>
  )
}
