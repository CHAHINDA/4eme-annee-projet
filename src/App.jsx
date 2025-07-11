// App.jsx
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import DemandeCentreVacances from './pages/DemandeCentreVacances'
import Reglement from './pages/Reglement'
import Historique from './pages/Historique' 
import AdminDashboard from './admin/Admin' 
import UserManagement from './admin/UserManagement'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/demande" element={<DemandeCentreVacances />} />
        <Route path="/reglement" element={<Reglement />} />
        <Route path="/historique" element={<Historique />} /> 
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </div>
  )
}

export default App
