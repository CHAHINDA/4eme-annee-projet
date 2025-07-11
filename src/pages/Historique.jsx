import { useNavigate } from 'react-router-dom'

export default function Historique() {
  const navigate = useNavigate()

  const handlePrint = (demande) => {
    // For now just alert, later replace with real print logic
    alert(`Impression de la demande: ${demande.type} du ${demande.date}`)
  }

  // Empty array for now, no demandes
  const demandes = []

  return (
    <>
      <style>{`
        .container {
          max-width: 900px;
          margin: 30px auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .return-btn {
          background: #007acc;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background 0.3s ease;
        }
        .return-btn:hover {
          background: #005fa3;
        }
        h1 {
          color: #005fa3;
          margin-bottom: 20px;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        thead tr {
          background-color: #007acc;
          color: white;
          text-align: left;
        }
        th, td {
          padding: 12px 15px;
          border: 1.5px solid #007acc;
        }
        tbody tr:nth-child(even) {
          background-color: #f3f9ff;
        }
        .print-btn {
          background: #28a745;
          border: none;
          padding: 6px 12px;
          color: white;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.3s ease;
        }
        .print-btn:hover {
          background: #1e7e34;
        }
        .print-icon {
          font-size: 1.1rem;
        }
        .empty-msg {
          text-align: center;
          color: #888;
          margin-top: 40px;
          font-size: 1.1rem;
          font-style: italic;
        }
      `}</style>

      <div className="container">
        <button className="return-btn" onClick={() => navigate('/home')}>
          ← Retour à l'accueil
        </button>

        <h1>Historique des demandes</h1>

        {demandes.length === 0 ? (
          <p className="empty-msg">Aucune demande trouvée.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Demande</th>
                <th>Date</th>
                <th>Imprimer</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(demande => (
                <tr key={demande.id}>
                  <td>{demande.type}</td>
                  <td>{new Date(demande.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button
                      className="print-btn"
                      onClick={() => handlePrint(demande)}
                      aria-label={`Imprimer la demande ${demande.type}`}
                    >
                      🖨️ Imprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
