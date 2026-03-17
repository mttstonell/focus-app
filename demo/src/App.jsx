import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ReviewBox from './pages/ReviewBox'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'
import QuickNoteSheet from './components/QuickNoteSheet'
import TabBar from './components/TabBar'
import Toast from './components/Toast'
import { EMPTY_DEFAULT_TASK, INITIAL_NOTES, INITIAL_TASK } from './data/mockData'
import { getCurrentTime } from './constants/types'
import { buildNotesCsv, clearAppState, loadAppState, saveAppState } from './services/storage'

// 默认无演示数据：首次启动用空白状态；本地已有数据则照常恢复
const initialLoad = loadAppState({
  defaultNotes: [],
  defaultTask: EMPTY_DEFAULT_TASK,
})

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [notes, setNotes] = useState(initialLoad.state.notes)
  const [currentTask, setCurrentTask] = useState(initialLoad.state.currentTask)
  const [showQuickNote, setShowQuickNote] = useState(false)
  const [toast, setToast] = useState(null)
  const [time, setTime] = useState(getCurrentTime())

  useEffect(() => {
    if (!initialLoad.ok) showToastMsg('读取本地数据失败，已使用默认数据')
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 10000)
    return () => clearInterval(t)
  }, [])

  // 定时检查提醒到期，自动将 scheduled 转换为 due
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now()
      setNotes((prevNotes) => {
        let hasUpdates = false
        const nextNotes = prevNotes.map((n) => {
          if (n.status === 'scheduled' && n.remindAt) {
            const remindTime = new Date(n.remindAt).getTime()
            if (remindTime <= now) {
              hasUpdates = true
              return { ...n, status: 'due' }
            }
          }
          return n
        })
        if (hasUpdates) {
          // 使用函数式更新内部的 state，避免依赖 notes
          const saveResult = saveAppState({ notes: nextNotes, currentTask })
          if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
          return nextNotes
        }
        return prevNotes
      })
    }
    // 立即检查一次，然后每10秒检查一次
    checkReminders()
    const interval = setInterval(checkReminders, 10000)
    return () => clearInterval(interval)
  }, [currentTask])

  useEffect(() => {
    const result = saveAppState({ notes, currentTask })
    if (!result.ok) showToastMsg('保存失败，请检查浏览器存储权限')
  }, [notes, currentTask])

  const addNote = (note) => {
    if (!note?.content || !note.content.trim()) {
      showToastMsg('内容为空，先写一句再保存')
      return
    }
    const newNote = {
      ...note,
      id: `n_${Date.now()}`,
      content: note.content.trim().slice(0, 300),
      createdAt: new Date().toISOString(),
      contextTask: currentTask.name,
    }
    const nextNotes = [newNote, ...notes]
    setNotes(nextNotes)
    // 立即写入本地存储，避免依赖 effect 时机导致未持久化
    const saveResult = saveAppState({ notes: nextNotes, currentTask })
    if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
    showToastMsg('已记下，先回来吧 👋')
  }

  const updateNote = (id, updates) => {
    setNotes((prev) => {
      const nextNotes = prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
      // 立即写入本地存储，避免依赖 effect 时机导致未持久化
      const saveResult = saveAppState({ notes: nextNotes, currentTask })
      if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
      return nextNotes
    })
  }

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleExport = () => {
    if (notes.length === 0) {
      showToastMsg('还没有记录可导出')
      return
    }

    try {
      const csv = buildNotesCsv(notes)
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `focus-notes-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      showToastMsg('已导出 CSV')
    } catch (_) {
      showToastMsg('导出失败，请稍后重试')
    }
  }

  const handleReset = () => {
    const ok = window.confirm('确定要清空所有记录吗？当前任务会保留名称，专注时长会清零。')
    if (!ok) return
    const result = clearAppState()
    if (!result.ok) {
      showToastMsg('清空失败，请稍后重试')
      return
    }
    setNotes([])
    setCurrentTask((prev) => ({ ...EMPTY_DEFAULT_TASK, name: prev?.name || EMPTY_DEFAULT_TASK.name }))
    showToastMsg('已清空记录')
  }

  const handleLoadDemo = () => {
    setNotes(INITIAL_NOTES)
    setCurrentTask(INITIAL_TASK)
    showToastMsg('已加载演示数据')
  }

  const dueCount = notes.filter((n) => n.status === 'due').length

  return (
    <>
      <div className="demo-label">Focus · 在浏览器里模拟手机体验</div>
      <div className="phone-shell">
        {/* Status Bar */}
        <div
          className="status-bar"
          style={{ background: activeTab === 'home' ? '#F7F8FA' : '#F7F8FA' }}
        >
          <span className="status-time">{time}</span>
          <span className="status-icons">
            <span>📶</span>
            <span>🔋</span>
          </span>
        </div>

        {/* Page Content */}
        <div className="page-scroll">
          {activeTab === 'home' && (
            <HomePage
              notes={notes}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              onOpenQuickNote={() => setShowQuickNote(true)}
              dueCount={dueCount}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === 'review' && <ReviewBox notes={notes} onUpdate={updateNote} />}
          {activeTab === 'stats' && <StatsPage notes={notes} />}
          {activeTab === 'profile' && (
            <ProfilePage
              onReset={handleReset}
              onExport={handleExport}
              onLoadDemo={handleLoadDemo}
            />
          )}
        </div>

        {/* Tab Bar */}
        <TabBar activeTab={activeTab} onChange={setActiveTab} dueCount={dueCount} />

        {/* Quick Note Sheet */}
        {showQuickNote && (
          <QuickNoteSheet
            onSave={addNote}
            onClose={() => setShowQuickNote(false)}
            currentTask={currentTask}
          />
        )}

        {/* Toast */}
        {toast && <Toast message={toast} />}
      </div>
    </>
  )
}
