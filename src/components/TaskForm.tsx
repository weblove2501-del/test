import { useEffect, useMemo, useReducer } from 'react'
import type { FormEvent } from 'react'
import { useAppContext } from '../context/AppContext'
import type { Priority, Task, TaskStatus } from '../types'
import styles from './TaskForm.module.css'

interface TaskFormProps {
  task?: Task | null
  onClose: () => void
}

type TaskFormState = {
  title: string
  description: string
  status: TaskStatus
  assignee: string
  priority: Priority
  dueDate: string
  error: string | null
}

type TaskFormAction =
  | { type: 'reset'; payload: Omit<TaskFormState, 'error'> }
  | { type: 'setField'; field: keyof Omit<TaskFormState, 'error'>; value: string }
  | { type: 'setError'; error: string | null }

const statusOptions: TaskStatus[] = ['대기', '진행', '완료']
const priorityOptions: Priority[] = ['높음', '보통', '낮음']

function formReducer(state: TaskFormState, action: TaskFormAction): TaskFormState {
  switch (action.type) {
    case 'reset':
      return { ...action.payload, error: null }
    case 'setField':
      return { ...state, [action.field]: action.value, error: null }
    case 'setError':
      return { ...state, error: action.error }
    default:
      return state
  }
}

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const { users, addTask, updateTask } = useAppContext()

  const defaultValues = useMemo(
    () => ({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? '대기',
      assignee: task?.assignee ?? users[0]?.name ?? '',
      priority: task?.priority ?? '보통',
      dueDate: task?.dueDate ?? new Date().toISOString().slice(0, 10),
    }),
    [task, users],
  )

  const [formState, dispatch] = useReducer(formReducer, {
    ...defaultValues,
    error: null,
  })

  useEffect(() => {
    dispatch({ type: 'reset', payload: defaultValues })
  }, [defaultValues])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch({ type: 'setError', error: null })

    if (!formState.title.trim()) {
      dispatch({ type: 'setError', error: '업무명을 입력하세요.' })
      return
    }

    if (!formState.assignee.trim()) {
      dispatch({ type: 'setError', error: '담당자를 선택하세요.' })
      return
    }

    if (!formState.dueDate.trim()) {
      dispatch({ type: 'setError', error: '기한을 선택하세요.' })
      return
    }

    if (Number.isNaN(Date.parse(formState.dueDate))) {
      dispatch({ type: 'setError', error: '유효한 기한을 선택하세요.' })
      return
    }

    const newTask: Task = {
      id: task?.id ?? `t-${Date.now()}`,
      title: formState.title.trim(),
      description: formState.description.trim(),
      status: formState.status,
      assignee: formState.assignee,
      priority: formState.priority,
      dueDate: formState.dueDate,
      createdAt: task?.createdAt ?? new Date().toISOString().slice(0, 10),
    }

    if (task) {
      updateTask(newTask)
    } else {
      addTask(newTask)
    }

    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2>{task ? '업무 수정' : '업무 등록'}</h2>
            <p>업무 상세 정보를 입력하고 저장하세요.</p>
          </div>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            닫기
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span className={styles.label}>업무명</span>
            <input
              value={formState.title}
              onChange={(event) => dispatch({ type: 'setField', field: 'title', value: event.target.value })}
              className={`${styles.input} ${formState.error?.includes('업무명') ? styles.inputError : ''}`}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>설명</span>
            <textarea
              value={formState.description}
              onChange={(event) => dispatch({ type: 'setField', field: 'description', value: event.target.value })}
              className={styles.textarea}
            />
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>상태</span>
              <select
                value={formState.status}
                onChange={(event) => dispatch({ type: 'setField', field: 'status', value: event.target.value })}
                className={styles.select}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>담당자</span>
              <select
                value={formState.assignee}
                onChange={(event) => dispatch({ type: 'setField', field: 'assignee', value: event.target.value })}
                disabled={users.length === 0}
                className={`${styles.select} ${formState.error?.includes('담당자') ? styles.inputError : ''}`}
              >
                <option value="" disabled>
                  {users.length ? '담당자를 선택하세요.' : '사용자가 없습니다.'}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>우선순위</span>
              <select
                value={formState.priority}
                onChange={(event) => dispatch({ type: 'setField', field: 'priority', value: event.target.value })}
                className={styles.select}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>기한</span>
              <input
                type="date"
                value={formState.dueDate}
                onChange={(event) => dispatch({ type: 'setField', field: 'dueDate', value: event.target.value })}
                className={`${styles.input} ${(formState.error?.includes('기한') || formState.error?.includes('유효한')) ? styles.inputError : ''}`}
              />
              <div className={styles.fieldHint}>기한은 YYYY-MM-DD 형식으로 선택하세요.</div>
            </label>
          </div>

          {formState.error && <div className={styles.error}>{formState.error}</div>}

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.saveButton} disabled={users.length === 0}>
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
