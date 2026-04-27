import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { Task, TaskEntry } from '../core/models'

// --- Tasks ---

export function subscribeToTasks(
  uid: string,
  onData: (tasks: Task[]) => void,
  onError: (e: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'tasks'),
    where('uid', '==', uid),
  )
  return onSnapshot(q, snap => {
    const tasks = snap.docs
      .map(d => d.data() as Task)
      .sort((a, b) => a.order - b.order)
    onData(tasks)
  }, onError)
}

export async function saveTaskDoc(task: Task): Promise<void> {
  await setDoc(doc(db, 'tasks', task.id), task)
}

export async function deleteTaskDoc(taskId: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', taskId))
}

export async function purgeTaskLogDocs(uid: string, taskId: string): Promise<void> {
  const q = query(collection(db, 'log'), where('uid', '==', uid))
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.docs
    .filter(d => d.data().taskId === taskId)
    .forEach(d => batch.delete(d.ref))
  if (snap.docs.length > 0) await batch.commit()
}

export async function reorderTaskDocs(tasks: Task[]): Promise<void> {
  const batch = writeBatch(db)
  tasks.forEach(t => batch.update(doc(db, 'tasks', t.id), { order: t.order }))
  await batch.commit()
}

// --- Log entries ---

function logDocId(uid: string, dateKey: string, taskId: string): string {
  return `${uid}_${dateKey}_${taskId}`
}

export function flattenEntry(entry: TaskEntry): Record<string, unknown> {
  return { ...entry }
}

export async function setLogEntry(
  uid: string,
  dk: string,
  taskId: string,
  entry: TaskEntry,
): Promise<void> {
  const ref = doc(db, 'log', logDocId(uid, dk, taskId))
  await setDoc(ref, { uid, dateKey: dk, taskId, ...flattenEntry(entry) }, { merge: true })
}

export async function deleteLogEntry(
  uid: string,
  dk: string,
  taskId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'log', logDocId(uid, dk, taskId)))
}

export async function loadLogRange(
  uid: string,
  fromKey: string,
  toKey: string,
): Promise<Array<{ dateKey: string; taskId: string; entry: TaskEntry }>> {
  const q = query(collection(db, 'log'), where('uid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs
    .filter(d => {
      const dk = d.data().dateKey as string
      return dk >= fromKey && dk <= toKey
    })
    .map(d => {
      const { uid: _u, dateKey, taskId, ...rest } = d.data()
      return { dateKey, taskId, entry: rest as TaskEntry }
    })
}

export async function clearAllUserData(uid: string): Promise<void> {
  const taskQ = query(collection(db, 'tasks'), where('uid', '==', uid))
  const logQ  = query(collection(db, 'log'),   where('uid', '==', uid))

  const [taskSnap, logSnap] = await Promise.all([getDocs(taskQ), getDocs(logQ)])
  const batch = writeBatch(db)
  taskSnap.docs.forEach(d => batch.delete(d.ref))
  logSnap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
}
