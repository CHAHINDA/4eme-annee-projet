import React from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function UserList() {
  const navigate = useNavigate()

  // Empty users array to be filled later with backend data
  const users = []

  const today = new Date().toLocaleDateString('fr-FR')

  const handleRetour = () => {
    navigate('/admin')
  }

  const handleExportCSV = () => {
    const headers = ['Nom complet', 'Matricule', 'Email', 'Rôle', "Date d'affectation"]

    const rows = users.map(user => [
      user.nom || '',
      user.matricule || '',
      user.email || '',
      user.role || '',
      user.dateAffectation || '',
    ])

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(',')),
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'users_list.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Marsa Maroc / DEPL', pageWidth / 2, 15, { align: 'center' })
    doc.setFontSize(12)
    doc.text('Liste des utilisateurs enregistrés', pageWidth / 2, 25, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`Date d'impression: ${today}`, 14, 35)

    const headers = [['Nom complet', 'Matricule', 'Email', 'Rôle', "Date d'affectation"]]

    const rows = users.map(user => [
      user.nom || '',
      user.matricule || '',
      user.email || '',
      user.role || '',
      user.dateAffectation || '',
    ])

    autoTable(doc, {
      startY: 40,
      head: headers,
      body: rows,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 204], textColor: 255, halign: 'center' },
      bodyStyles: { halign: 'center' },
      margin: { top: 40, bottom: 20 },
      theme: 'grid',
    })

    doc.save('users_list.pdf')
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

        .user-list-container {
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

        .user-list-container h2 {
          color: #0b2545;
          margin-bottom: 10px;
          font-size: 2rem;
          text-align: center;
        }

        .user-list-container p {
          margin-bottom: 20px;
          color: #444;
          text-align: center;
        }

        .stats-bar {
          font-weight: bold;
          color: #333;
          margin-bottom: 16px;
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        thead {
          background-color: #007acc;
          color: white;
        }

        th, td {
          padding: 14px 20px;
          text-align: left;
          font-size: 1rem;
        }

        tr:not(:last-child) {
          border-bottom: 1px solid #eee;
        }

        td.actions {
          display: flex;
          gap: 10px;
        }

        .btn-action {
          padding: 6px 14px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-modify {
          background-color: #f0ad4e;
          color: white;
        }

        .btn-modify:hover {
          background-color: #ec971f;
        }

        .btn-delete {
          background-color: #d9534f;
          color: white;
        }

        .btn-delete:hover {
          background-color: #c9302c;
        }

        .empty-row td {
          color: #aaa;
          font-style: italic;
          text-align: center;
        }

        .pagination-info {
          margin-top: 30px;
          text-align: center;
          font-weight: 600;
          color: #666;
        }

      .button-row {
  max-width: 1000px; /* same as .user-list-container */
  margin: 40px auto 0 auto; /* top margin + centered horizontally */
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 40px; /* same horizontal padding as container */
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
      `}</style>
 <div className="button-row">
  <button className="btn btn-pdf" onClick={handleExportPDF}>Exporter PDF</button>
  <button className="btn btn-csv" onClick={handleExportCSV}>Exporter CSV</button>
  <button className="btn btn-retour" onClick={handleRetour}>← Retour</button>
</div>
      <div className="user-list-container">
      

        <h2>Liste des utilisateurs</h2>
        <p>Voici la liste complète des utilisateurs enregistrés.</p>
        <div className="stats-bar">Total utilisateurs : {users.length}</div>

        <table>
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Matricule</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date d'affectation</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="5">Aucun utilisateur enregistré.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.nom}</td>
                  <td>{user.matricule}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.dateAffectation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination-info">Page 1 / 1</div>
      </div>
    </>
  )
}
