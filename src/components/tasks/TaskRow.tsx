import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../core/models'
import { taskTypeLabel } from '../../core/helpers'
import { FreqBadge } from '../shared/FreqBadge'
import { DragHandle } from '../icons/DragHandle'

interface Props {
  task: Task
  onEdit: () => void
}

export function TaskRow({ task, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: 'var(--card)',
        border: '1px solid rgba(244,183,64,0.1)',
        borderRadius: 12, marginBottom: 8,
        display: 'flex', alignItems: 'center',
        zIndex: isDragging ? 100 : 'auto',
      }}
    >
      <div
        {...attributes}
        {...listeners}
        style={{ padding: '14px 12px', cursor: 'grab', flexShrink: 0, touchAction: 'none' }}
      >
        <DragHandle />
      </div>
      <div
        style={{ width: 3, height: 28, borderRadius: 2, background: task.color, flexShrink: 0, marginRight: 12 }}
      />
      <div style={{ flex: 1, minWidth: 0 }} onClick={onEdit}>
        <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: 1 }}>
          {taskTypeLabel(task)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.name}
        </div>
      </div>
      <div style={{ paddingRight: 8, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FreqBadge freq={task.frequency} />
        <button
          onClick={onEdit}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-sub)', fontSize: 18, cursor: 'pointer', padding: '4px 8px',
          }}
        >›</button>
      </div>
    </div>
  )
}
