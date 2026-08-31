import { useState } from 'react'
import { useCreateEmployee } from '../api/hooks/useCreateEmployee'
import { useEmployees } from '../api/hooks/useEmployees'
import { getErrorMessage } from '../api/errorMessage'

type Status = 'Active' | 'On Leave' | 'Inactive'

const AVATAR_CLASSES = ['avatar-primary', 'avatar-secondary', 'avatar-tertiary', 'avatar-slate', 'avatar-teal']

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Employees({
  onViewProfile,
  onOpenOrgChart,
}: {
  onViewProfile: (employeeId: string) => void
  onOpenOrgChart: () => void
}) {
  const { data: employees, isLoading, isError, error } = useEmployees()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Status | 'All'>('All')
  const [lookupId, setLookupId] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const createEmployee = useCreateEmployee()
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    joinDate: '',
  })

  const filtered = (employees ?? []).filter((emp) => {
    const matchesQuery = emp.name.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || emp.status === filter
    return matchesQuery && matchesFilter
  })

  const total = employees?.length ?? 0
  const activeCount = (employees ?? []).filter((e) => e.status === 'Active').length
  const onLeaveCount = (employees ?? []).filter((e) => e.status === 'On Leave').length
  const inactiveCount = (employees ?? []).filter((e) => e.status === 'Inactive').length

  const stats = [
    { icon: 'group', iconClass: 'stat-primary', label: 'Total Employees', value: total },
    { icon: 'check_circle', iconClass: 'stat-emerald', label: 'Active Now', value: activeCount },
    { icon: 'beach_access', iconClass: 'stat-amber', label: 'On Leave', value: onLeaveCount },
    { icon: 'person_off', iconClass: 'stat-slate', label: 'Inactive', value: inactiveCount },
  ]

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
          <button className="btn-primary btn-add" onClick={() => setShowAddForm((v) => !v)}>
            <span className="material-symbols-outlined">person_add</span>
            <span>Add Employee</span>
          </button>
        </div>
      </header>
      <main className="main employees-main">
        <div className="main-content">
          <section className="filter-bar">
            <div className="filter-left">
              <div className="global-search">
                <span className="material-symbols-outlined">badge</span>
                <input
                  type="text"
                  placeholder="Look up profile by Employee ID (e.g. EMP-3311-AC)"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                />
              </div>
              <button
                className="filter-chip"
                onClick={() => lookupId.trim() && onViewProfile(lookupId.trim())}
              >
                View Profile
              </button>
            </div>
          </section>

          {showAddForm && (
            <section className="form-card">
              <div className="form-card-header">
                <h3>Add New Employee</h3>
                <button
                  className="icon-button"
                  aria-label="Close"
                  onClick={() => setShowAddForm(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createEmployee.mutate(
                    {
                      name: form.name,
                      email: form.email,
                      department: form.department,
                      role: form.role,
                      joinDate: form.joinDate || undefined,
                    },
                    {
                      onSuccess: () => {
                        setForm({ name: '', email: '', department: '', role: '', joinDate: '' })
                        setShowAddForm(false)
                      },
                    },
                  )
                }}
              >
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="emp-name">
                      Full Name
                    </label>
                    <input
                      id="emp-name"
                      className="form-input"
                      placeholder="e.g. Ravi Kumar"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="emp-email">
                      Email
                    </label>
                    <input
                      id="emp-email"
                      className="form-input"
                      type="email"
                      placeholder="e.g. r.kumar@acme.corp"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="emp-department">
                      Department
                    </label>
                    <input
                      id="emp-department"
                      className="form-input"
                      placeholder="e.g. Engineering"
                      required
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="emp-role">
                      Role
                    </label>
                    <input
                      id="emp-role"
                      className="form-input"
                      placeholder="e.g. Backend Engineer"
                      required
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-field form-field-spaced">
                  <label className="form-label" htmlFor="emp-join-date">
                    Join Date
                  </label>
                  <input
                    id="emp-join-date"
                    className="form-input"
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                  />
                </div>

                {createEmployee.isError && (
                  <p className="login-error">
                    {getErrorMessage(createEmployee.error)}
                  </p>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={createEmployee.isPending}
                  >
                    {createEmployee.isPending ? 'Creating...' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </section>
          )}

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
          </section>

          {isLoading && <p className="detail-label">Loading employees...</p>}
          {isError && (
            <p className="detail-error">
              {getErrorMessage(error)}
            </p>
          )}

          <section className="employees-table-card">
            <div className="employees-table-wrap">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Employee ID</th>
                    <th className="th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, i) => (
                    <tr key={emp.employeeId} className="employee-row">
                      <td>
                        <div className="emp-cell">
                          <div className={`emp-avatar ${AVATAR_CLASSES[i % AVATAR_CLASSES.length]}`}>
                            {initialsOf(emp.name)}
                          </div>
                          <div>
                            <p
                              className="emp-name"
                              style={{ cursor: 'pointer' }}
                              onClick={() => onViewProfile(emp.employeeId)}
                            >
                              {emp.name}
                            </p>
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
                      <td className="td-mono-cell">{emp.employeeId}</td>
                      <td className="td-right">
                        <div className="row-hover-actions">
                          <button
                            className="row-btn edit-btn"
                            title="View Profile"
                            onClick={() => onViewProfile(emp.employeeId)}
                          >
                            <span className="material-symbols-outlined">visibility</span>
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
                Showing {filtered.length} of {total} employees
              </p>
            </div>
          </section>

          <section className="promo-card">
            <div className="promo-content">
              <h3>Enhance your team building</h3>
              <p>
                Visualize reporting lines and discover cross-functional
                collaboration opportunities.
              </p>
              <button className="promo-btn" onClick={onOpenOrgChart}>
                Explore Org Chart
              </button>
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
