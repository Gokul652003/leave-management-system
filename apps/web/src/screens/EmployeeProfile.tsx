import { useEmployeeProfile } from '../api/hooks/useEmployeeProfile'
import { getErrorMessage } from '../api/errorMessage'

function EmployeeProfile({
  employeeId,
  onBack,
}: {
  employeeId: string
  onBack: () => void
}) {
  const { data, isLoading, isError, error } = useEmployeeProfile(employeeId)

  const initials = data
    ? data.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : ''

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button" aria-label="Back" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="topbar-title">Employee Profile</h2>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          {isLoading && <p className="detail-label">Loading profile...</p>}
          {isError && (
            <p className="detail-error">
              {getErrorMessage(error)}
            </p>
          )}
          {data && (
            <section className="detail-main-card">
              <div className="detail-person-row">
                <div className="emp-avatar avatar-primary">{initials}</div>
                <div>
                  <h3>{data.name}</h3>
                  <p className="detail-person-role">
                    {data.role} · {data.department}
                  </p>
                  <span
                    className={`status-pill status-${data.status.toLowerCase().replace(' ', '-')} detail-status-badge`}
                  >
                    <span className="status-dot" />
                    {data.status}
                  </span>
                </div>
                <div className="detail-submitted">
                  <p className="detail-label-upper">Employee ID</p>
                  <p className="detail-mono">{data.employeeId}</p>
                </div>
              </div>

              <div className="detail-facts">
                <div className="detail-fact">
                  <p className="detail-label">Email</p>
                  <p className="detail-fact-bold">{data.email}</p>
                </div>
                <div className="detail-fact">
                  <p className="detail-label">Department</p>
                  <p className="detail-fact-bold">{data.department}</p>
                </div>
                <div className="detail-fact">
                  <p className="detail-label">Role</p>
                  <p className="detail-fact-bold">{data.role}</p>
                </div>
                <div className="detail-fact">
                  <p className="detail-label">Join Date</p>
                  <p className="detail-fact-bold">{data.joinDate ?? '—'}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

export default EmployeeProfile
