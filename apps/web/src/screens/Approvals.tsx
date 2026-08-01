import { useState } from 'react'
import alex from '../assets/alex.jpg'
import sarah from '../assets/employee-sarah.jpg'
import marcus from '../assets/marcus.jpg'
import elena from '../assets/elena.jpg'
import manager from '../assets/manager.jpg'

type Tab = 'pending' | 'history' | 'team'

type RequestRow = {
  id: string
  name: string
  role: string
  avatar: string
  type: string
  typeClass: string
  dates: string
  duration: string
  reason: string
  status?: 'Approved' | 'Rejected'
}

const requests: RequestRow[] = [
  {
    id: 'alex',
    name: 'Alex Thompson',
    role: 'Product Designer',
    avatar: alex,
    type: 'Annual Leave',
    typeClass: 'sky',
    dates: 'Oct 24 — Oct 28',
    duration: '5 Days',
    reason: 'Family trip to Tokyo during cherry blossom season.',
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    role: 'Sr. Frontend Developer',
    avatar: sarah,
    type: 'Sick Leave',
    typeClass: 'rose',
    dates: 'Oct 21 — Oct 22',
    duration: '2 Days',
    reason: 'Developing severe seasonal flu symptoms.',
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'QA Analyst',
    avatar: marcus,
    type: 'Personal Leave',
    typeClass: 'amber',
    dates: 'Nov 02 — Nov 02',
    duration: '1 Day',
    reason: 'Personal matters regarding home maintenance.',
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    role: 'UX Researcher',
    avatar: elena,
    type: 'Maternity Leave',
    typeClass: 'emerald',
    dates: 'Dec 01 — Feb 28',
    duration: '90 Days',
    reason: 'Upcoming maternity leave as discussed with HR.',
  },
]

const stats = [
  { label: 'Total Pending', value: '12', valueClass: 'primary' },
  { label: 'Action Required', value: '4', valueClass: 'error' },
  { label: 'Average Days', value: '3.5', valueClass: 'default' },
  { label: 'Approved Today', value: '8', valueClass: 'dark' },
]

const chartBars = [
  { label: 'Annual', height: '60%', barClass: 'chart-annual' },
  { label: 'Sick', height: '30%', barClass: 'chart-sick' },
  { label: 'Personal', height: '45%', barClass: 'chart-personal' },
  { label: 'Study', height: '80%', barClass: 'chart-study' },
  { label: 'Other', height: '15%', barClass: 'chart-other' },
]

function Approvals({
  onApply,
  onViewDetail,
}: {
  onApply: () => void
  onViewDetail: () => void
}) {
  const [tab, setTab] = useState<Tab>('pending')
  const [rows, setRows] = useState(requests)

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status:
                action === 'approve' ? ('Approved' as const) : ('Rejected' as const),
            }
          : row,
      ),
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
            <img src={manager} alt="Jane Doe" />
          </div>
        </div>
      </header>
      <main className="main approvals-main">
        <div className="main-content">
          <section className="approvals-header">
            <div className="page-heading">
              <h2 className="page-heading-title">Approval Queue</h2>
              <p className="page-heading-subtitle">
                Review and manage pending leave requests from your team.
              </p>
            </div>
            <div className="segmented">
              {(['pending', 'history', 'team'] as const).map((t) => (
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

          <section className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <p className="stat-label">{s.label}</p>
                <p className={`stat-value stat-${s.valueClass}`}>{s.value}</p>
              </div>
            ))}
          </section>

          <section className="approvals-table-card">
            <div className="approvals-table-wrap">
              <table className="approvals-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th className="th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="employee-cell">
                          <div className="employee-avatar">
                            <img src={row.avatar} alt={row.name} />
                          </div>
                          <div>
                            <p className="employee-name">{row.name}</p>
                            <p className="employee-role">{row.role}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge type-${row.typeClass}`}>
                          <span className="type-dot" />
                          {row.type}
                        </span>
                      </td>
                      <td className="td-mono">{row.dates}</td>
                      <td>
                        <span className="duration-text">{row.duration}</span>
                      </td>
                      <td>
                        <p className="reason-text">{row.reason}</p>
                      </td>
                      <td className="td-right">
                        <div className="row-actions">
                          {row.status === undefined ? (
                            <>
                              <button
                                className="btn-approve"
                                onClick={() => handleAction(row.id, 'approve')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleAction(row.id, 'reject')}
                              >
                                Reject
                              </button>
                              <a
                                href="#"
                                className="row-open"
                                onClick={(e) => {
                                  e.preventDefault()
                                  onViewDetail()
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  open_in_new
                                </span>
                              </a>
                            </>
                          ) : (
                            <span
                              className={`badge badge-${row.status === 'Approved' ? 'approved' : 'rejected'}`}
                            >
                              {row.status}
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
                Showing {rows.length} of 12 pending requests
              </p>
              <div className="pager">
                <button className="pager-btn" disabled aria-label="Previous page">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="pager-btn" aria-label="Next page">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          <section className="bento-bottom">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Leave Distribution</h3>
                <span className="material-symbols-outlined">more_horiz</span>
              </div>
              <div className="chart-bars">
                {chartBars.map((bar) => (
                  <div key={bar.label} className="chart-col">
                    <div
                      className={`chart-bar ${bar.barClass}`}
                      style={{ height: bar.height }}
                    />
                    <span className="chart-label">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="insights-card">
              <div className="insights-title">
                <span className="material-symbols-outlined">auto_awesome</span>
                <h3>Manager Insights</h3>
              </div>
              <p className="insights-text">
                You have a higher than average concentration of leave requests
                for the first week of November. Consider reviewing project
                timelines.
              </p>
              <div className="insights-avail">
                <div className="avail-row">
                  <span>Team Availability</span>
                  <span className="avail-pct">68%</span>
                </div>
                <div className="avail-track">
                  <div className="avail-bar" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Approvals
