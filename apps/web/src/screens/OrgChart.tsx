import { useEmployees } from '../api/hooks/useEmployees'
import { getErrorMessage } from '../api/errorMessage'
import type { EmployeeProfile } from '../api/types'

const AVATAR_CLASSES = ['avatar-primary', 'avatar-secondary', 'avatar-tertiary', 'avatar-slate', 'avatar-teal']

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function groupByDepartment(employees: EmployeeProfile[]) {
  const groups = new Map<string, EmployeeProfile[]>()
  for (const emp of employees) {
    const list = groups.get(emp.department) ?? []
    list.push(emp)
    groups.set(emp.department, list)
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
}

function OrgChart({ onBack }: { onBack: () => void }) {
  const { data: employees, isLoading, isError, error } = useEmployees()
  const groups = groupByDepartment(employees ?? [])

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button" aria-label="Back" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="topbar-title">Org Chart</h2>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <div className="page-heading">
            <h2 className="page-heading-title">Organization Structure</h2>
            <p className="page-heading-subtitle">
              Employees grouped by department. Each card shows their role and
              current status.
            </p>
          </div>

          {isLoading && <p className="detail-label">Loading org chart...</p>}
          {isError && (
            <p className="detail-error">
              {getErrorMessage(error)}
            </p>
          )}

          {groups.map(([department, members]) => (
            <section key={department} className="detail-main-card org-dept-card">
              <div className="form-card-header">
                <h3>
                  {department}{' '}
                  <span className="detail-label-upper org-dept-count">
                    {members.length} {members.length === 1 ? 'Employee' : 'Employees'}
                  </span>
                </h3>
              </div>
              <div className="org-dept-grid">
                {members.map((emp, i) => (
                  <div key={emp.employeeId} className="org-card">
                    <div className={`emp-avatar ${AVATAR_CLASSES[i % AVATAR_CLASSES.length]}`}>
                      {initialsOf(emp.name)}
                    </div>
                    <div>
                      <p className="emp-name">{emp.name}</p>
                      <p className="detail-person-role">{emp.role}</p>
                      <span
                        className={`status-pill status-${emp.status.toLowerCase().replace(' ', '-')}`}
                      >
                        <span className="status-dot" />
                        {emp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}

export default OrgChart
