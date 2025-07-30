import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function DemandeSejour() {
  const navigate = useNavigate()
  const [demandes, setDemandes] = useState([])
  const today = new Date().toLocaleDateString('fr-FR')

useEffect(() => {
  fetch('http://localhost:5000/api/demandes') // Change to your actual API URL
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(data => setDemandes(data))
    .catch(err => console.error('Erreur fetch demandes:', err));
}, []);


  const handleRetour = () => {
    navigate('/admin')
  }

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Matricule',
      'Nom & Prénom',
      "Date d'embauche",
      'NES',
      'Situation F',
      'Choix 1',
      'Période 1',
      'Choix 2',
      'Période 2',
      'Choix 3',
      'Période 3',
      'Type de demande',
      'Statut',
      'Créé le',
      'Modifié le',
    ]

    const rows = demandes.map(d => [
      d.matricule,
      d.nom_complet,
      d.date_affectation_au_bureau || '',
      d.nes || '',
      d.situation_familiale || '',
      d.premier_choix || '',
      d.periode1 || '',
      d.deuxieme_choix || '',
      d.periode2 || '',
      d.troisieme_choix || '',
      d.periode3 || '',
      d.demande_type || '',
      d.statut || '',
      d.cree_le || '',
      d.modifie_le || '',
    ])

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(',')),
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'demandes_sejour.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const title = 'Demandes de séjour reçues - Session Estivale 2025'
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Marsa Maroc / DEPL', pageWidth / 2, 15, { align: 'center' })
    doc.setFontSize(12)
    doc.text(title, pageWidth / 2, 25, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`Date d'impression: ${today}`, 14, 35)

    const headers = [[
      'Matricule',
      'Nom & Prénom',
      "Date d'embauche",
      'NES',
      'Situation F',
      'Choix 1',
      'Période 1',
      'Choix 2',
      'Période 2',
      'Choix 3',
      'Période 3',
      'Type de demande',
      'Statut',
      'Créé le',
      'Modifié le',
    ]]

    const rows = demandes.map(d => [
      d.matricule,
      d.nom_complet,
      d.date_affectation_au_bureau || '',
      (d.nes || '').toString(),
      d.situation_familiale || '',
      d.premier_choix || '',
      d.periode1 || '',
      d.deuxieme_choix || '',
      d.periode2 || '',
      d.troisieme_choix || '',
      d.periode3 || '',
      d.demande_type || '',
      d.statut || '',
      d.cree_le || '',
      d.modifie_le || '',
    ])

    autoTable(doc, {
      startY: 40,
      head: headers,
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [0, 122, 204],
        textColor: 255,
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
      },
      margin: { top: 40, bottom: 20 },
      theme: 'grid',
    })

    doc.save('demandes_sejour.pdf')
  }

  const handleDelete = async (id) => {
  if (!window.confirm('Voulez-vous vraiment supprimer cette demande ?')) return

  try {
    const res = await fetch(`http://localhost:5000/api/demandes/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Erreur lors de la suppression')
    }

    // Update frontend state
    setDemandes(demandes.filter(d => d.id !== id))
  } catch (err) {
    console.error('Erreur suppression:', err)
    alert('Échec de la suppression. Veuillez réessayer.')
  }
}
const handleProcessForms = async () => {
  if (!window.confirm("Voulez-vous vraiment lancer le traitement des demandes ?")) return;

  try {
    // Phase 1: Préparer (changer à 'en traitement')
    const prepareRes = await fetch('http://localhost:5000/api/forms/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!prepareRes.ok) throw new Error('Erreur lors de la préparation des formulaires');

    // Optionally wait a few seconds (if needed)
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec wait

    // Phase 2: Traiter (calcul & note)
    const res = await fetch('http://localhost:5000/api/forms/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Erreur lors du traitement');
    }

    const data = await res.json();
    alert(data.message || 'Traitement terminé');

    // Refresh demandes list
    const demandesRes = await fetch('http://localhost:5000/api/demandes');
    if (!demandesRes.ok) throw new Error('Erreur lors de la récupération des demandes');
    const demandesData = await demandesRes.json();
    setDemandes(demandesData);
  } catch (err) {
    console.error(err);
    alert(`Erreur: ${err.message}`);
  }
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

        .page-wrapper {
          max-width: 1500px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .button-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-bottom: 16px;
        }

        .btn {
          padding: 10px 24px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: white;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, background 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn-retour {
          background-color: #607d8b;
        }

        .btn-pdf {
          background-color: #e53935;
        }

        .btn-csv {
          background-color: #43a047;
        }

        .container {
          padding: 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
          position: relative;
          color: #0b2545;
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

        h1, h2, h3 {
          text-align: center;
          margin: 0 0 5px 0;
        }
        h1 {
          margin-bottom: 0;
          font-weight: 700;
          font-size: 2.5rem;
        }
        h2 {
          margin-top: 5px;
          font-weight: 600;
          font-size: 1.8rem;
        }
        h3 {
          margin-top: 5px;
          margin-bottom: 30px;
          font-weight: 400;
          font-size: 1.2rem;
          color: #3b3b3bdd;
        }

        .info-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 1rem;
          color: #0b2545;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255,255,255,0.8);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        thead tr {
          background-color: #007acc;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
        }

        td, th {
          border: 1px solid #ccc;
          padding: 12px 10px;
          text-align: center;
          font-size: 0.95rem;
        }

        tbody tr:nth-child(even) {
          background-color: #f0f7ff;
        }

        tbody tr:hover {
          background-color: #d0e8ff;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .footer-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          font-size: 0.9rem;
          color: #555;
          font-weight: 600;
        }
           .btn-delete {
    background-color: #e53935; /* red */
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  .btn-delete:hover {
    background-color: #b71c1c;
    transform: scale(1.05);
  }
  .btn-delete:active {
    transform: scale(0.95);
  }
    .btn-process {
  background-color: #1976d2; /* Blue */
  color: white;
}
.btn-process:hover {
  background-color: #115293;
}

      `}</style>

      <div className="page-wrapper">
       <div className="button-row">
  <button className="btn btn-process" onClick={handleProcessForms}>Lancer traitement</button>
  <button className="btn btn-pdf" onClick={handleExportPDF}>Exporter PDF</button>
  <button className="btn btn-csv" onClick={handleExportCSV}>Exporter EXCEL</button>
  <button className="btn btn-retour" onClick={handleRetour}>← Retour</button>
</div>


        <div className="container">
          <h1>Marsa Maroc / DEPL</h1>
          <h2>Demandes de séjour reçues</h2>
          <h3>Session Estivale 2025</h3>

          <div className="info-bar">
            <span>Catégorie : Agent</span>
            <span>Nombre de demandes : {demandes.length}</span>
          </div>
<table>
  <thead>
    <tr>
      <th>Matricule</th>
      <th>Nom & Prénom</th>
      <th>Date d'embauche</th>
      <th>NES</th>
      <th>Situation F</th>
      <th>Choix 1</th>
      <th>Période 1</th>
      <th>Choix 2</th>
      <th>Période 2</th>
      <th>Choix 3</th>
      <th>Période 3</th>
      <th>Type de demande</th>
      <th>Statut</th>
      <th>Créé le</th>
      <th>Modifié le</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {demandes.map((d, i) => (
      <tr key={i}>
        <td>{d.matricule}</td>
        <td>{d.nom_complet}</td>
        <td>{d.date_affectation_au_bureau || ''}</td>
        <td>{d.nes || ''}</td>
        <td>{d.situation_familiale || ''}</td>
        <td>{d.premier_choix || ''}</td>
        <td>{d.periode1 || ''}</td>
        <td>{d.deuxieme_choix || ''}</td>
        <td>{d.periode2 || ''}</td>
        <td>{d.troisieme_choix || ''}</td>
        <td>{d.periode3 || ''}</td>
        <td>{d.demande_type || ''}</td>
        <td>{d.statut || ''}</td>
        <td>{d.cree_le || ''}</td>
        <td>{d.modifie_le || ''}</td>
        <td>
  <button className="btn-delete" onClick={() => handleDelete(d.id)}>Supprimer</button>
</td>

      </tr>
    ))}
  </tbody>
</table>


          <div className="footer-bar">
            <span>Date d'impression : {today}</span>
            <span>Page 1</span>
          </div>
        </div>
      </div>
    </>
  )
}
