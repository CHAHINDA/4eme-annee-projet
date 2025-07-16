import React from 'react'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'

export default function DemandeSejour() {
  const navigate = useNavigate()

  const demandes = [
    {
      matricule: 'A12345',
      nomPrenom: 'Ali Ben Said',
      dateEmbauche: '2015-06-15',
      nes: 2,
      situationF: 'Marié(e)',
      choix1: 'Agadir',
      periode1: '01/08/2025 au 10/08/2025',
      choix2: 'Essaouira',
      periode2: '12/08/2025 au 20/08/2025',
      choix3: 'Tanger',
      periode3: '22/08/2025 au 30/08/2025',
    },
    {
      matricule: 'B67890',
      nomPrenom: 'Fatima Zahra',
      dateEmbauche: '2019-04-20',
      nes: 1,
      situationF: 'Célibataire',
      choix1: 'Casablanca',
      periode1: '05/08/2025 au 15/08/2025',
      choix2: 'Rabat',
      periode2: '16/08/2025 au 24/08/2025',
      choix3: '',
      periode3: '',
    },
  ]

  const today = new Date().toLocaleDateString('fr-FR')

  const handleRetour = () => {
    navigate('/admin')
  }

  // Export CSV logic
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
    ]

    const rows = demandes.map(d => [
      d.matricule,
      d.nomPrenom,
      d.dateEmbauche,
      d.nes,
      d.situationF,
      d.choix1,
      d.periode1,
      d.choix2,
      d.periode2,
      d.choix3,
      d.periode3,
    ])

    // Compose CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(',')),
    ].join('\r\n')

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'demandes_sejour.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export PDF logic using jsPDF
  const handleExportPDF = () => {
    const doc = new jsPDF()

    const title = 'Demandes de séjour reçues - Session Estivale 2025'
    doc.setFontSize(16)
    doc.text('Marsa Maroc / DEPL', 105, 15, null, null, 'center')
    doc.setFontSize(12)
    doc.text(title, 105, 25, null, null, 'center')
    doc.setFontSize(10)
    doc.text(`Date d'impression: ${today}`, 14, 35)

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
    ]

    // Prepare rows array for jsPDF autoTable
    const rows = demandes.map(d => [
      d.matricule,
      d.nomPrenom,
      d.dateEmbauche,
      d.nes.toString(),
      d.situationF,
      d.choix1,
      d.periode1,
      d.choix2,
      d.periode2,
      d.choix3,
      d.periode3,
    ])

    // Using autoTable plugin for better table formatting
    // But if you don't have autoTable installed, we'll do a simple print instead:
    // We'll print header + rows manually:
    let y = 45
    const lineHeight = 7
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    headers.forEach((header, i) => {
      doc.text(header, 14 + i * 18, y)
    })

    doc.setFont('helvetica', 'normal')
    y += lineHeight

    rows.forEach(row => {
      row.forEach((cell, i) => {
        doc.text(cell || '-', 14 + i * 18, y)
      })
      y += lineHeight
      if (y > 280) {
        doc.addPage()
        y = 15
      }
    })

    doc.save('demandes_sejour.pdf')
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

        .page-wrapper {
          max-width: 1100px;
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
      `}</style>

      <div className="page-wrapper">
        <div className="button-row">
          <button className="btn btn-pdf" onClick={handleExportPDF}>Exporter PDF</button>
          <button className="btn btn-csv" onClick={handleExportCSV}>Exporter CSV</button>
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
              </tr>
            </thead>
            <tbody>
              {demandes.map((d, i) => (
                <tr key={i}>
                  <td>{d.matricule}</td>
                  <td>{d.nomPrenom}</td>
                  <td>{d.dateEmbauche}</td>
                  <td>{d.nes}</td>
                  <td>{d.situationF}</td>
                  <td>{d.choix1}</td>
                  <td>{d.periode1}</td>
                  <td>{d.choix2}</td>
                  <td>{d.periode2}</td>
                  <td>{d.choix3}</td>
                  <td>{d.periode3}</td>
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
