import React from 'react'
import DataTable from '../components/DataTable/DataTable'
import type { ColumnDef, FilterDef } from '../components/DataTable/DataTable'

const columns: ColumnDef[] = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
]

const filters: FilterDef[] = [
  { key: 'query', label: 'Search', type: 'text', placeholder: 'Search name or email' },
  { key: 'department', label: 'Department', type: 'select', options: ['All','Engineering','HR','Sales'] },
]

const Dashboard: React.FC = () => {
  return (
    <section>
      <h1>Dashboard</h1>
      <DataTable columns={columns} filters={filters} apiUrl={'/mock/employees.json'} />
    </section>
  )
}

export default Dashboard
