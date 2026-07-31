const policyCards = [
  {
    icon: 'beach_access',
    iconClass: 'policy-teal',
    title: 'Annual Leave',
    desc: 'General vacation days for all full-time employees.',
    quota: '25 Days',
    carry: 'Max 5 Days',
    accrual: 'Upfront',
    accrualClass: 'pill-emerald',
  },
  {
    icon: 'medical_services',
    iconClass: 'policy-rose',
    title: 'Sick Leave',
    desc: 'Medical leave for illnesses and healthcare appointments.',
    quota: '12 Days',
    carry: 'None',
    accrual: 'Monthly',
    accrualClass: 'pill-blue',
  },
  {
    icon: 'child_care',
    iconClass: 'policy-purple',
    title: 'Maternity Leave',
    desc: 'Protected time off for expectant mothers and new parents.',
    quota: '120 Days',
    carry: 'N/A',
    accrual: 'Upfront',
    accrualClass: 'pill-amber',
  },
  {
    icon: 'person',
    iconClass: 'policy-amber',
    title: 'Personal Day',
    desc: 'Flexible leave for miscellaneous personal requirements.',
    quota: '3 Days',
    carry: 'None',
    accrual: 'Yearly',
    accrualClass: 'pill-emerald',
  },
  {
    icon: 'school',
    iconClass: 'policy-indigo',
    title: 'Study Leave',
    desc: 'Dedicated time for exams and professional certification training.',
    quota: '5 Days',
    carry: 'Max 2 Days',
    accrual: 'Yearly',
    accrualClass: 'pill-emerald',
  },
]

const stats = [
  { label: 'Active Policies', value: '08', valueClass: 'big' },
  { label: 'Avg. Annual Quota', value: '22', valueClass: 'big' },
  { label: 'Last Updated', value: 'Oct 24, 2023', valueClass: 'md' },
  { label: 'Pending Sync', value: '0 Employees', valueClass: 'md' },
]

const globalSettings = [
  {
    name: 'Fiscal Year Start',
    value: 'January 01',
    modified: '2023-12-01',
    status: 'Active',
    statusClass: 'gt-active',
  },
  {
    name: 'Auto-Approval Threshold',
    value: '1 Day',
    modified: '2024-01-15',
    status: 'Active',
    statusClass: 'gt-active',
  },
  {
    name: 'Emergency Leave Overdraft',
    value: 'Allowed (Max 2)',
    modified: '2023-08-22',
    status: 'Pending Review',
    statusClass: 'gt-pending',
  },
]

function LeavePolicies({ onApply }: { onApply: () => void }) {
  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h2 className="topbar-title">Leave Policies</h2>
          <div className="topbar-divider-v" />
          <span className="topbar-subtitle">Organization Configuration</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="btn-primary" onClick={onApply}>
            <span className="material-symbols-outlined">add</span>
            <span>Apply for Leave</span>
          </button>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <section className="policy-page-header">
            <div className="page-heading">
              <h2 className="page-heading-title">Policy Management</h2>
              <p className="page-heading-subtitle">
                Define and manage time-off entitlements for your workforce.
                These rules will be automatically applied based on employee
                contracts and seniority.
              </p>
            </div>
            <button className="btn-primary btn-lg">
              <span className="material-symbols-outlined">add_circle</span>
              <span>Add New Leave Type</span>
            </button>
          </section>

          <section className="stats-grid policy-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <p className="stat-label">{s.label}</p>
                {s.valueClass === 'big' ? (
                  <p className="stat-value stat-primary">{s.value}</p>
                ) : (
                  <p className="policy-stat-md">{s.value}</p>
                )}
              </div>
            ))}
          </section>

          <section className="policy-cards">
            {policyCards.map((card) => (
              <div key={card.title} className="glass-card policy-card-mini">
                <div className="policy-card-top">
                  <div className={`policy-icon ${card.iconClass}`}>
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <div className="policy-card-actions">
                    <button aria-label={`Edit ${card.title}`}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button aria-label={`Delete ${card.title}`}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="policy-card-body">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
                <div className="policy-card-details">
                  <div className="policy-detail-row">
                    <span>Annual Quota</span>
                    <span className="policy-detail-value">{card.quota}</span>
                  </div>
                  <div className="policy-detail-row">
                    <span>Carry-forward</span>
                    <span className="policy-detail-value">{card.carry}</span>
                  </div>
                  <div className="policy-detail-row">
                    <span>Accrual Frequency</span>
                    <span className={`pill ${card.accrualClass}`}>
                      {card.accrual}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button className="policy-add-card">
              <div className="policy-add-icon">
                <span className="material-symbols-outlined">add</span>
              </div>
              <span className="policy-add-title">New Policy Type</span>
              <p className="policy-add-hint">Click to define a custom leave</p>
            </button>
          </section>

          <section className="global-settings">
            <div className="global-settings-header">
              <h3>Global Settings</h3>
              <button className="global-edit">Edit Global Rules</button>
            </div>
            <div className="global-settings-wrap">
              <table className="global-table">
                <thead>
                  <tr>
                    <th>Setting Name</th>
                    <th>Value</th>
                    <th>Last Modified</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {globalSettings.map((setting) => (
                    <tr key={setting.name}>
                      <td className="gt-name">{setting.name}</td>
                      <td className="gt-mono">{setting.value}</td>
                      <td className="gt-mono">{setting.modified}</td>
                      <td>
                        <span className={`gt-pill ${setting.statusClass}`}>
                          {setting.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="help-banner">
            <span className="material-symbols-outlined">help_outline</span>
            <div className="help-text">
              <p className="help-title">
                Need help with complex accrual rules?
              </p>
              <p className="help-desc">
                Our documentation explains how to set up prorated leave for
                part-time employees or tenure-based increases.
              </p>
            </div>
            <button className="help-btn">View Documentation</button>
          </section>
        </div>
      </main>
    </>
  )
}

export default LeavePolicies
