import { Fragment, useState } from 'react'

type Permission = {
  id: string
  name: string
  desc: string
  access: boolean
  approval: boolean
  approvalDisabled?: boolean
}

type Section = {
  name: string
  perms: Permission[]
}

type RolePerms = {
  sections: Section[]
}

const roles = [
  { id: 'admin', icon: 'security', name: 'Admin', desc: 'Full system access' },
  { id: 'hr', icon: 'manage_accounts', name: 'HR Manager', desc: 'Employee & Policy management' },
  { id: 'manager', icon: 'supervisor_account', name: 'Team Manager', desc: 'Approvals & Team viewing' },
  { id: 'employee', icon: 'person', name: 'Employee', desc: 'Personal records & Requests' },
]

const rolePerms: Record<string, RolePerms> = {
  admin: {
    sections: [
      {
        name: 'Leave Management',
        perms: [
          {
            id: 'apply',
            name: 'Can apply for leave',
            desc: 'Allow user to submit leave requests for themselves',
            access: true,
            approval: true,
          },
          {
            id: 'approve',
            name: 'Can approve leave',
            desc: 'Authorize leave requests within assigned department',
            access: true,
            approval: false,
          },
          {
            id: 'policy',
            name: 'Can edit leave policy',
            desc: 'Modify accrual rates, holiday calendars, and rules',
            access: true,
            approval: true,
          },
        ],
      },
      {
        name: 'Employee Data',
        perms: [
          {
            id: 'view-all',
            name: 'Can view all employee data',
            desc: 'Global visibility across all departments and roles',
            access: true,
            approval: false,
            approvalDisabled: true,
          },
          {
            id: 'edit-files',
            name: 'Can edit employee files',
            desc: 'Update personal info, salary, and documents',
            access: true,
            approval: true,
          },
          {
            id: 'export-pii',
            name: 'Export PII data',
            desc: 'Permission to download sensitive employee reports',
            access: true,
            approval: true,
          },
        ],
      },
    ],
  },
  hr: {
    sections: [
      {
        name: 'Leave Management',
        perms: [
          {
            id: 'apply',
            name: 'Can apply for leave',
            desc: 'Allow user to submit leave requests for themselves',
            access: true,
            approval: false,
          },
          {
            id: 'approve',
            name: 'Can approve leave',
            desc: 'Authorize leave requests within assigned department',
            access: true,
            approval: true,
          },
          {
            id: 'policy',
            name: 'Can edit leave policy',
            desc: 'Modify accrual rates, holiday calendars, and rules',
            access: true,
            approval: true,
          },
        ],
      },
      {
        name: 'Employee Data',
        perms: [
          {
            id: 'view-all',
            name: 'Can view all employee data',
            desc: 'Global visibility across all departments and roles',
            access: true,
            approval: false,
            approvalDisabled: true,
          },
          {
            id: 'edit-files',
            name: 'Can edit employee files',
            desc: 'Update personal info, salary, and documents',
            access: true,
            approval: true,
          },
          {
            id: 'export-pii',
            name: 'Export PII data',
            desc: 'Permission to download sensitive employee reports',
            access: true,
            approval: true,
          },
        ],
      },
    ],
  },
  manager: {
    sections: [
      {
        name: 'Leave Management',
        perms: [
          {
            id: 'apply',
            name: 'Can apply for leave',
            desc: 'Allow user to submit leave requests for themselves',
            access: true,
            approval: false,
          },
          {
            id: 'approve',
            name: 'Can approve leave',
            desc: 'Authorize leave requests within assigned department',
            access: true,
            approval: false,
          },
          {
            id: 'policy',
            name: 'Can edit leave policy',
            desc: 'Modify accrual rates, holiday calendars, and rules',
            access: false,
            approval: false,
          },
        ],
      },
      {
        name: 'Employee Data',
        perms: [
          {
            id: 'view-all',
            name: 'Can view all employee data',
            desc: 'Global visibility across all departments and roles',
            access: false,
            approval: false,
            approvalDisabled: true,
          },
          {
            id: 'edit-files',
            name: 'Can edit employee files',
            desc: 'Update personal info, salary, and documents',
            access: false,
            approval: false,
          },
          {
            id: 'export-pii',
            name: 'Export PII data',
            desc: 'Permission to download sensitive employee reports',
            access: false,
            approval: false,
          },
        ],
      },
    ],
  },
  employee: {
    sections: [
      {
        name: 'Leave Management',
        perms: [
          {
            id: 'apply',
            name: 'Can apply for leave',
            desc: 'Allow user to submit leave requests for themselves',
            access: true,
            approval: false,
          },
          {
            id: 'approve',
            name: 'Can approve leave',
            desc: 'Authorize leave requests within assigned department',
            access: false,
            approval: false,
          },
          {
            id: 'policy',
            name: 'Can edit leave policy',
            desc: 'Modify accrual rates, holiday calendars, and rules',
            access: false,
            approval: false,
          },
        ],
      },
      {
        name: 'Employee Data',
        perms: [
          {
            id: 'view-all',
            name: 'Can view all employee data',
            desc: 'Global visibility across all departments and roles',
            access: false,
            approval: false,
            approvalDisabled: true,
          },
          {
            id: 'edit-files',
            name: 'Can edit employee files',
            desc: 'Update personal info, salary, and documents',
            access: false,
            approval: false,
          },
          {
            id: 'export-pii',
            name: 'Export PII data',
            desc: 'Permission to download sensitive employee reports',
            access: false,
            approval: false,
          },
        ],
      },
    ],
  },
}

const distribution = [
  { label: 'Employees', value: '1,240', width: 85, barClass: 'ra-bar-primary' },
  { label: 'Managers', value: '84', width: 12, barClass: 'ra-bar-container' },
  { label: 'HR/Admins', value: '12', width: 3, barClass: 'ra-bar-secondary' },
]

const auditEntries = [
  {
    id: 'audit-1',
    icon: 'edit',
    iconClass: 'ra-audit-amber',
    text: (
      <>
        <span className="ra-audit-bold">Michael Smith</span> updated permissions for{' '}
        <span className="ra-audit-accent">HR Manager</span> role.
      </>
    ),
    meta: 'Today, 2:45 PM • IP: 192.168.1.45',
  },
  {
    id: 'audit-2',
    icon: 'person_add',
    iconClass: 'ra-audit-emerald',
    text: (
      <>
        <span className="ra-audit-bold">System</span> assigned{' '}
        <span className="ra-audit-accent">Employee</span> role to 12 new hires.
      </>
    ),
    meta: 'Yesterday, 9:00 AM • Automated Task',
  },
]

function RoleAccess({ onApply }: { onApply: () => void }) {
  const [activeRole, setActiveRole] = useState('admin')
  const [perms, setPerms] = useState(rolePerms)
  const [toast, setToast] = useState('')

  const toggle = (
    sectionIdx: number,
    permIdx: number,
    field: 'access' | 'approval',
  ) => {
    setPerms((prev) => {
      const sections = prev[activeRole].sections.map((section, si) =>
        si === sectionIdx
          ? {
              ...section,
              perms: section.perms.map((p, pi) =>
                pi === permIdx ? { ...p, [field]: !p[field] } : p,
              ),
            }
          : section,
      )
      return { ...prev, [activeRole]: { sections } }
    })
  }

  const resetDefaults = () => {
    setPerms(rolePerms)
    setToast('Permissions restored to defaults')
    setTimeout(() => setToast(''), 2500)
  }

  const saveChanges = () => {
    setToast('Permissions saved')
    setTimeout(() => setToast(''), 2500)
  }

  const activeSections = perms[activeRole].sections

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h2 className="topbar-title">Acme Corp</h2>
          <div className="topbar-divider-v" />
          <span className="topbar-subtitle">Roles & Access Control</span>
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
          <section className="ra-hero">
            <h3 className="page-heading-title">Permissions Management</h3>
            <p className="ra-hero-subtitle">
              Define granular access levels and policy overrides. These roles
              determine what data employees can view and what actions they can
              perform across the HR portal.
            </p>
          </section>

          <section className="ra-grid">
            <div className="ra-left-col">
              <div className="ra-card">
                <div className="ra-card-header">
                  <h4 className="ra-card-title-primary">System Roles</h4>
                  <button className="ra-add-btn" aria-label="Add role">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <div className="ra-role-list">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      className={`ra-role-item ${
                        activeRole === role.id ? 'ra-role-active' : ''
                      }`}
                      onClick={() => setActiveRole(role.id)}
                    >
                      <span className="material-symbols-outlined">{role.icon}</span>
                      <span className="ra-role-text">
                        <span className="ra-role-name">{role.name}</span>
                        <span className="ra-role-desc">{role.desc}</span>
                      </span>
                      <span className="material-symbols-outlined ra-role-chevron">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ra-card">
                <h4 className="ra-card-title">Role Distribution</h4>
                <div className="ra-distribution">
                  {distribution.map((d) => (
                    <div key={d.label}>
                      <div className="ra-dist-row">
                        <span>{d.label}</span>
                        <span className="ra-dist-value">{d.value}</span>
                      </div>
                      <div className="ra-bar-track">
                        <div
                          className={`ra-bar ${d.barClass}`}
                          style={{ width: `${d.width}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ra-matrix-col">
              <div className="ra-card ra-matrix-card">
                <div className="ra-matrix-header">
                  <div>
                    <h4 className="ra-matrix-title">Permissions Matrix</h4>
                    <p className="ra-matrix-subtitle">
                      Configure capabilities for the{' '}
                      <span className="ra-matrix-accent">
                        {roles.find((r) => r.id === activeRole)?.name}
                      </span>{' '}
                      role.
                    </p>
                  </div>
                  <div className="ra-matrix-actions">
                    <button
                      className="ra-btn-outline"
                      onClick={resetDefaults}
                    >
                      Reset Defaults
                    </button>
                    <button className="ra-btn-primary" onClick={saveChanges}>
                      Save Changes
                    </button>
                  </div>
                </div>
                <div className="ra-table-wrap">
                  <table className="ra-table">
                    <thead>
                      <tr>
                        <th>Capability</th>
                        <th className="th-center">Access</th>
                        <th className="th-center">Approval Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSections.map((section, si) => (
                        <Fragment key={section.name}>
                          <tr className="ra-section-row">
                            <td colSpan={3}>{section.name}</td>
                          </tr>
                          {section.perms.map((perm, pi) => (
                            <tr key={perm.id} className="ra-perm-row">
                              <td>
                                <p className="ra-perm-name">{perm.name}</p>
                                <p className="ra-perm-desc">{perm.desc}</p>
                              </td>
                              <td className="th-center">
                                <input
                                  type="checkbox"
                                  className="ra-checkbox"
                                  checked={perm.access}
                                  onChange={() => toggle(si, pi, 'access')}
                                />
                              </td>
                              <td className="th-center">
                                <input
                                  type="checkbox"
                                  className="ra-checkbox"
                                  checked={perm.approval}
                                  disabled={perm.approvalDisabled}
                                  onChange={() => toggle(si, pi, 'approval')}
                                />
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ra-matrix-footer">
                  <span>Last modified by: Michael Smith (2 hours ago)</span>
                  <div className="ra-matrix-info">
                    <span className="material-symbols-outlined">info</span>
                    <span>Changes affect 12 users immediately</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="ra-card ra-audit-card">
            <div className="ra-audit-header">
              <span className="material-symbols-outlined">history</span>
              <h4 className="ra-matrix-title">Audit Log</h4>
            </div>
            <div className="ra-audit-list">
              {auditEntries.map((entry) => (
                <div key={entry.id} className="ra-audit-item">
                  <div className={`ra-audit-icon ${entry.iconClass}`}>
                    <span className="material-symbols-outlined">{entry.icon}</span>
                  </div>
                  <div className="ra-audit-body">
                    <p className="ra-audit-text">{entry.text}</p>
                    <p className="ra-audit-meta">{entry.meta}</p>
                  </div>
                  <button className="ra-audit-details">Details</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <button className="ra-fab" aria-label="Create New Role">
        <span className="material-symbols-outlined">add</span>
        <span className="ra-fab-tooltip">Create New Role</span>
      </button>

      {toast && (
        <div className="action-toast">
          <span className="material-symbols-outlined">check_circle</span>
          <p>{toast}</p>
        </div>
      )}
    </>
  )
}

export default RoleAccess
