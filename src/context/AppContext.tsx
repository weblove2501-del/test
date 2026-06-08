import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { mockTasks, mockUsers } from '../data/mockData'
import type { FilterState, Task, User } from '../types'
import { loginApi } from '../api/auth'

interface AppState {
  user: User | null
  tasks: Task[]
  selectedTaskId: string | null
  filter: FilterState
  notification: string | null
}

type AppAction =
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'selectTask'; taskId: string | null }
  | { type: 'setFilter'; filter: Partial<FilterState> }
  | { type: 'addTask'; task: Task }
  | { type: 'updateTask'; task: Task }
  | { type: 'deleteTask'; taskId: string }
  | { type: 'notify'; message: string }
  | { type: 'clearNotification' }

interface AppContextValue extends AppState {
  login: (email: string, password: string) => Promise<true | string>
  logout: () => void
  setFilter: (filter: Partial<FilterState>) => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  selectTask: (taskId: string | null) => void
  notify: (message: string) => void
  users: User[]
}

const initialState: AppState = {
  user: null,
  tasks: mockTasks,
  selectedTaskId: null,
  filter: {
    status: '전체',
    query: '',
    assignee: '전체',
  },
  notification: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.user, notification: `${action.user.name}님 환영합니다.` }
    case 'logout':
      return { ...state, user: null, selectedTaskId: null, filter: initialState.filter }
    case 'selectTask':
      return { ...state, selectedTaskId: action.taskId }
    case 'setFilter':
      return { ...state, filter: { ...state.filter, ...action.filter } }
    case 'addTask':
      return { ...state, tasks: [action.task, ...state.tasks], notification: '새 업무가 등록되었습니다.' }
    case 'updateTask':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
        notification: '업무가 저장되었습니다.',
      }
    case 'deleteTask':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
        selectedTaskId: state.selectedTaskId === action.taskId ? null : state.selectedTaskId,
        notification: '업무가 삭제되었습니다.',
      }
    case 'notify':
      return { ...state, notification: action.message }
    case 'clearNotification':
      return { ...state, notification: null }
    default:
      return state
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const login = async (email: string, password: string): Promise<true | string> => {
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail || !password) {
      return '이메일과 비밀번호를 입력하세요.'
    }

    // Attempt real API login first
    const result = await loginApi(trimmedEmail, password)
    if (result.ok) {
      dispatch({ type: 'login', user: result.user })
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-system-token', result.token)
        localStorage.setItem('admin-system-user', JSON.stringify(result.user))
      }
      return true
    }

    // Fallback to local mock users (useful for development when backend not present)
    const user = mockUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (!user || password !== 'password') {
      // Prefer detailed message from API when available, otherwise generic error
      return result.message || '이메일 또는 비밀번호가 올바르지 않습니다.'
    }

    dispatch({ type: 'login', user })
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-system-token', 'dummy-token')
      localStorage.setItem('admin-system-user', JSON.stringify(user))
    }

    return true
  }

  const logout = () => {
    dispatch({ type: 'logout' })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-system-token')
      localStorage.removeItem('admin-system-user')
    }
  }

  const setFilter = (filter: Partial<FilterState>) => dispatch({ type: 'setFilter', filter })
  const addTask = (task: Task) => dispatch({ type: 'addTask', task })
  const updateTask = (task: Task) => dispatch({ type: 'updateTask', task })
  const deleteTask = (taskId: string) => dispatch({ type: 'deleteTask', taskId })
  const selectTask = (taskId: string | null) => dispatch({ type: 'selectTask', taskId })
  const notify = (message: string) => dispatch({ type: 'notify', message })

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      setFilter,
      addTask,
      updateTask,
      deleteTask,
      selectTask,
      notify,
      users: mockUsers,
    }),
    [state],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('AppContext가 AppProvider 내부에서 사용되어야 합니다.')
  }
  return context
}
