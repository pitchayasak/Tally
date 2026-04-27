export type TaskType = 'pill' | 'exercise' | 'transfer' | 'spend'
export type TaskFrequency = 'daily' | 'monthly'
export type ExerciseMode = 'duration' | 'distance'
export type ExerciseIcon = 'run' | 'bicycle' | 'play' | 'drive'

export interface Task {
  id: string
  uid: string
  type: TaskType
  name: string
  color: string
  created: number
  frequency: TaskFrequency
  mode?: ExerciseMode
  icon?: ExerciseIcon
  order: number
}

export interface PillEntry {
  morning?: boolean
  evening?: boolean
}

export interface ExerciseEntry {
  duration?: number
  distance?: number
}

export interface TransferEntry {
  amount?: number
}

export interface SpendEntry {
  amount?: number
}

export type TaskEntry = PillEntry | ExerciseEntry | TransferEntry | SpendEntry

export type DayLog = Record<string, TaskEntry | null>
export type LogMap = Record<string, DayLog>
