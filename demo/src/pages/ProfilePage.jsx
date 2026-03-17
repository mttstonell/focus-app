import { useState } from 'react'

const SETTINGS = [
  {
    section: '提醒设置',
    items: [
      { label: '到期提醒', sub: '记录到期时通知', toggle: true, defaultOn: true },
      { label: '专注完成提醒', sub: '番茄钟结束时通知', toggle: true, defaultOn: true },
    ],
  },
  {
    section: '学习偏好',
    items: [
      { label: '专注时长', sub: '每轮番茄钟时间', value: '25 分钟', arrow: true },
      { label: '休息时长', sub: '每轮休息时间', value: '5 分钟', arrow: true },
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

export default function ProfilePage({ onReset, onExport, onLoadDemo }) {
  const [toggles, setToggles] = useState({ 0: true, 1: true })

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 16px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', letterSpacing: -0.5 }}>
          我的
        </div>
      </div>

      {/* Profile Card */}
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
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>专注学习中</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
            稍后看 · Demo 演示账户
          </div>
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
              const toggleKey = `${gi}_${ii}`
              const isOn = toggles[toggleKey] ?? item.defaultOn
              return (
                <div
                  key={ii}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: ii < group.items.length - 1 ? '1px solid #F1F3F5' : 'none',
                    cursor: item.toggle || item.arrow ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (item.toggle) setToggles((prev) => ({ ...prev, [toggleKey]: !isOn }))
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
                  {item.value && (
                    <span style={{ fontSize: 14, color: '#9CA3AF', marginRight: 6 }}>
                      {item.value}
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
                  {item.arrow && <span style={{ fontSize: 16, color: '#D1D5DB' }}>›</span>}
                </div>
              )
            })}
          </div>
        </div>
      ))}

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
