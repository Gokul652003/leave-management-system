import { useState } from 'react'
import { AxiosError } from 'axios'
import { useMyLeaveRequests, useLeaveBalances } from '../api/hooks/useLeaveRequests'
import { getErrorMessage } from '../api/errorMessage'
import type { LeaveRequestStatus } from '../api/types'

const chips = ['All Requests', 'Pending', 'Approved', 'Rejected'] as const
type Chip = (typeof chips)[number]

const chipToStatus: Record<Chip, LeaveRequestStatus | null> = {
  'All Requests': null,
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
}

const statusClass: Record<LeaveRequestStatus, string> = {
  pending: 'req-pending',
  approved: 'req-approved',
  rejected: 'req-rejected',
}

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' }
  const startStr = new Date(`${start}T00:00:00Z`).toLocaleDateString('en-US', opts)
  if (start === end) return startStr
  const endStr = new Date(`${end}T00:00:00Z`).toLocaleDateString('en-US', opts)
  return `${startStr} – ${endStr}`
}

function MyRequests() {
  const { data: requests, isLoading, isError, error } = useMyLeaveRequests()
  const { data: balances } = useLeaveBalances()
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState<Chip>('All Requests')

  const filtered = (requests ?? []).filter((req) => {
    const matchesQuery = `${req.leaveTypeName} ${req.startDate} ${req.endDate}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const wantedStatus = chipToStatus[chip]
    const matchesChip = !wantedStatus || req.status === wantedStatus
    return matchesQuery && matchesChip
  })

  const pendingCount = (requests ?? []).filter((r) => r.status === 'pending').length
  const annualBalance = balances?.find((b) => b.leaveTypeCode === 'annual')

  const noEmployeeRecord = error instanceof AxiosError && error.response?.status === 404
  const sickBalance = balances?.find((b) => b.leaveTypeCode === 'sick')

  return (
    <>
      <header className="topbar mr-topbar">
        <div className="global-search mr-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search requests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="topbar-actions mr-topbar-actions">
          <button className="icon-button notif-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notif-dot" />
          </button>
        </div>
      </header>
      <main className="main mr-main">
        <div className="main-content">
          <section className="mr-page-header">
            <div>
              <h2 className="page-heading-title mr-heading">Leave History</h2>
              <p className="page-heading-subtitle">
                Manage and track your historical time-off applications.
              </p>
            </div>
            <div className="mr-chip-group">
              {chips.map((c) => (
                <button
                  key={c}
                  className={`mr-chip ${chip === c ? 'mr-chip-active' : ''}`}
                  onClick={() => setChip(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <section className="mr-stats">
            <div className="mr-stat-card">
              <div className="mr-stat-top">
                <div className="mr-stat-icon mr-stat-primary">
                  <span className="material-symbols-outlined">event_available</span>
                </div>
              </div>
              <p className="mr-stat-label">Annual Leave</p>
              <p className="mr-stat-value">
                {annualBalance?.remaining ?? '—'}{' '}
                <span className="mr-stat-suffix">days left</span>
              </p>
            </div>
            <div className="mr-stat-card">
              <div className="mr-stat-top">
                <div className="mr-stat-icon mr-stat-orange">
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
              </div>
              <p className="mr-stat-label">Sick Leave Used</p>
              <p className="mr-stat-value">
                {sickBalance?.used ?? 0} <span className="mr-stat-suffix">days used</span>
              </p>
            </div>
            <div className="mr-stat-card">
              <div className="mr-stat-top">
                <div className="mr-stat-icon mr-stat-secondary">
                  <span className="material-symbols-outlined">pending_actions</span>
                </div>
              </div>
              <p className="mr-stat-label">Pending Approvals</p>
              <p className="mr-stat-value">
                {pendingCount} <span className="mr-stat-suffix">requests</span>
              </p>
            </div>
          </section>

          {isLoading && <p className="detail-label">Loading requests...</p>}
          {noEmployeeRecord && (
            <p className="detail-label">
              This account isn't linked to an employee record, so it has no
              personal leave history.
            </p>
          )}
          {isError && !noEmployeeRecord && (
            <p className="detail-error">{getErrorMessage(error)}</p>
          )}

          <section className="mr-table-card">
            <div className="mr-table-header">
              <div>
                <h4 className="mr-table-title">Request Log</h4>
                <p className="mr-table-subtitle">
                  A detailed history of your time-off records.
                </p>
              </div>
            </div>
            <div className="mr-table-wrap">
              <table className="mr-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th className="th-center">Duration</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <tr key={req.id} className="mr-row">
                      <td>
                        <div className="mr-type-cell">
                          <span className="mr-type-name">{req.leaveTypeName}</span>
                        </div>
                      </td>
                      <td className="mr-dates">
                        {formatDateRange(req.startDate, req.endDate)}
                      </td>
                      <td className="th-center mr-duration">
                        {req.totalDays} {req.totalDays === 1 ? 'Day' : 'Days'}
                      </td>
                      <td>
                        <span className={`mr-status ${statusClass[req.status]}`}>
                          <span className="mr-status-dot" />
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </td>
                      <td className="td-muted">{req.reason ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-footer">
              <p className="table-footer-text">Showing {filtered.length} requests</p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default MyRequests
