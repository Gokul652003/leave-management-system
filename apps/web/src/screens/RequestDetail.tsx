import { useState } from 'react'
import {
  useApproveLeaveRequest,
  useLeaveRequest,
  useRejectLeaveRequest,
} from '../api/hooks/useLeaveRequests'
import { getErrorMessage } from '../api/errorMessage'

function formatDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function RequestDetail({
  requestId,
  onBack,
  onApply,
}: {
  requestId: string
  onBack: () => void
  onApply: () => void
}) {
  const { data: request, isLoading, isError, error } = useLeaveRequest(requestId)
  const approve = useApproveLeaveRequest()
  const reject = useRejectLeaveRequest()
  const [comments, setComments] = useState('')
  const [formError, setFormError] = useState('')
  const [action, setAction] = useState<'idle' | 'approved' | 'rejected'>('idle')

  const handleApprove = () => {
    setFormError('')
    approve.mutate(requestId, {
      onSuccess: () => {
        setAction('approved')
        setTimeout(onBack, 1500)
      },
    })
  }

  const handleReject = () => {
    if (!comments.trim()) {
      setFormError('Please provide a reason for rejection in the comments area.')
      return
    }
    setFormError('')
    reject.mutate(
      { id: requestId, comments },
      {
        onSuccess: () => {
          setAction('rejected')
          setTimeout(onBack, 1500)
        },
      },
    )
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button" aria-label="Back" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="topbar-title">Request Detail</h2>
        </div>
        <div className="topbar-actions topbar-actions-wide">
          <button className="btn-primary" onClick={onApply}>
            Apply for Leave
          </button>
        </div>
      </header>
      <main className="main">
        <div className="main-content detail-grid">
          {isLoading && <p className="detail-label">Loading request...</p>}
          {isError && (
            <p className="detail-error">
              {getErrorMessage(error)}
            </p>
          )}

          {request && (
            <>
              <div className="detail-left">
                <section className="detail-main-card">
                  <div className="detail-person-row">
                    <div>
                      <h3>{request.employeeName}</h3>
                      <p className="detail-person-role">{request.employeeCode}</p>
                      <div className={`badge badge-${request.status} detail-status-badge`}>
                        <span className="badge-dot" />
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                    </div>
                    <div className="detail-submitted">
                      <p className="detail-label-upper">Submitted On</p>
                      <p className="detail-mono">{formatDate(request.createdAt.slice(0, 10))}</p>
                    </div>
                  </div>

                  <div className="detail-facts">
                    <div className="detail-fact">
                      <p className="detail-label">Leave Type</p>
                      <div className="detail-fact-row">
                        <span className="material-symbols-outlined">beach_access</span>
                        <p className="detail-fact-bold">{request.leaveTypeName}</p>
                      </div>
                    </div>
                    <div className="detail-fact">
                      <p className="detail-label">Total Days</p>
                      <p className="detail-fact-heading">
                        {request.totalDays} <span className="detail-fact-unit">Days</span>
                      </p>
                    </div>
                    <div className="detail-fact detail-fact-wide">
                      <p className="detail-label">Duration</p>
                      <p className="detail-fact-bold detail-fact-mono-row">
                        <span className="detail-mono">{formatDate(request.startDate)}</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                        <span className="detail-mono">{formatDate(request.endDate)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="detail-reason">
                    <p className="detail-label">Reason for Request</p>
                    <p className="detail-reason-text">
                      {request.reason ? `"${request.reason}"` : 'No reason provided.'}
                    </p>
                  </div>

                  {request.status !== 'pending' && (
                    <div className="detail-reason">
                      <p className="detail-label">Reviewer Comments</p>
                      <p className="detail-reason-text">
                        {request.reviewerComments ?? '—'}
                      </p>
                    </div>
                  )}
                </section>
              </div>

              <aside className="detail-right">
                {request.status === 'pending' ? (
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
                    {formError && <p className="detail-error">{formError}</p>}
                    <div className="action-buttons">
                      <button
                        className="btn-approve-full"
                        disabled={approve.isPending || reject.isPending}
                        onClick={handleApprove}
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                        Approve Request
                      </button>
                      <button
                        className="btn-reject-full"
                        disabled={approve.isPending || reject.isPending}
                        onClick={handleReject}
                      >
                        <span className="material-symbols-outlined">cancel</span>
                        Reject Request
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="manager-action">
                    <h4>Review Outcome</h4>
                    <p className="detail-reason-text">
                      This request was already {request.status} on{' '}
                      {request.reviewedAt ? formatDate(request.reviewedAt.slice(0, 10)) : '—'}.
                    </p>
                  </section>
                )}
              </aside>
            </>
          )}
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
