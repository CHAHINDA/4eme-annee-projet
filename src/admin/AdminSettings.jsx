import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminSettings() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    telephone: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Paramètres administrateur mis à jour')
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
          background: linear-gradient(135deg, #e3f2fd, #fce4ec);
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
      `}</style>

      <div className="admin-settings-container">
       

        <h2>Compte administrateur</h2>
        <p>Paramètres et gestion du compte administrateur.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input name="nom" value={form.nom} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} />
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
