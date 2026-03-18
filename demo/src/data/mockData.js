const now = Date.now()

export const INITIAL_NOTES = [
  {
    id: 'n1',
    content: '查一下明天考试地点在哪个教室',
    type: 'lookup',
    status: 'due',
    remindAt: null,
    createdAt: new Date(now - 35 * 60 * 1000).toISOString(),
    contextTask: '高数复习',
  },
  {
    id: 'n2',
    content: '回复班长关于周末活动的消息',
    type: 'task',
    status: 'scheduled',
    remindAt: new Date(now + 20 * 60 * 1000).toISOString(),
    createdAt: new Date(now - 68 * 60 * 1000).toISOString(),
    contextTask: '高数复习',
  },
  {
    id: 'n3',
    content: '可以用思维导图整理这章的知识点，感觉会很清晰',
    type: 'inspiration',
    status: 'due',
    remindAt: null,
    createdAt: new Date(now - 110 * 60 * 1000).toISOString(),
    contextTask: '英语阅读',
  },
  {
    id: 'n4',
    content: '有点饿，想到中午要不要去食堂还是点外卖',
    type: 'random',
    status: 'processed',
    remindAt: null,
    createdAt: new Date(now - 185 * 60 * 1000).toISOString(),
    contextTask: '高数复习',
  },
  {
    id: 'n5',
    content: '妈妈说让我打电话回去',
    type: 'task',
    status: 'due',
    remindAt: null,
    createdAt: new Date(now - 240 * 60 * 1000).toISOString(),
    contextTask: '英语阅读',
  },
  {
    id: 'n6',
    content: '突然想到上次那道题的另一种解法',
    type: 'inspiration',
    status: 'archived',
    remindAt: null,
    createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    contextTask: '高数复习',
  },
]

export const INITIAL_TASK = {
  id: `t_${now}`,
  name: '高数复习',
  focusedSeconds: 47 * 60 + 23,
  startTime: new Date(now - (47 * 60 + 23) * 1000).toISOString(),
}

/** 空白启动时的默认任务（无演示数据） */
export const EMPTY_DEFAULT_TASK = {
  id: `t_${now}`,
  name: '当前任务',
  focusedSeconds: 0,
  startTime: new Date(now).toISOString(),
}
