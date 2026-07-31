export type View =
  | 'dashboard'
  | 'apply-leave'
  | 'my-requests'
  | 'approvals'
  | 'approval-detail'
  | 'employees'
  | 'roles-access'
  | 'settings'

const navItems = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'apply-leave', icon: 'add_circle', label: 'Apply Leave' },
  { id: 'my-requests', icon: 'history', label: 'My Requests' },
  { icon: 'calendar_month', label: 'Team Calendar' },
  { id: 'approvals', icon: 'rule', label: 'Approvals' },
]

const orgItems = [
  { id: 'employees', icon: 'groups', label: 'Employees' },
  { id: 'roles-access', icon: 'admin_panel_settings', label: 'Roles & Access' },
  { icon: 'bar_chart', label: 'Reports' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

function Sidebar({
  active,
  onNavigate,
}: {
  active: View
  onNavigate: (view: View) => void
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-row">
          <div className="sidebar-logo">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
          <div>
            <h1>HR Portal</h1>
            <p>Enterprise Edition</p>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.id === active
          return (
            <a
              key={item.label}
              href="#"
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                if (item.id) onNavigate(item.id as View)
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          )
        })}
        <div className="nav-group-label">Organization</div>
        {orgItems.map((item) => {
          const isActive = item.id === active
          return (
            <a
              key={item.label}
              href="#"
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                if (item.id) onNavigate(item.id as View)
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
      <div className="sidebar-profile">
        <div className="avatar-lg">JD</div>
        <div>
          <p className="profile-name">Jane Doe</p>
          <p className="profile-role">Senior Architect</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
