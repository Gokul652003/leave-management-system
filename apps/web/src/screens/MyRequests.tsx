import { useState } from 'react'
import alexImg from '../assets/alex-mr.jpg'

type Status = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

type Request = {
  id: string
  type: string
  dotClass: string
  dates: string
  duration: string
  status: Status
  statusClass: string
}

const requests: Request[] = [
  {
    id: 'LR-98421',
    type: 'Annual Leave',
    dotClass: 'req-dot-primary',
    dates: 'Jul 12 – Jul 18, 2024',
    duration: '5.0 Days',
    status: 'Pending',
    statusClass: 'req-pending',
  },
  {
    id: 'LR-98105',
    type: 'Sick Leave',
    dotClass: 'req-dot-rose',
    dates: 'May 24 – May 24, 2024',
    duration: '1.0 Day',
    status: 'Approved',
    statusClass: 'req-approved',
  },
  {
    id: 'LR-97882',
    type: 'Personal Leave',
    dotClass: 'req-dot-slate',
    dates: 'Apr 05 – Apr 05, 2024',
    duration: '1.0 Day',
    status: 'Rejected',
    statusClass: 'req-rejected',
  },
  {
    id: 'LR-97210',
    type: 'Annual Leave',
    dotClass: 'req-dot-primary',
    dates: 'Mar 10 – Mar 15, 2024',
    duration: '5.0 Days',
    status: 'Cancelled',
    statusClass: 'req-cancelled',
  },
]

const stats = [
  {
    icon: 'event_available',
    iconClass: 'mr-stat-primary',
    badge: '+2.5d',
    badgeClass: 'mr-badge-emerald',
    label: 'Annual Leave',
    value: '18.5',
    suffix: 'days left',
  },
  {
    icon: 'medical_services',
    iconClass: 'mr-stat-orange',
    label: 'Sick Leave',
    value: '5',
    suffix: 'days used',
  },
  {
    icon: 'pending_actions',
    iconClass: 'mr-stat-secondary',
    label: 'Pending Approvals',
    value: '2',
    suffix: 'requests',
  },
]

const chips = ['All Requests', 'Pending', 'Approved', 'Past'] as const
type Chip = (typeof chips)[number]

const pastStatuses: Status[] = ['Rejected', 'Cancelled']

function MyRequests() {
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState<Chip>('All Requests')

  const filtered = requests.filter((req) => {
    const matchesQuery = `${req.id} ${req.type} ${req.dates}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesChip =
      chip === 'All Requests' ||
      (chip === 'Past' ? pastStatuses.includes(req.status) : req.status === chip)
    return matchesQuery && matchesChip
  })

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
          <button className="mr-support-btn">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </button>
          <div className="topbar-divider" />
          <button className="icon-button notif-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notif-dot" />
          </button>
          <div className="topbar-user">
            <div className="avatar-ring mr-avatar-ring">
              <img src={alexImg} alt="Alex Thompson" />
            </div>
            <div className="topbar-user-text">
              <p className="user-name">Alex Thompson</p>
              <p className="user-role">Software Engineer</p>
            </div>
          </div>
        </div>
      </header>
      <main className="main mr-main">
        <div className="main-content">
          <section className="mr-page-header">
            <div>
              <nav className="breadcrumb mr-breadcrumb">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Dashboard
                </a>
                <span className="breadcrumb-sep material-symbols-outlined">
                  chevron_right
                </span>
                <span className="breadcrumb-current">My Requests</span>
              </nav>
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
            {stats.map((s) => (
              <div key={s.label} className="mr-stat-card">
                <div className="mr-stat-top">
                  <div className={`mr-stat-icon ${s.iconClass}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  {s.badge && (
                    <span className={`mr-stat-badge ${s.badgeClass}`}>
                      {s.badge}
                    </span>
                  )}
                </div>
                <p className="mr-stat-label">{s.label}</p>
                <p className="mr-stat-value">
                  {s.value} <span className="mr-stat-suffix">{s.suffix}</span>
                </p>
              </div>
            ))}
            <div className="mr-stat-card mr-holiday-card">
              <div className="mr-holiday-content">
                <p className="mr-stat-label">Next Holiday</p>
                <p className="mr-holiday-name">Good Friday</p>
                <p className="mr-holiday-date">April 18, 2024</p>
              </div>
              <span className="material-symbols-outlined mr-holiday-icon">
                beach_access
              </span>
            </div>
          </section>

          <section className="mr-table-card">
            <div className="mr-table-header">
              <div>
                <h4 className="mr-table-title">Request Log</h4>
                <p className="mr-table-subtitle">
                  A detailed history of your time-off records.
                </p>
              </div>
              <div className="mr-table-actions">
                <button className="mr-toolbar-btn">
                  <span className="material-symbols-outlined">filter_list</span>
                  <span>Filter</span>
                </button>
                <button className="mr-toolbar-btn">
                  <span className="material-symbols-outlined">download</span>
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="mr-table-wrap">
              <table className="mr-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th className="th-center">Duration</th>
                    <th>Status</th>
                    <th className="th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <tr key={req.id} className="mr-row">
                      <td className="mr-req-id">#{req.id}</td>
                      <td>
                        <div className="mr-type-cell">
                          <span className={`mr-dot ${req.dotClass}`} />
                          <span className="mr-type-name">{req.type}</span>
                        </div>
                      </td>
                      <td className="mr-dates">{req.dates}</td>
                      <td className="th-center mr-duration">{req.duration}</td>
                      <td>
                        <span className={`mr-status ${req.statusClass}`}>
                          <span className="mr-status-dot" />
                          {req.status}
                        </span>
                      </td>
                      <td className="th-right">
                        <button className="mr-view-btn">
                          View Details
                          <span className="material-symbols-outlined">
                            arrow_forward
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-footer">
              <p className="table-footer-text">
                Showing 1 to {filtered.length} of 24 entries
              </p>
              <div className="page-controls">
                <button className="page-btn" disabled aria-label="Previous page">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="page-btn page-active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn" aria-label="Next page">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default MyRequests
