import { useState, useEffect, useRef } from 'react'
import { FOCUS_MINUTES_OPTIONS, BREAK_MINUTES_OPTIONS } from '../services/storage'

const ACCOUNT_NAME_MAX = 20

const SETTINGS = [
  {
    section: '提醒设置',
    items: [
      { label: '到期提醒', sub: '记录到期时推送系统通知', toggle: true, key: 'reminderDueOn' },
      { label: '专注完成提醒', sub: '番茄钟结束时推送系统通知', toggle: true, key: 'reminderPomodoroOn' },
    ],
  },
  {
    section: '学习偏好',
    items: [
      { label: '专注时长', sub: '每轮番茄钟时间', durationKey: 'focusMinutes', options: FOCUS_MINUTES_OPTIONS },
      { label: '休息时长', sub: '每轮休息时间', durationKey: 'breakMinutes', options: BREAK_MINUTES_OPTIONS },
    ],
  },
  {
    section: '数据',
    items: [
      { label: '导出记录', sub: '导出为 CSV 文件', arrow: true },
      { label: '清空记录', sub: '删除所有念头，保留当前任务名', danger: true, arrow: true },
    ],
  },
]

export default function ProfilePage({ profile, setProfile, onReset, onExport, onLoadDemo }) {
  const [editingName, setEditingName] = useState(false)
  const [editValue, setEditValue] = useState(profile?.accountName ?? '专注学习中')
  const [durationPicker, setDurationPicker] = useState(null) // 'focusMinutes' | 'breakMinutes' | null
  const inputRef = useRef(null)
  const accountName = (profile?.accountName || '专注学习中').slice(0, ACCOUNT_NAME_MAX)

  useEffect(() => {
    setEditValue(accountName)
  }, [accountName])

  useEffect(() => {
    if (editingName) inputRef.current?.focus()
  }, [editingName])

  const saveAccountName = () => {
    const val = editValue.trim().slice(0, ACCOUNT_NAME_MAX) || '专注学习中'
    setProfile((p) => ({ ...p, accountName: val }))
    setEditValue(val)
    setEditingName(false)
  }

  const handleToggle = (key) => {
    setProfile((p) => ({ ...p, [key]: !p?.[key] }))
    if (typeof window !== 'undefined' && window.Notification?.requestPermission) {
      window.Notification.requestPermission()
    }
  }

  const handleDurationSelect = (key, minutes) => {
    setProfile((p) => ({ ...p, [key]: minutes }))
    setDurationPicker(null)
  }

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100%', paddingBottom: 16 }}>
      <div style={{ padding: '12px 20px 16px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', letterSpacing: -0.5 }}>
          我的
        </div>
      </div>

      {/* Profile Card：账号名可编辑，最多 20 字 */}
      <div
        style={{
          margin: '0 16px 20px',
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: 20,
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}
        >
          🧑‍💻
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingName ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value.slice(0, ACCOUNT_NAME_MAX))}
              onBlur={saveAccountName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveAccountName()
                if (e.key === 'Escape') {
                  setEditValue(accountName)
                  setEditingName(false)
                }
              }}
              placeholder="账号名"
              maxLength={ACCOUNT_NAME_MAX}
              style={{
                width: '100%',
                fontSize: 17,
                fontWeight: 700,
                color: '#fff',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 8,
                padding: '6px 10px',
                outline: 'none',
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingName(true)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{accountName}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
                {accountName.length >= ACCOUNT_NAME_MAX ? '已达 20 字' : '点击编辑 · 最多 20 字'}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Settings */}
      {SETTINGS.map((group, gi) => (
        <div key={gi} style={{ margin: '0 16px 16px' }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#9CA3AF',
              marginBottom: 8,
              letterSpacing: 0.5,
              paddingLeft: 4,
            }}
          >
            {group.section}
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            {group.items.map((item, ii) => {
              const isOn = item.key ? profile?.[item.key] : false
              const defaultMin = item.durationKey === 'breakMinutes' ? 5 : 25
              const durationValue =
                item.durationKey != null ? `${profile?.[item.durationKey] ?? defaultMin} 分钟` : item.value
              const showArrow = item.arrow || item.durationKey
              return (
                <div
                  key={ii}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: ii < group.items.length - 1 ? '1px solid #F1F3F5' : 'none',
                    cursor: item.toggle || item.arrow || item.durationKey ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (item.toggle && item.key) handleToggle(item.key)
                    if (item.durationKey) setDurationPicker(item.durationKey)
                    if (item.label === '导出记录') onExport?.()
                    if (item.danger) onReset?.()
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: item.danger ? '#FF6B6B' : '#1F2937',
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  {(durationValue || item.value) && (
                    <span style={{ fontSize: 14, color: '#9CA3AF', marginRight: 6 }}>
                      {durationValue || item.value}
                    </span>
                  )}
                  {item.toggle && (
                    <div
                      style={{
                        width: 44,
                        height: 26,
                        borderRadius: 13,
                        background: isOn ? '#4C8BF5' : '#D1D5DB',
                        position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 3,
                          left: isOn ? 21 : 3,
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          background: '#fff',
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>
                  )}
                  {(showArrow || item.arrow) && (
                    <span style={{ fontSize: 16, color: '#D1D5DB' }}>›</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* 专注/休息时长选择浮层 */}
      {durationPicker && (
        <div
          role="dialog"
          aria-label="选择时长"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setDurationPicker(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 393,
              background: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: '20px 16px 28px',
              paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 16 }}>
              {durationPicker === 'focusMinutes' ? '专注时长' : '休息时长'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {(durationPicker === 'focusMinutes' ? FOCUS_MINUTES_OPTIONS : BREAK_MINUTES_OPTIONS).map(
                (min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => handleDurationSelect(durationPicker, min)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 12,
                      border: profile?.[durationPicker] === min ? '2px solid #4C8BF5' : '1px solid #E5E7EB',
                      background: profile?.[durationPicker] === min ? '#EAF2FF' : '#fff',
                      color: profile?.[durationPicker] === min ? '#4C8BF5' : '#1F2937',
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {min} 分钟
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ margin: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 14,
            border: '1.5px dashed #E5E7EB',
            background: 'transparent',
            color: '#9CA3AF',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          🗑 清空记录
        </button>
        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 14,
              border: '1.5px dashed #D7E7FF',
              background: '#F7FAFF',
              color: '#4C8BF5',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            📋 加载演示数据
          </button>
        )}
      </div>

      {/* Version */}
      <div style={{ textAlign: 'center', padding: '20px 0 8px', fontSize: 12, color: '#C4C9D4' }}>
        Focus v0.1.0 · 专注，从记下开始
      </div>
    </div>
  )
}
