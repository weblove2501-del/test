import React from 'react'
import styles from './MDITabBar.module.css'
import { useAppContext } from '../../context/AppContext'

const MDITabBar: React.FC = () => {
  const { tabs, activeTabId, activateTab, closeTab } = useAppContext()

  return (
    <div className={styles.mdiTabBar} role="tablist" aria-label="Open tabs">
      <div className={styles.tabList}>
        {tabs.map(t => (
          <div
            key={t.id}
            role="tab"
            aria-selected={t.id === activeTabId}
            tabIndex={0}
            className={`${styles.tab} ${t.id === activeTabId ? styles.active : ''}`}
            onClick={() => activateTab(t.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') activateTab(t.id) }}
          >
            <span className={styles.tabTitle}>{t.title}</span>
            <button className={styles.closeBtn} aria-label={`close ${t.title}`} onClick={(ev) => { ev.stopPropagation(); closeTab(t.id) }}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MDITabBar
