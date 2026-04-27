import {
  createContext, useContext, useEffect, useState, useRef, useCallback,
  type ReactNode,
} from 'react'
import type { Task, TaskEntry, LogMap } from '../core/models'
import { dateKey, monthKey, addDays, addMonths } from '../core/helpers'
import {
  subscribeToTasks, saveTaskDoc, deleteTaskDoc, purgeTaskLogDocs,
  reorderTaskDocs, setLogEntry, deleteLogEntry, loadLogRange, clearAllUserData,
} from '../firebase/firestore'
import { generateSeedHistory } from '../core/seedData'
import { useAuth } from './AuthContext'

interface AppCtx {
  tasks: Task[]
  log: LogMap
  showProgressBar: boolean
  isLoading: boolean
  errorMsg: string | null
  clearError: () => void
  updateEntry: (dateKey: string, taskId: string, entry: TaskEntry | null) => void
  saveTask: (task: Task, isNew: boolean) => void
  deleteTask: (taskId: string) => void
  undoDeleteTask: (task: Task, atIndex: number) => void
  purgeTaskLog: (taskId: string) => void
  reorderTasks: (oldIndex: number, newIndex: number) => void
  clearStore: () => void
  resetStore: () => void
  toggleProgressBar: () => void
  loadLogRangeIntoCache: (fromKey: string, toKey: string) => Promise<void>
}

const Ctx = createContext<AppCtx>(null!)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const uid = user!.uid

  const [tasks, setTasks] = useState<Task[]>([])
  const [log, setLog] = useState<LogMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showProgressBar, setShowProgressBar] = useState(() => {
    return localStorage.getItem('tally_progress_bar') !== 'false'
  })

  const loadedRanges = useRef<Set<string>>(new Set())

  // Subscribe to tasks
  useEffect(() => {
    const unsub = subscribeToTasks(uid, ts => {
      setTasks(ts)
      setIsLoading(false)
    }, () => {
      setErrorMsg('Failed to load tasks.')
      setIsLoading(false)
    })
    return unsub
  }, [uid])

  const showError = useCallback((msg: string) => setErrorMsg(msg), [])

  const clearError = useCallback(() => setErrorMsg(null), [])

  const updateEntry = useCallback((dk: string, taskId: string, entry: TaskEntry | null) => {
    setLog(prev => {
      const prevDay = prev[dk] ?? {}
      return { ...prev, [dk]: { ...prevDay, [taskId]: entry } }
    })
    const op = entry
      ? setLogEntry(uid, dk, taskId, entry)
      : deleteLogEntry(uid, dk, taskId)
    op.catch(() => {
      // Rollback is complex with stale closure; show error and let Firestore resync
      showError('Save failed — check your connection.')
    })
  }, [uid, showError])

  const saveTask = useCallback((task: Task, isNew: boolean) => {
    setTasks(prev => {
      if (isNew) return [...prev, task].sort((a, b) => a.order - b.order)
      return prev.map(t => t.id === task.id ? task : t)
    })
    saveTaskDoc(task).catch(() => showError('Failed to save task.'))
  }, [showError])

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    deleteTaskDoc(taskId).catch(() => showError('Failed to delete task.'))
  }, [showError])

  const undoDeleteTask = useCallback((task: Task, atIndex: number) => {
    setTasks(prev => {
      const next = [...prev]
      next.splice(atIndex, 0, task)
      return next
    })
    saveTaskDoc(task).catch(() => showError('Failed to restore task.'))
  }, [showError])

  const purgeTaskLog = useCallback((taskId: string) => {
    purgeTaskLogDocs(uid, taskId).catch(() => showError('Failed to purge task history.'))
  }, [uid, showError])

  const reorderTasks = useCallback((oldIndex: number, newIndex: number) => {
    setTasks(prev => {
      const next = [...prev]
      const [moved] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, moved)

      // Float-gap order assignment
      const prevOrder = next[newIndex - 1]?.order ?? (next[newIndex + 1]?.order ?? 0) - 2000
      const nextOrder = next[newIndex + 1]?.order ?? (next[newIndex - 1]?.order ?? 0) + 2000
      const newOrder = (prevOrder + nextOrder) / 2
      next[newIndex] = { ...moved, order: newOrder }

      reorderTaskDocs(next).catch(() => showError('Failed to save order.'))
      return next
    })
  }, [showError])

  const clearStore = useCallback(async () => {
    setTasks([])
    setLog({})
    loadedRanges.current.clear()
    await clearAllUserData(uid)
  }, [uid])

  const resetStore = useCallback(async () => {
    await clearStore()
    const batch = generateSeedHistory(uid)
    await batch.commit()
  }, [uid, clearStore])

  const toggleProgressBar = useCallback(() => {
    setShowProgressBar(prev => {
      const next = !prev
      localStorage.setItem('tally_progress_bar', String(next))
      return next
    })
  }, [])

  const loadLogRangeIntoCache = useCallback(async (fromKey: string, toKey: string) => {
    const rangeKey = `${fromKey}|${toKey}`
    if (loadedRanges.current.has(rangeKey)) return
    loadedRanges.current.add(rangeKey)
    const entries = await loadLogRange(uid, fromKey, toKey)
    setLog(prev => {
      const next = { ...prev }
      for (const { dateKey: dk, taskId, entry } of entries) {
        next[dk] = { ...(next[dk] ?? {}), [taskId]: entry }
      }
      return next
    })
  }, [uid])

  const ctx: AppCtx = {
    tasks, log, showProgressBar, isLoading, errorMsg, clearError,
    updateEntry, saveTask, deleteTask, undoDeleteTask, purgeTaskLog,
    reorderTasks, clearStore, resetStore, toggleProgressBar,
    loadLogRangeIntoCache,
  }

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
}

export function useApp() {
  return useContext(Ctx)
}

// Helper to compute current date ranges for history
export function historyDailyRange(): { from: string; to: string } {
  const today = new Date()
  const from = dateKey(addDays(today, -(18 * 7 - 1)))
  return { from, to: dateKey(today) }
}

export function historyMonthlyRange(): { from: string; to: string } {
  const today = new Date()
  const from = monthKey(addMonths(today, -17))
  return { from, to: monthKey(today) }
}
