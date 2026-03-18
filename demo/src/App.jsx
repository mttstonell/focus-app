import { useState, useEffect, useRef } from 'react'
import HomePage from './pages/HomePage'
import ReviewBox from './pages/ReviewBox'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'
import QuickNoteSheet from './components/QuickNoteSheet'
import TabBar from './components/TabBar'
import Toast from './components/Toast'
import { EMPTY_DEFAULT_TASK, INITIAL_NOTES, INITIAL_TASK } from './data/mockData'
import { getCurrentTime } from './constants/types'
import { buildNotesCsv, clearAppState, loadAppState, saveAppState, migrateState } from './services/storage'

const initialLoad = loadAppState({
  defaultNotes: [],
  defaultTask: EMPTY_DEFAULT_TASK,
})

function requestNotificationPermission() {
  if (typeof window === 'undefined' || !window.Notification) return Promise.resolve('denied')
  if (Notification.permission === 'granted') return Promise.resolve('granted')
  if (Notification.permission === 'denied') return Promise.resolve('denied')
  return Notification.requestPermission()
}

function showDueNotification(note) {
  if (typeof window === 'undefined' || !window.Notification || Notification.permission !== 'granted') return
  try {
    new Notification('Focus · 到期待回看', {
      body: note.content?.slice(0, 80) || '有一条念头待处理',
      icon: '/icon-192.png',
    })
  } catch (_) {}
}

function showPomodoroCompleteNotification() {
  if (typeof window === 'undefined' || !window.Notification || Notification.permission !== 'granted') return
  try {
    new Notification('Focus · 专注完成', { body: '本轮番茄钟已结束，休息一下吧 🎉', icon: '/icon-192.png' })
  } catch (_) {}
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [notes, setNotes] = useState(initialLoad.state.notes)
  const [tasks, setTasks] = useState(initialLoad.state.tasks || [])
  const [currentTask, setCurrentTask] = useState(initialLoad.state.currentTask)
  const [profile, setProfile] = useState(initialLoad.state.profile || {
    accountName: '专注学习中',
    reminderDueOn: true,
    reminderPomodoroOn: true,
  })
  const profileRef = useRef(profile)
  profileRef.current = profile

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

  // 定时检查提醒到期：scheduled → due，并可选发送浏览器通知
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now()
      setNotes((prevNotes) => {
        let hasUpdates = false
        const newlyDueIds = []
        const nextNotes = prevNotes.map((n) => {
          if (n.status === 'scheduled' && n.remindAt) {
            const remindTime = new Date(n.remindAt).getTime()
            if (remindTime <= now) {
              hasUpdates = true
              newlyDueIds.push(n.id)
              return { ...n, status: 'due' }
            }
          }
          return n
        })
        if (hasUpdates) {
          const saveResult = saveAppState({ notes: nextNotes, tasks, currentTask, profile: profileRef.current })
          if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
          if (profileRef.current?.reminderDueOn && newlyDueIds.length) {
            requestNotificationPermission().then((perm) => {
              if (perm === 'granted') {
                nextNotes.filter((nn) => newlyDueIds.includes(nn.id)).forEach(showDueNotification)
              }
            })
          }
          return nextNotes
        }
        return prevNotes
      })
    }
    checkReminders()
    const interval = setInterval(checkReminders, 10000)
    return () => clearInterval(interval)
  }, [currentTask])

  useEffect(() => {
    const result = saveAppState({ notes, tasks, currentTask, profile })
    if (!result.ok) showToastMsg('保存失败，请检查浏览器存储权限')
  }, [notes, tasks, currentTask, profile])

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
    const saveResult = saveAppState({ notes: nextNotes, tasks, currentTask, profile })
    if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
    showToastMsg('已记下，先回来吧 👋')
  }

  const updateNote = (id, updates) => {
    setNotes((prev) => {
      const nextNotes = prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
      const saveResult = saveAppState({ notes: nextNotes, tasks, currentTask, profile: profileRef.current })
      if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
      return nextNotes
    })
  }

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleTaskNameChange = (newName) => {
    if (newName === currentTask.name) return

    const oldTask = {
      ...currentTask,
      endTime: new Date().toISOString(),
    }
    const nextTasks = [oldTask, ...tasks]
    setTasks(nextTasks)

    const newTask = {
      id: `t_${Date.now()}`,
      name: newName,
      focusedSeconds: 0,
      startTime: new Date().toISOString(),
    }
    setCurrentTask(newTask)
    
    const saveResult = saveAppState({ notes, tasks: nextTasks, currentTask: newTask, profile: profileRef.current })
    if (!saveResult.ok) showToastMsg('保存失败，请检查浏览器存储权限')
  }

  const handleExportCsv = () => {
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

  const handleExportJson = () => {
    try {
      const data = { notes, tasks, currentTask, profile }
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `focus-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      showToastMsg('已导出 JSON 备份')
    } catch (_) {
      showToastMsg('导出备份失败')
    }
  }

  const handleImportJson = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = e.target.result
        const parsed = JSON.parse(json)
        
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON')
        
        const migrated = migrateState(parsed, {
          defaultNotes: [],
          defaultTask: EMPTY_DEFAULT_TASK,
        })
        
        const nextNotes = migrated.notes || []
        const nextTasks = migrated.tasks || []
        const nextCurrentTask = migrated.currentTask || EMPTY_DEFAULT_TASK
        const nextProfile = migrated.profile || {
          accountName: '专注学习中',
          reminderDueOn: true,
          reminderPomodoroOn: true,
          focusMinutes: 25,
          breakMinutes: 5,
        }

        setNotes(nextNotes)
        setTasks(nextTasks)
        setCurrentTask(nextCurrentTask)
        setProfile(nextProfile)
        
        const saveResult = saveAppState({
          notes: nextNotes,
          tasks: nextTasks,
          currentTask: nextCurrentTask,
          profile: nextProfile
        })
        
        if (!saveResult.ok) throw new Error('Save failed')
        
        showToastMsg('数据导入成功！')
      } catch (err) {
        console.error(err)
        showToastMsg('导入失败，文件格式不正确')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
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
    setTasks([])
    setCurrentTask((prev) => ({ ...EMPTY_DEFAULT_TASK, name: prev?.name || EMPTY_DEFAULT_TASK.name }))
    showToastMsg('已清空记录')
  }

  const handleLoadDemo = () => {
    setNotes(INITIAL_NOTES)
    setCurrentTask(INITIAL_TASK)
    setTasks([])
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
              onTaskNameChange={handleTaskNameChange}
              onOpenQuickNote={() => setShowQuickNote(true)}
              dueCount={dueCount}
              onTabChange={setActiveTab}
              focusMinutes={profile?.focusMinutes ?? 25}
              onPomodoroComplete={() => {
                if (profile.reminderPomodoroOn) {
                  requestNotificationPermission().then((p) => p === 'granted' && showPomodoroCompleteNotification())
                }
              }}
            />
          )}
          {activeTab === 'review' && <ReviewBox notes={notes} onUpdate={updateNote} />}
          {activeTab === 'stats' && <StatsPage notes={notes} />}
          {activeTab === 'profile' && (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              tasks={tasks}
              onReset={handleReset}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
              onImportJson={handleImportJson}
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
