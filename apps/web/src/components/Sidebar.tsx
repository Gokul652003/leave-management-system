import { useAuth } from '../auth/useAuth'

export type View =
  | 'dashboard'
  | 'apply-leave'
  | 'my-requests'
  | 'approvals'
  | 'approval-detail'
  | 'employees'
  | 'employee-profile'
  | 'org-chart'
  | 'roles-access'
  | 'settings'

const REVIEWER_ROLES = ['admin', 'hr', 'manager']

const navItems = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'apply-leave', icon: 'add_circle', label: 'Apply Leave' },
  { id: 'my-requests', icon: 'history', label: 'My Requests' },
  { icon: 'calendar_month', label: 'Team Calendar' },
  { id: 'approvals', icon: 'rule', label: 'Approvals', roles: REVIEWER_ROLES },
]

const orgItems = [
  { id: 'employees', icon: 'groups', label: 'Employees', roles: REVIEWER_ROLES },
  { id: 'roles-access', icon: 'admin_panel_settings', label: 'Roles & Access', roles: ['admin'] },
  { icon: 'bar_chart', label: 'Reports' },
  { id: 'settings', icon: 'settings', label: 'Settings', roles: ['admin', 'hr'] },
]

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Sidebar({
  active,
  onNavigate,
}: {
  active: View
  onNavigate: (view: View) => void
}) {
  const { session, signOut } = useAuth()
  const user = session?.user
  const name = (user?.user_metadata?.name as string | undefined) ?? user?.email ?? 'User'
  const role = (user?.app_metadata?.role as string | undefined) ?? ''
  const visibleNavItems = navItems.filter((item) => !item.roles || item.roles.includes(role))
  const visibleOrgItems = orgItems.filter((item) => !item.roles || item.roles.includes(role))

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
        {visibleNavItems.map((item) => {
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
        {visibleOrgItems.map((item) => {
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
        <div className="avatar-lg">{initialsOf(name)}</div>
        <div className="sidebar-profile-info">
          <p className="profile-name">{name}</p>
          <p className="profile-role">{role}</p>
        </div>
        <button
          className="icon-button sidebar-logout-btn"
          aria-label="Log out"
          title="Log out"
          onClick={() => void signOut()}
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
