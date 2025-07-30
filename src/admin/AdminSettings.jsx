import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminSettings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    nom_complet: 'admin',
    matricule: '',
    email: '',
    telephone: '',
    situation_familiale: '',
    nombre_enfants_beneficiaires: '',
    mot_de_passe: '',
    role: '',
    date_affectation_au_bureau: ''
  })

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin')
        const admin = await res.json()


        if (admin) {
          setForm({
  nom_complet: admin.nom_complet,
  matricule: admin.matricule,
  email: admin.email || '',
  telephone: admin.telephone || '',
  situation_familiale: admin.situation_familiale || '',
  nombre_enfants_beneficiaires: admin.nombre_enfants_beneficiaires || '',
  mot_de_passe: admin.mot_de_passe || '',
  role: admin.role || '',
  date_affectation_au_bureau: admin.date_affectation_au_bureau || ''
})

        } else {
          alert("Admin introuvable.")
        }
      } catch (error) {
        console.error("Erreur récupération admin:", error)
        alert("Erreur de connexion au serveur.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdmin()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/api/admin', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});


      if (!response.ok) throw new Error("Erreur lors de la mise à jour")

      alert('Compte administrateur mis à jour')
    } catch (error) {
      console.error("Erreur:", error)
      alert('Échec de la mise à jour')
    }
  }

  const handleRetour = () => {
    navigate('/admin')
  }

  if (loading) return <p style={{ textAlign: 'center' }}>Chargement...</p>

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap');

        body {
          font-family: 'Urbanist', sans-serif;
          background: linear-gradient(135deg, #dbe9f4, #e1e8ea);
          margin: 0;
          padding: 0;
        }

        .admin-settings-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
          position: relative;
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

        .retour-btn {
          background-color: #607d8b;
          color: white;
          padding: 10px 24px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.3s ease;
          margin-bottom: 20px;
        }

        .retour-btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        h2 {
          color: #0b2545;
          margin-bottom: 16px;
          text-align: center;
          font-size: 2rem;
        }

        p {
          text-align: center;
          color: #444;
          margin-bottom: 30px;
        }

        form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 8px rgba(0, 122, 204, 0.4);
          transform: scale(1.03);
        }

        .form-actions {
          grid-column: span 2;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .form-actions button {
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .form-actions button:hover {
          transform: translateY(-3px) scale(1.05);
        }

        .form-actions button:active {
          transform: scale(0.98);
        }

        .btn-save {
          background-color: #007acc;
          color: white;
        }

        .btn-retour {
          background-color: #607d8b;
          color: white;
        }

        @media (max-width: 600px) {
          .form-actions {
            flex-direction: column;
          }
        }
          select {
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  appearance: none; /* removes default arrow for some browsers */
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
}

select:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(0, 122, 204, 0.5);
  transform: scale(1.03);
}
      `}</style>

       <div className="admin-settings-container">
      <h2>Compte Administrateur</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Nom complet</label>
          <input name="nom_complet" value={form.nom_complet} disabled />
        </div>

        <div className="form-group">
          <label>Matricule</label>
          <input name="matricule" value={form.matricule} disabled />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} />
        </div>


        <div className="form-group">
          <label>Nombre d’enfants bénéficiaires</label>
          <input name="nombre_enfants_beneficiaires" type="number" value={form.nombre_enfants_beneficiaires} onChange={handleChange} />
        </div>

       

       <div className="form-group">
  <label htmlFor="role">Rôle</label>
  <select
    id="role"
    name="role"
    value={form.role}
    onChange={handleChange}
  >
    <option value="">-- Sélectionner un rôle --</option>
    <option value="Exécution">Exécution</option>
    <option value="Supervision">Supervision</option>
    <option value="Cadres">Cadres</option>
    <option value="Cadres Supérieurs">Cadres Supérieurs</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="situationFamiliale">Situation familiale</label>
  <select
    id="situationFamiliale"
    name="situation_familiale"
    value={form.situation_familiale}
    onChange={handleChange}
  >
    <option value="">-- Sélectionner une situation --</option>
    <option value="Célibataire">Célibataire</option>
    <option value="Marié(e)">Marié(e)</option>
    <option value="Divorcé(e)">Divorcé(e)</option>
    <option value="Veuf(ve)">Veuf(ve)</option>
    <option value="Pacsé(e)">Pacsé(e)</option>
    <option value="En concubinage">En concubinage</option>
    <option value="Séparé(e)">Séparé(e)</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="mot_de_passe">Mot de passe</label>
  <input
    type="text" // You can change this to "password" if you want it hidden
    id="mot_de_passe"
    name="mot_de_passe"
    value={form.mot_de_passe}
    onChange={handleChange}
    placeholder="Entrer le mot de passe"
  />
</div>


        <div className="form-group">
          <label>Date d'affectation au bureau</label>
          <input name="date_affectation_au_bureau" type="date" value={form.date_affectation_au_bureau?.split('T')[0] || ''} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button className="btn-save" type="submit">Enregistrer</button>
          <button className="btn-retour" type="button" onClick={handleRetour}>Retour</button>
        </div>

      </form>
    </div>
    </>
  )
}