import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function AffectationHistorique() {
  const navigate = useNavigate()
  const today = new Date()
  const todayStr = today.toLocaleDateString('fr-FR')

  const currentYear = today.getFullYear()
  const year1 = currentYear - 2
  const year2 = currentYear - 1
  const col1 = `A${year1.toString().slice(-2)}`
  const col2 = `A${year2.toString().slice(-2)}`

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch('http://localhost:5000/api/forms/historique')
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
        const data = await res.json()

        if (!Array.isArray(data)) {
          throw new Error('Les données reçues ne sont pas un tableau')
        }

        data.sort((a, b) => {
          const noteA = Number(a.note)
          const noteB = Number(b.note)
          if (isNaN(noteA)) return 1
          if (isNaN(noteB)) return -1
          return noteB - noteA
        })

        setRecords(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalPages = Math.ceil(records.length / recordsPerPage)
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord)

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))

  const handleRetour = () => navigate('/admin')

  const handleExportCSV = () => {
    const headers = ['Rank', 'Mat', 'Nom', 'Situation', 'Nbr. Enfant', 'An. Recrut.', col1, col2, 'Note']

    const rows = records.map((r, idx) => [
      idx + 1,
      r.matricule || '',
      r.nom_complet || '',
      r.situation_familiale || '',
      r.nombre_enfants_beneficiaires ?? '',
      r.date_affectation_au_bureau ? new Date(r.date_affectation_au_bureau).getFullYear() : '',
      r[col1] ?? '',
      r[col2] ?? '',
      r.note ?? '-',
    ])

    const escapeCSV = val => `"${String(val).replace(/"/g, '""')}"`
    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map(row => row.map(escapeCSV).join(';'))].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `historique_affectation_${todayStr.replace(/\//g, '-')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text("ETAT D'HISTORIQUE D'AFFECTATION", pageWidth / 2, 15, { align: 'center' })
    doc.setFontSize(10)
    doc.text('Port : DEPL', pageWidth / 2, 22, { align: 'center' })
    doc.text(`Date d'impression: ${todayStr}`, 14, 30)

    const headers = [['Rank', 'Mat', 'Nom', 'Situation', 'Nbr. Enfant', 'An. Recrut.', col1, col2, 'Note']]

    const rows = records.map((r, idx) => [
      idx + 1,
      r.matricule || '',
      r.nom_complet || '',
      r.situation_familiale || '',
      r.nombre_enfants_beneficiaires ?? '',
      r.date_affectation_au_bureau ? new Date(r.date_affectation_au_bureau).getFullYear() : '',
      r[col1] === '✔️' ? 'oui' : '',
      r[col2] === '✔️' ? 'oui' : '',
      r.note ?? '-',
    ])

    autoTable(doc, {
      startY: 35,
      head: headers,
      body: rows,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 204], textColor: 255, halign: 'center' },
      bodyStyles: { halign: 'center' },
      margin: { top: 35, bottom: 20 },
      theme: 'grid',
    })

    doc.save(`historique_affectation_${todayStr.replace(/\//g, '-')}.pdf`)
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
    <h1>ETAT D'HISTORIQUE D'AFFECTATION</h1>
    <h2>Port : DEPL</h2>
    <hr />

    {loading ? (
      <p style={{ textAlign: 'center', padding: 20 }}>Chargement...</p>
    ) : error ? (
      <p style={{ textAlign: 'center', color: 'red', padding: 20 }}>Erreur: {error}</p>
    ) : records.length === 0 ? (
      <p style={{ textAlign: 'center', padding: 20, fontStyle: 'italic', color: '#555' }}>
        Aucun enregistrement trouvé — table vide.
      </p>
    ) : (
      <>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Mat</th>
              <th>Nom</th>
              <th>Situation</th>
              <th>Nbr. Enfant</th>
              <th>An. Recrut.</th>
              <th>{col1}</th>
              <th>{col2}</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((rec, idx) => (
              <tr key={rec.matricule || idx}>
                <td>{indexOfFirstRecord + idx + 1}</td>
                <td>{rec.matricule || ''}</td>
                <td>{rec.nom_complet || ''}</td>
                <td>{rec.situation_familiale || ''}</td>
                <td>{rec.nombre_enfants_beneficiaires ?? ''}</td>
                <td>
                  {rec.date_affectation_au_bureau
                    ? new Date(rec.date_affectation_au_bureau).getFullYear()
                    : ''}
                </td>
                <td>{rec[col1] ?? ''}</td>
                <td>{rec[col2] ?? ''}</td>
                <td>{rec.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination with clickable numbers */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {[...Array(totalPages).keys()].map(n => {
            const pageNum = n + 1
            const isActive = currentPage === pageNum
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className="btn"
                style={{
                  margin: '0 5px',
                  backgroundColor: isActive ? '#1976d2' : '#ccc',
                  color: isActive ? 'white' : 'black',
                  fontWeight: isActive ? '700' : '400',
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 0 8px #1976d2' : 'none',
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  userSelect: 'none',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 10, textAlign: 'center', fontWeight: 600 }}>
          Page {currentPage} / {totalPages}
        </div>

        <div className="footer-bar">
          <span>Date d'impression : {today.toLocaleDateString('fr-FR')}</span>
          <span>Page {currentPage}</span>
        </div>
      </>
    )}
  </div>
</div>

    </>
  )
}