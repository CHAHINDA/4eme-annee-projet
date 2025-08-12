import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function BeneficiairesList() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('fr-FR')
  const [beneficiaries, setBeneficiaries] = useState([])

function formatPeriod(start, end) {
  if (!start || !end) return ''
  try {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const s = new Date(start).toLocaleDateString('fr-FR', options)
    const e = new Date(end).toLocaleDateString('fr-FR', options)
    return `${s} - ${e}`
  } catch {
    return ''
  }
}

useEffect(() => {
  fetch('http://localhost:5000/api/demandes')
    .then(res => res.json())
    .then(data => {
      console.log('API data:', data)

      const filtered = data.filter(d => d.statut?.toLowerCase() === 'valide')
      console.log('Filtered valid:', filtered)

      const rows = []
      filtered.forEach(d => {
        if (d.premier_choix && d.periode1) {
          rows.push({
            mat: d.matricule,
            nomPrenom: d.nom_complet,
            centreAffecte: d.premier_choix,
            periodeAffectee: d.periode1,
          })
        }
        if (d.deuxieme_choix && d.periode2) {
          rows.push({
            mat: d.matricule,
            nomPrenom: d.nom_complet,
            centreAffecte: d.deuxieme_choix,
            periodeAffectee: d.periode2,
          })
        }
        if (d.troisieme_choix && d.periode3) {
          rows.push({
            mat: d.matricule,
            nomPrenom: d.nom_complet,
            centreAffecte: d.troisieme_choix,
            periodeAffectee: d.periode3,
          })
        }
      })

      console.log('Final rows:', rows)
      setBeneficiaries(rows)
    })
    .catch(err => {
      console.error('Fetch error:', err)
      setBeneficiaries([])
    })
}, [])




  const handleRetour = () => navigate('/admin')

  const handleExportCSV = () => {
    const headers = ['Mat', 'Nom et Prénom', 'Centre affecté', 'Période affectée']
    const rows = beneficiaries.map(b => [b.mat, b.nomPrenom, b.centreAffecte, b.periodeAffectee])
    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map(row => row.map(f => `"${f}"`).join(';'))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `beneficiaires_${today.replace(/\//g, '-')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFontSize(16)
    doc.text('LISTE DE BENEFICIAIRES', pageWidth / 2, 15, { align: 'center' })
    doc.setFontSize(12)
    doc.text('Catégorie : Agent | Port : DEPL', pageWidth / 2, 22, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`Date d'impression: ${today}`, 14, 30)

    autoTable(doc, {
      startY: 35,
      head: [['Mat', 'Nom et Prénom', 'Centre affecté', 'Période affectée']],
      body: beneficiaries.map(b => [b.mat, b.nomPrenom, b.centreAffecte, b.periodeAffectee]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 204], textColor: 255, halign: 'center' },
      bodyStyles: { halign: 'center' },
      margin: { top: 35, bottom: 20 },
      theme: 'grid',
    })
    doc.save(`beneficiaires_${today.replace(/\//g, '-')}.pdf`)
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

        h1 {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        h2 {
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 24px;
        }

        hr {
          border-top: 2px solid #000;
          margin: 12px 0;
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
          padding: 10px;
          text-align: center;
          font-size: 0.95rem;
        }

        tbody tr:nth-child(even) {
          background-color: #f0f7ff;
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
          <hr />
          <h1>LISTE DE BENEFICIAIRES</h1>
          <h2>Catégorie : Agent | Port : DEPL</h2>
          <p style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}>
            Nombre de bénéficiaires : {beneficiaries.length}
          </p>
          <hr />

          <table>
            <thead>
              <tr>
                <th>Mat</th>
                <th>Nom et Prénom</th>
                <th>Centre affecté</th>
                <th>Période affectée</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Table vide
                  </td>
                </tr>
              ) : (
                beneficiaries.map((b, idx) => (
                  <tr key={idx}>
                    <td>{b.mat}</td>
                    <td>{b.nomPrenom}</td>
                    <td>{b.centreAffecte}</td>
                    <td>{b.periodeAffectee}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="footer-bar">
            <span>Date d'aujourd'hui : {today}</span>
            <span>Page 1</span>
          </div>
        </div>
      </div>
    </>
  )
}
