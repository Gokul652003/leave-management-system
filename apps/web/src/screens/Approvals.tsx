import { useState } from 'react'
import {
  useApproveLeaveRequest,
  useLeaveRequests,
  useRejectLeaveRequest,
} from '../api/hooks/useLeaveRequests'
import { getErrorMessage } from '../api/errorMessage'
import type { LeaveRequestStatus } from '../api/types'

type Tab = 'pending' | 'approved' | 'rejected'

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' }
  const startStr = new Date(`${start}T00:00:00Z`).toLocaleDateString('en-US', opts)
  if (start === end) return startStr
  const endStr = new Date(`${end}T00:00:00Z`).toLocaleDateString('en-US', opts)
  return `${startStr} — ${endStr}`
}

function Approvals({
  onApply,
  onViewDetail,
}: {
  onApply: () => void
  onViewDetail: (requestId: string) => void
}) {
  const [tab, setTab] = useState<Tab>('pending')
  const status: LeaveRequestStatus = tab
  const { data: requests, isLoading, isError, error } = useLeaveRequests(status)
  const approve = useApproveLeaveRequest()
  const reject = useRejectLeaveRequest()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [comments, setComments] = useState('')

  const submitReject = (id: string) => {
    if (!comments.trim()) return
    reject.mutate(
      { id, comments },
      {
        onSuccess: () => {
          setRejectingId(null)
          setComments('')
        },
      },
    )
  }

  const pendingCount = (requests ?? []).length

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
        </div>
      </header>
      <main className="main approvals-main">
        <div className="main-content">
          <section className="approvals-header">
            <div className="page-heading">
              <h2 className="page-heading-title">Approval Queue</h2>
              <p className="page-heading-subtitle">
                Review and manage leave requests across the organization.
              </p>
            </div>
            <div className="segmented">
              {(['pending', 'approved', 'rejected'] as const).map((t) => (
                <button
                  key={t}
                  className={`segmented-btn ${tab === t ? 'segmented-active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {isLoading && <p className="detail-label">Loading requests...</p>}
          {isError && (
            <p className="detail-error">
              {getErrorMessage(error)}
            </p>
          )}

          <section className="approvals-table-card">
            <div className="approvals-table-wrap">
              <table className="approvals-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th className="th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(requests ?? []).map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="employee-cell">
                          <div className="emp-avatar avatar-primary">
                            {initialsOf(row.employeeName)}
                          </div>
                          <div>
                            <p className="employee-name">{row.employeeName}</p>
                            <p className="employee-role">{row.employeeCode}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="type-badge type-sky">
                          <span className="type-dot" />
                          {row.leaveTypeName}
                        </span>
                      </td>
                      <td className="td-mono">{formatDateRange(row.startDate, row.endDate)}</td>
                      <td>
                        <span className="duration-text">
                          {row.totalDays} {row.totalDays === 1 ? 'Day' : 'Days'}
                        </span>
                      </td>
                      <td>
                        <p className="reason-text">{row.reason ?? '—'}</p>
                      </td>
                      <td className="td-right">
                        <div className="row-actions">
                          {tab === 'pending' ? (
                            rejectingId === row.id ? (
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <input
                                  className="form-input"
                                  style={{ width: 160, padding: '4px 8px' }}
                                  placeholder="Reason for rejection"
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  autoFocus
                                />
                                <button
                                  className="btn-reject"
                                  disabled={reject.isPending}
                                  onClick={() => submitReject(row.id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="btn-cancel"
                                  onClick={() => {
                                    setRejectingId(null)
                                    setComments('')
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  className="btn-approve"
                                  disabled={approve.isPending}
                                  onClick={() => approve.mutate(row.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() => setRejectingId(row.id)}
                                >
                                  Reject
                                </button>
                                <a
                                  href="#"
                                  className="row-open"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    onViewDetail(row.id)
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    open_in_new
                                  </span>
                                </a>
                              </>
                            )
                          ) : (
                            <span
                              className={`badge badge-${row.status === 'approved' ? 'approved' : 'rejected'}`}
                            >
                              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <p className="table-footer-text">
                Showing {pendingCount} {tab} requests
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Approvals
