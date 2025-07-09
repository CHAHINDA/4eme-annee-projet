import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/marsa-port.jpg'

export default function HomePage({ username = 'Utilisateur', onLogout }) {
  const [showMonths, setShowMonths] = useState(false)
  const navigate = useNavigate()

  const months = [
    { key: 'octobre', label: 'Octobre' },
    { key: 'decembre', label: 'Décembre' },
    { key: 'fevrier', label: 'Février' },
    { key: 'avril', label: 'Avril' },
    { key: 'ete', label: 'Été' },
  ]

  const handleNormalClick = () => {
    setShowMonths(false)
    navigate('/demande', { state: { type: 'normal' } })
  }

  const handleCompagneClick = () => {
    setShowMonths(prev => !prev)
  }

  const handleMonthSelect = (monthKey) => {
    navigate('/demande', { state: { type: 'campagne', month: monthKey } })
  }

  const handleLogout = () => {
    if (onLogout) onLogout()
    navigate('/')
  }

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f7f9fc;
        }

        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 30px 24px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          position: relative;
        }

        .logo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e0f0ff;
          margin-bottom: 20px;
        }

        .welcome {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }

        .btn {
          width: 100%;
          background-color: #007acc;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 6px;
          transition: background 0.3s ease;
        }

        .btn:hover {
          background-color: #005fa3;
        }

        .helper-text {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 16px;
          user-select: none;
        }

        .month-list {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .month-btn {
          flex: 1 1 45%;
          background: #eef6ff;
          border: 1px solid #b0d9ff;
          color: #007acc;
          padding: 10px 0;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .month-btn:hover {
          background: #d5ecff;
        }

        .logout {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: 1px solid #ccc;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout:hover {
          background: #ff4444;
          color: white;
          border-color: #ff4444;
        }

        @media (max-width: 480px) {
          .card {
            padding: 24px 18px;
          }
          .btn {
            font-size: 0.95rem;
            padding: 12px;
          }
          .month-btn {
            flex: 1 1 100%;
          }
        }
      `}</style>

      <div className="container">
        <button className="logout" onClick={handleLogout}>Déconnexion</button>
        <div className="card">
          <img src={logo} alt="Logo" className="logo" />
          <div className="welcome">Bienvenue, {username}</div>

          <button className="btn" onClick={handleNormalClick}>
            Demande Normal
          </button>
          <div className="helper-text">Pour faire une demande à n'importe quel moment.</div>

          <button className="btn" onClick={handleCompagneClick}>
            {showMonths ? 'Fermer les mois' : 'Demande Campagne'}
          </button>
          <div className="helper-text">Pour les périodes de vacances scolaires.</div>

          {showMonths && (
            <div className="month-list">
              {months.map(({ key, label }) => (
                <button
                  key={key}
                  className="month-btn"
                  onClick={() => handleMonthSelect(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
