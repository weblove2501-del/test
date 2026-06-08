import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import styles from './Dashboard.module.css'

interface DashboardProps {
  onCreateTask: () => void
}

export default function Dashboard({ onCreateTask }: DashboardProps) {
  const { tasks } = useAppContext()

  const summary = useMemo(
    () => ({
      total: tasks.length,
      waiting: tasks.filter((task) => task.status === '대기').length,
      progress: tasks.filter((task) => task.status === '진행').length,
      done: tasks.filter((task) => task.status === '완료').length,
    }),
    [tasks],
  )

  const latestTasks = tasks.slice(0, 3)

  return (
    <section className={styles.dashboard}>
      <div className={styles.headline}>
        <div>
          <h1>대시보드</h1>
          <p>현재 업무 현황과 최근 작업을 한눈에 확인하세요.</p>
        </div>
        <button type="button" onClick={onCreateTask} className={styles.primaryButton}>
          신규 업무 등록
        </button>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <span className={styles.cardTitle}>전체 업무</span>
          <strong>{summary.total}</strong>
        </article>
        <article className={styles.card}>
          <span className={styles.cardTitle}>대기</span>
          <strong>{summary.waiting}</strong>
        </article>
        <article className={styles.card}>
          <span className={styles.cardTitle}>진행중</span>
          <strong>{summary.progress}</strong>
        </article>
        <article className={styles.card}>
          <span className={styles.cardTitle}>완료</span>
          <strong>{summary.done}</strong>
        </article>
      </div>

      <div className={styles.latestSection}>
        <div className={styles.latestHead}>
          <h2>최근 업무</h2>
          <span>최근 등록된 업무 목록입니다.</span>
        </div>
        <div className={styles.latestList}>
          {latestTasks.map((task) => (
            <div key={task.id} className={styles.latestItem}>
              <div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
              </div>
              <div className={styles.tag}>{task.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
