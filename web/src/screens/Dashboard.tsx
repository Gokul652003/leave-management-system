import avatar from '../assets/avatar.jpg'

const leaveBalances = [
  {
    icon: 'medical_services',
    label: 'SICK LEAVE',
    used: 3,
    total: 15,
    iconClass: 'rose',
    barClass: 'rose',
    accentClass: 'rose',
  },
  {
    icon: 'beach_access',
    label: 'CASUAL LEAVE',
    used: 4,
    total: 12,
    iconClass: 'amber',
    barClass: 'amber',
    accentClass: 'amber',
  },
  {
    icon: 'flight_takeoff',
    label: 'EARNED LEAVE',
    used: 6,
    total: 30,
    iconClass: 'teal',
    barClass: 'teal',
    accentClass: 'teal',
  },
]

const approvedLeaves = [
  {
    icon: 'flight_takeoff',
    iconClass: 'teal',
    type: 'Earned Leave',
    dates: 'Oct 24 - Oct 28, 2023',
    duration: '5 Days',
    status: 'Approved',
    statusClass: 'approved',
  },
  {
    icon: 'beach_access',
    iconClass: 'amber',
    type: 'Casual Leave',
    dates: 'Nov 12, 2023',
    duration: '1 Day',
    status: 'Pending',
    statusClass: 'pending',
  },
]

function LeaveBalanceCard({
  card,
}: {
  card: (typeof leaveBalances)[number]
}) {
  const remaining = card.total - card.used
  const pct = Math.round((remaining / card.total) * 100)
  return (
    <div className="glass-card leave-card">
      <div className="leave-card-icon">
        <span className={`material-symbols-outlined icon-${card.iconClass}`}>
          {card.icon}
        </span>
      </div>
      <span className="leave-card-label">{card.label}</span>
      <div className="leave-card-value">
        <span>{remaining}</span>
        <span className="leave-card-total">/ {card.total} days</span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-bar bar-${card.barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="leave-card-footer">
        <span className={`text-${card.accentClass}`}>{card.used} used</span>
        <span className="text-secondary">{remaining} remaining</span>
      </div>
    </div>
  )
}

function Calendar() {
  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const leaveDays = [24, 25, 26, 27, 28]
  const today = 15

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>Team Availability</h3>
        <div className="calendar-nav">
          <button aria-label="Previous month">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button aria-label="Next month">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="calendar-grid calendar-weekdays">
        {weekdays.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => (
          <div
            key={day}
            className={`calendar-day ${
              leaveDays.includes(day)
                ? 'calendar-day-leave'
                : day === today
                  ? 'calendar-day-today'
                  : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="dot dot-leave" /> Your Leave
        </div>
        <div className="legend-item">
          <span className="dot dot-holiday" /> Team Holiday
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onApply }: { onApply: () => void }) {
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
            <img src={avatar} alt="Jane Doe" />
          </div>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <section className="greeting">
            <div>
              <h2 className="greeting-title">Welcome back, Jane</h2>
              <p className="greeting-subtitle">
                You have 2 pending leave requests and 1 upcoming approved trip.
              </p>
            </div>
            <div className="employee-badge">
              <span className="material-symbols-outlined">verified</span>
              <span>Employee ID: EMP-2940-AC</span>
            </div>
          </section>

          <section className="balances">
            {leaveBalances.map((card) => (
              <LeaveBalanceCard key={card.label} card={card} />
            ))}
          </section>

          <section className="table-card">
            <div className="table-header">
              <h3>Upcoming Approved Leaves</h3>
              <a href="#">View History</a>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="th-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedLeaves.map((row) => (
                    <tr key={`${row.type}-${row.dates}`}>
                      <td>
                        <div className="leave-type">
                          <div
                            className={`leave-type-icon icon-${row.iconClass}`}
                          >
                            <span className="material-symbols-outlined">
                              {row.icon}
                            </span>
                          </div>
                          <span>{row.type}</span>
                        </div>
                      </td>
                      <td className="td-dates">{row.dates}</td>
                      <td className="td-muted">{row.duration}</td>
                      <td>
                        <span className={`badge badge-${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="td-right">
                        <button
                          className="icon-button"
                          aria-label="More options"
                        >
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bottom-grid">
            <Calendar />
            <div className="policy-card">
              <h4>Leave Policy Update</h4>
              <p>
                The new holiday carry-forward policy for 2024 has been updated.
                You can now carry up to 10 days of earned leave to the next
                fiscal year.
              </p>
              <a href="#">
                Read Policy Document
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
              <div className="policy-glow" />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Dashboard
