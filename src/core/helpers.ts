import type { Task, TaskEntry, PillEntry, ExerciseEntry, TransferEntry, SpendEntry, DayLog } from './models'

// --- Date helpers ---

export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function monthKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function addMonths(d: Date, n: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function formatLongDate(d: Date): string {
  if (isSameDay(d, new Date())) return 'Today'
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function formatMonthLabel(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatShortDate(d: Date): string {
  return `${SHORT_DAYS[d.getDay()]}, ${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function formatShortMonth(d: Date): string {
  return SHORT_MONTHS[d.getMonth()]
}

// --- Completion helpers ---

export function completionLevel(task: Task, entry: TaskEntry | null | undefined): number {
  if (!entry) return 0
  if (task.type === 'pill') {
    const e = entry as PillEntry
    const count = (e.morning ? 1 : 0) + (e.evening ? 1 : 0)
    if (count === 2) return 4
    if (count === 1) return 2
    return 0
  }
  if (task.type === 'exercise') {
    const e = entry as ExerciseEntry
    if (task.mode === 'duration') {
      const d = e.duration ?? 0
      if (d >= 60) return 4
      if (d >= 45) return 3
      if (d >= 30) return 2
      if (d > 0) return 1
      return 0
    } else {
      const d = e.distance ?? 0
      if (d >= 2000) return 4
      if (d >= 1500) return 3
      if (d >= 1000) return 2
      if (d > 0) return 1
      return 0
    }
  }
  if (task.type === 'transfer') {
    const e = entry as TransferEntry
    const a = e.amount ?? 0
    if (a >= 20000) return 4
    if (a >= 7500) return 3
    if (a > 0) return 2
    return 0
  }
  if (task.type === 'spend') {
    const e = entry as SpendEntry
    const a = e.amount ?? 0
    if (a >= 2000) return 4
    if (a >= 500) return 3
    if (a >= 100) return 2
    if (a > 0) return 1
    return 0
  }
  return 0
}

export function isTaskDone(task: Task, entry: TaskEntry | null | undefined): boolean {
  if (task.type === 'pill') {
    const e = entry as PillEntry | null | undefined
    return !!(e?.morning && e?.evening)
  }
  return completionLevel(task, entry) > 0
}

export function dayCompletion(tasks: Task[], dayLog: DayLog | undefined): number {
  if (!tasks.length) return 0
  const done = tasks.filter(t => isTaskDone(t, dayLog?.[t.id])).length
  return done / tasks.length
}

export function taskTypeLabel(task: Task): string {
  if (task.type === 'pill') return 'MEDICATION'
  if (task.type === 'exercise') {
    return task.mode === 'duration' ? 'DURATION' : 'DISTANCE'
  }
  if (task.type === 'transfer') return 'TRANSFER'
  return 'SPEND'
}

export function taskSubLabel(task: Task): string {
  if (task.type === 'pill') return 'Pill · Morning + Evening'
  if (task.type === 'exercise') {
    const mode = task.mode === 'duration' ? 'Duration' : 'Distance'
    return `Exercise · ${mode}`
  }
  if (task.type === 'transfer') return 'Transfer · THB'
  return 'Spend · THB'
}

export function logKey(task: Task, date: Date): string {
  return task.frequency === 'monthly' ? monthKey(date) : dateKey(date)
}
