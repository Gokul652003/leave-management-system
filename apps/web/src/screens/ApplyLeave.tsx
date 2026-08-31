import { useState } from 'react'
import { AxiosError } from 'axios'
import sarah from '../assets/sarah.jpg'
import office from '../assets/office.jpg'
import { useLeavePolicies } from '../api/hooks/useLeavePolicies'
import { useCreateLeaveRequest, useLeaveBalances } from '../api/hooks/useLeaveRequests'
import { getErrorMessage } from '../api/errorMessage'

function ApplyLeave({ onDone }: { onDone: () => void }) {
  const { data: leaveTypes } = useLeavePolicies()
  const balancesQuery = useLeaveBalances()
  const { data: balances } = balancesQuery
  const createRequest = useCreateLeaveRequest()

  const noEmployeeRecord =
    balancesQuery.error instanceof AxiosError &&
    balancesQuery.error.response?.status === 404

  const [leaveTypeCode, setLeaveTypeCode] = useState('')
  const [halfDay, setHalfDay] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createRequest.mutate(
      {
        leaveTypeCode,
        startDate,
        endDate: halfDay ? startDate : endDate,
        halfDay,
        reason: reason || null,
      },
      {
        onSuccess: () => {
          setTimeout(onDone, 1500)
        },
      },
    )
  }

  const submitState = createRequest.isPending
    ? 'processing'
    : createRequest.isSuccess
      ? 'sent'
      : 'idle'

  return (
    <>
      <header className="topbar">
        <nav className="breadcrumb">
          <a href="#" onClick={(e) => { e.preventDefault(); onDone() }}>
            Dashboard
          </a>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Apply Leave</span>
        </nav>
        <div className="topbar-actions topbar-actions-wide">
          <button className="icon-button notif-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notif-dot" />
          </button>
          <div className="topbar-divider" />
          <div className="topbar-user">
            <div className="topbar-user-text">
              <p className="user-name">Sarah Jenkins</p>
              <p className="user-role">Senior Product Designer</p>
            </div>
            <div className="avatar-ring">
              <img src={sarah} alt="Sarah Jenkins" />
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <div className="page-heading">
            <h2 className="page-heading-title">Apply for Leave</h2>
            <p className="page-heading-subtitle">
              Submit your request for time off. Your manager will be notified
              automatically.
            </p>
          </div>

          <div className="apply-grid">
            <section className="form-card">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="leave-type">
                      Leave Type
                    </label>
                    <div className="select-wrap">
                      <select
                        id="leave-type"
                        className="form-select"
                        required
                        value={leaveTypeCode}
                        onChange={(e) => setLeaveTypeCode(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a type...
                        </option>
                        {(leaveTypes ?? []).map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined select-chevron">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="half-day">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={halfDay}
                        onChange={(e) => setHalfDay(e.target.checked)}
                      />
                      <span className="switch-track" />
                      <span className="switch-label">
                        This is a half-day request
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="start-date">
                      Start Date
                    </label>
                    <input
                      id="start-date"
                      className="form-input"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="end-date">
                      End Date
                    </label>
                    <input
                      id="end-date"
                      className="form-input"
                      type="date"
                      required={!halfDay}
                      disabled={halfDay}
                      value={halfDay ? startDate : endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="reason">
                    Reason for Leave
                  </label>
                  <textarea
                    id="reason"
                    className="form-textarea"
                    placeholder="Briefly explain the reason for your request..."
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                {noEmployeeRecord && (
                  <p className="login-error">
                    This account isn't linked to an employee record, so it
                    can't submit a personal leave request.
                  </p>
                )}
                {createRequest.isError && (
                  <p className="login-error">{getErrorMessage(createRequest.error)}</p>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={onDone}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn-submit ${submitState === 'sent' ? 'btn-sent' : ''}`}
                    disabled={submitState !== 'idle' || noEmployeeRecord}
                  >
                    {submitState === 'processing' && (
                      <span className="material-symbols-outlined spin">
                        sync
                      </span>
                    )}
                    {submitState === 'sent' && (
                      <span className="material-symbols-outlined">check</span>
                    )}
                    {submitState === 'idle' && 'Submit Request'}
                    {submitState === 'processing' && 'Processing...'}
                    {submitState === 'sent' && 'Request Sent!'}
                  </button>
                </div>
              </form>
            </section>

            <aside className="apply-side">
              <section className="balances-card">
                <div className="balances-card-header">
                  <h3>Leave Balances</h3>
                </div>
                <div className="balances-card-body">
                  {(balances ?? []).map((b) => (
                    <div key={b.leaveTypeCode}>
                      <div className="balance-row">
                        <span className="balance-label">{b.leaveTypeName}</span>
                        <span className="balance-value">
                          {b.remaining != null ? `${b.remaining} Days` : `${b.used} used`}
                        </span>
                      </div>
                      {b.quota != null && (
                        <div className="mini-track">
                          <div
                            className="mini-bar bar-primary"
                            style={{ width: `${Math.max(0, Math.min(100, ((b.remaining ?? 0) / b.quota) * 100))}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="info-note">
                    <span className="material-symbols-outlined">info</span>
                    <p>
                      Your requested leave will be deducted from the selected
                      leave type's balance once approved.
                    </p>
                  </div>
                </div>
              </section>

              <div className="policy-box">
                <h4>Company Policy</h4>
                <ul className="policy-list">
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    Apply at least 48 hours in advance for short leave.
                  </li>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    2 weeks notice required for more than 5 days.
                  </li>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    Documentation required for sick leave &gt; 3 days.
                  </li>
                </ul>
              </div>

              <div className="atmos-card">
                <img src={office} alt="Office lounge" />
                <div className="atmos-overlay">
                  <p>Recharge. Refresh. Return.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <footer className="app-footer">
          <p>
            © 2024 Acme Corp Enterprise Edition ·{' '}
            <a href="#">Privacy Policy</a> · <a href="#">Help Center</a>
          </p>
        </footer>
      </main>
    </>
  )
}

export default ApplyLeave
