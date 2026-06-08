import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import httpFetch from '../../api/http';
import styles from './Layout.module.css';

interface RawEmployee {
  empNo: string;
  name: string;
  deptName: string;
  position: string;
}

interface Employee extends RawEmployee {
  status: '진행' | '완료' | '대기';
  assignedTo: string;
}

interface FilterField {
  key: 'keyword' | 'deptName' | 'status';
  label: string;
  placeholder: string;
  type: 'text' | 'select';
  options?: string[];
}

interface ColumnDefinition {
  key: keyof Employee | 'actions';
  label: string;
  width?: string;
}

const gnbMenu = [
  { label: '대시보드', subItems: ['전체 현황', '오늘 일정'] },
  { label: '업무관리', subItems: ['진행업무', '완료업무', '내 할 일'] },
  { label: '보고서', subItems: ['주간 리포트', '월간 리포트'] },
];

const filterFields: FilterField[] = [
  { key: 'keyword', label: '검색어', placeholder: '사번, 이름, 직무 검색', type: 'text' },
  {
    key: 'deptName',
    label: '부서',
    placeholder: '부서 선택',
    type: 'select',
    options: ['전체', '인사팀', '개발팀', '품질보증팀'],
  },
  {
    key: 'status',
    label: '상태',
    placeholder: '상태 선택',
    type: 'select',
    options: ['전체', '진행', '완료', '대기'],
  },
];

const tableColumns: ColumnDefinition[] = [
  { key: 'empNo', label: '사번', width: '120px' },
  { key: 'name', label: '이름', width: '140px' },
  { key: 'deptName', label: '부서', width: '180px' },
  { key: 'position', label: '직급', width: '140px' },
  { key: 'status', label: '업무 상태', width: '140px' },
  { key: 'assignedTo', label: '담당자', width: '160px' },
  { key: 'actions', label: '작업', width: '120px' },
];

const defaultTabs = [
  { id: 'dashboard', title: '대시보드' },
  { id: 'tasks', title: '진행업무' },
  { id: 'report', title: '보고서' },
];

const statusColor = {
  진행: styles.statusBadgeActive,
  완료: styles.statusBadgeSuccess,
  대기: styles.statusBadgeWarning,
};

export default function Layout() {
  const { notification } = useAppContext();
  const [isLnbOpen, setIsLnbOpen] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState({ keyword: '', deptName: '전체', status: '전체' });
  const [activeTabId, setActiveTabId] = useState('dashboard');

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await httpFetch('/mock/employees.json');
        const data = (await response.json()) as RawEmployee[];
        const enriched: Employee[] = data.map((item, index) => ({
          ...item,
          status: index % 3 === 0 ? '진행' : index % 3 === 1 ? '완료' : '대기',
          assignedTo: index === 0 ? '김철수' : index === 1 ? '이영희' : '박민수',
        }));
        setEmployees(enriched);
      } catch (error) {
        console.error('직원 데이터 로드 실패', error);
      }
    }

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const keywordMatched =
          search.keyword.trim() === '' ||
          employee.empNo.includes(search.keyword) ||
          employee.name.includes(search.keyword) ||
          employee.position.includes(search.keyword);

        const deptMatched = search.deptName === '전체' || employee.deptName === search.deptName;

        const statusMatched = search.status === '전체' || employee.status === search.status;

        return keywordMatched && deptMatched && statusMatched;
      }),
    [employees, search],
  );

  const handleFilterChange = (key: keyof typeof search, value: string) => {
    setSearch((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleLnb = () => {
    setIsLnbOpen((prev) => !prev);
  };

  const handleTabClose = (id: string) => {
    setActiveTabId((current) => {
      if (current === id && defaultTabs.length > 1) {
        const nextTab = defaultTabs.find((tab) => tab.id !== id);
        return nextTab?.id ?? current;
      }
      return current;
    });
  };

  return (
    <div className={styles.layout}>
      <header className={styles.layout__gnb}>
        <div className={styles.gnb__logo}>ADMIN SYSTEM</div>
        <nav className={styles.gnb__menu}>
          {gnbMenu.map((item) => (
            <div key={item.label} className={styles.gnb__item}>
              <button type="button" className={styles.gnb__itemLabel}>
                {item.label}
              </button>
              <div className={styles.gnb__dropdown}>
                {item.subItems.map((subMenu) => (
                  <button key={subMenu} type="button" className={styles.dropdown__item}>
                    {subMenu}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className={styles.gnb__actions}>
          <div className={styles.userBadge}>관리자</div>
          <button type="button" className={styles.iconButton} aria-label="설정">
            ⚙️
          </button>
          <button type="button" className={styles.iconButton} aria-label="로그아웃">
            로그아웃
          </button>
        </div>
      </header>

      <div className={styles.layout__body}>
        {/* screen-reader live region for global notifications */}
        <div
          role="status"
          aria-live="polite"
          style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
        >
          {notification ?? ''}
        </div>
        <aside
          className={`${styles.lnb} ${!isLnbOpen ? styles['lnb--collapsed'] : ''}`}
          aria-expanded={isLnbOpen}
        >
          <button type="button" className={styles.lnb__toggle} onClick={handleToggleLnb}>
            <span className={styles.lnb__toggleIcon}>☰</span>
            <span className={styles.lnb__toggleText}>메뉴</span>
          </button>
          <nav className={styles.lnb__nav}>
            {['집계', '업무', '보고서', '설정'].map((item) => (
              <button key={item} type="button" className={styles.lnb__item}>
                <span className={styles.lnb__itemIcon}>•</span>
                <span className={styles.lnb__itemText}>{item}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.content}>
          <section className={styles.content__hero}>
            <div>
              <p className={styles.content__badge}>업무 시스템</p>
              <h1 className={styles.content__title}>업무 목록</h1>
            </div>
            <div className={styles.content__meta}>
              <span className={styles.meta__label}>활성 탭</span>
              <strong className={styles.meta__value}>
                {activeTabId === 'dashboard'
                  ? '대시보드'
                  : activeTabId === 'tasks'
                    ? '진행업무'
                    : '보고서'}
              </strong>
            </div>
          </section>

          <section className={styles.content__filters}>
            {filterFields.map((filter) => (
              <div key={filter.key} className={styles.filter__item}>
                <label className={styles.filter__label}>{filter.label}</label>
                {filter.type === 'text' ? (
                  <input
                    type="text"
                    className={styles.filter__control}
                    value={search[filter.key]}
                    placeholder={filter.placeholder}
                    onChange={(event) => handleFilterChange(filter.key, event.target.value)}
                  />
                ) : (
                  <select
                    className={styles.filter__control}
                    value={search[filter.key]}
                    onChange={(event) => handleFilterChange(filter.key, event.target.value)}
                  >
                    {filter.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </section>

          <section className={styles.content__tableArea}>
            <div className={styles.table__toolbar}>
              <div className={styles.toolbar__left}>
                <span className={styles.toolbar__label}>총 {filteredEmployees.length}건</span>
              </div>
              <button type="button" className={styles.toolbar__action}>
                새로운 업무 등록
              </button>
            </div>

            <table className={styles.table}>
              <thead className={styles.table__head}>
                <tr className={styles.table__row}>
                  {tableColumns.map((column) => (
                    <th key={column.key} className={styles.table__cell}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.empNo} className={styles.table__row}>
                    {tableColumns.map((column) => {
                      if (column.key === 'actions') {
                        return (
                          <td
                            key={`${employee.empNo}-${column.key}`}
                            className={styles.table__cell}
                          >
                            <button type="button" className={styles.actionButton}>
                              상세
                            </button>
                          </td>
                        );
                      }

                      const value = employee[column.key as keyof Employee];
                      return (
                        <td key={`${employee.empNo}-${column.key}`} className={styles.table__cell}>
                          {column.key === 'status' ? (
                            <span
                              className={`${styles.statusBadge} ${statusColor[value as '진행' | '완료' | '대기']}`}
                            >
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      <footer className={styles.mdiTabBar}>
        {defaultTabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.mdiTabBar__tab} ${activeTabId === tab.id ? styles['mdiTabBar__tab--active'] : ''}`}
          >
            <button
              type="button"
              className={styles.mdiTabBar__title}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.title}
            </button>
            <button
              type="button"
              className={styles.mdiTabBar__close}
              aria-label={`${tab.title} 닫기`}
              onClick={() => handleTabClose(tab.id)}
            >
              ×
            </button>
          </div>
        ))}
      </footer>
    </div>
  );
}
