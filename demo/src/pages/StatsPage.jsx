import { useState } from 'react'
import { NOTE_TYPES } from '../constants/types'

export default function StatsPage({ notes }) {
  const [period, setPeriod] = useState('today')

  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // 统计时排除已归档记录
  const activeNotes = notes.filter((n) => n.status !== 'archived')
  const filtered = activeNotes.filter((n) => {
    const d = new Date(n.createdAt)
    return period === 'today' ? d >= startOfDay : d >= startOfWeek
  })

  const total = filtered.length
  const processed = filtered.filter((n) => n.status === 'processed').length
  const processRate = total > 0 ? Math.round((processed / total) * 100) : 0

  const typeCounts = NOTE_TYPES.map((t) => ({
    ...t,
    count: filtered.filter((n) => n.type === t.key).length,
  })).sort((a, b) => b.count - a.count)

  const maxTypeCount = Math.max(...typeCounts.map((t) => t.count), 1)

  // Hour distribution (group into 3-hour buckets)
  const hourBuckets = [
    { label: '6-9', hours: [6, 7, 8] },
    { label: '9-12', hours: [9, 10, 11] },
    { label: '12-15', hours: [12, 13, 14] },
    { label: '15-18', hours: [15, 16, 17] },
    { label: '18-21', hours: [18, 19, 20] },
    { label: '21-24', hours: [21, 22, 23] },
  ]
  const bucketCounts = hourBuckets.map((b) => ({
    ...b,
    count: filtered.filter((n) => b.hours.includes(new Date(n.createdAt).getHours())).length,
  }))
  const maxBucket = Math.max(...bucketCounts.map((b) => b.count), 1)

  const topType = typeCounts[0]

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 8px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', letterSpacing: -0.5 }}>
          专注统计
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>了解你的走神规律</div>
      </div>

      {/* Period Toggle */}
      <div
        style={{
          margin: '4px 16px 16px',
          background: '#ECECEC',
          borderRadius: 12,
          padding: 3,
          display: 'flex',
        }}
      >
        {[
          ['today', '今日'],
          ['week', '本周'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: period === key ? '#fff' : 'transparent',
              color: period === key ? '#1F2937' : '#6B7280',
              fontSize: 14,
              fontWeight: period === key ? 700 : 400,
              boxShadow: period === key ? '0 1px 6px rgba(0,0,0,0.12)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stat Cards Grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 16px' }}
      >
        <StatCard
          value={total}
          unit="次"
          label="走神记录"
          color="#4C8BF5"
          bg="#EAF2FF"
          emoji="📝"
        />
        <StatCard
          value={processed}
          unit="条"
          label="已处理"
          color="#34C759"
          bg="#EAF8EF"
          emoji="✅"
        />
        <StatCard
          value={processRate}
          unit="%"
          label="处理率"
          color="#FFB340"
          bg="#FFF3E1"
          emoji="📊"
        />
        <StatCard
          value={total > 0 ? topType.label : '—'}
          unit=""
          label="最多类型"
          color={total > 0 ? topType.color : '#9CA3AF'}
          bg={total > 0 ? topType.bg : '#F1F3F5'}
          emoji={total > 0 ? topType.emoji : '🤷'}
          isText
        />
      </div>

      {/* Type Distribution */}
      <div
        style={{
          margin: '0 16px 16px',
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 14 }}>
          类型分布
        </div>
        {typeCounts.map((t) => (
          <div key={t.key} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span
                style={{
                  fontSize: 13,
                  color: '#4B5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>{t.emoji}</span>
                {t.label}
              </span>
              <span
                style={{ fontSize: 13, fontWeight: 600, color: t.count > 0 ? t.color : '#C4C9D4' }}
              >
                {t.count}
              </span>
            </div>
            <div style={{ height: 7, background: '#F1F3F5', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: t.count > 0 ? t.color : 'transparent',
                  width: `${(t.count / maxTypeCount) * 100}%`,
                  transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            </div>
          </div>
        ))}
        {total === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '16px 0', fontSize: 13 }}>
            {period === 'today' ? '今天还没有记录' : '本周还没有记录'}
          </div>
        )}
      </div>

      {/* Time Distribution */}
      <div
        style={{
          margin: '0 16px 16px',
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 14 }}>
          时间段分布
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 72 }}>
          {bucketCounts.map((b) => (
            <div
              key={b.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: 4,
                  background: b.count > 0 ? '#4C8BF5' : '#F1F3F5',
                  height: `${Math.max((b.count / maxBucket) * 56, b.count > 0 ? 8 : 4)}px`,
                  transition: 'height 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
              {b.count > 0 && (
                <span style={{ fontSize: 10, color: '#4C8BF5', fontWeight: 700 }}>{b.count}</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {bucketCounts.map((b) => (
            <div
              key={b.label}
              style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#9CA3AF' }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      {total > 0 && (
        <div
          style={{
            margin: '0 16px',
            background: 'linear-gradient(135deg, #EAF2FF, #E8F8EF)',
            borderRadius: 16,
            padding: '14px 16px',
            border: '1px solid rgba(76,139,245,0.15)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937', marginBottom: 6 }}>
            📈 {period === 'today' ? '今日' : '本周'}小结
          </div>
          <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.65 }}>
            共记录 <strong style={{ color: '#4C8BF5' }}>{total}</strong> 个走神念头， 已处理{' '}
            <strong style={{ color: '#34C759' }}>{processed}</strong> 个。
            {processRate === 100 && total > 0 && <span> 全部清空，干得漂亮！🎉</span>}
            {processRate < 100 && total - processed > 0 && (
              <span>
                {' '}
                还有 <strong style={{ color: '#FF6B6B' }}>{total - processed}</strong> 个等你回看。
              </span>
            )}
            {total > 0 && topType.count > 0 && <span> 走神最多的是「{topType.label}」类型。</span>}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ value, unit, label, color, bg, emoji, isText }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        {emoji}
      </div>
      {isText ? (
        <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 13, color: '#9CA3AF' }}>{unit}</span>
        </div>
      )}
      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{label}</div>
    </div>
  )
}
