const TABS = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'review', label: '回看箱', icon: '📥' },
  { key: 'stats', label: '统计', icon: '📊' },
  { key: 'profile', label: '我的', icon: '👤' },
]

export default function TabBar({ activeTab, onChange, dueCount }) {
  return (
    <div
      className="tab-bar-bottom"
      style={{
        height: 72,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(229,231,235,0.8)',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        paddingBottom: 8,
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.key
        const badge = tab.key === 'review' && dueCount > 0
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              transition: 'opacity 0.12s',
            }}
          >
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  fontSize: 22,
                  filter: active ? 'none' : 'grayscale(1) opacity(0.5)',
                  transition: 'filter 0.15s',
                  display: 'block',
                }}
              >
                {tab.icon}
              </span>
              {badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -5,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    background: '#FF6B6B',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff',
                  }}
                >
                  {dueCount > 9 ? '9+' : dueCount}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 400,
                color: active ? '#4C8BF5' : '#9CA3AF',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: '#4C8BF5',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
