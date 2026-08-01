import { useState } from 'react'
import sarah from '../assets/sarah.jpg'
import office from '../assets/office.jpg'

type SubmitState = 'idle' | 'processing' | 'sent'

function ApplyLeave({ onDone }: { onDone: () => void }) {
  const [startDate, setStartDate] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState('processing')
    setTimeout(() => {
      setSubmitState('sent')
      setTimeout(() => {
        setSubmitState('idle')
        onDone()
      }, 3000)
    }, 1500)
  }

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
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a type...
                        </option>
                        <option value="annual">
                          Annual Leave (Vacation)
                        </option>
                        <option value="sick">Sick Leave</option>
                        <option value="unpaid">Unpaid Leave</option>
                        <option value="bereavement">Bereavement</option>
                        <option value="maternity">Maternity/Paternity</option>
                      </select>
                      <span className="material-symbols-outlined select-chevron">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="half-day">
                    <label className="switch">
                      <input type="checkbox" />
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
                      min={startDate}
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
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">
                    Supporting Documents (Optional)
                  </label>
                  <label className="dropzone">
                    <span className="material-symbols-outlined dropzone-icon">
                      cloud_upload
                    </span>
                    <p className="dropzone-title">
                      Click to upload or drag and drop
                    </p>
                    <p className="dropzone-hint">
                      PDF, JPG, or PNG (Max. 5MB)
                    </p>
                    <input type="file" hidden />
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn-submit ${submitState === 'sent' ? 'btn-sent' : ''}`}
                    disabled={submitState !== 'idle'}
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
                  <div className="balance-row">
                    <span className="balance-label">Annual Leave</span>
                    <span className="balance-value">14.5 Days</span>
                  </div>
                  <div className="mini-track">
                    <div className="mini-bar bar-primary" style={{ width: '72.5%' }} />
                  </div>
                  <div className="balance-row">
                    <span className="balance-label">Sick Leave</span>
                    <span className="balance-value">8 Days</span>
                  </div>
                  <div className="mini-track">
                    <div className="mini-bar bar-secondary" style={{ width: '40%' }} />
                  </div>
                  <div className="info-note">
                    <span className="material-symbols-outlined">info</span>
                    <p>
                      Your requested leave will be deducted from your Annual
                      Leave balance upon approval.
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
