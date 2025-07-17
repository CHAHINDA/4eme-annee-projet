import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AffectationHistorique() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('fr-FR')

  const handleRetour = () => {
    navigate('/admin')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap');

        body {
          font-family: 'Urbanist', sans-serif;
          background: linear-gradient(135deg, #e3f2fd, #fce4ec);
          margin: 0;
          padding: 0;
        }

        .page-wrapper {
          max-width: 1100px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .button-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .btn {
          padding: 10px 24px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: white;
          background-color: #607d8b;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, background 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        .container {
          padding: 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
          position: relative;
          color: #0b2545;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(40px) rotateX(5deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        h1 {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        h2 {
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 24px;
        }

        hr {
          border-top: 2px solid #000;
          margin: 12px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255,255,255,0.8);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        thead tr {
          background-color: #007acc;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
        }

        td, th {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: center;
          font-size: 0.95rem;
        }

        tbody tr:nth-child(even) {
          background-color: #f0f7ff;
        }

        .footer-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          font-size: 0.9rem;
          color: #555;
          font-weight: 600;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="button-row">
          <button className="btn" onClick={handleRetour}>← Retour</button>
        </div>

        <div className="container">
          <hr />
          <h1>ETAT D'HISTORIQUE D'AFFECTATION</h1>
          <h2>Port : DEPL</h2>
          <hr />

          <table>
            <thead>
              <tr>
                <th>Mat</th>
                <th>Nom</th>
                <th>Situation</th>
                <th>Nbr. Enfant</th>
                <th>An. Recrut.</th>
                <th>A20</th>
                <th>A21</th>
                <th>A22</th>
                <th>A24</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="10" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                  Table vide
                </td>
              </tr>
            </tbody>
          </table>

          <div className="footer-bar">
            <span>Date d'aujourd'hui : {today}</span>
            <span>Page 1</span>
          </div>
        </div>
      </div>
    </>
  )
}
