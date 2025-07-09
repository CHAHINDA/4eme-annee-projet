import { useLocation } from 'react-router-dom'

export default function DemandeCentreVacances() {
  const location = useLocation()
  const state = location.state || {}

  const { type, month } = state

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Demande Centre de Vacances</h1>

      {type === 'normal' && (
        <div>
          <h2>Type: Demande normale</h2>
          <p>Vous avez choisi de faire une demande à n'importe quel moment.</p>
        </div>
      )}

      {type === 'campagne' && month && (
        <div>
          <h2>Type: Demande campagne</h2>
          <p>Mois sélectionné : <strong>{month.charAt(0).toUpperCase() + month.slice(1)}</strong></p>
        </div>
      )}

      {!type && (
        <div>
          <p style={{ color: 'gray' }}>Aucune information de demande reçue.</p>
        </div>
      )}
    </div>
  )
}
