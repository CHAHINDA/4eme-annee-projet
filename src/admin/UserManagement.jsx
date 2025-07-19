import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserManagement() {
  const navigate = useNavigate()

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

  const handleRetour = () => {
    navigate('/admin')
  }

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

        .user-form-container {
          max-width: 1000px;
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

        .user-form-container h2 {
          color: #0b2545;
          margin-bottom: 30px;
          font-size: 2rem;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
        }

        .form-group:hover {
          transform: rotateX(2deg) translateY(-2px);
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

        .form-buttons {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .form-buttons button {
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .form-buttons button:hover {
          transform: translateY(-3px) scale(1.05);
        }

        .form-buttons button:active {
          transform: scale(0.98);
        }

        .form-buttons button:nth-child(1) {
          background-color: #007acc;
          color: white;
        }

        .form-buttons button:nth-child(2) {
          background-color: #29b6f6;
          color: white;
        }

        .form-buttons button:nth-child(3) {
          background-color: #607d8b;
          color: white;
        }

        @media (max-width: 600px) {
          .form-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="user-form-container">
        <button className="retour-btn" onClick={handleRetour}>← Retour</button>

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
              <input type="number" name="nombreEnfants" value={form.nombreEnfants} onChange={handleChange} />
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
            <button type="button" onClick={handleSubmitAndReset}>Ajouter un autre</button>
          </div>
        </form>
      </div>
    </>
  )
}
