import { useState } from 'react'

type Status = 'Active' | 'On Leave' | 'Inactive'

type Employee = {
  id: string
  initials: string
  avatarClass: string
  name: string
  email: string
  department: string
  role: string
  status: Status
  lastActive: string
}

const employees: Employee[] = [
  {
    id: 'em',
    initials: 'EM',
    avatarClass: 'avatar-primary',
    name: 'Elena Martinez',
    email: 'elena.m@acme.corp',
    department: 'Engineering',
    role: 'Senior Developer',
    status: 'Active',
    lastActive: '2023-10-24',
  },
  {
    id: 'js',
    initials: 'JS',
    avatarClass: 'avatar-secondary',
    name: 'Jordan Smith',
    email: 'j.smith@acme.corp',
    department: 'Marketing',
    role: 'Brand Strategist',
    status: 'On Leave',
    lastActive: '2023-10-20',
  },
  {
    id: 'tc',
    initials: 'TC',
    avatarClass: 'avatar-tertiary',
    name: 'Tariq Chen',
    email: 't.chen@acme.corp',
    department: 'Product',
    role: 'Product Manager',
    status: 'Active',
    lastActive: '2023-10-24',
  },
  {
    id: 'lw',
    initials: 'LW',
    avatarClass: 'avatar-slate',
    name: 'Linda White',
    email: 'l.white@acme.corp',
    department: 'Operations',
    role: 'Logistics Lead',
    status: 'Inactive',
    lastActive: '2023-09-12',
  },
  {
    id: 'ak',
    initials: 'AK',
    avatarClass: 'avatar-teal',
    name: 'Arjun Kapoor',
    email: 'a.kapoor@acme.corp',
    department: 'Engineering',
    role: 'Frontend Engineer',
    status: 'Active',
    lastActive: '2023-10-23',
  },
]

const stats = [
  { icon: 'group', iconClass: 'stat-primary', label: 'Total Employees', value: '1,284' },
  { icon: 'check_circle', iconClass: 'stat-emerald', label: 'Active Now', value: '1,156' },
  { icon: 'beach_access', iconClass: 'stat-amber', label: 'On Leave', value: '42' },
  { icon: 'person_off', iconClass: 'stat-slate', label: 'Inactive', value: '86' },
]

function Employees() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Status | 'All'>('All')
  const [rows, setRows] = useState(employees)

  const filtered = rows.filter((emp) => {
    const matchesQuery = emp.name.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || emp.status === filter
    return matchesQuery && matchesFilter
  })

  const toggleStatus = (id: string) => {
    setRows((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status:
                emp.status === 'Inactive'
                  ? ('Active' as const)
                  : ('Inactive' as const),
            }
          : emp,
      ),
    )
  }

  return (
    <>
      <header className="topbar employees-topbar">
        <h2 className="topbar-title">Employees</h2>
        <div className="topbar-actions employees-actions">
          <div className="global-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Global search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="icon-button notif-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notif-dot" />
          </button>
          <button className="btn-primary btn-add">
            <span className="material-symbols-outlined">person_add</span>
            <span>Add Employee</span>
          </button>
        </div>
      </header>
      <main className="main employees-main">
        <div className="main-content">
          <section className="stats-bento">
            {stats.map((s) => (
              <div key={s.label} className="stat-bento-card">
                <div className={`stat-bento-icon ${s.iconClass}`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div>
                  <p className="stat-bento-label">{s.label}</p>
                  <p className="stat-bento-value">{s.value}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="filter-bar">
            <div className="filter-left">
              <button className="filter-chip">
                <span className="material-symbols-outlined">filter_list</span>
                <span>All Departments</span>
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
              </button>
              <button
                className="filter-chip"
                onClick={() =>
                  setFilter((f) =>
                    f === 'All' ? 'Active' : f === 'Active' ? 'All' : f,
                  )
                }
              >
                <span>{filter === 'All' ? 'Active Status' : filter}</span>
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
              </button>
              <button
                className="filter-clear"
                onClick={() => {
                  setFilter('All')
                  setQuery('')
                }}
              >
                Clear Filters
              </button>
            </div>
            <div className="filter-right">
              <button className="icon-btn-border" aria-label="Export">
                <span className="material-symbols-outlined">file_download</span>
              </button>
              <button className="icon-btn-border" aria-label="Print">
                <span className="material-symbols-outlined">print</span>
              </button>
            </div>
          </section>

          <section className="employees-table-card">
            <div className="employees-table-wrap">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th className="th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp.id} className="employee-row">
                      <td>
                        <div className="emp-cell">
                          <div className={`emp-avatar ${emp.avatarClass}`}>
                            {emp.initials}
                          </div>
                          <div>
                            <p className="emp-name">{emp.name}</p>
                            <p className="emp-email">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-muted">{emp.department}</td>
                      <td className="td-muted">{emp.role}</td>
                      <td>
                        <span className={`status-pill status-${emp.status.toLowerCase().replace(' ', '-')}`}>
                          <span className="status-dot" />
                          {emp.status}
                        </span>
                      </td>
                      <td className="td-mono-cell">{emp.lastActive}</td>
                      <td className="td-right">
                        <div className="row-hover-actions">
                          <button className="row-btn edit-btn" title="Edit Profile">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            className={`row-btn ${emp.status === 'Inactive' ? 'edit-btn' : 'danger-btn'}`}
                            title={
                              emp.status === 'Inactive'
                                ? 'Reactivate'
                                : 'Deactivate'
                            }
                            onClick={() => toggleStatus(emp.id)}
                          >
                            <span className="material-symbols-outlined">
                              {emp.status === 'Inactive'
                                ? 'person_check'
                                : 'person_off'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-footer">
              <p className="table-footer-text">
                Showing {filtered.length} of 1,284 employees
              </p>
              <div className="page-controls">
                <button className="page-btn" disabled aria-label="Previous page">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="page-btn page-active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-ellipsis">...</span>
                <button className="page-btn">257</button>
                <button className="page-btn" aria-label="Next page">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          <section className="promo-card">
            <div className="promo-content">
              <h3>Enhance your team building</h3>
              <p>
                Use our new automated organizational chart tools to visualize
                reporting lines and discover cross-functional collaboration
                opportunities.
              </p>
              <button className="promo-btn">Explore Org Chart</button>
            </div>
            <span className="material-symbols-outlined promo-icon">
              account_tree
            </span>
            <div className="promo-glow glow-a" />
            <div className="promo-glow glow-b" />
          </section>
        </div>
      </main>
    </>
  )
}

export default Employees
