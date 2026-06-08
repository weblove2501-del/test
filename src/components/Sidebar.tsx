import styles from './Sidebar.module.css'
import type { Role } from '../types'

interface SidebarProps {
  userName: string
  role: Role
  activeView: 'dashboard' | 'tasks' | 'detail'
  onViewChange: (view: 'dashboard' | 'tasks' | 'detail') => void
  onLogout: () => void
}

const menuItems = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'tasks', label: '업무 목록' },
]

export default function Sidebar({ userName, role, activeView, onViewChange, onLogout }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <strong>Admin System</strong>
        <span>{role === 'admin' ? '관리자' : '일반 사용자'}</span>
      </div>
      <div className={styles.profile}>
        <div className={styles.avatar}>{userName.slice(0, 1)}</div>
        <div>
          <p className={styles.name}>{userName}</p>
          <p className={styles.caption}>환영합니다.</p>
        </div>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeView === item.id ? styles.active : ''}
            onClick={() => onViewChange(item.id as SidebarProps['activeView'])}
          >
            {item.label}
          </button>
        ))}
        {role === 'admin' && (
          <button type="button" onClick={() => onViewChange('detail')}>
            권한 관리(샘플)
          </button>
        )}
      </nav>
      <button type="button" className={styles.logout} onClick={onLogout}>
        로그아웃
      </button>
    </aside>
  )
}
