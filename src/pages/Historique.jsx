import { useNavigate } from 'react-router-dom'

export default function Historique() {
  const navigate = useNavigate()

  const demandes = [] // your data here

  const handleVoirPlus = (demandeId = null) => {
    if (demandeId) {
      navigate(`/demande/${demandeId}`)
    } else {
      alert('Aucune demande à afficher.')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        * {
          box-sizing: border-box;
        }

        body, html, #root {
          height: 100%;
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: #f5f7fa;
          color: #1e293b;
        }

        .container {
          max-width: 960px;
          margin: 3rem auto;
          padding: 1.5rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 16px 40px rgb(0 0 128 / 0.1);
          transition: box-shadow 0.3s ease;
        }
        .container:hover {
          box-shadow: 0 20px 60px rgb(0 0 180 / 0.15);
        }

        .return-btn {
          background: #2563eb; /* blue-600 */
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          box-shadow: 0 6px 12px rgb(37 99 235 / 0.4);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 2rem;
        }
        .return-btn:hover {
          background: #1e40af; /* blue-800 */
          box-shadow: 0 10px 20px rgb(30 64 175 / 0.6);
        }

        h1 {
          text-align: center;
          font-weight: 700;
          font-size: 2.25rem;
          margin-bottom: 2.5rem;
          color: #334155;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.75rem;
        }

        thead tr {
          background: transparent;
        }

        thead th {
          text-align: left;
          font-weight: 600;
          font-size: 1.1rem;
          padding-left: 1rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          user-select: none;
        }

        tbody tr {
          background: #f9fafb;
          box-shadow: 0 1px 3px rgb(0 0 128 / 0.1);
          border-radius: 12px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        tbody tr:hover {
          background: #dbeafe; /* blue-100 */
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgb(37 99 235 / 0.3);
        }

        td {
          padding: 1rem;
          vertical-align: middle;
          font-size: 1rem;
          color: #334155;
        }
        td:first-child {
          padding-left: 1.5rem;
          font-weight: 600;
        }

        .no-data {
          text-align: center;
          font-style: italic;
          color: #94a3b8;
          padding: 2rem 0;
          font-size: 1.1rem;
        }

        .voir-plus-btn {
          background: linear-gradient(135deg, #3b82f6, #60a5fa); /* blue-500 to blue-400 */
          border: none;
          color: white;
          padding: 0.55rem 1.4rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgb(59 130 246 / 0.6);
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .voir-plus-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 18px rgb(59 130 246 / 0.8);
        }
      `}</style>

      <div className="container" role="main">
        <button className="return-btn" onClick={() => navigate('/home')}>
          ← Retour à l'accueil
        </button>

        <h1>Historique des demandes</h1>

        <table aria-label="Historique des demandes">
          <thead>
            <tr>
              <th scope="col">Demande</th>
              <th scope="col">Date</th>
              <th scope="col">Détails</th>
            </tr>
          </thead>
          <tbody>
            {demandes.length === 0 ? (
              <tr>
                <td className="no-data" colSpan="2">
                  Aucune demande trouvée
                </td>
                <td>
                  <button
                    className="voir-plus-btn"
                    onClick={() => alert('Aucune demande à afficher')}
                    aria-label="Voir plus, aucune demande disponible"
                  >
                    Voir plus
                  </button>
                </td>
              </tr>
            ) : (
              demandes.map((demande) => (
                <tr key={demande.id} tabIndex={0}>
                  <td>{demande.type}</td>
                  <td>{new Date(demande.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button
                      className="voir-plus-btn"
                      onClick={() => navigate(`/demande/${demande.id}`)}
                      aria-label={`Voir plus sur la demande ${demande.type}`}
                    >
                      Voir plus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
