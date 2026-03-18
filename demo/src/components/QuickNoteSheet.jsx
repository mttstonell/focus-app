import { useState, useEffect, useRef } from 'react'
import { NOTE_TYPES, REMIND_OPTIONS, getRemindAt } from '../constants/types'

export default function QuickNoteSheet({ onSave, onClose, currentTask }) {
  const [content, setContent] = useState('')
  const [selectedType, setSelectedType] = useState('random')
  const [selectedRemindIdx, setSelectedRemindIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const initialContentRef = useRef('')

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    const focus = setTimeout(() => inputRef.current?.focus(), 280)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(focus)
    }
  }, [])

  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'zh-CN'

      recognition.onresult = (event) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        // 追加到开始录音前的内容后面
        setContent(initialContentRef.current + (initialContentRef.current && transcript ? '，' : '') + transcript)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器暂不支持语音输入（推荐使用 Chrome 或 Safari）')
      return
    }
    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      initialContentRef.current = content
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleClose = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setVisible(false)
    setTimeout(onClose, 260)
  }

  const handleSave = () => {
    if (!content.trim()) return
    if (content.trim().length > 300) return
    const option = REMIND_OPTIONS[selectedRemindIdx]
    const remindAt = getRemindAt(option)
    onSave({
      content: content.trim(),
      type: selectedType,
      status: remindAt ? 'scheduled' : 'due',
      remindAt: remindAt ? remindAt.toISOString() : null,
    })
    handleClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
    if (e.key === 'Escape') handleClose()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: visible ? 'rgba(31,41,55,0.40)' : 'rgba(31,41,55,0)',
        transition: 'background 0.26s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backdropFilter: visible ? 'blur(2px)' : 'none',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '0 20px 32px',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 -4px 30px rgba(31,41,55,0.12)',
        }}
      >
        {/* Handle */}
        <div
          style={{ paddingTop: 12, paddingBottom: 4, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0 14px',
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>记一下</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              来自：{currentTask?.name}
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: '#F1F3F5',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            ×
          </button>
        </div>

        {/* Textarea */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "正在聆听..." : "刚才走神想到什么……（一句话就行）"}
            rows={3}
            maxLength={320}
            style={{
              width: '100%',
              padding: '13px 44px 13px 14px',
              borderRadius: 16,
              border: isRecording ? '1.5px solid #FF6B6B' : '1.5px solid #E5E7EB',
              fontSize: 15,
              color: '#1F2937',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              background: isRecording ? '#FFF0F0' : '#F7F8FA',
              lineHeight: 1.6,
              transition: 'all 0.15s',
            }}
            onFocus={(e) => {
              if (!isRecording) {
                e.target.style.borderColor = '#4C8BF5'
                e.target.style.background = '#fff'
              }
            }}
            onBlur={(e) => {
              if (!isRecording) {
                e.target.style.borderColor = '#E5E7EB'
                e.target.style.background = '#F7F8FA'
              }
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleRecording()
            }}
            title="语音输入"
            style={{
              position: 'absolute',
              right: 12,
              bottom: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              background: isRecording ? '#FF6B6B' : '#fff',
              color: isRecording ? '#FFF' : '#8E929B',
              border: isRecording ? 'none' : '1.5px solid #D1D5DB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isRecording ? '0 2px 8px rgba(255,107,107,0.4)' : '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {isRecording ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '-1px' }}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            )}
          </button>
        </div>
        <div
          style={{
            marginTop: 6,
            textAlign: 'right',
            fontSize: 11,
            color: content.trim().length > 300 ? '#FF6B6B' : '#9CA3AF',
          }}
        >
          {content.trim().length}/300
        </div>

        {/* Type Chips */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 }}>
            类型标签
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {NOTE_TYPES.map((t) => {
              const selected = selectedType === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedType(t.key)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    border: selected ? `1.5px solid ${t.color}` : '1.5px solid transparent',
                    cursor: 'pointer',
                    background: selected ? t.bg : '#F1F3F5',
                    color: selected ? t.color : '#9CA3AF',
                    fontSize: 13,
                    fontWeight: selected ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Remind Options */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 }}>
            提醒时间
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {REMIND_OPTIONS.map((opt, idx) => {
              const selected = selectedRemindIdx === idx
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRemindIdx(idx)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    border: selected ? '1.5px solid #4C8BF5' : '1.5px solid transparent',
                    cursor: 'pointer',
                    background: selected ? '#EAF2FF' : '#F1F3F5',
                    color: selected ? '#3D73D1' : '#9CA3AF',
                    fontSize: 13,
                    fontWeight: selected ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!content.trim() || content.trim().length > 300}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '16px',
            borderRadius: 20,
            border: 'none',
            background:
              content.trim() && content.trim().length <= 300
                ? 'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
                : '#E5E7EB',
            color: content.trim() && content.trim().length <= 300 ? '#fff' : '#9CA3AF',
            fontSize: 16,
            fontWeight: 700,
            cursor: content.trim() && content.trim().length <= 300 ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}
        >
          {content.trim().length > 300
            ? '内容过长，请精简到 300 字内'
            : content.trim()
              ? '✓ 记下来，先回去学'
              : '写点什么再记…'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#C4C9D4', marginTop: 8 }}>
          ⌘ + Enter 快速保存
        </div>
      </div>
    </div>
  )
}
