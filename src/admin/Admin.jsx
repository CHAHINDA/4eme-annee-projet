import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/marsa-port.jpg'

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
    // Here you can clear auth tokens or session if needed
    navigate('/')
  }
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
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
        }

        .sidebar {
          width: 250px;
          background: #007acc;
          color: white;
          padding: 20px;
          transition: width 0.4s ease;
          box-shadow: 4px 0 10px rgba(0,0,0,0.2);
          position: relative;
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

        .main-content {
          flex-grow: 1;
          padding: 20px;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 10px 20px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          margin-bottom: 30px;
          transform: perspective(1000px) rotateX(1deg);
        }

        .time-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 16px 20px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          color: #0b2545;
          text-align: center;
          min-width: 160px;
          font-family: 'Segoe UI', sans-serif;
          border: 1px solid #cbe4ff;
          font-size: 0.95rem;
        }

        .time-card .day {
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 4px;
          color: #004e92;
          text-transform: capitalize;
        }

        .time-card .time {
          font-size: 1.4rem;
          font-weight: bold;
          color: #023047;
          margin-bottom: 2px;
        }

        .time-card .date {
          font-size: 1rem;
          color: #007acc;
        }

        .logo {
          width: 120px;
          height: 120px;
          object-fit: contain;
          border-radius: 50%;
          border: 2px solid #007acc;
          background: #fff;
        }

        .logout-btn {
          background: #ff4444;
          border: none;
          color: white;
          padding: 12px 20px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
          font-size: 0.80rem;
        }

        .logout-btn:hover {
          background: #cc0000;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 20px;
          }
          .logo {
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span className={`arrow-icon ${!sidebarOpen ? 'closed' : ''}`}>
              ➤
            </span>
          </button>

          {sidebarOpen && (
            <div style={{ marginTop: '60px' }}>
              <p>Tableau de bord</p>
              <p style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>
  👥 Gestion des comptes d'utilisateur
</p>

              <p>Interventions</p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="main-content">
          <div className="header">
            <div className="time-card">
              <div className="day">{getDayName(currentTime)}</div>
              <div className="time">{getFormattedTime(currentTime)}</div>
              <div className="date">{getFormattedDate(currentTime)}</div>
            </div>

            <img src={logo} className="logo" alt="Marsa Maroc" />

            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>

          {/* Add content below */}
        </div>
      </div>
    </>
  )
}
