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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        html, body, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #f0f4ff, #eaf0fb);
          background-size: 400% 400%;
          animation: bgMotion 20s ease infinite;
        }

        @keyframes bgMotion {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
          border-radius: 24px;
          padding: 40px 30px;
          max-width: 460px;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
          animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #dceeff;
          margin-bottom: 25px;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .welcome {
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          font-weight: 700;
          color: #1a2b4c;
          margin-bottom: 24px;
        }

        .btn {
          width: 100%;
          background: linear-gradient(135deg, #009fff, #0061ff);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          box-shadow: 0 6px 12px rgba(0, 97, 255, 0.2);
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 97, 255, 0.35);
        }

        .helper-text {
          font-size: 0.85rem;
          color: #67748e;
          margin-bottom: 18px;
        }

        .month-list {
          margin-top: 16px;
          margin-bottom: 24px; 
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .month-btn {
          flex: 1 1 45%;
          background: #f0f6ff;
          border: 1px solid #c3dbff;
          color: #0061ff;
          padding: 10px 0;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .month-btn:hover {
          background: #d8eaff;
        }

        .logout {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: 1px solid #ccc;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .logout:hover {
          background: #ff4d4f;
          color: white;
          border-color: #ff4d4f;
        }

        @media (max-width: 480px) {
          .card {
            padding: 28px 20px;
          }

          .btn {
            font-size: 0.95rem;
            padding: 14px;
          }

          .month-btn {
            flex: 1 1 100%;
          }

          .logo {
            width: 110px;
            height: 110px;
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

          <button className="btn" onClick={() => navigate('/historique')}>
            Historique des demandes
          </button>
          <div className="helper-text">Consultez et imprimez vos anciennes demandes.</div>
        </div>
      </div>
    </>
  )
}
