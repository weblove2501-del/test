import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import type { Task } from '../types'
import styles from './TaskDetail.module.css'

interface TaskDetailProps {
  task: Task
  onEdit: () => void
}

const statusOptions: Task['status'][] = ['대기', '진행', '완료']

export default function TaskDetail({ task, onEdit }: TaskDetailProps) {
  const { users, updateTask, deleteTask, notify } = useAppContext()

  const assigneeOptions = useMemo(() => users.map((user) => user.name), [users])

  const handleUpdate = (field: keyof Task, value: string) => {
    const updatedTask = { ...task, [field]: value } as Task
    updateTask(updatedTask)
  }

  return (
    <section className={styles.detail}>
      <div className={styles.header}>
        <div>
          <h1>업무 상세</h1>
          <p>선택된 업무 정보를 확인하고 수정할 수 있습니다.</p>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onEdit} className={styles.secondaryButton}>
            수정
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={() => {
              deleteTask(task.id)
              notify('업무 상세 화면에서 삭제되었습니다.')
            }}
          >
            삭제
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <div>
            <strong>업무명</strong>
            <p>{task.title}</p>
          </div>
          <div>
            <strong>담당자</strong>
            <select value={task.assignee} onChange={(event) => handleUpdate('assignee', event.target.value)}>
              {assigneeOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <strong>상태</strong>
            <select value={task.status} onChange={(event) => handleUpdate('status', event.target.value)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <strong>우선순위</strong>
            <p>{task.priority}</p>
          </div>
          <div>
            <strong>기한</strong>
            <p>{task.dueDate}</p>
          </div>
          <div>
            <strong>등록일</strong>
            <p>{task.createdAt}</p>
          </div>
        </div>
        <div className={styles.description}>
          <strong>설명</strong>
          <p>{task.description}</p>
        </div>
      </div>
    </section>
  )
}
