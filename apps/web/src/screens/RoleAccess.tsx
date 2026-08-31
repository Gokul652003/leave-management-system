import { useState } from 'react'
import {
  useEmployeesWithAccessRoles,
  useUpdateAccessRole,
} from '../api/hooks/useAccessRoles'
import { getErrorMessage } from '../api/errorMessage'
import type { AccessRole } from '../api/types'

const ROLE_OPTIONS: AccessRole[] = ['admin', 'hr', 'manager', 'employee']

function RoleAccess({ onApply }: { onApply: () => void }) {
  const { data: employees, isLoading, isError, error } = useEmployeesWithAccessRoles()
  const updateRole = useUpdateAccessRole()
  const [toast, setToast] = useState('')

  const handleChange = (employeeId: string, role: AccessRole) => {
    updateRole.mutate(
      { employeeId, role },
      {
        onSuccess: () => {
          setToast(`Role updated to ${role}`)
          setTimeout(() => setToast(''), 2500)
        },
      },
    )
  }

  const distribution = ROLE_OPTIONS.map((role) => ({
    role,
    count: (employees ?? []).filter((e) => e.accessRole === role).length,
  }))
  const total = employees?.length ?? 0

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h2 className="topbar-title">Acme Corp</h2>
          <div className="topbar-divider-v" />
          <span className="topbar-subtitle">Roles & Access Control</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="btn-primary" onClick={onApply}>
            <span className="material-symbols-outlined">add</span>
            <span>Apply for Leave</span>
          </button>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <section className="ra-hero">
            <h3 className="page-heading-title">Access Role Management</h3>
            <p className="ra-hero-subtitle">
              Assign each employee an access role. Roles determine what data
              they can view and what actions they can perform across the HR
              portal.
            </p>
          </section>

          <section className="stats-bento">
            {distribution.map((d) => (
              <div key={d.role} className="stat-bento-card">
                <div className="stat-bento-icon stat-primary">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <p className="stat-bento-label">{d.role}</p>
                  <p className="stat-bento-value">{d.count}</p>
                </div>
              </div>
            ))}
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
                    <th>Employee ID</th>
                    <th>Access Role</th>
                  </tr>
                </thead>
                <tbody>
                  {(employees ?? []).map((emp) => (
                    <tr key={emp.employeeId} className="employee-row">
                      <td>
                        <div className="emp-cell">
                          <div>
                            <p className="emp-name">{emp.name}</p>
                            <p className="emp-email">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-muted">{emp.department}</td>
                      <td className="td-mono-cell">{emp.employeeId}</td>
                      <td>
                        <select
                          className="form-select"
                          style={{ width: 'auto', padding: '6px 12px' }}
                          value={emp.accessRole ?? ''}
                          disabled={!emp.accessRole || updateRole.isPending}
                          onChange={(e) =>
                            handleChange(emp.employeeId, e.target.value as AccessRole)
                          }
                        >
                          {!emp.accessRole && <option value="">No auth account</option>}
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-footer">
              <p className="table-footer-text">Showing {total} employees</p>
            </div>
          </section>
        </div>
      </main>

      {toast && (
        <div className="action-toast">
          <span className="material-symbols-outlined">check_circle</span>
          <p>{toast}</p>
        </div>
      )}
    </>
  )
}

export default RoleAccess
