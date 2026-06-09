import React from 'react'
import styles from './GNB.module.css'

const menu = [
  { label: 'Home', submenu: ['Overview','Stats'] },
  { label: 'Projects', submenu: ['List','Boards','Calendar'] },
  { label: 'Reports', submenu: ['Monthly','Annual'] },
]

const GNB: React.FC = () => {
  return (
    <header className={styles.gnb}>
      <div className={styles.logoArea}>MyCompany</div>
      <nav className={styles.primaryNav}>
        {menu.map(item => (
          <div key={item.label} className={styles.navItem}>
            <span className={styles.navLabel}>{item.label}</span>
            <div className={styles.submenu}>
              {item.submenu.map(s => (
                <div key={s} className={styles.submenuItem}>{s}</div>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className={styles.userArea}>
        <div className={styles.userName}>Admin</div>
        <button className={styles.iconBtn} aria-label="settings">⚙️</button>
        <button className={styles.iconBtn} aria-label="logout">Logout</button>
      </div>
    </header>
  )
}

export default GNB
