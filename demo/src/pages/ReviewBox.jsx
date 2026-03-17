import { useState } from 'react'
import { TYPE_MAP, timeAgo } from '../constants/types'

const FILTERS = [
  { key: 'pending', label: '待处理' },
  { key: 'all', label: '全部' },
  { key: 'scheduled', label: '已计划' },
  { key: 'processed', label: '已处理' },
  { key: 'archived', label: '已归档' },
]

function filterNotes(notes, filter) {
  switch (filter) {
    case 'pending':
      return notes.filter((n) => n.status === 'due')
    case 'scheduled':
      return notes.filter((n) => n.status === 'scheduled')
    case 'processed':
      return notes.filter((n) => n.status === 'processed')
    case 'archived':
      return notes.filter((n) => n.status === 'archived')
    default:
      return [...notes]
  }
}

export default function ReviewBox({ notes, onUpdate }) {
  const [activeFilter, setActiveFilter] = useState('pending')
  const [bulkDone, setBulkDone] = useState(false)

  const filtered = filterNotes(notes, activeFilter)
  const dueCount = notes.filter((n) => n.status === 'due').length

  const handleBulkProcess = () => {
    notes.filter((n) => n.status === 'due').forEach((n) => onUpdate(n.id, { status: 'processed' }))
    setBulkDone(true)
    setTimeout(() => setBulkDone(false), 2000)
  }

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 8px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', letterSpacing: -0.5 }}>
          回看箱
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
          {dueCount > 0 ? (
            <>
              <span style={{ color: '#FF6B6B', fontWeight: 600 }}>{dueCount} 条</span> 到期待处理
            </>
          ) : (
            '所有念头已清空 🎉'
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          padding: '4px 16px 10px',
          display: 'flex',
          gap: 7,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f.key
          const count = f.key === 'pending' ? dueCount : f.key === 'all' ? notes.length : null
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: '7px 16px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: active ? '#1F2937' : '#fff',
                color: active ? '#fff' : '#6B7280',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                whiteSpace: 'nowrap',
                boxShadow: active ? '0 2px 8px rgba(31,41,55,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.15s',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {f.label}
              {count !== null && count > 0 && (
                <span
                  style={{
                    background: active ? 'rgba(255,255,255,0.25)' : '#FF6B6B',
                    color: active ? '#fff' : '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 999,
                    minWidth: 16,
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bulk Action */}
      {activeFilter === 'pending' && dueCount > 1 && (
        <div style={{ padding: '0 16px 10px' }}>
          <button
            onClick={handleBulkProcess}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 12,
              border: '1.5px dashed #34C759',
              background: bulkDone ? '#EAF8EF' : 'transparent',
              color: '#34C759',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {bulkDone ? '✓ 已全部标记处理' : `全部标记已处理 (${dueCount} 条)`}
          </button>
        </div>
      )}

      {/* Note List */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          filtered.map((note) => <NoteCard key={note.id} note={note} onUpdate={onUpdate} />)
        )}
      </div>
    </div>
  )
}

function NoteCard({ note, onUpdate }) {
  const t = TYPE_MAP[note.type] || TYPE_MAP.random
  const isDue = note.status === 'due'
  const isProcessed = note.status === 'processed'
  const isArchived = note.status === 'archived'

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        boxShadow: isDue ? '0 2px 12px rgba(255,107,107,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        border: isDue ? '1px solid rgba(255,107,107,0.2)' : '1px solid transparent',
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ padding: '14px 14px 10px' }}>
        {/* Top Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          {isDue && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: '#FF6B6B',
                marginTop: 6,
                flexShrink: 0,
                boxShadow: '0 0 0 3px rgba(255,107,107,0.15)',
              }}
            />
          )}
          <div
            style={{
              flex: 1,
              fontSize: 15,
              color: isArchived ? '#9CA3AF' : '#1F2937',
              lineHeight: 1.55,
              textDecoration: isProcessed ? 'line-through' : 'none',
            }}
          >
            {note.content}
          </div>
          <span
            style={{
              fontSize: 11,
              padding: '3px 9px',
              borderRadius: 999,
              flexShrink: 0,
              background: t.bg,
              color: t.color,
              fontWeight: 500,
            }}
          >
            {t.emoji} {t.label}
          </span>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          {note.contextTask && (
            <span
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              📖 {note.contextTask}
            </span>
          )}
          <span style={{ fontSize: 11, color: '#C4C9D4' }}>·</span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{timeAgo(note.createdAt)}</span>
          {note.status === 'scheduled' && note.remindAt && (
            <>
              <span style={{ fontSize: 11, color: '#C4C9D4' }}>·</span>
              <span style={{ fontSize: 11, color: '#4C8BF5' }}>
                🔔{' '}
                {new Date(note.remindAt).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                提醒
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isProcessed && !isArchived && (
        <div style={{ display: 'flex', borderTop: '1px solid #F1F3F5' }}>
          <ActionBtn
            label="已处理"
            color="#34C759"
            onClick={() => onUpdate(note.id, { status: 'processed' })}
          />
          <ActionBtn
            label="延后"
            color="#FFB340"
            onClick={() =>
              onUpdate(note.id, {
                status: 'scheduled',
                remindAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              })
            }
          />
          <ActionBtn
            label="归档"
            color="#9CA3AF"
            onClick={() => onUpdate(note.id, { status: 'archived' })}
          />
        </div>
      )}
      {isProcessed && (
        <div
          style={{
            padding: '8px 14px',
            borderTop: '1px solid #F1F3F5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#34C759', fontWeight: 600 }}>✓ 已处理</span>
          <button
            onClick={() => onUpdate(note.id, { status: 'due' })}
            style={{
              fontSize: 11,
              color: '#9CA3AF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            撤销
          </button>
        </div>
      )}
      {isArchived && (
        <div
          style={{
            padding: '8px 14px',
            borderTop: '1px solid #F1F3F5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>已归档</span>
          <button
            onClick={() => onUpdate(note.id, { status: 'due' })}
            style={{
              fontSize: 11,
              color: '#9CA3AF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            恢复
          </button>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 0',
        border: 'none',
        background: 'transparent',
        color,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        borderRight: '1px solid #F1F3F5',
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#F7F8FA')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </button>
  )
}

function EmptyState({ filter }) {
  const map = {
    pending: { emoji: '🎉', title: '今天的念头已经清空了', sub: '专注才是最好的状态' },
    all: { emoji: '📭', title: '还没有任何记录', sub: '点击首页「记一下」开始' },
    scheduled: { emoji: '🔔', title: '没有计划中的提醒', sub: '' },
    processed: { emoji: '✅', title: '还没有已处理的记录', sub: '' },
    archived: { emoji: '📦', title: '归档箱是空的', sub: '' },
  }
  const info = map[filter] || map.all
  return (
    <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{info.emoji}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#4B5563' }}>{info.title}</div>
      {info.sub && <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>{info.sub}</div>}
    </div>
  )
}
