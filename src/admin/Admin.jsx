import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/marsa-port.jpg'

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(() => {
  const saved = localStorage.getItem('sidebarOpen')
  return saved !== null ? JSON.parse(saved) : true
})
useEffect(() => {
  localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
}, [sidebarOpen])

  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getDayName = (date) =>
    date.toLocaleDateString('fr-FR', { weekday: 'long' })

  const getFormattedDate = (date) =>
    date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  const getFormattedTime = (date) =>
    date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        body {
          margin: 0;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #e0f7fa, #e3f2fd);
          animation: gradientFlow 10s ease infinite;
          background-size: 400% 400%;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          color: #0b2545;
        }

        /* Sidebar styles */
        .sidebar {
          width: 280px;
          background: #007acc;
          color: white;
          padding: 30px 20px 40px;
          box-shadow: 4px 0 15px rgba(0,0,0,0.25);
          transition: width 0.4s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          font-weight: 600;
          user-select: none;
        }

        .sidebar.closed {
          width: 30px;
         
        }

           .sidebar-toggle {
          position: absolute;
          top: 20px;
          right: -15px;
          background: #005fa3;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, background 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .sidebar-toggle:hover {
          background: #00457a;
        }

        .arrow-icon {
          display: inline-block;
          font-size: 1.5rem;
          transition: transform 0.3s ease;
          transform: scale(1.4);
        }

        .arrow-icon.closed {
          transform: rotate(180deg) scale(1.4);
        }

        .sidebar h3.section-title {
          margin-top: 20px;
          margin-bottom: 12px;
          font-size: 1.1rem;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255 255 255 / 0.4);
          padding-bottom: 8px;
          font-weight: 700;
          cursor: default;
          user-select: none;
          transition: opacity 0.3s ease;
        }

        /* Hide section titles when sidebar is closed */
        .sidebar.closed h3.section-title {
          opacity: 0;
          height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .sidebar ul.menu-list {
          list-style: none;
          padding: 0;
          margin: 0 0 10px 0;
        }

        .sidebar ul.menu-list li {
          margin-bottom: 14px;
        }

        .sidebar ul.menu-list li button {
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease, transform 0.2s ease;
          perspective: 600px;
          transform-style: preserve-3d;
          justify-content: flex-start;
        }

        .sidebar ul.menu-list li button:hover {
          background: rgba(255 255 255 / 0.15);
          transform: translateZ(10px) scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .sidebar ul.menu-list li button:active {
          transform: translateZ(0) scale(0.98);
          box-shadow: none;
        }

        .sidebar ul.menu-list li button .icon {
          font-size: 1.3rem;
          transition: transform 0.3s ease;
          min-width: 24px; /* keep icon space consistent */
          text-align: center;
        }

        .sidebar ul.menu-list li button:hover .icon {
          transform: rotateY(15deg) translateZ(5px);
        }

        /* Collapsed sidebar text hidden */
        .sidebar.closed ul.menu-list li button span.text {
          display: none;
        }

        /* When sidebar closed, center icons and fix button width */
        .sidebar.closed ul.menu-list li button {
          justify-content: center;
          padding-left: 0;
          padding-right: 0;
          width: 40px; /* enough for icons */
        }

        /* Slightly larger icons when collapsed */
        .sidebar.closed ul.menu-list li button .icon {
          font-size: 1.6rem;
        }

        /* Main content styles */
        .main-content {
          flex-grow: 1;
          padding: 30px 40px;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          background: #f0f8ff;
          box-shadow: inset 0 0 15px #d1e7ff88;
          border-radius: 20px 0 0 20px;
          margin-left: -4px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 12px 30px;
          border-radius: 20px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          margin-bottom: 40px;
          transform: perspective(1200px) rotateX(1deg);
          color: #004e92;
          font-weight: 700;
          font-size: 1.15rem;
          user-select: none;
        }

        .time-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          color: #0b2545;
          text-align: center;
          min-width: 180px;
          font-family: 'Segoe UI', sans-serif;
          border: 1px solid #cbe4ff;
          font-size: 1rem;
          user-select: none;
        }

        .time-card .day {
          font-weight: 600;
          font-size: 1.3rem;
          margin-bottom: 6px;
          color: #004e92;
          text-transform: capitalize;
        }

        .time-card .time {
          font-size: 1.8rem;
          font-weight: 900;
          color: #023047;
          margin-bottom: 4px;
          letter-spacing: 2px;
        }

        .time-card .date {
          font-size: 1.1rem;
          color: #007acc;
        }

        .logo {
          width: 120px;
          height: 120px;
          object-fit: contain;
          border-radius: 50%;
          border: 2px solid #007acc;
          background: #fff;
          user-select: none;
        }

        .logout-btn {
          background: #ff4444;
          border: none;
          color: white;
          padding: 14px 28px;
          font-weight: 700;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          font-size: 0.95rem;
          user-select: none;
        }

        .logout-btn:hover {
          background: #cc0000;
          transform: scale(1.05);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            z-index: 9999;
            height: 100vh;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar.closed {
            width: 280px !important;
            transform: translateX(0) !important;
          }

          .main-content {
            padding: 20px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? '' : 'closed'}`} aria-label="Sidebar navigation">
  <button
    className="sidebar-toggle"
    onClick={() => setSidebarOpen(!sidebarOpen)}
    aria-label={sidebarOpen ? "Fermer la barre latérale" : "Ouvrir la barre latérale"}
    title={sidebarOpen ? "Fermer" : "Ouvrir"}
  >
    <span className={`arrow-icon ${sidebarOpen ? '' : 'closed'}`}>➤</span>
  </button>

  {/* Sidebar open: show full text */}
  {sidebarOpen && (
    <>
      <h3 className="section-title">Utilisateurs</h3>
      <ul className="menu-list">
        <li>
          <button onClick={() => navigate('/admin/users/add')}>
            <span className="icon">➕</span>
            <span className="text">Ajouter un utilisateur</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/admin/users/list')}>
            <span className="icon">📋</span>
            <span className="text">Liste des utilisateurs</span>
          </button>
        </li>
      </ul>

      <h3 className="section-title">Demandes</h3>
      <ul className="menu-list">
        <li>
          <button onClick={() => navigate('/admin/demandes/sejour')}>
            <span className="icon">📥</span>
            <span className="text">Demandes de séjour reçues</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/admin/demandes/historique')}>
            <span className="icon">📊</span>
            <span className="text">Historique des affectations</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/admin/demandes/beneficiaires')}>
            <span className="icon">🤝</span>
            <span className="text">Liste des bénéficiaires</span>
          </button>
        </li>
      </ul>

      <h3 className="section-title">Paramètres</h3>
      <ul className="menu-list">
        <li>
          <button onClick={() => navigate('/admin/settings')}>
            <span className="icon">⚙️</span>
            <span className="text">Parametre</span>
          </button>
        </li>
      </ul>
    </>
  )}

  {/* Sidebar closed: show icons only, with aria-label for accessibility */}
  {!sidebarOpen && (
    <ul className="menu-list" style={{ marginTop: '60px' }}>
      <li>
        <button onClick={() => navigate('/admin/users/add')} aria-label="Ajouter un utilisateur">
          <span className="icon">➕</span>
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/admin/users/list')} aria-label="Liste des utilisateurs">
          <span className="icon">📋</span>
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/admin/demandes/sejour')} aria-label="Demandes de séjour reçues">
          <span className="icon">📥</span>
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/admin/demandes/historique')} aria-label="Historique des affectations">
          <span className="icon">📊</span>
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/admin/demandes/beneficiaires')} aria-label="Liste des bénéficiaires">
          <span className="icon">🤝</span>
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/admin/settings')} aria-label="Compte administrateur">
          <span className="icon">⚙️</span>
        </button>
      </li>
    </ul>
  )}
</nav>

        {/* Main content */}
        <main className="main-content" role="main">
          <header className="header">
            <div className="time-card" aria-live="polite">
              <div className="day">{getDayName(currentTime)}</div>
              <div className="time">{getFormattedTime(currentTime)}</div>
              <div className="date">{getFormattedDate(currentTime)}</div>
            </div>

            <img src={logo} className="logo" alt="Marsa Maroc logo" />

            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </header>

          {/* You can add your dashboard content here */}
          <section>
            <h2>Bienvenue sur le tableau de bord</h2>
            <p>Sélectionnez une option dans le menu latéral pour commencer.</p>
          </section>
        </main>
      </div>
    </>
  )
}
