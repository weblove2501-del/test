export type Role = 'admin' | 'user'
export type TaskStatus = '대기' | '진행' | '완료'
export type Priority = '높음' | '보통' | '낮음'

export interface User {
  id: string
  name: string
  role: Role
  email: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  priority: Priority
  dueDate: string
  createdAt: string
}

export interface FilterState {
  status: '전체' | TaskStatus
  query: string
  assignee: '전체' | string
}
