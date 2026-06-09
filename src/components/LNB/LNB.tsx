import React from 'react'
import styles from './LNB.module.css'

type Props = { isOpen: boolean; onToggle: () => void }

const items = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '📁', label: 'Projects' },
  { icon: '👥', label: 'Teams' },
  { icon: '⚙️', label: 'Settings' },
]

const LNB: React.FC<Props> = ({isOpen, onToggle}) => {
  return (
    <aside className={`${styles.lnb} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.topControls}>
        <button className={styles.hamburger} onClick={onToggle} aria-label="toggle">
          ☰
        </button>
      </div>
      <nav className={styles.menuList}>
        {items.map(it => (
          <div key={it.label} className={styles.menuItem} title={it.label}>
            <div className={styles.icon}>{it.icon}</div>
            <div className={styles.label}>{it.label}</div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default LNB
