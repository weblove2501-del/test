/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { mockTasks, mockUsers } from '../data/mockData';
import type { FilterState, Task, User } from '../types';
import { loginApi } from '../api/auth';
import tokenManager from '../api/token';

interface AppState {
  user: User | null;
  tasks: Task[];
  selectedTaskId: string | null;
  filter: FilterState;
  notification: string | null;
  tabs: { id: string; title: string }[];
  activeTabId: string | null;
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
  | { type: 'openTab'; tab: { id: string; title: string } }
  | { type: 'closeTab'; id: string }
  | { type: 'activateTab'; id: string }

interface AppContextValue extends AppState {
  login: (email: string, password: string) => Promise<true | string>;
  logout: () => void;
  setFilter: (filter: Partial<FilterState>) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  selectTask: (taskId: string | null) => void;
  notify: (message: string) => void;
  users: User[];
  openTab: (tab: { id: string; title: string }) => void;
  closeTab: (id: string) => void;
  activateTab: (id: string) => void;
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
  tabs: [{ id: 'home', title: 'Home' }],
  activeTabId: 'home',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.user, notification: `${action.user.name}님 환영합니다.` };
    case 'logout':
      return { ...state, user: null, selectedTaskId: null, filter: initialState.filter };
    case 'selectTask':
      return { ...state, selectedTaskId: action.taskId };
    case 'setFilter':
      return { ...state, filter: { ...state.filter, ...action.filter } };
    case 'addTask':
      return {
        ...state,
        tasks: [action.task, ...state.tasks],
        notification: '새 업무가 등록되었습니다.',
      };
    case 'updateTask':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
        notification: '업무가 저장되었습니다.',
      };
    case 'deleteTask':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
        selectedTaskId: state.selectedTaskId === action.taskId ? null : state.selectedTaskId,
        notification: '업무가 삭제되었습니다.',
      };
    case 'notify':
      return { ...state, notification: action.message };
    case 'clearNotification':
      return { ...state, notification: null };
    case 'openTab':
      // if already exists, activate
      if (state.tabs.find(t => t.id === action.tab.id)) {
        return { ...state, activeTabId: action.tab.id }
      }
      return { ...state, tabs: [...state.tabs, action.tab], activeTabId: action.tab.id }
    case 'closeTab': {
      const remaining = state.tabs.filter(t => t.id !== action.id)
      const newActive = state.activeTabId === action.id ? (remaining.length ? remaining[remaining.length - 1].id : null) : state.activeTabId
      return { ...state, tabs: remaining, activeTabId: newActive }
    }
    case 'activateTab':
      return { ...state, activeTabId: action.id }
    default:
      return state;
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (email: string, password: string): Promise<true | string> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return '이메일과 비밀번호를 입력하세요.';
    }

    // Attempt real API login first
    const result = await loginApi(trimmedEmail, password);
    if (result.ok) {
      dispatch({ type: 'login', user: result.user });
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-system-user', JSON.stringify(result.user));
        tokenManager.saveToken(result.token, result.expiresIn);
        tokenManager.scheduleRefresh((newToken) => {
          // if refresh failed, newToken will be empty string -> force logout
          if (!newToken) {
            dispatch({ type: 'logout' });
            dispatch({ type: 'notify', message: '세션이 만료되었습니다. 다시 로그인하세요.' });
          }
        });
      }
      return true;
    }

    // Fallback to local mock users (useful for development when backend not present)
    const user = mockUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!user || password !== 'password') {
      // Prefer detailed message from API when available, otherwise generic error
      return result.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
    }

    dispatch({ type: 'login', user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-system-user', JSON.stringify(user));
      tokenManager.saveToken('dummy-token', 60);
      tokenManager.scheduleRefresh((newToken) => {
        if (!newToken) {
          dispatch({ type: 'logout' });
          dispatch({ type: 'notify', message: '세션이 만료되었습니다. 다시 로그인하세요.' });
        }
      });
    }

    return true;
  };

  // Try to refresh token if available
  useEffect(() => {
    // On mount, if token exists, schedule refresh using tokenManager
    if (typeof window !== 'undefined') {
      // Restore user from localStorage if available
      const saved = localStorage.getItem('admin-system-user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as User;
          if (parsed && parsed.id) {
            dispatch({ type: 'login', user: parsed });
          }
        } catch {
          // ignore
        }
      }

      const token = tokenManager.getToken();
      if (token) {
        tokenManager.scheduleRefresh((newToken) => {
          if (!newToken) {
            // cleared -> logout locally and notify user
            dispatch({ type: 'logout' });
            dispatch({ type: 'notify', message: '세션이 만료되었습니다. 다시 로그인하세요.' });
          }
        });
      }
    }

    return () => {
      tokenManager.stopRefresh();
    };
  }, []);

  const logout = () => {
    dispatch({ type: 'logout' });
    if (typeof window !== 'undefined') {
      tokenManager.clearToken();
      tokenManager.stopRefresh();
      localStorage.removeItem('admin-system-user');
    }
  };

  const setFilter = (filter: Partial<FilterState>) => dispatch({ type: 'setFilter', filter });
  const addTask = (task: Task) => dispatch({ type: 'addTask', task });
  const updateTask = (task: Task) => dispatch({ type: 'updateTask', task });
  const deleteTask = (taskId: string) => dispatch({ type: 'deleteTask', taskId });
  const selectTask = (taskId: string | null) => dispatch({ type: 'selectTask', taskId });
  const notify = (message: string) => dispatch({ type: 'notify', message });
  const openTab = (tab: { id: string; title: string }) => dispatch({ type: 'openTab', tab })
  const closeTab = (id: string) => dispatch({ type: 'closeTab', id })
  const activateTab = (id: string) => dispatch({ type: 'activateTab', id })

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
      openTab,
      closeTab,
      activateTab,
      users: mockUsers,
    }),
    [state],
  );

  // Persist tabs/activeTab to localStorage so MDI state survives reloads
  useEffect(() => {
    try {
      localStorage.setItem('mdi-tabs', JSON.stringify({ tabs: state.tabs, activeTabId: state.activeTabId }))
    } catch {
      // ignore
    }
  }, [state.tabs, state.activeTabId])

  // On mount, restore tabs if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mdi-tabs')
      if (raw) {
        const parsed = JSON.parse(raw) as { tabs?: { id: string; title: string }[]; activeTabId?: string }
        if (parsed?.tabs && parsed.tabs.length) {
          // Replace current tabs with restored tabs
          dispatch({ type: 'openTab', tab: parsed.tabs[0] })
          // open remaining without changing active each time
          parsed.tabs.slice(1).forEach(t => dispatch({ type: 'openTab', tab: t }))
          if (parsed.activeTabId) dispatch({ type: 'activateTab', id: parsed.activeTabId })
        }
      }
    } catch {
      // ignore
    }
    // (intentionally run once on mount)
  }, [])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AppContext가 AppProvider 내부에서 사용되어야 합니다.');
  }
  return context;
}
