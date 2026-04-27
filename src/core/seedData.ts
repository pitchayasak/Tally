import { writeBatch, doc, collection } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Task } from './models'
import { dateKey, monthKey } from './helpers'

export const SEED_TASKS: Omit<Task, 'uid'>[] = [
  { id: 't1', type: 'pill',     name: 'Vitamin D',      color: '#F4B740', created: 0, frequency: 'daily',   order: 0 },
  { id: 't2', type: 'pill',     name: 'Magnesium',      color: '#C4A7E7', created: 0, frequency: 'daily',   order: 1000 },
  { id: 't3', type: 'exercise', name: 'Morning Run',    color: '#6DD3A8', created: 0, frequency: 'daily',   mode: 'distance', icon: 'run',   order: 2000 },
  { id: 't4', type: 'exercise', name: 'Yoga',           color: '#E57ABD', created: 0, frequency: 'daily',   mode: 'duration', icon: 'play',  order: 3000 },
  { id: 't5', type: 'transfer', name: 'Savings',        color: '#5EC7E8', created: 0, frequency: 'monthly', order: 4000 },
  { id: 't6', type: 'spend',    name: 'Daily spend',    color: '#F07A5A', created: 0, frequency: 'daily',   order: 5000 },
  { id: 't7', type: 'spend',    name: 'Monthly budget', color: '#8A8CD9', created: 0, frequency: 'monthly', order: 6000 },
]

export const SEED_DESCRIPTION =
  '7 ตัวอย่าง task (ยา · วิ่ง · โยคะ · เงินออม · ค่าใช้จ่าย) พร้อม entry ของวันนี้และเดือนนี้'

export function generateSeedHistory(uid: string) {
  const batch = writeBatch(db)
  const now = Date.now()
  const today = new Date()
  const dk = dateKey(today)
  const mk = monthKey(today)

  // Write tasks
  SEED_TASKS.forEach(t => {
    const docId = `${uid}_${t.id}`
    const ref = doc(collection(db, 'tasks'), docId)
    batch.set(ref, { ...t, uid, id: docId, created: now })
  })

  // Today's entries for daily tasks
  const todayEntries: Record<string, Record<string, unknown>> = {
    [`${uid}_t1`]: { morning: true, evening: true },
    [`${uid}_t2`]: { morning: true, evening: false },
    [`${uid}_t3`]: { distance: 1500 },
    [`${uid}_t4`]: { duration: 30 },
    [`${uid}_t6`]: { amount: 250 },
  }

  for (const [taskDocId, entry] of Object.entries(todayEntries)) {
    const ref = doc(collection(db, 'log'), `${uid}_${dk}_${taskDocId}`)
    batch.set(ref, { uid, dateKey: dk, taskId: taskDocId, ...entry })
  }

  // This month's entries for monthly tasks
  const monthEntries: Record<string, Record<string, unknown>> = {
    [`${uid}_t5`]: { amount: 20000 },
    [`${uid}_t7`]: { amount: 8500 },
  }

  for (const [taskDocId, entry] of Object.entries(monthEntries)) {
    const ref = doc(collection(db, 'log'), `${uid}_${mk}_${taskDocId}`)
    batch.set(ref, { uid, dateKey: mk, taskId: taskDocId, ...entry })
  }

  return batch
}
