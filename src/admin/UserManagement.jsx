import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserManagement() {
  const navigate = useNavigate();
  const { matricule } = useParams();  // get matricule from URL, undefined if add mode
  const isEdit = Boolean(matricule);
  const [form, setForm] = useState({
    nom: '',
    matricule: '',
    dateAffectation: '',
    role: '',
    situationFamiliale: '',
    nombreEnfants: '',
    telephone: '',
    email: '',
    password: '',
  });

  // Load existing user data if editing
  useEffect(() => {
    if (matricule) {
      // Fetch user data from API to populate form
      fetch(`http://localhost:5000/api/users/${matricule}`)
        .then(res => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then(data => {
          setForm({
            nom: data.nom_complet || '',
            matricule: data.matricule || '',
            dateAffectation: data.date_affectation_au_bureau ? data.date_affectation_au_bureau.slice(0, 10) : '',
            role: data.role || '',
            situationFamiliale: data.situation_familiale || '',
            nombreEnfants: data.nombre_enfants_beneficiaires || '',
            telephone: data.telephone || '',
            email: data.email || '',
            password: '', // leave blank for security reasons, only update if changed
          });
        })
        .catch(err => {
          alert("Erreur lors du chargement de l'utilisateur: " + err.message);
          navigate('/admin');
        });
    }
  }, [matricule, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // POST (add) user function
  const postUserToAPI = async () => {
    const method = matricule ? 'PUT' : 'POST'; // PUT to update if editing

    // Prepare body
    const bodyData = {
      nom_complet: form.nom,
      matricule: form.matricule,
      date_affectation_au_bureau: form.dateAffectation,
      role: form.role,
      situation_familiale: form.situationFamiliale,
      nombre_enfants_beneficiaires: form.nombreEnfants,
      telephone: form.telephone,
      email: form.email,
    };

    // Only send password if filled (for editing)
    if (form.password) {
      bodyData.password = form.password;
    }

    try {
      const response = await fetch(
        matricule ? `http://localhost:5000/api/users/${matricule}` : 'http://localhost:5000/api/users',
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${errorText}`);
      }

      return true;
    } catch (error) {
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
      return false;
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = isEdit
      ? `http://localhost:5000/api/users/${matricule}`
      : 'http://localhost:5000/api/users';

    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nom_complet: form.nom,
        matricule: form.matricule,
        date_affectation_au_bureau: form.dateAffectation,
        role: form.role,
        situation_familiale: form.situationFamiliale,
        nombre_enfants_beneficiaires: form.nombreEnfants,
        telephone: form.telephone,
        email: form.email,
        password: form.password || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API: ${errorText}`);
    }

    alert(`Utilisateur ${isEdit ? 'modifié' : 'enregistré'} avec succès.`);

    if (!isEdit) return true; // allow reset only in add mode

    navigate('/admin/users/list');
    return true;
  } catch (err) {
    alert(`Erreur: ${err.message}`);
    return false;
  }
};
const handleSubmitAndReset = async (e) => {
  e.preventDefault();
  const success = await handleSubmit(e);
  if (success && !isEdit) {
    setForm({
      nom: '',
      matricule: '',
      dateAffectation: '',
      role: '',
      situationFamiliale: '',
      nombreEnfants: '',
      telephone: '',
      email: '',
      password: '',
    });
  }
};


  const handleRetour = () => {
    navigate('/admin');
  };

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
          label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
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

      <div className="user-form-container">
      <button className="retour-btn" onClick={handleRetour}>← Retour</button>

      <h2>{isEdit ? 'Modifier utilisateur' : 'Créer un nouveau compte utilisateur'}</h2>
        <form onSubmit={handleSubmit}>
  <div className="form-grid">
    <div className="form-group">
      <label htmlFor="nom">Nom complet</label>
      <input
        id="nom"
        name="nom"
        value={form.nom}
        onChange={handleChange}
        
      />
    </div>

    <div className="form-group">
      <label htmlFor="matricule">Matricule</label>
      <input
        id="matricule"
        name="matricule"
        value={form.matricule}
        onChange={handleChange}
        
        // add disabled={isEdit} if you want to disable matricule editing
      />
    </div>

    <div className="form-group">
      <label htmlFor="dateAffectation">Date d’affectation au bureau</label>
      <input
        id="dateAffectation"
        type="date"
        name="dateAffectation"
        value={form.dateAffectation}
        onChange={handleChange}
      />
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
        name="situationFamiliale"
        value={form.situationFamiliale}
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
      <label htmlFor="nombreEnfants">Nombre d’enfants bénéficiaires</label>
      <input
        id="nombreEnfants"
        type="number"
        name="nombreEnfants"
        value={form.nombreEnfants}
        onChange={handleChange}
        min={0}
      />
    </div>

    <div className="form-group">
      <label htmlFor="telephone">Téléphone</label>
      <input
        id="telephone"
        name="telephone"
        value={form.telephone}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        
      />
    </div>

    <div className="form-group">
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        // required only if adding new user
      />
    </div>
  </div>

  <div className="form-buttons">
    <button type="submit">Enregistrer</button>
    <button type="button" onClick={handleSubmitAndReset}>Ajouter un autre</button>
  </div>
</form>

      </div>
    </>
  )
}
