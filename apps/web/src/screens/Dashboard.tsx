import { AxiosError } from 'axios'
import avatar from '../assets/avatar.jpg'
import { useMyLeaveRequests, useLeaveBalances } from '../api/hooks/useLeaveRequests'
import { getErrorMessage } from '../api/errorMessage'

const ICON_BY_CODE: Record<string, string> = {
  sick: 'medical_services',
  annual: 'beach_access',
  unpaid: 'flight_takeoff',
  bereavement: 'flight_takeoff',
  maternity: 'child_care',
}

const COLOR_CLASSES = ['rose', 'amber', 'teal', 'sky', 'emerald']

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' }
  const startStr = new Date(`${start}T00:00:00Z`).toLocaleDateString('en-US', opts)
  if (start === end) return startStr
  const endStr = new Date(`${end}T00:00:00Z`).toLocaleDateString('en-US', opts)
  return `${startStr} - ${endStr}`
}

function Dashboard({ onApply }: { onApply: () => void }) {
  const balancesQuery = useLeaveBalances()
  const requestsQuery = useMyLeaveRequests()
  const { data: balances } = balancesQuery
  const { data: requests } = requestsQuery

  const pendingCount = (requests ?? []).filter((r) => r.status === 'pending').length
  const upcomingApproved = (requests ?? [])
    .filter((r) => r.status === 'approved')
    .slice(0, 5)

  const noEmployeeRecord =
    balancesQuery.error instanceof AxiosError &&
    balancesQuery.error.response?.status === 404

  if (noEmployeeRecord) {
    return (
      <>
        <header className="topbar">
          <h2 className="topbar-title">Acme Corp</h2>
        </header>
        <main className="main">
          <div className="main-content">
            <section className="greeting">
              <div>
                <h2 className="greeting-title">Welcome back</h2>
                <p className="greeting-subtitle">
                  This account isn't linked to an employee record, so personal
                  leave balances and requests aren't available. Admin/HR/manager
                  accounts can still manage employees, policies, and approvals
                  from the sidebar.
                </p>
              </div>
            </section>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <header className="topbar">
        <h2 className="topbar-title">Acme Corp</h2>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="btn-primary" onClick={onApply}>
            Apply for Leave
          </button>
          <div className="avatar-sm">
            <img src={avatar} alt="Profile" />
          </div>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <section className="greeting">
            <div>
              <h2 className="greeting-title">Welcome back</h2>
              <p className="greeting-subtitle">
                You have {pendingCount} pending leave{' '}
                {pendingCount === 1 ? 'request' : 'requests'}.
              </p>
            </div>
          </section>

          {(balancesQuery.isError || requestsQuery.isError) && (
            <p className="detail-error">
              {getErrorMessage(balancesQuery.error ?? requestsQuery.error)}
            </p>
          )}

          <section className="balances">
            {(balances ?? []).map((card, i) => {
              const colorClass = COLOR_CLASSES[i % COLOR_CLASSES.length]
              const pct = card.quota
                ? Math.round(((card.remaining ?? 0) / card.quota) * 100)
                : 0
              return (
                <div key={card.leaveTypeCode} className="glass-card leave-card">
                  <div className="leave-card-icon">
                    <span className={`material-symbols-outlined icon-${colorClass}`}>
                      {ICON_BY_CODE[card.leaveTypeCode] ?? 'event_note'}
                    </span>
                  </div>
                  <span className="leave-card-label">
                    {card.leaveTypeName.toUpperCase()}
                  </span>
                  <div className="leave-card-value">
                    <span>{card.remaining ?? '—'}</span>
                    <span className="leave-card-total">
                      / {card.quota ?? '∞'} days
                    </span>
                  </div>
                  {card.quota != null && (
                    <div className="progress-track">
                      <div
                        className={`progress-bar bar-${colorClass}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                  <div className="leave-card-footer">
                    <span className={`text-${colorClass}`}>{card.used} used</span>
                    {card.remaining != null && (
                      <span className="text-secondary">{card.remaining} remaining</span>
                    )}
                  </div>
                </div>
              )
            })}
          </section>

          <section className="table-card">
            <div className="table-header">
              <h3>Upcoming Approved Leaves</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingApproved.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="leave-type">
                          <div className="leave-type-icon icon-teal">
                            <span className="material-symbols-outlined">
                              {ICON_BY_CODE[row.leaveTypeCode] ?? 'event_note'}
                            </span>
                          </div>
                          <span>{row.leaveTypeName}</span>
                        </div>
                      </td>
                      <td className="td-dates">{formatDateRange(row.startDate, row.endDate)}</td>
                      <td className="td-muted">
                        {row.totalDays} {row.totalDays === 1 ? 'Day' : 'Days'}
                      </td>
                      <td>
                        <span className="badge badge-approved">Approved</span>
                      </td>
                    </tr>
                  ))}
                  {upcomingApproved.length === 0 && (
                    <tr>
                      <td colSpan={4} className="td-muted">
                        No approved upcoming leave.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Dashboard
