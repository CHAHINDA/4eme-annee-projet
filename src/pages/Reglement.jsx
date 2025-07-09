import { useNavigate } from 'react-router-dom'

export default function Reglement() {
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <h1>Règlement</h1>
      <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-red-500 text-white">
        Retour au Login
      </button>
    </div>
  )
}
