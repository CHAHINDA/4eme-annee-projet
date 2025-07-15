import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import DemandeCentreVacances from './pages/DemandeCentreVacances'
import Reglement from './pages/Reglement'
import Historique from './pages/Historique'
import AdminDashboard from './admin/Admin'
import UserManagement from './admin/UserManagement'       // Add user (ajouter)
import UserList from './admin/UserList'                   // List users
import DemandeSejour from './admin/DemandeSejour'         // Demande des séjours reçues
import AffectationHistorique from './admin/AffectationHistorique' // État d'historique d'affectation
import BeneficiairesList from './admin/BeneficiairesList' // Liste des bénéficiaires
import AdminSettings from './admin/AdminSettings'         // Paramètre compte admin

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

        {/* User management */}
        <Route path="/admin/users/add" element={<UserManagement />} /> {/* Ajouter utilisateur */}
        <Route path="/admin/users/list" element={<UserList />} />      {/* Liste utilisateurs */}

        {/* Gestion des demandes */}
        <Route path="/admin/demandes/sejour" element={<DemandeSejour />} />
        <Route path="/admin/demandes/historique" element={<AffectationHistorique />} />
        <Route path="/admin/demandes/beneficiaires" element={<BeneficiairesList />} />

        {/* Paramètre */}
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </div>
  )
}

export default App
