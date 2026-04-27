import { useState, useRef, useCallback } from 'react'
import {
  DndContext, closestCenter,
  KeyboardSensor, PointerSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { TaskRow } from '../components/tasks/TaskRow'
import { TaskEditorSheet } from '../components/tasks/TaskEditorSheet'
import { UndoToast } from '../components/tasks/UndoToast'
import type { Task } from '../core/models'

export function TasksPage() {
  const { tasks, saveTask, deleteTask, undoDeleteTask, purgeTaskLog, reorderTasks } = useApp()
  const { user } = useAuth()
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined)
  const [deletedTask, setDeletedTask] = useState<Task | null>(null)
  const [deletedIndex, setDeletedIndex] = useState(0)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = tasks.findIndex(t => t.id === active.id)
    const newIdx = tasks.findIndex(t => t.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) reorderTasks(oldIdx, newIdx)
  }, [tasks, reorderTasks])

  function handleDelete(task: Task) {
    const idx = tasks.indexOf(task)
    deleteTask(task.id)
    setDeletedTask(task)
    setDeletedIndex(idx)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => {
      purgeTaskLog(task.id)
      setDeletedTask(null)
    }, 4000)
  }

  function handleUndo() {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    if (deletedTask) undoDeleteTask(deletedTask, deletedIndex)
    setDeletedTask(null)
  }

  // editingTask: undefined = closed, null = creating new, Task = editing
  const isEditorOpen = editingTask !== undefined

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ flex: 1, margin: 0, fontSize: 22, fontWeight: 800 }}>Tasks</h2>
        <button
          onClick={() => setEditingTask(null)}
          style={{
            background: 'var(--accent-faint)', border: '1px solid var(--accent-dim)',
            borderRadius: 8, padding: '8px 14px',
            color: 'var(--accent)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >+ New</button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✏️</div>
          <p>No tasks yet.</p>
          <p style={{ fontSize: 13 }}>Tap + New to add your first task.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {isEditorOpen && (
        <TaskEditorSheet
          task={editingTask}
          uid={user!.uid}
          onSave={(t, isNew) => saveTask(t, isNew)}
          onDelete={taskId => handleDelete(tasks.find(t => t.id === taskId)!)}
          onClose={() => setEditingTask(undefined)}
        />
      )}

      {deletedTask && (
        <UndoToast
          message={`"${deletedTask.name}" deleted`}
          onUndo={handleUndo}
        />
      )}
    </div>
  )
}
