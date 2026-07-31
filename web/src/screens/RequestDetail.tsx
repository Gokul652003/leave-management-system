import { useState } from 'react'
import alex from '../assets/alex-detail.jpg'

type ActionState = 'idle' | 'approved' | 'rejected'

function RequestDetail({
  onBack,
  onApply,
}: {
  onBack: () => void
  onApply: () => void
}) {
  const [comments, setComments] = useState('')
  const [action, setAction] = useState<ActionState>('idle')
  const [error, setError] = useState('')

  const handleAction = (type: 'approve' | 'reject') => {
    if (type === 'reject' && !comments.trim()) {
      setError('Please provide a reason for rejection in the comments area.')
      return
    }
    setError('')
    setAction(type === 'approve' ? 'approved' : 'rejected')
    setTimeout(() => setAction('idle'), 3000)
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="icon-button"
            aria-label="Back"
            onClick={onBack}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="topbar-title">Request Detail #LR-8842</h2>
        </div>
        <div className="topbar-actions topbar-actions-wide">
          <button className="icon-button notif-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notif-dot" />
          </button>
          <div className="topbar-divider" />
          <button className="btn-primary" onClick={onApply}>
            Apply for Leave
          </button>
        </div>
      </header>
      <main className="main">
        <div className="main-content detail-grid">
          <div className="detail-left">
            <section className="detail-main-card">
              <div className="detail-person-row">
                <img className="detail-person-avatar" src={alex} alt="Alex Thompson" />
                <div>
                  <h3>Alex Thompson</h3>
                  <p className="detail-person-role">
                    Senior Product Designer · Design Team
                  </p>
                  <div className="badge badge-pending detail-status-badge">
                    <span className="badge-dot" />
                    Pending Approval
                  </div>
                </div>
                <div className="detail-submitted">
                  <p className="detail-label-upper">Submitted On</p>
                  <p className="detail-mono">Oct 24, 2023</p>
                </div>
              </div>

              <div className="detail-facts">
                <div className="detail-fact">
                  <p className="detail-label">Leave Type</p>
                  <div className="detail-fact-row">
                    <span className="material-symbols-outlined">beach_access</span>
                    <p className="detail-fact-bold">Annual Leave</p>
                  </div>
                </div>
                <div className="detail-fact">
                  <p className="detail-label">Total Days</p>
                  <p className="detail-fact-heading">
                    5 <span className="detail-fact-unit">Workdays</span>
                  </p>
                </div>
                <div className="detail-fact detail-fact-wide">
                  <p className="detail-label">Duration</p>
                  <p className="detail-fact-bold detail-fact-mono-row">
                    <span className="detail-mono">Nov 12, 2023</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                    <span className="detail-mono">Nov 16, 2023</span>
                  </p>
                </div>
              </div>

              <div className="detail-reason">
                <p className="detail-label">Reason for Request</p>
                <p className="detail-reason-text">
                  "Planning a family trip for my sister's wedding. I have
                  completed the handover documentation for the Q4 design system
                  update and briefed the team on the current status of the
                  Figma libraries."
                </p>
              </div>
            </section>

            <section className="detail-attachments">
              <h4>
                <span className="material-symbols-outlined">attach_file</span>
                Attachments (2)
              </h4>
              <div className="attachment-list">
                <div className="attachment-item">
                  <div className="attachment-icon icon-pdf">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="attachment-info">
                    <p className="attachment-name">Wedding_Invitation.pdf</p>
                    <p className="attachment-size">2.4 MB</p>
                  </div>
                  <span className="material-symbols-outlined attachment-dl">
                    download
                  </span>
                </div>
                <div className="attachment-item">
                  <div className="attachment-icon icon-doc">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="attachment-info">
                    <p className="attachment-name">Handover_Brief.docx</p>
                    <p className="attachment-size">1.1 MB</p>
                  </div>
                  <span className="material-symbols-outlined attachment-dl">
                    download
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside className="detail-right">
            <section className="entitlement-card">
              <span className="material-symbols-outlined entitlement-watermark">
                pie_chart
              </span>
              <h4>Leave Entitlement</h4>
              <div className="entitlement-body">
                <div>
                  <div className="entitlement-row">
                    <p className="detail-label">Current Balance</p>
                    <p className="detail-fact-heading">
                      18 <span className="detail-fact-unit">Days</span>
                    </p>
                  </div>
                  <div className="entitlement-track">
                    <div className="entitlement-bar" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="entitlement-request">
                  <div>
                    <span className="material-symbols-outlined">arrow_downward</span>
                    <p>This Request</p>
                  </div>
                  <p className="entitlement-deduct">-5 Days</p>
                </div>
                <div className="entitlement-projected">
                  <p className="detail-label-upper">Projected Balance</p>
                  <p className="detail-fact-heading projected">
                    13 <span className="detail-fact-unit">Days</span>
                  </p>
                </div>
              </div>
            </section>

            <section className="manager-action">
              <h4>Manager Action</h4>
              <label className="detail-label" htmlFor="manager-comments">
                Comments (Mandatory for rejection)
              </label>
              <textarea
                id="manager-comments"
                className="detail-textarea"
                placeholder="Add your notes or feedback here..."
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              {error && <p className="detail-error">{error}</p>}
              <div className="action-buttons">
                <button
                  className="btn-approve-full"
                  onClick={() => handleAction('approve')}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Approve Request
                </button>
                <button
                  className="btn-reject-full"
                  onClick={() => handleAction('reject')}
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Reject Request
                </button>
              </div>
              <button className="history-link">
                <span className="material-symbols-outlined">schedule</span>
                View Past Leave History
              </button>
            </section>
          </aside>
        </div>

        {action !== 'idle' && (
          <div className={`action-toast ${action}`}>
            <span className="material-symbols-outlined">
              {action === 'approved' ? 'check_circle' : 'cancel'}
            </span>
            <p>
              {action === 'approved'
                ? 'Request has been approved.'
                : 'Request has been rejected.'}
            </p>
          </div>
        )}
      </main>
    </>
  )
}

export default RequestDetail
