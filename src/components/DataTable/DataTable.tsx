import React, {useEffect, useMemo, useState} from 'react'

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
  [key: string]: unknown
}

export type ColumnDef = { key: string; label: string }
export type FilterDef =
  | { key: string; label: string; type: 'text'; placeholder?: string }
  | { key: string; label: string; type: 'select'; options: string[] }

import styles from './DataTable.module.css'
import { apiUrl as buildApiUrl } from '../../config/api'

type Props = {
  columns: ColumnDef[]
  filters: FilterDef[]
  apiUrl?: string
}

const DataTable: React.FC<Props> = ({columns, filters, apiUrl = '/mock/employees.json'}) => {
  const [data, setData] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterState, setFilterState] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    filters.forEach(f => (init[f.key] = f.type === 'select' ? 'All' : ''))
    return init
  })

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = apiUrl.startsWith('http') ? apiUrl : buildApiUrl(apiUrl)
        const r = await fetch(url)
        if (!r.ok) throw new Error('Network error')
        const json = (await r.json()) as Employee[]
        if (mounted) setData(json)
      } catch (e) {
        if (mounted) setError(String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [apiUrl])

  const filtered = useMemo(() => {
    return data.filter(row => {
      return filters.every(f => {
        const val = filterState[f.key] || ''
        if (!val || val === 'All') return true
        if (f.type === 'text') {
          const s = val.toLowerCase()
          return Object.values(row).some(v => String(v ?? '').toLowerCase().includes(s))
        }
        if (f.type === 'select') {
          return String((row as Record<string, unknown>)[f.key] ?? '') === val
        }
        return true
      })
    })
  }, [data, filterState, filters])

  function onFilterChange(key: string, value: string) {
    setFilterState(prev => ({...prev, [key]: value}))
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.controlsArea}>
        {filters.map(f =>
          f.type === 'text' ? (
            <div className={styles.controlItem} key={f.key}>
              <label className={styles.controlLabel}>{f.label}</label>
              <input
                className={styles.controlInput}
                value={filterState[f.key] || ''}
                placeholder={f.placeholder}
                onChange={e => onFilterChange(f.key, e.target.value)}
              />
            </div>
          ) : (
            <div className={styles.controlItem} key={f.key}>
              <label className={styles.controlLabel}>{f.label}</label>
              <select
                className={styles.controlSelect}
                value={filterState[f.key] || 'All'}
                onChange={e => onFilterChange(f.key, e.target.value)}
              >
                {(f.options || []).map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ),
        )}
      </div>

      {loading ? (
        <div className={styles.message}>Loading...</div>
      ) : error ? (
        <div className={styles.messageError}>{error}</div>
      ) : (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} className={styles.th}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className={styles.tr}>
                {columns.map(c => (
                  <td key={c.key} className={styles.td}>
                    {String((row as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default DataTable
