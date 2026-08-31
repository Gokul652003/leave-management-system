import { useState } from 'react'
import Sidebar, { type View } from './components/Sidebar'
import Dashboard from './screens/Dashboard'
import ApplyLeave from './screens/ApplyLeave'
import Approvals from './screens/Approvals'
import RequestDetail from './screens/RequestDetail'
import MyRequests from './screens/MyRequests'
import Employees from './screens/Employees'
import EmployeeProfile from './screens/EmployeeProfile'
import OrgChart from './screens/OrgChart'
import RoleAccess from './screens/RoleAccess'
import LeavePolicies from './screens/LeavePolicies'
import Login from './screens/Login'
import { useAuth } from './auth/useAuth'
import './App.css'

function App() {
  const { session, loading } = useAuth()
  const [view, setView] = useState<View>('dashboard')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedRequestId, setSelectedRequestId] = useState('')

  const activeNav: View =
    view === 'approval-detail'
      ? 'approvals'
      : view === 'employee-profile' || view === 'org-chart'
        ? 'employees'
        : view

  if (loading) return null
  if (!session) return <Login />

  const openEmployeeProfile = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    setView('employee-profile')
  }

  const openRequestDetail = (requestId: string) => {
    setSelectedRequestId(requestId)
    setView('approval-detail')
  }

  return (
    <>
      <Sidebar active={activeNav} onNavigate={setView} />
      {view === 'dashboard' && <Dashboard onApply={() => setView('apply-leave')} />}
      {view === 'apply-leave' && <ApplyLeave onDone={() => setView('dashboard')} />}
      {view === 'my-requests' && <MyRequests />}
      {view === 'approvals' && (
        <Approvals
          onApply={() => setView('apply-leave')}
          onViewDetail={openRequestDetail}
        />
      )}
      {view === 'approval-detail' && (
        <RequestDetail
          requestId={selectedRequestId}
          onBack={() => setView('approvals')}
          onApply={() => setView('apply-leave')}
        />
      )}
      {view === 'employees' && (
        <Employees
          onViewProfile={openEmployeeProfile}
          onOpenOrgChart={() => setView('org-chart')}
        />
      )}
      {view === 'employee-profile' && (
        <EmployeeProfile
          employeeId={selectedEmployeeId}
          onBack={() => setView('employees')}
        />
      )}
      {view === 'org-chart' && <OrgChart onBack={() => setView('employees')} />}
      {view === 'roles-access' && <RoleAccess onApply={() => setView('apply-leave')} />}
      {view === 'settings' && <LeavePolicies onApply={() => setView('apply-leave')} />}
    </>
  )
}

export default App
