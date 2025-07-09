// App.jsx
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import DemandeCentreVacances from './pages/DemandeCentreVacances'
import Reglement from './pages/Reglement'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/demande" element={<DemandeCentreVacances />} />
        <Route path="/reglement" element={<Reglement />} />
      </Routes>
    </div>
  )
}

export default App
