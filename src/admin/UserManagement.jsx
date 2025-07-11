import { useState } from 'react'

export default function UserManagement() {
  const [form, setForm] = useState({
    nom: '',
    matricule: '',
    dateAffectation: '',
    execution: '',
    encadrement: '',
    cadres: '',
    cadresSuperieurs: '',
    situationFamiliale: '',
    nombreEnfants: '',
    telephone: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Utilisateur enregistré')
  }

  const handleSubmitAndReset = (e) => {
    e.preventDefault()
    alert('Utilisateur enregistré, vous pouvez en ajouter un autre.')
    setForm({
      nom: '',
      matricule: '',
      dateAffectation: '',
      execution: '',
      encadrement: '',
      cadres: '',
      cadresSuperieurs: '',
      situationFamiliale: '',
      nombreEnfants: '',
      telephone: '',
      email: '',
      password: '',
    })
  }

  return (
    <>
      <style>{`
        .user-form-container {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', sans-serif;
        }

        .user-form-container h2 {
          margin-bottom: 24px;
          color: #007acc;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #333;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .form-buttons {
          margin-top: 30px;
          display: flex;
          gap: 16px;
          justify-content: flex-end;
        }

        .form-buttons button {
          padding: 10px 20px;
          font-weight: bold;
          background-color: #007acc;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .form-buttons button:hover {
          background-color: #005fa3;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="user-form-container">
        <h2>Créer un nouveau compte utilisateur</h2>
        <form>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom complet</label>
              <input name="nom" value={form.nom} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Matricule</label>
              <input name="matricule" value={form.matricule} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Date d’affectation au bureau</label>
              <input type="date" name="dateAffectation" value={form.dateAffectation} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Exécution</label>
              <input name="execution" value={form.execution} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Encadrement</label>
              <input name="encadrement" value={form.encadrement} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Cadres</label>
              <input name="cadres" value={form.cadres} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Cadres Supérieurs</label>
              <input name="cadresSuperieurs" value={form.cadresSuperieurs} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Situation familiale</label>
              <input name="situationFamiliale" value={form.situationFamiliale} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Nombre d’enfants bénéficiaires</label>
              <input
                type="number"
                name="nombreEnfants"
                value={form.nombreEnfants}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Téléphone</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" onClick={handleSubmit}>Enregistrer</button>
            <button onClick={handleSubmitAndReset}>Enregistrer et ajouter un autre</button>
          </div>
        </form>
      </div>
    </>
  )
}
