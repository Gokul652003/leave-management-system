import { useState } from 'react'
import Sidebar, { type View } from './components/Sidebar'
import Dashboard from './screens/Dashboard'
import ApplyLeave from './screens/ApplyLeave'
import Approvals from './screens/Approvals'
import RequestDetail from './screens/RequestDetail'
import MyRequests from './screens/MyRequests'
import Employees from './screens/Employees'
import RoleAccess from './screens/RoleAccess'
import LeavePolicies from './screens/LeavePolicies'
import './App.css'

function App() {
  const [view, setView] = useState<View>('dashboard')

  const activeNav: View =
    view === 'approval-detail' ? 'approvals' : view

  return (
    <>
      <Sidebar active={activeNav} onNavigate={setView} />
      {view === 'dashboard' && <Dashboard onApply={() => setView('apply-leave')} />}
      {view === 'apply-leave' && <ApplyLeave onDone={() => setView('dashboard')} />}
      {view === 'my-requests' && <MyRequests />}
      {view === 'approvals' && (
        <Approvals
          onApply={() => setView('apply-leave')}
          onViewDetail={() => setView('approval-detail')}
        />
      )}
      {view === 'approval-detail' && (
        <RequestDetail
          onBack={() => setView('approvals')}
          onApply={() => setView('apply-leave')}
        />
      )}
      {view === 'employees' && <Employees />}
      {view === 'roles-access' && <RoleAccess onApply={() => setView('apply-leave')} />}
      {view === 'settings' && <LeavePolicies onApply={() => setView('apply-leave')} />}
    </>
  )
}

export default App
