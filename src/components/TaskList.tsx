import { useMemo } from 'react'
import type { FilterState } from '../types'
import { useAppContext } from '../context/AppContext'
import styles from './TaskList.module.css'

interface TaskListProps {
  onCreateTask: () => void
  onSelectTask: (taskId: string) => void
}

export default function TaskList({ onCreateTask, onSelectTask }: TaskListProps) {
  const { tasks, filter, setFilter } = useAppContext()

  const assignees = useMemo(() => ['전체', ...Array.from(new Set(tasks.map((task) => task.assignee)))], [tasks])

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesStatus = filter.status === '전체' || task.status === filter.status
        const matchesAssignee = filter.assignee === '전체' || task.assignee === filter.assignee
        const matchesQuery = task.title.includes(filter.query) || task.description.includes(filter.query)
        return matchesStatus && matchesAssignee && matchesQuery
      }),
    [filter, tasks],
  )

  return (
    <section className={styles.taskList}>
      <div className={styles.header}>
        <div>
          <h1>업무 목록</h1>
          <p>검색과 필터로 원하는 업무를 빠르게 찾을 수 있습니다.</p>
        </div>
        <button type="button" onClick={onCreateTask} className={styles.primaryButton}>
          업무 추가
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          value={filter.query}
          placeholder="업무명 또는 설명 검색"
          onChange={(event) => setFilter({ query: event.target.value })}
        />
        <select
          value={filter.status}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setFilter({ status: event.target.value as FilterState['status'] })
          }
        >
          <option value="전체">전체 상태</option>
          <option value="대기">대기</option>
          <option value="진행">진행</option>
          <option value="완료">완료</option>
        </select>
        <select
          value={filter.assignee}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setFilter({ assignee: event.target.value as FilterState['assignee'] })
          }
        >
          {assignees.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>업무</th>
              <th>담당자</th>
              <th>상태</th>
              <th>우선순위</th>
              <th>기한</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} onClick={() => onSelectTask(task.id)}>
                <td>{task.title}</td>
                <td>{task.assignee}</td>
                <td>
                  <span className={styles.statusTag}>{task.status}</span>
                </td>
                <td>{task.priority}</td>
                <td>{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && <div className={styles.empty}>조건에 맞는 업무가 없습니다.</div>}
      </div>
    </section>
  )
}
