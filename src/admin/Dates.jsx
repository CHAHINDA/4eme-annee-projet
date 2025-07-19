import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DatesSettings() {
  const navigate = useNavigate();

  // Use a single form state object for better control
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/periods");
      setPeriods(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des périodes :", error);
    }
  };

  const addPeriod = async (e) => {
    e.preventDefault();

    if (!form.name || !form.startDate || !form.endDate) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/periods", {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      setForm({ name: "", startDate: "", endDate: "" });
      fetchPeriods();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la période :", error);
    }
  };

  const deletePeriod = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/periods/${id}`);
      fetchPeriods();
    } catch (error) {
      console.error("Erreur lors de la suppression de la période :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRetour = () => {
    navigate("/admin");
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

        .container {
          max-width: 700px;
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

        h2 {
          color: #0b2545;
          margin-bottom: 30px;
          font-size: 2rem;
          text-align: center;
        }

        form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          font-size: 1rem;
          border-radius: 12px;
          border: 1px solid #ccc;
          background: white;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 8px rgba(0, 122, 204, 0.4);
          transform: scale(1.03);
        }

        button.add-btn {
          grid-column: 1 / -1;
          background-color: #007acc;
          color: white;
          padding: 14px 0;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, background 0.3s ease;
        }

        button.add-btn:hover {
          transform: translateY(-3px) scale(1.05);
        }

        ul.campaign-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        ul.campaign-list li {
          background: white;
          padding: 12px 20px;
          margin-bottom: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          color: #0b2545;
          font-size: 1rem;
        }

        ul.campaign-list li button {
          background: #ff4d4f;
          border: none;
          color: white;
          padding: 6px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          transition: background 0.3s ease;
        }

        ul.campaign-list li button:hover {
          background: #d9363e;
        }
      `}</style>

      <div className="container">
        <button className="retour-btn" onClick={handleRetour}>
          ← Retour
        </button>

        <h2>Gestion des campagnes</h2>

        <form onSubmit={addPeriod}>
          <div>
            <label>Nom de la campagne</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date de début</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date de fin</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <button className="add-btn" type="submit">
            Ajouter la campagne
          </button>
        </form>
<ul className="campaign-list">
  {periods.length === 0 ? (
    <li>Aucune campagne ajoutée</li>
  ) : (
    [...periods]
      .slice()   // create shallow copy
      .reverse() // reverse so newest added shows first
      .map((period) => (
        <li key={period.id}>
          {period.name} — du{" "}
          {new Date(period.startDate).toLocaleDateString("fr-FR")} au{" "}
          {new Date(period.endDate).toLocaleDateString("fr-FR")}
          <button onClick={() => deletePeriod(period.id)}>Supprimer</button>
        </li>
      ))
  )}
</ul>


      </div>
    </>
  );
}
