import type { Task, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: '관리자', role: 'admin', email: 'admin@example.com' },
  { id: 'u2', name: '홍길동', role: 'user', email: 'user@example.com' },
  { id: 'u3', name: '이영희', role: 'user', email: 'developer@example.com' },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: '주간 업무 보고서 작성',
    description: '매주 금요일 오전에 팀 업무 보고서를 작성하고 공유합니다.',
    status: '진행',
    assignee: '홍길동',
    priority: '높음',
    dueDate: '2026-06-10',
    createdAt: '2026-06-03',
  },
  {
    id: 't2',
    title: '신규 회원 가입 흐름 점검',
    description: '가입 화면과 이메일 확인 과정을 테스트하고 오류를 수정합니다.',
    status: '대기',
    assignee: '이영희',
    priority: '보통',
    dueDate: '2026-06-12',
    createdAt: '2026-06-02',
  },
  {
    id: 't3',
    title: '월간 시스템 상태 알림 발송',
    description: '서비스 상태를 점검하고 알림 메시지를 전송합니다.',
    status: '완료',
    assignee: '관리자',
    priority: '낮음',
    dueDate: '2026-06-05',
    createdAt: '2026-05-30',
  },
];
